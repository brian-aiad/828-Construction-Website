# Workstream 2 — Mobile Audit + Footer Fix

**Goal:** Audit every page at 390×844 (iPhone 14) and 768×1024 (iPad). Fix footer. Fix all mobile layout issues found.

## Footer Issues (confirmed)

### Mobile footer (`lg:hidden` block)
- Navigation section uses `flex flex-wrap gap-x-4 gap-y-0` — zero vertical gap between wrapped links
- Services section same pattern: `flex flex-wrap gap-x-4 gap-y-0`
- Link tap targets: `py-2` = 16px total height — below 44px minimum
- Fix: Switch to `grid grid-cols-2` for nav and services on mobile, `py-3` per link (min 48px touch target)

### Desktop footer (no issues confirmed, check):
- Service area shows `SITE.serviceArea.slice(0, 5)` — only 5 of 8 cities
- Fix: Show all 8 cities

## Mobile checklist per page

### Mandatory checks
- [ ] No horizontal overflow (x-scroll)
- [ ] Hero text readable and not overflowing
- [ ] Above-fold content visible without scrolling
- [ ] Tap targets ≥ 44px height on all interactive elements
- [ ] Buttons/CTAs in hero accessible on 390px width
- [ ] GSAP `shouldAnimate()` returns false → mobile reveals fire instead
- [ ] No pinned sections creating dead scroll zones
- [ ] Text never overflows container bounds

### Per-page mobile specific
| Page | Mobile risk |
|------|-------------|
| Home | HeroSections scroll indicator (hidden sm:flex — verified), BuildingScience pin |
| About | Horizontal editorial timeline (horizontal scroll on mobile?) |
| Services | ServiceChoiceCards clip-punch on mobile |
| Services/* | PinnedWhy 280vh pin — needs matchMedia |
| Process | 460vh pinned timeline — mobile version exists? |
| Contact | Form layout on 390px — grid cols-1 |

## Fixes to implement

1. **Footer mobile nav grid** — `flex flex-wrap gap-y-0` → `grid grid-cols-2 gap-y-3`
2. **Footer desktop service area** — show all 8 cities instead of 5
3. **Footer "20+ years"** text → "25+ years" (constants.ts already fixed?)
4. Any mobile layout issues found during audit

## Success criteria

- `npm run preflight:mobile` passes all 9 routes
- All tap targets ≥ 44px
- No horizontal overflow on any route at 390px
- Footer looks clean and navigable on 390px
