package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/long104/SenZen/config"
	"github.com/long104/SenZen/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func GithubLogin(c *fiber.Ctx) error {
	url := config.AppConfig.GitHubLoginConfig.AuthCodeURL("randomstate")

	c.Status(fiber.StatusSeeOther)
	c.Redirect(url)
	return c.JSON(url)
}

func GithubCallback(c *fiber.Ctx) error {
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold: time.Second, // Slow SQL threshold
			LogLevel:      logger.Info, // Log level
			Colorful:      true,        // Enable color
		},
	)
	db, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{Logger: newLogger})
	if err != nil {
		panic("failed to connect to database")
	}

	state := c.Query("state")
	if state != "randomstate" {
		return c.SendString("States don't Match!!")
	}

	code := c.Query("code")

	githubcon := config.GithubConfig()
	fmt.Println(code)

	token, err := githubcon.Exchange(context.Background(), code)
	if err != nil {
		return c.SendString("Code-Token Exchange Failed")
	}
	fmt.Println(token)

	// Set up a new HTTP request with the access token in the header
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		return c.SendString("Failed to create request")
	}
	// Add Authorization header with Bearer token
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.SendString("User Data Fetch Failed")
	}
	defer resp.Body.Close() // Close the response body

	userData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.SendString("JSON Parsing Failed")
	}

	var user map[string]interface{}
	if err := json.Unmarshal(userData, &user); err != nil {
		return c.SendString("Failed to parse JSON")
	}

	//  	userID, ok := user["id"].(int64)
	// if !ok {
	// 	return c.SendString("Invalid user ID type")
	// }

	userName, ok := user["login"].(string)
	if !ok {
		return c.SendString("Invalid user name type")
	}

	userEmail, ok := user["html_url"].(string)
	if !ok {
		return c.SendString("Invalid user email type")
	}

	var userDatabase models.User

	res := db.Where("email = ?", userEmail).First(&userDatabase)

	if res.RowsAffected == 0 {
		db.Create(&models.User{Name: userName, Email: userEmail})
	}

	// fmt.Println(user["login"]) // Access the "login" field

	appToken := jwt.New(jwt.SigningMethodHS256)
	claims := appToken.Claims.(jwt.MapClaims)
	// claims["user_id"] = user["id"]
	claims["user_id"] = userDatabase.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	claims["role"] = "admin"
	claims["name"] = userName
	claims["email"] = userEmail
	// claims["role"] = "memeber"

	t, err := appToken.SignedString([]byte(os.Getenv("jwtSecretKey")))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	// Set cookie
	c.Cookie(&fiber.Cookie{
		// Name:    "jwt",
		// Value:   t,
		// Path:    "/",
		// // Domain:  "cashwise.com",
		// Domain:  "https://senzen-frontend.vercel.app",
		// Expires: time.Now().Add(time.Hour * 72),
		// // Secure:  false,
		// // HTTPOnly: true,
		// HTTPOnly: false,
		// SameSite: "Lax",

		Name:     "jwt",
		Value:    t,
		Path:     "/",
		Expires:  time.Now().Add(time.Hour * 72),
		HTTPOnly: false,
		SameSite: "Lax",
		Secure:   true,
	})

	// return c.SendString(string(userData))
	// return c.Redirect("http://localhost:3000/")
	// return c.Redirect("http://localhost:3000/home")
	// Redirect with token as URL parameter since cookie won't work cross-origin
	return c.Redirect(os.Getenv("FRONTEND_URL") + "/home?token=" + t)
}
