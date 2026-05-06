# Competitive Analysis — 828 Construction Homepage Polish Pass
## Date: 2026-04-19

## Reference sites analyzed
1. **Feldman Architecture** (feldmanarchitecture.com/projects) — premium residential, minimal editorial
2. **NS Builders** (nsbuilders.com) — dark luxury, full-bleed imagery
3. **Olson Kundig** (olsonkundig.com/projects) — architectural photography-first grid

---

## Pattern observations

### Feldman Architecture
- Project grid uses strict 12-column layout with intentional column offsets — no project card touches every edge
- Featured projects span 8-columns, secondaries span 4-columns; the asymmetry creates hierarchy
- Category label appears ABOVE the project title in tracked all-caps at 9-10px — never alongside
- Project numbers (01, 02, 03) appear at full opacity in tabular figures, not as ghost watermarks
- Hover state: title slides UP from bottom over the image (clip-path reveal from bottom)
- Background of section alternates between off-white (#f5f5f5) and near-black (#111) per project group
- Footer: two-column on mobile — navigation left, contact right, minimal spacing

### NS Builders
- Full-viewport image loading with a cinematic dark overlay on load
- Projects presented as full-bleed sequential scrollers — one project per screen on desktop
- Project title in 60-80px display, white, bottom-anchored on the image
- Strong use of white space between project cards — 24-32px gap minimum
- Mobile: collapses to single-column with full-width images at 50vw height
- Footer mobile: stacked, centered, with large phone number as the dominant element

### Olson Kundig
- Projects grid: uniform 3-column at desktop, clean square aspect ratios (1:1 or 4:3)
- Text treatment is extremely minimal — title only, no description, no location in grid
- Counter at top of projects section: "01 / 24 Projects" — shows scale and confidence
- Clip-path reveals on scroll entry: image shrinks from 10% padding to 0% (punch-in effect)
- Footer: heavy horizontal line separates footer from content, logo center-aligned, nav inline
- Mobile footer: logo top, nav links in two columns, copyright bottom — clean and hierarchical

---

## Animation rhythm

### Feldman
- Scroll-linked clip-path on each project card: `inset(8% 8% 8% 8%) → inset(0%)` as card enters viewport
- Category label slides up (yPercent 100→0) 150ms before title
- Grid appears section by section, not all at once — each row has its own ScrollTrigger

### NS Builders
- Full-bleed parallax: image moves at 60% scroll speed relative to viewport
- Title fade-in after image settles (400ms delay)
- No hover states — images fill the frame, hovering does nothing

### Olson Kundig
- "Punch-in" reveal: clip-path from inset(12%) to inset(0%), 800ms power3.out
- Stagger between cards: 120ms between each card in a row
- Counter updates as cards enter view

### Pattern for 828
- Use Feldman's asymmetric grid (featured card large, smaller stacked alongside)
- Use Olson Kundig's punch-in clip-path reveal (more dramatic than simple y/opacity)
- Use NS Builders' parallax depth (-12% yPercent scrub) on all project images
- Hover: Feldman's title-reveal-from-bottom pattern (clip-path bottom reveal)

---

## Mobile treatment

### Feldman
- Desktop 8/4 column split collapses to single full-width column on mobile
- Featured card retains its aspect ratio (4:3 landscape), secondaries become square
- Navigation and column labels disappear; only image, title, location remain

### NS Builders
- Mobile shows one project per screen — full viewport width, 55vh height
- Swipe gesture implied by visible edge of next card (10% peeking)
- No horizontal scroll; cards stack vertically

### Olson Kundig
- 3-column grid → 1-column on mobile, maintaining square aspect ratios
- Counter stays visible at top
- Large tap targets — each card is minimum 200px tall

### Pattern for 828 mobile projects
- Stack all cards full-width at mobile
- Featured card at aspect 4:3, secondaries at 3:2
- Title overlaid at bottom with gradient
- Horizontal copper rule separates each card
- Category label + location below image on mobile (not overlaid)

---

## What to steal for this task

### 1. Feldman's asymmetric featured+secondary layout
Implementation: 12-col grid, featured spans col 1-8 (full height 60-65vh), secondaries stack in col 9-12 (each ~30vh). Header with project count and "Selected Work" label. No dead space — the two secondary cards exactly match the featured card's height.

### 2. Olson Kundig's punch-in clip-path entrance
Implementation: `gsap.fromTo(card, { clipPath: "inset(6% 6% 6% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.out" })`. More cinematic than a simple y-fade.

### 3. NS Builders' bottom-anchored title with gradient
Implementation: `absolute bottom-0 inset-x-0`, `bg-gradient-to-t from-black/80 via-black/30 to-transparent`. Title in 20-28px display font. Location in 9px tracked caps below.

### 4. Category counter (Olson Kundig)
Implementation: Top-right of section header: `01 — 03` or `Selected: 3 of 11`. Small tracked label. Updates on hover with GSAP number swap.

### 5. Mobile footer editorial stack (NS Builders)
Implementation: Large phone number as hero element (24px tabular), copper hairline above, navigation as horizontal comma-separated list (not two columns), address minimal single line, copyright bottom-strip with license number.

---

## Projects layout scoring matrix

| Criterion | Variation A (Asymmetric Grid) | Variation B (Film Strip) | Variation C (3-Col Punch-in) |
|---|---|---|---|
| Zero dead space | 5 | 4 | 5 |
| Continuous scroll motion | 4 | 5 | 4 |
| Editorial sophistication | 5 | 4 | 4 |
| Full-bleed photography | 4 | 5 | 4 |
| Mobile graceful | 5 | 4 | 4 |
| **Total** | **23** | **22** | **21** |

**Winner: Variation A** — Asymmetric editorial grid. Zero dead space through the featured+stacked secondary layout. Most editorial sophistication (closest to Feldman). Best mobile collapse (full-width stacking).

---

## Mobile footer scoring matrix

| Criterion | Variation A (Stacked editorial) | Variation B (Centered) | Variation C (CTA-first) |
|---|---|---|---|
| Editorial feel | 5 | 3 | 4 |
| Information hierarchy | 5 | 4 | 3 |
| Brand consistency | 5 | 4 | 4 |
| Scannability | 5 | 3 | 4 |
| Desktop compatibility | 5 | 4 | 4 |
| **Total** | **25** | **18** | **19** |

**Winner: Variation A** — Clear stacked hierarchy. Brand-consistent. Strong information architecture. Best desktop compatibility.
