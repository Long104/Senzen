package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/models"
)

// loginUser handles user in

func GetUsers(c *fiber.Ctx) error {
	var users []models.User
	config.DB.Find(&users)
	return c.JSON(users)
}

func GetUser(c *fiber.Ctx) error {
    userID := c.Locals("user_id") // from JWT
    var user models.User

    if err := config.DB.First(&user, userID).Error; err != nil {
        log.Println("Error fetching user:", err)
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot fetch user"})
    }

    return c.JSON(user)
}

// createBook creates a new book

// updateBook updates a book by id
func UpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")
	user := new(models.User)
	config.DB.First(&user, id)
	if err := c.BodyParser(user); err != nil {
		return err
	}
	config.DB.Save(&user)
	return c.JSON(user)
}

// deleteBook deletes a book by id
func DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	config.DB.Delete(&models.User{}, id)
	return c.SendString("Book successfully deleted")
}
