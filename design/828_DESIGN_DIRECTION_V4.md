# 828 — Standing Design Direction (V4, Brian 2026-07-08)

Brian's spoken directive after approving the About V3 verbiage. This applies to
EVERY page pass from now on, including all future client-video batches. Read
this before any page work, alongside `828_DESIGN_SYSTEM.md`.

## The one-sentence brief
Mimic the SIMPLICITY of the homepage / NS Builders (nsbuilders.com) — Joe loves
that format — but page-animated and custom-feeling, so it looks expensive. Not
a standard section-by-section template.

## Non-negotiables (Brian's words, paraphrased tightly)
1. **Verbiage is FROZEN.** Joe's dictated copy stays word-for-word. Design
   passes reorganize and restyle; they never rewrite.
2. **No huge text of verbiage across the screen.** Billboard-scale headlines
   are out. Follow the homepage's 2026-06-10 evolution: readable headline
   blocks, roughly `clamp(1.8rem, 3.2vw, 3.4rem)` for section heads and
   ~`clamp(2.2rem, 4.5vw, 4.6rem)` max for a page hero. Hierarchy comes from
   opacity, spacing, and maroon accents — not point size.
3. **Asymmetric, alternating motion.** "One side of the page is moving and then
   the other" — sticky media column vs scrolling copy column, alternating sides
   section to section. Avoid centered full-width stacks.
4. **Morphing top bar on every page.** The header must change while scrolling
   (home's zone-aware pattern: `data-header-dark` / `data-header-light` zones,
   dark glass over photos/black panels, cream glass over light surfaces).
   Port/verify on each page rebuilt.
5. **Simple but page-animated.** Fewer, better moves: stacked surfaces,
   scrub-settled photos, quiet reveals, one signature moment per page. Motion
   rewards scrolling; it never shouts. Watermarks stay whisper-quiet
   (≤0.05 opacity) and small enough not to read as "huge text."
6. **Custom, not templated.** No repeated section skeletons down a page. Each
   section gets its own composition (split, offset grid, sticky rail, inset
   photo band) while sharing the same type/color system.
7. **Mobile is a first-class deliverable.** Design the 390px experience, not
   just check it: shorter sections, readable sizes, native-scroll reveals, no
   horizontal drift, tap targets ≥44px.
   **Audit widths (updated 2026-07-09):** every visual/text-fit audit runs at
   390 / 768 / 1024 / 1280 / 1440 / **1657** / **1920** — the 1440–1920 band
   caught a real mid-word-break bug that 1440-only captures missed. Harness:
   `.claude-work/research/site-textfit/audit.mjs` must report 0 issues twice
   consecutively. Nothing may ever clip, wrap mid-word, or overflow at any of
   these widths — resize (clamps, minmax columns, nowrap) without changing
   words or design.
8. **Looks expensive** = restraint: generous whitespace, hairlines, glass
   depth, photography breathing room, 80/10/10 palette discipline.

## Imagery
- Prefer real client photos when available (portfolio: real only — locked).
- Elsewhere, existing `public/images/generated/*` assets may be used; vary them
  (don't repeat one photo across a page). New AI imagery only when a session
  has a generation tool available AND it's not portfolio work-photography;
  keep it abstract/architectural, never fake job-site "proof."

## Process notes for the next video batch
- Intake pipeline: `.claude-work/research/about-joe-feedback/extract_and_transcribe.py`
  (faster-whisper + imageio-ffmpeg, installed on desktop PC). Frames every 2s;
  resolve every "this here" against frames before writing the change doc.
- Then: apply verbiage EXACTLY → reorganize sections under this V4 direction →
  functional-qa both viewports → preflight:full → Lighthouse (prod, desktop
  preset) → commit ns-preview → `npx vercel deploy --prod --yes --scope
  aiadcollc` from `C:\Users\kingt\.828-ns-preview-deploy` (robocopy /MIR sync
  first) → client reviews at https://828-ns-preview.vercel.app.
- NEVER push `main` unless Brian says "push to main" / "promote to production".
