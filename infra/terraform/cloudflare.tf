# =============================================================
# Cloudflare DNS — pantorn.site
# =============================================================
# Path-based architecture: the frontend (senzen.pantorn.site) is
# on Vercel, and Vercel rewrites /<anything> to Render's
# /api/<anything> via vercel.json. The browser only ever sees
# senzen.pantorn.site, so only ONE DNS record is needed:
#   senzen  CNAME → cname.vercel-dns.com  (frontend, DNS-only)
#
# No backend DNS record — the backend is reached via the Vercel
# rewrite, never directly via a public hostname.
# =============================================================

resource "cloudflare_record" "senzen_frontend" {
  zone_id = var.cloudflare_zone_id
  name    = split(".", var.frontend_domain)[0] # "senzen"
  type    = "CNAME"
  value   = var.vercel_cname_target
  proxied = false
  comment = "Senzen frontend → Vercel (DNS-only, Vercel issues its own cert)"
}
