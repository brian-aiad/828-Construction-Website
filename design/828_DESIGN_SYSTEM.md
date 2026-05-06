# 828 Construction — Design System
> Reverse-engineered from the completed homepage. Canonical reference for all page work.
> Last updated: 2026-05-06 (V2 — maroon accent, motion vocabulary from Joseph's iteration call)

---

## 1. Palette

Zero navy, blue, slate, or purple anywhere in the codebase.

### V2 Accent System (May 2026)

**Primary accent: Maroon** — Joseph's explicit ask ("like a maroon, like a darker red... almost like that iPhone that's supposed to come out, just dark, dark red").
**Secondary/fallback: Copper** — retained per client approval ("I'm not necessarily offended by [copper]. If it stays, it's not that big of a deal.").

| Token | Hex | CSS var | Usage |
|---|---|---|---|
| `black` | `#000000` | — | Section backgrounds (Services, mobile menu) |
| `near-black` | `#0a0a0a` | — | Projects section bg, hero plate fallbacks |
| `dark` | `#111111` | — | Card backgrounds, image placeholders |
| `white` | `#ffffff` | — | Body bg, CTAs, headline text on dark |
| `maroon` | `#7B2D26` | `--color-accent` | **PRIMARY accent** — hairlines, hovers, scroll bar, form focus, active nav |
| `maroon-light` | `#9A3F38` | `--color-accent-light` | Maroon highlight variant |
| `maroon-dark` | `#5C1F1A` | `--color-accent-dark` | Maroon shadow variant |
| `copper` | `#B87333` | `--color-accent-fallback` / `--accent-copper` | Secondary/fallback — warm photo overlays, moments where maroon would clash |
| `copper-light` | `#D4A574` | `--accent-copper-light` | Copper highlight variant |
| `copper-dark` | `#8B5A2B` | `--accent-copper-dark` | Copper shadow variant |

**Rule:** Use `var(--color-accent)` for all new accent references. Use `var(--accent-copper)` only for explicit copper fallback moments.

### Accent budget: 80/10/10 (Joe's explicit ratio)
- 80% black/white composition
- ~10% gray ramp
- Under 10% maroon accent touches

Maroon appears as: 1–2px hairlines, hover bars, ghost number tint (opacity 0.08–0.12), seam lines (opacity 0.4–0.5), scroll progress bar, active nav underline, form focus ring, button outlines.

### Gray ramp (Tailwind)
Used for text on white backgrounds and subtle borders. Never drop below `text-gray-400` for body text (a11y).

| Class | Approx hex | Min use |
|---|---|---|
| `gray-400` | `#9ca3af` | Section labels, nav links |
| `gray-500` | `#6b7280` | Body copy on white (minimum accessible) |
| `gray-600` | `#4b5563` | Caption text (avoid for standalone text) |
| `gray-700` | `#374151` | Borders, dividers |
| `gray-900` | `#111827` | Footer dividers |

### White-alpha ramp (on dark backgrounds)
| Value | Usage |
|---|---|
| `white/60` | Tags, secondary text |
| `white/50` | Taglines, captions |
| `white/45` | Project category labels |
| `white/40` | Dimmed headline lines, hero service line |
| `white/35` | Location labels |
| `white/30` | Hero location bar, scroll indicator text |
| `white/20` | Dividers, seam borders |
| `white/15` | CTA underlines |

---

## 2. Typography

### Font families
| Tailwind class | Variable | Google Font | Role |
|---|---|---|---|
| `font-display` | `--font-space-grotesk` | Space Grotesk | All headings (h1–h3), section headlines |
| `font-numbers` | `--font-ibm-plex-mono` | IBM Plex Mono | Ghost numbers, phone numbers, counters, stats |
| `font-labels` | `--font-space-mono` | Space Mono | All labels, nav, CTAs, tags, captions |
| `font-body` | `--font-inter` | Inter | Body paragraphs, descriptions |

### V2 Typography Hierarchy (May 2026)

**Bold display font reservation rule:** `font-display font-bold` is reserved EXCLUSIVELY for:
1. The "828 Construction" wordmark (header + splash)
2. Main hero anchor headlines (the primary h1 on each page)

Everything else uses lighter weights (`font-display font-normal`, `font-display font-light`, or body font).

Joe's exact words: "I only want the business logo, I guess we can say, in that bold font. Everything else is gonna be kind of in a more slimmed down font."

### Headline type scale
All display headlines use `font-display font-bold tracking-tight` for hero-level only. Sub-headings and section heads use `font-display font-normal` or `font-display` at reduced weight.

| Context | clamp() value | Approx px at 1440w |
|---|---|---|
| Hero h1 (jumbo) | `clamp(5rem, 13vw, 13rem)` | ~187px |
| Hero h2 (section 2) | `clamp(3.2rem, 8vw, 8rem)` | ~115px |
| Section headline (lg) | `clamp(2.8rem, 5.5vw, 4.5rem)` | ~79px |
| Section headline (md) | `clamp(2.4rem, 5vw, 4rem)` | ~72px |
| Service heading | `clamp(2.4rem, 4vw, 3.8rem)` | ~55px |
| Card heading | `clamp(1.3rem, 2.8vw, 2.4rem)` | ~35px |
| Wide card heading | `clamp(1.2rem, 2.5vw, 2rem)` | ~29px |

### Leading
- Jumbo headlines: `leading-[0.88]` or `leading-[0.9]`
- Service headings: `leading-[0.95]`
- Body copy: `leading-relaxed`

### Label / metadata type
All labels: `font-labels uppercase tracking-[0.18em–0.28em] text-[9px–11px]`

| Size | Tracking | Usage |
|---|---|---|
| `text-[8px]` | `tracking-[0.3em]` | Scroll indicator, extreme small |
| `text-[9px]` | `tracking-[0.18em–0.22em]` | Project category labels, image captions |
| `text-[10px]` | `tracking-[0.18em–0.25em]` | Section eyebrows, nav links, hero labels |
| `text-[11px]` | `tracking-[0.18em]` | CTAs, footer links, tag buttons |

### Ghost numbers (decorative)
`font-numbers font-bold leading-none` — opacity `0.08–0.12`, color `#B87333`, `aria-hidden="true"`, font sizes `clamp(4rem–9rem)`.

---

## 3. Spacing & Layout

### Container
`max-w-7xl mx-auto px-6 lg:px-12` — used for all constrained sections.

### Section padding rhythm
| Context | Padding |
|---|---|
| Standard section | `py-24 lg:py-32` |
| Tight header within section | `pt-24 pb-8 lg:pt-32 lg:pb-10` |
| BuildingScience inner | `py-24 lg:py-36` |
| Header height | `h-18 lg:h-22` (4.5rem / 5.5rem) |

### Grid systems
| Pattern | Classes | Used in |
|---|---|---|
| 12-col editorial | `grid grid-cols-12 gap-16` | Footer desktop |
| Asymmetric 12-col | `grid grid-cols-1 md:grid-cols-12 gap-[2px] md:gap-[3px]` | Projects grid |
| 2-col content/image | `grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24` | BuildingScience |
| Full-bleed alternating rows | `flex flex-col md:flex-row` (reversed every other) | ServicesPreview |

### Image sizing conventions
- Parallax image wrapper: `absolute inset-x-0`, `top: "-7.5%"`, `height: "115%"` — gives 15% travel budget
- Featured project card: `clamp(240px, 42vw, 570px)`
- Secondary project cards: `clamp(200px, 20.5vw, 282px)`
- Wide bottom card: `clamp(180px, 22vw, 295px)`
- Service rows: `minHeight: "clamp(320px, 55vw, 700px)"`

---

## 4. Animation Catalog

### Gate: `AnimationController.shouldAnimate()`
Returns `false` if `window.innerWidth < 768` OR `prefers-reduced-motion: reduce`. All GSAP scroll animations are gated behind this check. Hero animations (Framer Motion) run unconditionally since the hero is above the fold.

### Pattern A: Reveal-up (fade + y offset)
Simple entrance for text elements.
```js
gsap.fromTo(el,
  { y: 24, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.65, ease: "power3.out",
    scrollTrigger: { trigger, start: "top 82%", once: true } }
)
// stagger version: stagger: 0.08–0.1
```

### Pattern B: Clip-path punch-in (Olson Kundig)
Cards and image panels enter by collapsing inset.
```js
// Card punch-in (Projects grid):
gsap.fromTo(cards,
  { clipPath: "inset(8% 8% 8% 8%)", opacity: 0 },
  { clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
    duration: 1.05, stagger: { each: 0.12, from: "start" }, ease: "power3.out",
    scrollTrigger: { trigger: gridRef.current, start: "top 82%", once: true } }
)

// Service image panel (directional):
// imageLeft → from: "inset(0% 100% 0% 0%)"  (left-to-right reveal)
// imageRight → from: "inset(0% 0% 0% 100%)" (right-to-left reveal)
gsap.fromTo(imagePaneRef.current, { clipPath: clipFrom },
  { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power3.inOut",
    scrollTrigger: { trigger, start: "top 68%", once: true } }
)
```

### Pattern C: Headline clip-reveal (line-by-line)
Text lines masked in overflow-hidden parent, GSAP moves yPercent.
```js
gsap.fromTo(line, { yPercent: 110 },
  { yPercent: 0, duration: 0.7–0.85, ease: "power3.out",
    scrollTrigger: { trigger, start: "top 78%", once: true } }
)
// stagger for multiple lines: stagger: 0.08–0.1
```

### Pattern D: Copper hairline scaleX
Horizontal lines grow from left.
```js
gsap.fromTo(hairlineRef.current, { scaleX: 0 },
  { scaleX: 1, duration: 0.85–0.9, ease: "power2.inOut",
    transformOrigin: "left",
    scrollTrigger: { trigger, start: "top 82–88%", once: true } }
)
```

### Pattern E: Copper seam scaleY
Vertical seam lines grow from top.
```js
gsap.fromTo(seamRef.current, { scaleY: 0 },
  { scaleY: 1, duration: 0.9, delay: 0.45, ease: "power2.inOut",
    transformOrigin: "top",
    scrollTrigger: { trigger, start: "top 68%", once: true } }
)
```

### Pattern F: Parallax scrub
Image inner travels -12% yPercent over full scroll range.
```js
gsap.to(imgWrap, {
  yPercent: -12, ease: "none",
  scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true }
})
```

### Pattern G: Pin-progression (BuildingScience)
Sticky panel with scroll-driven state machine.
```js
gsap.timeline({
  scrollTrigger: {
    trigger: wrapperRef.current,
    pin: stickyRef.current,
    start: "top top",
    end: "+=" + window.innerHeight * 1.8,
    scrub: 0.8,
    pinSpacing: false,   // CRITICAL: prevents spacer div insertion
    onUpdate: (self) => {
      if (self.progress < 0.38) setActive(0);
      else if (self.progress < 0.72) setActive(1);
      else setActive(2);
    }
  }
})
// Wrapper must have explicit minHeight: "280vh" (100vh content + 180vh travel)
```

### Pattern H: Hero (Framer Motion)
Character-by-character reveal — runs on mount, no scroll trigger.
```tsx
// Line 1: plain <span> — NO animation. LCP fires immediately.
// Line 2: per-character
initial={{ y: "110%", opacity: 0 }}
animate={{ y: "0%", opacity: 1 }}
transition={{ duration: 0.75, delay: 0.36 + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
// Wrap in role="img" aria-label="Intent." with aria-hidden="true" on each char
```

### Pattern I: Hero GSAP scrub (parallax + crossfade)
```js
// Background parallax:
gsap.to(bgRef.current, { yPercent: 22, ease: "none",
  scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: 1 } })

// Section 1 content fade-out:
gsap.to(content1Ref.current, { opacity: 0, y: -60, ease: "none",
  scrollTrigger: { trigger, start: "top top", end: "33% top", scrub: 1 } })

// Section 2 content fade-in:
gsap.fromTo(content2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0,
  ease: "none", scrollTrigger: { trigger, start: "28% top", end: "62% top", scrub: 1 } })
```

### Pattern J: Hover state — copper bar
Project cards: `copper-bar` div, `transform: scaleX(0)` → `scaleX(1)` on mouseenter.
```js
card.addEventListener("mouseenter", () => {
  gsap.to(img, { filter: "contrast(1.1) saturate(1.3)", scale: 1.03, duration: 0.45, ease: "power2.out" });
  gsap.to(copperBar, { scaleX: 1, duration: 0.3, ease: "power2.out" });
});
card.addEventListener("mouseleave", () => {
  gsap.to(img, { filter: "contrast(1.06) saturate(1.1)", scale: 1, duration: 0.45, ease: "power2.out" });
  gsap.to(copperBar, { scaleX: 0, duration: 0.3, ease: "power2.in" });
});
```

### Standard ease
```ts
// lib/animations.ts
export const ease = {
  out: [0.16, 1, 0.3, 1]  // custom bezier — used in Framer Motion transitions
}
```
GSAP uses named eases: `"power3.out"`, `"power3.inOut"`, `"power2.inOut"`, `"power2.out"`, `"power2.in"`, `"none"`.

---

## 5. Section Structure Language

Every section follows this editorial grammar:

```
[Section eyebrow label]       ← font-labels 10px text-gray-400 tracking-[0.22em] uppercase
[Main headline]               ← font-display font-bold tracking-tight leading-[0.9]
[Copper hairline or seam]     ← 1px #B87333, opacity 0.45–0.5, scaleX 0→1 on scroll
[Content blocks]              ← images / cards / pillars
[Section CTA / "All X" link]  ← font-labels 11px uppercase with → arrow
```

### Section transitions
- Dark-on-dark: Projects (`#0a0a0a`) → BuildingScience (`#fff`) — abrupt hard cut via bg change
- Dark-on-dark: Hero → Services → Projects all black backgrounds, no dividers needed
- Light-to-dark: BuildingScience (white) → HomeCTA (black) — copper line at top of dark section
- Copper top accent line on sections that start a dark segment after a light one

### Section ordering (homepage)
1. Hero (black, 200vh) — `data-section="hero"`
2. ServicesPreview (black) — `data-section="services"`
3. ProjectsPreview (`#0a0a0a`) — `data-section="projects"`
4. BuildingScience (white, 280vh sticky) — `data-section="building-science"`
5. HomeCTA (black) — no data-section
6. Footer (black)

---

## 6. Mobile Adaptation Rules

- `AnimationController.shouldAnimate()` returns false below 768px — all GSAP scroll animations skip
- Pin-progression sections (BuildingScience) use simple stagger reveal on mobile instead
- ServicesPreview: alternating image/text rows stack vertically (image always on top)
- ProjectsPreview: `grid-cols-1` on mobile, `md:grid-cols-12` on desktop
- Footer: separate `lg:hidden` mobile layout with large phone number as CTA anchor
- Hero: same markup, hero text shrinks via clamp() — `clamp(5rem, 13vw, 13rem)` reads ~80px at 390px
- Header: hamburger menu at `<lg`, full nav at `lg+`
- Container padding: `px-6 lg:px-12` throughout

---

## 7. Component Primitives Inventory

### Buttons
| Pattern | Classes | Usage |
|---|---|---|
| Primary CTA | `btn-shine btn-lift bg-white text-black px-8 py-3.5 font-labels text-[10px] tracking-[0.18em] uppercase` | Hero, section CTAs |
| Ghost/phone | `border border-white/30 text-white px-8 py-3.5 font-labels text-[10px] tracking-[0.18em] uppercase font-numbers` | Phone CTA next to primary |
| Text link with arrow | `font-labels text-[11px] text-gray-400 tracking-[0.18em] uppercase hover:text-[#B87333] border-b border-transparent hover:border-[#B87333]` | "All Projects", "All Services" |
| Section body link | `font-labels text-[11px] text-black tracking-[0.18em] uppercase border-b border-gray-300 hover:border-[#B87333] hover:text-[#B87333]` | "About 828 Construction" |
| Footer CTA | `bg-white text-black px-6 py-3 font-labels text-[10px] tracking-[0.18em] uppercase hover:bg-[#B87333] hover:text-white` | Footer get estimate |
| Service CTA | `group inline-flex items-center gap-3 font-labels text-[11px] text-white/50 tracking-[0.18em] uppercase border-b border-white/15 hover:text-[#B87333] hover:border-[#B87333]` | Learn more per service |

All CTAs with an arrow: `<span className="transition-transform duration-200 group-hover:translate-x-1">→</span>`

### `btn-shine` (CSS)
Pseudo-element shine sweep on hover: left: -100% → 160%, transition 0.55s cubic-bezier(0.16,1,0.3,1).

### `btn-lift` (CSS)
translateY(-2px) + box-shadow on hover, 0.25s cubic-bezier(0.16,1,0.3,1).

### Cards
| Pattern | Usage |
|---|---|
| Project card | `proj-card relative overflow-hidden` + `parallax-img-inner` + `copper-bar` |
| Service card | Full-bleed alternating row, `service-card-border-wrap` CSS class for 4-side border animation |
| Pillar row | `grid grid-cols-[4.5rem_1fr] gap-6`, number + body, `pillar-accent` copper bar |

### Dividers
| Type | Style |
|---|---|
| Copper hairline (section) | `height: 1, background: "#B87333", opacity: 0.45–0.5` |
| Copper hairline (inter-row) | `height: 1, background: "rgba(184,115,51,0.18–0.20)"` |
| White section divider | `border-b border-gray-100` or `border-white/5` |

### ImageWithFallback
```tsx
<ImageWithFallback
  src={path}
  alt={alt}
  fill
  priority?
  className="object-cover"
  style={{ filter: "contrast(1.06) saturate(1.1)" }}
  sizes="(max-width: 768px) 100vw, 66vw"
  fallback={<div className="absolute inset-0 bg-[#1a1a1a]" />}
/>
```
Always include `sizes` prop. Always include a `fallback` — dark plate or gray bg depending on section.

### Image filter standard
- Default: `contrast(1.06) saturate(1.1)`
- Secondary: `contrast(1.05) saturate(1.08)`
- Hero bg: `contrast(1.04) saturate(1.1) brightness(1.0)`
- Hover add: `contrast(1.1) saturate(1.3)`

---

## 8. CSS Utilities (globals.css)

| Class | Purpose |
|---|---|
| `.grain-overlay` | Fixed noise texture, z-999, opacity 0.028 |
| `.blueprint-grid` | White grid lines on dark bg, 64px major + 16px minor |
| `.blueprint-grid-light` | Black grid lines on light bg, 64px |
| `.plate-concrete` | Dark gradient placeholder for missing images |
| `.plate-steel` | Darker gradient placeholder |
| `.clip-diagonal` | `polygon(0 0, 100% 0, 100% 92%, 0 100%)` diagonal bottom edge |
| `.link-underline` | Width-0→100% underline on hover via ::after |
| `#scroll-progress` | Copper scroll progress bar, fixed top, scaleX 0→1 |
| `.text-copper` | `color: #B87333` |
| `.border-copper` | `border-color: #B87333` |
| `.btn-shine` | Shine sweep pseudo-element |
| `.btn-outline-hover` | Subtle fill on hover |
| `.btn-lift` | translateY(-2px) on hover |
| `.btn-magnetic` | will-change: transform for magnetic button |
| `.img-card-hover img` | scale(1.05) on parent hover |
| `.copper-glow:hover` | box-shadow copper ambient glow |
| `.service-card-border-wrap` | 4-side animated copper border on hover |
| `.skip-link` | A11y skip to main content link |

---

## 9. Global Providers & Layout Shell

```
RootLayout
├── <a class="skip-link"> (a11y)
├── <div class="grain-overlay" aria-hidden> (fixed noise)
├── ScrollProgress (copper bar, z-1000)
├── CustomCursor (desktop only via CSS pointer:fine)
└── LenisProvider (smooth scroll)
    ├── Header (fixed, z-50, hide-on-scroll-down behavior)
    ├── <main id="main-content"> (flex-1)
    └── Footer
```

### Header behaviors
- Transparent on home hero, `bg-black/90 backdrop-blur-xl` everywhere else
- Scrolled past 32px: always `bg-black/90 backdrop-blur-xl`
- Hidden on scroll down > 300px, revealed on scroll up
- Mobile: hamburger → fullscreen `bg-black` overlay with `font-display font-bold text-3xl` nav links

### V2 Header Rules (May 2026)
- **Wordmark:** "828 Construction" on ONE LINE, left side. Bold. Never stacked to two lines.
- **Location + timestamp:** RIGHT corner (was left — this is a change from V1).
- **CTA:** Single "BOOK CALL" button. On click/hover: asterisk dropdown reveals `(213) 828-2388`.
- Transparent → black on scroll: KEEP. Joe explicitly approved.

---

## 10. Accessibility Standards

- Lighthouse Accessibility target: ≥95
- All ghost/decorative numbers: `aria-hidden="true"`
- Character-by-character animated text: parent `role="img" aria-label="[text]"`, each char `aria-hidden="true"`
- Images: descriptive alt text always, never empty for meaningful images
- Text contrast: minimum `text-gray-400` on white (5.74:1), minimum `text-white/60` on black (7.4:1)
- `@media (prefers-reduced-motion: reduce)` in globals.css kills all animations
- Skip link in layout shell
- `aria-label="Toggle menu"` on hamburger button
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<address>`

---

## 11. Image Infrastructure

```
public/images/
├── hero/          hero-night.png, patio-pool.jpg
├── logo/          828logo_trans.png
├── projects/      bathroom-*, outdoor-*, remediation-*, consulting-*, adu-*, etc.
├── services/      service-adu.jpg (can symlink from projects)
├── about/         building-science.jpg, tools.jpg, contract.jpg
├── contact/       contact-hero.jpg
└── process/       process-*.jpg
```

All project images: `object-cover`, inside 115%-tall parallax wrapper.

---

## 12. V2 Motion Vocabulary (May 2026)

Derived from the four YouTube reference videos Joseph sent. These expand the existing animation catalog — they don't replace it.

### From Nicolai Palmkvist — GSAP scroll-trigger (video on scroll)
- Scroll-scrubbed image sequences / video elements for hero or featured project sections.
- Reserve this technique for once real photos arrive. Placeholder: standard parallax scrub.

### From Nicolai Palmkvist — Apple-style redesign
- Sell the feeling, identity, and transformation BEFORE pushing to a product/service page.
- Hero copy and About page story should land the brand before any CTA appears.
- "Spacing and restraint" — negative space is intentional, not a gap to fill.

### From Self-Made Web Designer — 6 Tips
1. **Anchor headline font** — one statement font for the brand wordmark + hero; contrasting lighter font everywhere else (already locked per V2 typography rule).
2. **"Star of the show" element** — tie a signature visual motif to the brand story (e.g., the "828" ghost watermark, the copper/maroon hairline).
3. **Visual rhyming** — repeat shapes/motifs across pages to build coherence (e.g., the horizontal hairline rule, the ghost number treatment).
4. **Subtle depth via texture/noise** — glass-morphism, noise overlay, layered shadows. Site must NOT feel flat. Use `.grain-overlay` (already global) + section-level glass treatment on dark panels.
5. **Hierarchy through opacity** — not just size. Use `white/60`, `white/40`, `white/20` progression to guide eye without hierarchy requiring bold text.
6. **Push past first idea** — always test a radical variation before shipping. The first layout is the expected layout.

### From Create a Pro Website — premium
- Gradient backgrounds with depth (not flat black/white cuts).
- Generous whitespace / breathing room between sections.
- Color cohesion — every element traces to the palette.
- Motion on scroll that rewards curiosity: elements should reveal as the user explores.

### Concrete V2 additions (site-wide)
| Pattern | Description | Pages |
|---|---|---|
| **Rolling marquee** | Horizontal text strip, pause on hover, 60s duration, gap 4rem | Footer top, About area names, possibly portfolio tags |
| **Asterisk/plus dropdown** | Expand/collapse reveal — FAQ answers, "Book Call" phone reveal | Header, ADU/Remediation/Consulting FAQ sections |
| **Glass/blur depth** | `backdrop-blur-md` + `bg-white/5` on dark overlapping panels | Hero overlays, Contact split sections |
| **Asymmetric hero split** | Photo ~55-60% one side, copy ~40-45% other side with negative space | Home hero, Contact hero, story sections |
| **Mixed-size grid** | Non-uniform card sizing (1 large + 2-3 smaller) | Portfolio gallery, About area photos |

---

## 13. Anti-patterns (What NOT to Do)

- No navy, blue, slate, or cool tones anywhere
- No font-family mixing within a single element
- No serif fonts — all four families are sans/mono
- No colored backgrounds other than black (#000, #0a0a0a, #111) or white (#fff)
- No border-radius on major structural elements (cards, image frames, buttons) — everything is sharp 90°
- No box shadows on dark sections (use copper lines / seams instead)
- No `pinSpacing: true` (default) when pinning child elements — always `pinSpacing: false` + explicit wrapper minHeight
- No animation on the LCP element — it must be visible on first paint
- Do not use `text-gray-600` or below for standalone text on white backgrounds (contrast failure)
- Do not use `rgba(255,255,255,0.28)` or lower for text on dark backgrounds (contrast failure)
