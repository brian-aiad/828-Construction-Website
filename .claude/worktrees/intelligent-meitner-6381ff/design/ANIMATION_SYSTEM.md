# 828 Construction — Site-Wide Animation System

**Authored:** 2026-04-19  
**For Phase 3 implementation. All values are final unless explicitly modified during a checkpoint review.**

---

## 1. Scroll Library Stack

### Lenis (smooth scroll)

```ts
// components/providers/LenisProvider.tsx
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.9,    // slightly reduced — site has large sections
  touchMultiplier: 1.5,    // mobile swipe: snappy
})
```

**GSAP ticker integration (critical — must be exact):**
```ts
import gsap from 'gsap'

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0) // prevents GSAP from compensating for lag, which fights Lenis
```

**Why lagSmoothing(0):** GSAP's default lag smoothing caps frame duration at 500ms, which causes a jump after a paused tab. With Lenis providing position, this creates a double-jump. Disabling it makes the two libraries behave as one.

**ScrollTrigger integration:**
```ts
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) {
      lenis.scrollTo(value, { immediate: true })
    }
    return lenis.scroll
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
  },
})

lenis.on('scroll', ScrollTrigger.update)
```

---

## 2. Section-Entry Pattern

**The default animation every section uses for its headline text.**

### Trigger parameters
```
trigger: section element (or headline container)
start: "top 72%"        — fires when section top is 72% down the viewport
end: not needed (oneshot, no scrub)
once: true              — fires once, doesn't re-trigger on scroll back
```

### Headline reveal (primary)
```ts
// Split headline text into lines using SplitText-style approach
// Implementation: wrap each line in a div.line-wrap with overflow:hidden,
// then animate the inner span from y:100% to y:0

gsap.from('.headline-line', {
  y: '100%',           // starts fully below clip boundary
  duration: 0.8,
  stagger: 0.08,       // 80ms between lines
  ease: 'power3.out',
  scrollTrigger: { trigger: headlineEl, start: 'top 72%', once: true }
})
```

**Why y:'100%' not opacity:** Clip-path-from-below is the Feldman pattern. Opacity fades (the current FadeIn component) feel like a loading state, not a deliberate reveal. The line-clip approach says "this text was waiting, and now it's ready."

### Body text and supporting elements
```ts
gsap.from(bodyText, {
  y: 24,
  opacity: 0,
  duration: 0.65,
  ease: 'power2.out',
  delay: 0.25,       // after headline lines complete
  scrollTrigger: { trigger: headlineEl, start: 'top 72%', once: true }
})
```

### Section label (small-caps above headline)
```ts
gsap.from(labelEl, {
  y: 16,
  opacity: 0,
  duration: 0.5,
  ease: 'power2.out',
  delay: -0.1,       // fires just before headline to set the stage
  scrollTrigger: { trigger: headlineEl, start: 'top 72%', once: true }
})
```

### Hook: `lib/animations/useReveal.ts`

```ts
interface UseRevealOptions {
  elementRef: React.RefObject<HTMLElement>
  childSelector?: string   // e.g., '.headline-line' for staggered children
  stagger?: number         // default 0.08
  delay?: number           // default 0
  yDistance?: number       // default 40 (px) — for non-clip reveals
  useClipPath?: boolean    // default false — true for headline lines
}
```

**Reduced motion fallback:** `useReveal` checks `AnimationController.shouldAnimate()` before registering any ScrollTrigger. If `prefers-reduced-motion: reduce` is set, the hook returns immediately and elements remain at their natural visible state.

---

## 3. Parallax Rules

All parallax uses `transform: translateY()` only — never `top`, `margin-top`, or `position` changes during scroll. All parallax images must have `will-change: transform` set before the animation starts (not permanently — set in the useEffect, remove in cleanup).

**Image height requirement:** For a parallax range of N%, the image must be at least `(100 + N)%` of its container height to prevent white-space gaps at the end of travel.

| Location | Container | Parallax % | Image height | Notes |
|---|---|---|---|---
| Services cards (A or C) | Card element | -8% | 108% of card | On mouseenter only for B (horizontal) |
| About section images | .about-image-wrap | -10% | 110% | Both images share one trigger |
| Projects cards | .project-card | -12% | 112% | Deeper — these are portfolio hero images |
| Building Science image | right column | -10% | 110% | Already partially implemented |
| CTA background image | full section | -6% | 106% | Background-position-style parallax |
| Hero extension panels (if implemented) | Full viewport panels | -15% | 115% | Deepest parallax = most cinematic |

**GSAP config for all scrub parallax:**
```ts
gsap.to(imageEl, {
  yPercent: -N,
  ease: 'none',       // linear scrub — ease is the scroll momentum, not the animation
  scrollTrigger: {
    trigger: containerEl,
    start: 'top bottom',   // when container bottom enters viewport
    end: 'bottom top',     // when container top exits viewport
    scrub: true,           // scrub: true = tied to scroll position 1:1
  }
})
```

**Performance:** `scrub: true` means GSAP only updates on scroll events (which are already RAF-throttled via Lenis). No additional RAF loop needed. GPU compositing handles the transform.

---

## 4. Pinned Moments

### Pin 1 — BuildingScience: "We Don't Estimate. We Measure." (REQUIRED)

This is the single highest-impact animation on the page. Currently, all three pillars (01/02/03) appear simultaneously as static list rows. The redesign converts this to a pinned sequence:

**Structure:**
- Pin the BuildingScience `<section>` for `300vh` of scroll travel (100vh per pillar)
- Within the pin, the three pillars advance sequentially
- Image on the right cross-fades as pillars advance

**GSAP implementation:**
```ts
const totalPinHeight = '300%' // 3 panels × 100vh each

// Pin the section
ScrollTrigger.create({
  trigger: buildingScienceSection,
  pin: true,
  start: 'top top',
  end: '+=' + (window.innerHeight * 3),
  scrub: false,
})

// Create a timeline that advances with scroll
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: buildingScienceSection,
    start: 'top top',
    end: '+=' + (window.innerHeight * 3),
    scrub: 1,
  }
})

// Pillar 1 → 2 transition (at 33% scroll through pin)
tl.to('#pillar-02', { opacity: 1, y: 0, duration: 0.33 }, 0.33)
  .to('#pillar-01', { opacity: 0.25, duration: 0.33 }, 0.33)
  .to('#number-01', { scale: 0.9, duration: 0.33 }, 0.33)
  .to('#number-02', { scale: 1.1, duration: 0.33 }, 0.33)

// Pillar 2 → 3 transition (at 66% scroll through pin)
tl.to('#pillar-03', { opacity: 1, y: 0, duration: 0.33 }, 0.66)
  .to('#pillar-02', { opacity: 0.25, duration: 0.33 }, 0.66)
  .to('#number-02', { scale: 0.9, duration: 0.33 }, 0.66)
  .to('#number-03', { scale: 1.1, duration: 0.33 }, 0.66)
```

**Pillar number states:**
- Inactive: `opacity: 0.12, scale: 1.0` (copper at very low opacity)
- Active: `opacity: 1.0, scale: 1.1, color: #B87333` (full copper)
- Past: `opacity: 0.12, scale: 0.9` (same as inactive, slightly smaller)

**Image cross-fade (if multiple images available):**
Three images stacked absolutely, opacity toggled: `[img1: 1, img2: 0, img3: 0]` → `[0, 1, 0]` → `[0, 0, 1]`.  
**If only one image:** Apply `filter` transforms instead:
- Pillar 1 (Root Cause): `contrast(1.08) saturate(1.12)` — base state
- Pillar 2 (Material Reality): `contrast(1.15) saturate(0.85)` — cooler, more analytical
- Pillar 3 (Scope Before Commitment): `contrast(1.05) saturate(1.2)` — warmer, resolved

**Mobile fallback:** On viewports < 1024px, the pin is disabled. Pillars reveal on scroll with stagger instead (the current behavior, improved).

### Pin 2 — Hero extension (optional, Phase 3.1 stretch goal)

If time permits, the hero section can be extended into 2–3 pinned panels (Olson Kundig pattern). Each panel is 100vh, shares the same hero background but with different photo and statement. This would eliminate the animation cliff entirely. Only implement if Phase 3 sections 3.2–3.6 are complete.

---

## 5. Section-to-Section Color Transitions

The current page rhythm: `black → white → gray-950 → white → black`  
The problem: the black and gray-950 sections blend together; the white sections are jarring bright flashes.

**Target rhythm:** `black (hero) → black (services) → white (about) → near-black (projects) → white (building science) → black (CTA)`

**Transition treatment:**

| Transition | Treatment |
|---|---|
| Hero → Services | Hard cut (both black). 1px copper hairline `scaleX 0→1` as section enters |
| Services → About | Hard cut: `bg-black` to `bg-white`. Hairline: 1px copper line, full width. On mobile, reduce to 0.5px. |
| About → Projects | Hard cut with the copper hairline. The contrast black→near-black is deliberate — About exhales (white), Projects re-enters the dark world. |
| Projects → Building Science | **Hard cut + gradient seam:** 24px gradient from `rgba(10,10,10,1)` to `#fff` overlaid on the section boundary. Prevents the abrupt dark-to-white flash. |
| Building Science → CTA | Hard cut: `bg-white` to `bg-black`. Copper hairline. The CTA section's full-bleed background image softens the transition by bleeding to the edges immediately. |

**Copper hairline implementation:**
```tsx
// components/layout/SectionDivider.tsx
export function CopperDivider() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    gsap.from(ref.current, {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 0.8,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true }
    })
  }, [])
  return <div ref={ref} style={{ height: 1, background: '#B87333', opacity: 0.5 }} />
}
```

---

## 6. Horizontal Scroll Moment

**Applicable if Variation B is selected OR for the Projects section.**

### Desktop: GSAP pin + scrub
```ts
const track = document.getElementById('service-track')
const trackWidth = track.scrollWidth - window.innerWidth

ScrollTrigger.create({
  trigger: '.services-section',
  pin: true,
  start: 'top top',
  end: '+=' + trackWidth,
  scrub: 1,
  onUpdate: (self) => {
    gsap.set(track, { x: -self.progress * trackWidth })
  }
})
```

**Engagement:** The section pins when its top reaches the viewport top. Scroll converts to horizontal track movement.  
**Disengagement:** When `self.progress === 1` (last card fully revealed), the pin releases automatically. Vertical scroll resumes. No special code needed — ScrollTrigger handles it.

**Edge case — over-scroll on trackpad:** When progress reaches 1, a small `setTimeout(lenis.start, 100)` call prevents a stuck feeling if the user continues scrolling fast.

### Mobile
Native `overflow-x: scroll` + `scroll-snap-type: x mandatory`. No pin. Track height is fixed at `70vw` min-height. Drag affordance dots update via `scroll` event listener.

---

## 7. Reduced Motion Fallback

The existing `AnimationController.shouldAnimate()` utility already checks `prefers-reduced-motion`. All animation hooks must call this first.

**When reduced motion is detected:**
- All `gsap.from()` and `gsap.to()` calls are skipped
- `ScrollTrigger` instances are not created (no pin, no scrub)
- Elements retain their natural CSS state (visible, no transforms)
- Lenis is still initialized but with `duration: 0` (instant scroll, no smoothing)
- CSS `transition` properties on hover states (copper border, tag colors) are preserved — these are user-initiated and appropriate for reduced-motion users
- The copper seam dividers are rendered at full `scaleX: 1` via CSS (no JS animation)

**Implementation pattern:**
```ts
// Every useReveal, useParallax call:
useEffect(() => {
  if (!AnimationController.shouldAnimate()) return
  // all GSAP code here
}, [])
```

**Test:** Add `?reducedMotion=1` query param to toggle in development without changing OS settings.

---

## 8. Performance Budget

**Hard rules — enforced in code review:**

1. **Max 2 ScrollTrigger instances per section.** Hero = 1 (hero animation). Services = 1 (card cascade + parallax can share a trigger). About = 1 (images + stats share a trigger). Projects = 1. BuildingScience = 2 (allowed: pin ST + image parallax ST). CTA = 1.

2. **GPU-only properties.** The permitted properties for scroll animation are: `transform` (translate, scale, rotate), `opacity`, `filter` (only `contrast`, `saturate`, `brightness` — avoid `blur` in scroll handlers, it causes paint). Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width` in a scroll handler.

3. **No layout thrash.** Do not read `offsetHeight`, `getBoundingClientRect`, or similar during a scroll event or GSAP update callback. Do all layout reads in the `useEffect` initialization block, store results in refs, and use those cached values in animation code.

4. **will-change discipline.** Set `will-change: transform` immediately before an animation starts (in the ScrollTrigger `onEnter` callback). Remove it in `onLeave` or when the animation completes. Do not set it globally in CSS — it promotes elements to their own compositor layer permanently, which wastes GPU memory.

5. **ScrollTrigger cleanup.** Every `gsap.context()` in a `useEffect` must return `() => ctx.revert()`. This prevents duplicate triggers when React StrictMode double-mounts in development.

6. **Stagger budget.** Card stagger: max 0.15s per card. Headline stagger: max 0.08s per line. Text element stagger: max 0.1s per element. Total section reveal time (start of first animation to end of last) should not exceed 1.5s.

7. **No GSAP plugins beyond ScrollTrigger unless installed.** We have GSAP 3.15.0. SplitText is a Club plugin (not installed). Implement line-splitting manually: wrap each text line in `<span class="line-wrap" style="overflow:hidden"><span class="line-inner">text</span></span>` and animate `.line-inner` with `y: '100%'`.

8. **Lenis disabled on mobile for pin sections.** When a GSAP pin is active, Lenis must be stopped (`lenis.stop()`) before the pin engages and restarted (`lenis.start()`) when the pin releases. This prevents the two scroll systems from fighting.

---

## Summary Table

| Section | Entry animation | Parallax | Pin | Copper seam |
|---|---|---|---|---|
| Hero | Framer Motion (existing) | Panel parallax (if extended) | Optional | No |
| Services | Clip-path card reveal (stagger) | -8% on card photos | No (B: yes) | Top |
| About | Line-stagger headline + clip-path images | -10% on images | No | Bottom |
| Projects | Card cascade stagger | -12% on card photos | No | Top |
| Building Science | Line-stagger headline | -10% on image | **Yes (300vh)** | Top |
| CTA | Line-stagger text + clip-path image | -6% on background | No | Top |
