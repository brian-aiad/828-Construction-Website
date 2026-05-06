STATUS: PASS

# Self-QA — ProjectsPreview (Redesign)
## Desktop and mobile verified

### Does this feel custom-built or templated?
Custom-built. The asymmetric 8/4-column split is not a default any template produces — it requires deliberate grid-column span control. The punch-in clip-path entrance (inset 8%→0%) reads as Olson Kundig, not generic fade-in. The wide full-bleed bottom card creates a visual rhythm that's intentional and distinct. The copper hairline between the header and grid, and the inter-row copper rule between card rows, tie it to the site's visual language. Nothing about this reads like a generic portfolio grid.

### Is there continuous motion when entering and leaving this section?
Yes. On entry: the copper hairline draws in (scaleX 0→1), then all four cards punch in simultaneously with staggered clip-path (120ms between each). On scroll through: each card's inner image moves at yPercent -12 in a scrub parallax, creating subtle depth even while not actively entering. On exit: parallax continues. No dead zones.

### Do the proportions feel editorial or cramped/generic?
Editorial. The featured card at 42vw (max 570px) height dominates the composition. The two secondary cards at 20.5vw height each (together matching the featured height) create an exact geometric relationship — no orphaned whitespace. The wide bottom card at 22vw provides a cinematic panoramic close. The overall section reads like a magazine spread, not a photo gallery.

### Would this pass as part of a $40k custom build?
Yes. The section has three distinct card sizes with intentional hierarchy. The punch-in entrance is a premium motion pattern (Olson Kundig's). The hover states (saturation bump + copper bar) are refined and fast. The typography — tracked caps category label, bold display title, faint location — follows editorial conventions. Mobile collapse to full-width single column with adequate height feels considered, not lazy.
