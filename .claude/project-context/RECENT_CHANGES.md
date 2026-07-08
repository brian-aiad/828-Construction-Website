# 828 Construction — Recent Changes

_Append entries here newest-first. Date all entries._

## 2026-07-08 (evening) — About V4 simplicity pass + standing design direction

- NEW STANDING DIRECTIVE from Brian recorded in `design/828_DESIGN_DIRECTION_V4.md`
  (linked from CLAUDE.md "read these" #0): verbiage frozen, NS-simple +
  page-animated, NO billboard-scale text, asymmetric alternating motion
  (sticky side vs scrolling side), morphing header on every page, one signature
  moment per page, mobile designed at 390px. Applies to every future page pass
  and client-video batch.
- About V4 applied: hero h1 4.6rem cap (was 9.6rem), South Bay/CTA h2s ~3.4rem
  cap, watermark quieter; origin image column now sticky (left) while copy
  scrolls; CRAFT flipped — statements left, sticky letter rail right
  (alternating sides); South Bay copy block moved right over the full-bleed
  city marquee; CTA bg varied to home-about-workbench.jpg.
- Header zone-morph generalized: was pathname==="/" only, now activates on any
  page containing [data-header-light] (About's white CRAFT section is marked).
  Dark stays default; loop order means only mark LIGHT zones inside AboutFlow.
- No image generation tool available this session — imagery varied from the
  existing generated library instead (noted in V4 doc).
- QA: functional-qa PASS both viewports, captures re-verified, tsc clean.

## 2026-07-08 - Home scroll cleanup and reveal stabilization

- Home process panel now has more scroll runway before the next stacked surface
  covers it, so the approach steps can finish reading before the Since 2004
  section arrives.
- Added quiet process thumbnails to the five approach rows while keeping all
  wording unchanged.
- Services headline reveal now starts visible by default and only animates from
  hidden when its trigger runs, preventing "One company, multiple solutions."
  from getting stuck invisible.
- Signed: CODEX

## 2026-07-08 — About V3: Joe's video feedback applied + stacked-surface port

- Analyzed Joe's 5 stylus walkthrough videos (OneDrive IMG_1014/1019/1020/1024/1031)
  with a local pipeline (imageio-ffmpeg frame extraction + faster-whisper
  transcription); every "this here" pointer resolved against extracted frames.
  Change doc: `docs/828_ABOUT_JOE_FEEDBACK_2026-06.md`. Raw transcripts/frames:
  `.claude-work/research/about-joe-feedback/`.
- Applied all dictated changes: hero H1 "Where quality meets quiet luxury." +
  full-screen faded 828 CONSTRUCTION backdrop; builder-profile big headline
  deleted, founder lede promoted; cards renamed Communication / Intentions /
  Execution with rewritten bodies; Field-Method section replaced by Joe's CRAFT
  acronym system (bold CRAFT watermark + 5 statements); South Bay headline
  "Looking for a local contractor?" + full-screen rolling city marquee replaces
  the tile grid; CTA "For those who value experience and quality." + INITIAL
  CONTACT button.
- Ported the homepage stacked-surface scroll grammar to About via new
  `components/about/AboutFlow.tsx` (dark-surface EditorialFlow port with maroon
  plumb line + per-section nodes) — Brian's explicit override of the
  route-specific motion rule, recorded in CLAUDE.md.
- QA: functional-qa PASS desktop+mobile (0 errors, no overflow, no duplicate
  headings), section-by-section visual audit 5/5 PASS each, visual flow 6/6
  PASS. Research tree: `.claude-work/research/about-v3/`.
- The video-intake pipeline is reusable for the NEXT batch of client videos —
  steps documented at the bottom of `docs/828_ABOUT_JOE_FEEDBACK_2026-06.md`.

## 2026-06-10 (refresh fix) — Hard refresh always lands at top, no white strip

- ScrollRestorationReset was useEffect-only — it ran after hydration, so a mid-page hard refresh painted one frame at the restored position (cream strip) before jumping to top.
- Now also renders an inline synchronous <script> (Fix 13 pattern) that sets history.scrollRestoration='manual' + scrollTo(0,0) during HTML parse, before first paint. useEffect kept as second layer.
- Verified: scrollY === 0 at commit, domcontentloaded, and settled after a 3000px-deep hard refresh; hero full-frame.

## 2026-06-10 (first-land fix) — Hero always lands full-frame

- Bug: on first land the hero sometimes showed a sliver of the light surface at the bottom — the surface started exactly at the fold, and wheel input during the splash (or any stray scroll offset) revealed it.
- Fix, three layers: (1) body scroll locked while the splash plays; (2) scrollTo(0,0) on splash dismiss; (3) the editorial surface now starts 4svh below the fold (mt-[4svh] on EditorialFlow — the pinned hero shows through the gap, so the curtain is unchanged).
- Verified with a wheel-during-splash probe: scrollY stays 0, surface rests 36px below the fold in both splash and no-splash paths.

## 2026-06-10 (responsive) — Mobile / iPad / small-window pass

- Audited 390, 768, 834, 1024, 1280 widths with an automated overflow + headline-fit + console-error sweep (all clean) plus visual review of key frames.
- FIXED: process rows were permanently dim below 1024px — AnimationController gates at <1024 (not <768 as the step-driver assumed), so tablets/mobile never ran the highlighter. CSS override at max-width:1023px now keeps rows fully readable (white titles, maroon numbers) on non-desktop.
- FIXED: step-by-step highlighter used document-offset ScrollTrigger bands which go stale once the stacked surface pins (rects freeze while scroll continues) — broken on iPad-height viewports. Rewrote as rect-based selection against a 55%-viewport focus line, with a stuck-phase fallback that keeps the walk advancing over the cover distance. Verified progressive walk -1→0→…→4 at 1280.
- Single-line "Refining industry standards." clamp tightened (3.2vw, cap 3.4rem) so it can't overflow its column at 1024–1280.
- NOTE: dev-server CSS went stale during this pass (served chunk missing new globals.css rules) — fixed by clean .next restart; worth checking when a CSS edit "doesn't apply."
- Verified: tsc clean, five-viewport audit all green, preflight:full PASS.

## 2026-06-10 (reorganization) — Hero one-sentence, compact statement, step-by-step process, zone-aware navbar

- Hero: replaced the four stacked giant words with one readable block — "Transforming properties, delivering solutions." as the lead line, partner line dimmed beneath, Book Call under. clamp(1.8–2.95rem), max-w-46rem, bottom-left.
- "Embodying meticulous planning…" demoted from billboard display text to a compact maroon-edged reading block in the vision intro right column (word-fill scrub kept, subtle 0.28→1).
- Marquee reverted from oversized editorial text (read tacky) to the refined 11px mono strip, hairline-bounded, maroon diamonds + one maroon item per cycle.
- Process panel is now true step-by-step: rows rest dimmed (white/25–35); a single ScrollTrigger driver lights exactly ONE row at a time (white title + maroon number + 0.5rem shift) as the reader scrolls — Fix 2 single-driver pattern.
- Navbar is now zone-aware via document.elementsFromPoint sampling at (center, 40px): dark glass over hero/photo/black-panel/footer, cream glass over light surfaces. Marked zones with data-header-dark / data-header-light. A 300ms poll keeps it honest because scrub animations (expanding photo) settle after the last scroll event — verified ink matches underlying zone at 10 scroll depths.
- Verified: tsc clean, zero console errors/overflow at both viewports, preflight:full PASS.

## 2026-06-10 (cleanup) — Sentence splits fixed, decisive reveals

- Fixed the awkward hard line break "Refining industry / standards." in BOTH vision and about headlines — now one clean single line on desktop (sized to fit, natural wrap below lg). Vision headline column widened to col-span-7 to guarantee fit.
- Text reveals (section headlines, process rows, row hairlines) converted from scrub-parked to decisive once-based animations — they always complete, never sit half-revealed. The living scrub layer stays: stacked surfaces, photo expansion, word-fill statement, progress rail, plumb line, row ignition.
- Word-fill statement range tightened (completes by 42% viewport). About photos gain the same hover zoom as services.
- Verified: tsc clean, desktop+mobile captures (zero errors/overflow), preflight:full PASS.

## 2026-06-10 (latest) — Color & hierarchy pass (wording untouched)

- Hero re-hierarchy: "Transforming properties, delivering solutions." is now the large two-line h1; "828 Construction is the partner of choice for your next project." moved to a small supporting paragraph (maroon-edged) beside it with the Book Call button. Same words, new placement.
- Navbar: Book Call button added on the desktop right side (inverts with the morphing header: white-on-dark over hero, black-on-cream over the surface, maroon hover).
- Color system: maroon eyebrow labels with tick lines (hero, vision, about), maroon "multiple solutions." headline line, maroon service index numbers, maroon ticks under about photos, one soft-maroon marquee item per cycle, plumb line strengthened to 65% opacity.
- Process block re-staged as a full-bleed BLACK panel: white type, maroon-light numbers/eyebrow, scroll-filled maroon progress rail beside the rows, row ignition (maroon number + title shift) tuned for dark. Page color rhythm is now: dark hero → cream → giant photo → cream marquee → black process → cream about → black footer.
- Branch: work now lives on `ns-preview` (git/deploy policy in CLAUDE.md — never push main without explicit instruction).
- Verified: tsc clean, desktop+mobile full-page captures (zero errors/overflow), stacked-surface mechanics re-probed, preflight:full PASS.

## 2026-06-10 (later) — Extravagant pass: morphing header, stacked surfaces, showpieces

- Researched nsbuilders.com live in Playwright (10 scroll-frame captures + computed-style probe): their hero is a FIXED layer the page rides over; light header with dark ink over light sections; persistent bottom-left CTA card through the whole scroll.
- **Morphing header** (user's explicit ask): on home, header is white-on-transparent over the dark hero, then re-forms to `#f7f7f3/90` glass with dark ink the moment the light editorial surface reaches it. Reverts on scroll-up. Other routes unchanged.
- **Stacked surfaces**: every home section now holds still once fully read (JS-measured sticky tops in `EditorialFlow`) while the next surface rides over it; covered surfaces settle to scale 0.975 / opacity 0.72 for depth. Last section stays in flow for a clean footer junction.
- **Docked CTA** (`DockedCTA.tsx`): persistent "Book Call" card bottom-left, appears after the hero, hides at the footer. Desktop only.
- **Expanding photograph**: the fireplace landscape now scrubs from an inset frame (`inset(10% 9%)`) to full-bleed 92vh as the reader passes it.
- **Editorial marquee**: vision marquee upscaled from 10px mono to clamp(1.6–3.3rem) display text at black/16 with maroon diamonds, 52s.
- **Living hero**: slow Ken Burns drift (26s alternate) on the hero photo beneath the scroll scrub.
- **Process ignition**: each process row's number turns maroon and title shifts 0.5rem while the row holds the reader's focus band.
- Verified: tsc clean, behavioral Playwright probe (header morph colors, sticky stack tops, clipPath expansion, dock show/hide), full-page scroll captures both viewports, zero console errors/overflow, preflight:full 16/16 PASS.

## 2026-06-10 — Home page NS-grammar rebuild (one-surface scroll)

- Rebuilt all four home sections to the NS Builders editorial grammar with ALL copy verbatim (client requirement — no rewording).
- Hero: simplified to one full viewport, statement headline bottom-left (now the page h1), single veil. Hero is CSS-sticky pinned beneath the page; the light editorial surface slides over it as a curtain (one-surface scroll feel).
- Services / Vision / About sections moved from dark gradient-wash panels to a warm off-white editorial surface (#f7f7f3, matches footer panels). Captions sit below image frames, never overlaid. Removed 3D tilt, maroon glow shadows, DraftingMotionLayer usage, drifting decorative shapes, and the pinned horizontal process track.
- New `EditorialFlow` wrapper: continuous scroll-drawn maroon plumb line down the left margin of the entire light region with nodes that ignite per section — the page's connective scroll signature.
- "Embodying meticulous planning…" brand statement elevated to a full-width word-fill scrub moment (SplitType words, Fix 1 four-guard cleanup).
- Headline mask reveals converted to scrub-tied (Fix 15). Process steps are hairline rows revealing per-row on scroll.
- About preview now uses three REAL project detail photos (Cerritos, outdoor pergola, Tustin) instead of a generated image.
- Lenis glide deepened (duration 1.08 → 1.35, wheelMultiplier 0.88) for the continuous one-surface feel.
- KNOWN CONTENT BUG (flagged for client, not fixed per copy-verbatim rule): "Refining industry standards." appears as the headline of BOTH the vision section (HomeVisionSequence) and the about preview (AboutPreview).
- Verified: tsc clean, preflight:full 16/16 PASS, zero console errors, zero horizontal overflow at 1440 and 390 widths, full-page scroll captures at both viewports.

## 2026-05-26 — Push and local cleanup handoff

- Confirmed `main` was aligned with `origin/main` before cleanup; no source edits were pending.
- Ran `git push`, which triggered the full pre-push production preflight. Build succeeded and all 16 route/viewport checks passed, including nav/SplitType cleanup and hard-refresh stability.
- Pushed the hook-updated `.preflight-passed` marker as `44ae824 chore: update preflight marker`.
- Removed safe generated local clutter: `.next`, server logs, Playwright report/output, and `tsconfig.tsbuildinfo`.
- Avoided blanket `git clean -X` because the dry run included important ignored files such as `.env.local` and `node_modules`.
- Stopped local servers on ports `3001`, `4000`, `4001`, and `4028`.
- End state before this note commit: clean working tree, `main...origin/main`, latest preflight report `.claude-work/preflight/2026-05-26-21-09/report.json`.

## 2026-05-21 — Sitewide cleanup, image credibility pass, and full QA

- Visually reviewed every public route at desktop and mobile, including legacy `/process` and `/projects` redirects into `/portfolio`.
- Replaced live portfolio references to generated-angle and v2 generated project images with existing local project/worksite assets; removed the unused untracked v2 generated portfolio files.
- Normalized page metadata titles so pages no longer duplicate `828 Construction` in the browser title.
- Raised too-dark image brightness filters to meet the project image readability rules.
- Hardened the About method section images with eager loading so fast scroll/review does not show black image plates.
- Tightened portfolio production and stress tests after rerunning them against `next start`.
- `npm run lint`, `npx tsc --noEmit --pretty false`, `npm run build`, `npx playwright test tests/portfolio-production.spec.ts --project=chromium`, `npx playwright test tests/stress.spec.ts --project=chromium --workers=1`, and `npm run preflight:full` pass. Latest full report: `.claude-work/preflight/2026-05-21-22-57/report.json`.

## 2026-05-21 — Local dev pinned to localhost:3001

- `npm run dev` now runs `next dev -p 3001`.
- README, CLAUDE project rules, project map, and homepage handoff notes now mark `http://localhost:3001` as the canonical local review URL.
- Port `3000` is documented as another local app and should not be used to review this repo.

## 2026-05-21 — Portfolio production hardening + client-ready QA

- Portfolio case-index preview now remains visible through hard refreshes and all selected rows; desktop uses a stable sticky selected-preview panel and mobile/tablet gets an immediate selected preview.
- Portfolio main project imagery was tightened using stronger existing local assets for weak bath/outdoor slots and five generated replacement images were wired where they improved the client-facing archive.
- Contact above-fold plans image no longer starts hidden behind GSAP reveal state.
- Added `tests/portfolio-production.spec.ts` for portfolio hard-refresh preview/image regressions.
- Stress tests were updated for the current `/portfolio` implementation and custom cursor behavior.
- `npm run lint`, `npx tsc --noEmit --pretty false`, `npm run build`, production route/image audit, portfolio production Playwright test, Chromium stress suite, and `npm run preflight:full` pass. Latest full report: `.claude-work/preflight/2026-05-21-20-51/report.json`.

## 2026-05-20 — Mobile polish + image loading hardening verified

- Header/footer mobile tap targets tightened for the phone link, menu button, footer links, and footer contact CTA.
- Services and service-detail mobile spacing reduced to avoid oversized stacked cards and dead space.
- Home services preview card heights/type scales tuned for 390px mobile widths while retaining the desktop V2.5 layout.
- Portfolio, lightbox, services, home services preview, and contact images now use blur placeholders, eager/priority loading for above-fold imagery, and graceful image-error opacity handling.
- `npm run lint`, `npx tsc --noEmit --pretty false`, `npm run build`, and `npm run preflight:full` pass. Latest full report: `.claude-work/preflight/2026-05-20-19-55/report.json`.

## 2026-05-06 — V2 full rebuild + V2.5 elevation + Homepage Cinematic Overhaul

### Phase 0 — Context rewire
- `docs/828_CLIENT_BRIEF_V2.md` created — full V2 brief from Joseph call
- Maroon `#7B2D26` set as primary accent in tokens, CSS vars, and design docs
- Copper `#B87333` retained as `--color-accent-fallback` per Joe's approval
- `CLAUDE.md` rewritten with V2 section at top (locked decisions, page rebuild order)
- `design/828_DESIGN_SYSTEM.md` updated: V2 palette, typography hierarchy, header rules, motion vocabulary from 4 reference videos
- `design/PATTERNS.md` appended: asterisk dropdown, rolling marquee, glass/depth, asymmetric split

### V2 page rebuilds (separate terminals)
All 9 pages rebuilt per `docs/828_CLIENT_BRIEF_V2.md`. Key changes:
- Splash: NS Builders vertical gradient, one-line wordmark, slide-up reveal
- Home: stripped to Hero + Services Preview + About Preview + Footer; BOOK CALL asterisk dropdown replaces old CTAs; asymmetric split hero; timestamp+location moved to right
- About: 6 sections — story (short version), 3 principles, CRAFT acronym watermark, South Bay marquee, CTA
- ADU/Remediation/Consulting: visual hero + need + FAQ + process + acronym + start-here template
- Services landing: asymmetric 3-tile gateway
- Portfolio: `/portfolio` route (was `/projects`); Process page deleted, content merged in
- Footer: rolling marquee + broken-color blocks + schedule CTA

### V2.5 elevation pass
New infrastructure:
- `components/system/` — GrainOverlay, RightScrollProgress, GlassCard, 6 SVG silhouettes
- `lib/hooks/` — useMagnetic, useSectionScrub, useTilt
- `app/template.tsx` — cinematic curtain page transition
- Custom scrollbar (maroon), `::selection` (maroon), GrainOverlay 0.055

Per-page upgrades:
- All 9 pages: silhouette parallax overlays, glass cards, 2-layer marquees, magnetic CTAs
- CRAFT/ADU/Remediation acronym sections: GlassCard definitions
- Service heroes: per-page silhouette (Arch/ConstructionLine/Blueprint)
- Footer: magnetic 828 anchor, license badge glow

### Homepage Cinematic Overhaul (Prompt 1)
- `SplashScreen.tsx`: `rotateX: 88→0` 3-channel reveal + maroon radial ignition + curtain-wipe exit
- `Header.tsx`: sub-nav marquee strip (35s always-on) + BOOK CALL `pulseGlow` animation + magnetic 0.55
- `HeroV2.tsx`: mesh gradient idle drift + silhouette 65vw/0.55/float/-85% parallax + photo 1.10 + copy -20% + headline rotateX load entry + scroll fade-out
- `ServicesPreviewV2.tsx`: useTilt(10) 3D cards + z:40 lift + maroon shadow + rotateY entry
- `AboutPreview.tsx`: SplitType clipPath curtain-wipe + ConstructionLine silhouette 0.08 + magnetic CTA
- `Footer.tsx`: 2-layer marquee size contrast (2.2rem bg vs 9px fg, 0.18 vs 1.0 opacity)
- `CustomCursor.tsx`: `.has-custom-cursor` body class hides native cursor on `pointer:fine`
- `globals.css`: `@keyframes pulseGlow`, `.book-call-cta`, `.has-custom-cursor * { cursor: none }`
- Preflight hardened for Windows OOM: .next wipe pre-build, NODE_OPTIONS 4096MB, chromium flags

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
