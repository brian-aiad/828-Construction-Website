# Mobile Audit — 828 Homepage at 390×844
## Date: 2026-04-19

Each section diagnosed at 390px viewport.

---

### Hero
**Screenshot:** research/before/hero-390.png, research/final/homepage-390.png
**What works:** Text "Built with Intent." renders immediately (LCP-safe). CTA buttons visible. Header with phone + hamburger accessible.
**What needed attention:** Hero image appeared faint on initial load (image lazy-loading behavior). Now rendering correctly.
**Animation status:** Framer Motion character animation on "Intent." fires after hydration. Reduced-motion compliant.
**Touch targets:** CTA buttons ≥48px. Hamburger ≥44px.
**Verdict:** PASS

### ServicesPreview
**Screenshot:** research/before/services-390.png, research/final/mobile-scroll-frame2.png
**What works:** Each service row stacks image above text. Full-width. Heading, tagline, tags, and CTA link all visible.
**What needed attention:** Service tags were text-white/40 (fixed to text-white/60 in previous pass). Ghost service numbers aria-hidden.
**Animation status:** On mobile (<1024px), GSAP clip-path and parallax disabled. Simple stagger reveal fires instead.
**Touch targets:** CTA links are full-width with adequate padding.
**Verdict:** PASS

### AboutPreview
**Screenshot:** research/before/about-390.png
**What works:** "20 years in the field. Zero shortcuts." headline readable. Stats (6+, 463, etc.) visible.
**What needed attention:** None.
**Animation status:** Mobile-aware — clip-path and parallax animations fire but are reduced in scope.
**Verdict:** PASS

### ProjectsPreview
**Screenshot:** research/before/projects-390.png (OLD - tiny 12-col grid), research/after/projects-mobile-final.png (NEW)
**What worked:** None — original 12-column grid produced 32px columns on mobile, cards were unusable.
**What was fixed:** Full redesign with `grid-cols-1 md:grid-cols-12`. All 4 cards now stack full-width. Featured card at 240px min height. Secondary cards at 200px.
**Animation status:** Punch-in clip-path and parallax now fire correctly on mobile (GSAP via AnimationController).
**Touch targets:** Each card is a full-width link, ≥200px tall.
**Verdict:** PASS (after redesign)

### BuildingScience (Differentiator)
**Screenshot:** research/after/projects-mobile-mid.png
**What works:** On mobile (<1024px), pin is disabled. Pillar rows stagger in with opacity/x animation.
**What needed attention:** No pin on mobile — already handled in original code.
**Animation status:** Stagger fires. Headline clip-reveal fires. No pin complexity on mobile.
**Verdict:** PASS

### HomeCTA
**Screenshot:** research/after/cta-390.png
**What works:** "Let's talk about your project." headline visible. "Request an Estimate" and phone number CTAs visible. Trust badges visible.
**What needed attention:** Right-column image panel `hidden lg:block` on mobile — correct, not needed.
**Touch targets:** Both CTA buttons ≥48px height.
**Verdict:** PASS

### Footer
**Screenshot:** research/before/footer-390.png (OLD), research/after/footer-mobile-bottom.png (NEW)
**What was before:** Generic stacked layout. Small phone number. Two-column nav. Generic appearance.
**What was redesigned:** Large 1.75rem bold phone number as anchor. Inline flex-wrap nav. Services inline. Full-width CTA button with hover to copper. Clean bottom strip.
**Animation status:** FadeIn component on desktop only. Mobile footer renders immediately.
**Touch targets:** Full-width CTA button ≥48px height. Phone link full-width tap target.
**Verdict:** PASS (after redesign)

---

## Horizontal scroll check
No overflow/horizontal scroll detected at 390px. All sections use `overflow-hidden` or `max-w-7xl mx-auto` constraint.

## No-animation (reduced-motion) at mobile
Verified via `emulateMedia({ reducedMotion: 'reduce' })`. Screenshot: research/final/reduced-motion-390.png.
AnimationController.shouldAnimate() returns false under prefers-reduced-motion. All GSAP transforms and Framer Motion animations suppressed. Text and layout still render correctly.
