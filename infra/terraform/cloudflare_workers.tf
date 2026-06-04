resource "cloudflare_workers_script" "backend" {
  name    = var.cloudflare_workers_script_name
  account_id = var.cloudflare_account_id

  content = try(
    file("${path.module}/../backend/worker/dist/index.js"),
    file("${path.module}/placeholder/index.js")
  )

  compatibility_date  = "2025-01-01"
  compatibility_flags = ["nodejs_compat"]

  observability = {
    enabled = true
  }

  plain_text_binding {
    name = "DB_HOST"
    text = var.db_host
  }

  plain_text_binding {
    name = "DB_PORT"
    text = var.db_port
  }

  plain_text_binding {
    name = "DB_USER"
    text = var.db_user
  }

  plain_text_binding {
    name = "DB_NAME"
    text = var.db_name
  }

  plain_text_binding {
    name = "FRONTEND_URL"
    text = "https://${var.vercel_project_name}.vercel.app"
  }

  plain_text_binding {
    name = "GOOGLE_CLIENT_ID"
    text = var.google_client_id
  }

  plain_text_binding {
    name = "GITHUB_CLIENT_ID"
    text = var.github_client_id
  }

  secret_text_binding {
    name = "DB_PASSWORD"
    text = var.db_password
  }

  secret_text_binding {
    name = "JWT_SECRET_KEY"
    text = var.jwt_secret_key
  }

  secret_text_binding {
    name = "GOOGLE_CLIENT_SECRET"
    text = var.google_client_secret
  }

  secret_text_binding {
    name = "GITHUB_CLIENT_SECRET"
    text = var.github_client_secret
  }
}

resource "cloudflare_workers_route" "backend_api" {
  count = var.cloudflare_zone_id != "" ? 1 : 0

  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.cloudflare_custom_domain}/api*"
  script_name = cloudflare_workers_script.backend.name
}
