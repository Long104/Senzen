output "vercel_url" {
  description = "Vercel frontend deployment URL (auto-assigned)"
  value       = "https://${vercel_project.cashwise.name}.vercel.app"
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.cashwise.id
}

output "frontend_url" {
  description = "Public frontend URL (custom domain)"
  value       = "https://${var.frontend_domain}"
}

output "backend_url" {
  description = "Public backend URL (custom domain + /api prefix)"
  value       = "https://${var.backend_subdomain}.${var.frontend_domain}"
}

output "backend_api_url" {
  description = "Backend API base path the frontend calls"
  value       = "https://${var.backend_subdomain}.${var.frontend_domain}/api"
}

output "render_onrender_url" {
  description = "Render's default onrender.com URL (DNS target in Cloudflare)"
  value       = "https://${var.render_service_name}.onrender.com"
}

output "cloudflare_record_senzen" {
  description = "Cloudflare CNAME record for the frontend"
  value       = cloudflare_record.senzen_frontend.hostname
}

output "cloudflare_record_api" {
  description = "Cloudflare CNAME record for the backend"
  value       = cloudflare_record.senzen_backend.hostname
}
