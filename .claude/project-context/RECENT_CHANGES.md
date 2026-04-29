# 828 Construction — Recent Changes

_Append entries here newest-first. Date all entries._

## 2026-04-29 — Four-workstream quality pass

### WS1: Visual QA + 25+ years fix (site-wide)
- **25+ years** — all remaining "20+ years" instances fixed in 12 files: `HeroSections.tsx`, `BuildingScience.tsx`, `HomeCTA.tsx`, `HomeInterstitial.tsx`, `ProjectsGallery.tsx`, `ProcessContent.tsx`, `ServiceDetailContent.tsx`, `ServicesContent.tsx`, `AboutContent.tsx`, `ContactContent.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/services/[slug]/page.tsx`, `lib/constants.ts`. All counters updated (val:25), all JSX fallback text updated ("25+").

### WS2: Mobile + Footer
- **Footer mobile redesign** — `components/layout/Footer.tsx`: mobile nav changed from `flex flex-wrap gap-y-0` (zero gap) to `grid grid-cols-2` with `min-h-[44px]` tap targets. Navigate and Services now share a clean 2-col grid. Desktop service area shows all 8 cities (was showing only 5 via `slice(0,5)`).

### WS3: Stress Test Suite
- **`tests/stress.spec.ts`** — 21 tests, all passing: rapid navigation (9 routes), filter spam (Projects), form stress (empty/XSS/double-submit), scroll velocity, viewport resize (1440→320→1440), keyboard nav, back/forward nav, mobile overflow (all 9 routes at 390px). Base URL configurable via `TEST_BASE_URL`.

### WS4: Form Implementation
- **`components/contact/ContactForm.tsx`** — complete redesign: dark card in white section (editorial contrast), white labels (`font-labels` uppercase), copper focus rings, field-level validation with inline errors, honeypot anti-spam field, double-submit guard (`submittingRef`), loading spinner SVG, animated copper checkmark success state (SVG stroke-dashoffset draw, 2 CSS keyframes added to `globals.css`)
- **`components/contact/ServicePageContactForm.tsx`** — honeypot added, double-submit guard, animated checkmark success state, loading spinner
- **`app/api/contact/route.ts`** — rate limiting (5 req per 10 min per IP, in-memory Map), honeypot check (silent success for bots), server-side validation with field-level error response, stricter phone/email regex
- **`ContactContent.tsx`** — right column now wrapped in `bg-[#0a0a0a] p-8 lg:p-10` dark card for editorial white/dark column contrast
- **`globals.css`** — added `@keyframes drawCircle` and `@keyframes drawCheck` for SVG checkmark animation

### Lighthouse (final, production build)
All 9 routes: Perf ≥94, A11y ≥96 (Home=99, Contact=96, About=99, Services=99, ADU=98, Remediation=94, Consulting=98, Process=96, Projects=99)

## 2026-04-24 (session 2 — mobile polish + year correction)

- **Mobile footer redesign** — `components/layout/Footer.tsx`: NAVIGATE + SERVICES merged into grid-cols-2 with vertical stacked link lists (no more horizontal flex-wrap overflow); section labels now copper-tinted; dividers border-white/10; phone 1.9rem; consistent py-8 rhythm. CTA tracking tightened.
- **Hero mobile scroll indicator** — added `hidden sm:flex` to scroll indicator: hidden on <640px where hero is 100vh and scroll extension doesn't exist; no more overlap with stacked CTA buttons.
- **EST. 2004 → EST. 2025** — site-wide correction across all 30+ instances: Hero, HeroSections, HomeCTA, HomeInterstitial, HomeMarquee, About (8 instances including watermark and sticky credential), Contact (counter target 2004→2025), Services components, metadata files, lib/constants.ts, design/PATTERNS.md.
- **20+ years → 25+ years** — all team experience claims updated to match 25+ years per client instruction. Company EST. date = 2025; team experience = 25+ years (kept separate).
- Pushed 6 clean conventional commits to origin/main (rebased onto other session's nav/ScrollTrigger fixes).
- Vercel auto-deploy triggered from main push.

## 2026-04-23

- **Full site v3 polish** — all 9 routes revamped for more organization, professional polish, and interactivity
- BuildingScience: vertical copper rule through pillars (scaleY scrub), stat counter 0→20+, group hover on pillar rows (copper number + bg shift)
- ServicesPreview: Pattern C overflow-hidden headline reveal, GSAP image brightness + scale hover on service rows
- About (city cards): copper group hover — city name turns copper, hairline brightens, body text lifts opacity
- Contact: vertical copper gradient connector line between "What Happens After" steps
- Process (EditorialStandards): group hover — number lifts to 100% opacity, body text brightens, subtle bg shift
- Services detail (all 3): per-element scrub reveal (Fix 15), copper bullet points, keyword hover states
- ProjectsGallery: filter tab copper hover hint on inactive tabs
- HomeInterstitial: fixed stat divider absolute positioning (added `relative` to stat-item)
- Footer: all nav links now hover to copper (#B87333) consistently
- All 18/18 preflight routes: PASS
- All pages Lighthouse: Perf ≥99, A11y ≥96

## 2026-04-22

- About page: revamped v2 — Perf=100, A11y=96, founder rewrite, credential card, SelectiveWork section, "2004" drift signature
- Process page: revamped v3 — Perf=85, A11y=96, EditorialStandards section, hero LCP fix, preflight hardened

## 2026-04-21

- Preflight system installed: `npm run preflight:full` runs next build + all 9 routes. PreToolUse hook blocks git push until preflight passes.
- Home: revamped v2 — Perf=99, A11y=100
- Services: revamped v4 — Perf=98, A11y=96, 13 images
- Services/ADU, Remediation, Consulting: master audit — Perf=87, A11y=96
- Contact: master audit — Perf=86, A11y=96
- Projects: revamped v2 — Perf=99, A11y=96

## 2026-04-20

- About page: initial bug-fix pass — SplitType 4-guard cleanup applied
