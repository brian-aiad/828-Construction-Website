# 828 Joe Conversation Implementation Brief

Last updated: 2026-05-12

## Core Direction

Joe wants a premium, minimal, interactive residential builder website. The site should not feel like a template, a generic contractor page, or an AI-generated construction site. It should feel simple, deep, architectural, and alive.

The strongest existing pattern is the homepage listening section: ruler marks, grid structure, transparent drafting/tool layers, maroon rule lines, and scroll-tied movement. Extend that language across the site as background depth, overlays, dividers, hover states, and process moments. Do not add another flat standalone measurement section.

## Global Rules

- Keep the one-line `828 Construction` wordmark.
- Use black, white, dark gray, and restrained maroon `#7B2D26`.
- Avoid bright red and avoid copper except as legacy fallback.
- Keep the header transparent at top and black after scroll.
- Keep location/time in the header.
- Keep `Book Call` with an asterisk/plus phone reveal.
- Use fewer sections. Remove redundant CTA blocks when the footer already gives the action.
- Portfolio must only imply real prior work. If real photos are not ready, use neutral selected-work or coming-soon language.
- Each major page needs one signature motion idea, not the same fade-up everywhere.

## YouTube Reference Takeaways

- `https://youtu.be/s7n9vRFvmM0`: scroll-controlled media. Use pinned or scrubbed moments where drawings, photos, process stages, or inspection details advance with scroll. Official GSAP ScrollTrigger docs support scroll-linked timelines, scrub, pinning, and start/end control.
- `https://youtu.be/R5-B_mOlcl4`: redesign discipline. Audit first, remove weak/repetitive sections, then add depth and motion only where hierarchy needs it.
- `https://youtu.be/pbhLsV-Dyho`: premium design fundamentals. One strong focal element, better type hierarchy, clear contrast, meaningful design details, and fewer generic blocks.
- `https://youtu.be/qTw-HvYF-DM`: expensive finish. Negative space, restrained color, texture, confident imagery, and precise microinteractions matter more than more content.

## Home

Keep:
- Hero direction and current cinematic photo/copy structure.
- Services preview.
- The `Our first step is listening` section. This is the clearest example of the ruler/grid/depth style Joe likes.
- About preview.

Remove:
- Final homepage `Prepared to proceed with your vision?` CTA section. Joe said this can roll into the footer.

Key phrases:
- `Built with intent. Not by accident.`
- `Improving the unimproved.`
- `Our first step is listening.`
- `One conversation begins the build.`
- `Build your vision.`
- `Dedicated to your dream.`
- `Communication is essential in building your vision.`

## About

Structure:
- Black or image-backed hero with `828 Construction` large and simple.
- Story section about two decades of field-built experience.
- Principles: `Craft over count.`, `Built with purpose.`, `Quality is the strategy.`
- CRAFT acronym with large background word and animated cards.
- South Bay Native marquee.
- Footer or compact CTA only.

Key phrase:
- `Every detail shaped by precision.`
- `Prepared to create.`
- `Designed for clients who value seasoned experience.`

## Services

Keep services focused on:
- ADU Construction
- Remediation
- Consulting

Page should feel like a gateway, not a generic service list. Use distinct visual behavior for the three service tiles. Add ruler/grid/tool overlays behind sections, but keep service photography as the focal point.

## ADU

Hero:
- ADU / Accessory Dwelling Unit
- `Built with intent`

Need section:
- Private retreat, hosting guests, family accommodation, expanded living space, elevated property value.

Process:
- `The approach`
- `Build philosophy`
- Initial contact / pre-construction
- Site visit / design
- Permit & approval
- Construction / full build / project completion
- Post construction

Why 828:
- A: aligned with the client's vision
- D: dedicated to quality, precision, craftsmanship
- U: understanding the renovation process as structural transformation and personal journey

CTA:
- `An invitation to work together.`
- `Prepared to proceed with your vision?`

## Remediation

Hero:
- `Service`
- `Remediation`
- `Complex conditions, refined expertise`

Need section:
- Mold from moisture intrusion, leaks, cracked pipes, old windows, hidden spores, material damage, health/allergy concerns.

FAQ:
- What causes mold growth?
- What is mold remediation?
- Can mold affect my health?

Process:
- Initial call
- Visual inspection / testing
- Remediation / scope of work
- Build back / reconstruction

CTA:
- `Start restoration`
- `Begin the path to renewal`
- `Where recovery begins`

Image needs:
- FLIR E8 style thermal inspection tool
- F277 MR style moisture meter

## Consulting

Hero:
- Job-site people image
- `Consulting`
- `Delivering considerate solutions`

Need section:
- Conditions, structure, budget, timeline, architectural vision, site context, challenges, goals.

Benefits:
- Early detection of issues
- Creative problem solving
- Expert insight for preventative care
- Design and structure enhancement / assessments
- Peace of mind

CTA:
- `Engineered solutions tailored to your project.`

## Portfolio

Use `Portfolio`, not `Projects`.

Use real work only. If image slots are not verified as Joe's work, avoid copy that implies completed project ownership.

Phrases:
- `Our philosophy of refined building`
- `Art of construction`
- `Communication is essential in building your vision`

Desired features:
- Mixed-size editorial gallery.
- Before/after or in-progress pairings when Joe provides matching photos.
- Process content merged into portfolio instead of a separate Process page.

## Contact

Section 01:
- `Get in touch`
- Split or editorial image hero.
- Copy: `Our first step is listening. One conversation begins the foundation of building your vision.`
- Optional support: `Building lasting partnerships` and `Forging exceptional partnerships defined by artistry and enduring values.`

Section 02:
- All-black section.
- `Get in touch`
- NS Builders style contact format.
- Rephrase `What to include in your message` as `Essential components to highlight in your message`.
- Use the three services as choices.
- Remove the old `What happens after` section.
- Contact form label should be `Project Type *`.

Section 03:
- Split line down the middle.
- One side: `Build your vision.`
- Other side: picture.
- Phrase: `Dedicated to your dream.`

Section 04:
- Three blocks:
- `01 Schedule consultation`
- `02 Services`
- `03 Serving South Bay`
- Moving `828 Construction` name at bottom.

Email options to confirm:
- `inquire@828.com`
- `explore@828.com`
- `submit@828.com`
- Current repo fallback: `joe@828constructions.com`

## Footer

Footer should carry the sitewide CTA so individual page endings can be simpler.

Required:
- Moving company-name layer.
- Broken-up information/action blocks.
- Email, phone, address, license.
- `Schedule consultation`, `Services`, `Serving South Bay`.
- Should be clear, not overwhelming.

## Current Iteration Actions

- Remove homepage `Prepared to proceed` CTA.
- Rebuild footer around Joe's bottom-section direction.
- Rebuild contact page around Joe's four-section structure.
- Add the ruler/grid/tool depth language into interior pages as overlays and motion details.
- Create image-generation prompts for missing visual assets.
