// routes/oauth_routes.go
package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/long104/Senzen/config"
	"github.com/long104/Senzen/controllers" // Adjust import path as needed
)

func SetupOAuthRoutes(app fiber.Router) {
	config.GoogleConfig()
	config.GithubConfig()

	app.Get("/google_login", controllers.GoogleLogin)
	app.Get("/google_callback", controllers.GoogleCallback)
	app.Get("/github_login", controllers.GithubLogin)
	app.Get("/github_callback", controllers.GithubCallback)
}
