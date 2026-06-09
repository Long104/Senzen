package handlers

import (
	"log"

	// "fmt"
	// "log"
	// "time"
	//
	"github.com/gofiber/fiber/v2"
	// "github.com/golang-jwt/jwt/v4"
	// "golang.org/x/crypto/bcrypt"

	"github.com/long104/Senzen/models"
	"gorm.io/gorm"
)

// gorm.Model

func GetPlanByID(db *gorm.DB, c *fiber.Ctx) error {
	planID := c.Params("id")
	userID := c.Locals("user_id") // from JWT
	var plan models.Plan

	if err := db.Preload("Transactions.Category").Where("user_id = ? AND id = ?", userID, planID).First(&plan, planID).Error; err != nil {
		// if err := db.Preload(clause.Associations).First(&plan, planId).Error; err != nil {
		// if err := db.First(&plan, planId).Error; err != nil {
		log.Println("Error fetching plan:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot fetch plan"})
	}

	return c.JSON(plan)
}

func GetPlans(db *gorm.DB, c *fiber.Ctx) error {
	userID := c.Locals("user_id") // from JWT
	var plans []models.Plan

	if err := db.Where("user_id = ?", userID).Find(&plans).Error; err != nil {
		log.Println("Error fetching plans:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot fetch plans"})
	}

	return c.JSON(plans)
}

// createCategory creates a new category
func CreatePlan(db *gorm.DB, c *fiber.Ctx) error {
	plan := new(models.Plan)
	if err := c.BodyParser(plan); err != nil {
		log.Println("Error parsing request body:", err) // Log parsing error
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Force user_id from JWT, ignore whatever client sent
	plan.UserID = int64(c.Locals("user_id").(uint))

	if err := db.Create(plan).Error; err != nil {
		log.Println("Error saving plan to database:", err) // Log database error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not save plan"})
	}

	// db.Create(plan)
	return c.JSON(plan)
}

// updateCategory updates a category by id
func UpdatePlan(db *gorm.DB, c *fiber.Ctx) error {
	id := c.Params("id")
	plan := new(models.Plan)
	db.First(plan, id)

	if err := c.BodyParser(plan); err != nil {
		log.Println("Error parsing request body:", err) // Log parsing error
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}
	// db.Save(plan)

	if err := db.Save(plan).Error; err != nil {
		log.Println("Error saving plan to database:", err) // Log database error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not save plan"})
	}
	return c.JSON(plan)
}

// deleteCategory deletes a category by id
func DeletePlan(db *gorm.DB, c *fiber.Ctx) error {
	id := c.Params("id")
	userID := c.Locals("user_id") // from JWT

	// Verify the plan belongs to the logged-in user
	var plan models.Plan
	if err := db.Where("user_id = ? AND id = ?", userID, id).First(&plan).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Plan not found"})
	}

	if err := db.Where("plan_id = ?", id).Delete(&models.Transaction{}).Error; err != nil {
		log.Println("Error deleting transactions:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete transactions"})
	}

	if err := db.Where("plan_id = ?", id).Delete(&models.Budget{}).Error; err != nil {
		log.Println("Error deleting budgets:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete budgets"})
	}

	if err := db.Where("plan_id = ?", id).Delete(&models.Category{}).Error; err != nil {
		log.Println("Error deleting categorys:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete category"})
	}

	if err := db.Unscoped().Delete(&models.Plan{}, id).Error; err != nil {
		log.Println("Error deleting category from database:", err) // Log database error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delete plan"})
	}

	// if err := db.Unscoped().Where("id = ?", id).Delete(&models.Plan{}).Error; err != nil {
	// 	return fmt.Errorf("failed to soft delete plan: %w", err)
	// }
	return c.JSON(fiber.Map{"sucess": "delete sucess"})
}
