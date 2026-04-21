# Phase 0 Inventory — About Page
Date: 2026-04-20

## Environment
- Node: v22.14.0
- Next.js: 15 App Router (static generation for /about)
- TypeScript: strict mode, 0 errors
- GSAP: 3.15.0 + ScrollTrigger registered globally
- Playwright: 1.59.1 — Chromium installed
- split-type: 0.3.4 (installed this session — was missing)
- @studio-freight/lenis: 1.0.42 (present)
- framer-motion: 12.38.0 (present, used in ProjectsGallery only)
- ffmpeg: NOT available — using Playwright frame extraction instead

## Production build
- All 15 pages build without error
- /about generates as static (○) 
- Bundle includes GSAP + ScrollTrigger + split-type

## Dev server
- localhost:3000 → 200 on /about

## Current state at session start
- AboutContent.tsx: 824 lines, 7 sections (Hero, Story, Stats, Craft, Values, Fit, CTA)
- All animations: fire-once (y:28, opacity:0 → y:0, opacity:1 pattern throughout)
- Values section: 3 static rows, x:-32 slide (lateral motion — user explicitly dislikes)
- Story stat card: x:24 slide (lateral)
- No scrub-based animations except hero bg yPercent
- No pinned sections
- No image scale-on-scroll
- No NumberCounter on stats

## Research directories created
- research/about/motion-capture/current-desktop-frames/ — 24 frames captured
- research/about/motion-capture/current-mobile-frames/ — 30 frames captured
- research/about/motion-capture/nsbuilders-desktop-frames/ — 82 frames captured
- research/about/motion-capture/nsbuilders-mobile-frames/ — 65 frames captured
- research/about/motion-capture/feldman-desktop-frames/ — 5 frames (page is short)
- research/about/motion-capture/olsonkundig-desktop-frames/ — 42 frames captured
- research/about/after/desktop-frames/ — 33 frames captured (post-implementation)

## Key observations from current-state frames
- Frame y=0: Hero looks strong — "20+ Years / of Building / Science" over construction photo
- Frame y=800: Story section (white bg) — left text, right image. Image fully revealed (no animation visible in screenshot). Stat card at bottom-left.
- Frame y=1600: Stats band — numbers fully visible. Craft section starting below (dark).
- Frame y=2000: Craft section — 3 panels with tools/materials/contract photos
- Frame y=2800: Values section — 3 static rows (01 Quality, 02 Science, 03 Necessity) all visible simultaneously
- Frame y=3600: About Science interlude + About Fit starting
- Frame y=4400: CTA section with footer

## Identified problems requiring fix
1. ALL lateral (x-axis) animations removed — user explicitly requested
2. Values section entirely static after fire-once entrance
3. No scrub on image reveals — feels abrupt
4. No scale-on-scroll for any images
5. No pinned/signature section
6. No NumberCounter on stats
7. Flat scrub:event ratio (≈0.3:1 — almost entirely event-driven)

## Implementation plan
1. Rewrite `AboutValuesPinned` — 300vh pinned section, 3 panels, scrub clip transitions, images, dot indicator
2. Add scale + yPercent SCRUB to hero bg image
3. Change Story image clip to scrub mode (spans from top:85% to top:25%)
4. Change Craft clip animations to individual scrub per panel (different speeds)
5. Add image scale scrub to all craft panel images (full viewport range)
6. Scrub the hairlines, fit rows, CTA hairline
7. Install NumberCounter on stats
8. Add AboutScience as new section with parallax
9. Remove all x: animations, replace with scale+y emerge
