"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICE_AREAS, SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import SectionMotionBackdrop from "@/components/system/SectionMotionBackdrop";
import AboutFlow from "@/components/about/AboutFlow";

gsap.registerPlugin(ScrollTrigger);

const proofStats = [
  { label: "In the Field", value: `Since '04` },
  { label: "License", value: `#${SITE.license}` },
  { label: "Base", value: "Torrance" },
];

// Joe's dictated card set (video IMG_1019): Communication / Intentions /
// Execution, body copy rewritten to fit per his explicit license.
const standards = [
  {
    number: "01",
    title: "Communication.",
    body: "Every project starts and ends with clear, honest dialogue. Homeowners always know what is happening, what comes next, and why it matters.",
  },
  {
    number: "02",
    title: "Intentions.",
    body: "Nothing here is built by accident. Materials, sequence, and budget are decided deliberately — with the finished home in mind before work begins.",
  },
  {
    number: "03",
    title: "Execution.",
    body: "Plans only matter when they are carried out with precision. The finish, the cleanup, and the details that remain are where the work proves itself.",
  },
];

// Joe's CRAFT acronym (video IMG_1020). `rest` completes the word out of its
// letter — Joe's literal sketch: "C R A F T down the side, the words come
// from it, like C→uriosity."
const craft = [
  {
    letter: "C",
    rest: "uriosity.",
    body: "Curiosity drives how 828 builds — digging deeper into details, uncovering smarter solutions to complex construction challenges.",
  },
  {
    letter: "R",
    rest: "elatability.",
    body: "Relatability guides our work — understanding each client's perspective so we can serve with clarity.",
  },
  {
    letter: "A",
    rest: "lignment.",
    body: "Alignment is where intent, design, and execution come together seamlessly — like the relationship between builder and client.",
  },
  {
    letter: "F",
    rest: "orged.",
    body: "Forged through experience and precision — 828 translates our clients' vision into remarkable spaces defined by design integrity and strategy.",
  },
  {
    letter: "T",
    rest: "ailored.",
    body: "Tailored to each client's vision — 828's approach ensures every detail is shaped through close collaboration between builder and owner, for a truly bespoke result.",
  },
];

function useReveal(sectionRef: React.RefObject<HTMLElement | null>, selector: string, start = "top 78%") {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const items = section.querySelectorAll<HTMLElement>(selector);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start, once: true },
        }
      );
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, [sectionRef, selector, start]);
}

// ── Hero — compact dossier: identity + immediate proof, no dead middle ─────
function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useReveal(sectionRef, "[data-hero-reveal]", "top 86%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { scale: 1.08 },
          {
            scale: 1,
            yPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.1 },
          }
        );
      }

      // Joe (IMG_1014): faded brand line spanning the screen.
      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          { xPercent: 1.5 },
          {
            xPercent: -3.5,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1.4 },
          }
        );
      }

      // Proof rows draw their separators as the page settles in.
      statRefs.current.forEach((row, i) => {
        if (!row) return;
        const line = row.querySelector<HTMLElement>("[data-stat-line]");
        if (!line) return;
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.9,
            delay: 0.25 + i * 0.14,
            ease: "power2.inOut",
            scrollTrigger: { trigger: section, start: "top 80%", once: true },
          }
        );
      });

      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleX: 0.18, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1 },
          }
        );
      }
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section=""
      className="relative grid bg-[#0a0a0a] text-white lg:min-h-[92svh] lg:grid-cols-[0.46fr_0.54fr]"
      style={{ overflowX: "clip" }}
    >
      {/* Dossier panel — one continuous composition, no dead middle */}
      <div className="relative z-10 flex flex-col justify-center gap-10 px-6 pb-14 pt-28 lg:px-12 lg:pb-20 lg:pt-32">
        <div>
          <p data-hero-reveal className="mb-6 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.3em] text-white/48">
            <span className="h-px w-7 bg-accent" aria-hidden="true" />
            About / 828 Construction
          </p>
          <h1 data-hero-reveal className="max-w-md font-editorial text-[clamp(2.4rem,3.4vw,3.6rem)] font-semibold leading-[0.98]">
            Where quality meets quiet luxury.
          </h1>
          <p data-hero-reveal className="mt-6 max-w-sm text-[clamp(1rem,1.15vw,1.12rem)] leading-relaxed text-white/64">
            Every home is shaped by decades of hands-on experience and building
            science, ensuring exceptional quality and performance.
          </p>
        </div>

        <div data-hero-reveal>
          {proofStats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => {
                statRefs.current[i] = el;
              }}
              className="relative flex items-baseline justify-between py-3.5"
            >
              <span data-stat-line className="absolute inset-x-0 top-0 h-px bg-white/12" aria-hidden="true" />
              <span className="font-labels text-[9px] uppercase tracking-[0.24em] text-white/40">{stat.label}</span>
              <span className="font-numbers text-sm text-white/90">{stat.value}</span>
            </div>
          ))}
          <div className="relative flex flex-wrap gap-x-7 gap-y-3 pt-5">
            <span data-stat-line className="absolute inset-x-0 top-0 h-px bg-white/12" aria-hidden="true" />
            {["Plans before promises", "Field-built judgment", "South Bay residential"].map((item) => (
              <span key={item} className="flex items-center gap-2.5">
                <span className="h-1 w-1 rotate-45 bg-accent" aria-hidden="true" />
                <span className="font-labels text-[8.5px] uppercase tracking-[0.2em] text-white/46">{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Photo plate */}
      <div className="relative min-h-[44svh] overflow-hidden border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
        <div ref={photoRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image
            src="/images/generated/about-planning-table.jpg"
            alt="Residential construction planning table with drawings and materials"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 54vw"
            className="object-cover"
            style={{ filter: "contrast(1.06) saturate(1.02) brightness(0.94)" }}
          />
        </div>
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 26%), linear-gradient(180deg, rgba(10,10,10,0.32) 0%, rgba(10,10,10,0) 30%, rgba(10,10,10,0.55) 100%)",
          }}
        />
      </div>

      <div
        ref={wordmarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[6%] z-20 select-none whitespace-nowrap text-center font-editorial font-bold uppercase leading-none text-white/[0.07]"
        style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)", letterSpacing: "0.08em", willChange: "transform" }}
      >
        828 Construction
      </div>

      <div ref={railRef} className="absolute bottom-0 left-0 z-20 h-px w-full bg-accent" aria-hidden="true" />
    </section>
  );
}

// Swappable portrait slot — drop /images/about/joe-portrait.jpg in and it
// renders on the next build/refresh; until then, a quiet pending plate holds
// the composition (existence checked server-side, no failed request).
function PortraitSlot({ hasPortrait }: { hasPortrait: boolean }) {
  const missing = !hasPortrait;

  return (
    <div className="relative overflow-hidden border border-white/12 bg-[#0d0d0d]" style={{ aspectRatio: "3 / 4" }}>
      {!missing && (
        <Image
          src="/images/about/joe-portrait.jpg"
          alt="Joe P, founder of 828 Construction"
          fill
          sizes="(max-width: 1024px) 88vw, 30vw"
          className="object-cover"
          style={{ filter: "contrast(1.05) saturate(1.0) brightness(0.95)" }}
        />
      )}
      {missing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/16 font-editorial text-xl text-white/55"
            aria-hidden="true"
          >
            JP
          </span>
          <span className="font-labels text-[8px] uppercase tracking-[0.26em] text-white/34">
            Portrait — coming soon
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/12 bg-black/55 px-4 py-3 backdrop-blur-sm">
        <span className="font-labels text-[8.5px] uppercase tracking-[0.22em] text-white/72">Joe P</span>
        <span className="font-labels text-[8.5px] uppercase tracking-[0.22em] text-white/40">Founder</span>
      </div>
    </div>
  );
}

// ── Builder profile — condensed: quote + portrait, standards pulled up tight ──
function OriginSection({ hasPortrait }: { hasPortrait: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const quoteLineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useReveal(sectionRef, "[data-origin-reveal]", "top 76%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (portraitRef.current) {
        gsap.fromTo(
          portraitRef.current,
          { clipPath: "inset(0% 0% 14% 0%)", y: 30 },
          {
            clipPath: "inset(0%)",
            y: 0,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 70%", once: true },
          }
        );
        gsap.to(portraitRef.current, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      }

      // The maroon quote rule draws down alongside the founder statement.
      if (quoteLineRef.current) {
        gsap.fromTo(
          quoteLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top 78%", end: "top 30%", scrub: 1 },
          }
        );
      }

      rowRefs.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 92%", end: "top 66%", scrub: 1.1 },
          }
        );
      });
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="" className="relative bg-[#050505] py-20 text-white lg:py-24" style={{ overflowX: "clip" }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(99,26,22,0.16),transparent_30%)]" />
      <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.15]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <p data-origin-reveal className="mb-10 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40 lg:mb-12">
          <span className="h-px w-7 bg-accent" aria-hidden="true" />
          The builder profile
        </p>
        <h2 className="sr-only">The builder profile</h2>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="relative pl-7 lg:pl-9">
              <span className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[2px] bg-white/10" aria-hidden="true">
                <span ref={quoteLineRef} className="absolute inset-0 block bg-accent" style={{ display: "block" }} />
              </span>
              <p data-origin-reveal className="font-editorial text-[clamp(1.4rem,2vw,1.9rem)] font-light leading-[1.34] text-white/88">
                828 Construction is guided by a founder with over two decades of
                hands-on experience in residential construction. This depth of
                knowledge — built from working directly alongside skilled
                tradesmen — shapes a precise understanding of how homes are built
                and perform.
              </p>
            </div>

            <div className="mt-12 border-t border-white/10 lg:mt-14">
              {standards.map((item, index) => (
                <div
                  key={item.number}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className="grid items-baseline gap-1.5 border-b border-white/10 py-6 sm:grid-cols-[3.2rem_12.5rem_1fr] sm:gap-5 lg:py-7"
                >
                  <span className="font-numbers text-[12px]" style={{ color: "var(--color-accent-light)" }}>
                    {item.number}
                  </span>
                  <h3 className="font-editorial text-[clamp(1.35rem,1.8vw,1.7rem)] font-semibold leading-none">
                    {item.title}
                  </h3>
                  <p className="max-w-xl text-sm leading-relaxed text-white/56">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <div
              ref={portraitRef}
              data-gsap-reveal="true"
              className="mx-auto w-full max-w-sm lg:ml-auto lg:mr-0 lg:max-w-[22rem]"
              style={{ willChange: "clip-path, transform" }}
            >
              <PortraitSlot hasPortrait={hasPortrait} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CRAFT — the /about signature: words complete out of their letters ──────
function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const restRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useReveal(sectionRef, "[data-craft-reveal]", "top 80%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Fix 14 discipline: initial states set here, cleared on mobile.
      restRefs.current.forEach((rest) => {
        if (rest) gsap.set(rest, { xPercent: -100, opacity: 0 });
      });

      if (!AnimationController.shouldAnimate()) {
        restRefs.current.forEach((rest) => {
          if (rest) gsap.set(rest, { xPercent: 0, opacity: 1 });
        });
        letterRefs.current.forEach((l) => l?.classList.add("text-accent"));
        return;
      }

      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { xPercent: 4 },
          {
            xPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5 },
          }
        );
      }

      // Each word slides out of its own letter as the row enters — Joe's
      // sketch made literal. The letter ignites maroon as the word escapes.
      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const rest = restRefs.current[index];
        const letter = letterRefs.current[index];

        if (rest) {
          gsap.fromTo(
            rest,
            { xPercent: -100, opacity: 0 },
            {
              xPercent: 0,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: row, start: "top 86%", end: "top 58%", scrub: 0.9 },
            }
          );
        }

        gsap.fromTo(
          row.querySelector("[data-craft-body]"),
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 82%", end: "top 54%", scrub: 1 },
          }
        );

        ScrollTrigger.create({
          trigger: row,
          start: "top 70%",
          onEnter: () => letter?.classList.add("text-accent"),
          onLeaveBack: () => letter?.classList.remove("text-accent"),
        });
      });
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section=""
      data-header-light=""
      className="relative bg-white py-20 text-black lg:py-24"
      style={{ overflowX: "clip" }}
    >
      <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.1]" />

      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[3%] right-[-2%] z-0 select-none whitespace-nowrap font-editorial font-bold uppercase leading-none text-black/[0.03]"
        style={{ fontSize: "clamp(6rem, 17vw, 15rem)", letterSpacing: "0.02em", willChange: "transform" }}
      >
        Craft
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <div>
            <p data-craft-reveal className="mb-5 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.28em] text-black/42">
              <span className="h-px w-7 bg-accent" aria-hidden="true" />
              Method
            </p>
            <h2 data-craft-reveal className="font-editorial text-[clamp(1.9rem,2.6vw,2.5rem)] font-light leading-[1.05]">
              The principles behind the work.
            </h2>
          </div>
        </div>

        <div className="border-t border-black/10">
          {craft.map((item, index) => (
            <div
              key={item.letter}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              className="grid items-center gap-3 border-b border-black/10 py-6 lg:grid-cols-[minmax(17rem,0.62fr)_1fr] lg:gap-10 lg:py-7"
            >
              <h3 className="flex items-baseline font-editorial text-[clamp(2.6rem,4.6vw,4.4rem)] font-semibold leading-[0.94]">
                <span
                  ref={(el) => {
                    letterRefs.current[index] = el;
                  }}
                  className="text-black/85 transition-colors duration-500"
                >
                  {item.letter}
                </span>
                <span
                  className="inline-block overflow-hidden"
                  style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
                >
                  <span
                    ref={(el) => {
                      restRefs.current[index] = el;
                    }}
                    className="inline-block"
                    style={{ willChange: "transform" }}
                  >
                    {item.rest}
                  </span>
                </span>
              </h3>
              <p data-craft-body className="max-w-2xl text-[clamp(0.96rem,1.1vw,1.05rem)] leading-relaxed text-black/62">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── South Bay — tight horizon band: marquee + glass card, no dead height ───
function SouthBaySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);

  useReveal(sectionRef, "[data-area-copy]", "top 78%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (compassRef.current) {
        gsap.to(compassRef.current, {
          rotate: 22,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  const marqueeRow = (duration: string, reverse = false) => (
    <div className="overflow-hidden" aria-hidden="true">
      <div
        className="flex w-max items-center whitespace-nowrap"
        style={{
          animation: `marqueeScroll ${duration} linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {SERVICE_AREAS.map((area) => (
              <span key={`${copy}-${area}`} className="flex items-center">
                <span className="font-editorial text-[clamp(2rem,4.2vw,4rem)] font-semibold uppercase leading-none text-white/[0.08]">
                  {area}
                </span>
                <span className="mx-8 h-1.5 w-1.5 rotate-45 bg-accent/45 lg:mx-12" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      data-section=""
      className="relative flex items-center bg-[#070707] py-20 text-white lg:py-24"
      style={{ overflowX: "clip" }}
    >
      <div
        className="absolute inset-0 opacity-[0.1]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "78px 78px",
        }}
      />
      <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.14]" />
      <div ref={compassRef} className="pointer-events-none absolute -left-24 top-1/2 hidden h-[22rem] w-[22rem] -translate-y-1/2 rounded-full border border-white/8 lg:block">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/6" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/6" />
      </div>

      {/* Joe (IMG_1024): cities rolling across the screen — the horizon layer. */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 flex-col gap-6 lg:gap-9">
        {marqueeRow("74s")}
        {marqueeRow("92s", true)}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div
          data-area-copy
          className="max-w-md border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md lg:ml-auto lg:p-10"
        >
          <p className="mb-5 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.28em] text-white/44">
            <span className="h-px w-7 bg-accent" aria-hidden="true" />
            South Bay native
          </p>
          <h2 className="font-editorial text-[clamp(1.9rem,2.8vw,2.7rem)] font-semibold leading-[1.02]">
            Looking for a local contractor?
          </h2>
          <p className="mt-5 text-[clamp(1rem,1.2vw,1.1rem)] leading-relaxed text-white/64">
            828 Construction — servicing the South Bay for over two decades.
          </p>
        </div>

        <ul className="sr-only">
          {SERVICE_AREAS.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── CTA — split panel: photo plate left, black invitation panel right ──────
function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLSpanElement>(null);

  useReveal(sectionRef, "[data-cta-reveal]", "top 72%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.07 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.1 },
          }
        );
      }
      if (seamRef.current) {
        gsap.fromTo(
          seamRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top 78%", end: "top 20%", scrub: 1 },
          }
        );
      }
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="" className="relative grid bg-black text-white lg:grid-cols-2" style={{ overflowX: "clip" }}>
      <div className="relative min-h-[40svh] overflow-hidden lg:min-h-[68svh]">
        <div ref={imageRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image
            src="/images/generated/home-about-workbench.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            style={{ filter: "contrast(1.06) saturate(1.02) brightness(0.92)" }}
          />
        </div>
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)" }}
        />
      </div>

      <div className="relative flex items-center px-6 py-18 lg:px-16 lg:py-24">
        <span ref={seamRef} className="absolute left-0 top-0 hidden h-full w-px bg-accent/60 lg:block" aria-hidden="true" />
        <div className="max-w-lg">
          <p data-cta-reveal className="mb-6 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.28em] text-white/42">
            <span className="h-px w-7 bg-accent" aria-hidden="true" />
            The first conversation
          </p>
          <h2 data-cta-reveal className="font-editorial text-[clamp(2.1rem,3.2vw,3.1rem)] font-semibold leading-[1.02]">
            For those who value experience and quality.
          </h2>
          <p data-cta-reveal className="mt-7 max-w-md text-[clamp(1rem,1.2vw,1.12rem)] leading-relaxed text-white/66">
            Every exceptional home begins with a conversation. By listening
            first, we transform your vision into thoughtfully crafted reality.
          </p>
          <div data-cta-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
            >
              Initial Contact
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center border border-white/22 px-8 py-4 font-numbers text-sm tracking-wide text-white transition hover:border-white/42 hover:bg-white/[0.04]"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutContent({ hasPortrait = false }: { hasPortrait?: boolean }) {
  return (
    <AboutFlow>
      <AboutHero />
      <OriginSection hasPortrait={hasPortrait} />
      <CraftSection />
      <SouthBaySection />
      <AboutCTA />
    </AboutFlow>
  );
}
