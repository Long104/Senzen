package routes

import (
	"log"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	// "github.com/long104/Senzen/middleware"
)

type WebSocketHub struct {
	clients   map[*websocket.Conn]bool
	broadcast chan []byte
	lock      sync.Mutex
}

var hub = WebSocketHub{
	clients:   make(map[*websocket.Conn]bool),
	broadcast: make(chan []byte),
}

func WsRoutes(app *fiber.App) {
	app.Get("api/ws/:id", websocket.New(func(c *websocket.Conn) {
		// token := c.Query("token")
		// if result := middleware.IsValidToken(token); !result {
		// 	log.Println("inValid token")
		// }

		log.Println(c.Locals("allowed"))  // true
		log.Println(c.Params("id"))       // 123
		log.Println(c.Query("v"))         // 1.0
		log.Println(c.Cookies("session")) // ""

		hub.lock.Lock()
		hub.clients[c] = true
		hub.lock.Unlock()

		log.Println("New client connected")
		defer func() {
			hub.lock.Lock()
			delete(hub.clients, c)
			hub.lock.Unlock()
			log.Println("Client disconnected")
			c.Close()
		}()

		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("read error:", err)
				break
			}
			log.Printf("Received: %s", msg)

			// Broadcast the message to all clients
			hub.broadcast <- msg
		}
	}))

	// Start a separate goroutine to handle broadcasting
	go func() {
		for {
			msg := <-hub.broadcast
			hub.lock.Lock()
			for client := range hub.clients {
				if err := client.WriteMessage(websocket.TextMessage, msg); err != nil {
					log.Println("write error:", err)
					client.Close()
					delete(hub.clients, client)
				}
			}
			hub.lock.Unlock()
		}
	}()
}
