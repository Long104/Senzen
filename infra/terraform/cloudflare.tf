# =============================================================
# Cloudflare DNS — senzen.pantorn.site
# =============================================================
# This file manages the DNS records for the Senzen project.
# Records:
#   senzen        CNAME → cname.vercel-dns.com      (frontend)
#   api.senzen    CNAME → <render-service>.onrender.com (backend)
#
# Both are DNS-only (proxied = false) so Vercel/Render can
# issue and serve their own TLS certificates. The orange-cloud
# proxy would break ACME HTTP-01 challenges for cert issuance.
# =============================================================

# ─────────────────────────────────────────────────────────────
# Frontend: senzen.pantorn.site → Vercel
# ─────────────────────────────────────────────────────────────
resource "cloudflare_record" "senzen_frontend" {
  zone_id = var.cloudflare_zone_id
  name    = split(".", var.frontend_domain)[0] # "senzen" from "senzen.pantorn.site"
  type    = "CNAME"
  value   = var.vercel_cname_target
  proxied = false
  comment = "Senzen frontend → Vercel"
}

# ─────────────────────────────────────────────────────────────
# Backend: api.senzen.pantorn.site → Render
# ─────────────────────────────────────────────────────────────
resource "cloudflare_record" "senzen_backend" {
  zone_id = var.cloudflare_zone_id
  name    = "${var.backend_subdomain}.${split(".", var.frontend_domain)[0]}" # "api.senzen"
  type    = "CNAME"
  value   = "${var.render_service_name}.onrender.com"
  proxied = false
  comment = "Senzen backend → Render (${var.render_service_name}.onrender.com)"
}
