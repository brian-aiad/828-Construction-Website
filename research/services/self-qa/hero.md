# Self-QA: ServicesHero

**Date:** 2026-04-20

## Checklist

- [x] Image NOT centered — bottom-anchored text ✓
- [x] Image shows full color — brightness 0.88 (Fix 3 compliant) ✓
- [x] Overlay max from-black/60 — bottom is rgba(0,0,0,0.60) ✓ (was 0.85 — FIXED)
- [x] No proof strip / stats row ✓
- [x] No MagneticButton on hero CTAs (hero has no CTAs) ✓
- [x] Copper NOT used as background ✓
- [x] SplitType: 4-guard bulletproof cleanup (mounted, cancelAnimationFrame, isConnected, try/catch) ✓
- [x] LCP line "Three Services." has no SplitType (CSS keyframe entry only) ✓
- [x] Triple parallax: bg -15%, mid -8%, text +5% ✓
- [x] Scrub animations: 3 parallax + 1 LCP fade + 1 char scatter = 5 scrub
- [x] Event animations: 1 eyebrow/sub fade = 1 event
- [x] Section scrub:event = 5:1 ✓ (well above 2:1)

## Changes from original
- brightness: 0.45 → **0.88** (critical fix)
- Bottom overlay opacity: 0.85 → **0.60** (critical fix)
- Font floor: 3.5rem → **3rem** (more mobile breathing room)
- textShadow opacity: 0.5 → **0.4** (lighter, less muddy)

## Status: PASS
