# 828 Construction — Project Rules

This file is read by Claude Code automatically at the start of every session in
this project. It contains non-negotiable rules. If anything here conflicts with
skill instructions, this file wins.

## Read these before any code change

1. `design/828_DESIGN_SYSTEM.md` — palette, type, animation catalog, component primitives
2. `design/PATTERNS.md` — Known Fixes section (16 solved bugs; use these, do not re-solve)
3. `~/.claude/skills/828-construction-methodology/SKILL.md` — the v3 autonomous build protocol
4. `~/.claude/skills/ux-architecture-methodology/SKILL.md` — UX architecture protocol (runs before motion skill on new pages; audit layer on existing pages)
5. `~/.claude/skills/828-preflight/SKILL.md` — pre-push test gate (run before declaring any page done)
6. `PROJECT-MAP.md` — exact file locations for every route, component, and image asset

## Quality bar

Any page being redesigned must reach parity with the About page
(`components/about/AboutContent.tsx`). That is the reference. Do not ship less.

## Forbidden patterns

- Navy, blue, or slate-reading-as-blue tones. Palette is black / white / gray ramp / `#B87333` copper only.
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
| Home (`/`) | cinematic upgrade — Perf=99, A11y=96, SplashScreen (828+CONSTRUCTION GSAP stagger + copper underline + sessionStorage skip), second HomeMarquee reversed 60s, FooterRevealWrapper opacity scrub reveal, live Torrance time in header, copper cursor trail, CustomCursor copper ring on image hover | 2026-04-24 |
| About (`/about`) | cinematic upgrade — Perf=99, A11y=96, founder profile block (portrait placeholder + signature + credentials row), pull quote section, horizontal editorial timeline, marquee strip, Ken Burns on ADU photo, sticky credentials on scroll, paragraph line reveals (SplitType lines) | 2026-04-24 |
| Services (`/services`) | v3 polish — Perf=99, A11y=96, service row GSAP hover (image brightness + scale), Pattern C headline reveal | 2026-04-23 |
| Services/ADU (`/services/adu`) | v4 revamp — Perf=99, A11y=96, qualifier + featured work + process snapshot + embedded form (service_type hidden field) + related services footer | 2026-04-24 |
| Services/Remediation (`/services/remediation`) | v4 revamp — Perf=98, A11y=96, same template as ADU — qualifier + featured work + process snapshot + embedded form + related services | 2026-04-24 |
| Services/Consulting (`/services/consulting`) | v4 revamp — Perf=99, A11y=96, same template as ADU — 1 featured project (consulting only), embedded form + related services | 2026-04-24 |
| Process (`/process`) | v3 polish — Perf=99, A11y=96, EditorialStandards row hover (number + body), scrub rule | 2026-04-23 |
| Contact (`/contact`) | v3 polish — Perf=99, A11y=96, vertical step connector line with copper gradient | 2026-04-23 |
| Projects (`/projects`) | v3 polish — Perf=99, A11y=96, filter tab copper hover hint | 2026-04-23 |

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
