# KHASHIKA - Project Context
> Source of truth. Cursor reads this FIRST.

## Status
- Completion: 85%
- Products: 704 active
- Sprint: Feature completion (Filters, Zoom, Stripe)
- Blocker: None

## Stack (immutable)
- Next.js 16 (App Router)
- Tailwind CSS v3.4.x (current)
- Supabase
- TypeScript strict
- lucide-react icons
- next/image with Sharp

## Design System
```
Primary:    #2596be (turquoise)
Accent:     #D4AF37 (gold)
Background: #F4EAD8 (cream)
Text:       #1a1a1a (dark)
```
- No rounded corners on products (rounded-none)
- Gold borders on interactive elements
- Hover: shadow-[0_0_15px_rgba(212,175,55,0.3)]

## Stable Components (do not break)
- Navbar.tsx
- Footer.tsx
- CartContext.tsx
- WishlistContext.tsx
- ProductCard.tsx
- AIChatbot.tsx

## In Progress
1. Advanced filters (price slider, material, stone)
2. Product zoom (lens effect)
3. Stripe integration

## Known Issues
- Drawer z-index conflicts
- Occasional Supabase 500 on high load

## Code Rules
- Server Components default, 'use client' only when needed
- try/catch on all API/DB calls
- Use @/ imports, never relative ../../
- Interfaces in lib/types/

## Last Updates
- 12/12: Image sync fixed (90% products)
- 12/12: Golden Glow design implemented
- 12/11: Navigation redesign complete

## BRICKMODE — Patch Request Template (mandatory)
Copy/paste this at the top of every request:

MODE: PLAN | PATCH
GOAL: <objective in 1 sentence>
SCOPE: <paths/folders impacted>
FILES: <opened/tagged files in Cursor>
CONSTRAINTS: <no new libs? perf? style rules?>
ASSUMPTIONS: <allowed assumptions if info missing>
TESTS I CAN RUN: <pnpm lint / pnpm build / pnpm test:e2e --grep checkout ...>
DONE WHEN: <3–6 acceptance checkboxes>

## Definition of Done (DoD)
### Boutique (filters / scroll)
- Filters reflected in URL query params
- Never render all products at once
- Pagination/cursor stable
- Infinite scroll only with fallback "Load more"

### Checkout (Stripe)
- Secrets server-only
- Webhook signature verified
- Payment confirmed only via webhook
- E2E checkout passes

### Routes snapshot (source of truth for paths)
- docs/routes.snapshot.txt

