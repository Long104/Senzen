variable "tfc_organization" {
  description = "Terraform Cloud organization name"
  type        = string
}

variable "tfc_workspace" {
  description = "Terraform Cloud workspace name"
  type        = string
  default     = "senzen-production"
}

variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "GitHub repository in org/repo format"
  type        = string
  default     = "Long104/Senzen"
}

variable "vercel_project_name" {
  description = "Name for the Vercel project"
  type        = string
  default     = "senzen"
}

variable "snapdeploy_backend_url" {
  description = "SnapDeploy backend URL (set in SnapDeploy dashboard, e.g. https://senzen-backend.containers.snapdeploy.dev)"
  type        = string
  default     = "https://senzen-backend.containers.snapdeploy.dev"
}
