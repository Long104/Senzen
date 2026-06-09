package controllers

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/models"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return err
	}

	// Check if the user already exists
	var existingUser models.User
	if err := config.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return c.JSON(fiber.Map{"message": "email already exists", "success": false})
	}

	// Encrypt the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	// Create user
	if err := config.DB.Create(&user).Error; err != nil {
		log.Fatalf("Error creating user: %v", err)
	}

	fmt.Println("userrrrrrrrrrrrrrr",user)

	return c.JSON(fiber.Map{"message": "user login success", "success": true, "user": user})
}

func LoginUser(c *fiber.Ctx) error {
	var input models.User
	if err := c.BodyParser(&input); err != nil {
		return err
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// Generate JWT token
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	claims["email"] = user.Email
	claims["name"] = user.Name

	t, err := token.SignedString([]byte(os.Getenv("jwtSecretKey")))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// Set cookie
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    t,
		Path:     "/",
		Expires:  time.Now().Add(time.Hour * 72),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})

	return c.JSON(fiber.Map{"token": t, "message": "success"})
}

func LogoutUser(c *fiber.Ctx) error {
	// Clear the JWT cookie
	c.ClearCookie("jwt")
	return c.JSON(fiber.Map{"message": "Successfully logged out"})
}
