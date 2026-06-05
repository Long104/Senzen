package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

type Config struct {
	GoogleLoginConfig oauth2.Config
	GitHubLoginConfig oauth2.Config
}

var AppConfig Config

// backendURL returns the BACKEND_URL env var, or localhost for dev.
// OAuth providers will redirect back to <backendURL>/<provider>_callback.
func backendURL() string {
	if u := os.Getenv("BACKEND_URL"); u != "" {
		return u
	}
	return "http://localhost:8080"
}

func GoogleConfig() oauth2.Config {
	// godotenv is a dev convenience only — log a warning if missing.
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("[config] no .env file found (expected in production): %v", err)
	}

	AppConfig.GoogleLoginConfig = oauth2.Config{
		RedirectURL:  backendURL() + "/google_callback",
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return AppConfig.GoogleLoginConfig
}

func GithubConfig() oauth2.Config {
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("[config] no .env file found (expected in production): %v", err)
	}

	AppConfig.GitHubLoginConfig = oauth2.Config{
		RedirectURL:  backendURL() + "/github_callback",
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"user", "repo"},
		Endpoint:     github.Endpoint,
	}

	return AppConfig.GitHubLoginConfig
}
