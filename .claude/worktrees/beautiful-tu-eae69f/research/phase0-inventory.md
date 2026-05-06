# Phase 0 Inventory — 828 Homepage Polish & Mobile Pass
## Date: 2026-04-19

## Environment

- Node.js: v22.14.0
- Next.js: v16.2.4 (Turbopack)
- GSAP: 3.15.0 (ScrollTrigger registered in all animation hooks)
- Lenis: 1.3.23 (LenisProvider uses standalone lenis package)
- Playwright: @playwright/test 1.59.1 + playwright 1.59.1
- Dev server: localhost:3000 (running from previous session)
- Prod server: localhost:4000 (started for Lighthouse)
- Build: Turbopack production build

## Files modified this pass

| File | Type | What changed |
|---|---|---|
| components/home/ProjectsPreview.tsx | Full redesign | Asymmetric editorial grid (Variation A), punch-in clip-path entrance, responsive mobile collapse |
| components/home/BuildingScience.tsx | Pin fix | pinSpacing:false, end 2.5→1.8vh, wrapperRef minHeight:280vh |
| components/layout/Footer.tsx | Mobile redesign | Split desktop/mobile layouts, large phone number, inline nav, full-width CTA |
| components/ui/ImageWithFallback.tsx | Type fix | Added `sizes` prop to interface and component |

## Files inspected but not modified

| File | Reason reviewed |
|---|---|
| components/home/HeroSections.tsx | LCP fix verification — confirmed still intact |
| components/home/ServicesPreview.tsx | Color audit + mobile review |
| components/home/AboutPreview.tsx | Mobile audit review |
| components/home/HomeCTA.tsx | Section position verification |
| components/layout/Header.tsx | Mobile pass — confirmed functional, no changes needed |
| lib/constants.ts | PROJECTS data — confirmed 4 projects for featured/secondary/wide layout |
| app/page.tsx | Section order verification |
| app/globals.css | Confirmed @keyframes fadeInUp present, no grayscale filters |

## Before screenshots captured

- research/before/homepage-1440-full.png (full page desktop)
- research/before/homepage-390-full.png (full page mobile)
- research/before/hero-1440.png, hero-390.png
- research/before/services-1440.png, services-390.png
- research/before/about-1440.png, about-390.png
- research/before/projects-1440.png, projects-390.png
- research/before/differentiator-1440.png, differentiator-390.png
- research/before/cta-1440.png, cta-390.png
- research/before/footer-1440.png, footer-390.png

## Reference screenshots captured

- research/reference/feldman-desktop.png, feldman-mobile.png
- research/reference/feldman-grid-desktop.png (projects page)
- research/reference/feldman-footer-desktop.png, feldman-footer-mobile.png
- research/reference/nsbuilders-desktop.png, nsbuilders-footer-desktop.png
- research/reference/olsonkundig-desktop.png, olsonkundig-mobile.png

## Design variations produced

### Projects section (3 HTML variations)
- design/projects-variations/variation-A-asymmetric-grid.html ← WINNER
- design/projects-variations/variation-B-film-strip.html
- design/projects-variations/variation-C-punch-grid.html

### Footer mobile (3 HTML variations)
- design/footer-variations/variation-A-stacked-editorial.html ← WINNER
- design/footer-variations/variation-B-centered.html
- design/footer-variations/variation-C-cta-first.html

### Differentiator fix (1 mockup)
- design/differentiator-fix/ (reasoning in self-qa/differentiator-pin-fix.md)

## Color audit result
Zero navy/blue violations found in codebase. Palette compliant.

## Previous Lighthouse baseline (last pass)
Performance: 88, Accessibility: 96, Best Practices: 96, SEO: 100

## Target thresholds
Performance ≥85 ✓, Accessibility ≥95 ✓
