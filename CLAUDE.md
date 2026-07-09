# 828 Construction — Project Rules

This file is read by Claude Code automatically at the start of every session in
this project. It contains non-negotiable rules. If anything here conflicts with
skill instructions, this file wins.

---

## V2 DESIGN LANGUAGE — CURRENT (May 2026)

The V2 brief lives at `docs/828_CLIENT_BRIEF_V2.md`. Read it before any page-level work.

### Locked decisions
- **Accent color:** Maroon `#7B2D26` is primary. Use `var(--color-accent)`. Copper `#B87333` retained as fallback only (`var(--color-accent-fallback)` / `var(--accent-copper)`).
- **Founding year:** 2004 (typed-notes typo of 2025 ignored — verbal call confirms 2004).
- **Bold display font:** Reserved for "828" wordmark and main hero anchor headlines ONLY. Everything else uses lighter weights.
- **Header:** One-line "828 Construction" wordmark LEFT, location+timestamp RIGHT, "BOOK CALL" CTA with asterisk-dropdown phone reveal.
- **Splash:** Black vertical gradient (`var(--gradient-splash-vertical)`), one-line wordmark, letter-by-letter reveal, slightly larger than V1.
- **Process page:** DELETED. Content merges into renamed `/portfolio` (was `/projects`).
- **Contact form:** ON HOLD. Do not build. Email/DNS/Resend pending Joe.
- **Portfolio photos:** Real only. AI-generated work photos forbidden. "Coming Soon" placeholders OK per Joe.

### Motion vocabulary
1. Scroll-scrub reveals (GSAP ScrollTrigger — already in stack).
2. Asterisk/plus dropdown reveals (Book Call header CTA, FAQ expanders on service pages).
3. Rolling marquees (footer top, About area names — `@keyframes marqueeScroll` already in globals.css).
4. Subtle glass/depth overlays — site must NOT feel flat.
5. Asymmetric splits (home hero, contact sections).
6. Image-sequence on scroll (reserved for once real photos arrive).

### Route-specific motion rule
- Each route must have its own motion grammar. Do not copy the homepage scroll pattern onto pages other than About.
- **EXCEPTION (Brian, 2026-07-08):** About carries the homepage stacked-surface grammar via `components/about/AboutFlow.tsx` (dark-surface port of EditorialFlow) — explicit owner override. Within-section reveal logic stays About-specific (CRAFT watermark drift + letter rail, documentary pacing).
- About should feel like a documentary/editorial profile: different section pacing, different reveal logic, and more proof-led composition.
- If an image reads as generic or AI-like, replace it with a better-fitting asset or crop rather than repeating the same visual trick.

### Git & deploy policy (LOCKED — June 2026, Brian's explicit instruction)
- **NEVER push to `main` unless Brian explicitly says "push to main."** Pushing `main` auto-deploys to the LIVE site 828constructions.com via Vercel git integration.
- **"Commit and push" (or just "push") means: update the CLIENT PREVIEW, not the live site.** Concretely: commit on the `ns-preview` branch, push that branch to GitHub, then redeploy the separate Vercel project `828-ns-preview` (CLI: sync working tree to a clean copy excluding node_modules/.next/.git/.claude-work/research/"joes pics"/chatpics/docx, then `npx vercel deploy --yes --scope aiadcollc` from that copy). Client preview URL: https://828-ns-preview.vercel.app
- The `828-ns-preview` Vercel project is NOT git-connected and has no custom domain — it can never affect 828constructions.com.
- Work happens on the `ns-preview` branch, not `main`.

### Standing rules
- **Keep the dev server running (Brian, 2026-07-08):** At session start, check `http://localhost:3001` and start `npm run dev` (background) if it's down — Brian watches changes live there while work happens. Leave it running when the session ends.
- **Local dev URL:** Always use `http://localhost:3001` for this repo. `npm run dev` is pinned to `next dev -p 3001`. Port `3000` belongs to another local app and must not be used to judge 828.
- All factual data traces to `lib/constants.ts`.
- Production build only for verification (port 4000).
- Chrome DevTools MCP for animation/scroll verification — Playwright is functional only.
- 18-route preflight gates `git push`.
- Atomic conventional commits per change area.
- `impeccable` pre-commit hook runs on every commit.

### Page rebuild order (separate terminals)
1. Splash — NS Builders vertical gradient treatment
2. Home — simplified to Hero + Services Preview + About Preview + Footer
3. About — story + 3 principles + CRAFT acronym + South Bay marquee
4. Services landing — creative discretion within design language
5. ADU page — visual hero + need + FAQ + 5-step process + ADU acronym + start-here
6. Remediation page — visual hero + need + 3 FAQs + 4-step process + why 828 + start-here
7. Consulting page — visual hero + need + 5 benefits + 3 Q&A + CTA
8. Portfolio (rename from Projects) — real photos + merged process content
9. Footer rebuild — rolling marquee + broken-color sections + schedule CTA
10. Contact page — ON HOLD until form infrastructure unblocks

---

## Read these before any code change

0. `design/828_DESIGN_DIRECTION_V4.md` — Brian's standing directive (2026-07-08): verbiage frozen, NS-simple + page-animated, NO billboard-scale text, asymmetric alternating motion, morphing header on every page, mobile designed not just tested. Applies to ALL future page passes and video batches.
1. `design/828_DESIGN_SYSTEM.md` — palette, type, animation catalog, component primitives
2. `design/PATTERNS.md` — Known Fixes section (21 solved bugs + 4 V2 patterns; use these, do not re-solve)
3. `~/.claude/skills/828-construction-methodology/SKILL.md` — the v3 autonomous build protocol
4. `~/.claude/skills/ux-architecture-methodology/SKILL.md` — UX architecture protocol (runs before motion skill on new pages; audit layer on existing pages)
5. `~/.claude/skills/828-preflight/SKILL.md` — pre-push test gate (run before declaring any page done)
6. `PROJECT-MAP.md` — exact file locations for every route, component, and image asset

## Quality bar

Any page being redesigned must reach parity with the About page
(`components/about/AboutContent.tsx`). That is the reference. Do not ship less.

## Forbidden patterns

- Navy, blue, or slate-reading-as-blue tones. V2 palette: black / white / gray ramp / maroon `#7B2D26` (primary accent) / copper `#B87333` (fallback only).
- `filter: grayscale(...)` on any image, ever.
- `filter: brightness(...)` below 0.9 on hero images — makes photos unreadable.
- `pinSpacing: true` (the GSAP default) without an explicit `minHeight` on the pin wrapper — causes visible white gaps after pinned sections.
- `overflow-hidden` on a section that contains pinned content — use `overflowX: 'clip'` instead.
- `opacity: 0` as initial state on above-the-fold text — kills LCP.
- Counter elements with no hardcoded fallback text content — always ship real values in JSX.
- SplitType without the 4-guard cleanup from `PATTERNS.md` Fix 1 (isConnected check, mounted flag, cancelAnimationFrame, try/catch).
- Pin sections where two panels can be visible at the same time — use `gsap.set()` opacity snap in onUpdate, not `gsap.to()` with duration.

## Definition of done

A page is not done until ALL of these are true:

1. `node .claude-work/research/{page}-fixes/functional-qa.mjs {URL} desktop` returns `PASS: true`
2. Same at `mobile` (390×844 viewport) returns `PASS: true`
3. **`npm run preflight:full` exits 0** — this runs `next build` + tests ALL 9 routes. Not just the changed page.
4. Production build (via `npx next start -p 4000`) Lighthouse: Performance ≥85, Accessibility ≥95
5. The page has been scrolled end-to-end at both viewports with no dead zones, overflow, or stacked content
6. Memory or page status in this file has been updated
7. Phase 4.5 visual audit: every major section has a PASS file with all 5 questions answered affirmatively, AND the functional-qa duplicateHeadings array is empty.
8. **/design-critique and /accessibility-review run as subagents** — block deploy if A11y score drops below 95

## Autonomous mode

For any task matching these keywords on any page — `redesign`, `revamp`, `polish`, `fix`, `v3 quality pass`, `bug fix pass`, `clean up`, `make it better` — invoke the `828-construction-methodology` skill and run its full six-phase protocol autonomously.

For any task mentioning UX, structure, flow, information hierarchy, user journey, above-the-fold, or when a page has motion quality but feels weird to use, invoke the `ux-architecture-methodology` skill FIRST (page architecture), then `828-construction-methodology` (motion quality). A beautifully animated wrong structure is still a wrong structure. UX always precedes motion.

- Do not ask for approval between phases.
- Do not send status updates.
- Do not interrupt.
- Deliver one final report when the Definition of Done above is satisfied.

Minimum elapsed for a full page redesign: 45 minutes. Minimum for a bug-fix pass: 15 minutes. If you finish sooner, the protocol was shortcut — back up and verify every deliverable exists.

## Anti-patterns observed in past sessions

- Reporting "done" in 10–15 minutes on a redesign task. Means Phases 1, 2, and 4 were skipped.
- Treating `functional-qa.mjs` as optional. It is not.
- Re-solving a bug already in `PATTERNS.md` Known Fixes with new custom code. Use the existing fix.
- Running Lighthouse against the dev server instead of production. Invalid result.
- Building a page without reading `design/828_DESIGN_SYSTEM.md` first — leads to palette drift and pattern inconsistency.

## Page status (update after each completed page)

| Page | Status | Date |
|------|--------|------|
| Splash | V2.5 Cinematic — rotateX 88→0 3-channel reveal, maroon radial ignition pulse on entry, curtain-wipe exit (clipPath inset). V2 base: vertical gradient, ONE LINE wordmark, maroon underline, sessionStorage gate. | 2026-05-06 |
| Home (`/`) | V3.5 NS-grammar stacked-surface build — hero CSS-sticky pinned with Ken Burns drift; EVERY section holds still once read while the next surface rides over it (EditorialFlow measured sticky tops + cover scale/dim). Morphing header: white-on-photo over hero → #f7f7f3 glass with dark ink over the light surface (home only). Persistent DockedCTA "Book Call" card bottom-left (appears after hero, hides at footer). Fireplace photo scrubs inset-frame → full-bleed 92vh. Editorial-scale marquee. Maroon plumb line + ignition nodes. Word-fill scrub statement. Process rows ignite in the focus band. All copy verbatim. KNOWN CONTENT BUG flagged for client: "Refining industry standards." duplicated in HomeVisionSequence AND AboutPreview. Verify on `http://localhost:3001`; port 3000 is another app. | 2026-06-10 |
| About (`/about`) | V6 — Brian's screenshot-feedback pass on V5 (docs/828_ABOUT_BRIAN_FEEDBACK_V5.md), words frozen: compact dossier hero (no dead middle, hairline-draw proof rows, 92svh); condensed builder profile ("Observed/Not assumed." + "Field standard" chrome deleted) with JOE PORTRAIT SLOT — drop public/images/about/joe-portrait.jpg → renders next build/refresh (server-side fs.existsSync in app/about/page.tsx; pending JP plate until then); CRAFT letter-completion rows (each word slides out of its maroon-igniting capital — page signature, PATTERNS.md); tight South Bay marquee band + glass card; CTA split panel with drawing maroon seam. AboutFlow stacked surfaces, cover-scale top-anchored (junction artifact fixed). Verbiage source: docs/828_ABOUT_JOE_FEEDBACK_2026-06.md. Research: .claude-work/research/about-v3/. | 2026-07-08 |
| Services (`/services`) | V3 — Joe's video-feedback rebuild (docs/828_SERVICES_JOE_FEEDBACK_2026-07-08.md): whited-out NS-list hero (rows illuminate in the focus band, sticky photo crossfade — page signature), "Where your vision meets uncompromising quality." + full-bleed photo split (placeholder pending real homeowner-admiring shot), "Ever present" 01–04 principles split (sticky close-up vs scrolling igniting rows), "Guided by our foundational principles…" + 6-stage strip (maroon progress draw) + CTA split ("Committed to bringing your vision to life." / PHASE ONE). Instrument doodles deleted per Joe. Verbiage frozen. New PATTERNS.md Fix 23 (IO never fires on fully-clipped elements) discovered here. | 2026-07-08 |
| Services/ADU (`/services/adu`) | V3 — Joe's 4-video verbiage batch applied verbatim (docs/828_ADU_JOE_FEEDBACK_2026-07-08.md, words frozen): hero "Built with intent" vertical-rl + maroon plumb line + dictated paragraph; FAQ card grid (NS Perspectives grammar, +/× expanders, dictated intro line); "What ADU means to 828." A/D/U value rows with focus-band ignition + drifting ADU watermark (page signature); "An invitation to work together" CTA with 01–04 qualifying questions in fine print. Zone-aware morphing header (data-header-light on FAQ). functional-qa: .claude-work/research/adu-fixes/. | 2026-07-08 |
| Services/Remediation (`/services/remediation`) | V3 — Joe's 4-video verbiage batch applied verbatim (docs/828_REMEDIATION_JOE_FEEDBACK_2026-07-08.md, words frozen): hero "828 — creating healthier environments, one home at a time." + peace-of-mind paragraph (asymmetric copy/photo split); NS-Perspectives FAQ ("When mold remediation is necessary", 3 Q&A cards, +/× expanders); "The approach / Build philosophy" 01–04 focus-band rows + sticky reconstruction photo; method section re-verbiaged ("828's integrated remediation and restoration approach…"); CTA "Start restoration / Where recovery begins / Begin the path to renewal" + equipment showcase signature (Flair E8 / 277 MR plates, converging w/ maroon seam — real photos PENDING from Joe). FAQPage JSON-LD added. functional-qa: .claude-work/research/remediation-fixes/ PASS both viewports. | 2026-07-08 |
| Services/Consulting (`/services/consulting`) | V2 + V2.5 elevation — visual hero (BlueprintCorner silhouette), 5 benefits, 3 Q&A, CTA. | 2026-05-06 |
| Process (`/process`) | DELETED — 308 redirect to /portfolio | 2026-05-06 |
| Contact (`/contact`) | ON HOLD — form infrastructure (email/DNS/Resend) pending Joe | — |
| Portfolio (`/portfolio`) | V2 + V2.5 elevation — renamed from /projects, 14-photo gallery, cinema row, 5-step process, compass silhouette CTA. Case-index preview hardened, and live project slots now avoid generated-angle/v2 generated portfolio images while real photos remain pending. | 2026-05-21 |
| Footer (site-wide) | V2 + V2.5 elevation — 2-layer marquee (2.2rem bg reversed + 9px fg, visually distinct), magnetic 828 anchor, license badge glow, BOOK CALL dropdown CTA, broken-color info blocks. | 2026-05-06 |

## Project context

- **Stack:** Next.js 16 (Turbopack), Tailwind CSS v4, GSAP + ScrollTrigger, SplitType, Lenis, Resend, Vercel Analytics
- **Fonts:** Space Grotesk (display), Space Mono (numbers), IBM Plex Mono (labels)
- **Reference aesthetic:** NS Builders (Boston) — editorial, photography-first, scrub-dominant motion
- **Client:** Joe P, 828 Construction, Torrance CA (CA License #1141119, est. 2004)
- **Logo:** `828logo.png` + `828logo_trans.png` exist in project root — wire non-transparent version in Header

## Living Docs (read at session start)

`.claude/project-context/` — update after every session:
- `CURRENT_STATUS.md` — page Lighthouse scores, what's done vs pending
- `RECENT_CHANGES.md` — append newest-first after any change
- `OUTSTANDING_ITEMS.md` — todos and known bugs

## Known pending client items

- Real project photography (currently using placeholder/AI-generated)
- Resend API key for contact form
- Google Business Profile link
- Domain confirmation (828constructions.com)
- Favicon set verification in `app/layout.tsx`
