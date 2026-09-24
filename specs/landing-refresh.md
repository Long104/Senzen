# Senzen Landing Refresh — Master Engineering Handoff

**Status**: ready for implementation
**Parent specs**: `specs/landing-refresh-design.md` (visual system, kill-list §15, critique checklist §17), `specs/landing-refresh-copy.md` (copy options, FAQ audit §5)
**Branch**: `feat/landing-refresh` (worktree `.worktrees/landing-refresh`)
**Stack**: Next.js App Router + Tailwind, vitest. Verify with `npx tsc --noEmit` and `npm run build` inside `frontend/`.

## 0. Resolved Decisions (conflicts between parent specs — PM lock)

| Conflict | Decision | Reason |
| :--- | :--- | :--- |
| Eyebrow text (design §10.A says `senzen / manual money`; copy §1 lists 5 options) | **`hi, this is senzen`** (copy option 1) | 1:1 semantic replacement of "Meet" (a greeting), lowercase calm voice |
| Tagline | **`your money, remembered.`** | Both specs agree |
| Screenshot captions (design §10.B vs copy sets A/B/C) | **Copy Set A** (direct & functional) | Matches "honest copy" mandate; references real features (capture bar, month·year·all, optional ceilings) |
| CTA label | **`start tracking`** (copy §6 option 1) | Factual, no hype |
| Window tags on screenshot cards | Keep design tags `01 · home`, `02 · reports`, `03 · plans` | Mono caption badge per design tokens |
| Section title | **`the app itself.`** | Design §10.B |
| Mascot assets | Generate PNGs via `img` CLI (`/Users/pantorn/bin/img` exists) into `frontend/public/mascot/`. If any generation fails → inline SVG fallback for that pose. **P1 (hero eyebrow) and P5 (footer) are mandatory**; P2–P4 are nice-to-have, do NOT block on them |
| Navbar | Out of scope. Only touch if a landing-rendered component fails the grep gates in §4 | Keep diff surgical |

## 1. Goal & Scope

Replace the fake-AI marketing narrative on `/` with real product screenshots, honest copy, a small inline bear narrator, and a minimal composer-style hero. Voice: lowercase, calm, factual. No automation/nudge/AI claims anywhere in rendered DOM.

**In scope**: hero rewrite, new screenshots section, kill AiPlanDemo + HeroStatsBand + Family Trip $2000 block, highlights/weekly/faq/footer rewrites per kill-list, mascot assets, seeded-data cleanup.

**Out of scope**: navbar redesign, product UI (`(product)` routes), any mascot inside product UI, new dependencies, animations beyond design §13.

## 2. Target Files

| File | Action |
| :--- | :--- |
| `frontend/src/app/(landingPage)/page.tsx` | Remove `AiPlanDemo` + `HeroStatsBand` imports/usages; add `AppScreenshotsSection` after hero |
| `frontend/src/components/example/spotlight-demo.tsx` | Rewrite `HeroComposer` per design §10.A: inline 32px bear before eyebrow, tagline, value sentence, CTA `start tracking`, right column = BrowserFrame `/screenshots/home.png`; **delete `HeroStatsBand` export entirely** |
| `frontend/src/components/example/ai-plan-demo.tsx` | **DELETE FILE** |
| `frontend/src/components/example/screenshot-section.tsx` (new) | `AppScreenshotsSection` per design §10.B: 3-col grid, BrowserFrame cards, Set A captions, window tags; `loading="lazy"`, `aspect-[16/10]`, `object-top` |
| `frontend/src/components/example/browser-frame.tsx` (new) | Shared BrowserFrame per design §8; fixed aspect wrapper + `#F7F7F7` skeleton (design §16 mandate) |
| `frontend/src/components/example/highlights-band.tsx` | Kill purple `#8B5CF6` + uppercase eyebrow; lowercase `more from senzen`; 4 honest cards (01 custom duration plans, 02 category envelopes, 03 intentional manual entry, 04 clear progress without noise) |
| `frontend/src/components/example/weekly-clarity.tsx` | Kill cyan `#0EA5E9` + uppercase `STREAK` kicker; green `#1EC072` accents only; lowercase |
| `frontend/src/components/example/faq-section.tsx` | Apply copy §5 rewrites verbatim (4 q/a pairs; auto-save Q&A replaced by notifications Q&A) |
| `frontend/src/components/example/footer.tsx` | Lowercase wordmark, `bear-sleep-peaceful.png` stamp, subtext `your money, remembered.` |
| `frontend/public/mascot/*.png` (new) | P1 `bear-mini-peeking.png`, P5 `bear-sleep-peaceful.png` mandatory; P2–P4 optional |
| `frontend/src/__tests__/landing.smoke.test.tsx` (new) | Smoke test per §5 |

Note: Family Trip $2000 block lives inside `ai-plan-demo.tsx` (or `spotlight-demo.tsx`) — killing those exports removes it. Verify with grep gate in §4; if the block lives elsewhere, kill it there too.

## 3. Domain Rules (invariants that must never break)

1. Bear mascot = landing narrator ONLY. Never rendered inside product UI or inside screenshot images.
2. Exactly one brand color `#1EC072` on landing. Purple/cyan/amber banned.
3. Zero `uppercase tracking-*` eyebrows in landing components.
4. Zero claims of AI planners, bank sync, auto-save, nudges, notifications in rendered DOM.
5. Existing product routes untouched. No schema changes. No new deps.

## 4. Verification Exit Criteria (Engineer MUST check every box before DONE)

- [ ] `npx tsc --noEmit` exits 0 in `frontend/` — run command, paste exit code
- [ ] `npm run build` succeeds in `frontend/` — paste tail of output
- [ ] `npm run test:run` passes (incl. new smoke test) — paste summary line
- [ ] `rg -i "8B5CF6|0EA5E9|F59E0B|violet-|cyan-|amber-" frontend/src/components/example/ frontend/src/app/\(landingPage\)/` returns 0 matches — run command
- [ ] `rg -i "uppercase" frontend/src/components/example/` returns 0 matches on tracking/eyebrow usage — run command
- [ ] `rg -i "auto-save|autosave|nudge|ai plan|ask for a plan|family trip" frontend/src/components/example/ frontend/src/app/` returns 0 matches (case-insensitive) — run command
- [ ] `test -f frontend/src/components/example/ai-plan-demo.tsx` FAILS (file deleted) — run command
- [ ] Dev server (use a free port, e.g. `PORT=3111 npm run dev`) serves `/`; browser screenshot of full page shows: bear inline before eyebrow `hi, this is senzen`, tagline `your money, remembered.`, hero BrowserFrame with home.png, 3 screenshot cards (home/report/plans), no AiPlanDemo chat, no Family Trip block, no HeroStatsBand — save screenshots to `/tmp/landing-verify-*.png`
- [ ] `/screenshots/home.png`, `/screenshots/report.png`, `/screenshots/plans.png` all return HTTP 200 from dev server — curl status codes
- [ ] Browser console on `/` shows zero errors — note console output
- [ ] Cleanup executed per §6 and verified per §6 checks

## 5. Test Contract

`frontend/src/__tests__/landing.smoke.test.tsx` (vitest):
- `landing page renders all sections` — render `Home` (from `(landingPage)/page.tsx`) via `react-dom/server` `renderToStaticMarkup`; expect string contains `your money, remembered.`, `the app itself.`, `01 · home`, `03 · plans`, `do i need to connect my bank?`; expect NOT contains `AiPlanDemo` markers (`ask for a plan`, `family trip`, `auto-save`).
- Mock `next/link` or `next/navigation` only if static render throws; do not add deps.

## 6. Post-Visual-Verify Cleanup Runbook (ONLY after §4 screenshot check passes)

Seeded demo data on user_id=2 must be removed. Protect: the 1 pre-existing transaction and the pre-existing `japan trip` plan — DO NOT DELETE THOSE.

1. Read IDs: transactions = contents of `/tmp/seeded-ids.txt` (IDs 21–42), plans = `/tmp/seeded-plan-ids.txt` (IDs 11, 12).
2. Obtain JWT: sign in via local API as the user_id=2 account (find credentials handling in repo `.env` / dev tooling; NEVER print secret values to output). If credentials are unavailable → STOP cleanup, continue with commit, report `BLOCKED: cleanup-auth`.
3. For each transaction ID: `DELETE /transactions/:id` (expect 200/204). For each plan ID: `DELETE /plan/:id`.
4. Verify: list transactions for user — remaining count = pre-existing only (no coffee beans, bts top-up, kaomun gai, etc.); plans list contains `japan trip` and NOT IDs 11/12.
5. If `/tmp` files missing: fall back to deleting only descriptions matching the seed list (coffee beans, bts top-up, kaomun gai) — never the pre-existing ones.

## 7. Edge Cases

- Slow/failed image load: BrowserFrame fixed `aspect-[16/10]` wrapper + `#F7F7F7` bg prevents layout collapse (design §16).
- Screenshot crop: `object-cover object-top` keeps capture bar visible; verify in screenshot gate.
- `img` CLI failure: inline SVG bear (flat, palette #8D5B4C / #D9B99B / #F4E7D3 / #2B1E1A outline) for P1/P5 minimum.
- Mobile (<768px): hero stacks, bear 28px inline, per design §11.

## 8. Delivery

Commit on `feat/landing-refresh` only. Conventional commit: `feat: replace ai demo narrative with real screenshots and honest copy`. DO NOT push. DO NOT merge. Stage only intended files (incl. `frontend/public/screenshots/`, `frontend/public/mascot/`, specs).
