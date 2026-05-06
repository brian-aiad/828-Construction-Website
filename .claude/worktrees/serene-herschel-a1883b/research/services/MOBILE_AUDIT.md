# Mobile Audit — /services Page
**Viewport target:** 390×844 (iPhone 14)  
**Date:** 2026-04-20

---

## Section-by-Section Mobile Assessment

### ServicesHero (390×844)
**Current behavior (code-derived):**
- `h-screen` = 844px tall on mobile — good full viewport
- Text: `clamp(3.5rem, 8vw, 8rem)` → at 390px: 8vw = 31.2px → NO — clamp floor is 3.5rem = 56px
  - 56px font on 390px width with "Three Services." = likely wraps correctly
- Padding: `px-6` (24px) each side → 342px content width
- Bottom padding: `pb-16` (64px) on mobile
- `max-w-7xl` has no effect on mobile (390 < 1280)

**Issues:**
- `svc-hero-line` ("One Standard.") at 56px is borderline too large on 390px — may crowd
- The hero fade eyebrow and paragraph on mobile may overlap with the headline if viewport < 750px
- Suggest: reduce mobile font floor to `clamp(3rem, 8vw, 8rem)` to give more breathing room

### ServiceStrip (390×844)
**Current behavior:**
- Full-width copper strip, `py-3` — visible as a color band
- `font-labels text-[9px]` labels — readable on mobile at 9px? Likely fine for an aria-hidden strip
- The 28s marquee animation will still run on mobile (no touch event issues)

**Issues:**
- On mobile, the solid copper (#B87333) strip is the most visually "loud" element on the page
- Should be replaced with a dark strip regardless (design violation fix)

### PinnedDecisionAid (390×844)
**Current behavior:**
- `isMobile = window.innerWidth < 1024` — triggers at 390px ✓
- Mobile path: `gsap.fromTo(panels, { opacity: 0, y: 28 }, { opacity: 1, y: 0 })` once:true stagger — no pin
- `grid-cols-1` on mobile → stacks vertically ✓
- `minHeight: isMobile ? "auto" : "250vh"` — collapses to auto ✓
- Panel padding: `p-10` = 40px — reasonable on mobile

**Issues:**
- The 3-panel stack on mobile requires significant scroll — 3 × ~320px = ~960px minimum
- "Scope it in 60 seconds" headline: `clamp(2rem, 4vw, 3.2rem)` → 32px on mobile — good
- Counter div is `flex-shrink-0` on the right of the headline — at 390px, may be cramped
- `flex items-end justify-between` on mobile with headline + counter may not leave enough room for both

**Fix needed:** On mobile, stack the headline and counter vertically (flex-col on mobile)

### ServiceSection (390×844)
**Current behavior:**
- `flex flex-col` on mobile → image stacks above text ✓
- `md:flex-row` and `md:flex-row-reverse` only kick in at 768px ✓
- Image pane: `w-full md:w-[55%]` → full width on mobile ✓
- `minHeight: "clamp(420px, 60vw, 680px)"` → 420px min on mobile
- Image min-height: `clamp(380px, 55vw, 680px)` → 380px on mobile

**Issues:**
- Each ServiceSection = 380px image + text (unknown height, probably 400-500px) = ~780-880px per section
- 3 sections = ~2,400px of scroll just for service rows
- On mobile: the clip-path animation trigger is `start: "top 80%"` — on mobile this fires correctly
- The detail grid `grid-cols-1 md:grid-cols-3` → stacks correctly on mobile ✓
- `p-8 lg:p-10` on detail cells → 32px padding on mobile — reasonable

**Issue: Text column padding**
- `px-10 py-16 md:px-14 lg:px-16` → 40px horizontal padding on mobile (reasonable)
- Quote text in italic at 15px — readable

**Issue: Ghost number**
- `clamp(6rem, 10vw, 9rem)` → 96px ghost number at opacity 0.07 — might interfere with text on narrow screen

### ServicesCTA (390×844)
**Current behavior:**
- `py-28` → 112px vertical padding — good
- `px-6 lg:px-12` → 24px on mobile ✓
- Headline: `clamp(2.2rem, 5vw, 4.5rem)` → 35.2px on mobile
- CTA buttons: `flex flex-col sm:flex-row` → stacks at 390px ✓
- `gap-4` between buttons → 16px ✓

**Issues:**
- The MagneticButton wrapper has JS-driven transforms — on mobile touch, this can cause tap-then-drag behavior where the element "follows" the finger unexpectedly
- Remove MagneticButton from CTA on mobile (or from CTA entirely)

---

## Mobile-Specific Fixes Required

| Priority | Section | Issue | Fix |
|----------|---------|-------|-----|
| P0 | Hero | Brightness 0.45 kills photo on all viewports | Fix brightness |
| P0 | Decision Aid counter | Shows "0" on load | `immediateRender: false` |
| P1 | ServiceStrip | Full copper bg | Replace with dark + copper dots |
| P1 | Decision Aid | headline+counter cramped on mobile | flex-col on mobile |
| P1 | ServicesCTA | MagneticButton on touch | Remove MagneticButton from CTA |
| P2 | ServiceSection | MagneticButton on service rows | Remove all service row MagneticButtons |
| P2 | Hero | Font floor may be too large | Test at 390px |
| P2 | Service detail grid | 3 stacked cells each service = long scroll | Consider collapsing on mobile |

---

## Mobile Animation Adjustments

The `useMobile()` hook (< 1024px) already handles:
- PinnedDecisionAid: disables pin, uses stagger entry instead ✓
- Mobile gets event-based entry animations, desktop gets scrub ✓

Remaining mobile animation concerns:
- SplitType exits on hero still apply on mobile — ensure `svc-hero-line` SplitType cleanup works on mobile navigation
- All `scrollTrigger` triggers use DOM element refs — valid on both viewports
- `AnimationController.shouldAnimate()` may return false on low-power mobile — all animations must degrade gracefully

---

## Responsive Grid Summary

| Section | Mobile | Tablet (768+) | Desktop (1024+) |
|---------|--------|---------------|-----------------|
| Hero | 1-col, stacked | 1-col | 1-col |
| ServiceStrip | Full width | Full width | Full width |
| Decision Aid | 1-col stacked | 3-col | 3-col pinned |
| Service Sections | Image top, text below | 2-col 55/45 | 2-col 55/45 |
| Detail cells | 1-col | 3-col | 3-col |
| CTA buttons | Stacked | Inline | Inline |

All responsive grids are Tailwind-based — no custom breakpoints needed. Current structure is solid for mobile; the issues are design/motion bugs, not layout structure.
