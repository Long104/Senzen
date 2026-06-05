variable "tfc_organization" {
  description = "Terraform Cloud organization name"
  type        = string
}

variable "tfc_workspace" {
  description = "Terraform Cloud workspace name"
  type        = string
  default     = "senzen-production"
}

# ─────────────────────────────────────────────────────────────
# Vercel (frontend)
# ─────────────────────────────────────────────────────────────
variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "vercel_project_name" {
  description = "Name for the Vercel project"
  type        = string
  default     = "senzen"
}

# ─────────────────────────────────────────────────────────────
# Cloudflare (DNS for senzen.pantorn.site)
# ─────────────────────────────────────────────────────────────
variable "cloudflare_api_token" {
  description = "Cloudflare API token with DNS edit permission for the zone"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for pantorn.site"
  type        = string
}

variable "cloudflare_zone_name" {
  description = "Cloudflare zone (apex domain) — e.g. pantorn.site"
  type        = string
  default     = "pantorn.site"
}

# ─────────────────────────────────────────────────────────────
# GitHub
# ─────────────────────────────────────────────────────────────
variable "github_repo" {
  description = "GitHub repository in org/repo format"
  type        = string
  default     = "Long104/Senzen"
}

# ─────────────────────────────────────────────────────────────
# Public domains
# ─────────────────────────────────────────────────────────────
variable "frontend_domain" {
  description = "Public domain for the frontend (CNAME → Vercel)"
  type        = string
  default     = "senzen.pantorn.site"
}

variable "backend_subdomain" {
  description = "Subdomain label for the backend (relative to frontend_domain). Final URL: <backend_subdomain>.<frontend_domain>"
  type        = string
  default     = "api"
}

# ─────────────────────────────────────────────────────────────
# Backend targets (set in render.yaml + Render dashboard)
#   These are referenced by cloudflare.tf as the CNAME target.
#   Render service URL is always <service-name>.onrender.com.
# ─────────────────────────────────────────────────────────────
variable "render_service_name" {
  description = "Name of the Render web service (matches render.yaml). Default URL becomes <name>.onrender.com"
  type        = string
  default     = "senzen-api"
}

variable "vercel_cname_target" {
  description = "Vercel's CNAME target (cname.vercel-dns.com)"
  type        = string
  default     = "cname.vercel-dns.com"
}

# ─────────────────────────────────────────────────────────────
# Backend env vars — DOCUMENTED ONLY.
#   These are set in the Render dashboard (or via render.yaml
#   with sync: false) — they are NOT used by Terraform itself.
#   Kept here as a single source of truth for what env vars
#   the backend needs.
# ─────────────────────────────────────────────────────────────
variable "db_host" {
  description = "Supabase Postgres host (e.g. abcdefgh.supabase.co) — set in Render dashboard, not in Terraform"
  type        = string
  default     = ""
}

variable "db_port" {
  description = "Supabase Postgres port — set in Render dashboard, not in Terraform"
  type        = string
  default     = "5432"
}

variable "db_user" {
  description = "Supabase Postgres user — set in Render dashboard, not in Terraform"
  type        = string
  default     = "postgres"
}

variable "db_name" {
  description = "Supabase Postgres database name — set in Render dashboard, not in Terraform"
  type        = string
  default     = "postgres"
}

variable "jwt_secret_key" {
  description = "Secret used to sign JWTs (use openssl rand -base64 32) — set in Render dashboard, not in Terraform"
  type        = string
  default     = ""
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth client ID — set in Render dashboard, not in Terraform"
  type        = string
  default     = ""
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth client secret — set in Render dashboard, not in Terraform"
  type        = string
  default     = ""
  sensitive   = true
}

variable "github_client_id" {
  description = "GitHub OAuth client ID — set in Render dashboard, not in Terraform"
  type        = string
  default     = ""
  sensitive   = true
}

variable "github_client_secret" {
  description = "GitHub OAuth client secret — set in Render dashboard, not in Terraform"
  type        = string
  default     = ""
  sensitive   = true
}
