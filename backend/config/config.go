package config

import (
	"fmt"
	"os"

	// "fmt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

type Config struct {
	GoogleLoginConfig oauth2.Config
	GitHubLoginConfig oauth2.Config
}

var AppConfig Config

func GoogleConfig() oauth2.Config {
	AppConfig.GoogleLoginConfig = oauth2.Config{
		// RedirectURL: "http://localhost:8080/google_callback",
		// RedirectURL:  "https://senzen-backend.vercel.app/google_callback",
		RedirectURL:  fmt.Sprintf("%s/google_callback", os.Getenv("BACKEND_URL")),
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
	AppConfig.GitHubLoginConfig = oauth2.Config{
		// RedirectURL: "http://localhost:8080/github_callback",
		// RedirectURL: "https://senzen-backend.vercel.app/google_callback",
		RedirectURL:  fmt.Sprintf("%s/github_callback", os.Getenv("BACKEND_URL")),
		ClientID:    os.Getenv("GITHUB_CLIENT_ID"),
		// RedirectURL: fmt.Sprintf(
		// "https://github.com/login/oauth/authorize?scope=user:repo&client_id=%s&redirect_uri=%s", os.Getenv("GITHUB_CLIENT_ID"), "http://localhost:8080/github_callback"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"user", "repo"},
		Endpoint:     github.Endpoint,
	}

	return AppConfig.GitHubLoginConfig
}
