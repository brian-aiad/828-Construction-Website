# 828 Home Remodel Handoff

**Date:** May 6-7, 2026  
**Scope:** Homepage-only remodel pass after V2.5 cinematic work still felt flat.  
**Status:** Implemented locally, not yet committed in this handoff session.

## Why This Pass Happened

The prior cinematic prompts added motion infrastructure, but the actual home route was still too thin. It only rendered:

- `HeroV2`
- `ServicesPreviewV2`
- `AboutPreview`

That meant several stronger existing sections were not visible on the homepage, and the page still felt like a flat stack of generic dark sections. The client notes repeatedly emphasized active listening, building the client vision, dedicated dream language, process clarity, movement, depth, and NS Builders-style cinematic scroll behavior.

## Files Changed

### `app/page.tsx`

The homepage now renders:

1. `SplashScreen`
2. `HeroV2`
3. `ServicesPreviewV2`
4. `HomeVisionSequence` **new**
5. `AboutPreview`
6. `HomeCTA`

This turns the homepage into a fuller client-facing journey instead of just hero + services + about.

### `components/home/HeroV2.tsx`

Changes:

- Replaced placeholder headline:
  - Old: `Improving the unimproved.`
  - New: `Built with intent. Not by accident.`
- Replaced generic body copy with more client-specific language:
  - `Refined residential construction shaped through listening, thoughtful analysis, and enduring craft. ADU. Remediation. Consulting.`
- Added a glass/depth card over the hero image:
  - `01 / Active listening`
  - `One conversation becomes the foundation for shaping your vision.`
- Added a floating license badge:
  - `CA #1141119`
- Reduced hero headline scale so it no longer clips on desktop.
- Reduced SplitType headline delay from `0.6` to `0.05` so a refreshed page does not sit with invisible hero text.
- Kept the existing strong V2.5 hero primitives:
  - mesh gradient idle drift
  - large architectural silhouette at `65vw` / `0.55`
  - silhouette idle float and `-85%` scroll parallax
  - photo scale on scroll
  - copy parallax

### `components/home/HomeVisionSequence.tsx`

New custom homepage section built directly from Joseph's notes.

Content/language included:

- `Our first step is listening`
- `One conversation begins the build.`
- Active listening paragraph:
  - `Our journey begins with active listening, where each conversation becomes the foundation for shaping your vision.`
- Partnership language:
  - `lasting partnerships defined by artistry, clarity, and enduring residential value`
- Three small phrase cards:
  - `Build your vision`
  - `Dedicated to your dream`
  - `Art of construction`
- Rolling marquee terms:
  - `active listening`
  - `build your vision`
  - `dedicated to your dream`
  - `refined building`
  - `lasting partnerships`
- Process headline:
  - `The approach`
  - `Build philosophy, made visible.`
- Process cards use `PROCESS_STEPS_V2` from `lib/constants.ts`:
  - `01 Initial Contact / Pre-construction`
  - `02 Site Visit / Design & Planning`
  - `03 Permit & Approval / Code Compliance`
  - `04 Construction / Full Build Execution`
  - `05 Post-Construction / Project Completion`
- Closing line:
  - `Communication is essential in building your vision.`
- CTA:
  - `Start Step 01`

Motion/design details:

- Large `LevelSilhouette` and `BlueprintCornerSilhouette` as visible construction-specific depth layers.
- Subtle blueprint grid background.
- SplitType headline reveal with rotateX.
- Center maroon vertical line that scroll-scrubs.
- Process cards reveal with y/opacity/rotateX.
- Desktop horizontal pinned process track with mobile vertical fallback.
- Always-on marquee strip.

### `components/home/HomeCTA.tsx`

This existing component was not previously rendered on the homepage. It is now wired into `app/page.tsx` and cleaned up.

Changes:

- Imports `FOUNDING_YEAR` and uses 2004 instead of stale `2025`.
- Replaced copper hardcodes with `var(--color-accent)`.
- Changed CTA label/content:
  - Old headline: `Let's talk about your project.`
  - New headline: `Prepared to proceed with your vision?`
  - New body aligns with Joseph's ADU/start-here note:
    - `Whether your vision is fully defined or still evolving, start with one conversation. 828 Construction will personally review the project and explore the next right step.`
  - Button text:
    - Old: `Request an Estimate`
    - New: `Start Here`
- Increased magnetic strength from `0.3` to `0.55`.
- Trust strip changed:
  - Old: `Free Consultation`
  - New: `First Step: Listening`
- Stat tag changed:
  - Old: `25+ Years Building South Bay`
  - New: `20+ Years Hands-On Expertise`

## Verification Already Run

Commands passed:

```powershell
npx.cmd tsc --noEmit
npx.cmd eslint app/page.tsx components/home/HeroV2.tsx components/home/HomeVisionSequence.tsx components/home/HomeCTA.tsx
```

Visual verification:

- Port `3000` is serving a different app on this machine. Do **not** use `localhost:3000` to judge 828.
- Started the 828 project on:

```text
http://localhost:3028
```

- Captured Playwright screenshots and visually checked:
  - hero
  - services/vision transition
  - process section

Screenshot artifacts were saved under `.claude-work/` during the session:

- `.claude-work/home-remodel-hero.png`
- `.claude-work/home-remodel-vision.png`
- `.claude-work/home-remodel-process.png`

These are verification artifacts only and do not need to be committed.

## Important Notes For Next Terminal

- `localhost:3000` is not reliable for this repo right now because another app is running there.
- Use `http://localhost:3028` for local visual review unless the conflicting app is stopped.
- `.preflight-passed` was already modified by local preflight/visual verification activity. It was left untouched intentionally.
- Do not reintroduce:
  - `Improving the unimproved.`
  - `Est. 2025`
  - copper `#B87333` in homepage components, unless using the fallback token intentionally
- The new `HomeVisionSequence` is the main custom homepage upgrade. Future work should polish it rather than delete it.
- Full repo lint may time out because ESLint scans `.claude` worktree/generated artifacts. Scoped lint passed for changed files.

## Suggested Next Step

Run a real browser review at `http://localhost:3028`, scroll the homepage manually, then decide whether to:

1. Commit this homepage remodel as-is.
2. Do a small visual polish pass on `HomeVisionSequence` spacing/brightness.
3. Run full preflight if preparing to push.
