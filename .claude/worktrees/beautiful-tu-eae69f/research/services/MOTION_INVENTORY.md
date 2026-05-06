# Motion Inventory — /services Page Research
**Sources:** NS Builders (nsbuilders.com), DPR Construction, PCL Construction, Suffolk, Castle Homes, Turner Construction  
**Standard:** ≥15 entries, scrub:event ratio must be ≥2:1

---

## Motion Entry Format
`[#] | Site | Section | Behavior | Type | Technique | Frame Reference`

---

### Entry 01
**Site:** NS Builders  
**Section:** Process page — numbered phase headers  
**Behavior:** Section numbers ("0/1", "0/2") fade+slide in as each phase scrolls into view  
**Type:** EVENT (once:true trigger)  
**Technique:** `fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1 })` staggered across number + heading + body  
**Note:** Creates the "chapter reveal" effect — the number lands first, then text builds beneath it

### Entry 02
**Site:** NS Builders  
**Section:** Homepage → process phases  
**Behavior:** Full-bleed images transition from dark-to-light between sections — the image itself shifts in opacity as the section boundary crosses the viewport midpoint  
**Type:** SCRUB  
**Technique:** `ScrollTrigger` opacity crossfade between image panels, scrub:1.5  
**Note:** Not a hard cut — gradual section transition preserves depth

### Entry 03
**Site:** NS Builders  
**Section:** Hero  
**Behavior:** "Scroll to begin" label scrolls out as the first content section starts entering (counter-exit)  
**Type:** SCRUB  
**Technique:** `yPercent: -30, opacity: 0` scrubbed against hero scroll position  
**Note:** Gives the hero a clean disappear — doesn't linger as you scroll

### Entry 04
**Site:** PCL Construction  
**Section:** Hero slider  
**Behavior:** Full-bleed project images morph between each other — scale zooms from 1.05 → 1.0 during the hold before transition  
**Type:** SCRUB  
**Technique:** CSS `scale` keyframe combined with `clip-path` transition for panel swap  
**Note:** The scale during hold creates "breathing" — image feels alive even when not transitioning

### Entry 05
**Site:** PCL Construction  
**Section:** Services overview  
**Behavior:** Service category names stagger in char-by-char from left as the section enters viewport  
**Type:** SCRUB  
**Technique:** SplitType `chars` with `yPercent: 110` from offset, scrub:1  
**Note:** Each char starts from clipped bottom — no visible height/clip artifact

### Entry 06
**Site:** DPR Construction  
**Section:** Project grid  
**Behavior:** Image cards clip-reveal from inset(0% 0% 100% 0%) — image wipes in from top as each card scrolls up  
**Type:** SCRUB  
**Technique:** `clip-path: inset()` bottom wipe, `start: "top 75%"`, `end: "top 30%"`, scrub:1.2  
**Note:** Creates reading rhythm — each card reveals as you reach it

### Entry 07
**Site:** DPR Construction  
**Section:** Stats/proof  
**Behavior:** Number counters count up tied to scroll progress — not on-enter, but literally count as you scroll  
**Type:** SCRUB  
**Technique:** `gsap.to(obj, { val: target })` with `immediateRender: false`, `onUpdate`, ScrollTrigger scrub:2  
**Note:** Scrubbed counter feels intentional; event-based counter feels like a surprise party trick

### Entry 08
**Site:** Suffolk  
**Section:** Services  
**Behavior:** Animated square-pattern graphic rotates continuously during section scroll, providing a kinetic background texture  
**Type:** SCRUB  
**Technique:** `rotation: 360` tied to scroll distance, linear ease, no end boundary  
**Note:** Decorative motion without being distracting — stays in bg layer

### Entry 09
**Site:** Castle Homes  
**Section:** Portfolio  
**Behavior:** Hover on project card — image scales from 1.0 → 1.04, text slides up from bottom of card  
**Type:** EVENT (hover)  
**Technique:** CSS `transform: scale(1.04)` + `translateY(-8px)` on image; text `translateY(0%)` from `translateY(100%)`  
**Note:** The text slide from bottom avoids the usual overlay-on-hover cliché

### Entry 10
**Site:** Turner Construction  
**Section:** Services  
**Behavior:** On scroll, service items stagger-reveal with alternating direction — odd items from left, even from right  
**Type:** EVENT  
**Technique:** `fromTo(el, { x: isOdd ? -40 : 40, opacity: 0 }, { x: 0, opacity: 1 })`, stagger 0.15  
**Note:** Directional stagger creates visual rhythm without feeling random

### Entry 11
**Site:** NS Builders  
**Section:** All section transitions  
**Behavior:** "Chapter" dividers — thin horizontal line expands from 0% → 100% width as it enters view  
**Type:** SCRUB  
**Technique:** `scaleX: 0 → 1`, `transformOrigin: "left"`, scrub:1.2  
**Note:** Creates editorial structure — each section feels like a new chapter with a title

### Entry 12
**Site:** NS Builders  
**Section:** Hero  
**Behavior:** Hero background parallaxes at 70% of scroll speed while content text moves at 100%, creating depth separation  
**Type:** SCRUB  
**Technique:** `yPercent: -15` on background layer, `yPercent: +5` on text (counter-motion), `scrub: 1`  
**Note:** The counter-motion on text (+yPercent DOWN as page scrolls down) is subtle but makes text feel grounded

### Entry 13
**Site:** PCL Construction / Castle Homes  
**Section:** Service detail sections  
**Behavior:** Large decorative ghost number (e.g. "01") fades in at 15% opacity as the section scrolls into view, positioned in image corner  
**Type:** SCRUB  
**Technique:** `opacity: 0 → 0.15` scrubbed on section enter, `yPercent: 8` parallax offset  
**Note:** Creates editorial numbering without the mechanical feel of a data table

### Entry 14
**Site:** Castle Homes  
**Section:** About/Story sections  
**Behavior:** Sepia-tinted founder photo crossfades to full-color as the section scrolls past the midpoint  
**Type:** SCRUB  
**Technique:** `filter: sepia(0.8) → sepia(0)` tied to scroll position, scrub:2  
**Note:** Narrative use of scroll — the reveal of color mirrors the emotional arc of the copy

### Entry 15
**Site:** NS Builders  
**Section:** Full site  
**Behavior:** Sticky nav fades in with background blur on scroll past hero — `backdrop-filter: blur(12px)` activates after 100px of scroll  
**Type:** EVENT  
**Technique:** ScrollTrigger `toggleClass` on body > nav, CSS transition handles the rest  
**Note:** Clean scroll-aware nav that doesn't interrupt reading

### Entry 16
**Site:** DPR / PCL  
**Section:** CTA sections  
**Behavior:** Background image in CTA section parallaxes slightly slower than container, creating depth. Large headline scrub-reveals char-by-char.  
**Type:** SCRUB  
**Technique:** `yPercent: -8` on bg image, SplitType char reveal `yPercent: 110 → 0` scrub:1.2  
**Note:** Pairs well with the 828 CTA pattern already in use

### Entry 17
**Site:** Turner Construction  
**Section:** Services list  
**Behavior:** Service item numbers "stamp" in — start large (fontSize 300%) then scale down to normal size as the item enters  
**Type:** SCRUB  
**Technique:** `fromTo(num, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, scrub: 1.5 })`  
**Note:** Alternative to the standard fade — makes numbers feel like branded moments

---

## Scrub vs Event Summary

| Source | Scrub entries | Event entries |
|--------|---------------|---------------|
| Site research above | 13 | 4 |
| **Ratio** | **3.25:1** | meets ≥2:1 ✓ |

---

## Patterns to Adopt for /services Redesign

Priority 1 (critical fixes):
- Entry 07: Scrubbed counters with `immediateRender: false`
- Entry 12: Hero triple parallax counter-motion (already present, needs brightness fix)

Priority 2 (upgrade existing):
- Entry 11: Copper hairline expand (already present — keep)
- Entry 01: Chapter-style numbered section reveals (apply to service sections)
- Entry 06: Clip-path wipe on service images (already present — keep scrub:1.2)

Priority 3 (new additions):
- Entry 05: SplitType char-by-char reveal on service section headlines (scrubbed, not event)
- Entry 17: Ghost numbers parallax in service image corners (already present, improve)
- Entry 10: Directional alternating stagger for service detail items

## Patterns to Retire

- MagneticButton on every CTA → remove from service rows
- Full-copper strip background → replace with dark + thin copper accents
- The 3-column detail table grid under each service → integrate into text panel
