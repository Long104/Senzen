package middleware

import (
	// "os"

	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CORSMiddleware() fiber.Handler {
	// frontendOrigin := os.Getenv("FRONTEND_URL") // Set this in your environment variables
	// if frontendOrigin == "" {
	// 	frontendOrigin = "http://localhost:3000" // Default for development
	// }
	return cors.New(cors.Config{
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		// AllowOrigins:     "http://localhost:3000", // Set to your frontend origin
    // AllowOrigins: frontendOrigin,
		// AllowOrigins:     "https://senzen.pantorn.site", // Set to your frontend origin
		AllowOrigins:     os.Getenv("FRONTEND_URL"), // Set to your frontend origin
		AllowCredentials: true,                    // Allows cookies and credentials to be sent
	})
}
