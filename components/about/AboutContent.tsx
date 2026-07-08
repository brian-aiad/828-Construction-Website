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

// Joe's CRAFT acronym (video IMG_1020, from his typed notes; grammar cleaned,
// meaning preserved — see docs/828_ABOUT_JOE_FEEDBACK_2026-06.md).
const craft = [
  {
    letter: "C",
    title: "Curiosity.",
    body: "Curiosity drives how 828 builds — digging deeper into details, uncovering smarter solutions to complex construction challenges.",
  },
  {
    letter: "R",
    title: "Relatability.",
    body: "Relatability guides our work — understanding each client's perspective so we can serve with clarity.",
  },
  {
    letter: "A",
    title: "Alignment.",
    body: "Alignment is where intent, design, and execution come together seamlessly — like the relationship between builder and client.",
  },
  {
    letter: "F",
    title: "Forged.",
    body: "Forged through experience and precision — 828 translates our clients' vision into remarkable spaces defined by design integrity and strategy.",
  },
  {
    letter: "T",
    title: "Tailored.",
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

// ── Hero — NS-style asymmetric split: dossier panel left, photo right ──────
function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { scale: 1.08, yPercent: 0 },
          {
            scale: 1,
            yPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1.1,
            },
          }
        );
      }

      // Joe (IMG_1014): "828 Construction that spans across the whole screen
      // in the backdrop, slightly faded" — rides quietly across the seam.
      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          { xPercent: 1.5 },
          {
            xPercent: -3.5,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1.4,
            },
          }
        );
      }

      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleX: 0.18, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
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
      className="relative grid min-h-[100svh] bg-[#0a0a0a] text-white lg:grid-cols-[0.46fr_0.54fr]"
      style={{ overflowX: "clip" }}
    >
      {/* Dossier panel */}
      <div className="relative z-10 flex min-h-[54svh] flex-col justify-between px-6 pb-12 pt-28 lg:min-h-full lg:px-12 lg:pb-16 lg:pt-32">
        <div className="relative">
          <p className="mb-7 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.3em] text-white/48">
            <span className="h-px w-7 bg-accent" aria-hidden="true" />
            About / 828 Construction
          </p>
          <h1 className="max-w-md font-editorial text-[clamp(2.5rem,3.5vw,3.7rem)] font-semibold leading-[0.98]">
            Where quality meets quiet luxury.
          </h1>
          <p className="mt-8 max-w-sm text-[clamp(1rem,1.15vw,1.12rem)] leading-relaxed text-white/62">
            Every home is shaped by decades of hands-on experience and building
            science, ensuring exceptional quality and performance.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="border-t border-white/12">
            {proofStats.map((stat) => (
              <div key={stat.label} className="flex items-baseline justify-between border-b border-white/12 py-4">
                <span className="font-labels text-[9px] uppercase tracking-[0.24em] text-white/40">
                  {stat.label}
                </span>
                <span className="font-numbers text-sm text-white/90">{stat.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            {["Plans before promises", "Field-built judgment", "South Bay residential"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="h-1 w-1 rotate-45 bg-accent" aria-hidden="true" />
                <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/44">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo plate */}
      <div className="relative min-h-[46svh] overflow-hidden border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
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

      {/* Brand wordmark riding across the seam */}
      <div
        ref={wordmarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[7%] z-20 select-none whitespace-nowrap text-center font-editorial font-bold uppercase leading-none text-white/[0.07]"
        style={{ fontSize: "clamp(3rem, 7.5vw, 7.5rem)", letterSpacing: "0.08em", willChange: "transform" }}
      >
        828 Construction
      </div>

      <div ref={railRef} className="absolute bottom-0 left-0 z-20 h-px w-full bg-accent" aria-hidden="true" />
    </section>
  );
}

// ── Builder profile — magazine editorial: pull-quote + offset crops + index rows ──
function OriginSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const insetRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useReveal(sectionRef, "[data-origin-reveal]", "top 74%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: "inset(0% 0% 12% 0%)", y: 36 },
          {
            clipPath: "inset(0%)",
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 70%", once: true },
          }
        );
        gsap.to(imageRef.current.querySelector("img"), {
          yPercent: -7,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      }

      if (insetRef.current) {
        gsap.fromTo(
          insetRef.current,
          { y: 44 },
          {
            y: -14,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.9 },
          }
        );
      }

      // Index rows read in one at a time as the visitor scrolls past them.
      rowRefs.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 90%", end: "top 62%", scrub: 1.1 },
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
    <section ref={sectionRef} data-section="" className="relative bg-[#050505] py-24 text-white lg:py-36" style={{ overflowX: "clip" }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(99,26,22,0.16),transparent_30%)]" />
      <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.15]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <p data-origin-reveal className="mb-14 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40 lg:mb-20">
          <span className="h-px w-7 bg-accent" aria-hidden="true" />
          The builder profile
        </p>
        <h2 className="sr-only">The builder profile</h2>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 lg:pr-6">
            <p
              data-origin-reveal
              className="border-l-2 border-accent pl-7 font-editorial text-[clamp(1.45rem,2.15vw,2.05rem)] font-light leading-[1.32] text-white/88 lg:pl-9"
            >
              828 Construction is guided by a founder with over two decades of
              hands-on experience in residential construction. This depth of
              knowledge — built from working directly alongside skilled
              tradesmen — shapes a precise understanding of how homes are built
              and perform.
            </p>
            <div data-origin-reveal className="mt-10 hidden max-w-[13rem] border-t border-white/12 pt-4 lg:block">
              <p className="font-labels text-[8px] uppercase tracking-[0.22em] text-white/38">Observed</p>
              <p className="mt-3 font-editorial text-2xl leading-none text-white/85">Not assumed.</p>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div
              ref={imageRef}
              data-gsap-reveal="true"
              className="relative ml-auto w-full overflow-hidden border border-white/10 bg-white/[0.03] lg:w-[74%]"
              style={{ aspectRatio: "4 / 5", willChange: "clip-path, transform" }}
            >
              <Image
                src="/images/generated/about-framing-interior.jpg"
                alt="Clean residential framing and construction interior"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover"
                style={{ filter: "contrast(1.04) saturate(0.98) brightness(0.9)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>

            <div className="mt-6 flex items-start justify-between gap-6 lg:ml-auto lg:w-[74%]">
              <div className="max-w-[16rem] border-l border-white/22 pl-4">
                <p className="font-labels text-[8px] uppercase tracking-[0.24em] text-white/42">
                  Framing / sequence / control
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/68">
                  Clean sites are planned sites. The quality shows before the
                  finishes arrive.
                </p>
              </div>
              <span className="pt-1 font-numbers text-[10px] uppercase tracking-[0.22em] text-white/40">
                Field standard
              </span>
            </div>

            <div
              ref={insetRef}
              className="absolute left-0 top-[52%] hidden w-[38%] overflow-hidden border-[6px] border-[#050505] lg:block"
              style={{ aspectRatio: "4 / 3", willChange: "transform" }}
            >
              <Image
                src="/images/generated/home-process-materials.png"
                alt="Construction material samples arranged for selection"
                fill
                sizes="18vw"
                className="object-cover"
                style={{ filter: "contrast(1.05) saturate(1.02) brightness(0.9)" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-20 lg:mt-28">
          <div className="border-t border-white/10">
            {standards.map((item, index) => (
              <div
                key={item.number}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="grid items-baseline gap-2 border-b border-white/10 py-8 sm:grid-cols-[4.5rem_15rem_1fr] sm:gap-6 lg:py-10"
              >
                <span className="font-numbers text-sm" style={{ color: "var(--color-accent-light)" }}>
                  {item.number}
                </span>
                <h3 className="font-editorial text-[clamp(1.5rem,2vw,1.9rem)] font-semibold leading-none">
                  {item.title}
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-white/56">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CRAFT — the /about signature: watermark drift + igniting letter rail ──
function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useReveal(sectionRef, "[data-craft-reveal]", "top 78%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      // About signature (PATTERNS.md): CRAFT watermark horizontal drift scrub.
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

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 88%", end: "top 56%", scrub: 1.1 },
          }
        );

        const letter = letterRefs.current[index];
        const tick = tickRefs.current[index];
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          onEnter: () => {
            letter?.classList.add("text-accent");
            if (tick) gsap.to(tick, { width: 26, duration: 0.45, ease: "power2.out" });
          },
          onLeaveBack: () => {
            letter?.classList.remove("text-accent");
            if (tick) gsap.to(tick, { width: 0, duration: 0.3, ease: "power2.in" });
          },
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
      className="relative bg-white py-24 text-black lg:py-36"
      style={{ overflowX: "clip" }}
    >
      <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.11]" />

      {/* Joe (IMG_1020): "The word craft dropped in the background, bold." */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[4%] right-[-3%] z-0 select-none whitespace-nowrap font-editorial font-bold uppercase leading-none text-black/[0.035]"
        style={{ fontSize: "clamp(7rem, 21vw, 18rem)", letterSpacing: "0.02em", willChange: "transform" }}
      >
        Craft
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.6fr_0.4fr] lg:items-start lg:gap-10">
          <div className="min-w-0 lg:order-1">
            <p data-craft-reveal className="mb-12 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.28em] text-black/42 lg:mb-16">
              <span className="h-px w-7 bg-accent" aria-hidden="true" />
              Method
            </p>
            <div className="border-t border-black/10">
              {craft.map((item, index) => (
                <div
                  key={item.letter}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className="grid items-baseline gap-2 border-b border-black/10 py-9 sm:grid-cols-[4.5rem_14rem_1fr] sm:gap-6 lg:py-11"
                >
                  <span className="flex items-center gap-3 font-numbers text-[11px] uppercase tracking-[0.2em] text-black/38">
                    {item.letter}—0{index + 1}
                  </span>
                  <div>
                    <span
                      ref={(el) => {
                        tickRefs.current[index] = el;
                      }}
                      className="mb-3 block h-[2px] w-0 bg-accent"
                      aria-hidden="true"
                    />
                    <h3 className="font-editorial text-[clamp(1.5rem,2.1vw,2rem)] font-semibold leading-none">
                      {item.title}
                    </h3>
                  </div>
                  <p className="max-w-2xl text-[clamp(0.96rem,1.1vw,1.05rem)] leading-relaxed text-black/62">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:order-2 lg:sticky lg:top-32 lg:text-right">
            <h2 data-craft-reveal className="font-editorial text-[clamp(1.9rem,2.6vw,2.5rem)] font-light leading-[1.05]">
              The principles behind the work.
            </h2>
            <div className="mt-10 hidden flex-col gap-1 lg:flex lg:items-end" aria-hidden="true">
              {craft.map((item, index) => (
                <span
                  key={item.letter}
                  ref={(el) => {
                    letterRefs.current[index] = el;
                  }}
                  className="font-editorial text-[clamp(2.6rem,3.8vw,3.8rem)] font-semibold leading-[0.96] text-black/20 transition-colors duration-500"
                >
                  {item.letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── South Bay — horizon marquee band with floating glass card ──────────────
function SouthBaySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);

  useReveal(sectionRef, "[data-area-copy]", "top 74%");

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
                <span className="font-editorial text-[clamp(2.1rem,4.6vw,4.4rem)] font-semibold uppercase leading-none text-white/[0.08]">
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
      className="relative flex min-h-[58svh] items-center bg-[#070707] py-20 text-white lg:min-h-[78svh] lg:py-36"
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
      <div ref={compassRef} className="pointer-events-none absolute -left-28 top-16 hidden h-[30rem] w-[30rem] rounded-full border border-white/8 lg:block">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/6" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/6" />
      </div>

      {/* Joe (IMG_1024): cities rolling across the screen in the background,
          spanning the whole screen — the horizon layer. */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 flex-col gap-7 lg:gap-12">
        {marqueeRow("74s")}
        {marqueeRow("92s", true)}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div
          data-area-copy
          className="max-w-md border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md lg:ml-auto lg:p-11"
        >
          <p className="mb-6 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.28em] text-white/44">
            <span className="h-px w-7 bg-accent" aria-hidden="true" />
            South Bay native
          </p>
          <h2 className="font-editorial text-[clamp(2rem,3vw,2.9rem)] font-semibold leading-[1.02]">
            Looking for a local contractor?
          </h2>
          <p className="mt-6 text-[clamp(1rem,1.2vw,1.12rem)] leading-relaxed text-white/64">
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
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="" className="relative grid bg-black text-white lg:grid-cols-2" style={{ overflowX: "clip" }}>
      <div className="relative min-h-[42svh] overflow-hidden lg:min-h-[74svh]">
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

      <div className="relative flex items-center px-6 py-20 lg:px-16 lg:py-28">
        <span className="absolute left-0 top-0 hidden h-full w-px bg-accent/60 lg:block" aria-hidden="true" />
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

export default function AboutContent() {
  return (
    <AboutFlow>
      <AboutHero />
      <OriginSection />
      <CraftSection />
      <SouthBaySection />
      <AboutCTA />
    </AboutFlow>
  );
}
