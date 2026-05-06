# 828 Construction — Current Status

_Update this file after every session. It's loaded by memory at session start._

## V2.5 FIX — Prompt 3 Complete (2026-05-06)

Portfolio + Services Landing + Global polish shipped and pushed to `origin/main`.

### New components/files added
- `app/template.tsx` — Cinematic curtain page transition (black drop + maroon hairline swipe)
- `components/portfolio/PortfolioCinemaRow.tsx` — Horizontal pin-scroll cinema strip with containerAnimation
- `components/system/RevealImage.tsx` — Image reveal on viewport entry (mask/blur/scale)
- `lib/hooks/useTilt.ts` — GSAP rotateX/Y 3D tilt hook

### Global systemic upgrades
- `::selection` → maroon (`var(--color-accent)`) with white text
- Custom scrollbar → maroon thumb (Webkit + Firefox)
- `GrainOverlay` opacity bumped 0.035 → 0.055
- Lenis duration 1.4 (was 1.1), easing exponent -8 (was -10)
- Page transitions replaced: 250ms fade → cinematic curtain (0.7s)
- `ContactForm.tsx` focus border: copper → maroon + 240ms transition

### Portfolio upgrades
- Cinema strip (3 photos horizontal pin-scroll with parallax-blur peaking at center)
- Featured full-screen takeover section (P[2] outdoor-living, settling scale + char reveal)
- GalleryTile: scrub-tied curtain reveal, hover lift (-6px) + maroon ghost shadow + caption slide

### Services landing upgrades
- 3D tilt (rotateX/Y 10deg) on cursor hover for all 3 tiles
- Maroon ghost shadow `0 40px 80px rgba(123,45,38,0.6)` on tile hover
- `perspective: 1200px` + `overflowX: clip` on tile wrapper
- `ConstructionLineSilhouette` opacity 0.04 → 0.10 + slow rotate (240s)
- `pulse-glow` class on BOOK CALL CTA

## Site Status (as of 2026-04-29)

All 9 routes complete. Four-workstream quality pass complete. All pages Perf ≥85, A11y ≥96.

| Page | Perf | A11y | Status |
|------|------|------|--------|
| Home `/` | 99 | 96 | ✅ Done — 25+ years, splash screen, copper cursor, live time |
| About `/about` | 99 | 96 | ✅ Done — founder profile, editorial timeline, 25+ years |
| Services `/services` | 99 | 96 | ✅ Done — service row GSAP hover, 25+ years |
| Services/ADU | 98 | 96 | ✅ Done — PinnedWhy, embedded form, 25+ years |
| Services/Remediation | 94 | 96 | ✅ Done — same template, 25+ years |
| Services/Consulting | 98 | 96 | ✅ Done — same template, 25+ years |
| Process `/process` | 96 | 96 | ✅ Done — pinned timeline, 25+ years counter |
| Contact `/contact` | 96 | 96 | ✅ Done — NEW dark form card, field validation, honeypot, animated checkmark |
| Projects `/projects` | 99 | 96 | ✅ Done — filter tabs, gallery, 25+ years |

## Form Status (NEW — 2026-04-29)

- **ContactForm.tsx** — fully redesigned: dark card (`bg-[#0a0a0a]`), white labels, copper focus rings, field-level validation, honeypot, loading spinner, animated SVG checkmark success state
- **ServicePageContactForm.tsx** — improved: honeypot, double-submit guard, animated SVG checkmark, loading spinner
- **API route** — rate limiting (5 req/10min/IP), honeypot check, server-side validation, graceful console fallback when no Resend key
- **Resend API key** still pending from client (Joe P) — form works in dev with console logging

## Stress Test Suite (NEW — 2026-04-29)

`tests/stress.spec.ts` — 21 tests, all passing against production build:
- Rapid navigation between all 9 routes
- Projects filter tab spam
- Form stress (empty submit, XSS input, double-submit)
- Scroll velocity (rapid scroll up/down, counter no-reverse check)
- Viewport resize stress (1440→320→768→1440)
- Keyboard navigation
- Browser back/forward navigation
- Mobile overflow audit (all 9 routes at 390px)

Run with: `TEST_BASE_URL=http://localhost:4000 npx playwright test tests/stress.spec.ts`

## Pending Client Items (blocking launch)

- [ ] Real project photography (currently placeholder/AI-generated)
- [ ] Resend API key for contact form (`RESEND_API_KEY` in `.env.local`)
- [ ] Google Business Profile link
- [ ] Domain confirmation (828constructions.com)
- [ ] Favicon set verification

## Work Plans (reference)

`.claude/work/01-visual-revamp.md` — Visual QA protocol
`.claude/work/02-mobile-audit.md` — Mobile + footer audit
`.claude/work/03-stress-test.md` — Stress test protocol
`.claude/work/04-form-implementation.md` — Form implementation spec
