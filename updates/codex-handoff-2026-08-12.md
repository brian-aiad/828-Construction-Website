# Codex Handoff - 2026-08-12

## Current Goal

The site owner wants the 828 Construction website to feel production-ready across desktop, iPad/tablet, and mobile, with the desktop section-cover animation restored and no fast scroll glitches. Do not change marketing wording unless explicitly asked.

## Main Issue Being Fixed

Fast scrolling on pages such as About and Portfolio caused stacked sticky sections to overlap and flicker. The visual problem looked like sections did not know which one was above or below. The root cause was multiple sticky full-screen surfaces painting at `top: 0` at the same time during scroll transitions.

## Important Fixes In Current Working State

- Restored desktop sticky/cover section flow behavior across Home, About, Services, Portfolio, Contact, ADU, Remediation, and Consulting flows.
- Added `components/system/useStackSurfaceVisibility.ts` to hide covered stack surfaces during desktop scroll transitions.
- Updated stack animation activation to desktop/fine pointer only, using a 1280px breakpoint.
- Updated `useJunctionSettle` majority snapping so the section that owns most of the viewport wins.
- Kept mobile/tablet layouts non-sticky to avoid scroll glitches on smaller or coarse-pointer devices.
- Hardened footer email wrapping using `data-footer-email` so tablet layouts do not clip the email.
- Kept local wording unchanged.

## Validation Already Done

Latest successful checks before this handoff:

- `npm run lint`
- `npm run build`
- Production-local server: `http://localhost:4001`
- Dev server: `http://localhost:3001`
- Browser load sanity for `/`, `/about`, `/portfolio`, `/services`, `/contact` on production-local returned `200` with no console errors or failed CSS/JS requests.

Frame-by-frame scroll recording summary from `.claude-work/scroll-video-after4/`:

```txt
Home:      0 multiPaint / 0 topTies
About:     0 multiPaint / 0 topTies
Portfolio: 0 multiPaint / 0 topTies
Services:  0 multiPaint / 0 topTies
Contact:   0 multiPaint / 0 topTies
```

Recording files are in `.claude-work/scroll-video-after4/`.

## Local URLs

```txt
Dev:        http://localhost:3001
Production: http://localhost:4001
```

If either server is down after restart:

```bash
npm run dev -- --port 3001
npm run build
npm run start -- --port 4001
```

## Production Deployment Note

Local fixes will not appear on `828constructions.com` until the current commit is pushed to `main` and Vercel finishes the production deployment. After deployment, verify the official domain directly, especially:

- Home section transitions
- About fast scroll transitions
- Portfolio fast scroll transitions
- Services detail pages
- Footer on desktop and iPad landscape
- Mobile layout spacing and image/text animations

## User Preferences To Preserve

- Desktop should keep the section-cover/snap effect.
- If most of a section is visible, snapping should settle to that section.
- Mobile should look organized and professional, with some animation, but should not glitch.
- Do not flatten pages by removing all animations.
- Do not change wording/verbiage without permission.
- Test by trying to break the site, including fast scroll behavior.
