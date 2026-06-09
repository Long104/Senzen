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

func GithubLogin(c *fiber.Ctx) error {
	url := config.AppConfig.GitHubLoginConfig.AuthCodeURL("randomstate")
	return c.Redirect(url)
}

func GithubCallback(c *fiber.Ctx) error {
	state := c.Query("state")
	if state != "randomstate" {
		return c.SendString("States don't Match!!")
	}

	code := c.Query("code")

	githubcon := config.GithubConfig()

	token, err := githubcon.Exchange(context.Background(), code)
	if err != nil {
		return c.SendString("Code-Token Exchange Failed")
	}

	// Fetch user profile from GitHub
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		return c.SendString("Failed to create request")
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.SendString("User Data Fetch Failed")
	}
	defer resp.Body.Close()

	userData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return c.SendString("JSON Parsing Failed")
	}

	var user map[string]interface{}
	if err := json.Unmarshal(userData, &user); err != nil {
		return c.SendString("Failed to parse JSON")
	}

	userName, ok := user["login"].(string)
	if !ok {
		return c.SendString("Invalid user name type")
	}

	// Try to get email from profile; if not public, try /user/emails
	userEmail, _ := user["email"].(string)
	if userEmail == "" {
		userEmail = fetchGitHubPrimaryEmail(token.AccessToken)
	}

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

// fetchGitHubPrimaryEmail calls GET /user/emails and returns the primary verified email.
func fetchGitHubPrimaryEmail(accessToken string) string {
	req, err := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
	if err != nil {
		return ""
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return ""
	}

	var emails []map[string]interface{}
	if err := json.Unmarshal(body, &emails); err != nil {
		return ""
	}

	for _, e := range emails {
		primary, _ := e["primary"].(bool)
		verified, _ := e["verified"].(bool)
		email, _ := e["email"].(string)
		if primary && verified && email != "" {
			return email
		}
	}

	return ""
}
