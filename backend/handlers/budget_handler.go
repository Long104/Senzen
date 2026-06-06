package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/models"
)

func CreateBudget(c *fiber.Ctx) error {
	budget := new(models.Budget)
	if err := c.BodyParser(budget); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := config.DB.Create(&budget).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot create budget"})
	}
	return c.Status(fiber.StatusCreated).JSON(budget)
}

func GetBudget(c *fiber.Ctx) error {
	id := c.Params("id")
	var budget models.Budget
	if err := config.DB.First(&budget, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Budget not found"})
	}
	return c.JSON(budget)
}

func UpdateBudget(c *fiber.Ctx) error {
	id := c.Params("id")
	var budget models.Budget
	if err := config.DB.First(&budget, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Budget not found"})
	}
	if err := c.BodyParser(&budget); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	if err := config.DB.Save(&budget).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot update budget"})
	}
	return c.JSON(budget)
}

func DeleteBudget(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := config.DB.Delete(&models.Budget{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot delete budget"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
