variable "tfc_organization" {
  description = "Terraform Cloud organization name"
  type        = string
}

variable "tfc_workspace" {
  description = "Terraform Cloud workspace name"
  type        = string
  default     = "cashwise-production"
}

variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token (needs Workers Scripts:Edit, Account Settings:Read, Workers Routes:Edit if using a zone)"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID (found on the Workers dashboard)"
  type        = string
}

variable "cloudflare_workers_script_name" {
  description = "Name for the Cloudflare Workers script (subdomain of workers.dev)"
  type        = string
  default     = "senzen-backend"
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for custom-domain routing. Leave empty to use only the workers.dev subdomain."
  type        = string
  default     = ""
}

variable "cloudflare_custom_domain" {
  description = "Custom domain bound to the Worker (e.g. api.example.com). Required if cloudflare_zone_id is set."
  type        = string
  default     = ""
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

variable "db_host" {
  description = "Supabase PostgreSQL host"
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Supabase PostgreSQL port"
  type        = string
  default     = "5432"
}

variable "db_user" {
  description = "Supabase PostgreSQL user"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Supabase PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Supabase PostgreSQL database name"
  type        = string
  default     = "postgres"
}

variable "jwt_secret_key" {
  description = "JWT secret key for signing tokens"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
}

variable "github_client_id" {
  description = "GitHub OAuth Client ID"
  type        = string
  sensitive   = true
}

variable "github_client_secret" {
  description = "GitHub OAuth Client Secret"
  type        = string
  sensitive   = true
}
