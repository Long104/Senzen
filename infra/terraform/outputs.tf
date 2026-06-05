output "vercel_url" {
  description = "Vercel frontend deployment URL"
  value       = "https://${vercel_project.cashwise.name}.vercel.app"
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.cashwise.id
}

output "backend_url" {
  description = "SnapDeploy backend URL"
  value       = var.snapdeploy_backend_url
}
