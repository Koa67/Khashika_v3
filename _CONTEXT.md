# KHASHIKA - Project Context
> Source of truth. Cursor reads this FIRST.
> Last updated: 2025-12-29

## Status
- Completion: 85%
- Products: 726 imported (704 with valid images)
- Sprint: Feature completion (Filters, Zoom, Stripe)
- Blocker: None

## Stack (immutable)
- Next.js 16 (App Router)
- Tailwind CSS v3.4.x (immutable - do not upgrade to v4)
- Supabase (Postgres + Auth + Storage)
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
- Dropdowns: bg-[#F4EAD8] (cream, not white)

## Stable Components (do not modify without ADR)
- Navbar.tsx
- Footer.tsx
- CartContext.tsx
- WishlistContext.tsx
- ProductCard.tsx
- AIChatbot.tsx
- components/ui/* (Shadcn)

## In Progress
1. Advanced filters (price slider, material, stone) — ADR-001
2. Product zoom (lens effect) — ADR-005
3. Stripe integration — ADR-006

## Known Issues
- Drawer z-index conflicts
- Filter logic broken (type/category mismatch)
- Occasional Supabase 500 on high load
- ~22% images missing

## Code Rules
- Server Components default, 'use client' only when needed
- try/catch on all API/DB calls
- Use @/ imports, never relative ../../
- Interfaces in lib/types/
- Prices in paise (not euros) — ADR-006

## Routes (source of truth)
```
/fr/shop                    # Boutique listing
/fr/bijoux/[category]       # Jewelry by category
/fr/accessoires/[category]  # Accessories by category
/fr/pierres/[category]      # Stones by category
/fr/product/[slug]          # Product detail
/fr/cart                    # Cart
/fr/checkout                # Checkout
/fr/login                   # Auth
```

## Last Updates
- 12/29: Filter logic identified as broken (type vs category)
- 12/28: Auth checkpoint created
- 12/19: Next.js upgraded to 16.0.10 (ADR-007)
- 12/12: Image sync fixed (78% products)
- 12/12: Golden Glow design implemented

---

## DEBUG_SHIELD 🐞 — Anti-Loop Protocol (mandatory when debugging)
This exists to kill infinite debug loops. Evidence only. No vibes.

### Core Rules (fail-closed)
- NO BLUFF:
  - If evidence is missing (logs/output/file content), answer UNKNOWN.
  - Request exactly ONE command OR ONE missing file/tag (not 10 questions).
- ONE-ITERATION:
  - One patch per reply. No multiple alternative patches in a single response.
- ONE-VERIFY:
  - Every patch must include exactly ONE verification command + expected outcome.
- VERDICT REQUIRED:
  - Every iteration ends with: PASS | FAIL — unchanged | FAIL — changed | BLOCKED
- CHANGE BUDGET (unless explicitly overridden in CONSTRAINTS):
  - Max 2 files touched
  - Max 40 lines changed total
  - No refactor, no renames, no formatting-only changes
  - No new deps, no new files (unless explicitly approved)
- STOP-LOSS:
  - If ITERATION >= 3 → MODE must be PLAN (ESCALATE). Stop patching.
  - If 2 consecutive FAIL → ESCALATE. Stop patching.

### ESCALATE Menu (choose ONE, do not mix)
A) Minimal Repro: isolate the smallest route/component that reproduces
B) Revert/Stash: return to last known good state
C) Git Bisect: locate the first bad commit
D) UI Isolation: strip overlays/positioning/z-index, reintroduce one by one
E) Data Fixture: replace remote data with a 3-item fixture to compare behavior

### Required Evidence on FAIL (paste raw)
- Command run + full output (no summaries)
- Symptom: unchanged or changed (and how)
- If UI: DOM probe output is required (screenshot optional)

### Flag-specific Probes (required when relevant)
- UI/CSS (need TWO probes minimum):
  - Probe 1: computed z-index/position/pointer-events for broken element + nearest overlay
  - Probe 2: bounding rect + stacking context hint (ancestor with position/transform/filter)
- DATA:
  - Prove the runtime data source (local JSON vs Supabase vs API route)
  - Paste 3 sample items (id/slug/price) from runtime output
- PERF:
  - Provide a before/after metric (build time, route load, action duration)
- AUTH/SEC:
  - State risk + mitigation (no secrets client-side, webhook verification, etc.)
- I/O:
  - Define error behavior (retry/fail-fast/user message) and never log secrets

---

## BRICKMODE — Patch Request Template (mandatory)
Copy/paste this at the top of every request:
```
MODE: PLAN | PATCH
ITERATION: 1
LAST VERDICT: N/A (first run) | PASS | FAIL — unchanged | FAIL — changed | BLOCKED
GOAL: <objective in 1 sentence>
SCOPE: <paths/folders impacted>
FILES: <opened/tagged files in Cursor>
CONSTRAINTS: <no new libs? perf? style rules? allow >2 files? allow >40 lines?>
ASSUMPTIONS: <allowed assumptions if info missing>
TESTS I CAN RUN: <pnpm lint / pnpm build / pnpm test:e2e --grep checkout ...>
DONE WHEN: <3–6 acceptance checkboxes>
```

## FAIL REPORT (paste this after every verification)
```
ITÉRATION: <number>
VERDICT: PASS | FAIL — unchanged | FAIL — changed | BLOCKED
VERIFY COMMAND:
RAW OUTPUT:
WHAT CHANGED:
NEXT ACTION: PATCH (only if iteration <3 and not 2x FAIL) | ESCALATE (A/B/C/D/E)
```

---

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

### Terminal batching rule
- If commands can run together, output ONE multi-line bash block.
- Split blocks only when a check/stop/choice is needed.
- Never include explanations inside bash blocks.

## CI Gates (must pass before merge)
- pnpm lint
- pnpm build
- pnpm test:e2e --grep checkout (minimum when touching checkout)

## Decision Log (ADRs)
| ID | Decision | Date |
|----|----------|------|
| ADR-001 | Filters persist in URL only | 2025-12-15 |
| ADR-002 | Chatbot anonymous first | 2025-12-15 |
| ADR-003 | One-page checkout | 2025-12-15 |
| ADR-004 | Claude Haiku 4.5 for chatbot | 2025-12-15 |
| ADR-005 | Canvas-based zoom (no library) | 2025-12-15 |
| ADR-006 | Prices stored in paise | 2025-12-15 |
| ADR-007 | Next.js 16.0.10 upgrade | 2025-12-19 |

## E2E Policy (BRICKMODE)
- Checkout E2E is required only when Stripe env is configured (CI/staging).
- Locally it may be skipped if keys are missing.