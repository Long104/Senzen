terraform {
  cloud {
    organization = "openzen"

    workspaces {
      name = "senzen-production"
    }
  }

  required_version = ">= 1.7.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
