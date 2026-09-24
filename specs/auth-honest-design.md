---
name: Senzen Honest Auth & Chrome Design Specification
colors:
  canvas: "#EEEEEE"
  canvas-grid: "#E5E5E5"
  surface-card: "#FFFFFF"
  ink-primary: "#0A0A0A"
  ink-body: "#333333"
  ink-muted: "#555555"
  ink-subtle: "#888888"
  brand-green: "#1EC072"
  brand-green-hover: "#18A561"
  border-hairline: "#E5E5E5"
  border-card: "#E2E2E2"
  destructive: "#DC2626"
  destructive-subtle: "#FEF2F2"
  oauth-hover: "#F7F7F7"
typography:
  display-title:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  body-sm:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label-input:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  mono-tag:
    fontFamily: "JetBrains Mono, Menlo, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.01em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  auth-card:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.border-card}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    shadow: "0 1px 3px rgba(10,10,10,0.04), 0 8px 24px rgba(10,10,10,0.03)"
  button-primary:
    backgroundColor: "{colors.ink-primary}"
    textColor: "#FFFFFF"
    hoverBackgroundColor: "#262626"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-oauth:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-primary}"
    borderColor: "{colors.border-hairline}"
    hoverBackgroundColor: "{colors.oauth-hover}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  input-field:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.border-hairline}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
---

# Senzen Auth & Honest Surface Specification

## 1. Overview & Identity Rationale

Senzen is a calm, manual expense tracker with an honest, distraction-free product posture: no fake marketing claims, no broken links, and no artificial pricing paywalls.

### Graphic Identity Decisions
1. **Emotional Register**: Calm, grounded, restrained, and authentic.
2. **Substrate & Canvas**: Neutral paper-grid canvas (`#EEEEEE` substrate with `4rem x 4rem` hairline grid `#E5E5E5` at 50% opacity).
3. **Ink & Typography**: Charcoal ink (`#0A0A0A`) primary, muted slate (`#555555`) secondary, Plus Jakarta Sans for body/headings, JetBrains Mono for tags/metadata. Voice is strictly lowercase for brand/headings (`senzen`, `sign in`, `create account`).
4. **Single Brand Color**: `#1EC072` (Senzen green) used solely as an intentional accent (logo badge, focus rings, success indicators).
5. **Mascot Guidelines**: Bear mascot (`/mascot/bear-mini-peeking.png`) is permitted as a single subtle cameo per marketing/auth page (e.g. peeking over the top edge of the auth card). No mascot clutter in functional forms.
6. **Anti-Slop Guardrails**: No uppercase-tracked eyebrows, no purple/cyan gradients, no stacked cards inside cards, no ghost shadows with heavy blur.

---

## 2. Missing State Audit (Domain Invariant)

**Missing UI State**: `Submit Button In-Flight Loading State`

* **Impact**: User sees no visual response or spinner when clicking "Sign In" or "Create Account" during slow network authentication calls (`fetch` to `/login` or `/signup`), causing perceived unresponsiveness or repeated double-clicks.
* **Specification Mandate**: While in `isSubmitting` / network flight, the primary action button must disable (`disabled`), drop opacity slightly (0.85), and render an inline loading indicator / "signing in..." / "creating account..." text state.

---

## 3. Page & Component Layout Specifications

### 3.1 Sign-In Page Layout (`/sign-in`)

* **Layout Archetype**: **Centered Card** (Justification: Grounded card creates clear concentric boundaries on top of the expansive `#EEEEEE` grid canvas, matching the framed product screenshots in the hero and screenshot sections without drifting into a disconnected open page).
* **Mascot Placement**: `bear-mini-peeking.png` (32px x 32px) positioned centered directly above/peeking over the top border of the card header.
* **Component Structure**:
  1. **Bear Cameo**: Small peeking bear (`/mascot/bear-mini-peeking.png`) centered at the top card margin.
  2. **Card Header**:
     - Title: `sign in to senzen` (Plus Jakarta Sans, 24px, bold 700, `#0A0A0A`).
     - Subtitle: `welcome back — enter your details below` (Plus Jakarta Sans, 14px, `#555555`).
  3. **OAuth Providers (Top priority for speed)**:
     - Google OAuth button: Outline button (`border #E5E5E5`, `bg-white`, hover `#F7F7F7`), preserving real link `href={`${process.env.NEXT_PUBLIC_BACKEND}/google_login`}`. Includes standard Google 4-color SVG icon.
     - GitHub OAuth button: Outline button (`border #E5E5E5`, `bg-white`, hover `#F7F7F7`), preserving real link `href={`${process.env.NEXT_PUBLIC_BACKEND}/github_login`}`. Includes Lucide `Github` icon (20px).
  4. **Divider**:
     - Hairline horizontal rule with centered lowercase badge `or` (12px, font-mono, `#888888`, background `#FFFFFF` padding).
  5. **Email & Password Form**:
     - Label: `email` (13px, font-semibold `#0A0A0A`).
     - Input: Email input (height 40px, rounded 6px, border `#E5E5E5`, focus ring `#1EC072`).
     - Label: `password` (13px, font-semibold `#0A0A0A`).
     - Input: Password input (type `password`, height 40px, rounded 6px, border `#E5E5E5`, focus ring `#1EC072`).
  6. **Submit Action**:
     - Black pill button (`bg-[#0A0A0A]`, text `#FFFFFF`, rounded 9999px, hover `bg-[#262626]`, active `scale-[0.98]`, focus ring `#1EC072`).
     - Label: `sign in` (default) / `signing in...` (submitting).
  7. **Error State**:
     - Inline alert callout below button when login fails (`bg-[#FEF2F2]`, `text-[#DC2626]`, `border border-[#FCA5A5]`, rounded 6px, font-mono 12px: `invalid email or password. please try again.`).
  8. **Footer Link**:
     - Subtext: `new here? ` + `<Link href="/sign-up" className="text-[#0A0A0A] font-semibold underline underline-offset-4 hover:text-[#1EC072]">create an account</Link>`.

---

### 3.2 Sign-Up Page Layout (`/sign-up`)

* **Layout Archetype**: **Centered Card** (Matching sign-in width `440px`, centered vertically and horizontally on `#EEEEEE` grid background).
* **Mascot Placement**: `bear-mini-peeking.png` (32px x 32px) centered peeking over the top border.
* **Component Structure**:
  1. **Card Header**:
     - Title: `create your account` (Plus Jakarta Sans, 24px, bold 700, `#0A0A0A`).
     - Subtitle: `start tracking your expenses with calm clarity` (14px, `#555555`).
  2. **OAuth Quick Start**:
     - Google & GitHub OAuth buttons identical to sign-in, allowing instant signup via existing backend OAuth handlers.
  3. **Divider**: `or with email`
  4. **4-Field Registration Form**:
     - Field 1: `username` (`name="name"`, type `text`, required).
     - Field 2: `email` (`name="email"`, type `email`, required).
     - Field 3: `password` (`name="password"`, type `password`, required, minimum 6 characters).
     - Field 4: `confirm password` (`name="confirmPassword"`, type `password`, required).
  5. **Live / Inline Validation & Password Feedback**:
     - Mismatch Warning: Inline error below confirm password (`text-[#DC2626]`, font-mono 12px: `passwords do not match`).
     - Server Error: Inline error banner if signup fails (`text-[#DC2626]`, font-mono 12px).
  6. **Submit Action**:
     - Black pill button (`bg-[#0A0A0A]`, text `#FFFFFF`, rounded 9999px, full-width, active `scale-[0.98]`).
     - Label: `create account` / `creating account...`.
  7. **Footer Link**:
     - Subtext: `already have an account? ` + `<Link href="/sign-in" className="text-[#0A0A0A] font-semibold underline underline-offset-4 hover:text-[#1EC072]">log in</Link>`.

---

### 3.3 Minimal Honest Navbar (`frontend/src/components/example/navbar.tsx`)

* **Philosophy**: Purge all deceptive/dead routes (`/#plans`, `/#features`, `/#strategies`, `/pricing`, `/createPlan` 404). Keep only verifiable navigation anchors.
* **Surviving Elements**:
  - **Left**: Senzen Brand Wordmark
    - Green rounded icon container (28px x 28px, `bg-[#1EC072]`, rounded 8px) with `/logo.png`.
    - Text: `Senzen` (Plus Jakarta Sans, 20px, font-extrabold, `#0A0A0A`).
  - **Center**: *Completely empty* (no dead links, no non-existent anchor points).
  - **Right**:
    - `sign in` text link (`href="/sign-in"`, 14px, font-semibold `#0A0A0A`, hover `opacity-70`).
    - `get started` black pill button (`href="/sign-up"`, 14px, font-semibold, `bg-[#0A0A0A] text-white px-5 py-2 rounded-full hover:bg-[#262626] active:scale-[0.98]`).
* **Deleted Elements**:
  - Top black announcement bar (`/#plans`) -> **REMOVED**.
  - Center nav items: `Features`, `Strategies`, `Pricing`, `Docs` (`/createPlan`) -> **REMOVED**.

---

### 3.4 Slim Honest Single-Row Footer (`frontend/src/components/example/footer.tsx`)

* **Philosophy**: Replace the fake 4-column corporate footer (`About`, `Careers`, `Contact`, `Privacy`, `Terms`, `Security`, etc. all linking to `#` or 404s) with a slim, authentic, high-craft single-row bar.
* **Substrate**: Solid black (`#0A0A0A`) with subtle top radial dot border (`radial-gradient(circle, rgba(238,238,238,0.18) 2px, transparent 2px)`, backgroundSize `14px 14px`, height `24px`).
* **Row Content (Flex row, items-center, justify-between, max-w-7xl, py-8)**:
  - **Left**:
    - Mascot Cameo: Small peaceful sleeping bear (`/mascot/bear-sleep-peaceful.png`, 24px x 24px, opacity 0.85).
    - Brand Wordmark: `senzen` (Plus Jakarta Sans, 14px, font-bold text-[#EEEEEE]).
    - Tagline: `· your money, remembered.` (Plus Jakarta Sans, 13px, text-[#888888]).
  - **Center / Right (Nav Links + Copyright)**:
    - `<Link href="/sign-in" className="text-xs text-[#AAAAAA] hover:text-[#EEEEEE]">sign in</Link>`
    - `<Link href="/sign-up" className="text-xs text-[#AAAAAA] hover:text-[#EEEEEE]">sign up</Link>`
    - `<span className="text-xs text-[#666666]">© {new Date().getFullYear()} senzen. all rights reserved.</span>`
* **Deleted Elements**:
  - All 4-column grid items (`Product`, `Company`, `Legal` columns).
  - Dead `#` links for About, Careers, Contact, Privacy, Terms, Security.
  - Deceptive `/pricing` link and broken `/createPlan` link.

---

## 4. Pricing Deletion & Purge Checklist

The pricing tier model is a fake marketing artifact that contradicts Senzen's honest, transparent mission. The following files, routes, and references must be purged:

| Target File / Directory | Action Required |
|:---|:---|
| `frontend/src/app/(landingPage)/pricing/page.tsx` | **DELETE FILE & DIRECTORY** (`rm -rf frontend/src/app/(landingPage)/pricing`) |
| `frontend/src/components/example/navbar.tsx` | **REMOVE** `<Link href="/pricing">Pricing</Link>` and all dead nav items |
| `frontend/src/components/example/footer.tsx` | **REMOVE** `{ label: "Pricing", href: "/pricing" }` |
| `frontend/src/components/ui/navbar-menu.tsx` | **PURGE** `pricingItems` array and `/pricing` references |
| `frontend/src/components/example/navbar.tsx` | **REMOVE** Announcement bar `/ #plans` link and `/createPlan` link |
| Next.js redirect checks | Ensure no rewrite or redirect in `next.config.mjs` or middleware routes to `/pricing` |

---

## 5. Spacing, Typography & Motion Rules

### Typography Rules
* **Headings**: Plus Jakarta Sans, font-weight 700, `letterSpacing: -0.025em`, lowercase (`sign in`, `create your account`, `senzen`).
* **Body / Labels**: Plus Jakarta Sans, font-weight 500/600 for labels, 400 for helper copy.
* **Numbers / Badges / Code**: JetBrains Mono for tags, version strings, error code identifiers.

### Spacing Scale
* `4px` (gap-1), `8px` (gap-2), `16px` (gap-4 / p-4), `24px` (p-6), `32px` (p-8).
* Auth card max-width: `440px`, padding: `24px` (mobile) to `32px` (desktop).

### Micro-Interactions & Motion
* **Hover State**: Subtle brightness/color transition (`transition-colors duration-150 ease-out`). No floating swoops, no 3D tilts.
* **Active / Press State**: Tactile micro-compression (`active:scale-[0.98] transition-transform duration-100`).
* **Focus State**: Clean 2px ring in Senzen green (`focus-visible:ring-2 focus-visible:ring-[#1EC072] focus-visible:ring-offset-2`).
* **Motion Reduction**: All transitions respect `prefers-reduced-motion: reduce`.
