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

# NOTE: NEXT_PUBLIC_BACKEND is set to "" in the Vercel dashboard
# (Settings → Environment Variables). It's not in this Terraform
# because path-based routing means the frontend uses relative URLs.
# Set it in the dashboard:
#   Key:   NEXT_PUBLIC_BACKEND
#   Value: (empty)
#   Target: Production
