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
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func GoogleLogin(c *fiber.Ctx) error {
	url := config.AppConfig.GoogleLoginConfig.AuthCodeURL("randomstate")

	c.Status(fiber.StatusSeeOther)
	c.Redirect(url)
	return c.JSON(url)
}

func GoogleCallback(c *fiber.Ctx) error {
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold: time.Second, // Slow SQL threshold
			LogLevel:      logger.Info, // Log level
			Colorful:      true,        // Enable color
		},
	)
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Bangkok", os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: newLogger})
	if err != nil {
		panic("failed to connect to database")
	}

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
	if err != nil {
		return c.SendString("JSON Parsing Failed")
	}

	fmt.Println(userData)

	var user map[string]interface{}
	// var user database.User
	if err := json.Unmarshal(userData, &user); err != nil {
		return c.SendString("Failed to parse JSON")
	}

	fmt.Printf("user[\"id\"]: %v, type: %T\n", user["id"], user["id"])
	// userIDFloat, ok := user["id"].(float64)
	// if !ok {
	// 	return c.SendString("Invalid user ID type")
	// }
	//  userID := int64(userIDFloat) // Convert float64 to int64

	// userIDStr, ok := user["id"].(string)
	// if !ok {
	// 	return c.SendString("Invalid user ID type")
	// }
	// userID, err := strconv.ParseInt(userIDStr, 10, 64)
	// if err != nil {
	// 	return c.SendString("User ID conversion to int64 failed")
	// }

	userName, ok := user["name"].(string)
	if !ok {
		return c.SendString("Invalid user name type")
	}

	userEmail, ok := user["email"].(string)
	if !ok {
		return c.SendString("Invalid user email type")
	}

	// Create a new user
	db.Create(&models.User{Name: userName, Email: userEmail})

	var userDatabase models.User

	res := db.Where("email = ?", userEmail).First(&userDatabase)

	if res.RowsAffected == 0 {
		db.Create(&models.User{Name: userName, Email: userEmail})
	}

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
		Name:    "jwt",
		Value:   t,
		Expires: time.Now().Add(time.Hour * 72),
		// HTTPOnly: true,
		HTTPOnly: false,
	})

	// return c.SendString(string(userData))
	// return c.Redirect("http://localhost:3000/home")
	return c.Redirect(os.Getenv("FRONTEND_URL") + "/home")
}
