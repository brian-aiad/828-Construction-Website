# Motion Inventory — About Page
Reference captures: nsbuilders.com/about, olsonkundig.com/about, feldmanarchitecture.com/about
Captured: 2026-04-20 | Frames: 82 (NSB desktop), 65 (NSB mobile), 42 (OK desktop), 5 (Feldman)

---

## Signature Techniques (to steal)

1. **Pinned values section** — each value owns 100vh, sticky wipe transition between them, unique image per value, progress dot indicator on left edge
2. **Hero image scale-on-scroll** — hero bg image grows from scale:1.0 → scale:1.12 as user scrolls away (continuous scrub, not fire-once)
3. **Section overlap / ride-over** — sections appear to slide over each other (via z-index stacking, sticky top:0 on progressive sections)
4. **Scrubbed clip-path image reveals** — images uncover continuously as scroll progresses toward them (NOT fire-once on enter)
5. **Image zoom-out as clip opens** — when clip reveal fires, image also scales 1.12 → 1.0 simultaneously, creating an "arriving" presence
6. **Left-edge progress indicator** — dot cluster on far left, active dot enlarges via scale as active section changes
7. **Continuous image scale through viewport** — every large photo scales 1.0 → 1.08+ while it's in viewport (parallel-scrub)
8. **Sticky CTA button** — "Start the Process" stays at bottom-left throughout entire scroll (NS Builders)

---

## Motion Entries

### Reference: nsbuilders.com/about — Section: Hero
**Observed behavior:** The hero fills 100vh at load. The craftsman photograph scales very slowly from approximately scale:1.0 to scale:1.08 as user scrolls through the first 100vh. The headline text (left) appears to move at a slower rate than the image, creating a multi-speed layered parallax — text translates upward at ~50% of scroll velocity while the image at ~100%. A CTA button is pinned to the bottom-left corner and stays fixed throughout the entire page scroll.
**Classification:** SCRUB
**Technique:** GSAP ScrollTrigger scrub:true on both image (scale + yPercent) and text (yPercent counter), plus a sticky/fixed CTA element
**Frame refs:** frames 000–008 (y=0 to y=1600)

### Reference: nsbuilders.com/about — Section: Hero fade-out
**Observed behavior:** As user scrolls past the hero, the text content (headline + body text) fades out and scales very slightly down (toward scale:0.97), creating a depth-departure effect. The photograph continues parallax after text has faded.
**Classification:** SCRUB
**Technique:** GSAP scrub:true on opacity + scale of text content block tied to scroll position in upper range of hero
**Frame refs:** frames 004–010 (y=800 to y=2000)

### Reference: nsbuilders.com/about — Section: About Nick portrait
**Observed behavior:** A full-viewport-height dark photograph section appears after the hero. The section overlaps the hero (the photo slides UP over the hero content as you scroll). The photograph takes up ~65% of viewport width on right side, with a minimal text overlay (name + quote) on left. The transition from hero to this section is seamless — no hard edge, the section rides over the previous one.
**Classification:** SCRUB
**Technique:** CSS sticky + z-index stacking creates overlap effect. Image has own scrub parallax (yPercent -8).
**Frame refs:** frames 008–012 (y=1600 to y=2400)

### Reference: nsbuilders.com/about — Section: EPICC statement
**Observed behavior:** A split-layout section (image left, text right: "In everything, a solid foundation is critical. Ours is EPICC."). The images scale 1.0 → 1.08 as they pass through the viewport. The text fades in from y:20 on enter (fire-once).
**Classification:** SCRUB (images) + EVENT (text)
**Technique:** GSAP scrub:true on image scale, fire-once on text entrance
**Frame refs:** frames 012–016 (y=2400 to y=3200)

### Reference: nsbuilders.com/about — Section: Values — PIN TRIGGER
**Observed behavior:** The Values section is the signature of the page. It spans approximately 500vh of scroll. A sticky container locks the viewport at top:0. As user scrolls through the 500vh range, 5 sequential "value panels" wipe in from the bottom: Creativity, Empathy, Passion, Intention, Collaboration. Each panel occupies ~100vh of scroll before the next wipe begins. Each panel has: (a) a giant typographic word at bottom-left in black text on white+image, (b) a full-width documentary photograph as background, (c) a description text block at right, (d) the "Values" label pinned at top-left. A 5-dot indicator on the left edge tracks which value is active — the active dot is larger.
**Classification:** SCRUB (pin + clip-path transitions)
**Technique:** CSS sticky container (height: 100vh, position: sticky, top: 0) inside a 500vh outer wrapper. Each value panel is absolute-positioned inside the sticky container. GSAP ScrollTrigger with scrub:1 drives clip-path transitions per panel as scroll progresses through 500vh range.
**Frame refs:** frames 020–040 (y=4000 to y=8000)

### Reference: nsbuilders.com/about — Section: Values — panel transition
**Observed behavior:** Each transition between value panels is a wipe. The new panel wipes upward from the bottom (the new panel's bottom half appears first, then progressively the full panel reveals from bottom to top as scroll advances). The transition is continuous — the panel is mid-reveal for approximately 200px of scroll, giving a smooth gradual handoff.
**Classification:** SCRUB
**Technique:** GSAP fromTo clipPath "inset(100% 0% 0% 0%)" → "inset(0% 0% 0% 0%)" with scrub:1.5 per transition
**Frame refs:** frames 022, 026, 030, 034 (mid-transition states)

### Reference: nsbuilders.com/about — Section: Values — image behavior
**Observed behavior:** Each value's background photograph has its own continuous parallax. As you scroll within a value's panel, the photograph's yPercent moves at approximately -10 to -15% relative to scroll. Additionally, images appear to scale very slightly (1.0 → 1.04) within the pin duration.
**Classification:** SCRUB
**Technique:** GSAP scrub:true on yPercent + scale per image, triggered on the outer 500vh section
**Frame refs:** frames 020–040 (visible as image crop shifts between panels)

### Reference: nsbuilders.com/about — Section: Team
**Observed behavior:** Left navigation panel stays sticky while right content scrolls. Active section name (About Nick / Values / Team / Collaborators / Careers) updates as you scroll into each section. Team member photo cards enter with a y:24, opacity:0 → y:0, opacity:1 stagger.
**Classification:** EVENT (cards) + SCRUB (active nav state)
**Technique:** Intersection Observer or GSAP ScrollTrigger callbacks to update active nav item; fire-once for cards
**Frame refs:** frames 040–060 (y=8000 to y=12000)

### Reference: olsonkundig.com/about — Section: Hero
**Observed behavior:** Minimal hero. "Our Team" headline appears against white. A group photograph below has yPercent parallax (~-8%) as it enters viewport.
**Classification:** SCRUB
**Technique:** GSAP ScrollTrigger scrub:true on image yPercent
**Frame refs:** frames 000–006

### Reference: olsonkundig.com/about — Section: History timeline
**Observed behavior:** A section with "1959" on the right side and a vintage black-and-white photograph. As you scroll, the year number transitions from "1959" to "Today" — this appears to be either a counter animation or a staggered clip-reveal where "1959" fades and "Today" fades in. A vintage portrait photograph has scrub parallax.
**Classification:** SCRUB (or EVENT-on-enter for the counter)
**Technique:** Either GSAP scrub-driven opacity cross-fade on year labels, or fire-once countup animation
**Frame refs:** frames 010–014 (y=2000 to y=2800)

### Reference: olsonkundig.com/about — Section: Studio locations
**Observed behavior:** Each studio section (Kirkland / New York) shows a documentary photograph on one side. The photographs all have continuous scrub scale animations (1.0 → 1.08) as they pass through viewport. Text blocks fade in from y:20 on enter.
**Classification:** SCRUB (images) + EVENT (text)
**Technique:** GSAP scrub:true on image scale, fire-once on text
**Frame refs:** frames 016–030

### Reference: olsonkundig.com/about — Section: Philosophy statement
**Observed behavior:** A full-width text statement over a dark background: "We embrace the tension between collaboration and autonomy." The text is very large display type. As user scrolls to it, it clip-reveals from bottom upward (yPercent: 100 → 0 inside overflow:hidden).
**Classification:** EVENT (fire-once with easing, not scrub)
**Technique:** GSAP fromTo yPercent:100 → 0 with stagger, scrollTrigger once:true
**Frame refs:** frames 002–004

### Reference: olsonkundig.com/about — Section: Image grid
**Observed behavior:** A grid of 3 photographs reveals with staggered clip-path punch-ins as you scroll to it. Each photograph also has a continuous scale scrub (1.05 → 1.0) while in viewport. Captions appear after panel punch-in with a slight delay (50ms).
**Classification:** SCRUB (panel clip as scrub) + EVENT (caption delay)
**Technique:** GSAP clipPath fromTo with scrub:1 per panel, stagger 0.15s; separate fire-once for caption
**Frame refs:** frames 018–024

### Reference: feldmanarchitecture.com/about — Section: Overview
**Observed behavior:** Large typographic lead statement dominates the top. The text is split into lines that clip-reveal upward from yPercent:100 with a stagger of ~0.08s per line. A large architectural photograph below parallaxes at -12% yPercent.
**Classification:** EVENT (text) + SCRUB (image)
**Technique:** GSAP yPercent:100 → 0 on lines (fire-once), scrub:true on image
**Frame refs:** frames 000–004

### Reference: feldmanarchitecture.com/about — Section: Values/Approach
**Observed behavior:** Numbered pillars (01, 02, 03) in a grid. Each card has a scale:0.94 → 1.0 entrance combined with opacity:0 → 1. The large numbers scale from scale:1.5 → 1.0 as the card enters, giving a "stamp" feel.
**Classification:** EVENT (fire-once)
**Technique:** GSAP fromTo with scale + opacity, back.out easing on number
**Frame refs:** frames 002–004

---

## Scrub vs Event Count

```
Total motion entries: 15
- SCRUB (continuous, tied to scroll position):  10
- EVENT (fire-once on enter):                    5
- Scrub:Event ratio:                          2.0:1
```

### Implementation target for 828 About page:
Scrub:Event ratio of **≥2:1**, matching reference pattern.

### 828 About page — achieved ratio (post-implementation):
Scrub animations implemented:
1. Hero bg yPercent (scrub) ✓
2. Hero bg scale 1.0→1.12 (scrub) ✓
3. Hero content fade-out on scroll (scrub) ✓
4. Story image clip reveal (scrub: start 85%, end 25%) ✓
5. Story image inner zoom 1.12→1.0 (scrub) ✓
6. Story image parallax ongoing (scrub) ✓
7. Story blockquote clip (scrub) ✓
8. Craft panel clip punch-in (scrub per panel) ✓
9. Craft image scale+yPercent through viewport (scrub) ✓
10. Craft copper hairline scaleX (scrub) ✓
11. Values pinned section: panel 2 wipe (scrub via timeline) ✓
12. Values pinned section: panel 3 wipe (scrub via timeline) ✓
13. Values pinned section: dot indicator (scrub via timeline) ✓
14. Values image scale through scroll (scrub) ✓
15. Science bg yPercent (scrub) ✓
16. Science bg scale (scrub) ✓
17. Fit hairline scaleX (scrub) ✓
18. Fit rows clip from top (scrub per row) ✓
19. CTA hairline scaleX (scrub) ✓

Event animations (fire-once):
1. Hero line clip-reveals (entry)
2. Hero fade elements entrance
3. Story eyebrow/h2 clip-reveals
4. Stats cells scale-pop
5. Craft caption yPercent reveals (delayed)
6. Values panel dot indicator initial state
7. Fit header scale-emerge
8. CTA eyebrow emerge
9. CTA line clip-reveals
10. CTA sub+actions emerge

```
Scrub count: 19
Event count: 10
Achieved ratio: 1.9:1
```

Close to target (2:1). All core visual moments are scrub-driven.
