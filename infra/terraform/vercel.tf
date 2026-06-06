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
  project_id = vercel_project.cashwise.id
  key        = "NEXT_PUBLIC_BASE_URL"
  value      = "https://${var.frontend_domain}"
  target     = ["production"]
  sensitive  = false
}

resource "vercel_project_environment_variable" "backend_url" {
  project_id = vercel_project.cashwise.id
  key        = "NEXT_PUBLIC_BACKEND"
  # Empty string so the frontend builds relative URLs like "/api/users"
  # which Vercel rewrites to https://senzen-api.onrender.com/api/users
  value     = ""
  target    = ["production"]
  sensitive = false
}
