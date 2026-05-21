# PROJECT-MAP — 828 Construction Website
_Run `/update-map` to regenerate._
_Last generated: 2026-04-21_

---

## Routes

| Route | Page File | Content Component | Perf | A11y | Status |
|-------|-----------|-------------------|------|------|--------|
| `/` | `app/page.tsx` | `components/home/*` | 99 | 100 | revamped v2 |
| `/about` | `app/about/page.tsx` | `components/about/AboutContent.tsx` | 100 | 96 | revamped v2 |
| `/services` | `app/services/page.tsx` | `components/services/ServicesContent.tsx` | 98 | 96 | revamped v4 |
| `/services/adu` | `app/services/[slug]/page.tsx` | `components/services/ServiceDetailContent.tsx` | 87 | 96 | master audit |
| `/services/remediation` | `app/services/[slug]/page.tsx` | `components/services/ServiceDetailContent.tsx` | 87 | 96 | master audit |
| `/services/consulting` | `app/services/[slug]/page.tsx` | `components/services/ServiceDetailContent.tsx` | 87 | 96 | master audit |
| `/portfolio` | `app/portfolio/page.tsx` | `components/portfolio/PortfolioContent.tsx` | pass | pass | production QA |
| `/process` | `app/process/page.tsx` | redirects to `/portfolio` | pass | pass | legacy redirect |
| `/projects` | `app/projects/page.tsx` | redirects to `/portfolio` | pass | pass | legacy redirect |
| `/contact` | `app/contact/page.tsx` | `components/contact/ContactContent.tsx` | 86 | 96 | master audit |

---

## Home Page Sections (9 components)

| Component | Role |
|-----------|------|
| `components/home/HeroSections.tsx` | 200vh sticky hero with two-state scroll (primary) |
| `components/home/Hero.tsx` | **UNUSED** — do not import |
| `components/home/HomeInterstitial.tsx` | Editorial full-bleed section with dual-layer scrub counter |
| `components/home/BuildingScience.tsx` | Dual-image pin section |
| `components/home/ServicesPreview.tsx` | Alternating image+text rows for 3 service types |
| `components/home/ProjectsPreview.tsx` | Asymmetric 12-col project grid with parallax |
| `components/home/ProcessPreview.tsx` | Brief process teaser |
| `components/home/HomeCTA.tsx` | Bottom CTA with background image |
| `components/animations/NumberCounter.tsx` | Reusable scrub counter (used on home + contact) |

---

## Shared Layout (affects ALL pages — edit carefully)

| Component | Risk | Notes |
|-----------|------|-------|
| `components/providers/LenisProvider.tsx` | **CRITICAL** | Contains Fix 16 guards. Touch = potential full-site break |
| `components/layout/Header.tsx` | High | Navigation on every page |
| `components/layout/Footer.tsx` | Medium | Bottom of every page |
| `components/layout/ScrollProgress.tsx` | Low | Copper progress bar |
| `components/layout/SectionDivider.tsx` | Low | Thin decorative separator |
| `components/ui/ImageWithFallback.tsx` | Medium | Used in ProjectsPreview, HomeCTA |
| `components/ui/CustomCursor.tsx` | Low | Desktop cursor |
| `components/ui/MagneticButton.tsx` | Low | Hover effect helper |
| `components/shared/GoogleAnalytics.tsx` | Low | GA4 |
| `components/shared/JsonLd.tsx` | Low | SEO structured data |
| `components/animations/FadeIn.tsx` | Low | Scroll-triggered fade wrapper |

---

## Image Assets

### `/images/about/` (6 files)
```
about-hero.jpg        craftsmanship.jpg     tools.jpg
building-science.jpg  materials.jpg         contract.jpg
```

### `/images/contact/` (2 files)
```
contact-hero.jpg      map-detail.jpg
```

### `/images/hero/` (3 files)
```
hero-night.png        patio-pool.jpg        cta-background.jpg
```
> ⚠️ `hero-night.jpg` does NOT exist — only `.png`. `Hero.tsx` references the `.jpg` but that component is unused.

### `/images/logo/` (3 files)
```
828logo_trans.png     828-logo.png          828-logo-full.png
```

### `/images/process/` (7 files)
```
planning.jpg          execution.jpg         completion.jpg
scope-document.jpg    detail.jpg            quality-check.jpg
final-detail.jpg
```
> `detail.jpg` and `quality-check.jpg` exist on disk but are not referenced in any component.

### `/images/projects/` (31 files)
```
adu-construction.jpg        adu-exterior.jpg            adu-exterior-new.jpg
adu-framing.jpg             adu-interior.jpg            adu-interior-living.jpg
bathroom-geometric.jpg      bathroom-herringbone.jpg    bathroom-led.jpg
bathroom-shower.jpg         bathroom-warm.jpg           consulting-blueprints.jpg
consulting-crawlspace.jpg   consulting-inspection.jpg   consulting-plans.jpg
exterior-stucco.jpg         foundation-concrete.jpg     garage-conversion.jpg
kitchen-dark.jpg            niche-detail.jpg            outdoor-living-editorial.jpg
outdoor-patio-pergola.jpg   remediation-active.jpg      remediation-after.jpg
remediation-damage.jpg      remediation-mold.jpg        remediation-restored.jpg
remediation-work.jpg        service-adu.jpg             shower-black-fixtures.jpg
waterproofing-membrane.jpg
```

### `/images/services/` (7 files)
```
services-hero.jpg     adu-permit.jpg        adu-detail.jpg
remediation-before.jpg remediation-detail.jpg consulting-report.jpg
consulting-detail.jpg
```
> `adu-detail.jpg` and `remediation-detail.jpg` and `consulting-detail.jpg` exist on disk but are not referenced in any component (available for future use).

---

## Known Gaps (image path mismatches)

| Referenced in code | On disk | Status |
|-------------------|---------|--------|
| `/images/hero/hero-night.jpg` (Hero.tsx) | `/images/hero/hero-night.png` | Safe — `Hero.tsx` is unused |
| `/images/hero/hero-1.jpg` (ServiceDetailContent fallback) | Does not exist | Safe — fallback is never reached for valid slugs |

---

## Scripts & Research

### Preflight (cross-site regression gate)
```
.claude-work/scripts/preflight.mjs     — runs all 9 routes at desktop+mobile, pre-push gate
```

### Per-page QA (deep audits)
```
.claude-work/research/about-fixes/functional-qa.mjs
.claude-work/research/contact/functional-qa.mjs
.claude-work/research/home/functional-qa.mjs
.claude-work/research/home-fixes/functional-qa.mjs
.claude-work/research/process/functional-qa.mjs
```

### Preflight reports (generated at runtime)
```
.claude-work/preflight/YYYY-MM-DD-HH-MM/report.json
.claude-work/preflight/YYYY-MM-DD-HH-MM/screenshots/*.png
```

---

## Skills (global)

| Skill | Path | When to invoke |
|-------|------|----------------|
| `828-construction-methodology` | `~/.claude/skills/828-construction-methodology/SKILL.md` | Any page redesign/fix/revamp |
| `828-preflight` | `~/.claude/skills/828-preflight/SKILL.md` | Before push, after shared component edits |
| `ux-architecture-methodology` | `~/.claude/skills/ux-architecture-methodology/SKILL.md` | New pages, structure/flow questions |

---

## npm Scripts

```bash
npm run dev              # next dev on :3001 (Turbopack)
npm run build            # next build
npm run start            # next start (pass -p 4001/4028 for production QA)
npm run preflight        # fast check (server must be on :4001)
npm run preflight:full   # build + full check (pre-push)
npm run preflight:desktop # desktop only (fast)
npm run preflight:mobile  # mobile only (fast)
```

---

## Pre-push hook

`.git/hooks/pre-push` — runs `npm run preflight:full` automatically.
Override: `git push --no-verify` (document reason in commit message).

---

## Design System References

| File | Contents |
|------|----------|
| `design/828_DESIGN_SYSTEM.md` | Palette, typography, animation catalog, component primitives |
| `design/PATTERNS.md` | 16 known bugs + fixes (read before any animation work) |

<!-- preflight hook test 2026-04-21 -->
