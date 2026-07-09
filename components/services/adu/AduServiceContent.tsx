"use client";

import {
  type SyntheticEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { revealOnVisible } from "@/utils/revealOnVisible";

gsap.registerPlugin(ScrollTrigger);

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=";

function imgError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

// Verbatim from Joe's ADU video batch (docs/828_ADU_JOE_FEEDBACK_2026-07-08.md,
// typo cleanups documented there). Words are frozen.
const HERO_PHRASE = "Built with intent";
const HERO_PARAGRAPH =
  "Whether looking to refine a private retreat, ideal for house guests, accommodating family, or simply expanding the living space while elevating the property's value overall — 828 Construction builds with the same seriousness as a primary home.";

// Answers mirror the FAQ JSON-LD in app/services/adu/page.tsx exactly.
const FAQS = [
  {
    q: "How much does an ADU cost in Torrance?",
    a: "ADU construction costs in Torrance typically range from $150,000 to $350,000 depending on size, design, and finishes. 828 Construction provides detailed estimates after a free consultation.",
  },
  {
    q: "Do I need a permit for an ADU in Torrance?",
    a: "Yes, all ADU construction in Torrance requires building permits. 828 Construction manages the permitting process and ensures full compliance with Torrance zoning regulations.",
  },
  {
    q: "How long does it take to build an ADU?",
    a: "A typical ADU takes 6–12 months from initial consultation to completion, including design, permitting, and construction.",
  },
  {
    q: "What types of ADUs can be built on my property?",
    a: "Depending on your lot and zoning, you may qualify for a detached ADU, an attached ADU, a garage conversion, or a Junior ADU (JADU).",
  },
];

// NS Perspectives grammar (Joe's on-screen reference): question cards
// interleaved with photo cells in a checkerboard.
const FAQ_PHOTOS = [
  {
    src: "/images/projects/adu-interior-living.jpg",
    alt: "Finished ADU interior living space by 828 Construction",
  },
  {
    src: "/images/projects/garage-conversion.jpg",
    alt: "Garage conversion ADU by 828 Construction",
  },
];

// Verbatim from Joe's phone notes ("ADU means to 828").
const ACRONYM = [
  {
    letter: "A",
    word: "Aligned",
    body: "With the client's vision, ensuring every detail reflects their lifestyle and goals.",
  },
  {
    letter: "D",
    word: "Dedicated",
    body: "Unwavering commitment to exceptional quality, precision, and craftsmanship at every stage.",
  },
  {
    letter: "U",
    word: "Understanding",
    body: "The renovation process is both a structural transformation and a personal journey — guiding clients through with clarity, care, and a steady expertise to make the process feel seamless and supportive.",
  },
];

// Verbatim from Joe's phone notes ("An invitation to work together").
const QUALIFIERS = [
  "Seeking a collaboration with a bespoke builder?",
  "Is uncompromising quality non-negotiable for your project?",
  "Prepared to invest time and resources required to realize your vision?",
  "Do you value clear communication and a highly considerate building experience?",
];

// Live-rect focus selection (sticky-proof — PATTERNS.md Fix 22 timing rule).
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

function useAduMotion() {
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
      const rises = gsap.utils.toArray<HTMLElement>(".adu-rise");
      const clips = gsap.utils.toArray<HTMLElement>(".adu-clip");
      const hairlines = gsap.utils.toArray<HTMLElement>(".adu-hairline");
      const vlines = gsap.utils.toArray<HTMLElement>(".adu-vline");
      const parallaxImgs = gsap.utils.toArray<HTMLElement>(".adu-parallax");
      const watermark = root.querySelector<HTMLElement>(".adu-watermark");

      // Initial states live HERE, not in JSX (Fix 14). Rises use opacity, NOT
      // autoAlpha — visibility:hidden pulls h2s out of the accessibility tree
      // and axe then reports h1→h3 as a heading-order violation.
      gsap.set(rises, { opacity: 0, y: 26 });
      gsap.set(clips, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(hairlines, { scaleX: 0, transformOrigin: "left" });
      gsap.set(vlines, { scaleY: 0, transformOrigin: "top" });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(rises, { opacity: 1, y: 0 });
        gsap.set(clips, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(hairlines, { scaleX: 1 });
        gsap.set(vlines, { scaleY: 1 });
        return;
      }

      // One-shot entrances key off real visibility (Fix 22), never scroll
      // math. data-stagger delays cascade siblings that enter together.
      revealCleanups.push(
        revealOnVisible(rises, (el) => {
          const delay = parseFloat((el as HTMLElement).dataset.stagger ?? "0");
          gsap.to(el, { opacity: 1, y: 0, duration: 0.85, delay, ease: "power3.out" });
        })
      );
      // Fully-clipped nodes have an empty intersection rect (Fix 23) — observe
      // the unclipped parent, reveal the child.
      revealCleanups.push(
        revealOnVisible(
          clips.map((el) => el.parentElement ?? el),
          (wrapper) => {
            const el =
              (wrapper as HTMLElement).querySelector<HTMLElement>(".adu-clip") ??
              (wrapper as HTMLElement);
            const delay = parseFloat(el.dataset.stagger ?? "0");
            gsap.to(el, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              delay,
              ease: "power3.inOut",
            });
          }
        )
      );
      revealCleanups.push(
        revealOnVisible(hairlines, (el) => {
          const delay = parseFloat((el as HTMLElement).dataset.stagger ?? "0");
          gsap.to(el, { scaleX: 1, duration: 0.9, delay, ease: "power2.inOut" });
        })
      );
      revealCleanups.push(
        revealOnVisible(
          vlines.map((el) => el.parentElement ?? el),
          (wrapper) => {
            const el =
              (wrapper as HTMLElement).querySelector<HTMLElement>(".adu-vline") ??
              (wrapper as HTMLElement);
            gsap.to(el, { scaleY: 1, duration: 1.2, ease: "power2.inOut" });
          }
        )
      );

      // Sustained scrubs (Fix 15) — initial states stay readable (Fix 22).
      parallaxImgs.forEach((el) => {
        gsap.to(el, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        });
      });

      // Page signature: the ADU watermark drifts as the acronym is read.
      if (watermark) {
        gsap.to(watermark, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: watermark.parentElement ?? watermark,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.8,
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

// ── Section 1 — hero: "Built with intent" running downwards ─────────────────
function AduHero() {
  return (
    <section
      data-section="adu-hero"
      data-header-dark=""
      className="relative bg-black text-white"
      style={{ overflowX: "clip" }}
    >
      {/* CSS keyframe entry (LCP-safe): letters cascade down the plumb line. */}
      <style>{`
        @keyframes aduLetterIn {
          from { opacity: 0; transform: translateY(-0.35em); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes aduCueDrop {
          0%   { transform: scaleY(0); transform-origin: top; }
          45%  { transform: scaleY(1); transform-origin: top; }
          55%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adu-letter { animation: none !important; opacity: 1 !important; transform: none !important; }
          .adu-cue-line { animation: none !important; }
        }
      `}</style>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
        <div className="relative order-2 min-h-[46vh] overflow-hidden lg:order-1 lg:min-h-screen">
          <div className="adu-parallax absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
            <Image
              src="/images/projects/adu-exterior-new.jpg"
              alt="Modern detached ADU exterior for 828 Construction"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              onError={imgError}
              className="object-cover"
              style={{ filter: "contrast(1.04) saturate(1.05)" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:to-black/60" />
          <div className="absolute bottom-7 left-7 hidden lg:block">
            <span className="font-labels text-[9px] uppercase tracking-[0.2em] text-white/78">
              Detached ADU / South Bay scale
            </span>
          </div>
        </div>

        <div className="relative order-1 flex flex-col justify-center px-6 pb-14 pt-28 sm:px-10 lg:order-2 lg:px-14 lg:py-28">
          <Link
            href="/services"
            className="font-labels text-[10px] uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-white"
          >
            Back to services
          </Link>
          <span className="mt-9 block font-labels text-[10px] uppercase tracking-[0.24em] text-white/48">
            ADU Construction / CA License #{SITE.license}
          </span>

          <div className="mt-9 flex items-stretch gap-6 sm:gap-8">
            {/* Joe: "the phrase built with intent, but running downwards" */}
            <h1
              className="font-display font-bold leading-none tracking-tight text-[clamp(2.6rem,4.5vw,4.4rem)]"
              style={{ writingMode: "vertical-rl" }}
            >
              {HERO_PHRASE.split("").map((ch, i) => (
                <span
                  key={i}
                  className="adu-letter inline-block"
                  style={{
                    animation: `aduLetterIn 0.6s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.045}s both`,
                  }}
                >
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </h1>
            <div className="relative w-[2px] shrink-0 self-stretch bg-white/12" aria-hidden="true">
              <div className="adu-vline absolute inset-0 bg-[var(--color-accent-light)]" style={{ opacity: 0.9 }} />
            </div>
            <p className="max-w-md self-center text-[15px] leading-8 text-white/62 sm:text-base">
              {HERO_PARAGRAPH}
            </p>
          </div>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <a
              href={SITE.phoneHref}
              className="btn-shine btn-lift bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
            >
              Call {SITE.phone}
            </a>
            <Link
              href="/contact"
              className="border border-white/22 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:border-white"
            >
              Start ADU
            </Link>
            <div className="ml-auto hidden items-center gap-3 lg:flex" aria-hidden="true">
              <span className="font-labels text-[9px] uppercase tracking-[0.24em] text-white/60">
                Scroll
              </span>
              <span className="relative block h-10 w-px overflow-hidden bg-white/15">
                <span
                  className="adu-cue-line absolute inset-0 bg-white/70"
                  style={{ animation: "aduCueDrop 2.2s cubic-bezier(0.65,0,0.35,1) 1.4s infinite" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 2 — FAQ checkerboard (NS Perspectives grammar) ──────────────────
function FaqCard({
  faq,
  index,
  dark,
  stagger,
  className = "",
}: {
  faq: (typeof FAQS)[number];
  index: number;
  dark: boolean;
  stagger: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <article
      data-stagger={stagger}
      className={`adu-rise flex min-h-[16rem] flex-col justify-between border p-6 sm:p-7 lg:min-h-[19rem] ${
        dark ? "border-transparent bg-[#111] text-white" : "border-black/12 bg-white text-[#111]"
      } ${className}`}
    >
      <div>
        <span
          className={`font-numbers text-xs font-bold ${
            dark ? "text-white/72" : "text-[var(--color-accent)]"
          }`}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-4 font-display text-lg leading-snug sm:text-xl">{faq.q}</h3>
        <div
          id={panelId}
          role="region"
          className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <p className={`pt-4 text-sm leading-7 ${dark ? "text-white/62" : "text-black/60"}`}>
              {faq.a}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className={`group/faq flex min-h-11 items-center gap-2 font-labels text-[10px] uppercase tracking-[0.18em] transition-colors ${
            dark ? "text-white/65 hover:text-white" : "text-black/55 hover:text-black"
          }`}
        >
          {open ? "Close" : "Answer"}
          <span
            aria-hidden="true"
            className={`inline-flex h-6 w-6 items-center justify-center border text-sm transition-transform duration-300 ${
              dark ? "border-white/25" : "border-black/20"
            }`}
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            +
          </span>
        </button>
      </div>
    </article>
  );
}

function FaqPhotoCell({
  photo,
  stagger,
  className = "",
}: {
  photo: (typeof FAQ_PHOTOS)[number];
  stagger: number;
  className?: string;
}) {
  return (
    <div className={`relative min-h-[14rem] overflow-hidden lg:min-h-[19rem] ${className}`}>
      <div className="adu-clip absolute inset-0" data-gsap-reveal="true" data-stagger={stagger}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          onError={imgError}
          className="object-cover"
          style={{ filter: "contrast(1.05) saturate(1.05)" }}
        />
      </div>
    </div>
  );
}

function AduFaq() {
  return (
    <section
      data-section="adu-faq"
      data-header-light=""
      className="relative bg-[#f7f7f3] text-[#111]"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <span className="adu-rise block font-labels text-[10px] uppercase tracking-[0.22em] text-black/55">
          FAQ / Frequently asked questions
        </span>
        <h2
          className="adu-rise mt-5 max-w-4xl font-display font-light leading-[1.14] text-[clamp(1.8rem,3.2vw,3.4rem)]"
          data-stagger="0.08"
        >
          Whether your vision is fully defined or still evolving, 828
          Construction is here to help.
        </h2>
        <div
          className="adu-hairline mt-8 h-px w-24 bg-[var(--color-accent)]"
          style={{ opacity: 0.6 }}
          aria-hidden="true"
        />
        {/* Checkerboard: question cards interleaved with photo cells, exactly
            the alternating rhythm of the reference Joe pointed at. */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          <FaqCard faq={FAQS[0]} index={0} dark stagger={0} />
          <FaqPhotoCell photo={FAQ_PHOTOS[0]} stagger={0.1} className="hidden sm:block" />
          <FaqCard faq={FAQS[1]} index={1} dark={false} stagger={0.16} />
          <FaqCard faq={FAQS[2]} index={2} dark stagger={0.24} />
          <FaqCard faq={FAQS[3]} index={3} dark={false} stagger={0.32} className="lg:col-start-3" />
          <FaqPhotoCell photo={FAQ_PHOTOS[1]} stagger={0.4} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}

// ── Section 3 — what ADU means to 828 (acronym values + watermark drift) ────
function AduAcronym() {
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const activeIdx = useFocusIndex(rowRefs, 0.52);

  return (
    <section
      data-section="adu-acronym"
      data-header-dark=""
      className="relative bg-black text-white"
      style={{ overflowX: "clip" }}
    >
      {/* Page signature (PATTERNS.md): giant ADU watermark, whisper-quiet, drifting */}
      <div
        className="adu-watermark pointer-events-none absolute -right-6 top-1/2 select-none font-display font-bold leading-none tracking-tight text-white lg:right-6"
        style={{ fontSize: "clamp(11rem,26vw,22rem)", opacity: 0.04 }}
        aria-hidden="true"
      >
        ADU
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <span className="adu-rise block font-labels text-[10px] uppercase tracking-[0.22em] text-white/58">
          What we drive for
        </span>
        <h2 className="adu-rise mt-5 font-display font-light leading-[1.08] text-[clamp(1.8rem,3.2vw,3.4rem)]" data-stagger="0.08">
          What ADU means to 828.
        </h2>

        <div className="mt-12 lg:mt-16">
          {ACRONYM.map((item, i) => {
            const active = activeIdx === i;
            return (
              <div key={item.letter} className="relative">
                <div
                  className="adu-hairline h-px w-full bg-white/12"
                  data-stagger={String(i * 0.12)}
                  aria-hidden="true"
                />
                <div
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="adu-rise grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-4 py-8 sm:gap-x-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-x-16 lg:py-11"
                  data-stagger={String(i * 0.1)}
                >
                  <div className="flex items-baseline gap-5 sm:gap-7">
                    <span
                      className={`w-[0.75em] font-display font-bold leading-none tracking-tight transition-colors duration-500 text-[clamp(3.4rem,6.5vw,6rem)] ${
                        active ? "text-[var(--color-accent-light)]" : "text-white/[0.22]"
                      }`}
                      aria-hidden="true"
                    >
                      {item.letter}
                    </span>
                    <h3
                      className={`font-display leading-none transition-colors duration-500 text-[clamp(1.4rem,2.4vw,2.1rem)] ${
                        active ? "text-white" : "text-white/55"
                      }`}
                    >
                      {item.word}
                    </h3>
                  </div>
                  <p
                    className={`col-span-2 max-w-xl text-sm leading-7 transition-colors duration-500 lg:col-span-1 lg:text-[15px] lg:leading-8 ${
                      active ? "text-white/70" : "text-white/52"
                    }`}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="adu-hairline h-px w-full bg-white/12" data-stagger="0.36" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

// ── Section 4 — an invitation to work together ──────────────────────────────
function AduInvitation() {
  return (
    <section
      data-section="adu-invitation"
      data-header-dark=""
      className="relative border-t border-white/10 bg-[#0a0a0a] text-white"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-20">
          <div>
            <span className="adu-rise block font-labels text-[10px] uppercase tracking-[0.22em] text-white/58">
              Start here
            </span>
            <h2 className="adu-rise mt-5 font-display font-light leading-[1.1] text-[clamp(1.8rem,3.2vw,3.4rem)]" data-stagger="0.08">
              An invitation to work together
            </h2>
            <p className="adu-rise mt-7 max-w-md text-sm leading-7 text-white/55" data-stagger="0.16">
              If this resonates with your expectations, we welcome the
              opportunity to explore your project.
            </p>
            <div
              className="adu-hairline mt-10 h-px w-24 bg-[var(--color-accent)]"
              style={{ opacity: 0.7 }}
              aria-hidden="true"
            />
            <p className="adu-rise mt-8 font-display text-lg leading-snug text-white/88 lg:text-xl" data-stagger="0.2">
              Prepared to proceed with your vision?
            </p>
            <div className="adu-rise mt-7 flex flex-wrap gap-4" data-stagger="0.26">
              <a
                href={SITE.phoneHref}
                className="btn-shine btn-lift bg-white px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                Call {SITE.phone}
              </a>
              <Link
                href="/contact"
                className="border border-white/22 px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:border-white"
              >
                Talk through an ADU
              </Link>
            </div>
          </div>

          {/* Joe: the qualifying questions "in a finer print … finely written, nothing crazy" */}
          <div className="lg:pt-2">
            {QUALIFIERS.map((q, i) => (
              <div key={q} className="relative">
                <div
                  className="adu-hairline h-px w-full bg-white/10"
                  data-stagger={String(i * 0.1)}
                  aria-hidden="true"
                />
                <div
                  className="adu-rise grid grid-cols-[auto_1fr] items-baseline gap-5 py-6 sm:gap-7 lg:py-7"
                  data-stagger={String(0.06 + i * 0.1)}
                >
                  <span className="font-numbers text-xs font-bold text-white/72" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-7 text-white/65 lg:text-[15px]">{q}</p>
                </div>
              </div>
            ))}
            <div className="adu-hairline h-px w-full bg-white/10" data-stagger="0.46" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AduServiceContent() {
  const rootRef = useAduMotion();

  return (
    <div ref={rootRef} className="bg-black text-white">
      <AduHero />
      <AduFaq />
      <AduAcronym />
      <AduInvitation />
    </div>
  );
}
