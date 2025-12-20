# KHASHIKA - Project Context
> Source of truth. Cursor reads this FIRST.

## Status
- Completion: 85%
- Products: 704 active
- Sprint: Feature completion (Filters, Zoom, Stripe)
- Blocker: None

## Stack (immutable)
- Next.js 16 (App Router)
- Tailwind CSS v4
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