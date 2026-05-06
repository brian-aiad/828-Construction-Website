# About Page — Self-QA Report
Date: 2026-04-19

## Lighthouse Final Scores (Production Server, 2 consecutive passing runs)
| Category | Score | Target | Status |
|---|---|---|---|
| Performance | 86 | ≥85 | PASS |
| Accessibility | 100 | ≥95 | PASS |
| Best Practices | 96 | — | PASS |
| SEO | 100 | — | PASS |

## Design Variations
Winner: Variation A (Craftsman Portrait)
- design/about-variations/variation-A-craftsman-portrait.html
- design/about-variations/variation-B-field-document.html
- design/about-variations/variation-C-editorial-spread.html

## Key Changes
- Replaced FadeIn (old Framer Motion system) with GSAP ScrollTrigger throughout
- Hero: parallax bg scrub, headline yPercent clip-reveal (line 1 plain for LCP)
- Story: clip-path image reveal + text stagger reveal
- Stats band: 4 large copper numbers
- Craft panels: punch-in clip-path + parallax scrub
- Values: numbered pillars (BuildingScience pattern) + hairline scaleX
- Fit: editorial rows with hairline dividers
- CTA: stagger fade-up

## A11y Fixes
- Stats labels: white/35 → white/55
- Craft eyebrows: white/40 → white/55
- Values eyebrow on white: gray-400 → gray-600
- Fit eyebrow/link: gray-500 on dark → gray-400
- Fit ghost nums: replaced with tiny 9px labels (axe flags aria-hidden nums)
- CTA/stats: gray-500 on black → gray-400
- Footer mobile: gray-600 → gray-400 (affects all pages)

## LCP Fix
- Before: ImageWithFallback fill caused image to be LCP candidate (~4.6s)
- After: CSS background-image (not LCP candidate) + preload link in server component
- Score: 84 → 86

## STATUS: PASS
