package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/long104/CashWise/config"
	"github.com/long104/CashWise/middleware"
	"github.com/long104/CashWise/routes"
)

func main() {
	// godotenv is a dev convenience only — in production (Render)
	// env vars come from the platform and .env doesn't exist.
	// Log a warning instead of crashing if .env is missing.
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("[startup] no .env file found (expected in production): %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // local dev default; Render sets PORT=10000
	}

	config.ConnectDatabase()
	app := fiber.New()
	api := app.Group("/api")

	app.Use(middleware.CORSMiddleware())

	// All routes live under /api so the Vercel rewrite
	// (/:path*  →  senzen-api.onrender.com/api/:path*) lines up.
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("health check ok")
	})

	api.Get("/validate-token", middleware.ValidateToken)

	routes.SetupOAuthRoutes(api)
	routes.SetupAuthRoutes(api)
	routes.SetupRoutes(api)

	log.Printf("[startup] listening on :%s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("[startup] server failed: %v", err)
	}
}
