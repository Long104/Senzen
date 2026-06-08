resource "vercel_project" "senzen" {
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
  project_id = vercel_project.senzen.id
  key        = "NEXT_PUBLIC_BASE_URL"
  value      = "https://${var.frontend_domain}"
  target     = ["production"]
  sensitive  = false
}

# Path-based routing: the frontend uses relative URLs (e.g. /login,
# /google_login). Vercel rewrites them to the backend via vercel.json.
# Setting this to "" forces the frontend to use relative paths.
resource "vercel_project_environment_variable" "backend_url" {
  project_id = vercel_project.senzen.id
  key        = "NEXT_PUBLIC_BACKEND"
  value      = ""
  target     = ["production"]
  sensitive  = false
}

resource "vercel_project_domain" "senzen_custom" {
  project_id = vercel_project.senzen.id
  domain     = var.frontend_domain
}
