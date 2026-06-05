terraform {
  cloud {
    organization = var.tfc_organization

    workspaces {
      name = var.tfc_workspace
    }
  }

  required_version = ">= 1.7.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}
