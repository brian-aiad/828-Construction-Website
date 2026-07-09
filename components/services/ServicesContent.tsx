"use client";

import {
  type SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES, SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { revealOnVisible } from "@/utils/revealOnVisible";

gsap.registerPlugin(ScrollTrigger);

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=";

// Aligns constrained copy with the viewport-bleeding halves of split sections:
// left padding = the same gutter a centered max-w-7xl container would get.
const CONTAINER_LEFT = "max(1.5rem,calc((100vw - 80rem) / 2 + 3rem))";

function imgError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

// Joe (services video batch, 2026-06): the services list "whited out", rows
// illuminating on scroll with a picture per service — NS Selected Works grammar.
const SERVICE_ROWS = [
  {
    slug: "adu",
    image: "/images/projects/adu-exterior-new.jpg",
    line: "New living space, permitted and built to hold value.",
  },
  {
    slug: "remediation",
    image: "/images/projects/remediation-active.jpg",
    line: "Find the cause, open only what matters, rebuild correctly.",
  },
  {
    slug: "consulting",
    image: "/images/projects/consulting-plans.jpg",
    line: "Decide before you spend. Scope, risk, cost, and next moves.",
  },
];

// Verbatim from Joe's phone notes (docs/828_SERVICES_JOE_FEEDBACK_2026-07-08.md,
// typo cleanups documented there). Words are frozen.
const PRINCIPLES = [
  {
    title: "Refined craftsmanship",
    body: "We deliver finely executed detail through skill and intentional building practices that elevate every finish.",
  },
  {
    title: "Proactive client communication",
    body: "We maintain clear, forward-thinking communication to ensure you are informed and confident at every stage.",
  },
  {
    title: "Structural integrity without compromise",
    body: "We build with uncompromising strength and precision to ensure lasting performance and peace of mind.",
  },
  {
    title: "Client centered experience",
    body: "We shape every project around your vision, delivering a seamless and highly personalized building experience.",
  },
];

// Verbatim stage titles from Joe's phone notes (1-6 stages).
const STAGES = [
  "Initial Contact / Discovery",
  "Pre-Construction",
  "Proposal & Contract",
  "Construction",
  "Project Completion",
  "Post Construction",
];

// Live-rect focus selection (sticky-proof — PATTERNS.md Fix 22 timing rule),
// rule: the ACTIVE row is the last row whose title bar has crossed the focus
// line. Monotone in scroll position, so it cannot oscillate when the active
// row's photograph stage expands/collapses and reflows the list (the reflow
// moves crossed titles further above the line, never back below it). Near the
// top of the page the first row is always active (Joe's list opens on ADU),
// and it re-measures after fonts/images settle.
function useFocusIndex(
  refs: React.MutableRefObject<Array<HTMLElement | null>>,
  focusRatio = 0.38,
  topGuardPx = 80
) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (window.scrollY < topGuardPx) {
        setActive(0);
        return;
      }
      const focus = window.innerHeight * focusRatio;
      let best = 0;
      refs.current.forEach((el, i) => {
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
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => onScroll()).catch(() => {});
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [refs, focusRatio, topGuardPx]);
  return active;
}

function useServicesMotion() {
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
    const revealCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const rises = gsap.utils.toArray<HTMLElement>(".svc-rise");
      // Headings drift in position-only (never opacity/visibility-hidden):
      // axe skips hidden headings, which breaks the page's heading order.
      const shifts = gsap.utils.toArray<HTMLElement>(".svc-shift");
      const clips = gsap.utils.toArray<HTMLElement>(".svc-clip");
      const hairlines = gsap.utils.toArray<HTMLElement>(".svc-hairline");
      const seams = gsap.utils.toArray<HTMLElement>(".svc-seam");
      const parallaxImgs = gsap.utils.toArray<HTMLElement>(".svc-parallax");
      const stripInner = root.querySelector<HTMLElement>(".svc-strip-inner");

      // Initial states live HERE, not in JSX (Fix 14).
      gsap.set(rises, { autoAlpha: 0, y: 26 });
      gsap.set(shifts, { y: 30 });
      gsap.set(clips, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(hairlines, { scaleX: 0, transformOrigin: "left" });
      gsap.set(seams, { scaleY: 0, transformOrigin: "top" });

      if (!AnimationController.shouldAnimate()) {
        // Mobile / reduced motion: everything readable immediately.
        gsap.set(rises, { autoAlpha: 1, y: 0 });
        gsap.set(shifts, { y: 0 });
        gsap.set(clips, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(hairlines, { scaleX: 1 });
        gsap.set(seams, { scaleY: 1 });
        return;
      }

      // One-shot entrances key off real visibility (Fix 22). A fully-clipped
      // element never intersects (Fix 23) — observe parents, reveal children.
      revealCleanups.push(
        revealOnVisible(rises, (el) => {
          gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
        })
      );
      revealCleanups.push(
        revealOnVisible(shifts, (el) => {
          gsap.to(el, { y: 0, duration: 0.9, ease: "power3.out" });
        })
      );
      revealCleanups.push(
        revealOnVisible(
          clips.map((el) => el.parentElement ?? el),
          (wrapper) => {
            const el =
              (wrapper as HTMLElement).querySelector<HTMLElement>(".svc-clip") ??
              (wrapper as HTMLElement);
            gsap.to(el, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.15,
              ease: "power3.inOut",
            });
          }
        )
      );
      revealCleanups.push(
        revealOnVisible(hairlines, (el) => {
          gsap.to(el, { scaleX: 1, duration: 1.0, ease: "power2.inOut" });
        })
      );
      revealCleanups.push(
        revealOnVisible(seams, (el) => {
          gsap.to(el, { scaleY: 1, duration: 1.0, delay: 0.2, ease: "power2.inOut" });
        })
      );

      // Sustained scrubs (Fix 15) — initial states stay readable (Fix 22).
      // Photographs breathe: parallax drift + a scale settle (1.07 → 1.0)
      // across their whole viewport transit.
      parallaxImgs.forEach((el) => {
        gsap.set(el, { scale: 1.07, transformOrigin: "center center" });
        gsap.to(el, {
          yPercent: -8,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        });
      });

      // Joe (IMG_1082): the stage strip "goes across the screen" — the
      // overflowing single-line strip slides left on scrub, walking 01 → 06
      // through the viewport. Initial x=0 keeps the first stages readable.
      if (stripInner) {
        const strip = stripInner.parentElement as HTMLElement;
        const travel = () =>
          Math.min(0, strip.clientWidth - stripInner.scrollWidth);
        gsap.to(stripInner, {
          x: travel,
          ease: "none",
          scrollTrigger: {
            trigger: strip,
            start: "top 88%",
            end: "top 18%",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, root);

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

// ── Section 1 — the services index (page signature: illuminating rows with a
// traveling picture). Joe (IMG_1075) via Brian: the list runs across the
// screen "long ways" — no side plate. ONE picture at a time lives under /
// overlapping the active word; scroll to the next service and the previous
// picture is gone, replaced by that service's picture. Whole row is the link.
function ServicesIndex() {
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const focusIdx = useFocusIndex(rowRefs, 0.38);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const inkIdx = hoverIdx ?? focusIdx; // text illumination follows hover too
  const openIdx = focusIdx; // the picture follows SCROLL only (Joe: "as you scroll")

  return (
    <section
      data-section="services-index"
      data-header-light=""
      className="relative bg-[#f7f7f3] text-[#141414]"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-28 lg:px-12 lg:pb-24 lg:pt-36">
        <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-black/65">
          Services / CA License #{SITE.license}
        </span>
        <h1 className="mt-6 max-w-3xl font-display font-bold leading-[1.05] tracking-tight text-[clamp(2rem,3.8vw,3.7rem)]">
          Three ways to build with control.
        </h1>

        {/* Full-width list: dim rows illuminate; the photograph stage travels */}
        <div className="svc-shift mt-12 lg:mt-16">
          <div className="h-px w-full bg-black/12" aria-hidden="true" />
          {SERVICE_ROWS.map((row, i) => {
            const service = SERVICES.find((s) => s.slug === row.slug)!;
            const ink = inkIdx === i;
            const open = openIdx === i;
            return (
              <Link
                key={row.slug}
                href={`/services/${row.slug}`}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                aria-label={`View ${service.title}`}
                className="group block border-b border-black/12"
              >
                <div
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="relative z-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 lg:py-7"
                >
                  <span
                    className={`svc-row-title font-display font-normal leading-[1.02] tracking-tight transition-colors duration-500 text-[clamp(2.3rem,5.6vw,5rem)] ${
                      ink ? "text-[#141414]" : "text-black/[0.46]"
                    }`}
                  >
                    {service.title}
                  </span>
                  <span
                    className={`svc-row-tag font-labels text-[9px] uppercase tracking-[0.16em] transition-colors duration-500 ${
                      ink ? "text-black/75" : "text-black/60"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} / {service.short}
                    <span
                      className={`ml-3 inline-block transition-all duration-300 ${
                        ink
                          ? "translate-x-0 text-[var(--color-accent)]"
                          : "-translate-x-1"
                      }`}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </div>

                {/* The traveling picture: only the active row's stage is open.
                    Identical duration/easing on every stage keeps the list
                    reflow net-zero while one collapses and the next expands. */}
                <div
                  className="grid"
                  style={{
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition:
                      "grid-template-rows 750ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                  aria-hidden={!open}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="relative -mt-2 mb-6 h-[42vh] overflow-hidden lg:mb-8 lg:h-[54vh]">
                      <Image
                        src={row.image}
                        alt={`${service.title} by 828 Construction`}
                        fill
                        loading={i === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 1280px) 100vw, 1184px"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        onError={imgError}
                        className="object-cover transition-transform duration-[1600ms] ease-out"
                        style={{
                          filter: "contrast(1.05) saturate(1.05)",
                          transform: open ? "scale(1.03)" : "scale(1.08)",
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-black/62 to-transparent px-5 pb-4 pt-16 lg:px-7 lg:pb-5">
                        <p className="max-w-md text-[13px] leading-5 text-white/85">
                          {row.line}
                        </p>
                        <span className="hidden shrink-0 font-labels text-[9px] uppercase tracking-[0.2em] text-white/85 sm:inline">
                          View {service.title} →
                        </span>
                      </div>
                      <div
                        className="absolute left-0 top-0 h-[2px] bg-[var(--color-accent)]"
                        style={{
                          width: open ? "100%" : "0%",
                          opacity: 0.8,
                          transition:
                            "width 900ms cubic-bezier(0.16,1,0.3,1) 150ms",
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
  );
}

// ── Section 2 — vision statement + full-bleed photograph ────────────────────
function VisionStatement() {
  return (
    <section
      data-section="services-vision"
      data-header-dark=""
      className="relative bg-black text-white"
      style={{ overflowX: "clip" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div
          className="relative flex items-center px-6 py-16 lg:py-24 lg:pr-16"
          style={{ paddingLeft: undefined }}
        >
          <div className="w-full lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]">
            <span className="svc-rise block font-labels text-[10px] uppercase tracking-[0.24em] text-white/60">
              The 828 standard
            </span>
            <h2 className="svc-shift mt-5 max-w-xl font-display font-light leading-[1.14] text-[clamp(1.7rem,3vw,3.1rem)]">
              Where your vision meets uncompromising quality.
            </h2>
            <div
              className="svc-hairline mt-8 h-px w-24 bg-[var(--color-accent)]"
              style={{ opacity: 0.6 }}
              aria-hidden="true"
            />
          </div>
          {/* Seam between copy and photograph */}
          <div
            className="svc-seam absolute bottom-10 right-0 top-10 hidden w-px bg-white/12 lg:block"
            aria-hidden="true"
          />
        </div>
        {/* TODO(client): swap for the real "homeowner looking back at the finished
            property" photo when photography lands — Joe's preferred subject. */}
        <div
          className="svc-clip relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[78vh]"
          data-gsap-reveal="true"
        >
          <div className="svc-parallax absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
            <Image
              src="/images/projects/outdoor-living-editorial.jpg"
              alt="Finished South Bay outdoor living space by 828 Construction"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 54vw"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              onError={imgError}
              className="object-cover"
              style={{ filter: "contrast(1.05) saturate(1.08)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3 — "Ever present" values: photo left, ink panel right ──────────
// Literal to the split-screen Joe pointed at (NS "Build with purpose"):
// photograph one side, dark panel with numbered principles the other,
// numbers/titles one side of the panel, phrases the opposite side.
function PrinciplesSection() {
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const activeIdx = useFocusIndex(rowRefs, 0.55);

  return (
    <section
      data-section="services-principles"
      data-header-dark=""
      className="relative bg-[#0a0a0a] text-white"
      style={{ overflowX: "clip" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Close-up plate — photographer close-ups, per Joe */}
        <div className="svc-clip relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-auto lg:min-h-full" data-gsap-reveal="true">
          <div className="svc-parallax absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
            <Image
              src="/images/projects/bathroom-herringbone.jpg"
              alt="Herringbone tile craftsmanship close-up by 828 Construction"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 46vw"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              onError={imgError}
              className="object-cover"
              style={{ filter: "contrast(1.05) saturate(1.05)" }}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/55 to-transparent px-6 pb-5 pt-14 lg:block">
            <p className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/75">
              Detail work / South Bay
            </p>
          </div>
        </div>

        {/* Ink panel */}
        <div className="px-6 py-16 lg:px-16 lg:py-24 xl:px-20">
          <span className="svc-rise block font-labels text-[10px] uppercase tracking-[0.24em] text-white/60">
            Through all projects
          </span>
          <h2 className="svc-shift mt-5 font-display font-light leading-[1.1] text-[clamp(1.8rem,3vw,3rem)]">
            Ever present
          </h2>

          <div className="relative mt-10 lg:mt-14">
            {/* Reading-progress seam: grows down the panel as rows ignite */}
            <div className="absolute -left-5 top-0 hidden h-full w-px bg-white/10 lg:block xl:-left-8" aria-hidden="true" />
            <div
              className="absolute -left-5 top-0 hidden w-px bg-[var(--color-accent)] lg:block xl:-left-8"
              style={{
                height: `${((activeIdx + 1) / PRINCIPLES.length) * 100}%`,
                opacity: 0.85,
                transition: "height 650ms cubic-bezier(0.16,1,0.3,1)",
              }}
              aria-hidden="true"
            />
            {PRINCIPLES.map((p, i) => {
              const active = activeIdx === i;
              return (
                <div
                  key={p.title}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="grid grid-cols-1 gap-2 border-t border-white/[0.08] py-6 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] sm:gap-8 lg:py-7"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`font-numbers text-[19px] font-bold leading-6 transition-colors duration-500 ${
                        active ? "text-[var(--color-accent-light)]" : "text-white/55"
                      }`}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`font-display text-[17px] leading-6 transition-colors duration-500 lg:text-lg ${
                        active ? "text-white" : "text-white/60"
                      }`}
                    >
                      {p.title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm leading-6 transition-colors duration-500 ${
                      active ? "text-white/75" : "text-white/55"
                    }`}
                  >
                    {p.body}
                  </p>
                </div>
              );
            })}
            <div className="h-px w-full bg-white/[0.08]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 4 — foundational principles + the stage strip + media band ──────
// Mimics the NS Process composition Joe showed: light surface, heading split,
// one hairline strip of numbered stages sliding across the screen, then a
// full-bleed media band. "The footer stays."
function ProcessSection() {
  return (
    <section
      data-section="services-process"
      data-header-light=""
      className="relative bg-[#f7f7f3] text-[#141414]"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl px-6 pt-20 lg:px-12 lg:pt-28">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="svc-rise block font-labels text-[10px] uppercase tracking-[0.24em] text-black/65">
              Our process
            </span>
          </div>
          <p className="svc-rise max-w-3xl font-display font-light leading-[1.35] text-[clamp(1.2rem,1.9vw,1.7rem)] text-black/85 lg:col-span-8">
            Guided by our foundational principles, we consistently uphold the
            highest standards in every project, ensuring flawless execution and
            meticulous attention to detail at every stage.
          </p>
        </div>
      </div>

      {/* The strip that goes across the screen — overflows and slides on scrub */}
      <div className="relative mt-12 lg:mt-16">
        <div className="svc-hairline absolute left-0 top-0 h-px w-full bg-black/15" aria-hidden="true" />
        {/* Desktop: the overflowing strip slides across the screen on scrub */}
        <div className="hidden overflow-hidden lg:block">
          <ol className="svc-strip-inner flex w-max items-baseline gap-0 px-12 pb-14 pt-7">
            {STAGES.map((stage, i) => (
              <li key={stage} className="flex items-baseline whitespace-nowrap">
                <span className="font-numbers text-[11px] text-black/60" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ml-2.5 font-labels text-[12px] uppercase tracking-[0.16em] text-black/80">
                  {stage}
                </span>
                {i < STAGES.length - 1 && (
                  <span
                    className="mx-10 font-labels text-[12px] text-[var(--color-accent)]"
                    aria-hidden="true"
                  >
                    +
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
        {/* Mobile: no scrub to drive the slide — all six stages stack in a grid */}
        <ol className="grid grid-cols-2 gap-x-4 gap-y-8 px-6 pb-10 pt-6 lg:hidden">
          {STAGES.map((stage, i) => (
            <li key={stage}>
              <span className="font-numbers text-[11px] text-[var(--color-accent)]" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-labels text-[10px] uppercase leading-5 tracking-[0.15em] text-black/80">
                {stage}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Full-bleed media band with the start CTA */}
      <div className="svc-clip relative h-[62vh] overflow-hidden lg:h-[74vh]" data-gsap-reveal="true" data-header-dark="">
        <div className="svc-parallax absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
          <Image
            src="/images/projects/adu-framing.jpg"
            alt="ADU framing in progress by 828 Construction"
            fill
            loading="lazy"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            onError={imgError}
            className="object-cover"
            style={{ filter: "contrast(1.05) saturate(1.05)" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 lg:px-12 lg:pb-14">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display font-light leading-[1.2] text-white text-[clamp(1.5rem,2.5vw,2.4rem)]">
                Committed to bringing your vision to life.
              </p>
              <div
                className="mt-5 h-px w-20 bg-[var(--color-accent)]"
                style={{ opacity: 0.7 }}
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-shine btn-lift bg-white px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                Phase One
              </Link>
              <a
                href={SITE.phoneHref}
                className="border border-white/35 bg-black/20 px-8 py-4 font-labels font-numbers text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:border-white"
              >
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesContent() {
  const rootRef = useServicesMotion();

  return (
    <div ref={rootRef} className="bg-black">
      <ServicesIndex />
      <VisionStatement />
      <PrinciplesSection />
      <ProcessSection />
    </div>
  );
}
