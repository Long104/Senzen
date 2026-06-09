output "vercel_url" {
  description = "Vercel frontend deployment URL (auto-assigned)"
  value       = "https://${vercel_project.senzen.name}.vercel.app"
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.senzen.id
}

output "frontend_url" {
  description = "Public frontend URL (custom domain) — also the only public URL for the backend (Vercel rewrites /<path> to Render /api/<path>)"
  value       = "https://${var.frontend_domain}"
}

output "render_onrender_url" {
  description = "Render's default onrender.com URL — backend is reached through this only via the Vercel rewrite, not directly"
  value       = "https://${var.render_service_name}.onrender.com"
}

output "cloudflare_record_senzen" {
  description = "Cloudflare CNAME record for the frontend"
  value       = cloudflare_record.senzen_frontend.hostname
}

# ─────────────────────────────────────────────────────────────
# Supabase outputs
# ─────────────────────────────────────────────────────────────
output "supabase_project_id" {
  description = "Supabase project reference ID"
  value       = supabase_project.senzen.id
}

output "supabase_db_host" {
  description = "Supabase Postgres connection host (pooler endpoint for serverless)"
  value       = "aws-0-${var.supabase_region}.pooler.supabase.com"
}

output "supabase_db_direct_host" {
  description = "Supabase Postgres direct connection host"
  value       = "${supabase_project.senzen.id}.supabase.co"
}

output "supabase_db_port" {
  description = "Supabase Postgres port"
  value       = 5432
}

output "supabase_db_password" {
  description = "Supabase Postgres password (auto-generated, stored in Terraform state)"
  value       = random_password.db.result
  sensitive   = true
}

output "supabase_anon_key" {
  description = "Supabase anonymous (public) API key — safe to use in frontend"
  value       = data.supabase_apikeys.senzen.anon_key
  sensitive   = true
}

output "supabase_service_role_key" {
  description = "Supabase service_role API key — full admin access, NEVER expose in frontend"
  value       = data.supabase_apikeys.senzen.service_role_key
  sensitive   = true
}
