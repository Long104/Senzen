package middleware

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func checkMiddleware(c *fiber.Ctx) error {
	data := c.Locals("user").(*jwt.Token)
	dataClaim := data.Claims.(jwt.MapClaims)
	fmt.Println(dataClaim)
	if dataClaim["role"] != "admin" {
		return fiber.ErrUnauthorized
	}
	return c.Next()
}

func AuthRequired(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	// token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{Issuer: "Senzen", ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour))}, func(token *jwt.Token) (interface{}, error) {
	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{Issuer: "Senzen"}, func(token *jwt.Token) (interface{}, error) {
		// token, err := jwt.ParseWithClaims(cookie, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		// return []byte("secret"), nil
		return []byte(os.Getenv("jwtSecretKey")), nil
	})
	if err != nil {
		return err
	}

	if _, ok := token.Claims.(*jwt.RegisteredClaims); ok && token.Valid {
		// Extract user_id from JWT claims and store in context
		// so handlers can use c.Locals("user_id") instead of URL/query params
		rawClaims := token.Claims.(jwt.MapClaims)
		if userID, ok := rawClaims["user_id"].(float64); ok {
			c.Locals("user_id", uint(userID))
		}
	} else {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	return c.Next()
}

// Token validation middleware function
func ValidateToken(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	fmt.Println(authHeader)

	// Basic validation to check if the token is provided
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
		})
	}

	// Decode and validate the token
	if result := IsValidToken(authHeader); result {
		return c.JSON(fiber.Map{
			"message": "Authorized",
			"value":   result,
		})
	}

	// Respond with Unauthorized status if the token is invalid
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": "Invalid token",
	})
}

// Mock function to validate token (replace with actual validation logic)
func IsValidToken(token string) bool {
	// Remove "Bearer " prefix
	jwtSecret := []byte(os.Getenv("jwtSecretKey")) // Replace this with your secret key
	token = strings.TrimPrefix(token, "Bearer ")

	// Parse and validate the token
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		// Ensure the token's signing method is what you expect
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	// Check if parsing and validation succeeded and the token is valid
	if err != nil || !parsedToken.Valid {
		return false
	}

	// Optionally: Check claims, expiration, etc., if needed
	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok {
		if exp, ok := claims["exp"].(float64); ok {
			expiration := time.Unix(int64(exp), 0)
			return expiration.After(time.Now())
		}
	}

	return true
}
