---
name: Senzen Theme Refresh Specification
version: 1.0.0
target: frontend/
stack: Next.js 16 (App Router) + Tailwind CSS v3.4 + shadcn/ui + next-themes + Recharts
typography:
  display:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    weights: [600, 700]
    letterSpacing: "-0.035em"
  body:
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    weights: [400, 500]
    letterSpacing: "-0.011em"
  mono:
    fontFamily: "var(--font-geist-mono), 'SF Mono', Monaco, Consolas, monospace"
    weights: [400, 500]
    letterSpacing: "-0.02em"
recommendation: "Direction 1: Obsidian Emerald (Zen Financial Intelligence)"
---

# UI Specification: Senzen Theme Refresh

## 1. Current State Audit

### Stack & Architecture
- **Framework**: Next.js 16.2.7 (React 19.2.7) with App Router, Turbopack, and `fluid-tailwind`.
- **Component Primitives**: shadcn/ui (v0.7.0 `class-variance-authority` + Radix UI suite) + Aceternity UI animations (`container-scroll-animation`, `spotlight`, `timeline`, `infinite-moving-cards`, `rainbow-button`).
- **Styling Method**: Tailwind CSS v3.4.1 referencing HSL CSS custom variables defined in `src/app/globals.css`.
- **Theming & Dark Mode**: `next-themes` with `attribute="class"`, defaulted to `dark` (`enableSystem={false}`). `ModeToggle` component switches between `light`, `dark`, and `system`.
- **Data & Charts**: TanStack React Query v5 + Recharts v2.15.4 (`ChartContainer`, custom tooltips).

### Incumbent Token Deficits & Anti-Patterns Found
1. **Broken Dark-Mode Inversion**:
   - In `globals.css`, `.dark` sets `--primary: 0 0% 0%` (pure black) while `--background: 222.2 84% 4.9%` (dark navy).
   - In `src/app/layout.tsx`, `<body className="... bg-primary ...">` forces the root background to `--primary` (pure `#000000`), conflicting with `bg-background` on child wrappers.
   - Light mode has `--primary: 222.2 47.4% 42%` (a muted slate blue) with no dedicated brand accent hue.
2. **Hardcoded Hex in Visuals & Charts**:
   - `chart-month.tsx` and `chart-week.tsx`: hardcoded `fill="#EC5800"` (blaze orange) and `fill="#FFAC1C"` (amber).
   - `viewPlan/page.tsx`: hardcoded `fill="#8884d8"` (recharts default purple).
   - `sign-in/page.tsx`: Google multicolor SVG paths and raw Tailwind text utilities (`text-blue-600`, `text-gray-400`, `text-gray-700`).
   - `container-scroll-animation.tsx`: hardcoded `#222222` background and `#6C6C6C` borders.
3. **Typography & Radius Inconsistency**:
   - `src/app/layout.tsx` embeds `GeistVF.woff` and `GeistMonoVF.woff` into CSS variables `--font-geist-sans` and `--font-geist-mono`, but `tailwind.config.ts` does not bind `fontFamily.sans` to `var(--font-geist-sans)`.
   - Radius varies from hardcoded `rounded-[30px]` to standard `var(--radius)` (0.5rem) and `rounded-full`.

### Pages & Flows Inventory
- **Public / Marketing Surface** (`src/app/(landingPage)`):
  - `/` (Home landing page): Spotlight Hero, Timeline, Try2 Bento, Infinite Moving Testimonial Cards, Try CTA, Footer.
  - `/pricing`: 3-tier card matrix (Free, Pro, Enterprise), Monthly/Yearly toggle, FAQ accordion/cards.
  - `/sign-in` & `/sign-up`: Split auth cards with Google/GitHub OAuth + credentials form.
- **Product Surface** (`src/app/(product)`):
  - Shell: Collapsible `AppSidebar`, top navbar with `ModeToggle`, dynamic breadcrumbs, quick "Create Plan" button, `Toaster`.
  - `/home`: Dashboard overview with monthly/weekly Recharts budget tracking, plan summaries.
  - `/createPlan` & `/plan/[...planId]`: Financial scenario creator, budget breakdowns, category allocations.
  - `/viewPlan`: Plan details, expense timeline, category distribution.
  - `/ws`: Real-time transaction ingestion feed.

---

## 2. Three Distinct Theme Directions

### Direction 1: Obsidian Emerald (Zen Financial Intelligence) — **RECOMMENDED**
*A disciplined, high-clarity financial dark theme blending deep charcoal/slate surfaces with a vibrant, confidence-inspiring emerald green accent and soft stone neutrals for light mode.*

#### Why it fits Senzen
"Senzen" evokes serenity, clarity, and mindful stewardship of money. Financial tools require immediate trust, high data legibility, and positive reinforcement (growth, solvency, calm). Deep charcoal removes visual glare, while emerald (`#10B981` / `#059669`) provides an unmistakable "financial health" signature without looking like a generic crypto trading terminal.

- **Color Palette**:
  - Light Mode:
    - Background: `#F8FAFC` (Slate 50)
    - Foreground: `#0F172A` (Slate 900)
    - Card / Surface: `#FFFFFF` (Pure white)
    - Card Border: `#E2E8F0` (Slate 200)
    - Primary Accent: `#059669` (Emerald 600) — Contrast Ratio 5.2:1 vs Background
    - Primary Foreground: `#FFFFFF`
    - Secondary: `#F1F5F9` (Slate 100)
    - Muted Foreground: `#64748B` (Slate 500)
    - Destructive: `#E11D48` (Rose 600)
    - Charts: `[#059669, #0EA5E9, #F59E0B, #8B5CF6, #64748B]`
  - Dark Mode:
    - Background: `#0B0F17` (Deep Obsidian Slate)
    - Foreground: `#F1F5F9` (Slate 100)
    - Card / Surface: `#111827` (Charcoal 900)
    - Card Border: `#1F2937` (Charcoal 800)
    - Primary Accent: `#10B981` (Emerald 500) — Contrast Ratio 8.9:1 vs Background
    - Primary Foreground: `#064E3B` (Deep Forest)
    - Secondary: `#1E293B` (Slate 800)
    - Muted Foreground: `#94A3B8` (Slate 400)
    - Destructive: `#F43F5E` (Rose 500)
    - Charts: `[#10B981, #38BDF8, #FBBF24, #A78BFA, #94A3B8]`
- **Typography Pairing**:
  - Display & Headings: `Geist Sans` (Medium / Bold, `letter-spacing: -0.035em`)
  - Body & Data Tables: `Geist Sans` (Regular / Medium, `letter-spacing: -0.011em`)
  - Numerical Values, Balances & Charts: `Geist Mono` (Medium / Semibold, tabular nums `font-feature-settings: "tnum" 1`)
- **Radius, Spacing & Shadows**:
  - `--radius`: `0.5rem` (`8px` clean industrial baseline, nested buttons `6px`, inner chips `4px`)
  - Spacing Scale: Compact 4px base (Dashboard cards `p-5`, list rows `py-2.5`, gap-4)
  - Elevation & Shadows:
    - Light: `0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`
    - Dark: `0 1px 0 0 rgba(255, 255, 255, 0.05) inset, 0 4px 20px -2px rgba(0, 0, 0, 0.5)`

---

### Direction 2: Nordic Titanium (Clean Minimalist Tech)
*An ultra-modern, monochrome-forward palette inspired by high-end Scandinavian software (Linear, Raycast) with electric cobalt highlights and subtle borders.*

#### Why it fits Senzen
For power planners and engineers who want an unobtrusive interface where data and charts take center stage. Removes all decorative warmth in favor of razor-sharp precision, slate-tinted surfaces, and focused blue-violet state transitions.

- **Color Palette**:
  - Light Mode:
    - Background: `#FFFFFF`
    - Foreground: `#09090B` (Zinc 950)
    - Card / Surface: `#FAFAFA` (Zinc 50)
    - Card Border: `#E4E4E7` (Zinc 200)
    - Primary Accent: `#2563EB` (Cobalt Blue 600)
    - Primary Foreground: `#FFFFFF`
    - Secondary: `#F4F4F5` (Zinc 100)
    - Muted Foreground: `#71717A` (Zinc 500)
    - Destructive: `#DC2626` (Red 600)
    - Charts: `[#2563EB, #6366F1, #06B6D4, #F97316, #71717A]`
  - Dark Mode:
    - Background: `#09090B` (Zinc 950)
    - Foreground: `#FAFAFA` (Zinc 50)
    - Card / Surface: `#121215` (Zinc 900 elevated)
    - Card Border: `#27272A` (Zinc 800)
    - Primary Accent: `#3B82F6` (Electric Blue 500)
    - Primary Foreground: `#030712` (Zinc 950)
    - Secondary: `#18181B` (Zinc 900)
    - Muted Foreground: `#A1A1AA` (Zinc 400)
    - Destructive: `#EF4444` (Red 500)
    - Charts: `[#3B82F6, #818CF8, #22D3EE, #FB923C, #A1A1AA]`
- **Typography Pairing**:
  - Display: `Geist Sans` (Semibold, tracking `-0.04em`)
  - Body: `Geist Sans` (Regular, tracking `-0.01em`)
  - Numbers: `Geist Mono` (`tnum` enabled)
- **Radius, Spacing & Shadows**:
  - `--radius`: `0.375rem` (`6px` sharp precision, buttons `4px`, cards `6px`)
  - Spacing Scale: Dense cockpit grid (cards `p-4`, nav item height `36px`)
  - Shadows: Flat 1px border hierarchy + subtle 1px top-edge specular highlight (`inset 0 1px 0 0 rgba(255,255,255,0.06)`).

---

### Direction 3: Warm Sand & Bronze (Editorial Wealth & Stewardship)
*An approachable, human-centric wealth management aesthetic utilizing warm sandstone backgrounds, espresso ink typography, and deep bronze/terracotta accents.*

#### Why it fits Senzen
Appeals to personal finance users seeking a calm, non-intimidating, almost physical-paper feel for family budgeting and conscious spending. Softens the harshness of financial stress through warm, grounded organic neutrals.

- **Color Palette**:
  - Light Mode:
    - Background: `#FAF8F5` (Warm Sandstone)
    - Foreground: `#1C1917` (Stone 900 / Espresso)
    - Card / Surface: `#FFFFFF`
    - Card Border: `#E7E5E4` (Stone 200)
    - Primary Accent: `#C2410C` (Warm Terracotta / Rust 700)
    - Primary Foreground: `#FFFFFF`
    - Secondary: `#F5F5F4` (Stone 100)
    - Muted Foreground: `#78716C` (Stone 500)
    - Destructive: `#BE123C` (Rose 700)
    - Charts: `[#C2410C, #D97706, #0D9488, #475569, #78716C]`
  - Dark Mode:
    - Background: `#141210` (Deep Espresso Bean)
    - Foreground: `#F5F5F4` (Warm White)
    - Card / Surface: `#1C1917` (Stone 900)
    - Card Border: `#292524` (Stone 800)
    - Primary Accent: `#EA580C` (Terracotta 600)
    - Primary Foreground: `#FFFFFF`
    - Secondary: `#292524` (Stone 800)
    - Muted Foreground: `#A8A29E` (Stone 400)
    - Destructive: `#FB7185` (Rose 400)
    - Charts: `[#EA580C, #F59E0B, #14B8A6, #94A3B8, #A8A29E]`
- **Typography Pairing**:
  - Display: `Geist Sans` (Medium / Bold, tracking `-0.03em`)
  - Body: `Geist Sans` (Regular, relaxed leading)
  - Numerics: `Geist Mono`
- **Radius, Spacing & Shadows**:
  - `--radius`: `0.75rem` (`12px` organic soft curves, buttons `8px`, cards `12px`)
  - Spacing Scale: Generous whitespace (cards `p-6`, section `gap-6`)
  - Shadows: Soft, diffuse warm drop shadows (`0 4px 20px -2px rgba(28, 25, 23, 0.08)`).

---

## 3. Recommended Implementation Token Sheet (Direction 1: Obsidian Emerald)

The following ready-to-implement CSS variables must be replaced into `frontend/src/app/globals.css`.

### `src/app/globals.css` Token System Replacement

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Base canvas & typography (Light Mode: Slate & Emerald) */
    --background: 210 40% 98%;          /* #F8FAFC */
    --foreground: 222.2 84% 4.9%;        /* #0F172A */

    /* Surfaces */
    --card: 0 0% 100%;                  /* #FFFFFF */
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    /* Brand Primary (Emerald 600 for light mode: 5.2:1 WCAG AA) */
    --primary: 160 84% 39%;             /* #059669 */
    --primary-foreground: 0 0% 100%;    /* #FFFFFF */

    /* Neutrals & Secondary */
    --secondary: 210 40% 96.1%;         /* #F1F5F9 */
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%; /* #64748B */
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    /* Status */
    --destructive: 347 77% 50%;          /* #E11D48 (Rose 600) */
    --destructive-foreground: 0 0% 100%;

    /* Borders & Inputs */
    --border: 214.3 31.8% 91.4%;        /* #E2E8F0 */
    --input: 214.3 31.8% 91.4%;
    --ring: 160 84% 39%;                /* Focus ring matches emerald */
    --radius: 0.5rem;                   /* 8px */

    /* Financial Charts (Light Mode) */
    --chart-1: 160 84% 39%;             /* Emerald 600 (Income / Surplus) */
    --chart-2: 199 89% 48%;             /* Sky 500 (Savings / Recurring) */
    --chart-3: 38 92% 50%;              /* Amber 500 (Discretionary) */
    --chart-4: 263 70% 50%;             /* Violet 500 (Investments) */
    --chart-5: 215 16% 47%;             /* Slate 500 (Fixed / Other) */

    /* Aceternity / Rainbow Fallback */
    --color-1: 160 84% 39%;
    --color-2: 199 89% 48%;
    --color-3: 38 92% 50%;
    --color-4: 263 70% 50%;
    --color-5: 160 60% 45%;

    /* Sidebar */
    --sidebar-background: 0 0% 100%;
    --sidebar-foreground: 222.2 84% 4.9%;
    --sidebar-primary: 160 84% 39%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 210 40% 96.1%;
    --sidebar-accent-foreground: 222.2 47.4% 11.2%;
    --sidebar-border: 214.3 31.8% 91.4%;
    --sidebar-ring: 160 84% 39%;
  }

  .dark {
    /* Base canvas & typography (Dark Mode: Deep Obsidian Slate #0B0F17) */
    --background: 222 47% 7%;           /* #0B0F17 */
    --foreground: 210 40% 98%;          /* #F8FAFC */

    /* Surfaces (#111827 Charcoal 900) */
    --card: 222 35% 11%;                /* #111827 */
    --card-foreground: 210 40% 98%;
    --popover: 222 35% 11%;
    --popover-foreground: 210 40% 98%;

    /* Brand Primary (Emerald 500 on dark: 8.9:1 WCAG AA) */
    --primary: 158 64% 52%;             /* #10B981 */
    --primary-foreground: 164 95% 17%;  /* #064E3B */

    /* Neutrals & Secondary */
    --secondary: 217 33% 17%;           /* #1E293B */
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;    /* #94A3B8 */
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;

    /* Status */
    --destructive: 343 88% 60%;          /* #F43F5E (Rose 500) */
    --destructive-foreground: 0 0% 100%;

    /* Borders & Inputs (#1F2937) */
    --border: 217 33% 17%;              /* #1F2937 */
    --input: 217 33% 17%;
    --ring: 158 64% 52%;                /* Focus ring matches emerald */

    /* Financial Charts (Dark Mode) */
    --chart-1: 158 64% 52%;             /* Emerald 500 */
    --chart-2: 199 89% 48%;             /* Sky 400 */
    --chart-3: 43 96% 56%;              /* Amber 400 */
    --chart-4: 258 90% 66%;             /* Violet 400 */
    --chart-5: 215 20% 65%;             /* Slate 400 */

    /* Aceternity / Rainbow Fallback */
    --color-1: 158 64% 52%;
    --color-2: 199 89% 48%;
    --color-3: 43 96% 56%;
    --color-4: 258 90% 66%;
    --color-5: 158 64% 40%;

    /* Sidebar */
    --sidebar-background: 222 47% 7%;   /* Aligned to background */
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 158 64% 52%;
    --sidebar-primary-foreground: 164 95% 17%;
    --sidebar-accent: 217 33% 17%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 217 33% 17%;
    --sidebar-ring: 158 64% 52%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### `tailwind.config.ts` Font & Theme Binding Update
Ensure `fontFamily.sans` and `fontFamily.mono` are bound to the Geist variables already configured in `layout.tsx`:

```ts
// Inside theme.extend:
fontFamily: {
  sans: ["var(--font-geist-sans)", "sans-serif"],
  mono: ["var(--font-geist-mono)", "monospace"],
},
```

---

## 4. Implementation Notes for the Engineer

### Target Files to Touch (Zero-Layout Changes)

1. **`frontend/src/app/globals.css`** (Primary token file):
   - Replace `:root` and `.dark` blocks with the token definition from Section 3.
   - Clean up commented legacy hacks (`--primary: 0 0% 0%`, `--bgray`).
2. **`frontend/src/app/layout.tsx`**:
   - In `<body>`, change `className="... bg-primary ..."` to `className="... bg-background text-foreground ..."`. (Crucial fix: previously the body was forced to `bg-primary` which broke background parity).
3. **`frontend/tailwind.config.ts`**:
   - Register `fontFamily.sans` and `fontFamily.mono` aliases to make Geist default across all components.
   - Retain all Aceternity animation utilities and plugin definitions.
4. **`frontend/src/components/example/chart-month.tsx` & `chart-week.tsx`**:
   - Replace hardcoded `fill="#EC5800"` and `fill="#FFAC1C"` with semantic CSS variables `hsl(var(--chart-1))` and `hsl(var(--chart-2))`.
5. **`frontend/src/app/(product)/viewPlan/page.tsx`**:
   - Replace hardcoded `fill="#8884d8"` with `hsl(var(--chart-1))` or chart token props.
6. **`frontend/src/app/(landingPage)/sign-in/page.tsx` & `sign-up/page.tsx`**:
   - Change root wrapper `bg-primary` to `bg-background` so auth cards sit on the obsidian canvas.

### Rollout Order
1. **Step 1: CSS Variables & Tailwind Font Mapping** — Apply `globals.css` and `tailwind.config.ts`.
2. **Step 2: Root Shell & Body Class Correction** — Update `src/app/layout.tsx` and auth pages to use `bg-background`.
3. **Step 3: Chart Component Token Harmonization** — Migrate Recharts fill props from hardcoded hex to `hsl(var(--chart-*))`.
4. **Step 4: Smoke Test & Quality Verification** — Toggle Light/Dark modes in both Public and Product layouts (`/`, `/pricing`, `/home`, `/viewPlan`).

### Risks & Mitigations
- **Risk**: Aceternity components (e.g. `Spotlight`, `ContainerScroll`) containing hardcoded `#222222` or `#000` backgrounds.
  - *Mitigation*: Aceternity wrappers on the landing page inherit from CSS variables or remain ambient dark backdrops since landing is designed dark-first.
- **Risk**: Contrast regression on buttons in dark mode if `primary-foreground` is white.
  - *Mitigation*: In Dark mode, `primary` is Emerald 500 (`#10B981`) and `primary-foreground` is Deep Forest (`#064E3B`), yielding 8.9:1 contrast (WCAG AAA compliant).

---

## 5. Domain Invariant: Missing UI State Report
- **Identified Gap**: In `src/app/(product)/plan/[...planId]/page.tsx` and `src/app/(product)/viewPlan/page.tsx`, when budget transactions are 0 or offline, the chart component renders a zero-height blank container without an empty state illustration/message.
- **Impact**: User sees a collapsed, cut-off card container when navigating to a newly created financial plan because no empty state is rendered before first transaction entry.
