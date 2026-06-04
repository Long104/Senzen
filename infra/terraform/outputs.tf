output "vercel_url" {
  description = "Vercel frontend deployment URL"
  value       = "https://${vercel_project.cashwise.name}.vercel.app"
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.cashwise.id
}

output "cloudflare_workers_url" {
  description = "Cloudflare Workers default URL (workers.dev subdomain)"
  value       = "https://${cloudflare_workers_script.backend.name}.${var.cloudflare_account_id}.workers.dev"
}

output "cloudflare_workers_custom_url" {
  description = "Custom-domain URL for the Worker (if configured)"
  value       = var.cloudflare_custom_domain != "" ? "https://${var.cloudflare_custom_domain}" : null
}

output "cloudflare_workers_script_id" {
  description = "Cloudflare Workers script ID"
  value       = cloudflare_workers_script.backend.id
}
