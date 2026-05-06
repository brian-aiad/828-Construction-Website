# Competitive Analysis — About Page
Date: 2026-04-20
References: NS Builders, Olson Kundig, Feldman Architecture

---

## NS Builders (nsbuilders.com/about) — Primary Reference

### Overall Approach
NS Builders treats the About page as a cinematic experience rather than a content document. The page is not organized to be read — it is organized to be scrolled. Every section is an opportunity to reveal a new dimension of the brand, and each transition is treated as a visual event rather than a page jump.

The page has approximately 16,000px of total scroll height — roughly 16 viewport heights. This is 3–4× longer than a typical About page. The length is deliberate: the extended scroll forces a pace on the user that mirrors how you'd build trust in person — not by cramming information, but by letting it land one piece at a time with space between.

### Hero Treatment
The NS Builders hero is deceptively minimal. A white background, small logo, nav, a single-line headline in large display type, and a documentary photograph of a craftsman working. What makes it feel premium is not the design elements — it's the motion. The photograph scales very gently (scale:1.0 → 1.08) as the user scrolls the first 300px, and the headline text moves at a different vertical rate than the image. This multi-speed parallax creates the impression that the image and text live in different z-planes, giving the page immediate depth before any design element indicates complexity.

### About Nick Section
After the hero, a full-bleed portrait section slides over the hero as you scroll. This "ride-over" effect — one section appearing to physically climb over the previous one — is achieved through z-index stacking with sticky positioning. The new section's content starts at the bottom of the viewport and lifts into view, as if the page itself is being replaced rather than scrolled past. The effect is confident and editorial: it communicates that each section is worth your full attention.

### Values Section (EPICC) — Signature Feature
This is the element most worth analyzing and the one most directly transplanted into the 828 About page. NS Builders runs five company values (Creativity, Empathy, Passion, Intention, Collaboration) as a pinned section spanning approximately 500vh. A CSS sticky container locks the display at top:0. GSAP drives clip-path wipe transitions (bottom-to-top) as scroll progresses, cycling through each value panel.

What makes this section feel qualitatively different from a tabbed interface or an accordion is: **the user's physical act of scrolling controls the reveal**. You don't click to see the next value — you scroll, and the page responds. Each value feels like it's being revealed in direct proportion to how much attention you give it. This is the psychological core of scrub-based animations: they make the user feel like they are in control of the story, not the designer.

Each panel pairs the value name (in very large display type, ~6rem) with a distinct documentary photograph. The image fills 50% of the viewport on the right side. The left side has: a small index number, the copper hairline, the value title, and a 2-sentence description. A three-dot progress indicator on the far left edge signals location within the sequence without being distracting.

### Team Section
The page closes with a left-sticky navigation listing all About page sections (About Nick, Values, Team, Collaborators, Careers) while the right side scrolls independently. This pattern appears on many premium agency sites and serves a specific purpose: it tells the user exactly where they are in a long page without requiring a scroll-to-top or breadcrumbs.

### Typography
NS Builders uses a very clean, geometric sans-serif (appears to be Monument Grotesk or similar) with extreme tracking contrast: very tight for display headlines, very loose for labels/eyebrows. The size contrast is equally extreme — values like "Creativity" appear at ~100px while body text runs at ~15px. This creates a visual hierarchy that works even on a diagonal glance.

---

## Olson Kundig (olsonkundig.com/about) — Secondary Reference

### Overall Approach
Olson Kundig takes a quieter approach — the About page is more editorial-magazine than cinematic-film. The scroll experience is dignified rather than immersive: each section has breathing room, images are used sparingly, and motion is restrained but present. The page is organized as a company history narrative (founded 1959 → today) followed by studio descriptions and a philosophy statement.

### Photography as Primary Content
Unlike NS Builders where motion is the primary communication vehicle, Olson Kundig lets documentary photography carry meaning. Each section has one large image that dominates the composition. Motion supports but does not compete with the photography: images have gentle yPercent parallax (-8% to -12%) and very slight scale scrubs (1.0 → 1.04). The effect is barely perceptible on any individual image, but the cumulative effect of every image moving slightly differently creates a page that feels breathing.

### History Timeline
The "1959 → Today" section is a clever typographic moment: large year numbers on opposing corners of a split layout, with a vintage portrait. The transition between "1959" and "Today" communicates the firm's longevity without requiring paragraphs. This is good content strategy as much as good animation: use motion to make a point, not to decorate.

### Philosophy Statement
A full-width text statement over a dark background delivers the brand promise in one sentence: "We embrace the tension between collaboration and autonomy." The statement uses a clip-reveal on scroll entry. This is a fire-once animation, but it works because the statement is meant to be read in full — it would feel awkward if it scrubbed partially and you could read half of it mid-scroll.

### Applicable Lessons for 828
- Documentary photography is credibility. One strong photo per section beats four weak ones.
- Not every animation needs to be scrub — fire-once is appropriate for primary statements meant to be read completely.
- Breathing room between sections is design. Don't pack every section edge-to-edge.

---

## Feldman Architecture (feldmanarchitecture.com/about) — Tertiary Reference

### Overall Approach
Feldman Architecture is the most restrained of the three references. The page is visually minimal — off-white background, small images, generous white space. Animation is present but conservative: text entries are clip-reveals from yPercent:100, images have yPercent parallax. The aesthetic is "we let the work speak."

### Lead Statement Typography
The page opens with a very large (estimated 4rem) typographic statement that occupies the first viewport. The statement is split into three lines, each clip-revealing upward with a stagger of approximately 80ms per line. This is a fire-once animation, but the stagger makes it feel alive — the headline appears to assemble itself letter-by-line rather than popping in as a unit.

### Value Pillars Grid
A grid of numbered company principles (01–04) uses a distinctive entrance: each card has scale:0.94 → 1.0 combined with opacity:0 → 1, but the card's large number (0.3 opacity overlay) scales from scale:1.5 → 1.0 independently. The larger scale-down of the number while the card scales up creates a "stamp landing" feeling — the principle is being placed firmly on the page. This pattern was directly adopted for the 828 About values section.

### Architectural Photography
All photographs have a desaturated filter (estimated saturate(0.65–0.8)) with slight contrast boost. This is consistent with the 828 design system's `contrast(1.06) saturate(0.9)` approach. The desaturation makes photographs feel more serious and architectural, less promotional.

### Applicable Lessons for 828
- Line-by-line clip-reveal is more elegant than word-by-word for display headlines at this scale.
- Number "stamp" animation (scale:1.4 → 1.0, back.out easing) is a strong microinteraction for any numbered list.
- Desaturation unifies diverse photos into a coherent visual system.

---

## Summary: Principles Applied to 828 About Page

| Pattern | Source | Applied in 828? |
|---------|--------|-----------------|
| Hero image scale scrub (1.0→1.12) | NS Builders | ✅ |
| Hero content fade-out on scroll-out | NS Builders | ✅ |
| Pinned values section (300vh, 3 panels) | NS Builders | ✅ |
| Per-panel image with parallax | NS Builders | ✅ |
| Dot progress indicator | NS Builders | ✅ |
| Scrub clip-path image reveals | NS Builders + Olson Kundig | ✅ |
| Image scale through viewport | All three | ✅ |
| Number "stamp" scale (1.4→1.0, back.out) | Feldman | ✅ |
| Clip-reveal line-by-line headlines | All three | ✅ |
| Documentary photo desaturation filter | All three | ✅ (existing) |
| NumberCounter on stats | — | ✅ |
| Left-sticky section nav | NS Builders | ❌ (future enhancement) |
| Ride-over section overlap | NS Builders | ❌ (future enhancement — complex to implement with sticky header) |
| Character-level SplitType headline | NS Builders | ❌ (installed split-type, reserved for future iteration) |
