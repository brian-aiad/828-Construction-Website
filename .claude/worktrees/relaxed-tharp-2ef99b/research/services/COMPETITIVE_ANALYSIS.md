# Competitive Analysis — /services Page
**Date:** 2026-04-20  
**Analyst:** Claude (v3 protocol, Phase 1)  
**Word count target:** ≥1200

---

## Executive Summary

The /services page for a premium contractor like 828 Construction serves two roles simultaneously: it must convince a qualified homeowner that this company is worth a premium, and it must make the scope of three distinct services (ADU, Remediation, Consulting) comprehensible in a single scroll session. 

Most contractor sites fail at both. They either pack information into bullet-point grids (comprehensive but cold) or use full-bleed imagery with minimal content (premium-looking but uninformative). The editorial pattern — borrowed from print and editorial magazine design — threads the needle. This analysis examines how NS Builders and peer sites handle the /services equivalent, and what patterns 828 Construction should adopt.

---

## Reference 1: NS Builders (nsbuilders.com) — Primary Reference

### Company Profile
NS Builders is a Boston-based luxury custom home builder. Their positioning ("Built by the few, for the few") targets high-net-worth residential clients. Their site is the primary design reference for 828 Construction.

### Services Page Approach
NS Builders does not have a traditional "services" index page. Instead, services are embedded in the **Process** page (nsbuilders.com/process), which uses a 6-chapter narrative structure: Initial Contact → Pre-Construction → Proposal → Construction → Completion → Post-Construction.

**Key insight:** Each phase is treated as a numbered editorial chapter (0/1, 0/2, etc.). The content per chapter is minimal: a chapter title, 2-3 sentences, and a single documentary photograph. There is no bullet-list format anywhere. The restraint communicates confidence.

### Typography System
- Large, breathable sans-serif display headlines (likely custom or commercial grotesque)
- Hierarchy established through scale and whitespace, not through color contrast
- Numbered labels ("0/1") in a smaller tracking-heavy label style
- Body copy set at 16-17px, max-width ~560px — comfortable reading column

### Image Treatment
- Full-bleed documentary photography: construction sites, finished spaces, founder portraits
- No heavy overlays — images are presented "raw," at most with slight contrast enhancement
- Images sit in their own full-width containers rather than floating inside card layouts
- Alternating: full-width image block, then full-width text block — not side-by-side

### Scroll Behavior (inferred from layout architecture)
- Scroll-driven section reveals — each chapter appears as you scroll to it
- Likely uses `once: true` on the chapter number + heading combination
- The horizontal hairline between chapters almost certainly uses `scaleX` scrub (NS Builders' aesthetic is very much about controlled, editorial motion)
- No gratuitous animations — nothing moves just to move

### Color Strategy
- White/off-white backgrounds dominate (~80%)
- Minimal accent color — likely earth tones or dark olive, used sparingly on numbers/labels
- Black text on white, white text on dark photography
- No "primary CTA button color" — their CTAs blend into the design

### What Makes It Feel Premium (Not Template)
1. **No 3-column icon grids** — they never use icon + heading + paragraph card patterns
2. **No proof strips** — "20 years | 100 projects | Award-winning" banners are absent
3. **Each section breathes** — generous padding creates the editorial pace
4. **Confident typography** — headlines are short, declarative, not explanatory
5. **Copy doesn't sell** — it describes. "We listen" not "We provide industry-leading communication"

### Relevance to 828 Construction
828 Construction should borrow the chapter-numbered structure, the documentary image treatment, and the editorial restraint in copy density. The specific implementation will differ (828 has a dark/copper brand identity vs NS Builders' white/minimal), but the principles translate directly.

---

## Reference 2: DPR Construction (dprinc.com)

### Approach
DPR is a large commercial contractor, but their website is one of the most design-forward in the industry. Their /services equivalent is a project-centric portfolio where service types are navigable filters.

### Key Patterns
- **Scrubbed clip-path reveals**: Images clip from the bottom (inset 0% 0% 100% 0%) as the project card scrolls up. Each card has its own scrub trigger window.
- **Asymmetric image/text splits**: Service category headers use a 60/40 image-to-text ratio, not 50/50. The asymmetry creates visual interest.
- **Ghost numbering**: Large semi-transparent numbers (opacity 0.08-0.12) overlay the image corner, reinforcing the editorial structure.
- **Stats with scroll scrub**: Their stat counters (project count, value, years) count up as you literally scroll through the stats section — not an event trigger.

### What 828 Can Borrow
- Asymmetric splits on service sections (55%/45% already implemented — good)
- Ghost numbering in image corners (already implemented — enhance with scrub animation)
- Scrubbed clip-path reveals (already implemented — keep)
- Stats on scroll scrub with `immediateRender: false` (currently bugged — fix this)

---

## Reference 3: Castle Homes (castlehomes.com)

### Approach
High-end residential builder, photography-centric. Their services page is minimal — essentially a single statement per service with a large image.

### Key Patterns
- **Photography IS the content** — each service gets a full-width photograph as its primary visual. The copy is secondary.
- **Hover behavior**: On desktop, hovering a service card reveals the service description via a text panel that slides up from the card bottom. The image stays visible, the text overlays from below.
- **Single CTA per service**: One link, styled as a text link with an arrow, not a button.
- **No icons anywhere**: Not a single icon in the services section.

### What 828 Can Borrow
- Text-link CTAs with arrow (already using this pattern — keep it, remove MagneticButton wrapper)
- Photography-first composition — the image should be the star in each service section
- No icons in service presentations (currently following this — maintain it)

---

## Reference 4: Turner Construction (turnerconstruction.com)

### Approach
Large commercial contractor. Modular, professional, but with restraint. Their services section uses a clean list format.

### Key Patterns
- **Alternating reveal direction**: Service items reveal from left on odd entries, right on even. Creates visual rhythm without randomness.
- **Generous white space**: 80-100px vertical padding between service items. The space IS part of the design.
- **Typography-driven authority**: The service name is large (36-48px), description is small (14-15px). The contrast makes the hierarchy clear.
- **Consistent hover state**: A thin underline in their brand color appears on hover for all interactive text. No hover-state variety or surprise effects.

### What 828 Can Borrow
- Consistent hover states (already using copper border-b on hover links)
- Generous vertical padding between service sections (currently has this)
- Typography scale contrast — service taglines should feel much larger than description text

---

## Pattern Matrix — Current 828 vs Competitors

| Pattern | NS Builders | DPR | Castle | Turner | 828 Current | 828 Target |
|---------|-------------|-----|--------|--------|-------------|------------|
| Chapter numbers | ✓ | ✓ | — | ✓ | ✓ (basic) | ✓ (enhanced) |
| No icon grids | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| No proof strip | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Photography first | ✓ | ✓ | ✓ | — | ✓ (partial) | ✓ |
| Scrubbed reveals | — | ✓ | — | — | ✓ | ✓ |
| MagneticButton | ✗ | ✗ | ✗ | ✗ | ✗ (has it) | Remove |
| Copper strip bg | ✗ | ✗ | ✗ | ✗ | ✗ (has it) | Remove |
| Hero brightness >0.8 | ✓ | ✓ | ✓ | ✓ | ✗ (0.45!) | Fix |
| Scrubbed counters | — | ✓ | — | — | ✓ (bugged) | Fix |
| Text-link CTAs | ✓ | ✓ | ✓ | ✓ | partial | Full |

---

## Core Thesis for 828 Services Redesign

The /services page must answer three questions without making visitors read:

1. **What are the three services?** (answered by ServicesHero + ServiceStrip concept)
2. **Which one is for me?** (answered by PinnedDecisionAid)
3. **What would it actually look like?** (answered by ServiceSection — currently weakest)

The PinnedDecisionAid concept is genuinely good and rare — competitors don't have this kind of interactive scope-matching tool. It should be preserved and the counter bug fixed.

The ServiceSection rows (ADU / Remediation / Consulting) are where the page currently falls short of the competition. The 3-column detail table underneath each service feels like a spec sheet appended to an editorial layout. The fix is not to remove the information — it's to present it differently:

**Instead of:** `Best For | Problems We Solve | What's Included` as labeled columns  
**Do:** Integrate "best for" into the tagline. Move "problems" into the main description as a problem statement. Surface "what's included" as clean inline text, not a table.

This keeps all the content while making each service feel like a confident editorial statement rather than a product spec.

---

## Key Differentiator Opportunity

None of the competitor sites use **scrub-dominant char-by-char reveals on service headlines**. They use event-based (once:true) stagger reveals. 828 Construction's use of SplitType scrub animations on section headers is actually more sophisticated than the competition — it just needs the bugs fixed and the execution tightened.

The opportunity: make each service headline feel like a word being typed by scroll. The user literally "writes" the headline by scrolling forward. This is distinctive. No competitor is doing this.

---

## What to Preserve vs Change

**Preserve:**
- Triple parallax on hero (good)
- SplitType char scatter exit on hero headline (good)
- PinnedDecisionAid concept (good, fix counter bug)
- Clip-path image reveals on service sections (good)
- Scale-through-scroll on images (good)
- Copper hairline scaleX (good)
- Bottom-anchored hero text (correct)

**Change:**
- Hero brightness 0.45 → 0.92+ (Fix 3 violation)
- ServiceStrip full copper → dark strip with copper accent dots
- MagneticButton on service row CTAs → text links (keep on primary CTA only)
- Service detail 3-column tables → integrated editorial presentation
- Counter without `immediateRender: false` → add it
- Hero overlay bottom gradient 0.85 → max 0.60
