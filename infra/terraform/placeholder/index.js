// Placeholder Worker bundle.
//
// This file exists so `terraform plan` succeeds before the real Worker
// codebase is written. Replace it by building a real bundle to
// `backend/worker/dist/index.js` (e.g. via `wrangler deploy` or any
// bundler). The Terraform `content` uses `try()` to prefer the real
// bundle when present and fall back to this file otherwise.

export default {
  async fetch(request, env) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Backend Worker not yet built. Implement the Worker and deploy to backend/worker/dist/index.js.",
        env_keys: Object.keys(env || {}),
      }),
      { status: 503, headers: { "content-type": "application/json" } }
    );
  },
};
