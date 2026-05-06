# Variation Decision Matrix — /services Page
**Phase 2 — Design Variations**  
**Date:** 2026-04-20

---

## Scope of Variation

The hero, CTA, and PinnedDecisionAid sections are structurally sound — variations focus on:
1. **ServiceSection layout** (the 3 alternating service rows — the page's weakest section)
2. **ServiceStrip replacement** (what replaces the copper-bg marquee)
3. **Detail presentation** (how "Best For / Problems / What's Included" is shown)

Bug fixes (hero brightness, counter, MagneticButton removal) apply to ALL variations.

---

## Variation A: "Chapter" — Fullscreen Editorial Panels

### Concept
Each service becomes a full-viewport chapter. The image fills the left 60% of the screen floor-to-ceiling. The right 40% is dark text panel with a massive chapter number (opacity 0.06) behind the text.

The service tagline is large (~72px display) and scrub-revealed char-by-char as the section enters. No detail table — instead, "Who this is for" is a single italic sentence under the tagline, and "What's included" is a 4-item clean list in small type.

### Layout (desktop)
```
[————————————— 100vw —————————————]
[                    ] [            ]
[  Full-bleed image  ] [  Dark text ]
[  60% width         ] [  panel 40% ]
[  clip-path scrub   ] [  scrub     ]
[  reveal            ] [  headline  ]
[                    ] [            ]
[ min-height: 100vh per section     ]
```

### Mobile
Image top (full width, 50vh), text below.

### Animations
- Image panel clip-path scrub reveal (existing) ✓
- Service headline: SplitType chars from `yPercent: 110`, scrub:1.2 (NEW — currently event-based)
- Ghost number: opacity scrub 0 → 0.06 (minor enhancement)
- "What's included" list: stagger from y:16 opacity:0, once:true

### Pros
- Most editorial — each service feels like a distinct statement
- Full-viewport images maximize impact of real photography
- The 100vh height makes each service feel significant
- Matches NS Builders' chapter structure

### Cons
- Long page — 3 × 100vh = 3 viewports just for service sections
- Less information density per viewport
- May feel slow if user just wants to compare services quickly

### Scrub:event ratio
Scrub: 10, Event: 4 = 2.5:1 ✓

---

## Variation B: "Staggered Cards" — Magazine Spread

### Concept
Services presented as offset cards in a masonry-like arrangement. Each card contains: service name (large), tagline (medium), and a fixed-aspect-ratio image that fills the card. Cards are offset vertically — card 1 starts at 0, card 2 at 100px down, card 3 at 0 again — creating a editorial staggered grid.

On scroll, each card has a scale-enter (starts at 0.95, lands at 1.0) + clip-path reveal.

### Layout (desktop)
```
[Card 1: ADU         ][Card 2: Remediation ]
[Full image          ][                    ]
[tagline overlay     ][Image + offset       ]
                      [Card 3: Consulting  ]
                      [Image + text below  ]
```

### Mobile
Single column, full-width cards, vertical stack.

### Animations
- Scale enter 0.95 → 1.0 per card, scrub:1.2
- Clip-path on image inside card, scrub:1.5
- Text overlay fade on scroll, scrub:1

### Pros
- High visual density — all 3 services visible on one scroll
- Image-dominant — photography leads
- Modern, editorial feel

### Cons
- Offset grid requires precise positioning — hard to maintain on different screen sizes
- Detail content ("problems we solve") doesn't fit naturally in a card
- May feel more like a portfolio than a services page
- 3-column masonry doesn't work on mobile — degrades to a stack that loses the offset effect

### Scrub:event ratio
Scrub: 9, Event: 3 = 3:1 ✓

---

## Variation C: "Horizontal Text + Full Bleed" — Current Improved

### Concept
Keep the alternating image/text row structure but make it significantly more impactful:
- Remove the 3-column detail table entirely — integrate key info into the text panel
- Make service taglines larger and scrub-revealed (currently event-based)  
- Image brightness corrected, overlay reduced
- "What's included" becomes a clean 2-column micro-list in the text panel (no separate row)
- Add a horizontal copper hairline above each service section
- Ghost numbers enhanced with parallax (currently static)
- MagneticButton removed from CTAs

The key change: eliminate the detail table row that currently doubles the visual weight of each section.

### Layout (desktop)
```
[————————————— 100vw —————————————]
[                    ] [            ]
[  Full-bleed image  ] [  Text panel]
[  55% width         ] [  45% width ]
[  clip-path scrub   ] [  tagline   ]
[  scale-through     ] [  desc      ]
[                    ] [  included  ]
[                    ] [  → Link    ]
```

### Mobile
Image top (full width, ~50vw), text panel below.

### Animations
- All existing scrub animations preserved ✓
- Service headline upgraded: SplitType chars scrub:1.2 (instead of event stagger)
- Ghost number: parallax yPercent:-5 scrub added
- Detail table: REMOVED (content absorbed into text panel)

### Pros
- Least risky — builds on what already works
- More information per section (detail integrated, not removed)
- Easier to test — modifications are targeted, not structural rewrites
- Maintains all existing animations plus new scrub headline
- Mobile layout unchanged

### Cons
- Less dramatic than Variation A
- Still has the mechanical feeling of alternating rows if content per row is similar
- Doesn't force the "chapter" moment that NS Builders achieves

---

## Scoring Matrix (1-5 scale, higher = better)

| Criterion | Weight | Var A (Chapter) | Var B (Cards) | Var C (Improved Current) |
|-----------|--------|-----------------|---------------|--------------------------|
| **Editorial feel / premium** | 5 | 5 = 25 | 4 = 20 | 3 = 15 |
| **Information clarity** | 4 | 3 = 12 | 2 = 8 | 5 = 20 |
| **Mobile degradation** | 3 | 4 = 12 | 2 = 6 | 4 = 12 |
| **Animation quality (scrub ratio)** | 4 | 5 = 20 | 4 = 16 | 4 = 16 |
| **Implementation risk** | 3 | 3 = 9 | 2 = 6 | 5 = 15 |
| **Distinctiveness vs competitors** | 4 | 5 = 20 | 4 = 16 | 3 = 12 |
| **TOTAL** | | **98** | **72** | **90** |

---

## Decision: **Variation A with C's information strategy**

**Variation A wins** on editorial feel, animation quality, and distinctiveness (98 vs 90 vs 72).  
**Information risk** from Variation A is mitigated by borrowing Variation C's approach: keep all three content categories (For Who / Problems / Included) but present them inside the text panel rather than in a separate table row.

### Final layout per service section:
- Full-viewport panel (min-height: 100vh desktop, auto mobile)
- Image: 60% width left/right alternating, full height, clip-path scrub reveal
- Text: 40% width, dark panel, justified to vertical center
  - Copper hairline (scaleX scrub)
  - Large eyebrow label (service type)
  - Service tagline (SplitType chars, scrub:1.2)
  - "For" sentence (who this serves)
  - "Problems" list (3 items, thin bullet)
  - "Included" list (3-4 items, thin bullet, smaller font)
  - Text link CTA → detail page (NO MagneticButton)
- Ghost number: in image corner, parallax scrub
- Copper seam: vertical line at image/text junction

### What changes from current:
1. Remove 3-column detail table row → content moves into text panel
2. Service tagline: event stagger → SplitType chars scrub
3. Ghost number: static → add `yPercent` parallax scrub
4. Image panel min-height: clamp(380px, 55vw, 680px) → 100vh on desktop
5. Text panel: integrate forWho + problems + included

### What stays identical:
- Clip-path scrub reveal on image ✓
- Scale-through-scroll on image ✓
- Image parallax yPercent ✓
- Copper seam scaleY ✓
- Copper hairline (moving to above each section) ✓
- All SplitType bulletproof cleanup ✓
