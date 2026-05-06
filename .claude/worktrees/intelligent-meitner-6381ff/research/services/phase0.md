# Phase 0 — /services Page Audit

**Date:** 2026-04-20  
**Page:** /services (index only)  
**Component:** `components/services/ServicesContent.tsx`

---

## Section Inventory

| # | Section | Component | Notes |
|---|---------|-----------|-------|
| 1 | Hero | `ServicesHero` | Full-screen, bottom-anchored text, triple parallax |
| 2 | Keyword strip | `ServiceStrip` | Marquee, full copper background |
| 3 | Pinned decision aid | `PinnedDecisionAid` | 3-panel pin, 250vh scroll |
| 4a | ADU service row | `ServiceSection` (index 0) | Image left, black bg |
| 4b | Remediation row | `ServiceSection` (index 1) | Image right, white bg |
| 4c | Consulting row | `ServiceSection` (index 2) | Image left, black bg |
| 5 | CTA | `ServicesCTA` | Dark, char-reveal headline |

---

## Current Animation Inventory

| Section | Animation | Type | Technique |
|---------|-----------|------|-----------|
| Hero | Triple parallax bg/mid/fg | SCRUB | yPercent on 3 layers |
| Hero | SplitType char scatter EXIT on "One Standard." | SCRUB | scrollTrigger scrub:1.2 |
| Hero | LCP line fade opacity | SCRUB | scroll scrub |
| Hero | Eyebrow + sub fade in | EVENT | fromTo y+opacity, delay |
| ServiceStrip | Horizontal marquee | CSS | `marqueeScroll` keyframe |
| Decision Aid | Copper hairline scaleX | SCRUB | scrub:1.2 |
| Decision Aid | Counter count-up | SCRUB | intermediate obj, scrub:1.5 |
| Decision Aid | Panel highlight onUpdate | SCRUB | opacity+border gsap.to |
| Service Rows | Clip-path image reveal | SCRUB | `inset()` from sides, scrub:1.2 |
| Service Rows | Image parallax yPercent | SCRUB | scrub:true |
| Service Rows | Scale-through-scroll on img | SCRUB | 1.08→1.0 scrub:1.5 |
| Service Rows | Text stagger reveal | EVENT | once:true |
| Service Rows | Copper seam scaleY | EVENT | once:true |
| Service Rows | Detail grid stagger | EVENT | once:true |
| CTA | Hairline scaleX | SCRUB | scrub:1.2 |
| CTA | Char reveal scrub | SCRUB | yPercent 110→0 scrub:1.2 |
| CTA | Elements fade in | EVENT | once:true |

**Scrub count: 12 | Event count: 5 → Ratio 2.4:1 ✓** (meets ≥2:1 requirement)

---

## Bugs & Design Violations Found

### Bug 1 — CRITICAL: Hero image nearly black
- **Location**: `ServicesHero` bgRef div, line 227
- **Evidence**: `filter: "contrast(1.08) saturate(0.85) brightness(0.45)"`
- **Rule violated**: PATTERNS.md Fix 3 — brightness must be ≥ 0.8 (or 1.05 if photo is dark)
- **Impact**: The services-hero.jpg photo is being destroyed. Visitors see mostly black with minimal image detail.

### Bug 2 — CRITICAL: Counter shows "0" on load
- **Location**: `PinnedDecisionAid`, line 330-334
- **Evidence**: `gsap.to(obj, { val: 3, onUpdate: () => el.textContent = Math.round(obj.val) })` — no `immediateRender: false`
- **Rule violated**: PATTERNS.md Fix 4 — must use `immediateRender: false`
- **Impact**: Counter DOM shows "0" on page load before ScrollTrigger fires

### Design Violation 1 — Copper strip full background
- **Location**: `ServiceStrip`, line 279
- **Evidence**: `className="bg-[#B87333] overflow-hidden py-3"`
- **Rule violated**: Methodology — "Copper #B87333 sparingly (thin lines, borders, hover states — NOT backgrounds)"
- **Impact**: The entire marquee strip is solid copper — this is the single most visible copper misuse on the page

### Design Violation 2 — MagneticButton on every CTA
- **Location**: `ServiceSection` (all 3 rows, line 625) + `ServicesCTA` (line 772)
- **Rule violated**: Methodology — "❌ MagneticButton gimmicks on every CTA"
- **Impact**: 4 magnetic buttons on one page makes the effect meaningless

### Design Concern 1 — Service detail rows feel like data tables
- **Location**: `ServiceSection` detail grid (lines 653-680)
- **Issue**: The 3-column "Best For / Common Problems / What's Included" grid is informative but feels like a spec table, not editorial content. Mechanical repetition across 3 services.

### Design Concern 2 — Hero gradient stack too heavy
- **Location**: `ServicesHero` layers
- **Issue**: `brightness(0.45)` on bg image PLUS `linear-gradient(...rgba(0,0,0,0.85) 100%)` on overlay = image is nearly invisible. Even with Fix 1 applied, the overlay gradient bottom is 0.85 (exceeds Fix 3 max of 0.60).

---

## Current Scrub:Event Ratio

Current: **12 scrub : 5 event = 2.4:1** ✓ Meets requirement.

Target after redesign: Maintain ≥2:1, aiming for 3:1 on hero section.

---

## Images Available for Services Page

**Services-specific:**
- `/images/services/services-hero.jpg` — hero
- `/images/services/adu-detail.jpg`, `adu-permit.jpg`
- `/images/services/consulting-detail.jpg`, `consulting-report.jpg`
- `/images/services/remediation-before.jpg`, `remediation-detail.jpg`

**Projects (usable as service illustrations):**
- ADU: `adu-exterior-new.jpg`, `adu-construction.jpg`, `garage-conversion.jpg`, `adu-framing.jpg`
- Remediation: `remediation-after.jpg`, `remediation-active.jpg`, `waterproofing-membrane.jpg`
- Consulting: `consulting-blueprints.jpg`, `consulting-inspection.jpg`, `consulting-plans.jpg`

---

## Phase 0 Summary

**3 bugs to fix** (2 critical, 1 design violation).  
**4 CTAs** with MagneticButton — remove from service rows, keep only on primary CTA.  
**ServiceStrip** needs dark bg replacement (copper only as accent dots).  
**Service detail rows** need editorial upgrade — show content without the data-table feel.  
**Hero** needs brightness correction AND overlay reduction.

Screenshot status: Dev server not running — visual audit based on code review above.
