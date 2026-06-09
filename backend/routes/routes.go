package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/handlers"
	"github.com/long104/Senzen/middleware"
)

func SetupRoutes(app fiber.Router) {
	// All CRUD routes require authentication
	protected := app.Group("/", middleware.AuthRequired)

	// user (user_id comes from JWT, not URL)
	protected.Get("/user", handlers.GetUser)
	protected.Get("/users", handlers.GetUsers)

	// transaction
	protected.Post("/transaction", handlers.CreateTransaction)
	protected.Delete("/transaction", handlers.DeleteTransaction)
	protected.Get("/transaction/:planId", handlers.GetPlanTransactions)

	// category
	protected.Get("/categories", handlers.GetCategories)
	protected.Get("/category", handlers.GetCategory)
	protected.Post("/category", handlers.CreateCategory)
	protected.Delete("/category", handlers.DeleteCategory)

	// plan (user_id comes from JWT, not URL)
	protected.Get("/plan/:id", func(c *fiber.Ctx) error {
		return handlers.GetPlanByID(config.DB, c)
	})
	protected.Get("/plans", func(c *fiber.Ctx) error {
		return handlers.GetPlans(config.DB, c)
	})
	protected.Post("/plan", func(c *fiber.Ctx) error {
		return handlers.CreatePlan(config.DB, c)
	})
	protected.Delete("/plan/:id", func(c *fiber.Ctx) error {
		return handlers.DeletePlan(config.DB, c)
	})
}
