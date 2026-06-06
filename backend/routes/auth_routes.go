package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/long104/Senzen/controllers"
)

func SetupAuthRoutes(app fiber.Router) {
	app.Post("/signup", controllers.CreateUser)
	app.Post("/login", controllers.LoginUser)
	app.Post("/logout", controllers.LogoutUser)
}
