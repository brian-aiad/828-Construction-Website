# Current State Audit — 828 Homepage Polish & Mobile Pass
## Date: 2026-04-19

---

## User-named complaints (explicit tracking)

### 1. "Selected Works (Projects) section doesn't look good"
**Before:** 12-column grid with featured card (col 1-8) + two secondaries (col 9-12) + a wide third card. The grid had copper parallax and hover states but the section read as a standard photo grid — not editorial. The header "Built with Intent." and copper divider were present but the cards lacked depth. The third card offset (md:col-start-2) left partial blank columns. Static screenshots showed pure black fields with barely-visible placeholder images.
**Status:** FIXED — Full redesign with Variation A: asymmetric editorial grid. Featured card (66% width), two secondaries stacked (33% width) matching featured height exactly, copper inter-row hairline, wide full-bleed bottom card. Punch-in clip-path entrance animation. Collapses to full-width single column on mobile.

### 2. "Navy blue color is banned"
**Before audit:** Searched all .tsx, .ts, .css files for #1e, #1a2, #0f1, navy, slate-, blue-, indigo-, sky-. Result: **Zero violations found.** The palette was already clean — black, white, gray ramp, copper only.
**Status:** CONFIRMED CLEAN — No changes needed. Documented in research/COLOR_AUDIT.md.

### 3. "Differentiator section has a big empty white space below it"
**Before:** BuildingScience used `pin: stickyRef.current` with `end: "+=" + window.innerHeight * 2.5` and no explicit height on wrapperRef. GSAP inserted a spacer div to fill the 250vh of extra scroll travel, creating approximately 250vh of raw whitespace visible in full-page screenshots and after the pinned section ended on live scroll.
**Status:** FIXED — `pinSpacing: false` added to ScrollTrigger config. Pin end reduced from 2.5× to 1.8× vh. wrapperRef given explicit `minHeight: 280vh` (100vh content + 180vh pin travel). HomeCTA section now begins at 9451px which exactly matches 6930 + 280*9 ≈ 9450px. No spacer div injected.

### 4. "Mobile footer doesn't look great"
**Before:** Footer on mobile collapsed to a stacked version of the desktop layout — logo, tagline, phone number (small, unstyled), navigation links in two equal columns (NAVIGATION and SERVICES), address, CTA button. The layout lacked editorial character. Navigation used full-length column labels. No visual hierarchy between contact and navigation.
**Status:** FIXED — Mobile footer redesigned with Variation A: large phone number (1.75rem bold) as dominant contact element, inline flex-wrap navigation (not two-column), services inline, address block, full-width "GET A FREE ESTIMATE →" CTA button, copper top accent line. Desktop layout unchanged.

---

## Section audit — all touched sections

### HeroSections
- **Desktop:** Works well. "Built with Intent." loads without animation (LCP-safe). Character-by-character "Intent." animation fires correctly.
- **Mobile:** Hero image visible at 390px. Image crops to the house detail. Overlay gradients maintain text readability.
- **Animation:** Parallax on bg image, content1Ref fades out on scroll, content2Ref fades in.
- **Issues found:** None. Verified LCP fix from previous pass still intact — line 1 renders as plain text.

### ServicesPreview
- **Desktop:** Three alternating editorial rows. Clip-path entrance from outside edges. Parallax yPercent -12 on images.
- **Mobile:** Rows stack vertically. Images appear at 56vw height. Tags now text-white/60 (contrast improved from previous pass).
- **Issues found:** None. Colors updated in previous pass.

### AboutPreview
- **Desktop:** Two-column layout with stats and dual-image reveal. Line-clip headline.
- **Mobile:** Single column. Stats visible. Images show.
- **Issues found:** None.

### ProjectsPreview — FULL REDESIGN
- **Desktop:** Asymmetric editorial grid. Featured 66% + two secondaries 33% stacked. Wide full-bleed bottom card. Punch-in clip-path entrance staggered 120ms. Parallax scrub on all cards. Copper bar on hover.
- **Mobile:** All cards stack full-width single column. Featured at 240px min height. Gap 2px.
- **Issues found and fixed:** Original 12-column grid inline style on mobile produced 32px columns — unreadable. Fixed with Tailwind responsive classes `grid-cols-1 md:grid-cols-12`.

### BuildingScience — PIN FIX
- **Desktop:** Pin resolves correctly. 280vh total height. Pillars advance through 3 states. Three images cross-fade. No spacer whitespace.
- **Mobile:** Pin disabled on mobile. Simple stagger reveal of pillar rows.
- **Issues found and fixed:** pinSpacing:false + explicit minHeight eliminates ghost whitespace.

### HomeCTA
- **Desktop:** Dark section with clip-path image reveal. Copper stat tag. Background parallax.
- **Mobile:** Copy+CTAs visible. Desktop image panel hidden (hidden lg:block).
- **Issues found:** None.

### Footer — MOBILE REDESIGN
- **Desktop:** Unchanged — 12-col grid with brand (5 col), nav+services (4 col), address+CTA (3 col).
- **Mobile:** Fully redesigned. Stacked editorial hierarchy. Large phone, inline nav, full-width CTA.
- **Issues found:** None after redesign.
