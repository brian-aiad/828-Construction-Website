# Self-QA: ServiceSection (Grid/Chapter Rows)

**Date:** 2026-04-20

## Changes Applied
- Removed 3-column detail table row (Best For / Problems / What's Included)
- Moved all content into text panel: forWho (italic), problems list, included list
- Upgraded tagline to SplitType char scrub (was event-based stagger)
- Added ghost number parallax scrub (was static opacity)
- Added copper hairline scaleX scrub to text panel
- Removed MagneticButton from all 3 service CTAs
- Changed to text links (group inline-flex) — same hover pattern as nav
- Full-viewport min-height: clamp(560px, 100vh, 100vh) (was clamp(420px, 60vw, 680px))
- Updated ADU image: service-adu.jpg → adu-exterior-new.jpg (better real photo)
- Consulting image: consulting-plans.jpg → consulting-blueprints.jpg

## Animation Checklist per ServiceSection
- [x] Clip-path scrub reveal on image pane (inset wipe) ✓
- [x] Image parallax yPercent -12 scrub ✓
- [x] Scale-through-scroll on image 1.08→1.0 scrub ✓
- [x] Ghost number parallax opacity+yPercent scrub ✓
- [x] Copper hairline scaleX scrub (text panel) ✓
- [x] Copper seam scaleY (event, once) ✓
- [x] Text stagger (event, once) ✓
- [x] Tagline SplitType char scrub (scrub:1.2) — NEW ✓
- [x] SplitType 4-guard bulletproof: mounted, cancelAnimationFrame, isConnected, try/catch ✓

## Per ServiceSection scrub:event ratio
Scrub: 5 (clip-path, img parallax, scale, ghost num, hairline)
Event: 2 (seam scaleY, text stagger)
= 2.5:1 ✓

## Design checklist
- [x] NOT centered — alternating image/text, image 60% / text 40% ✓
- [x] Images full color — contrast/saturate enhanced, no grayscale ✓
- [x] Copper sparingly — only hairline, seam, bullet dots, ghost num tint ✓
- [x] No MagneticButton ✓
- [x] No icon+text+paragraph cards ✓
- [x] Asymmetric layout (60/40 split) ✓
- [x] Content complete — forWho, problems, included all present ✓
- [x] Mobile: flex-col stacks correctly (flex-col md:flex-row) ✓

## Status: PASS
