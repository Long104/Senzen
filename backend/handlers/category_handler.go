package handlers

import (
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/models"
)

func CreateCategory(c *fiber.Ctx) error {
	category := new(models.Category)
	if err := c.BodyParser(category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	// Force user_id from JWT, ignore whatever client sent
	category.UserID = int64(c.Locals("user_id").(uint))

	if err := config.DB.Create(&category).Error; err != nil {
		// return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot create category"})
		return c.JSON(fiber.Map{"error": "Cannot create duplicate category"})
	}
	return c.Status(fiber.StatusCreated).JSON(category)
}

func GetCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	var category models.Category
	if err := config.DB.First(&category, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}
	return c.JSON(category)
}

func GetCategories(c *fiber.Ctx) error {
	// Retrieve query parameters from the request
	planIDStr := c.Query("plan_id")
	userID := c.Locals("user_id") // from JWT, not query param

	// Validate parameters
	if planIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing plan_id"})
	}

	planID, err := strconv.Atoi(planIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid plan_id"})
	}

	// Query the database for categories that match the user_id and plan_id
	var categories []models.Category
	if err := config.DB.Where("user_id = ? AND plan_id = ?", userID, planID).Find(&categories).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch categories"})
	}

	// If no categories are found, return a 404 error
	if len(categories) == 0 {
		// return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No categories found for the specified user and plan"})
		return c.JSON(fiber.Map{"error": "No categories found for the specified user and plan"})
	}

	// Return the filtered categories as a JSON response
	return c.Status(fiber.StatusOK).JSON(categories)
}

func UpdateCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	var category models.Category
	if err := config.DB.First(&category, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Category not found"})
	}
	if err := c.BodyParser(&category); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := config.DB.Save(&category).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot update category"})
	}
	return c.JSON(category)
}

func DeleteCategory(c *fiber.Ctx) error {
	// Retrieve query parameters from the request
	planIDStr := c.Query("plan_id")
	categoryIDStr := c.Query("category_id")
	userID := c.Locals("user_id") // from JWT, not query param

	// Validate parameters
	if planIDStr == "" || categoryIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing plan_id or category_id"})
	}

	planID, err := strconv.Atoi(planIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid plan_id"})
	}

	categoryID, err := strconv.Atoi(categoryIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid category_id"})
	}

	// Query the database for categories that match the user_id and plan_id
	var categories models.Category

	if err := config.DB.Where("category_id = ?", categoryID).Delete(&models.Transaction{}).Error; err != nil {
		log.Println("Error deleting transactions:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot delete related transactions"})
	}

	if err := config.DB.Where("user_id = ? AND plan_id = ? AND id = ?", userID, planID, categoryID).Delete(&models.Category{}).Error; err != nil {
		log.Println("Error delete plan to database:", err) // Log database error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot delete category"})
	}

	// If no categories are found, return a 404 error

	// Return the filtered categories as a JSON response
	return c.Status(fiber.StatusOK).JSON(categories)
}
