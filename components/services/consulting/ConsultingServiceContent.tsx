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
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { revealOnVisible } from "@/utils/revealOnVisible";

gsap.registerPlugin(ScrollTrigger);

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=";

function imgError(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

// Verbatim from Joe's consulting video batch
// (docs/828_CONSULTING_JOE_FEEDBACK_2026-07-09.md, cleanups documented there).
// Words are frozen.
const HERO_H1 = "Building solutions beyond the blueprint.";
const HERO_PARAGRAPH =
  "Elevating the construction experience through guidance, helping homeowners make strategic decisions that preserve their time, budget and peace of mind.";

const SOLUTIONS_HEADLINE = "Delivering considerate solutions.";
const SOLUTIONS_BODY =
  "Understanding your project budget timeline, goals, and design vision, what challenges you are currently facing through careful evaluation and clear communication. We deliver responsible tailored solutions that align with your project's unique needs.";

// Joe's phone notes: "What included changes → Benefits", 01–05.
const BENEFITS = [
  "Early detection of issues",
  "Creative problem solved",
  "Expert insight for preventative care",
  "Design & structure enhancement / assessments",
  "Peace of mind",
];

const FAQ_INTRO =
  "As a general contractor offering consulting and home inspection servicing, we provide the peace of mind by uncovering hidden issues, ensuring structural integrity, and delivering tailored solutions that align with your vision.";

// Questions posed TO the visitor — always visible, no accordions.
// (Page signature: large-format self-selection prompts.)
const QUESTIONS = [
  "What challenge or uncertainties are you currently experiencing with your home project that require expert guidance?",
  "What outcomes or improvements are you seeking through professional construction, consulting, and inspection services?",
  "How important is clarity, accuracy, and expert oversight in achieving your project's success and long-term value?",
];

const CTA_HEADLINE = "Engineered solutions tailored to your project";

const FAQ_PHOTOS = [
  {
    src: "/images/projects/consulting-inspection.jpg",
    alt: "828 Construction consulting inspection at a South Bay property",
  },
  {
    src: "/images/projects/consulting-blueprints.jpg",
    alt: "Construction blueprints reviewed during an 828 consulting session",
  },
];

// Live-rect focus selection (sticky-proof — PATTERNS.md Fix 22 timing rule).
function useFocusIndex(
  refs: React.MutableRefObject<Array<HTMLElement | null>>,
  focusRatio = 0.55
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

function useConsultingMotion() {
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
      const rises = gsap.utils.toArray<HTMLElement>(".con-rise");
      const clips = gsap.utils.toArray<HTMLElement>(".con-clip");
      const hairlines = gsap.utils.toArray<HTMLElement>(".con-hairline");
      const parallaxImgs = gsap.utils.toArray<HTMLElement>(".con-parallax");

      // Initial states live HERE, not in JSX (Fix 14). Rises use opacity, NOT
      // autoAlpha — visibility:hidden pulls headings out of the a11y tree.
      gsap.set(rises, { opacity: 0, y: 26 });
      gsap.set(clips, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(hairlines, { scaleX: 0, transformOrigin: "left" });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(rises, { opacity: 1, y: 0 });
        gsap.set(clips, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(hairlines, { scaleX: 1 });
        return;
      }

      // One-shot entrances key off real visibility (Fix 22), never scroll math.
      revealCleanups.push(
        revealOnVisible(rises, (el) => {
          const delay = parseFloat((el as HTMLElement).dataset.stagger ?? "0");
          gsap.to(el, { opacity: 1, y: 0, duration: 0.85, delay, ease: "power3.out" });
        })
      );
      // Fully-clipped nodes never intersect (Fix 23) — observe the parent.
      revealCleanups.push(
        revealOnVisible(
          clips.map((el) => el.parentElement ?? el),
          (wrapper) => {
            const el =
              (wrapper as HTMLElement).querySelector<HTMLElement>(".con-clip") ??
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

// ── Section 1 — hero: beyond the blueprint ───────────────────────────────────
function ConsultingHero() {
  return (
    <section
      data-section="consulting-hero"
      data-header-light=""
      className="relative bg-[#f7f7f3] text-[#141414]"
      style={{ overflowX: "clip" }}
    >
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
        <div className="relative flex flex-col justify-center px-6 pb-14 pt-28 sm:px-10 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-14 lg:py-28">
          <Link
            href="/services"
            className="font-labels text-[10px] uppercase tracking-[0.18em] text-black/65 transition-colors hover:text-black"
          >
            Back to services
          </Link>
          <span className="mt-9 block font-labels text-[10px] uppercase tracking-[0.24em] text-black/65">
            Construction Consulting / CA License #{SITE.license}
          </span>
          {/* LCP anchor: renders on first paint, no hidden initial state */}
          <h1 className="mt-8 max-w-[13ch] font-display font-bold leading-[1.04] tracking-tight text-[clamp(2.2rem,4.5vw,4.6rem)]">
            {HERO_H1}
          </h1>
          <div
            className="con-hairline mt-8 h-px w-24 bg-[var(--color-accent)]"
            style={{ opacity: 0.65 }}
            aria-hidden="true"
          />
          <p className="mt-7 max-w-lg text-[15px] leading-8 text-black/70 sm:text-base">
            {HERO_PARAGRAPH}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={SITE.phoneHref}
              className="btn-shine btn-lift bg-black px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Call {SITE.phone}
            </a>
            <Link
              href="/contact"
              className="border border-black/20 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:border-black"
            >
              Request consulting
            </Link>
          </div>
        </div>

        {/* Photograph flush to the right edge, riding under the header */}
        <div className="relative min-h-[48vh] overflow-hidden lg:min-h-screen">
          <div className="con-parallax absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
            <Image
              src="/images/generated/services-consulting-table-v2.png"
              alt="Consulting session over construction plans and material samples"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              onError={imgError}
              className="object-cover"
              style={{ filter: "contrast(1.04) saturate(1.04)" }}
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-black/10"
            aria-hidden="true"
          />
          <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8">
            <span className="font-labels text-[9px] uppercase tracking-[0.2em] text-white/85">
              Expert advisory / South Bay
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 2 — considerate solutions + the benefits ledger ─────────────────
function SolutionsSection() {
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const activeIdx = useFocusIndex(rowRefs, 0.55);

  return (
    <section
      data-section="consulting-solutions"
      data-header-dark=""
      className="relative bg-black text-white"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-20 lg:px-12 lg:py-28">
        <div>
          <span className="con-rise block font-labels text-[10px] uppercase tracking-[0.24em] text-white/60">
            Field-based advisory
          </span>
          <h2
            className="con-rise mt-5 max-w-md font-display font-light leading-[1.1] text-[clamp(1.8rem,3.2vw,3.4rem)]"
            data-stagger="0.08"
          >
            {SOLUTIONS_HEADLINE}
          </h2>
          <div
            className="con-hairline mt-9 h-px w-24 bg-[var(--color-accent)]"
            style={{ opacity: 0.7 }}
            aria-hidden="true"
          />
          <p
            className="con-rise mt-8 max-w-md text-[15px] leading-8 text-white/62"
            data-stagger="0.14"
          >
            {SOLUTIONS_BODY}
          </p>
        </div>

        {/* Benefits ledger — rows ignite in the focus band, maroon rail tracks */}
        <div className="relative lg:pt-2">
          <span className="con-rise block font-labels text-[10px] uppercase tracking-[0.22em] text-white/58">
            Benefits
          </span>
          <div className="relative mt-6">
            <div
              className="absolute -left-5 top-0 hidden h-full w-px bg-white/10 lg:block xl:-left-8"
              aria-hidden="true"
            />
            <div
              className="absolute -left-5 top-0 hidden w-px bg-[var(--color-accent)] lg:block xl:-left-8"
              style={{
                height: `${((activeIdx + 1) / BENEFITS.length) * 100}%`,
                opacity: 0.85,
                transition: "height 650ms cubic-bezier(0.16,1,0.3,1)",
              }}
              aria-hidden="true"
            />
            {BENEFITS.map((benefit, i) => {
              const active = activeIdx === i;
              return (
                <div key={benefit} className="relative">
                  <div
                    className="con-hairline h-px w-full bg-white/10"
                    data-stagger={String(i * 0.08)}
                    aria-hidden="true"
                  />
                  <div
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    className="con-rise grid grid-cols-[auto_1fr] items-baseline gap-5 py-6 sm:gap-8 lg:py-7"
                    data-stagger={String(0.05 + i * 0.08)}
                  >
                    <span
                      className={`font-numbers text-[15px] font-bold transition-colors duration-500 ${
                        active ? "text-[var(--color-accent-light)]" : "text-white/55"
                      }`}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`font-display leading-snug transition-colors duration-500 text-[clamp(1.15rem,1.9vw,1.7rem)] ${
                        active ? "text-white" : "text-white/55"
                      }`}
                    >
                      {benefit}
                    </h3>
                  </div>
                </div>
              );
            })}
            <div className="con-hairline h-px w-full bg-white/10" data-stagger="0.45" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3 — questions and answers (card grid, ADU/Remediation grammar) ──
// Page signature: the questions are posed TO the visitor and stay permanently
// visible — no accordions. Self-selection prompts in large format.
function QuestionCard({
  question,
  index,
  dark,
  stagger,
  className = "",
}: {
  question: string;
  index: number;
  dark: boolean;
  stagger: number;
  className?: string;
}) {
  return (
    <article
      data-stagger={stagger}
      className={`con-rise flex min-h-[15rem] flex-col justify-between border p-6 sm:p-7 lg:min-h-[19rem] ${
        dark ? "border-transparent bg-[#111] text-white" : "border-black/12 bg-white text-[#111]"
      } ${className}`}
    >
      <span
        className={`font-numbers text-xs font-bold ${
          dark ? "text-white/72" : "text-[var(--color-accent)]"
        }`}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-5 font-display font-normal leading-snug text-[clamp(1.15rem,1.7vw,1.5rem)]">
        {question}
      </h3>
      <div className="mt-6">
        <span
          className={`font-labels text-[9px] uppercase tracking-[0.2em] ${
            dark ? "text-white/60" : "text-black/55"
          }`}
        >
          Worth a conversation
        </span>
      </div>
    </article>
  );
}

function QuestionsSection() {
  return (
    <section
      data-section="consulting-questions"
      data-header-light=""
      className="relative bg-[#f7f7f3] text-[#111]"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <span className="con-rise block font-labels text-[10px] uppercase tracking-[0.22em] text-black/55">
          Questions and answers
        </span>
        <h2
          className="con-rise mt-5 max-w-4xl font-display font-light leading-[1.2] text-[clamp(1.5rem,2.6vw,2.7rem)]"
          data-stagger="0.08"
        >
          {FAQ_INTRO}
        </h2>
        <div
          className="con-hairline mt-8 h-px w-24 bg-[var(--color-accent)]"
          style={{ opacity: 0.6 }}
          aria-hidden="true"
        />
        {/* Checkerboard: question cards interleaved with photo cells */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          <QuestionCard question={QUESTIONS[0]} index={0} dark stagger={0} className="lg:col-span-2" />
          <div className="relative hidden min-h-[15rem] overflow-hidden sm:block lg:min-h-[19rem]">
            <div className="con-clip absolute inset-0" data-gsap-reveal="true" data-stagger="0.1">
              <Image
                src={FAQ_PHOTOS[0].src}
                alt={FAQ_PHOTOS[0].alt}
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
          <QuestionCard question={QUESTIONS[1]} index={1} dark={false} stagger={0.16} />
          <div className="relative hidden min-h-[15rem] overflow-hidden lg:block lg:min-h-[19rem]">
            <div className="con-clip absolute inset-0" data-gsap-reveal="true" data-stagger="0.22">
              <Image
                src={FAQ_PHOTOS[1].src}
                alt={FAQ_PHOTOS[1].alt}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 0px, 25vw"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                onError={imgError}
                className="object-cover"
                style={{ filter: "contrast(1.05) saturate(1.05)" }}
              />
            </div>
          </div>
          <QuestionCard
            question={QUESTIONS[2]}
            index={2}
            dark
            stagger={0.3}
            className="sm:col-span-2 lg:col-span-3"
          />
        </div>
      </div>
    </section>
  );
}

// ── Section 4 — engineered solutions (clean statement band, no ornaments) ───
function ConsultingCta() {
  return (
    <section
      data-section="consulting-cta"
      data-header-dark=""
      className="relative bg-black text-white"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-12 lg:pb-32 lg:pt-28">
        <span className="con-rise block font-labels text-[10px] uppercase tracking-[0.22em] text-white/58">
          Start the conversation
        </span>
        <h2
          className="con-rise mt-6 max-w-3xl font-display font-light leading-[1.12] text-[clamp(1.9rem,3.4vw,3.6rem)]"
          data-stagger="0.08"
        >
          {CTA_HEADLINE}
        </h2>
        <div
          className="con-hairline mt-10 h-px w-28 bg-[var(--color-accent)]"
          style={{ opacity: 0.75 }}
          aria-hidden="true"
        />
        <div className="con-rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" data-stagger="0.16">
          <a
            href={SITE.phoneHref}
            className="group inline-flex items-baseline gap-3 font-display text-lg text-white/85 transition-colors hover:text-white lg:text-xl"
          >
            Call {SITE.phone}
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </a>
          <Link
            href="/contact"
            className="font-labels text-[10px] uppercase tracking-[0.18em] text-white/65 underline decoration-white/25 underline-offset-8 transition-colors hover:text-white hover:decoration-[var(--color-accent)]"
          >
            Request consulting
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ConsultingServiceContent() {
  const rootRef = useConsultingMotion();

  return (
    <div ref={rootRef} className="bg-black">
      <ConsultingHero />
      <SolutionsSection />
      <QuestionsSection />
      <ConsultingCta />
    </div>
  );
}
