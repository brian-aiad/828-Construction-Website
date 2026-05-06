# 828 Construction — V2.5 Elevation Plan

V2 established Lighthouse 99-100 across all 9 routes but reads flat.
V2.5 adds cinematic depth without touching performance targets.

## What V2.5 adds
- SVG grain overlay component (replaces CSS div)
- Right-edge scroll progress bar (second dimension alongside top bar)
- Maroon cursor trail (was copper — matches `--color-accent`)
- useMagnetic hook (GSAP quickTo on CTAs and service tiles)
- GlassCard primitive (backdrop-blur + maroon hairline + inset glow)
- 6 architectural SVG silhouettes (hardhat, level, blueprint corner, arch outline, construction lines, compass)
- useSectionScrub hook (pin-and-scrub abstraction)
- Splash mask-cut char reveal (yPercent clip, no opacity fade)
- Hero floating silhouette layer + copy-block parallax
- About: CRAFT glass cards + compass in story + two-layer marquee
- Service pages: silhouette parallax + horizontal pin-scrub process steps + glass FAQ/acronym
- Services landing: magnetic tiles + construction-line backdrop
- Portfolio: glass project blocks + compass CTA silhouette
- Footer: two-layer marquee + magnetic 828 anchor + license badge glow
- Subtle route-change fade (250ms)

## Phase plan

| Phase | Scope | Key deliverables |
|-------|-------|-----------------|
| 1 | System infrastructure | GrainOverlay, RightScrollProgress, GlassCard, useMagnetic, useSectionScrub, 6 silhouettes, docs |
| 2 | Hero + Splash | Mask-cut reveal, floating silhouette, copy parallax, magnetic CTA |
| 3 | About elevation | CRAFT glass cards + watermark drift, principles backdrop, two-layer marquee, compass silhouette |
| 4 | Service pages | Per-page silhouette parallax, horizontal pin-scrub process, glass FAQ/acronym, magnetic CTAs |
| 5 | Services landing + Portfolio + Footer | Magnetic tiles, two-layer footer marquee, magnetic 828, license glow |
| 6 | Final polish | Reduced-motion audit, motion density check, route-change fade |

## Standing rules
- `prefers-reduced-motion` guard on ALL GSAP (or via `AnimationController.shouldAnimate()`)
- `(pointer: coarse)` guard on magnetic + pin-scrub hooks — no animations on touch
- `gsap.context()` + revert in cleanup on every component
- Initial GSAP states always in `gsap.set()` inside useEffect, never in JSX (Fix 14)
- `npm run typecheck && npm run build` must pass at every checkpoint
- Lighthouse Perf ≥ 85, A11y ≥ 95 must hold after every phase
- `git push origin main` after every phase (preflight hook runs on push)
