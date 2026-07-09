# 828 Construction — Animation Patterns & Known Fixes

This file is the ground truth for every animation pattern used on the site.
Copy from here. Never reinvent.

---

## Known Fixes

Catalog of real bugs that shipped and their solutions. Any new bug fix must
append to this section. Any new component must cross-check here before wiring
animations.

---

### Fix 1 — SplitType bulletproof cleanup

**Symptom:** `NotFoundError: Failed to execute 'removeChild'` in the console
when navigating away from a page that uses SplitType. Occurs reliably on
route transitions.

**Root cause:** React's cleanup (`useEffect` return) fires synchronously
during unmount. By then the DOM node may already be detached. Calling
`split.revert()` on a detached node triggers the removeChild error.
A bare `requestAnimationFrame(() => split.revert())` defers the revert but
does NOT cancel it if unmount completes before the frame fires — so the split
can be created after unmount and never reverted, or reverted on a node that's
gone.

**Fix — use all four guards together:**

```ts
useEffect(() => {
  const el = ref.current;
  if (!el) return;

  let split: SplitType | null = null;
  let mounted = true;
  const frame = requestAnimationFrame(() => {
    if (!mounted || !el.isConnected) return;       // guard: unmount before frame fired
    split = new SplitType(el, { types: 'chars' });
    // ... GSAP animations on split.chars / split.lines
  });

  return () => {
    mounted = false;                               // prevent creation after unmount
    cancelAnimationFrame(frame);                   // kill pending creation
    if (split && el.isConnected) {                 // only revert if node still in DOM
      try { split.revert(); } catch {}             // swallow any residual race
    }
    split = null;
  };
}, []);
```

**For multiple elements** (hero scatter with an array of splits):

```ts
useEffect(() => {
  let mounted = true;
  let splitFrame = -1;
  let localSplits: SplitType[] = [];
  let splitEls: HTMLElement[] = [];

  const ctx = gsap.context(() => {
    // ... other GSAP setup ...
    splitFrame = requestAnimationFrame(() => {
      if (!mounted) return;
      const lineEls = Array.from(container.querySelectorAll<HTMLElement>('.line'));
      splitEls = lineEls.filter(el => el.isConnected);
      localSplits = splitEls.map(el => new SplitType(el, { types: 'chars' }));
      splitsRef.current = localSplits;
      // ... animations
    });
  }, containerRef);

  return () => {
    mounted = false;
    cancelAnimationFrame(splitFrame);
    localSplits.forEach((s, i) => {
      if (splitEls[i]?.isConnected) { try { s.revert(); } catch {} }
    });
    localSplits = [];
    splitsRef.current = [];
    ctx.revert();
  };
}, []);
```

**Key points:**
- `isConnected` prevents revert on detached nodes
- `try/catch` silently swallows the residual race-condition case
- `mounted` flag prevents split creation if unmount happens before the frame fires
- `cancelAnimationFrame(frame)` kills the pending creation if cleanup runs first
- ALL FOUR are needed — any one alone still has a window for the error

---

### Fix 2 — Stacked pin panels (multiple panels visible simultaneously)

**Symptom:** During a GSAP pin section with cross-fading panels, two or more
panels are readable at the same time as you scroll.

**Root cause:** Opacity tweens have interpolated values between 0 and 1 during
the transition — there's always a frame where both panels are semi-visible.

**Fix:** Use `onUpdate` with `gsap.set()` for an instant opacity snap instead
of a clip-path or tweened opacity transition. One panel is always exactly 1,
all others are 0:

```ts
onUpdate: (self) => {
  const progress = self.progress;
  panels.forEach((panel, i) => {
    gsap.set(panel, { opacity: i === activeIndex ? 1 : 0 });
  });
}
```

---

### Fix 3 — Hero image nearly black

**Symptom:** Hero image looks almost black on load; the overlay/gradient kills
the photo.

**Root cause:** Gradient opacity too high (e.g. `from-black/95`) or image
brightness filter below 0.8.

**Fix:**
- Max gradient: `from-black/60` (bottom) and `from-black/50` (top header
  bleed) — never higher
- Image filter: `contrast(1.04) saturate(1.1) brightness(0.92)` minimum
- `brightness(1.05)` if the photo itself is dark

---

### Fix 4 — Stats/counters show 0 on load

**Symptom:** Animated number counters render "0" or "0+" instead of their
target value on page load, before the user scrolls.

**Root cause:** GSAP's `immediateRender: true` default causes the tween to
apply its start state (0) immediately on creation, overwriting the hardcoded
JSX value.

**Fix:** Set `immediateRender: false` so the JSX placeholder persists until
the ScrollTrigger fires:

```ts
// For fromTo on the DOM element:
gsap.fromTo(el, { textContent: 0 }, {
  textContent: target,
  immediateRender: false,  // ← preserves JSX value
  snap: { textContent: 1 },
  scrollTrigger: { ... scrub: 1.5 },
});

// For gsap.to on an intermediate object:
const obj = { val: 0 };
gsap.to(obj, {
  val: target,
  immediateRender: false,  // ← preserves DOM textContent
  onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
  scrollTrigger: { ... scrub: 1.5 },
});
```

---

### Fix 5 — White gap after pinned section (pin-spacer gap)

**Symptom:** A blank white strip appears below a GSAP-pinned section after
scrolling past it.

**Root cause:** `overflow: hidden` on the pin container creates a new scroll
context (a BFC), which interferes with GSAP's pin spacer div. GSAP inserts a
`<div class="pin-spacer">` to hold the scroll distance, but the containing
BFC collapses its height.

**Fix:** Replace `overflow-hidden` on any element that wraps a GSAP
`pin: true` target with `overflowX: "clip"`:

```tsx
// Wrong:
<div className="overflow-hidden">

// Right:
<div style={{ overflowX: "clip" }}>
```

`overflow-clip` clips visual overflow without creating a scroll container.

---

### Fix 6 — Cards / sections overflow horizontally

**Symptom:** Horizontal scrollbar appears; content bleeds off-screen on mobile.
Usually caused by an element with a parallax transform or negative margin.

**Root cause:** Same as Fix 5 — the nearest `overflow-hidden` ancestor that
would clip this is also the GSAP pin container, so GSAP suppresses it.

**Fix:** Same solution as Fix 5 — use `overflowX: "clip"` on the section
wrapper so clipping happens without creating a scroll container.

---

### Fix 7 — Hero text overflows into white background zone

**Symptom:** On the About page (and similar pages), the hero headline text
visually overlaps the white section below it, making text unreadable.

**Root cause:** Founder/content section uses a negative `marginTop` to create
an overlap effect. If the margin is too aggressive (e.g. `-22vh`) or the hero
text is too large, the two zones collide.

**Fix:**
- Limit font size: `clamp(5rem, 10vw, 7rem)` max
- Reduce hero padding-bottom: `pb-44` (desktop) / `pb-52` (mobile)
- Limit overlap: `marginTop: "-12vh"` not `-22vh`
- Test at 1440×900 and 390×844 — text must fully clear the white zone at
  both viewports

---

## Animation Vocabulary

Techniques referenced in component comments:

---

### Fix 8 — Copper-background strip (Design Violation)

**Symptom:** A horizontal marquee/strip section uses full copper (#B87333) as its
background color. Looks cheap and violates brand guidelines.

**Rule:** Copper (#B87333) must be used sparingly — thin lines, borders, hover states,
accent dots, and number labels ONLY. Never as a background for a layout block.

**Fix:**
```tsx
// Wrong:
<div className="bg-[#B87333] overflow-hidden py-3">

// Right:
<div className="bg-[#0a0a0a] overflow-hidden py-3 border-t border-b border-white/5">
  // Use copper only as separator dots inside the marquee:
  <span className="w-1 h-1 rounded-full" style={{ background: "#B87333", opacity: 0.5 }} />
```

---

### Fix 9 — Lighthouse LCP inflated by mobile throttle in localhost Lighthouse runs

**Symptom:** Lighthouse reports LCP of 5-7s and Performance score of 70-80 when run
against `localhost:4000` in default mobile mode.

**Root cause:** Lighthouse applies 4x CPU slowdown + 10 Mbps network throttle in
mobile mode. On localhost, static assets are served without CDN, fonts are
loaded locally, and the throttled CPU makes JavaScript execution appear very slow.
This produces an artificially inflated LCP.

**Fix:** Run with `--preset=desktop` for representative local scores. Reserve
mobile mode for deployed-to-CDN measurements:
```bash
npx lighthouse http://localhost:4000/services --preset=desktop --only-categories=performance,accessibility
```
Local desktop LCP result: 0.8s (vs 6.2s in mobile throttled mode).

---

### Fix 10 — Counter reverses on scroll-up

**Symptom:** Stats counter animates 0 → 20+ on first scroll-down, then reverts to some intermediate value when user scrolls back up. Confuses users and looks broken.

**Root cause:** ScrollTrigger fires both `onEnter` (down) and `onEnterBack` (up) without `once: true`, so the counter animation replays in reverse.

**Fix:**
```javascript
gsap.to(counterObj, {
  val: targetValue,
  duration: 2,
  ease: "power2.out",
  snap: { val: 1 },
  onUpdate: () => setDisplayValue(Math.floor(counterObj.val)),
  scrollTrigger: {
    trigger: el,
    start: "top 80%",
    once: true,          // ← the critical line
    // no toggleActions, no onLeaveBack
  },
});
```
Also: render the final value as JSX text content so it's there before JS hydrates.

---

### Fix 11 — Black/white abyss after pinned section

**Symptom:** Pinned section releases, and the next ~50–100vh is completely empty dead space before the next real section appears.

**Root cause:** Pin's `end: "+=150%"` or similar extends the scroll range by that distance, but no content fills the extension. When the pin releases, the spacer is all that's left until the next section triggers.

**Fix (pick one based on intent):**
- **Option A — shorten the pin:** reduce `end` to just enough for the pin's internal animation. Usually the correct fix.
- **Option B — fill the released region with content:** add a reveal section immediately after the pin that occupies the previously-empty scroll distance.
- **Option C — remove the pin entirely on mobile:** wrap in `matchMedia` and disable below 1024px per the v3.2 mobile philosophy.

Verify: scroll the page and capture the 100vh immediately after each pin releases. No visible dead zone.

---

### Fix 12 — Mobile hero two-state overlap (section 1 and section 2 visible simultaneously)

**Symptom:** On mobile (< 768px), two hero headlines are visible on top of each other during the hero's scroll transition. Desktop is fine.

**Root cause:** The hero uses a 200vh wrapper with a sticky inner panel containing two absolutely-positioned sections. Section 1's exit animation (GSAP SplitType char scatter) is gated behind `AnimationController.shouldAnimate()`, which returns `false` on mobile. Section 2's fade-in is NOT gated — it runs on all devices. So on mobile, section 1 never fades out but section 2 fades in, and both are visible simultaneously.

**Fix:** Add a device-conditional fallback that fades the section 1 headline when `!shouldAnimate()`. Fade it out BEFORE section 2 starts fading in:

```tsx
// Mobile fallback: fade entire heading without SplitType
if (headlineRef.current && !AnimationController.shouldAnimate()) {
  gsap.to(headlineRef.current, {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: wrapperRef.current,
      start: "10% top",
      end: "33% top",   // ends before section 2 starts at 35%
      scrub: 1,
    },
  });
}

// Desktop: char scatter (existing — keeps running unchanged)
if (headlineRef.current && AnimationController.shouldAnimate()) { ... }
```

**General rule:** Any section with two or more absolutely-positioned content layers that transition via scroll must have an **explicit exit** for the outgoing layer on ALL devices, not relying solely on a `shouldAnimate()`-gated desktop path.

---

### Fix 13 — Photos invisible after mid-page refresh / page doesn't scroll to top on refresh

**Symptom:** Refreshing the browser at any non-zero scroll position causes images to disappear (stuck with `opacity:0` or `clipPath: inset(8%)`). Also, page loads mid-scroll instead of returning to top.

**Root cause:** Two-part race condition:
1. Browser scroll restoration (`scrollRestoration='auto'`) fires and sets `window.scrollY` to the previous position BEFORE GSAP/Lenis initialise.
2. GSAP's `fromTo()` default `immediateRender: true` applies the `from` state (opacity:0, clipPath hidden) to all elements immediately on context creation.
3. `once: true` triggers whose `start` positions are now "already past" (because the page loaded mid-scroll) never re-fire → elements stay permanently invisible.

**Fix — three-layer defence:**
1. **Inline `<script>` in `app/layout.tsx` body** (runs synchronously before any JS/CSS):
```tsx
<script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual';window.scrollTo(0,0);" }} />
```
2. **`useEffect([], LenisProvider)`** — belt-and-suspenders after hydration:
```ts
useEffect(() => {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}, []);
```
3. **Debounced resize + visibility-change handlers in LenisProvider** — prevents stale ScrollTrigger positions after window resize or tab switch:
```ts
window.addEventListener('resize', () => { lenis.resize(); ScrollTrigger.refresh(); }, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') ScrollTrigger.refresh(); });
```

**Files changed:** `app/layout.tsx`, `components/providers/LenisProvider.tsx`

---

### Fix 14 — Mobile photo invisible (hardcoded GSAP-driven clipPath in JSX)

**Symptom:** Image never appears on mobile (or intermittently on desktop after a refresh). The image container in JSX has `style={{ clipPath: "inset(100% 0 0 0)" }}` and GSAP is expected to clear it — but GSAP's `shouldAnimate()` gate returns false on mobile so GSAP never runs, and the clip is never cleared.

**Root cause:** An initial animation state (`clipPath: inset(100% ...)`, `opacity: 0`, `transform: translateY(100%)`) is set in JSX `style={{}}`. On mobile, `AnimationController.shouldAnimate()` returns false and the entire useEffect returns early without ever touching the element. The image stays permanently invisible.

**Fix:** Move the initial state OUT of JSX into a `gsap.set()` inside the useEffect, BEFORE the conditional gate. On mobile, immediately clear the initial state with a second `gsap.set()`:

```tsx
useEffect(() => {
  if (!wrapperRef.current) return;
  const ctx = gsap.context(() => {
    // Set initial state HERE, not in JSX:
    gsap.set(imgRef.current, { clipPath: "inset(100% 0 0 0)" });

    if (!AnimationController.shouldAnimate()) {
      // Mobile: immediately clear — image visible, no animation
      gsap.set(imgRef.current, { clipPath: "inset(0% 0 0 0)" });
      // ... simple reveal animations for other elements ...
      return;
    }
    // Desktop: scrub animation clears the initial state
    gsap.fromTo(imgRef.current, { clipPath: "inset(100% 0 0 0)" }, { ... scrub ... });
  }, wrapperRef);
  return () => { try { ctx.revert(); } catch {} };
}, []);
```

**JSX:** Remove all initial-state inline styles from elements that GSAP controls.

**Prevention:** `grep -rn 'clipPath:.*inset' components/` and `grep -rn 'opacity: 0,' components/` to find suspect JSX style props.

---

### Fix 15 — Section feels static during scroll despite having animations

**Symptom:** Section has scroll animations in code, but when the user scrolls through it, almost nothing appears to move. Motion happens in the first second of entry, then goes dead for the remaining 70-80% of scroll through the section.

**Root cause:** All animations are `once: true` with time-based `duration` (0.7–1.0s). They play on enter and complete instantly. The remaining scroll through the section has no visual change — especially painful in tall sections (minHeight: 100vh per row, pillars stacked 3–4 rows deep).

**Fix:** Convert at least one "sustained" animation per section from once-time-based to scrub-tied with `start`/`end` spanning a meaningful portion of the section's scroll range:

```ts
// BEFORE (once, all fires at once on enter):
gsap.fromTo(rows, { opacity: 0, y: 28 }, {
  opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
  scrollTrigger: { trigger: wrapperRef.current, start: "top 70%", once: true },
});

// AFTER (scrub-tied per row — each reveals as user scrolls past it):
rows.forEach((row) => {
  gsap.fromTo(row, { opacity: 0, y: 28 }, {
    opacity: 1, y: 0, ease: "power2.out",
    scrollTrigger: { trigger: row, start: "top 85%", end: "top 52%", scrub: 1.2 },
  });
});
```

For text panels in alternating-image rows (ServicesPreview pattern), convert the text stagger to scrub:

```ts
gsap.fromTo(textEls, { y: 32, opacity: 0 }, {
  y: 0, opacity: 1,
  stagger: { each: 0.06, from: "start" },
  ease: "power3.out",
  scrollTrigger: { trigger, start: "top 72%", end: "top 32%", scrub: 1.1 },
});
```

**Prevention:** `functional-qa.mjs` motion-density check requires `movementRatio > 0.15` on desktop. Section density below that threshold fails QA automatically.

---

### Fix 16 — All images/elements invisible on hard refresh (ScrollTrigger killed on mount)

**Symptom:** On browser refresh (F5/Ctrl+R), the entire page appears broken: all
animated images are stuck invisible (clipPath hidden or opacity:0), no text reveals
run, no counters animate. Tab switch and client-side navigation work fine. Only
hard refresh breaks the page.

**Root cause:** Two compounding bugs:

1. **LenisProvider kills ALL ScrollTriggers on initial mount.** In React, children
effects fire before parent effects. Page components create ScrollTriggers in their
`useEffect`. Then LenisProvider's `[pathname]` effect runs (as a parent, it fires
LAST) and calls `ScrollTrigger.getAll().forEach(st => st.kill())` — destroying all
freshly-created triggers. Elements stay permanently at their GSAP `from` state.
On client-side navigation this doesn't bite because Next.js Suspense means
LenisProvider's effect fires before the new page's effects.

2. **`window.scrollTo(0, 0)` in `useEffect` fires too late.** The scroll reset ran
after GSAP triggers were already created. If the browser restored a non-zero scroll
position first, `once: true` triggers whose start had been passed would never fire.

**Fix — three layers in `LenisProvider.tsx`:**

```ts
const isFirstMount = useRef(true);

// 1. useLayoutEffect fires synchronously BEFORE any useEffect (including children's
//    GSAP setup). Guarantees window.scrollY = 0 when triggers are created.
useLayoutEffect(() => {
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
}, []);

// 2. [pathname] effect: skip trigger kill on initial mount.
useEffect(() => {
  if (isFirstMount.current) {
    isFirstMount.current = false;
    window.scrollTo(0, 0);
    return;  // ← DO NOT kill triggers on first mount
  }
  ScrollTrigger.getAll().forEach((st) => st.kill());
}, [pathname]);

// 3. After Lenis connects, refresh all trigger positions.
useEffect(() => {
  // ... Lenis init ...
  ScrollTrigger.refresh();
}, []);
```

**Files changed:** `components/providers/LenisProvider.tsx`

---

### Fix 17 — Preflight false-positive invisible images (GSAP-managed initially-hidden elements)

**Symptom:** `npm run preflight:full` reports invisible images on Services and Projects desktop routes, even though the images correctly reveal on scroll and there is no Fix 14 violation. The preflight's invisible image check was walking up the ancestor chain looking for `clipPath: inset(100%)` and flagging intentional GSAP scroll-reveal images.

**Root cause:** The preflight's invisible image check uses `gsap.fromTo()` with `immediateRender: true` (default), which sets the element's initial clipPath to `inset(100%)` at page load. At the time the Playwright check runs (after page load + 2500ms wait), the element IS in the viewport range (within 1.5 viewport heights) and IS invisible. The check correctly detected the clipPath but had no way to know GSAP would reveal it on scroll.

The `data-pin-image` attribute used for PinnedTimeline images was already skipping pin-phase images, but non-pin scroll-reveal images were not marked.

**Fix — add `data-gsap-reveal="true"` to GSAP-managed image wrappers:**

```tsx
// ServicesContent.tsx — image mosaic wrappers
<div ref={img1Ref} data-gsap-reveal="true" className="relative overflow-hidden flex-[3]" ...>
<div ref={img2Ref} data-gsap-reveal="true" className="relative overflow-hidden flex-[2]" ...>

// ProjectsGallery.tsx — editorial image wrapper
<div ref={img3WrapRef} data-gsap-reveal="true" className="relative overflow-hidden flex-1" ...>
```

**Fix — update preflight's invisible image clipPath check to honor the attribute on the element that holds the clipPath (not an ancestor walk via closest()):**

```js
let el = img;
for (let i = 0; i < 6; i++) {
  const cp = getComputedStyle(el).clipPath;
  if (cp && cp.startsWith('inset(100%')) {
    if (el.hasAttribute('data-pin-image') || el.hasAttribute('data-gsap-reveal')) return false;
    return true;
  }
  if (!el.parentElement) break;
  el = el.parentElement;
}
```

**Files changed:** `components/services/ServicesContent.tsx`, `components/gallery/ProjectsGallery.tsx`, `.claude-work/scripts/preflight.mjs`

---

### Fix 18 — Invisible elements after client-side navigation (ScrollTrigger stale positions)

**Symptom:** After navigating between pages, images and animated elements stay permanently invisible (`opacity: 0`, `clipPath: inset(100%)`). Hard refresh fixes it. Cold first visit works. The bug appears progressively — the more you navigate, the more elements are stuck.

**Root cause:** LenisProvider kills ScrollTrigger instances on route change but does NOT call `ScrollTrigger.refresh()` after the new page's triggers are created. Trigger positions are calculated against the wrong layout (images still loading, DOM unsettled). `once: true` triggers that fire at the wrong position either never fire or fire instantly with wrong state — leaving elements permanently in their GSAP initial state (invisible).

**Fix — three layers in `LenisProvider.tsx`:**

1. **Two-pass `ScrollTrigger.refresh()` after navigation** — first pass at 300ms (React effects settled), second pass at 700ms (images loaded):
```ts
// In [pathname] effect, after killing old triggers:
const refreshTimer = setTimeout(() => {
  if (lenisRef.current) lenisRef.current.resize();
  ScrollTrigger.refresh(true);
  // Re-attach failsafe observer for new page
  failsafeObserverRef.current?.disconnect();
  failsafeObserverRef.current = attachRevealFailsafe() ?? null;
}, 300);
return () => clearTimeout(refreshTimer);
```

2. **`window.load` refresh on initial mount** — fires after all images have loaded and layout is final:
```ts
// In isFirstMount branch:
const doRefresh = () => {
  if (lenisRef.current) lenisRef.current.resize();
  ScrollTrigger.refresh(true);
  failsafeObserverRef.current?.disconnect();
  failsafeObserverRef.current = attachRevealFailsafe() ?? null;
};
if (document.readyState === "complete") {
  requestAnimationFrame(() => requestAnimationFrame(doRefresh));
} else {
  window.addEventListener("load", doRefresh, { once: true });
}
```

3. **IntersectionObserver failsafe** — 2.5s grace window after any GSAP-hidden element enters viewport. If still invisible after grace period, force-reveals it:
```ts
function attachRevealFailsafe() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      observer.unobserve(el);
      setTimeout(() => {
        if (!el.isConnected) return;
        const clip = window.getComputedStyle(el).clipPath;
        const opacity = parseFloat(window.getComputedStyle(el).opacity);
        const stuck = opacity < 0.08 || clip?.includes("inset(100%") || clip?.includes("inset(0% 100%");
        if (stuck) gsap.to(el, { opacity: 1, clipPath: "inset(0%)", y: 0, scale: 1, duration: 0.55, overwrite: true });
      }, 2500);
    });
  }, { threshold: 0.05 });
  // Watch explicit targets AND any inline-styled opacity:0 / clipPath:inset() elements
  document.querySelectorAll("[data-gsap-reveal], [style]").forEach(el => {
    const s = (el as HTMLElement).style;
    if (el.getAttribute("aria-hidden") === "true") return;
    if (s.clipPath?.includes("inset(100%") || s.clipPath?.includes("inset(0% 100%") || s.opacity === "0") {
      observer.observe(el as HTMLElement);
    }
  });
  document.querySelectorAll("[data-gsap-reveal]").forEach(el => observer.observe(el as HTMLElement));
  return observer;
}
```

**Prevention:** On every element that GSAP starts invisible (`gsap.set(el, { opacity: 0 })` or `gsap.set(el, { clipPath: "inset(100%)" })`), add `data-gsap-reveal="true"` to the JSX element so the failsafe can explicitly watch it.

**Files changed:** `components/providers/LenisProvider.tsx`

---

### Fix 19 — Double-animation conflict on SplitType paragraphs (blank white space)

**Symptom:** After navigating to the About page, large empty white areas appear where paragraph text should be. The paragraph container is visible but contains no visible text.

**Root cause:** The `AboutFounder` section applied TWO simultaneous GSAP animations to the same paragraph elements:
1. Container animation in `gsap.context()`: `gsap.fromTo(el, { y:26, opacity:0 }, ...)` — makes the whole `<p>` invisible
2. SplitType RAF: `gsap.fromTo(line, { yPercent:108, opacity:0 }, ...)` — makes the individual text lines invisible

When the container animation revealed the paragraph (opacity:1), the lines inside were still at `yPercent:108, opacity:0`. User saw an empty paragraph container — white space where text should be.

**Fix:** Remove the container-level scrub animation. Let only SplitType's line reveals handle paragraph text. With SplitType, paragraph containers default to `opacity:1` (CSS), and lines slide in from below via their own triggers. Single animation system, no conflict.

**Files changed:** `components/about/AboutContent.tsx`

---

### Fix 20 — Hover event listeners not removed on unmount (memory/error leak)

**Symptom:** After navigating away from a page with card hover effects, stale `mouseenter`/`mouseleave` listeners remain on detached DOM nodes. GSAP tweens on detached nodes produce errors in the animation queue. Accumulates across navigations.

**Root cause:** Hover event listeners added inside `gsap.context()` callbacks are NOT removed by `ctx.revert()`. Only GSAP tweens and ScrollTriggers are reverted — DOM event listeners are unaffected by GSAP cleanup.

**Fix:** Store hover handlers as named functions outside the context, `addEventListener` them explicitly, and `removeEventListener` them in the cleanup `return` function:

```ts
const hoverCleanups: Array<() => void> = [];

// INSIDE gsap.context():
cards.forEach((card) => {
  if (!window.matchMedia("(hover: hover)").matches) return;
  const onEnter = () => { /* gsap tweens */ };
  const onLeave = () => { /* gsap tweens */ };
  card.addEventListener("mouseenter", onEnter);
  card.addEventListener("mouseleave", onLeave);
  hoverCleanups.push(() => {
    card.removeEventListener("mouseenter", onEnter);
    card.removeEventListener("mouseleave", onLeave);
  });
});

// In useEffect cleanup:
return () => {
  hoverCleanups.forEach(fn => fn());
  try { ctx.revert(); } catch {}
};
```

This pattern is already used correctly in `ServicesPreview.tsx`. Apply it to any component that adds DOM hover listeners inside a GSAP context.

**Files changed:** `components/home/ProjectsPreview.tsx`

---

### Fix 21 — Mid-word line breaks on display text (SplitType + Typography)

**Symptom:** Hero headlines and section display text break mid-word (e.g., "Construc/tion", "E/xists", "wit/h") across multiple pages at mobile and tablet viewports. The text reads as amateur and the break can occur at any letter, not just at spaces.

**Root cause:** SplitType `{ types: "chars" }` wraps each character in an independent `display: inline-block` div. Without word containers, these char divs reflow freely — the browser has no word-boundary information and can place a line break between any two adjacent chars. When a line's remaining space is exactly one character wide, that character moves to the next line, creating a 1-letter orphan at the start of a word.

**Fix — two layers:**

1. **Change all SplitType instances from `types: "chars"` to `types: "words,chars"`**
   
   This creates `.word` wrapper divs (`display: inline-block; white-space: nowrap`) around each word's chars. Word containers are atomic units — their chars never split. Animation code targeting `split.chars` is unaffected since `split.chars` returns the same char elements regardless of word wrapping.
   
   ```ts
   // Before (mid-word breaks possible):
   const split = new SplitType(el, { types: "chars" });
   
   // After (word-boundary only breaks):
   const split = new SplitType(el, { types: "words,chars" });
   // split.chars still works identically for all GSAP animations
   ```

2. **Add CSS baseline to all h1/h2/h3 in `globals.css`:**
   
   ```css
   h1, h2, h3 {
     word-break: normal;          /* only break at normal break points */
     overflow-wrap: break-word;   /* break within words only as last resort */
     hyphens: none;               /* never insert hyphens */
     -webkit-hyphens: none;
     -ms-hyphens: none;
     text-wrap: balance;          /* progressive enhancement: even line lengths */
   }
   ```
   
   `text-wrap: balance` prevents single-word orphans on the last line by distributing text more evenly across available lines. Supported in Chrome 114+, Firefox 121+, Safari 17+. Falls back gracefully (browsers without support get default wrapping, but the SplitType fix above prevents mid-word breaks regardless of `text-wrap` support).

**Files changed:** `app/globals.css`, all 9 component files using SplitType.

**Affected files:** `components/about/AboutContent.tsx`, `components/contact/ContactContent.tsx`, `components/gallery/ProjectsGallery.tsx`, `components/home/HeroSections.tsx`, `components/home/HomeCTA.tsx`, `components/home/HomeInterstitial.tsx`, `components/process/ProcessContent.tsx`, `components/services/ServiceDetailContent.tsx`, `components/services/ServicesContent.tsx`

---

### Fix 22 — Section titles never reveal after client-side navigation (stale positional once-triggers)

**Symptom:** A headline (or any element hidden by an entrance state like `yPercent: 110` /
`opacity: 0`) never appears — the section renders with an empty gap where its title should
be. Happens intermittently: fresh loads are fine, but navigating to another route and back
(nav link OR browser back button) leaves the title permanently hidden. Confirmed on both
"Refining industry standards." headlines (HomeVisionSequence intro + AboutPreview) on
2026-07-08; reproducible ~100% via Home → About → back → scroll.

**Root cause:** `ScrollTrigger` converts `start: "top 85%"` into an absolute document
offset at refresh time. Two things make that offset silently wrong on remount:
1. After a client-side route transition, triggers are recreated while layout/scroll state
   is mid-flight, and the recomputed start can land beyond any reachable scroll position.
2. Inside a sticky-stacked region (`EditorialFlow`'s `position: sticky` surfaces), an
   element's visual position diverges from its layout offset whenever a surface is stuck,
   so any refresh that runs in that state bakes in garbage offsets.
With `once: true`, a trigger whose start is never "crossed" never fires — and the initial
hidden `gsap.set()` state is permanent. No error, no warning.

**Fix:** Entrance reveals must key off *actual on-screen visibility*, not precomputed
scroll positions. Use `utils/revealOnVisible.ts` (IntersectionObserver wrapper) for every
one-shot entrance reveal; keep ScrollTrigger only for scrubbed animations:

```tsx
import { revealOnVisible } from "@/utils/revealOnVisible";

const revealCleanups: Array<() => void> = [];
// inside gsap.context, after the initial gsap.set(hidden) states:
revealCleanups.push(
  revealOnVisible([headlineRef.current ?? section], () => {
    gsap.to(headlineLines, { yPercent: 0, duration: 0.95, stagger: 0.1, ease: "power3.out" });
  })
);
// effect cleanup, BEFORE ctx.revert():
revealCleanups.forEach((dispose) => dispose());
```

**Rules going forward (any new page or section):**
- `scrollTrigger: { ..., once: true }` on an element with a hidden initial state is
  FORBIDDEN inside sticky/stacked surfaces and DISCOURAGED everywhere else — use
  `revealOnVisible` instead. `once: true` + positional start = silent permanent-hide risk.
- If an element's initial state is hidden, the thing that reveals it must be driven by
  IntersectionObserver (or an equally visibility-truthful mechanism), never by scroll math.
- Scrubbed animations (scrub: N) may keep ScrollTrigger, but their initial state must be
  readable if the trigger never fires (e.g., word-fill starting at opacity 0.28, clip-path
  starting at a mild inset — never fully invisible).
- Break-test recipe (run before calling any page done):
  `node .claude-work/research/home-approach-fix/break-probe.mjs http://localhost:3001 desktop`
  (and `mobile`) — covers slow scroll, instant jump, reload mid-page, nav round-trip,
  back-button. All reveal targets must end visible in every scenario. The generic
  cross-page version is `.claude-work/research/home-approach-fix/site-smoke.mjs`.

**Related timing rule (same session):** the process step-walk in `HomeVisionSequence`
selects the active row from live `getBoundingClientRect()` (sticky-proof) with the focus
line at `0.66 * innerHeight` and a `0.35 * innerHeight` stuck-walk window, so all five
rows light while still visible before the next surface covers the panel. Don't lower the
focus line or lengthen the stuck window without re-running probe scenario F.

**Files changed:** `utils/revealOnVisible.ts` (new), `components/home/HomeVisionSequence.tsx`, `components/home/AboutPreview.tsx`, `components/home/ServicesPreviewV2.tsx`

---

### Fix 23 — IntersectionObserver never fires on fully-clipped elements

**Symptom:** An element hidden with `clipPath: "inset(0% 0% 100% 0%)"` (the standard
clip-reveal initial state) never reveals when using `revealOnVisible` /
IntersectionObserver — even with the element scrolled fully into the viewport.
The LenisProvider reveal failsafe (Fix 18) does not rescue it either.

**Root cause:** IntersectionObserver computes the intersection of the target's
*clipped* rect with the root. An element whose own `clip-path` collapses it to
zero visible area has an empty intersection rect, so `isIntersecting` stays
`false` forever and no threshold is ever crossed. (Opacity/visibility do NOT
affect IO — only clipping and `display: none` do.) The same blind spot applies
to the Fix 18 failsafe, which observes the clipped element directly.

**Fix:** Never observe the clipped node itself. Observe its unclipped parent
(or section wrapper) and reveal the child:

```ts
revealCleanups.push(
  revealOnVisible(
    clips.map((el) => el.parentElement ?? el),
    (wrapper) => {
      const el = wrapper.querySelector<HTMLElement>(".svc-clip") ?? wrapper;
      gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut" });
    }
  )
);
```

**Rule:** for one-shot reveals, IO targets must be elements that are geometrically
visible when on screen — hide the *child*, observe the *container*. First hit:
`components/services/ServicesContent.tsx` (2026-07-08 services rebuild).

---

### Fix 24 — Reveal failsafe force-shows intentionally-hidden UI (stuck toast)

**Symptom:** The "Copied to clipboard" pill (PhoneCopyToast) appears ~2.5s after
page load with no user interaction and never goes away — visible floating over
content in Joe's own feedback videos (IMG_1127) and in every Playwright capture.

**Root cause:** The LenisProvider reveal failsafe (Fix 18) has a "broader catch"
that observes ANY element with inline `opacity: 0` and force-reveals it after a
2.5s grace window in-viewport. A toast/overlay that manages its own visibility
via inline `opacity: 0` (fixed-position, always "in viewport") is
indistinguishable from a stuck GSAP reveal target, so the failsafe paints it on
screen permanently.

**Fix:** self-managed hidden UI opts out with `data-failsafe-exempt` (attribute,
no value); the failsafe's broader catch skips those elements:

```ts
if (el.hasAttribute("data-failsafe-exempt")) return;
```

**Rule:** any component that intentionally holds `opacity: 0` inline as a rest
state (toasts, dropdown panels, dialogs) MUST carry `data-failsafe-exempt`.
Files: `components/providers/LenisProvider.tsx`, `components/ui/PhoneCopyToast.tsx`
(2026-07-09 contact rebuild).

---

### Fix 25 — Scrub reveals inside sticky stacked surfaces never complete (missing text)

**Symptom:** On /about, the CRAFT word-completion rows showed only the bare
capital + period (R. A. F. T.) — the word-rest spans stayed at their hidden
initial state. Intermittent: depended on scroll speed and position.

**Root cause:** The rows' reveals were `scrub`-tied ScrollTriggers with
`trigger: row`. The section lives inside AboutFlow/EditorialFlow **sticky
stacked surfaces**: once a surface pins (position:sticky engages), the row's
document offset freezes while scrollY keeps advancing — ScrollTrigger's
computed start/end positions go stale, the scrub parks at progress 0, and the
text stays hidden. Same failure class as the home process-row highlighter
(RECENT_CHANGES 2026-06-10); complements Fixes 15/18/23.

**Fix — rect-based decisive reveals + layered failsafes (never-missing-text
standard):**
1. Elements are **visible by default in JSX** (Fix 14). GSAP hides them only
   inside the gated animation setup, immediately before wiring the reveal.
2. Reveal via **IntersectionObserver** on each row (rect-based — immune to
   sticky pinning), playing a **decisive once tween** (`gsap.to`, no scrub,
   `overwrite: true`) so it always completes; letter ignition is a class add
   in the same callback.
3. **Failsafe sweep interval** (~1s): any un-revealed row whose
   `getBoundingClientRect()` intersects the viewport is force-revealed;
   interval self-clears when all rows are done.
4. `data-gsap-reveal="true"` on every GSAP-hidden element so LenisProvider's
   global failsafe (Fix 18) force-reveals anything still stuck after 2.5s.
5. Mobile/reduced-motion branch never hides anything.

**Rule:** Inside any sticky stacked surface (EditorialFlow/AboutFlow), do NOT
use scrub-parked ScrollTriggers for content-critical text. Scrub is fine for
decorative layers (watermarks, parallax); reading content gets decisive
rect-based reveals.

**Verified** with a 5-scenario torture test
(`.claude-work/research/about-v3/craft-torture.mjs`): slow scroll, fast fling
+ return, mid-page hard refresh, client-side nav, mobile 390 — all five words
fully visible in every scenario.

**Files changed:** `components/about/AboutContent.tsx` (2026-07-09).

---

---

### Pattern: Asterisk Dropdown Reveal (V2)

**Usage:** "Book Call" CTA in header (reveals phone number) AND FAQ expanders on ADU / Remediation / Consulting service pages.

**Interaction:**
- Trigger: click or hover on the anchor element
- Reveals: content below the trigger with a vertical slide-down
- Icon: `+` or `*` rotates 45° to `×` when open

**Implementation pattern:**
```tsx
const [open, setOpen] = useState(false);

<button
  onClick={() => setOpen(!open)}
  aria-expanded={open}
  className="flex items-center gap-2 font-labels text-[10px] tracking-[0.18em] uppercase"
>
  BOOK CALL
  <span
    style={{ display: 'inline-block', transition: 'transform 0.3s ease', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
    aria-hidden="true"
  >+</span>
</button>

{open && (
  <div
    style={{ overflow: 'hidden', animation: 'dropReveal 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
  >
    {/* revealed content */}
  </div>
)}

// globals.css:
// @keyframes dropReveal {
//   from { opacity: 0; transform: translateY(-8px); }
//   to   { opacity: 1; transform: translateY(0); }
// }
```

**FAQ variant:** Same pattern, with `aria-controls` pointing to the answer panel. Answer panel is `max-height: 0 → auto` via CSS transition, or `height: 0 → auto` via GSAP `to({ height: 'auto' })`.

---

### Pattern: Rolling Marquee (V2)

**Usage:** Footer top strip, About page area names ("South Bay Native" section), possibly portfolio category tags.

**Implementation:**
```tsx
// Two identical strips side-by-side, animating translateX(-50%)
<div className="overflow-hidden" aria-hidden="true">
  <div
    style={{
      display: 'flex',
      width: 'max-content',
      animation: 'marqueeScroll 60s linear infinite',
    }}
    // Pause on hover:
    onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
    onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
  >
    {[0, 1].map(i => (
      <div key={i} className="flex items-center gap-16 pr-16">
        {items.map((item, j) => (
          <span key={j} className="font-labels text-[11px] tracking-[0.22em] uppercase whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    ))}
  </div>
</div>
```

**Direction:** Default left-to-right (positive motion). For footer second strip: reverse (`animationDirection: 'reverse'` or negative translateX).
**Speed:** 60s default. Slow = intentional — the content should be readable, not a blur.
**Gap between items:** Use separator dots: `<span className="w-1 h-1 rounded-full bg-white/20 mx-4" aria-hidden="true" />` — NOT accent color as background (see Fix 8).
**CSS:** Uses existing `@keyframes marqueeScroll` in globals.css.
**Accessibility:** Wrap in `aria-hidden="true"` container. The actual content (city names, etc.) is also present in a visually-hidden semantic list if meaningful.

---

### Pattern: Glass / Depth Overlay (V2)

**Usage:** Dark sections that risk feeling flat. Adds glass-morphism depth to overlapping cards, hero overlays, and panel transitions.

**Principle:** The `.grain-overlay` fixed element (globals.css, opacity 0.028) is already site-wide. These patterns add LOCAL depth — per-section glass effects.

**Glass panel:**
```tsx
<div
  className="absolute inset-0 rounded-none"
  style={{
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  }}
  aria-hidden="true"
/>
```

**Noise texture on a dark section background:**
```tsx
// Use .blueprint-grid or a noise SVG layer at low opacity (0.03–0.05)
// DO NOT increase grain-overlay opacity globally — keep it at 0.028
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: 'url("data:image/svg+xml,...")', // same fractalNoise as grain-overlay
    backgroundSize: '256px 256px',
    opacity: 0.04,
    mixBlendMode: 'overlay',
  }}
  aria-hidden="true"
/>
```

**Gradient section dividers (replace hard cuts):**
```css
/* Dark section that should "breathe" into the next */
.section-depth-bottom::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 120px;
  background: var(--gradient-section-depth);
  pointer-events: none;
}
```

**Rule:** Glass effects are subtle — `opacity < 0.08` for blur panels, never a frosted-glass bank-of-fog effect. Think "dimension", not "translucency".

---

### Pattern: Asymmetric Hero Split (V2)

**Usage:** Home hero, Contact hero (Section 1), Contact Section 3 (mission split), story sections.

**Principle:** Photo occupies one side (~55-60% at desktop), text/copy occupies the other (~40-45%) with intentional negative space. Joe: "I like something that has a little bit more space right here, you know, for language."

**Desktop layout:**
```tsx
<section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
  {/* Image side — 60% */}
  <div className="relative overflow-hidden order-2 lg:order-1">
    <Image fill className="object-cover" alt="..." />
  </div>

  {/* Copy side — 40%, with padding that creates negative space */}
  <div className="relative flex flex-col justify-center px-12 lg:px-16 xl:px-24 order-1 lg:order-2">
    {/* Top aligned: eyebrow label */}
    {/* Center: headline + body */}
    {/* Bottom: CTA */}
  </div>
</section>
```

**Breakpoint behavior:**
- Mobile: stacks vertically. Image on top (full width, `aspect-[4/3]`), copy below.
- Tablet (768–1024px): Consider 50/50 split or continue vertical stack.
- Desktop (1024px+): 60/40 or 55/45 split. The "space" in the copy side is the design — resist the urge to fill it.

**Line divider variant (Contact Section 3):**
```tsx
// Visible divider line down the center:
<div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10" aria-hidden="true" />
```

---

## Animation Vocabulary

Techniques referenced in component comments:

| # | Technique | Description |
|---|-----------|-------------|
| 1 | CSS keyframe entry | LCP-safe entry animation — paint before JS hydrates |
| 2 | SplitType char scatter | chars disperse on scroll-out; bulletproof cleanup required |
| 3 | Scrub clip-path reveal | `inset()` wipes reveal tied to scroll progress |
| 4 | Scale-through-scroll | image zooms from 1.1 → 1.0 as element scrolls into view |
| 5 | Counter scrub | number counts up as you scroll through a section |
| 6 | Section overlap / z-index ride | white section overlaps dark hero with negative margin |
| 7 | Stagger emerge | elements fade+rise in sequence (no x-axis drift) |
| 8 | Parallax yPercent | background moves at different speed than foreground |
| 9 | GSAP pin + cross-fade | sticky panel; active state selected via onUpdate snap |
| 10 | Copper hairline scaleX | decorative line grows left→right via transform scrub |


---

## Per-Page Signatures

Each page has one animation moment that does not appear on any other page. These are the canonical signature moments — do not replicate them cross-page.

| Page | Unique Signature Moment |
|------|------------------------|
| Home (`/`) | **HomeInterstitial dual-layer ghost counter** — ghost watermark counter scrubs 0→150 behind SplitType headline chars on a full-bleed editorial section. Two simultaneous scrub-tied layers (large semi-transparent number in background + headline chars revealing at different rate) create a depth effect unique to the home page. No other page has this dual-layer typographic scrub. **Also:** **SplashScreen cinematic intro** — full-viewport black overlay with "828" (IBM Plex Mono, clamp 5rem→13rem) + copper underline scaleX draw (3px, 600ms, power2.inOut) + "CONSTRUCTION" (Space Grotesk, 0.48em tracking) — chars stagger IN 40ms/32ms per char (power3.out), hold 880ms, stagger OUT 25ms per char (power2.in), total 2.9s. sessionStorage gate: once per session. |
| About (`/about`) | **V6 — CRAFT letter-completion rows** — Joe's sketch made literal: the five acronym words COMPLETE out of their own capital letters ("C" + "uriosity." slides from behind the letter via overflow-clipped xPercent scrub, letter ignites maroon as the word escapes; descender-safe wrapper pads 0.14em). Letters stack down the left reading C/R/A/F/T; a whisper watermark (0.03) drifts bottom-right. Page carried by `AboutFlow.tsx` stacked surfaces with top-anchored cover-scale (no top-sliver artifact). No other page completes words out of letters. | |
| Services (`/services`) | **Illuminating index with a traveling picture** (Joe IMG_1075 + Brian's 2026-07-09 clarification) — whited-out full-width rows "long ways" across the screen; ONE photograph at a time expands under/overlapping the active word (CSS grid-rows 0fr→1fr stage, identical easing = net-zero reflow) and swaps as you scroll: previous picture gone, next service's picture in. Selection = last title past the focus line (monotone, flicker-proof, mobile-identical), top-of-page guard pins ADU first. No other page has an accordion picture that travels a typographic list. |
| Portfolio (`/portfolio`) | **Horizontal pin-scroll cinema strip + featured full-screen moment** — three photos scroll horizontally (GSAP pin + `containerAnimation`) with scale 1.15→1.0→0.85 + blur 6→0→4 peaking at center. Followed by a full-viewport featured section with scale-settling entry + char-by-char headline reveal. No other page has horizontal pin-scroll with per-photo containerAnimation. |
| Services/ADU (`/services/adu`) | **ADU watermark vertical drift** — giant "ADU" text (clamp 14rem→36rem, opacity 0.04) positioned absolute behind the acronym section, drifts yPercent: -8 via scrub ScrollTrigger tied to the section's full scroll range. Creates depth as the user reads through A/D/U definitions. Unique to this page — no other page uses a 3-letter-watermark-with-drift. |
| Services/Remediation (`/services/remediation`) | **Equipment model showcase** — two side-by-side dark-plate cards with model labels (Flair E8, 277 MR) using `font-numbers` with maroon accent tags. Photo placeholders hold the layout until Joe sends real equipment photos. No other page has an equipment-as-content-block pattern. |
| Services/Consulting (`/services/consulting`) | **Always-visible self-selection prompts in the FAQ card grid** (V3, Joe's 2026-07-09 batch) — the three "Questions and answers" cards pose Joe's questions TO the visitor and stay permanently open: no expanders, no answers, a "Worth a conversation" tag where ADU/Remediation cards have their +/× toggle. Card 01 spans two columns, card 03 spans three — the asymmetric span rhythm is unique to this page. Permanent editorial visibility remains the signature. |
| Contact (`/contact`) | **Row-embedded photo ignition** (V3, Joe's 2026-07-09 batch) — the full-bleed service-path rows carry their photograph INSIDE the row: a right-edge plate that wipes open (`clipPath` inset left→right) the moment the live-rect focus band ignites that row; on mobile the photo expands as a strip beneath the active title (height 0→10rem). Unlike the services index (sticky side-panel crossfade), the picture lives in the row and travels with it. Form interaction quality retained: maroon focus rings, labels above fields, honest 24-hour expectation line. |
