# Current Homepage Diagnosis

**Date:** 2026-04-19  
**Page:** http://localhost:3000  
**Component source:** components/home/ (8 files, 1638 lines total)

---

### Section: Hero

**Screenshot:** research/before/section-hero.png  
**Component:** components/home/HeroSections.tsx (307 lines)

**What works:**
- Full-viewport black background with house photography creates immediate premium signal
- "Built with Intent." headline is confident and memorable — large display weight
- Framer Motion char-by-char animation on the headline is the one area of the page that earns its polish

**What fails:**
- Hero is physically short — the viewport slice is only ~60vh of actual hero before the nav chrome cuts in; feels like a banner, not an immersive arrival
- No `data-section="hero"` attribute, which breaks any ScrollTrigger targeting from external scripts
- The hero animation is an island — it fires beautifully and then the rest of the page is completely static. The user experiences a single cinematic moment followed by six inert sections. This is the core "animation cliff" problem.

**User's stated complaint:** Animation cliff after hero — hero has motion, every section below is static.  
**Priority:** Critical

---

### Section: Services

**Screenshot:** research/before/section-services.png  
**Component:** components/home/ServicesPreview.tsx (309 lines)

**What works:**
- "Three services. / One standard." headline is strong editorial copy
- Ghost number treatment (01/02/03 in copper at opacity 0.08) is a nice detail
- Animated border on hover (service-card-border-wrap) is thoughtful — invisible until needed
- Card cascade reveal (gsap.from with stagger 0.15s) is wired correctly

**What fails:**
- **Dead space is structural and severe.** The 12-col grid layout:
  - Row 1: ADU (`md:col-span-7`) + Remediation (`md:col-span-5`) → fills 12/12 cols ✓
  - Row 2: Consulting (`md:col-span-5 md:col-start-3`) → fills cols 3–7, leaving cols 1–2 empty left AND cols 8–12 empty right
  - Result: Consulting floats in the center-left of the second row with ~58% of the row width as black void
- The Consulting card height (`clamp(240px, 30vw, 380px)`) is also shorter than ADU/Remediation, compounding the "afterthought" visual
- Service images are currently fallback plates (dark grid texture) — when loaded they're photos but the fallback reveals the cards are designed for placeholder mode
- No parallax on card images — GSAP is imported but only hover-lift is wired, no scrub-based depth

**User's stated complaint:** Services section has dead space (explicit); doesn't feel like a $40k site (template grid).  
**Priority:** Critical — highest priority fix on the page

---

### Section: About

**Screenshot:** research/before/section-about.png  
**Component:** components/home/AboutPreview.tsx (229 lines)

**What works:**
- "20 years in the field. / Zero shortcuts." headline with gray "Zero shortcuts." at opacity 0.3 is effective hierarchy
- Overlapping image composition (two photos + floating "Built with Intent" card) creates depth and originality
- Clip-path reveal animation on images (inset wipe) is correctly implemented and smooth
- Stats (20+, 2004, license number) in stacked border-row format reads clean

**What fails:**
- Counter shows "9+" in the screenshot — the NumberCounter component fires immediately on mount rather than waiting for the element to enter viewport (or fires during page load before the section is visible). The animation completes before the user ever sees the section.
- `FadeIn` component wrapping every sub-block creates a choppy entry — each element fades independently with Intersection Observer but there's no coordination with the clip-path reveals on the image side. The left column and right column animate on separate triggers.
- The floating "Built with Intent" card (`zIndex: 3`) overlaps the bottom image but sits at 46% width × auto height — on smaller desktops it clips awkwardly
- No parallax on the image stack — images are static relative to scroll

**User's stated complaint:** Animation cliff (secondary); doesn't feel cohesive.  
**Priority:** High

---

### Section: Projects

**Screenshot:** research/before/section-projects.png  
**Component:** components/home/ProjectsPreview.tsx (214 lines)

**What works:**
- Real project photography is present and strong — Modern Herringbone Bath, Geometric Feature Bath, South Bay Outdoor Living are compelling
- Asymmetric 12-col grid (8/4 top row, then 10 offset) creates editorial variety
- Mouse-tracking parallax (x/y 18px range) on images is a nice hover detail
- Stagger cascade entrance (0.12s each) is correctly ScrollTriggered

**What fails:**
- Third project card (`md:col-span-10 md:col-start-3`) creates a similar dead-space pattern to services — cols 1–2 are empty to the left, creating an asymmetry that reads as an accident rather than a deliberate editorial offset
- No scroll-linked parallax on images — only mouse-move parallax fires, so the depth effect only appears during hover, not during scroll
- The section sits between two dark backgrounds (services bg-black → projects bg-gray-950) with no transition tissue — colors are nearly identical, making them blend into one long undifferentiated dark block visually
- Copper accent is completely absent from this section — no hover copper on cards, no copper divider between rows

**User's stated complaint:** Sections don't cohere; animation cliff below hero.  
**Priority:** High

---

### Section: Building Science ("We Don't Estimate. We Measure.")

**Screenshot:** research/before/section-building-science.png  
**Component:** components/home/BuildingScience.tsx (177 lines)

**What works:**
- "We Don't Estimate. We Measure." is the strongest headline on the page — it's a direct claim that competitors can't make
- Large copper "01 / 02 / 03" numerals anchoring each pillar row read as confident and editorial
- Image parallax is correctly implemented (`yPercent: -8, scrub: true`) — this is the only scroll-linked animation below the hero
- The floating "20+" stat card in the image area is a good compositional device

**What fails:**
- This section is sitting on `bg-white` between two dark sections (projects is `bg-gray-950`, CTA is `bg-black`) — the bright white flash between dark sections is jarring. The rhythm is: dark → WHITE → dark. This is the most disruptive section transition on the page.
- The 01/02/03 pillars are static list rows — they all appear simultaneously on scroll entry. The dramatic pinned scroll treatment (where each principle advances as you scroll) hasn't been implemented. All three principles have the same visual weight at all times.
- The pillar animation (`x: -50`) conflicts with FadeIn on the headline — they trigger at different scroll positions and the section feels like it's assembling from multiple directions at once
- `FadeIn delay={0.2}` on the image means the right column loads half a second after the text, making the 2-col layout feel unbalanced on entry

**User's stated complaint:** Animation cliff; doesn't cohere; doesn't feel like a $40k site.  
**Priority:** High (pinned scroll treatment = the highest-impact single animation on the page)

---

### Section: CTA ("Let's talk about your project.")

**Screenshot:** research/before/section-cta.png  
**Component:** components/home/HomeCTA.tsx (192 lines)

**What works:**
- Large headline ("Let's talk about / your project.") at `clamp(3rem, 6vw, 5.5rem)` fills the viewport correctly
- Copper fill-sweep on the "Request an Estimate" CTA button is slick — the translating background on hover is premium interaction design
- The ADU interior photo on the right has excellent color and composition
- The copper "20+" floating stat card bottom-right is a strong punctuation mark
- Slide-in animations (contentRef: x:-60, imageRef: x:60) on scroll entry create a satisfying arrival

**What fails:**
- Background image (`/images/hero/cta-background.jpg`) at `opacity-55` competes with the ADU interior photo — two images, neither clearly dominant. The background image gradient (`from-black via-black/80 to-black/50`) barely covers it.
- The clip-path reveal specified in Phase 3 plans hasn't been implemented — the kitchen image currently just slides in (`x: 60, scale: 0.97`), which is less dramatic than the Feldman-style curtain reveal
- Trust signal checkmarks (CA License, Torrance, Free Consultation) use SVG icons that are 14×14px — too small to read at a glance, they feel like fine print rather than confidence signals
- No inter-section hairline before this section — it begins abruptly after the white Building Science section

**User's stated complaint:** Doesn't feel like a $40k site; no scroll tissue between sections.  
**Priority:** High

---

## Summary — Four Critical Complaints

### 1. Services section has dead space
**Source:** `md:col-span-5 md:col-start-3` on Consulting card (ServicesPreview.tsx:249)  
**Result:** Consulting occupies cols 3–7. Cols 1–2 left empty, cols 8–12 right empty. The second row is 42% dead black space.  
**Fix required:** Eliminate the offset. Variation A (magazine), B (horizontal scroll), or C (editorial) all solve this differently.

### 2. Animation cliff after hero
**Source:** HeroSections.tsx fires Framer Motion. All six sections below use FadeIn (Intersection Observer opacity fade) as their only animation. GSAP ScrollTrigger is imported in 4 components but only does entrance reveals — no scrub-based scroll animation except one parallax in BuildingScience.  
**Fix required:** Unified scroll animation system. Every section needs: (a) headline reveal with line-stagger, (b) image parallax with scrub, (c) at minimum staggered card entrance if it has cards.

### 3. Sections don't cohere
**Source:** No shared visual language between sections. Each section was designed in isolation:
- Services: bg-black, dark cards
- About: bg-white, overlapping images
- Projects: bg-gray-950, dark cards
- Building Science: bg-white, horizontal rules
- CTA: bg-black, background image
No copper hairline dividers, no section counter system, no shared entry animation pattern.  
**Fix required:** ANIMATION_SYSTEM.md defines the language. Every section entry uses the same reveal grammar.

### 4. Doesn't feel like a $40k site
**Sources:** (a) Services dead space makes it look unfinished. (b) FadeIn component (opacity 0 → 1 from below) is the default Framer Motion tutorial animation — it signals template, not craft. (c) No scroll-linked parallax depth on images (only mouse-move). (d) Color rhythm (dark → white → dark → white → dark) feels like alternating WordPress sections rather than a composed page.  
**Fix required:** Replace FadeIn with clip-path reveals on images, line-stagger on headlines. Add scrub parallax to all images. Establish intentional color rhythm and copper hairline seams.
