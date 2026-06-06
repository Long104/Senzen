# =============================================================
# Cloudflare DNS — senzen.pantorn.site
# =============================================================
# This file manages the DNS records for the Senzen project.
# Records:
#   senzen         CNAME → cname.vercel-dns.com          (frontend,  DNS-only)
#   senzen-api     CNAME → <render-service>.onrender.com (backend,   Cloudflare-proxied)
#
# The backend is proxied (orange cloud) because Render's free
# plan does NOT support custom domains — so the service runs
# at senzen-api.onrender.com, and Cloudflare terminates TLS
# for senzen-api.pantorn.site using Universal SSL, then
# forwards to Render in "Full" SSL mode (no cert verification).
#
# Both records are ONE level deep under pantorn.site so they're
# covered by Cloudflare's Universal SSL (*.pantorn.site).
# =============================================================

# ─────────────────────────────────────────────────────────────
# Frontend: senzen.pantorn.site → Vercel (DNS-only)
# Vercel issues its own Let's Encrypt cert via ACME HTTP-01,
# which fails if Cloudflare proxy is on. So we leave it
# proxied = false and let Vercel handle TLS.
# ─────────────────────────────────────────────────────────────
resource "cloudflare_record" "senzen_frontend" {
  zone_id = var.cloudflare_zone_id
  name    = split(".", var.frontend_domain)[0] # "senzen" from "senzen.pantorn.site"
  type    = "CNAME"
  value   = var.vercel_cname_target
  proxied = false
  comment = "Senzen frontend → Vercel (DNS-only, Vercel issues cert)"
}

# ─────────────────────────────────────────────────────────────
# Backend: senzen-api.pantorn.site → Render (proxied)
# Render free plan doesn't issue certs for custom domains.
# Cloudflare proxies, terminates TLS with Universal SSL, and
# forwards to Render's onrender.com URL. Set Cloudflare zone
# SSL mode to "Full" (NOT "Full (Strict)") so the origin cert
# isn't required to be valid for senzen-api.pantorn.site.
# ─────────────────────────────────────────────────────────────
resource "cloudflare_record" "senzen_backend" {
  zone_id = var.cloudflare_zone_id
  name    = var.backend_subdomain # "senzen-api"
  type    = "CNAME"
  value   = "${var.render_service_name}.onrender.com"
  proxied = true
  comment = "Senzen backend → Render via Cloudflare proxy (Render free doesn't support custom domains)"
}
