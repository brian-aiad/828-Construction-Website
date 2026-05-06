# Self-QA: PinnedDecisionAid

**Date:** 2026-04-20

## Changes Applied
- Added `immediateRender: false` to counter gsap.to() (Fix 4)
- Changed `gsap.to()` panel/num activate to `gsap.set()` (Fix 2 — instant snap, not tween)
- Fixed mobile headline+counter layout: added `flex-col sm:flex-row` (was cramped on 390px)
- Changed stickyRef wrapper: added `overflowX: "clip"` (Fix 5 — prevents pin spacer gap)

## Bug Fixes
- [x] Counter shows "3" on load (not "0") — immediateRender: false ✓
- [x] Pin spacer gap prevented — overflowX: "clip" on sticky container ✓
- [x] Panel activation: gsap.set() for instant snap (no tweened opacity) ✓

## Animation Checklist
- [x] Copper hairline scaleX scrub ✓
- [x] Counter scrub (immediateRender: false) ✓
- [x] Desktop pin + onUpdate setActive ✓
- [x] Mobile: stagger fade entry (event, once) ✓
- [x] isMobile: window.innerWidth < 1024 (within effect — correct) ✓

## Status: PASS
