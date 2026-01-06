# KHASHIKA — Claude Code Configuration
> Source of truth for Claude Code. Read FIRST before any action.
> Last updated: 2026-01-06 (session 2)

---

## 🎯 PROJECT IDENTITY

**Khashika v2.0** — Luxury Indian jewelry e-commerce platform
- **Status:** 90% complete
- **Products:** 726 imported (704 with valid images)
- **Currency:** EUR (stored in centimes, displayed in €)
- **Language:** French (fr)
- **Owner:** NKDR

---

## 🛠️ TECH STACK (IMMUTABLE — DO NOT CHANGE)

| Component | Version | Notes |
|-----------|---------|-------|
| Framework | Next.js 16.0.10 | App Router |
| Language | TypeScript 5 | strict mode |
| Styling | Tailwind CSS 3.4.x | **DO NOT upgrade to v4** |
| Database | Supabase | Postgres + Auth + Storage |
| Payment | Stripe | pending implementation |
| Icons | lucide-react | **ONLY** — no other icon libs |
| Images | next/image + Sharp | always use `getValidImageUrl()` |
| AI | Claude Haiku 4.5 | for chatbot |

**Forbidden:**
- ❌ New dependencies without explicit approval
- ❌ Stack changes (Next.js/Supabase/Stripe is FINAL)
- ❌ Tailwind v4 upgrade
- ❌ Other icon libraries

---

## 🎨 DESIGN SYSTEM

```css
/* Colors */
--primary:     #2596be  /* Turquoise — CTAs, links, hovers */
--accent:      #D4AF37  /* Gold — luxury accents, borders */
--background:  #F4EAD8  /* Cream — backgrounds, dropdowns */
--text:        #1a1a1a  /* Dark — body text */
--coral:       #FF6B6B  /* Error states */
--emerald:     #50C878  /* Success states */
```

```tsx
// Tailwind classes
bg-[#2596be]   // Primary
text-[#D4AF37] // Gold accent
bg-[#F4EAD8]   // Cream background
text-[#1a1a1a] // Dark text

// Golden hover effect (luxury signature)
hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:border-[#D4AF37]

// Product cards
rounded-none border border-gray-200  // Sharp corners, no rounded
```

**Design Rules:**
- No rounded corners on product cards (`rounded-none`)
- Gold borders on interactive elements
- Dropdowns: cream background (`#F4EAD8`), not white
- Mobile-first (768px breakpoint)

---

## 📁 PROJECT STRUCTURE

```
app/
├── [locale]/              # /fr/...
│   ├── shop/page.tsx      # Boutique listing
│   ├── boutique/          # Alternative shop route
│   ├── bijoux/[type]/     # Jewelry by category
│   ├── accessoires/[type]/ # Accessories by category
│   ├── pierres/[type]/    # Stones by category
│   ├── product/[slug]/    # Product detail
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout (one-page)
│   ├── login/             # Auth
│   ├── account/           # User account
│   └── admin/             # Admin panel
├── api/
│   └── webhooks/stripe/   # Stripe webhooks
├── layout.tsx             # Root layout
└── globals.css            # Global styles

components/
├── ui/                    # Shadcn primitives (DO NOT MODIFY)
├── product/               # ProductCard, Grid, Gallery
├── layout/                # Layout components
├── filters/               # Filter components
├── checkout/              # Checkout components
├── Navbar.tsx             # Main navigation
├── Footer.tsx             # Footer
├── AIChatbot.tsx          # AI assistant
├── SidebarFilters.tsx     # Shop filters
└── ProductCard.tsx        # Product card

lib/
├── data/
│   └── products-ultimate.json  # 726 products (SOURCE OF TRUTH)
├── db/
│   ├── supabase.ts        # DB client (STABLE)
│   └── schema.sql         # DB schema
├── types/                 # TypeScript interfaces
├── utils/
│   └── images.ts          # Image helpers
├── hooks/                 # Custom hooks
├── ai/                    # AI/chatbot logic
└── validators/            # Zod schemas

contexts/
├── CartContext.tsx        # Cart state (STABLE)
└── WishlistContext.tsx    # Wishlist state (STABLE)
```

---

## 🔒 PROTECTED FILES (DO NOT MODIFY)

These files are **stable and tested**. Do not modify without explicit approval and ADR:

### Core Infrastructure
- `lib/db/supabase.ts` — DB client
- `lib/db/schema.sql` — DB schema
- `contexts/CartContext.tsx` — Cart state
- `contexts/WishlistContext.tsx` — Wishlist state

### Data (Source of Truth)
- `lib/data/products-ultimate.json` — 726 products
- `lib/data/*.json` — All JSON data files

### UI Primitives
- `components/ui/*` — Shadcn components (all files)

### Configuration
- `.env*` — Environment variables
- `next.config.ts` — Next.js config
- `tailwind.config.ts` — Tailwind config (v3.4.x)
- `tsconfig.json` — TypeScript config

### Stable Components
- `components/Navbar.tsx`
- `components/Footer.tsx`
- `components/ProductCard.tsx`
- `components/AIChatbot.tsx`

### Assets (binary)
- `public/images/*` — All images
- `*.png`, `*.jpg`, `*.webp`, `*.svg`

---

## 📐 CODE RULES

### TypeScript
- Strict mode enabled — **no `any`**
- Interfaces in `lib/types/`
- Use `@/` imports, never relative `../../`

### Components
- Server Components by default
- `'use client'` only when needed (hooks, events, browser APIs)
- Always handle loading/error states

### Data Fetching
- Server Components for initial data
- `try/catch` on ALL Supabase/API calls
- User-friendly error messages (French)

### Images
```tsx
// ALWAYS use this pattern
import { getValidImageUrl } from '@/lib/utils/images'

<Image
  src={getValidImageUrl(product.image)}
  alt={product.name}
  width={400}
  height={400}
/>
```

### Prices
- Stored in **centimes** (not euros) — ADR-006
- 100 centimes = 1€
- Display: `formatPrice(priceInCentimes)` → "12,50 €"

### API Routes
```tsx
export async function GET(req: NextRequest) {
  try {
    const data = await supabase.from('table').select()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[ROUTE_NAME]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
```

---

## 🚨 ANTI-LOOP PROTOCOL (MANDATORY)

**3 attempts MAX, then STOP and PIVOT.**

### Rules
1. **NO BLUFF:** If evidence is missing → say "UNKNOWN" → request ONE command
2. **ONE PATCH:** One fix per response, no alternatives
3. **VERIFY:** Every patch includes verification command + expected result
4. **CHANGE BUDGET:** Max 2 files, max 40 lines (unless explicitly overridden)
5. **STOP-LOSS:** After 2 consecutive failures → ESCALATE

### Escalation Options (choose ONE)
- **A) Minimal Repro:** Isolate smallest reproducible case
- **B) Revert/Stash:** Return to last known good state
- **C) Git Bisect:** Find first bad commit
- **D) UI Isolation:** Strip CSS/positioning, reintroduce one by one
- **E) Data Fixture:** Replace data with 3-item fixture

### Terminal Rules
- Commands that can run together → ONE bash block
- Split blocks only when verification/choice needed
- **Never** put explanations inside bash blocks
- Paths with brackets must be quoted: `'app/[locale]/...'`

---

## 📋 ARCHITECTURAL DECISIONS (ADRs)

| ID | Decision | Status | Date |
|----|----------|--------|------|
| ADR-001 | Filters persist in URL only (no localStorage) | ACCEPTED | 2025-12-15 |
| ADR-002 | Chatbot anonymous first, auth optional | ACCEPTED | 2025-12-15 |
| ADR-003 | One-page checkout with accordions | ACCEPTED | 2025-12-15 |
| ADR-004 | Claude Haiku 4.5 for chatbot | ACCEPTED | 2025-12-15 |
| ADR-005 | Canvas-based zoom (no library) | ACCEPTED | 2025-12-15 |
| ADR-006 | Prices stored in centimes | ACCEPTED | 2025-12-15 |
| ADR-007 | Next.js 16.0.10 security upgrade | ACCEPTED | 2025-12-19 |

---

## 🛤️ ROUTES (Source of Truth)

```
/fr                         # Homepage
/fr/shop                    # Boutique listing (main)
/fr/boutique                # Boutique (alternative)
/fr/bijoux/[type]           # Jewelry by category
/fr/accessoires/[type]      # Accessories by category
/fr/pierres/[type]          # Stones by category
/fr/product/[slug]          # Product detail
/fr/cart                    # Cart
/fr/checkout                # Checkout (one-page)
/fr/login                   # Login/Register
/fr/account                 # User account
/fr/admin                   # Admin panel
/fr/contact                 # Contact
/fr/notre-histoire          # About us
/fr/guide-pierres           # Stone guide
/fr/entretien               # Care guide
/fr/legal/*                 # Legal pages
```

---

## ⚠️ KNOWN ISSUES

- ~22% images missing (some products without valid images)
- Drawer z-index conflicts on mobile
- Occasional Supabase 500 on high load

---

## 🚀 REMAINING FEATURES (10%)

1. **Stripe Payment** — Replace mockup with real payment (ADR-003)
2. **AI Chatbot Enhancement** — Claude Haiku 4.5 ambassador (ADR-004)

---

## ✅ QUALITY GATES (Must pass before merge)

```bash
pnpm lint          # No errors
pnpm build         # Successful build
pnpm test:e2e      # E2E tests pass (when configured)
```

---

## 🔧 USEFUL COMMANDS

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm lint                   # Run linter
pnpm lint --fix             # Fix lint errors

# Git safety
git stash push -u -m "backup"  # Quick backup before changes
git stash pop               # Restore if needed

# Check routes
ls -la 'app/[locale]/'      # List locale routes
```

---

## 📝 PATCH REQUEST TEMPLATE

When requesting code changes, provide:

```
MODE: PLAN | PATCH
ITERATION: 1
GOAL: <objective in 1 sentence>
SCOPE: <paths/folders impacted>
FILES: <files to modify>
CONSTRAINTS: <no new libs? max lines? etc.>
DONE WHEN: <acceptance criteria>
```

---

## 🔄 FAIL REPORT TEMPLATE

After verification:

```
ITERATION: <number>
VERDICT: PASS | FAIL — unchanged | FAIL — changed | BLOCKED
VERIFY COMMAND: <command run>
OUTPUT: <raw output>
NEXT ACTION: PATCH | ESCALATE (A/B/C/D/E)
```

---

## 🎯 SUCCESS CRITERIA FOR RESPONSES

A response is successful if:
1. Zero follow-up questions needed for clarity
2. Output is immediately usable (copy-paste ready)
3. Includes verification command
4. Respects change budget (2 files, 40 lines max)
5. No new dependencies without approval

---

## 📚 REFERENCE DOCS

- Master Brief: `_KHASHIKA_MASTER_BRIEF.md`
- ADRs: `khashika-ADR-base.md`
- Anti-Loop Protocol: `PROTOCOLE_ANTI_LOOP.md`
- Checkpoint: `KHASHIKA_CHECKPOINT_2025-12-28.md`
- Schema SQL: `lib/db/schema.sql`

---

## 📅 RECENT CHANGES (2026-01-06)

### Session 1 - Hero & Product Pages
- **Hero Banner** — New full-width image with info badges on right column
- **Scroll Chevron** — Clickable bounce animation to scroll to collections
- **Stone Info** — Product pages now display stone details (lithotherapy)
- **Image Magnifier** — Fixed zoom distortion (object-contain calculation)

### Session 2 - Account & Content Pages
- **Account Page** — Complete redesign with member benefits, cart section
- **Wishlist to Cart** — Add to cart directly from wishlist in account page
- **Confirmation Modals** — Logout, clear cart, clear wishlist require confirmation
- **Content Pages Harmonized** — Unified style across Khashika section:

#### Style Standard for Content Pages (univers, guide-pierres, notre-histoire, entretien)
```tsx
// Hero section
<section className="bg-[#2D2926] text-white py-10">
  <p className="text-[#EAB615] text-sm uppercase tracking-widest mb-2">Subtitle</p>
  <h1 className="text-2xl font-bold mb-2">Title</h1>
  <p className="text-sm text-white/80">Description</p>
</section>

// Section headers
<h2 className="text-base font-bold text-[#2D2926] mb-4">Section Title</h2>

// Body text
<p className="text-sm text-[#2D2926]/85 leading-relaxed">...</p>

// CTA buttons
<Link className="px-6 py-2.5 bg-[#EAB615] text-[#2D2926] text-sm font-medium">
```

### New Files Created
- `lib/data/stones.ts` — Stone data with findStoneByName() helper

---

---

## 🎯 VS CODE SNIPPETS (tape le préfixe + Tab)

| Préfixe | Description |
|---------|-------------|
| `ksc` | Server Component avec metadata |
| `kcc` | Client Component |
| `kapi` | API Route avec try/catch |
| `khook` | Custom hook |
| `kimg` | Image avec getValidImageUrl |
| `ktry` | Try-catch pattern |
| `kbtn` | Button stylé Khashika |
| `cpatch` | Template patch request Claude |
| `cfail` | Template fail report Claude |

---

## 🔧 SCRIPTS NPM

```bash
pnpm dev          # Serveur dev
pnpm build        # Build prod
pnpm check        # Lint + Build
pnpm check:quick  # Lint seul
pnpm clean        # Clear .next cache
pnpm types        # Check TypeScript
pnpm dev:doctor   # Diagnostic ports/env
```

---

*This file replaces .cursorrules, _CONTEXT.md, and go.md for Claude Code.*
*Keep it updated after significant changes.*
