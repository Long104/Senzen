resource "vercel_project" "cashwise" {
  name      = var.vercel_project_name
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = var.github_repo
  }

  root_directory = "frontend"

  build_command    = "npm run build"
  output_directory = ".next"
  install_command  = "npm ci"

  serverless_function_region = "sin1"
}

resource "vercel_project_environment_variable" "frontend_url" {
  project_id  = vercel_project.cashwise.id
  key         = "NEXT_PUBLIC_BASE_URL"
  value       = "https://${vercel_project.cashwise.name}.vercel.app"
  environment = ["production"]
}

resource "vercel_project_environment_variable" "backend_url" {
  project_id = vercel_project.cashwise.id
  key        = "NEXT_PUBLIC_BACKEND"
  value = var.cloudflare_custom_domain != "" ? "https://${var.cloudflare_custom_domain}/api" : "https://${var.cloudflare_workers_script_name}.${var.cloudflare_account_id}.workers.dev/api"
  environment = ["production"]
}
