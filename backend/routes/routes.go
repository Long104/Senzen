package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/handlers"
)

func SetupRoutes(app fiber.Router) {
	// user

	app.Get("/user/:id", handlers.GetUser)
	app.Get("/users", handlers.GetUsers)

	// transaction
	app.Post("/transaction", handlers.CreateTransaction)
	app.Delete("/transaction", handlers.DeleteTransaction)
  app.Get("/transaction/:planId", handlers.GetPlanTransactions)
	// app.Delete("/transaction/:id", handlers.DeleteTransaction)
	// app.Post("/transaction/:id", handlers.CreateTransaction)

	// category
	app.Get("/categories", handlers.GetCategories)
	app.Get("/category", handlers.GetCategory)
	app.Post("/category", handlers.CreateCategory)
	app.Delete("/category", handlers.DeleteCategory)

	// plan
	app.Get("/plan/:id", func(c *fiber.Ctx) error {
		return handlers.GetPlanByID(config.DB, c)
	})
  app.Get("/plans/:id", func(c *fiber.Ctx) error {
		return handlers.GetPlans(config.DB, c)
	})
	app.Post("/plan", func(c *fiber.Ctx) error {
		return handlers.CreatePlan(config.DB, c)
	})
	app.Delete("/plan/:id", func(c *fiber.Ctx) error {
		return handlers.DeletePlan(config.DB, c)
	})
}
