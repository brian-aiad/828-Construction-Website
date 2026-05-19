# 828 Construction Handoff

Date: 2026-05-14
Repo: `C:\Users\kingt\Desktop\828_website`
Current local URL: `http://localhost:3001`

## Current Direction

The client likes the "Our first step is listening" section because the ruler, grid, and drafting marks move with scroll. Continue the site in that direction: refined construction photography, dark premium editorial layout, and animated drafting-system overlays that feel like plans, measurements, field intelligence, and build precision.

New client note for all future page work: do not add too many sections. Joe believes his customers want meaningful sections, not a bunch of words. Keep pages concise, high-impact, visual, and conversion-focused. Each section needs to justify its existence through proof, clarity, service value, or a direct next step.

For About specifically, do not clone the homepage motion stack. Build a separate editorial/documentary rhythm with different section pacing, different reveal behavior, and more proof-led composition. If a visual reads as weak, generic, or AI-like, replace the asset or crop rather than forcing the same animation system to carry it.

Latest About pass generated two project-bound supporting images and copied them into `public/images/generated/`:

- `about-planning-table.png` — construction plans/materials table, used in the About hero, method section, and CTA.
- `about-framing-interior.png` — clean residential framing/interior, used in the About builder profile section.

These are intentionally used sparingly. Do not scatter them across unrelated sections or other pages without re-checking whether they still feel believable in context.

Latest Services pass generated three project-bound supporting images and copied them into `public/images/generated/`:

- `services-adu-exterior-v2.png` - realistic modern ADU exterior, used on Services and ADU pages.
- `services-remediation-field-v2.png` - clean remediation work area, used on Services and Remediation pages.
- `services-consulting-table-v2.png` - plans/materials consulting table, used on Services and Consulting pages.

Services direction: keep the landing and service detail pages concise. The page family should feel premium and alive, but not padded. Prefer 3-4 meaningful sections per service page over long word-heavy stacks.

Latest Portfolio pass rebuilt `components/portfolio/PortfolioContent.tsx` around four meaningful sections: editorial hero, featured proof cases, filtered project wall, and direct CTA. It intentionally removed the older long stacked portfolio sequence so the page feels curated instead of padded. Keep future portfolio work image-led and proof-led; do not add extra sections unless they clearly improve trust, project evaluation, or conversion.

Do not add random trendy effects. The methodology for this pass was:

- Use the existing stack already in the repo: Next 16, React 19, GSAP ScrollTrigger, Lenis, Framer Motion, SplitType.
- Keep the homepage section count intact.
- Remove or replace anything that reads like a placeholder, weak stock image, or disconnected decoration.
- Generate project-specific images when the existing image does not feel professional enough.
- Make scroll motion feel architectural: grids, rulers, technical arcs, parallax image depth, and restrained card reveals.
- Test desktop and mobile with Playwright, then adjust what looks unprofessional.

## What Changed In This Pass

### Homepage hero

File: `components/home/HeroV2.tsx`

- Rebuilt the hero from a split layout into a full-bleed cinematic ADU/outdoor-living hero.
- Added proof panels for `25+`, `03`, and license `1141119`.
- Added bottom detail panels for active listening, field intelligence, and CA license.
- Added scroll parallax on the hero image, veil, copy block, and detail cards.
- Added the shared drafting motion layer over the hero for subtle ruler/grid movement.

Generated asset used:

- `public/images/generated/home-hero-adu-evening.png`

### Services preview

File: `components/home/ServicesPreviewV2.tsx`

- Kept the asymmetric three-card services layout.
- Replaced the ADU card image with the generated hero-grade ADU image so the homepage feels cohesive.
- Added the shared drafting motion layer behind services.
- Changed the GSAP card reveal so cards are not permanently hidden if ScrollTrigger does not fire during capture or slow load.

### Vision and process section

File: `components/home/HomeVisionSequence.tsx`

- Kept the section the client liked and made its visual system stronger.
- Replaced the consultation image with a generated plans/materials/worktable image.
- Added subtle image texture behind the process cards.
- Added the reusable drafting motion layer at stronger intensity.
- Switched GSAP 3D props from `rotateX` to `rotationX` to avoid runtime warnings.

Generated asset used:

- `public/images/generated/home-process-materials.png`

### About preview

File: `components/home/AboutPreview.tsx`

- Replaced the darker/less premium about workbench image with a generated image that matches the new homepage palette.
- Added the drafting motion layer.
- Adjusted image focal point so the real scrolled mobile viewport shows the workbench/material detail instead of empty dark space.

Generated asset used:

- `public/images/generated/home-about-workbench.png`

### Shared motion system

File: `components/system/DraftingMotionLayer.tsx`

- New reusable animated drafting overlay component.
- Contains scroll-scrubbed grid movement, ruler movement, and technical arc rotation.
- Supports `quiet`, `standard`, and `strong` intensity.
- Current uses:
  - Hero: `quiet`
  - Services: `standard`
  - Vision/process: `strong`
  - About preview: `quiet`

Use this component when extending the same ruler/grid/blueprint language to other pages.

### Animation warning cleanup

Files:

- `lib/hooks/useTilt.ts`
- `components/home/SplashScreen.tsx`
- `components/home/HeroV2.tsx`
- `components/home/HomeVisionSequence.tsx`
- `components/home/ServicesPreviewV2.tsx`

Swapped GSAP transform aliases like `rotateX`/`rotateY` to `rotationX`/`rotationY` in touched homepage code and the shared tilt hook. This removed browser console warnings during the Playwright scroll smoke test.

## Generated Images

The generated homepage assets are committed to the project path:

- `public/images/generated/home-hero-adu-evening.png`
- `public/images/generated/home-process-materials.png`
- `public/images/generated/home-about-workbench.png`

Original generated outputs remain under:

- `C:\Users\kingt\.codex\generated_images\019e2834-9a55-7f50-9ff3-3cb53e88102f`

Do not reference the `.codex` paths from the website. Always reference files copied into `public/images/generated/`.

## Verification Done

Passed:

- `npx tsc --noEmit`
- `Invoke-WebRequest http://localhost:3001` returned `200`
- Playwright scroll-through smoke test returned `NO_CONSOLE_WARNINGS_OR_ERRORS`
- Mobile screenshot after waiting for splash:
  - `.claude-work/homepage-final2-mobile.png`
- Desktop screenshot after waiting for splash:
  - `.claude-work/homepage-after2-desktop.png`
- Real scrolled mobile about-section viewport:
  - `.claude-work/about-mobile-viewport.png`

Note: `npm run lint` timed out once during this session after 2 minutes. It was not completed. TypeScript and browser smoke tests did pass.

## Current Dev Server

This project is running at:

- `http://localhost:3001`

Port `3000` was already occupied by a different project, so this site was started on `3001`.

## Important Worktree Note

There were pre-existing unrelated modified/untracked files when this pass started. Do not revert them without explicit user approval.

Observed unrelated or earlier-pass files in `git status` included:

- `components/contact/ContactContent.tsx`
- `components/services/remediation/RemediationServiceContent.tsx`
- `research/joe-iteration-audit/`
- `research/joe-iteration-final/`
- `research/splash-refresh/`

Files intentionally changed in this homepage pass:

- `components/home/HeroV2.tsx`
- `components/home/ServicesPreviewV2.tsx`
- `components/home/HomeVisionSequence.tsx`
- `components/home/AboutPreview.tsx`
- `components/home/SplashScreen.tsx`
- `components/system/DraftingMotionLayer.tsx`
- `lib/hooks/useTilt.ts`
- `public/images/generated/home-hero-adu-evening.png`
- `public/images/generated/home-process-materials.png`
- `public/images/generated/home-about-workbench.png`
- `docs/828_CLAUDE_HANDOFF.md`

## Recommended Next Steps

1. Extend `DraftingMotionLayer` to the service detail pages, portfolio, contact, and about page in a restrained way.
2. Audit every page for weak or placeholder-feeling imagery. Generate replacements only where the current asset hurts the professional feel.
3. Keep the homepage section count unless the user explicitly asks for more sections.
4. Verify with Playwright after each page pass:
   - desktop screenshot
   - mobile screenshot
   - scroll-through console check
5. Run `npm run lint` with a longer timeout or targeted file linting before final delivery.

## Older 2026-05-12 Notes

Previous pass focused on:

- `components/services/remediation/RemediationServiceContent.tsx`
- `components/contact/ContactContent.tsx`

That pass:

- Removed weak remediation cutout imagery.
- Reframed remediation content around field photos and diagnostic story.
- Added GSAP/ScrollTrigger motion to the contact page.
- Preserved existing layout and copy.
