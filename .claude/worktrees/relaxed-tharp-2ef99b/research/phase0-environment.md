# Phase 0 — Environment Check

Date: 2026-04-19

## Package Versions

| Package | Version | Status |
|---------|---------|--------|
| Node.js | v22.14.0 | ✅ |
| @studio-freight/lenis | 1.0.42 | ✅ (installed during phase 0 — was missing) |
| gsap | 3.15.0 | ✅ (already present) |
| playwright | 1.59.1 (via @playwright/test 1.59.1) | ✅ (already present) |

## Dev Server

- Command: `npm run dev`
- Port: 3000
- HTTP status: 200 ✅

## Screenshots Taken

- `research/before/homepage-desktop.png` — 1440×900 full-page ✅
- `research/before/homepage-mobile.png` — 390×844 (iPhone 13) full-page ✅

## `components/home/` — File Inventory

| File | Lines |
|------|-------|
| AboutPreview.tsx | 229 |
| BuildingScience.tsx | 177 |
| Hero.tsx | 115 |
| HeroSections.tsx | 307 |
| HomeCTA.tsx | 192 |
| ProcessPreview.tsx | 95 |
| ProjectsPreview.tsx | 214 |
| ServicesPreview.tsx | 309 |
| **Total** | **1638** |

### Notes on Component Architecture

- **Hero.tsx (115 lines)**: Thin orchestration component — imports HeroSections for the actual content.
- **HeroSections.tsx (307 lines)**: The actual hero implementation — contains Framer Motion animations, char-by-char headline reveal, parallax logic. This is the most animated component on the page.
- **ServicesPreview.tsx (309 lines)**: Largest component, tied with HeroSections. Current grid has the 2-col ADU + 1-col + 1-col layout that creates the dead-space problem.
- **AboutPreview.tsx (229 lines)**: Second largest — contains stats (20+, 819), imagery, and copy blocks. No scroll animations currently.
- **ProjectsPreview.tsx (214 lines)**: Project cards grid. Static hover states only, no entry animations.
- **HomeCTA.tsx (192 lines)**: Call-to-action section with kitchen image and contact button.
- **BuildingScience.tsx (177 lines)**: The "We Don't Estimate, We Measure" principles section — prime candidate for pinned scroll treatment.
- **ProcessPreview.tsx (95 lines)**: Smallest component — process steps overview. Minimal content.

## Gate Checklist

- [x] `research/phase0-environment.md` exists with all 4 package versions
- [x] `research/before/homepage-desktop.png` exists (1.6 MB)
- [x] `research/before/homepage-mobile.png` exists (1.1 MB)
- [x] Dev server running on port 3000, returning 200
