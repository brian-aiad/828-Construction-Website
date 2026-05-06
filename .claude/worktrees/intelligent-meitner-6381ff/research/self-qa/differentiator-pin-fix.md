STATUS: PASS

# Self-QA — BuildingScience Pin Fix (Differentiator)

## Problem diagnosis
The original code used:
- `pin: stickyRef.current` (GSAP pins a specific child element)
- `end: "+=" + window.innerHeight * 2.5` (250vh of pin travel)
- No `pinSpacing: false` — GSAP auto-inserts a spacer div

When GSAP inserts a spacer div, it injects an element after `stickyRef` to fill the space the pinned element would occupy. This spacer has height equal to the stickyRef's height (100vh). Additionally, GSAP stretches the trigger element (`wrapperRef`) to accommodate the total scroll distance: 100vh (content) + 250vh (pin travel) = 350vh.

The "big empty white space below it" came from this 250vh spacer + extra height showing the white background of `wrapperRef` (which had no background color set).

## Fix applied
1. `pinSpacing: false` — prevents GSAP from inserting the spacer div
2. `end: "+=" + window.innerHeight * 1.8` — reduced from 2.5× to 1.8×, giving sufficient travel for 3 pillar advances without over-extending
3. `minHeight: "280vh"` on `wrapperRef` — explicit height (100vh content + 180vh pin travel = 280vh)

## Reasoning for 280vh (not 350vh or 300vh)
Three pillars each transition at ~33% scroll progress. The onUpdate thresholds are <0.38, <0.72, >0.72. At 1.8× vh, each pillar gets approximately 0.6vh of focused scroll. This is enough time to read the pillar content (6-8 seconds of deliberate scroll speed) without being exhausting.

## Verification
After fix: `data-section="building-science"` top = 6930px. `data-section="cta"` top = 9451px. Difference = 2521px. At 900px viewport height: 2521 / 900 = 2.8 viewport heights = 280vh. ✓ Exact match. No extra whitespace.
