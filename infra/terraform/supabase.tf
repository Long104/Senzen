# =============================================================
# Supabase — Managed Postgres Database
# =============================================================
# Terraform creates the entire Supabase project (Postgres DB,
# Auth, Storage, Realtime) via the Supabase Management API.
#
# Prerequisites:
#   1. Create a Personal Access Token at:
#      https://supabase.com/dashboard/account/tokens
#   2. Find your Organization slug at:
#      Supabase Dashboard → Org Settings → General → Org slug
#   3. Set supabase_access_token + supabase_org_id in
#      terraform.tfvars (local) or Terraform Cloud variables.
# =============================================================

# ─────────────────────────────────────────────────────────────
# Auto-generate a secure database password
# ─────────────────────────────────────────────────────────────
resource "random_password" "db" {
  length  = 32
  special = false
}

# ─────────────────────────────────────────────────────────────
# Create the Supabase project
# ─────────────────────────────────────────────────────────────
resource "supabase_project" "senzen" {
  organization_id   = var.supabase_org_id
  name              = var.supabase_project_name
  database_password = random_password.db.result
  region            = var.supabase_region

  lifecycle {
    # Prevent accidental destruction of the production database
    prevent_destroy = true
  }
}

# ─────────────────────────────────────────────────────────────
# Fetch API keys for the project (anon + service_role)
# ─────────────────────────────────────────────────────────────
data "supabase_apikeys" "senzen" {
  project_ref = supabase_project.senzen.id
}
