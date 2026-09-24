package handlers

import (
	// "fmt"
	// "log"

	"bytes"
	"encoding/csv"
	"log"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/models"
)

// gorm.Model

func CreateTransaction(c *fiber.Ctx) error {
	transaction := new(models.Transaction)
	if err := c.BodyParser(transaction); err != nil {
		log.Println("Error parsing request body:", err) // Log parsing error
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	// Owner comes from the JWT, never the body
	if userID, ok := c.Locals("user_id").(uint); ok {
		transaction.UserID = int64(userID)
	}

	if err := config.DB.Create(&transaction).Error; err != nil {

		log.Println("Error saving plan to database:", err) // Log database error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot create transaction"})
	}

	if err := config.DB.Model(&models.Transaction{}).Preload("Category").First(&transaction, transaction.ID).Error; err != nil {
		log.Println("Error get plan to database:", err) // Log database error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot create transaction"})
	}

	return c.Status(fiber.StatusCreated).JSON(transaction)
}

// ExportUserTransactions streams the signed-in user's full history as CSV —
// data ownership, no row limit.
func ExportUserTransactions(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var transactions []models.Transaction
	if err := config.DB.
		Where("user_id = ?", userID).
		Order("transaction_date DESC").
		Find(&transactions).Error; err != nil {
		log.Println("Error exporting transactions:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot export transactions"})
	}

	var buf bytes.Buffer
	w := csv.NewWriter(&buf)
	_ = w.Write([]string{"id", "date", "amount", "category", "note", "plan_id"})
	for _, t := range transactions {
		planID := ""
		if t.PlanID != nil {
			planID = strconv.FormatInt(*t.PlanID, 10)
		}
		_ = w.Write([]string{
			strconv.FormatInt(t.ID, 10),
			t.TransactionDate.Format(time.RFC3339),
			strconv.FormatFloat(t.Amount, 'f', -1, 64),
			t.CategoryName,
			t.Description,
			planID,
		})
	}
	w.Flush()

	c.Set("Content-Type", "text/csv")
	c.Set("Content-Disposition", "attachment; filename=senzen-expenses.csv")
	return c.Send(buf.Bytes())
}

// DeleteUserTransaction deletes one of the signed-in user's expenses by id
// (works with or without a plan).
func DeleteUserTransaction(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	id := c.Params("id")
	if err := config.DB.
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&models.Transaction{}).Error; err != nil {
		log.Println("Error deleting transaction:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot delete transaction"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

// GetUserTransactions returns every expense owned by the signed-in user
// (across all plans), newest first — the home feed.
func GetUserTransactions(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var transactions []models.Transaction
	if err := config.DB.
		Preload("Category").
		Where("user_id = ?", userID).
		Order("transaction_date DESC").
		Limit(300).
		Find(&transactions).Error; err != nil {
		log.Println("Error fetching transactions:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot fetch transactions"})
	}

	return c.JSON(transactions)
}

func GetTransaction(c *fiber.Ctx) error {
	id := c.Params("id")
	var transaction models.Transaction
	if err := config.DB.Preload("Category").First(&transaction, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Transaction not found"})
	}
	return c.JSON(transaction)
}

func GetPlanTransactions(c *fiber.Ctx) error {
	planId := c.Params("planId")
	var transactions []models.Transaction

	if err := config.DB.Where("plan_id = ?", planId).Find(&transactions).Error; err != nil {
		log.Println("Error fetching transactions:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot fetch transactions"})
	}

	return c.JSON(transactions)
}

// UpdateUserTransaction edits one of the signed-in user's expenses by id —
// amount, note, or category (owner, plan and date stay untouched).
func UpdateUserTransaction(c *fiber.Ctx) error {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	id := c.Params("id")
	var transaction models.Transaction
	if err := config.DB.
		Where("id = ? AND user_id = ?", id, userID).
		First(&transaction).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Transaction not found"})
	}

	// Partial update: only accept the fields the edit dialog owns.
	var body struct {
		Amount       *float64 `json:"amount"`
		Description  *string  `json:"description"`
		CategoryName *string  `json:"category_name"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if body.Amount != nil {
		transaction.Amount = *body.Amount
	}
	if body.Description != nil {
		transaction.Description = *body.Description
	}
	if body.CategoryName != nil {
		transaction.CategoryName = *body.CategoryName
		transaction.CategoryID = nil // category_name is the person-centric source of truth
	}

	if err := config.DB.Save(&transaction).Error; err != nil {
		log.Println("Error updating transaction:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot update transaction"})
	}

	var fresh models.Transaction
	if err := config.DB.Preload("Category").First(&fresh, transaction.ID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot update transaction"})
	}

	return c.JSON(fresh)
}

// func DeleteTransaction(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	if err := config.DB.Delete(&models.Transaction{}, id).Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot delete transaction"})
// 	}
// 	return c.SendStatus(fiber.StatusNoContent)
// }

func DeleteTransaction(c *fiber.Ctx) error {
	// Retrieve query parameters from the request
	planIDStr := c.Query("plan_id")
	transactionIDStr := c.Query("transaction_id")

	// Validate parameters
	if transactionIDStr == "" || planIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing user_id or plan_id"})
	}

	planID, err := strconv.Atoi(planIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid plan_id"})
	}

	transactionID, err := strconv.Atoi(transactionIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid category_id"})
	}

	// Query the database for categories that match the user_id and plan_id
	var transaction models.Transaction

	if err := config.DB.Where("plan_id = ? AND id = ?", planID, transactionID).Delete(transaction).Error; err != nil {
		log.Println("Error delete plan to database:", err) // Log database error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot delete transaction"})
	}

	// If no categories are found, return a 404 error

	// Return the filtered categories as a JSON response
	return c.Status(fiber.StatusOK).JSON(transaction)
}
