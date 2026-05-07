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

### Standing rules
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
| Home (`/`) | V2.5 homepage remodel handoff in `docs/828_HOME_REMODEL_HANDOFF.md`. Route now renders HeroV2 + ServicesPreviewV2 + new HomeVisionSequence + AboutPreview + HomeCTA. Hero copy changed to `Built with intent. Not by accident.` with active-listening glass card and CA license badge. New HomeVisionSequence adds Joseph-note language: first step is listening, one conversation begins the build, build your vision, dedicated to your dream, build philosophy/process cards, rolling marquee, blueprint/level silhouettes, pinned horizontal process track. HomeCTA restored and cleaned to 2004/maroon/conversation-first copy. Verify locally on `http://localhost:3028`; port 3000 may be another app. | 2026-05-07 |
| About (`/about`) | V2 + V2.5 elevation — 6 sections: hero + story + 3 principles (ConstructionLine backdrop) + CRAFT acronym (glass cards, watermark drift) + South Bay 2-layer parallax marquee + CTA. Compass silhouette in story margin. V1 timeline/how-we-think deleted. | 2026-05-06 |
| Services (`/services`) | V2 + V2.5 elevation — asymmetric 3-tile gateway, 3D tilt (useTilt 10deg), maroon ghost shadow, ConstructionLine silhouette backdrop, magnetic CTAs. | 2026-05-06 |
| Services/ADU (`/services/adu`) | V2 + V2.5 elevation — visual hero (ArchOutline silhouette 0.55), Need+FAQ glass cards, 5-step process, ADU acronym glass definitions, Start Here BOOK CALL. | 2026-05-06 |
| Services/Remediation (`/services/remediation`) | V2 + V2.5 elevation — visual hero (ConstructionLine silhouette), Need+FAQ glass, 4-step process, Why 828, equipment placeholder TODO. | 2026-05-06 |
| Services/Consulting (`/services/consulting`) | V2 + V2.5 elevation — visual hero (BlueprintCorner silhouette), 5 benefits, 3 Q&A, CTA. | 2026-05-06 |
| Process (`/process`) | DELETED — 308 redirect to /portfolio | 2026-05-06 |
| Contact (`/contact`) | ON HOLD — form infrastructure (email/DNS/Resend) pending Joe | — |
| Portfolio (`/portfolio`) | V2 + V2.5 elevation — renamed from /projects, 14-photo gallery, cinema row, 5-step process, compass silhouette CTA. Real photos pending Joe mid-May. | 2026-05-06 |
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
