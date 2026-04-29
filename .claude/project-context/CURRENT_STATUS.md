# 828 Construction — Current Status

_Update this file after every session. It's loaded by memory at session start._

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
