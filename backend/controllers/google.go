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
	db, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{Logger: newLogger})
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
	// result := db.Create(&models.User{Name: userName, Email: userEmail})
	// if result.Error != nil {
	// 	return c.JSON(map[string]any{
	// 		"Status": http.StatusInternalServerError,
	// 		"Error":  result.Error,
	// 	})
	// }

	var userDatabase models.User

	res := db.Where("email = ?", userEmail).First(&userDatabase)

	if res.RowsAffected == 0 {
		// result := db.Create(&models.User{Name: userName, Email: userEmail})
		db.Create(&models.User{Name: userName, Email: userEmail})
		// if result.Error != nil {
		// 	return c.JSON(map[string]any{
		// 		"Status": http.StatusInternalServerError,
		// 		"Error":  result.Error,
		// 	})
		// }
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
		Name:     "jwt",
		Value:    t,
		Path:     "/",
		Expires:  time.Now().Add(time.Hour * 72),
		HTTPOnly: false,
		SameSite: "Lax",
		Secure:   true, // required for HTTPS
	})

	// return c.SendString(string(userData))
	// return c.Redirect("http://localhost:3000/home")

	fmt.Print("ip is dddddddddddddddddddddddddddddd", c.IP())
	// log.Print("ip is dddddddddddddddddddddddddddddd", c.IP())
	// return c.JSON(fiber.Map{
	// 	"message": "Cookie set",
	// 	"token":   t,
	// })

	// Redirect with token as URL parameter since cookie won't work cross-origin
	return c.Redirect(os.Getenv("FRONTEND_URL") + "/home?token=" + t)
	// return c.Redirect(os.Getenv("FRONTEND_URL") + "/sign-in")
// return c.Type("html").SendString(`
// 	<!DOCTYPE html>
// 	<html lang="en">
// 	<head>
// 		<meta charset="UTF-8">
// 		<title>Redirecting...</title>
// 	</head>
// 	<body>
// 		<p>Redirecting to frontend...</p>
// 		<script>
// 			window.location.href = "https://frontend.pantorn.me/home";
// 		</script>
// 	</body>
// 	</html>
// `)
}
