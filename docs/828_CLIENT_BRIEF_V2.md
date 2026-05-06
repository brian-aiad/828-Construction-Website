# 828 CONSTRUCTION — CLIENT BRIEF V2 (JOSEPH'S ITERATION)
**Source:** Recorded call with Joseph + his typed page-by-page notes + 4 YouTube design references
**Date compiled:** May 5, 2026
**Author:** Brian Aiad

> This is the second pass after the demo site. Joseph went page-by-page, both verbally on a recorded call and in his own typed notes. Below is the consolidated brief — global decisions first, then page-by-page with his exact phrasing pulled out.

---

## CRITICAL DECISIONS NEEDED BEFORE BUILD

These are open questions Brian needs to lock down before pasting any of this into Claude Code. Don't guess — verify.

### 1. Accent color: maroon/dark red vs copper
- **Joe's actual words:** "I will have little touches of red... like a maroon, like a darker red... almost like that iPhone that's supposed to come out, just dark, dark red."
- **He also said:** "I'm not necessarily offended by [copper]. If it stays, it's not that big of a deal."
- **Decision:** Build with maroon `#7B2D26` as primary accent. Keep copper `#B87333` as secondary fallback variable.

### 2. Founding year: 2004 vs 2025
- **Memory says:** Founded 2004 (locked, verified during sales call).
- **Joe's typed notes say:** "Found it in 2025 828 construction represents..."
- **Verbal call says:** "EST. 2004... 20+ years."
- **Decision:** 2004 is truth. The "2025" in typed notes is a typo. Proceed with 2004. Confirm with Joe before publishing.

### 3. Email domain
- **Site is on:** 828constructions.com
- **Joe's notes show:** `inquire@828.com`, `explore@828.com`, `submit@828.com`
- **Decision:** Confirm with Joe. Default to `inquire@828constructions.com`. Contact form ON HOLD pending email/DNS/Resend.

### 4. Splash / intro page treatment
- **Joe wants:** "828 Construction" on ONE LINE in bold, with a black VERTICAL gradient background (top-to-bottom, dark → slightly lighter toward bottom).
- **Sizing:** "A little bit bigger, not too big" than current.

### 5. "Depth" / "shadows" he keeps mentioning
- He wants the site to NOT look flat. Repeated "shadows" and "overlaid" elements.
- NOT photo drop-shadows — it's UI/section depth: glass-morphism, subtle texture, noise, layered cards with offset shadows, gradient washes between sections.
- Reference: Self-Made Web Designer "6 Tips" video — Tip #4.

---

## GLOBAL DESIGN SHIFTS (apply site-wide)

### Color palette change
- **Was:** Black / White / Copper (`#B87333`)
- **Becomes:** Black / White / Computer-gray (darker side) / Maroon-red accent (`#7B2D26`)
- **Ratio rule:** "80% black/white" — keep red touches under 10%
- **Where maroon goes:** Thin section lines, link hovers, license-badge border, button outlines, scroll progress bar, form focus ring, active nav state, accent numbers (CRAFT acronym, process steps).

### Typography hierarchy
- **Bold anchor font:** Reserved exclusively for "828" wordmark and main hero anchor headlines.
- **Everything else:** Slimmer/lighter weight.
- Joe: "I only want the business logo, I guess we can say, in that bold font. Everything else is gonna be kind of in a more slimmed down font."
- Space Mono (numbers) and IBM Plex Mono (labels) remain locked.

### Header behavior (KEEP — Joe likes this)
- Transparent at top → solid black on scroll. Joe explicitly approved.
- Timestamp/location moves to RIGHT corner. "828 Construction" wordmark stays on left.

### Header — "828 Construction" wordmark
- ONE LINE. No stacking.
- Bold, slightly bigger than current.

### Motion / interactivity
- Joe: "more interactive, not just so much just pictures and words on the page."
- Scroll-triggered motion (GSAP ScrollTrigger) — he sent the video specifically.
- Apple-inspired: sell the feeling first, not push to product.
- Rolling marquee (he loves NS Builders') — footer, About page area names, maybe project tags.
- Scroll-scrub reveals on long sections.
- Subtle glass / blur layers for depth.

### Asymmetry
- Joe explicitly does not want symmetric grids.
- Different photo sizes within grids (NS Builders portfolio style).
- Split-page sections (line down the middle dividing copy from image).

---

## PAGE-BY-PAGE BREAKDOWN

---

### SPLASH / INTRO

**Layout:**
- Full viewport
- Black VERTICAL gradient (top-to-bottom: #000000 → #0A0A0A 60% → #1A1A1A 100%)
- "828 Construction" centered, ONE LINE, bold white, slightly bigger than current
- Letter-by-letter animation (keep existing behavior)

**Copy:** Just `828 Construction` — nothing else.

---

### HOME PAGE

**Final section list:**
1. Hero
2. Services Preview *(moved up)*
3. About Preview
4. Footer (with rolling marquee + schedule CTA)

**Sections to DELETE from current home page:**
- ❌ Differentiator section
- ❌ "Selected Work" section
- ❌ "Let's talk about your project" section *(merged into footer)*
- ❌ Building Science 4-pillars section
- ❌ Number-counter "stats" section *(Joe called these "gimmicky")*

#### Hero — Joe's specific direction
- Photo takes one side; text/space takes the other (asymmetric split).
- Joe: "I like something that has a little bit more space right here, you know, for language."
- Photo content: ADU at-night (Joe sending via text). Fallback: ADU exterior, dusk/night.
- Top bar (left): "828" wordmark
- Top bar (right): Location + timestamp (MOVED from left to right — this is a change)
- Header CTA: Single **"BOOK CALL"** → asterisk dropdown reveals phone number.
- Joe: "instead of like get estimate, you could be like book call and then have an asterisk that just rolls down with the telephone number."
- Hero copy (working draft): `Improving the unimproved` — placeholder until Joe sends final.
- Display font: Bold for hero anchor. Subhead/tagline: slim weight.
- No grayscale on photo.

#### Services Preview (Section 2)
- 3 cards: ADU / Remediation / Consulting
- Each card has a photo (Joe specifically called this out as a positive)
- Asymmetric layout: at least one card different size
- Card hover: scale + maroon accent
- Tap card → navigate to service sub-page

#### About Preview (Section 3)
- Compressed, ~1 viewport height
- CTA → "Read more" → /about

#### Footer (Section 4 — NEW STRUCTURE)
Joe loves NS Builders footer:
- Rolling marquee across the top
- Broken-up sections with different colors
- Email + phone as their own visual modules
- Schedule CTA flows directly into footer
- Joe: "Get creative with this. Don't mimic it exactly."

---

### ABOUT PAGE

#### Section 1 — Hero
Two options:
- **Option A:** Solid black background with "828 Construction" in white across the middle. No image.
- **Option B:** Fireplace photo in background (vibe Joe likes), copy overlay.

#### Section 2 — The Story (KEEP)

**Short version (RECOMMENDED):**
> "Founded in 2004, 828 Construction is guided by a founder with over two decades of hands-on experience in residential construction. This depth of knowledge — built from working directly alongside skilled tradesmen — shapes a precise understanding of how homes are built and how they perform.
>
> That perspective informs every decision, from structural integrity to refined architectural details. The result is a disciplined approach to construction where craftsmanship, performance, and design are held to the highest standard.
>
> 828 Construction exists to build clarity, intention, and enduring quality."

**Long version (available):**
> "Founded in 2004, 828 Construction represents a modern approach to luxury building grounded in over two decades of hands-on industry expertise. The founder brings a deep understanding of how homes are constructed, how they perform over time, and what truly defines lasting quality.
>
> Perspective was not developed from a distance, but through years of direct involvement in the field, working alongside skilled tradesmen, learning the nuances of craftsmanship and understanding the practical realities behind exceptional construction.
>
> This experience continues to shape every decision made at 828 Construction today — from structural integrity to refined finishing details. The focus remains on building homes that are not only visually exceptional but thoughtfully engineered to perform for decades.
>
> Each project at 828 Construction is driven by informed judgment, collaborative execution, and a commitment to elevating the standard of residential construction."

#### Section 3 — Three Principles (replaces 4-pillar Building Science block)
3 principles, vertical list, accent numbers:
- **P1 — Craft over count**
- **P2 — Built with purpose**
- **P3 — Quality is the strategy**

Section heading: **"Every detail shaped by precision."**
Photo: Laser levels in use.

#### Section 4 — CRAFT Acronym (NEW)
The word CRAFT dropped in background as large bold watermark. Acronym words layered over it:
- **C — Curiosity:** "Drives how 828 builds — digging deeper into details, uncovering smarter solutions to complex construction challenges."
- **R — Relatability:** "Guides our work by understanding each client's perspective so we can serve with clarity."
- **A — Alignment:** "Where intent, design, and execution come together seamlessly — like the relationship between builder and client."
- **F — Forged:** "Through experience and precision, 828 translates our clients' vision into remarkable spaces defined with design integrity and strategy."
- **T — Tailored:** "To each client's vision — 828's approach ensures every detail is shaped through close collaboration between builder and owner for a truly bespoke result."

#### Section 5 — Service Area / "South Bay Native"
- Header: **"South Bay Native"**
- Rolling marquee: Torrance · Redondo · Manhattan Beach · El Segundo · Carson · Hermosa · etc.
- Add neighborhood photos (small thumbnails or as backdrop)

#### Section 6 — CTA
- Small label: "Prepared to create"
- Big headline: "Designed for clients who value seasoned experience"
- Contact button → /contact

#### Delete from current About page
- ❌ Timeline (Joe: "Toss that")
- ❌ Verbose "How we think" section (Joe: "Way too much words... toss that out")
- ❌ "Proof of work" example photos (replaced by real portfolio photos when available)

---

### SERVICES (MAIN LANDING)

Joe: "As far as this page itself, I didn't spend any time on it really... have some creative fun with the service page, dude. Get a little creative."

Constraints:
- Drop-down menu in nav: vertical (straight down), not horizontal
- Three services only (ADU, Remediation, Consulting)
- Pictures-on-cards approach
- Match design language of rest of site
- No AI work photos

---

### ADU SERVICE PAGE

#### Section 1 — Visual Hero
- ADU photo at top
- Small text: "ADU — accessory dwelling unit"
- Bold overlay headline: "Built with intent"

#### Section 2 — Identifying the Need
**Copy (Joe's words):**
> "Whether looking to refine a private retreat, ideal for hosting guests, accommodating family, or simply expanding the living space while elevating the property's overall value."

**FAQ block:** Keep existing Q&A structure but use "FAQ + plus icon" expand pattern.

#### Section 3 — The Process
- Small label: "The approach"
- Big headline: "Build philosophy"
- 5 steps:
  - **01** Initial contact / Pre-construction
  - **02** Site visit / Design
  - **03** Permit & approval
  - **04** Construction / Full build / Project completion
  - **05** Post-construction

#### Section 4 — Why 828 (ADU acronym)
- **A — Aligned:** "Aligned with the client's vision, ensuring every detail reflects their lifestyle and goals."
- **D — Dedicated:** "Unwavering commitment to exceptional quality, precision, and craftsmanship at every stage."
- **U — Understanding:** "Renovation is both a structural transformation and a personal journey — guiding clients through with clarity, care, and steady expertise to make the process feel seamless and supportive."

**Sub-section: "An invitation to work together"**
- 01 — Seeking a collaboration with a bespoke builder
- 02 — Is uncompromising quality non-negotiable for your project
- 03 — Prepared to invest the time and resources required to realize your vision
- 04 — Do you value clear communication and a highly considered building experience

Closing line: "If this resonates with your expectations, welcome the opportunity to explore your project."

#### Section 5 — Start Here
- Updated headline: **"Prepared to proceed with your vision?"**
- Body copy: "Whether your vision is fully defined or still evolving, start by completing the form and 828 Construction will personally contact you to review the project and explore it further."
- "What happens after" steps:
  - 01 — Company will review and reach out
  - 02 — You'll receive a response
  - 03 — Scheduled call understanding the project
  - 04 — If aligned, we'll arrange site visit / initial brief

---

### REMEDIATION SERVICE PAGE

#### Section 1 — Visual Hero
- Photo of remediation work
- Small text: "Service — Remediation"
- Bold overlay headline: "Complex conditions, refined expertise"

#### Section 2 — Identifying the Need
**Copy:**
> "Mold remediation is necessary when moisture intrusion happens to a structure — whether from a leaky roof, cracked pipes, or old windows. Beyond visible damage, the hidden danger lies in mold spores between materials. Long-term exposure may contribute to respiratory issues, allergies, and other health concerns."

**FAQ block (3 questions):**
- **01 — What causes mold growth?** "Mold needs moisture, oxygen, and organic materials to grow. Common causes: poor ventilation, high humidity, and water intrusion or leaks."
- **02 — What is mold remediation?** "It's the process of identifying, containing, removing, and preventing mold growth. It includes cleanup, air filtration, and addressing the moisture source."
- **03 — Can mold affect my health?** "Yes — exposure may cause coughing, sneezing, headaches, skin irritation, asthma flare-ups, and fatigue, especially in sensitive individuals."

#### Section 3 — The Process
- 4 steps:
  - **01** Initial call
  - **02** Visual inspection / testing
  - **03** Remediation / scope of work
  - **04** Build back / reconstruction

#### Section 4 — Why 828
**Short version (RECOMMENDED):**
> "With decades of expertise, 828 brings a refined understanding of mold and its underlying causes — beyond visible factors such as water intrusion and construction defects. We employ a comprehensive diagnostic approach to considered conditions.
>
> This informs an advanced remediation methodology that exceeds industry standards."

#### Section 5 — Start Here
- Small label: "Start restoration"
- Bold headline: "Begin the path to renewal" or "Where recovery begins"
- Body: "Above all else, your peace of mind is paramount. We understand the disruption and urgency that follows damage — from restoring environmental integrity to complete reconstruction. 828 Construction delivers a seamless, disciplined process from remediation through completion."

Visual asset: Photo of Flair E8 and F277 MR equipment (Joe mentioned this specifically).

---

### CONSULTING SERVICE PAGE

#### Section 1 — Visual Hero
- AI-generated or real photo of people on a job site
- Small text: "Consulting"
- Bold overlay headline: "Delivering considerate solutions"

#### Section 2 — Identifying the Need

**Short version (RECOMMENDED):**
> "As a consulting and inspection-led general contractor, we start by understanding your project's conditions, budget, timeline, goals, and design vision — what challenges you are currently facing. Through careful evaluation and clear communication, we deliver responsible, tailored solutions that align with your project's unique needs."

**Benefits (5 items, accent-numbered):**
- **01** — Early detection of issues
- **02** — Creative problem solving
- **03** — Expert insight for preventative care
- **04** — Design & structural enhancements / assessments
- **05** — Peace of mind

#### Section 3 — Q&A
Intro: "As a general contractor offering consulting and home inspection services, we provide peace of mind by uncovering hidden issues, ensuring structural integrity, and delivering tailored solutions that align with your vision."

Three questions:
- **01** — What challenges or uncertainties are you currently experiencing with your home project that require expert guidance?
- **02** — What outcomes or improvements are you seeking through professional construction, consulting, and inspection services?
- **03** — How important is clarity, accuracy, and expert oversight in achieving your project's success and long-term value?

#### Section 4 — CTA
Headline: **"Engineered solutions tailored to your project"**

---

### PORTFOLIO PAGE (renamed from "Projects")

**Joe's hard rules:**
- NO AI-generated work photos. Period. Real photos only. "Coming Soon" placeholders OK.
- Photos with brief descriptions ("Bathroom Remodel — Redondo Beach")
- Before/after split images in single cards where possible
- Mixed sizes (NS Builders style — not a uniform grid)

**Section 1 — Hero**
Page name: **Portfolio** (not Projects)
Headline options:
- "Our philosophy of refined building"
- "Art of construction"

**Section 2 — Process is MERGED into this page**
Joe explicitly said: delete the standalone Process page, merge into Portfolio.
After gallery → build philosophy / process flow inline → photo → CTA.

**Section 3 — Working With Us**
Phrase: "Communication is essential in building your vision"

---

### CONTACT PAGE

Joe was most specific here. Mimic NS Builders' contact format closely.

#### Section 1 — Hero (split layout)
- One side: AI-generated picture
- Other side: "Get in touch" + tagline
- **Recommended tagline:** "Our journey begins with active listening — each conversation begins the foundation of shaping your vision."
- Alternative: "Building lasting partnerships — forging exceptional partnerships defined by artistry and enduring values."

#### Section 2 — Contact Form (all-black section)
- Section header: **"Get in touch"**
- Reword "What to include in your message" → "Critical elements to include in your communication" or "Essential components to highlight in your message"
- Form fields: Name, Email, Phone, Project type selector (asterisk dropdown — ADU / Remediation / Consulting), Message
- ❌ Remove "What happens" steps section

#### Section 3 — Mission Split
- Line down the middle
- One side: "Build your vision" / "Dedicated to your dream"
- Other side: image

#### Section 4 — Three-block bottom (mimic NS Builders)
- **01** — Schedule consultation
- **02** — Services
- **03** — Serving South Bay
- Company name in rolling-marquee format at very bottom

#### Tagline on this page
> "Our first step is listening. One conversation is the beginning of building your vision."

#### Email prefix options (PENDING DOMAIN CONFIRMATION)
- `inquire@828constructions.com`
- `explore@828constructions.com`
- `submit@828constructions.com`

---

### PAGES BEING DELETED

- **/process** — merged into /portfolio (Joe's explicit instruction)
- Various homepage sections (see Home page deletions list above)

---

## MOTION / INTERACTIVITY CHECKLIST

- [ ] **Splash:** Black vertical gradient (not solid) + letter-by-letter "828 Construction" reveal
- [ ] **Header:** Transparent → black on scroll (already implemented, keep)
- [ ] **Rolling marquee:** Footer top, About page area names, possibly portfolio tags
- [ ] **Asterisk/plus dropdowns:** FAQs on service pages, "Book Call" → phone number reveal in header
- [ ] **Scroll-scrub reveals:** Long sections (CRAFT, ADU acronym, principles)
- [ ] **Glass / blur depth:** Subtle texture or noise overlay on dark sections
- [ ] **Asymmetric splits:** Hero, Contact Section 1, Contact Section 3
- [ ] **Mixed-size grids:** Portfolio gallery, About area photos
- [ ] **Stretch (when Joe sends real photos):** Image-sequence / video-on-scroll hero

---

## ASSETS PENDING FROM JOE

- ADU at-night photo (sending via text during call)
- Real project photos (mid-May per existing memory)
- Joe portrait/headshot for About page (low priority — he's fine without)
- Photographer-quality shots of completed projects (deck, pergola, pool, bathrooms)
- Equipment photo (Flair E8, F277 MR) for Remediation page
- He confirmed: he can send raw photos and Brian can clean them up in AI tools. Only his actual projects shown.

---

## EXECUTION NOTES FOR CLAUDE CODE

**Page rebuild order:**
1. Splash — NS Builders vertical treatment
2. Home — Hero + simplified structure
3. About — story + 3 principles + CRAFT acronym + South Bay marquee
4. Services landing — creative discretion within design language
5. ADU page — visual hero + need + FAQ + 5-step process + ADU acronym + start-here
6. Remediation page — visual hero + need + 3 FAQs + 4-step process + why 828 + start-here
7. Consulting page — visual hero + need + 5 benefits + 3 Q&A + CTA
8. Portfolio (rename from Projects) — real photos + merged process content
9. Footer rebuild — rolling marquee + broken-color sections + schedule CTA
10. Contact page — ON HOLD until form infrastructure unblocks

**Standing rules:**
- Production build only (never dev server)
- Chrome DevTools MCP for animation/scroll verification
- All facts trace to `lib/constants.ts`
- 18-route preflight gates `git push`
- Atomic conventional commits per change area
