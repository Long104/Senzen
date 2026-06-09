package controllers

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/models"
)

func GoogleLogin(c *fiber.Ctx) error {
	url := config.AppConfig.GoogleLoginConfig.AuthCodeURL("randomstate")
	return c.Redirect(url)
}

func GoogleCallback(c *fiber.Ctx) error {
	state := c.Query("state")
	if state != "randomstate" {
		return c.SendString("States don't Match!!")
	}

	code := c.Query("code")

	googlecon := config.GoogleConfig()

	token, err := googlecon.Exchange(context.Background(), code)
	if err != nil {
		return c.SendString("Code-Token Exchange Failed")
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		return c.SendString("User Data Fetch Failed")
	}

	userData, err := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		return c.SendString("JSON Parsing Failed")
	}

	var user map[string]interface{}
	if err := json.Unmarshal(userData, &user); err != nil {
		return c.SendString("Failed to parse JSON")
	}

	userName, ok := user["name"].(string)
	if !ok {
		return c.SendString("Invalid user name type")
	}

	userEmail, ok := user["email"].(string)
	if !ok {
		return c.SendString("Invalid user email type")
	}

	// Find or create user
	var userDatabase models.User
	result := config.DB.Where("email = ?", userEmail).First(&userDatabase)
	if result.RowsAffected == 0 {
		userDatabase = models.User{Name: userName, Email: userEmail}
		if err := config.DB.Create(&userDatabase).Error; err != nil {
			return c.SendString("Failed to create user")
		}
	}

	// Generate JWT
	appToken := jwt.New(jwt.SigningMethodHS256)
	claims := appToken.Claims.(jwt.MapClaims)
	claims["user_id"] = userDatabase.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	claims["name"] = userName
	claims["email"] = userEmail

	t, err := appToken.SignedString([]byte(os.Getenv("jwtSecretKey")))
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

	return c.Redirect(os.Getenv("FRONTEND_URL") + "/home")
}
