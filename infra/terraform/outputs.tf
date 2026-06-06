output "vercel_url" {
  description = "Vercel frontend deployment URL (auto-assigned)"
  value       = "https://${vercel_project.cashwise.name}.vercel.app"
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.cashwise.id
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
