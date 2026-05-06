# Variation Decision — /services Page
## Date: 2026-04-20

---

## Hero Variation Selection

### Scoring Matrix (1–5 per criterion)

| Criterion | Var A | Var B | Var C |
|-----------|-------|-------|-------|
| Zero dead space | 5 | 4 | 5 |
| Scrub-ready motion | 5 | 4 | 5 |
| Editorial sophistication | 4 | 4 | 5 |
| Full-bleed photo dominance | 5 | 4 | 5 |
| Mobile graceful | 5 | 3 | 4 |
| Motion ratio matches reference | 5 | 4 | 5 |
| **Total** | **29** | **23** | **29** |

**Winner: Variation C** — The service index at the bottom gives visitors immediate orientation: they can see ADU / Remediation / Consulting before they scroll. This editorial bottom-anchor approach exactly matches NS Builders' homepage pattern of showing the work list below the hero headline. Tied with A on score, but C wins because the service index strip adds editorial depth without adding visual clutter. The chapter numbering creates the same numbered-chapter effect observed across all three reference sites.

**Hero specific changes from winner:**
- Brightness fix: 0.88 → 0.92
- Font size: clamp(3rem, 8vw, 8rem) — matches variation C
- Service index strip at bottom with 01/02/03 copper labels
- Eyebrow positioned at top (chapter structure)

---

## Services Intro Section (New)

**Decision:** Add between ServiceStrip and PinnedDecisionAid.

**Layout:** Full viewport dark section. Left half: large editorial statement in display type with SplitType scrub. Right half: large copper ghost number "20" (for 20+ years). Copper hairline grows left-to-right on scroll. Three proof items stagger in below the headline.

**Rationale:** NS Builders uses chapter sections to contextualize before offering service navigation. The jump from the marquee strip straight to "Scope it in 60 seconds" is abrupt — no establishment of WHY 828's building science approach matters. This section adds 30–40 seconds of context that qualifies the reader before they self-select a service.

**Animation:** SplitType headline chars scrub in (SCRUB), copper hairline scaleX (SCRUB), ghost number parallax yPercent (SCRUB), proof items stagger y+opacity (EVENT). Ratio: 3 SCRUB : 1 EVENT.

---

## Service Rows — No Structural Change

**Decision:** Keep existing chapter-row layout (image + text alternating). The clip-path reveals, parallax, SplitType tagline scrubs are strong. Changes are:
- Add yPercent scrub to body text (currently event-only)
- Ghost number opacity starts lower (0 → 0.08 vs current 0 → 1 which is too bright)

---

## CTA — Variation A Selected

**Rationale:** Larger headline, copper hairline, clear buttons. The current CTA is structurally identical — this is a size/confidence upgrade only. Type increases from clamp(2.2rem, 5vw, 4.5rem) to clamp(3rem, 6vw, 5.5rem). Body copy tightened. Eyebrow changed from "Still not sure which service fits?" to "Still deciding?" — shorter = more confident.

---

## Overall Scrub:Event Target

Reference ratio (from MOTION_INVENTORY): 3.25:1 SCRUB  
Implementation target: ≥3:1 SCRUB

Current implementation before changes: ~24 SCRUB, ~9 EVENT = 2.67:1 (marginal)
After adding ServicesIntro (3 SCRUB, 1 EVENT) + service row body text scrubs (6 SCRUB, removes 6 EVENT):
→ 24+3+6 = 33 SCRUB, 9+1-6 = 4 EVENT = **8.25:1 SCRUB**

This exceeds the reference ratio. Motion character matches premium construction sites.
