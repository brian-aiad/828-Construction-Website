# Workstream 1 — Visual QA + Revamp

**Goal:** Thorough end-to-end visual audit of all 9 routes. Identify outdated sections, weak typography, poor spacing, and anything that falls short of the NS Builders editorial feel. Implement improvements. All pages richer, more cinematic, more premium.

## Audit scope

| Page | Key concerns to audit |
|------|-----------------------|
| Home `/` | HeroSections two-state, ServicesPreview rows, ProjectsPreview grid, BuildingScience pin, HomeCTA |
| About `/about` | Editorial timeline, founder block, pull quote, Ken Burns ADU photo |
| Services `/services` | ServiceChoiceCards clip-punch, ServicesContent alternating rows |
| Services/ADU | PinnedWhy copper border, process snapshot, embedded form |
| Services/Remediation | Same template as ADU |
| Services/Consulting | Same template |
| Process `/process` | Pinned phase timeline, EditorialStandards rows |
| Projects `/projects` | Filter tabs, ProjectsHighlights editorial spread, gallery grid |
| Contact `/contact` | Hero, form styling, ContactTrust section |

## Visual quality checklist per page

- [ ] All section eyebrows: `font-labels text-[10px] tracking-[0.22em] uppercase text-gray-400`
- [ ] All headlines: `font-display font-bold tracking-tight` with correct clamp() size
- [ ] Copper hairlines present at section transitions (dark → light, major section starts)
- [ ] No dead zones: every 100vh scroll has visual movement
- [ ] Scrub:event ratio ≥ 2:1 per page
- [ ] Ghost numbers present on sections with stats/counts (opacity 0.08–0.12, copper tint)
- [ ] Images: contrast(1.06) saturate(1.1) filter applied
- [ ] Body text minimum text-gray-400 on dark / text-gray-500 on white

## Specific improvements identified

### Contact form section (ContactMain)
- Form is on white background with basic gray styling
- Needs redesign to match design system (handled in Workstream 4)
- "Start the conversation." headline could use SplitType char reveal

### Footer
- Mobile layout needs gap-y improvement (Workstream 2)
- Desktop: add service area cities in footer (currently only 5 of 8 shown — show all 8)

### Global
- Review `lib/constants.ts` — "20+ years" text still used in footer (should be 25+)
- EST date discrepancy check

## Success criteria

- Every page: at least one new visual improvement or stronger motion moment
- All Lighthouse: Perf ≥85, A11y ≥95
- All 9 routes pass `npm run preflight:full`
