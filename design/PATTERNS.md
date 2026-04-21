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
