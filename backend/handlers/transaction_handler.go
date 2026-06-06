package handlers

import (
	// "fmt"
	// "log"

	"log"
	"strconv"

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

func UpdateTransaction(c *fiber.Ctx) error {
	id := c.Params("id")
	var transaction models.Transaction
	if err := config.DB.First(&transaction, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Transaction not found"})
	}
	if err := c.BodyParser(&transaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := config.DB.Save(&transaction).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot update transaction"})
	}
	return c.JSON(transaction)
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
