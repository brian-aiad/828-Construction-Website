# 828 Construction — Outstanding Items

_Add todos here. Remove when done. Date all entries._

## Next AI Handoff Notes (2026-05-26)

- The repo was pushed and locally cleaned on 2026-05-26. Do not assume `.next`, server logs, or prior Playwright output still exist locally.
- Use `npm run dev` / `npm run dev:3001` to restart local review at `http://localhost:3001`.
- If you need a production QA server, rebuild first (`npm run build`) and use `next start` on the expected QA port.
- Do not run blanket `git clean -X` in this repo without reviewing the dry run; it includes `.env.local` and `node_modules`.

## Expecting: next batch of Joe's feedback videos (2026-07-08)

- Brian says another batch of client walkthrough videos is coming (other pages/
  changes). Intake pipeline is ready: copy
  `.claude-work/research/about-joe-feedback/extract_and_transcribe.py` to a new
  batch folder, update the VIDEOS list, run it (faster-whisper + imageio-ffmpeg
  already pip-installed on the desktop PC), then read frames at transcript
  timestamps to resolve pointer references. Write the change doc in the
  `docs/828_ABOUT_JOE_FEEDBACK_2026-06.md` format before coding.

## Blocked on Client (Joe P)

- Real project photography — ADU at-night hero (Joe was sending via text during V2 call), photographer shots mid-May
- Joe portrait/headshot for About story section
- Equipment photos (Flair E8 + F277 MR) for Remediation page
- Resend API key (`RESEND_API_KEY` in `.env.local`) — contact form currently logs to console
- Google Business Profile link
- Domain confirmation (828constructions.com)
- Email prefix confirmation (`inquire@828constructions.com` is the default pending Joe's OK)
- Contact form is ON HOLD — do not build until email/DNS/Resend are set up

## Next Prompts in Queue (from Terminal Prompt Index)

Cinematic fix prompts remaining after Prompt 1 (Homepage) is done:
- **Prompt 2** — About + Service pages cinematic fix (CRAFT, principles, South Bay marquee, service page processes)
- **Prompt 3** — Portfolio + Services landing + Footer cinematic fix (already partially shipped in V2.5 pass)

## Page Rebuild Asset Swap Todos (when Joe sends photos)

These are one-swap-per-slot changes — component contract is the same:
- `HeroV2.tsx`: swap `/images/hero/patio-pool.jpg` → ADU at-night photo from Joe
- `AduServiceContent.tsx`: swap placeholder hero for Joe's ADU exterior shot
- `PortfolioContent.tsx`: swap AI-generated/placeholder project tiles → real photos only (Joe confirmed: no AI work photos)
- All silhouette slots: when real transparent PNGs arrive, drop them in as `<img>` replacing SVG components

## Hero Copy Pending

- `HeroV2.tsx`: headline currently `"Improving the unimproved."` — Joe is still deciding. Keep as placeholder until confirmed.

## Tech Debt / Polish

- Favicon set: verify `app/layout.tsx` has correct icon set (apple-icon, favicon variants)
- Logo: non-transparent 828logo.png should be wired in Header component
- `components/system/` primitives (GlassCard, silhouettes) — available for use but only deployed on pages that have been cinematic-fixed
- Mesh gradient in HeroV2 uses div transform drift (static radial-gradient + slow translate yoyo). If Joe wants fully dynamic blob repositioning, CSS Houdini or canvas would be needed. Current is sufficient.

## Known Bug Risks

- SplitType cleanup: any new text animation component must use 4-guard pattern from PATTERNS.md Fix 1
- Pin sections: never use overflow-hidden — always overflowX: 'clip'
- `useTilt` uses RAF loop for CSS transform (not GSAP quickTo) — verified working
- Preflight on Windows: OOM risk on full build. Current mitigations: NODE_OPTIONS 4096MB, .next wipe pre-build, periodic server restart. If OOM recurs, run `npm run preflight:full` manually instead of relying on git push hook.

## Lighthouse Targets (must hold after every push)

- Perf ≥ 80 desktop / 75 mobile (downgraded from 85/80 due to motion overhead)
- A11y ≥ 95
- BP ≥ 95
- SEO ≥ 95
