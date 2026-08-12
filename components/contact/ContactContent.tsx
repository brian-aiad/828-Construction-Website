"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "@/components/contact/ContactForm";
import ContactFlow from "@/components/contact/ContactFlow";
import { revealOnVisible } from "@/utils/revealOnVisible";
import { SERVICE_AREAS, SERVICES, SITE } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

function imgError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Joe's 01–04 list is frozen ("all this information stays, that's fine" — IMG_1125).
const prepItems = [
  "Property address or city",
  "Project type and current stage",
  "Photos, drawings, or concerns",
  "Timeline and decision deadline",
];

const inquiryRows = [
  {
    label: "Call",
    value: formatPhone(SITE.phone),
    href: SITE.phoneHref,
    detail: "Best for urgent remediation, site access, and scheduling.",
    numbers: true,
  },
  {
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    detail: "Useful when you already have photos, plans, or documents.",
    numbers: false,
  },
  {
    label: "Base",
    value: "Torrance, CA",
    href: `https://maps.google.com/?q=${encodeURIComponent(SITE.address.full)}`,
    detail: "Serving South Bay homeowners and select nearby projects.",
    numbers: false,
  },
];

// Same rows/pictures/captions as the services index — Joe singled that
// treatment out in his video ("how we're doing on that one service page…
// they illuminate and a picture illuminates with it"). Captions are approved
// live copy from ServicesContent.
const SERVICE_PATH_ROWS = [
  {
    slug: "adu",
    image: "/images/generated/contact-path-adu-v2.png",
    line: "New living space, permitted and built to hold value.",
  },
  {
    slug: "remediation",
    image: "/images/generated/contact-path-remediation-v2.png",
    line: "Find the cause, open only what matters, rebuild correctly.",
  },
  {
    slug: "consulting",
    image: "/images/generated/contact-path-consulting-v2.png",
    line: "Decide before you spend. Scope, risk, cost, and next moves.",
  },
];

// Live-rect focus selection (services-index mechanic, PATTERNS.md Fix 22 timing
// rule): plain React state so it is sticky-proof and identical on mobile.
function useFocusIndex(
  refs: React.MutableRefObject<Array<HTMLElement | null>>,
  focusRatio = 0.52
) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const focus = window.innerHeight * focusRatio;
      let best = 0;
      let bestDist = Infinity;
      let contained = false;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (!contained && r.top <= focus && r.bottom >= focus) {
          best = i;
          contained = true;
          return;
        }
        if (contained) return;
        const dist = Math.abs(r.top + r.height / 2 - focus);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [refs, focusRatio]);
  return active;
}

function useContactMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(
    () => () => {
      try {
        ctxRef.current?.revert();
      } catch {}
    },
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const desktopSlide = window.matchMedia("(min-width: 1024px)").matches;
      const touchFlow = !desktopSlide;

      // One-shot rises — IO-driven on every viewport (Fixes 15/22). Initial
      // states set here, never in JSX (Fix 14). Inside ContactFlow's sticky
      // stacked surfaces, scroll-math triggers go stale (Fix 25) — every
      // reveal below keys off actual visibility, never scroll position.
      const rises = gsap.utils.toArray<HTMLElement>(".ct-rise");
      if (!reduced) {
        revealCleanups.push(
          revealOnVisible(rises, (el) => {
            if (touchFlow) {
              gsap.fromTo(
                el,
                { opacity: 0.001, y: 16 },
                { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" }
              );
              return;
            }
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out" }
            );
          })
        );
      }

      // Hairline draws — decisive IO one-shots (scrub triggers would park
      // mid-draw once their surface pins; Fix 25).
      const lines = gsap.utils.toArray<HTMLElement>(".ct-line");
      if (!reduced) {
        lines.forEach((el) => gsap.set(el, { scaleX: 0.18 }));
        revealCleanups.push(
          revealOnVisible(lines, (el) => {
            gsap.to(el, { scaleX: 1, duration: 1.05, ease: "power3.inOut" });
          })
        );
      }

      // ── Get-in-touch band composes in two beats (Brian, 2026-07-13) ────────
      // BEAT 1 — the call/email/base ledger rises in sequence from the left.
      // BEAT 2 — the message card slides in from the right and fades up. Both
      // are decisive IO one-shots (never scroll-math — Fix 25) and every target
      // is visible-by-default in JSX (Fix 14) + data-gsap-reveal so the global
      // failsafe (Fix 18) rescues any left hidden. The section owns
      // overflowX:clip, so the card's inbound x-offset can never open a
      // horizontal scrollbar. Inputs stay interactive: autoAlpha flips the card
      // to visible the instant the reveal starts, and the card is never the
      // thing that gates typing (it reveals on entering the viewport).
      const ledger = gsap.utils.toArray<HTMLElement>(".ct-ledger");
      if (!reduced && ledger.length) {
        // Reveal each row when IT enters (robust — no row can stay hidden), but
        // key the delay off row index so a band that arrives all-at-once still
        // reads as a staggered cascade rather than a single pop.
        revealCleanups.push(
          revealOnVisible(ledger, (el, i) => {
            if (touchFlow) {
              gsap.fromTo(
                el,
                { opacity: 0.001, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.58,
                  delay: Math.min(i, 3) * 0.06,
                  ease: "power3.out",
                }
              );
              return;
            }
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 26 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                delay: Math.min(i, 3) * 0.12,
                ease: "power3.out",
              }
            );
          })
        );
      }

      const card = root.querySelector<HTMLElement>(".ct-form-card");
      if (!reduced && card) {
        revealCleanups.push(
          revealOnVisible([card], (el) => {
            if (touchFlow) {
              gsap.fromTo(
                el,
                { opacity: 0.001, y: 18 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
              );
              return;
            }
            gsap.fromTo(
              el,
              { autoAlpha: 0, x: 60, y: 0 },
              { autoAlpha: 1, x: 0, y: 0, duration: 0.95, ease: "power3.out" }
            );
          })
        );
      }

    }, rootRef);

    ctxRef.current = ctx;
    return () => {
      revealCleanups.forEach((dispose) => dispose());
      ctxRef.current = null;
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return rootRef;
}

// ── Section 01 — "Get in touch" photo band (Joe: NS grammar, verbiage frozen) ─
function ContactHero() {
  return (
    <section
      data-section="contact-hero"
      data-header-dark=""
      className="relative flex min-h-[54svh] flex-col justify-between overflow-hidden bg-black text-white"
      style={{ overflowX: "clip" }}
    >
      <div className="absolute inset-0">
        <div className="ct-hero-img absolute inset-0 will-change-transform">
          <Image
            src="/images/contact/contact-hero.jpg"
            alt="Residential architecture detail at dusk"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            onError={imgError}
            className="object-cover"
            style={{ filter: "contrast(1.05) saturate(0.98)" }}
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/24 to-black/38"
          aria-hidden="true"
        />
      </div>

      {/* Off to the side (Joe, IMG_1123): the listening line rides the upper right. */}
      <div className="relative z-10 hidden justify-end px-6 pt-24 sm:flex lg:px-12 lg:pt-28">
        <p className="ct-rise max-w-xs text-right text-sm leading-7 text-white/82 sm:max-w-sm lg:text-[15px] lg:leading-8">
          Our journey begins with active listening, where each conversation
          begins the foundation of shaping your vision.
        </p>
      </div>

      <div className="relative z-10 px-6 pb-9 pt-28 sm:pt-0 lg:px-12 lg:pb-11">
        <span className="font-labels text-[10px] uppercase tracking-[0.26em] text-white/62">
          Contact / 828 Construction
        </span>
        <h1 className="mt-4 max-w-3xl font-display font-normal leading-[1.04] tracking-[-0.01em] text-[clamp(2rem,3.8vw,3.8rem)]">
          Building lasting partnerships.
        </h1>
        <div className="ct-line mt-5 h-px w-full max-w-36 origin-left bg-[var(--color-accent)]" />
        <p className="mt-4 max-w-md text-sm leading-7 text-white/76 sm:hidden">
          Our journey begins with active listening, where each conversation
          begins the foundation of shaping your vision.
        </p>
        <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
          Forging exceptional partnership defined by artistry and enduring
          values
        </p>
      </div>
    </section>
  );
}

// ── Section 02 — all-black Get in touch band (Joe: "fatter, all contact info") ─
function GetInTouch() {
  return (
    <section
      data-section="contact-inquiry"
      data-header-dark=""
      className="relative overflow-hidden bg-black px-6 pb-20 pt-28 text-white lg:px-12 lg:pb-28"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="ct-rise flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-white/48">
              Project inquiry
            </span>
            <h2 className="mt-4 font-display font-normal leading-none tracking-[-0.01em] text-[clamp(2rem,3.6vw,3.4rem)]">
              Get in touch
            </h2>
          </div>
          <span className="border border-white/14 px-3 py-2 font-labels text-[9px] uppercase tracking-[0.16em] text-white/58">
            Typical response within 24 hours
          </span>
        </div>

        <div className="ct-line mt-10 h-px w-full origin-left bg-white/14" />

        <div className="mt-12 grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          {/* The application path — every way a project reaches Joe. */}
          <div>
            {inquiryRows.map((row) => (
              <a
                key={row.label}
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                data-gsap-reveal="true"
                className="ct-ledger group block border-b border-white/10 py-7 first:border-t"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/46">
                    {row.label}
                  </span>
                  <span
                    className="h-px w-8 bg-[var(--color-accent)]/70 transition-all duration-300 group-hover:w-14"
                    aria-hidden="true"
                  />
                </div>
                <p
                  className={`mt-4 break-words leading-tight text-white transition-colors group-hover:text-[#d9c1bc] ${
                    row.numbers
                      ? "font-numbers text-[clamp(1.6rem,3vw,2.6rem)] font-bold"
                      : "font-display text-[clamp(1.15rem,2vw,1.7rem)] font-normal"
                  }`}
                >
                  {row.value}
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/56">
                  {row.detail}
                </p>
              </a>
            ))}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="border border-[var(--color-accent)]/60 px-4 py-2.5 font-labels text-[9px] uppercase tracking-[0.18em] text-white/72">
                CA License #{SITE.license}
              </span>
              <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/46">
                Est. 2004 / Torrance, CA
              </span>
            </div>
          </div>

          {/* Message form — visual form; backend remains on hold (CLAUDE.md). */}
          <div
            data-gsap-reveal="true"
            className="ct-form-card border border-white/12 bg-white/[0.03] p-6 sm:p-8 lg:p-10"
          >
            <div className="mb-8 flex items-center justify-between gap-5 border-b border-white/10 pb-5">
              <div>
                <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/42">
                  Or send the details
                </span>
                <h3 className="mt-2 font-display text-2xl font-normal leading-none text-white">
                  Start here.
                </h3>
              </div>
              <span
                className="h-2 w-2 rounded-full bg-[var(--color-accent)]"
                aria-hidden="true"
              />
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 03 — critical elements (heading per IMG_1125, items frozen) ──────
// V4 composition: asymmetric editorial split (Design Direction V4) — statement
// block left, the four essentials as an igniting ledger right (same values-
// ledger grammar as the consulting/remediation benefit rows).
function InsightsPrep() {
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const activeIdx = useFocusIndex(itemRefs, 0.58);

  return (
    <section
      data-section="contact-prep"
      data-header-light=""
      className="relative overflow-hidden bg-[#f7f7f3] px-6 pb-8 pt-18 text-[#141414] sm:pb-10 sm:pt-22 lg:px-12 lg:pb-20 lg:pt-28"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-black/54">
            Critical elements to include in your communication
          </span>
          <h2 className="ct-rise mt-5 max-w-xl font-display font-normal leading-[1.14] tracking-[-0.01em] text-[clamp(1.6rem,2.7vw,2.7rem)]">
            Your insights help us provide solutions that are thoughtfully
            tailored to your needs
          </h2>
          <div className="ct-line mt-8 h-px w-full max-w-36 origin-left bg-[var(--color-accent)]" />
        </div>

        <div className="lg:pt-1">
          {prepItems.map((item, index) => {
            const active = activeIdx === index;
            return (
              <div
                key={item}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="ct-rise border-b border-black/10 py-6 first:border-t lg:py-7"
              >
                <div className="flex items-baseline gap-6 lg:gap-8">
                  <span
                    className={`font-numbers text-lg font-bold transition-colors duration-500 ${
                      active ? "text-[var(--color-accent)]" : "text-black/[0.38]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-display font-normal leading-snug tracking-[-0.01em] text-[clamp(1.2rem,2.1vw,1.8rem)] transition-colors duration-500 ${
                        active ? "text-[#141414]" : "text-black/[0.46]"
                      }`}
                    >
                      {item}
                    </p>
                    <span
                      className={`mt-3 block h-px origin-left bg-[var(--color-accent)]/80 transition-transform duration-700 ease-out ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                      style={{ width: "min(10rem, 45%)" }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Section 04 — service paths: the services-page SCROLLING, restyled ───────
// Joe (IMG_1127): "how we're doing on that one service page… as you scroll they
// illuminate and a picture illuminates with it." Brian (2026-07-13): match the
// services page's runway scrolling — the walk is deliberate, scroll-driven —
// but do NOT copy the look. Differentiators here: shorter 150vh runway (50vh a
// service vs 70vh), smaller titles, and the picture stage is INDENTED with a
// drawing vertical maroon bar on its left edge (services: full-width stage,
// horizontal top line). Mobile walks in natural flow (no pin).
function useTravelIndex(
  wrapRef: React.RefObject<HTMLElement | null>,
  rowRefs: React.MutableRefObject<Array<HTMLElement | null>>,
  count: number
) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const lgQuery = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (lgQuery.matches) {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const runway = wrap.offsetHeight - window.innerHeight;
        if (runway <= 0) {
          setActive(0);
          return;
        }
        const progress = Math.min(
          0.999,
          Math.max(0, -wrap.getBoundingClientRect().top / runway)
        );
        const next = Math.min(count - 1, Math.floor(progress * count));
        setActive((prev) => (prev === next ? prev : next));
        return;
      }
      const focus = window.innerHeight * 0.38;
      let best = 0;
      rowRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= focus) best = i;
      });
      setActive((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll, { passive: true });
    lgQuery.addEventListener("change", onScroll);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => onScroll()).catch(() => {});
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      lgQuery.removeEventListener("change", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [wrapRef, rowRefs, count]);
  return active;
}

function ServicePathRows() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const activeIdx = useTravelIndex(wrapRef, rowRefs, SERVICE_PATH_ROWS.length);

  return (
    <>
    <section
      ref={wrapRef}
      data-section="contact-paths"
      data-header-light=""
      className="motion-runway relative bg-[#f7f7f3] text-[#141414] lg:h-[calc(100svh+150vh)]"
      style={{ overflowX: "clip" }}
    >
      {/* Deliberate walk: the panel pins while the runway scrolls (lg+). */}
      <div className="lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-4 pt-8 sm:pt-10 lg:px-12 lg:pt-[6.5rem]">
          <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-black/54">
            Focused service paths
          </span>

          <div className="mt-6 h-px w-full bg-black/12" aria-hidden="true" />
          {SERVICE_PATH_ROWS.map((row, i) => {
            const service = SERVICES.find((s) => s.slug === row.slug)!;
            const open = activeIdx === i;
            return (
              <Link
                key={row.slug}
                href={`/services/${row.slug}`}
                aria-label={`View ${service.title}`}
                className="group block border-b border-black/12"
              >
                <div
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="relative z-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                >
                  <span
                    className={`font-display font-normal leading-[1.02] tracking-tight transition-colors duration-300 text-[clamp(1.9rem,3.9vw,3.5rem)] ${
                      open ? "text-[#141414]" : "text-black/[0.46]"
                    }`}
                  >
                    {service.title}
                  </span>
                  <span
                    className={`font-labels text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                      open ? "text-black/75" : "text-black/60"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} / {service.short}
                    <span
                      className={`ml-3 inline-block transition-all duration-300 group-hover:translate-x-0 group-hover:text-[var(--color-accent)] ${
                        open
                          ? "translate-x-0 text-[var(--color-accent)]"
                          : "-translate-x-1"
                      }`}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </div>

                {/* Desktop keeps the active-row reveal. Touch layouts keep
                    image space reserved to avoid scroll-time layout shifts. */}
                <div
                  className={`grid max-xl:grid-rows-[1fr] ${
                    open ? "xl:grid-rows-[1fr]" : "xl:grid-rows-[0fr]"
                  }`}
                  style={{
                    transition:
                      "grid-template-rows 950ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="relative mb-6 mt-1 h-[16rem] overflow-hidden sm:h-[22rem] lg:mb-5 lg:ml-[14%] lg:h-[calc(100svh-31rem)] lg:min-h-[12rem]">
                      <Image
                        src={row.image}
                        alt={`${service.title} by 828 Construction`}
                        fill
                        loading={i === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 1536px) 100vw, 1100px"
                        quality={92}
                        unoptimized
                        onError={imgError}
                        className="object-cover transition-transform duration-[1600ms] ease-out"
                        style={{
                          filter: "contrast(1.05) saturate(1.05)",
                          transform: open ? "scale(1.03)" : "scale(1.08)",
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-black/62 to-transparent px-5 pb-5 pt-14 lg:px-6 lg:pb-8">
                        <p className="max-w-md text-[13px] leading-5 text-white/85">
                          {row.line}
                        </p>
                        <span className="hidden shrink-0 font-labels text-[9px] uppercase tracking-[0.2em] text-white/85 sm:inline">
                          View {service.title} →
                        </span>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 top-0 w-[3px] bg-[var(--color-accent)]"
                        style={{
                          transform: open ? "scaleY(1)" : "scaleY(0)",
                          transformOrigin: "top",
                          opacity: 0.85,
                          transition:
                            "transform 900ms cubic-bezier(0.16,1,0.3,1) 150ms",
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </section>

    {/* The shrunk fourth row — service area (verbiage per IMG_1127). Lives
        OUTSIDE the runway section so it can never ride over the pinned panel;
        same stack surface (ContactFlow wraps the fragment). */}
    <div className="relative bg-[#f7f7f3] text-[#141414]" data-header-light="">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 lg:px-12 lg:pb-24">
        <div className="ct-rise border border-black/10 bg-white/55">
          <div className="grid gap-x-10 gap-y-6 px-6 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-10">
            <div>
              <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-black/54">
                Service area
              </span>
              <h3 className="mt-3 font-display text-[clamp(1.4rem,2.4vw,2.2rem)] font-normal leading-none">
                South Bay based.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-black/72">
                Whether improving your residence or addressing critical
                structural or system concerns, 828 Construction delivers expert
                diagnostic and tailored solutions with a commitment to
                excellence.
              </p>
              <a
                href={SITE.phoneHref}
                className="mt-6 inline-flex bg-black px-6 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)] lg:py-3.5"
              >
                Call {formatPhone(SITE.phone)}
              </a>
            </div>
            <div className="lg:pt-7">
              <div className="flex flex-wrap gap-2">
                {SERVICE_AREAS.slice(0, 10).map((area) => (
                  <span
                    key={area}
                    className="border border-black/10 bg-[#f7f7f3] px-3 py-2 font-labels text-[8px] uppercase tracking-[0.16em] text-black/58"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="mt-5 font-labels text-[9px] uppercase tracking-[0.18em] text-black/46">
                CA License #{SITE.license} / Est. 2004
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function ContactContent() {
  const rootRef = useContactMotion();

  return (
    <div ref={rootRef} className="bg-[#f7f7f3]">
      <ContactFlow>
        <ContactHero />
        <GetInTouch />
        <InsightsPrep />
        <ServicePathRows />
      </ContactFlow>
    </div>
  );
}
