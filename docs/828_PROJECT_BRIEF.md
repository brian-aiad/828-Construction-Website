# 828 Construction Website - Project Brief

## Product

This is the production website for 828 Construction, a licensed residential
construction company based in Torrance and serving the South Bay. The site is
designed to establish trust, demonstrate building-science expertise, show real
project work, and convert qualified homeowners into phone calls and project
inquiries.

The experience should feel precise, quiet, premium, and field-built. It should
not read like a generic contractor template or a marketing landing page.

## Business Context

- Business: 828 Construction
- Base: Torrance, California
- License: CA #1141119
- Phone: 213-828-2388
- Experience: in the field since 2004; do not describe 2004 as the company's
  founding or establishment date
- Primary service area: Torrance and South Bay communities
- Core services: ADU Construction, Remediation, and Construction Consulting

## Audience And Conversion Goals

Primary visitors are homeowners and property owners evaluating substantial
residential work. Many will first visit on a phone. The site must quickly answer:

- Is this contractor credible and experienced?
- Does the company understand complex or high-risk work?
- Does the visual quality match the standard of the proposed project?
- Can I see relevant completed work?
- How do I call or submit enough information for a useful follow-up?

Phone calls and the contact form are the primary conversion paths. The form
sends a branded owner notification and, when the visitor provides an email, a
branded customer acknowledgment.

## Information Architecture

- `/` - Home: positioning, services, process, philosophy, company preview, and
  project preview
- `/about` - About: builder profile, origin, standards, craft, South Bay context,
  and closing invitation
- `/services` - Services overview and the 828 standard/process
- `/services/adu` - ADU construction scope, questions, process, and invitation
- `/services/remediation` - diagnosis, containment, remediation/restoration,
  process, method, and response path
- `/services/consulting` - advisory services, decisions, field review, and
  consultation path
- `/portfolio` - selected Cerritos, El Sereno, and Tustin project narratives,
  image compositions, and inspection viewer
- `/contact` - contact hero, phone/email actions, project form, preparation
  guidance, service paths, and service area

Visible copy, section order, and approved project structure are controlled
content. Do not rewrite, reorder, or flatten them during visual or motion work.

## Visual System

The design language is based on architectural drawings and construction field
documentation: measured spacing, thin rules, ledgers, index numbers, grid lines,
material photography, a left-side progress rail, and diamond junction markers.

Core palette:

- Ink black: `#050505` / `#080808`
- Paper and warm white: `#F4F1ED`, `#F7F7F3`, and white
- Primary maroon accent: `#631A16`
- Accent light: `#872720`
- Accent dark: `#3F0F0C`
- Supporting text uses restrained neutral grays and translucent black/white

Typography:

- Inter: display and body typography
- Space Mono: uppercase labels and technical annotations
- IBM Plex Mono: numbers, indexes, and measurements
- Letter spacing is intentional on compact uppercase labels; primary display
  text remains clean and untracked

Photography must show real construction conditions, completed residential work,
materials, plans, or credible project environments. Images should remain clear
enough to inspect and should not function as vague decorative stock imagery.

## Motion And Responsive Behavior

Motion is part of the product identity, but it must support reading and never
strand or obscure content.

- Desktop uses Lenis and GSAP for smooth scrolling, stacked sticky section-cover
  transitions, selected pinned progressions, parallax, rail progress, and
  directional content entrances.
- Mobile and tablet keep natural, stable scrolling with selective sticky cover
  moments and restrained observer-based entrances.
- The shared section reveal controller owns general directional entrances.
  Route-specific GSAP should be used only for compositions that need custom
  sequencing or scroll-linked behavior.
- Fast forward/reverse scrolling must always resolve content to its visible
  state. No image or text may remain hidden because an observer was skipped.
- `prefers-reduced-motion` must remove scroll choreography and leave every piece
  of content visible and usable.
- Compact transition bands use the shared compact-surface contract instead of
  being stretched to an empty full viewport.
- The header samples the active surface and transitions between translucent
  dark/light states without abrupt color snapping.

## Technical Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- GSAP 3 with ScrollTrigger
- Lenis smooth scrolling
- Framer Motion for selected UI transitions
- `next/image` with AVIF/WebP delivery and long image cache TTL
- Yet Another React Lightbox for the custom project inspection viewer
- Vercel Analytics and optional Google Analytics
- Resend HTTP API for contact email delivery

## Contact And Spam Protection

- The raw business Gmail address is not rendered in HTML, metadata, JSON-LD, or
  emitted JavaScript as a literal string.
- Visitors retain a keyboard-accessible `Email our team` action that resolves the
  address only after interaction.
- LocalBusiness structured data keeps the business name, phone, address, and
  service area; public email is not required for local SEO.
- The API enforces JSON requests, a 20 KB body limit, server-side field
  validation, sanitization, maximum lengths, a honeypot, per-IP throttling, and
  bounded rate-limit memory.
- Stable submission IDs become Resend idempotency keys so client retries do not
  create duplicate owner/customer emails.
- Customer input is escaped in HTML email templates and also sent as plain text.
- Owner lead delivery is authoritative; a rejected customer acknowledgment does
  not tell the visitor to resubmit an already delivered lead.

Required production environment variables:

- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `CONTACT_FROM_EMAIL` using a sender on a verified Resend domain
- `NEXT_PUBLIC_GA_ID` only when Google Analytics is enabled

For higher-volume abuse protection, add distributed rate limiting and Cloudflare
Turnstile or an equivalent edge challenge. The current in-memory limiter is an
application guard, not a shared multi-region quota.

## SEO And Security Baseline

- Canonical origin: `https://828constructions.com`
- Every public route must return 200 and appear in `sitemap.xml`
- `robots.txt` allows legitimate crawling and references the sitemap
- Every page must keep a unique title, description, canonical, and index/follow
  directive
- JSON-LD must remain valid and preserve business phone, location, category, and
  service-area context
- HTTP redirects to HTTPS
- Security headers include HSTS, MIME sniffing protection, frame protection,
  referrer policy, permissions policy, and cross-origin opener isolation
- Never expose secrets in `NEXT_PUBLIC_*`, source maps, checked-in environment
  files, or client-side code

The apex domain is canonical. The `www` hostname must also have a valid TLS
certificate and redirect to the apex in Vercel/DNS.

## Release Standard

Before deployment, run:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run preflight:desktop
npm run preflight:mobile
npm audit --omit=dev
```

Also test all eight routes at phone, tablet, desktop, and ultra-wide sizes with
rapid forward/reverse scrolling. Release blockers include horizontal overflow,
black or mismatched background gaps, stranded reveal targets, overlapping sticky
surfaces, broken visible images, console errors, inaccessible controls, invalid
form focus, and footer/header seams.

## Non-Negotiable Editing Rules

- Do not change approved wording or project facts without explicit client input.
- Do not reorder sections or replace the established portfolio compositions with
  generic cards or a standard gallery.
- Do not remove the desktop stacked sticky animation.
- Do not force every short bridge or CTA to fill an entire viewport.
- Keep mobile readable, touch-friendly, and stable; most customers will first
  experience the site there.
- Preserve reduced-motion support and keyboard access.
- Prefer shared motion, rail, header, and stacked-surface systems over duplicating
  route-local behavior.
