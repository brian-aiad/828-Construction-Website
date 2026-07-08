"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICE_AREAS, SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";
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

function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          scale: 1.08,
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.15,
          },
        });
      }

      // Joe (IMG_1014): "828 Construction that spans across the whole screen
      // in the backdrop, slightly faded" — slow counter-drift ties it to scroll.
      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          { xPercent: 2 },
          {
            xPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1.3,
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
    <section ref={sectionRef} data-section="" className="relative min-h-[100svh] bg-black text-white" style={{ overflowX: "clip" }}>
      <div ref={bgRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <Image
          src="/images/generated/about-planning-table.jpg"
          alt="Residential construction planning table with drawings and materials"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
          style={{ filter: "contrast(1.06) saturate(1.02) brightness(0.92)" }}
        />
      </div>
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.74) 42%, rgba(0,0,0,0.24) 76%, rgba(0,0,0,0.66) 100%), linear-gradient(180deg, rgba(0,0,0,0.54) 0%, rgba(0,0,0,0.12) 42%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      <div
        ref={wordmarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] -translate-y-1/2 select-none whitespace-nowrap text-center font-editorial font-bold uppercase leading-none text-white/[0.07]"
        style={{ fontSize: "clamp(4.2rem, 11.5vw, 12rem)", letterSpacing: "0.04em", willChange: "transform" }}
      >
        828 Construction
      </div>

      <DraftingMotionLayer intensity="quiet" variant="intro" className="hidden opacity-35 lg:block" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-10 pt-28 lg:px-12 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <div>
            <p className="mb-6 font-labels text-[10px] uppercase tracking-[0.3em] text-white/48">
              About / 828 Construction
            </p>
            <h1 className="max-w-5xl font-editorial text-[clamp(3.6rem,9vw,9.6rem)] font-semibold leading-[0.82]">
              Where quality meets quiet luxury.
            </h1>
          </div>

          <div className="border-l border-white/14 pl-6 lg:pl-8">
            <p className="max-w-md text-[clamp(1rem,1.45vw,1.22rem)] leading-relaxed text-white/72">
              Every home is shaped by decades of hands-on experience and
              building science, ensuring exceptional quality and performance.
            </p>
            <div className="mt-8 grid gap-px border border-white/12 bg-white/12 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {proofStats.map((stat) => (
                <div key={stat.label} className="bg-black/62 p-4 backdrop-blur-md">
                  <span className="block font-labels text-[8px] uppercase tracking-[0.22em] text-white/36">
                    {stat.label}
                  </span>
                  <span className="mt-2 block font-numbers text-sm text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
          {["Plans before promises", "Field-built judgment", "South Bay residential"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-accent" />
              <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/48">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={railRef}
        className="absolute bottom-0 left-0 z-20 h-px w-full bg-accent"
        aria-hidden="true"
      />
    </section>
  );
}

function OriginSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useReveal(sectionRef, "[data-origin-reveal]", "top 74%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { clipPath: "inset(10% 0% 10% 0%)", y: 42 },
          {
            clipPath: "inset(0%)",
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
          }
        );

        gsap.to(imageRef.current.querySelector("img"), {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              end: "bottom 35%",
              scrub: 1,
            },
          }
        );
      }

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { x: index % 2 === 0 ? 30 : -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 68%", once: true },
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
    <section ref={sectionRef} data-section="" className="relative bg-[#050505] py-20 text-white lg:py-32" style={{ overflowX: "clip" }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(99,26,22,0.18),transparent_28%)]" />
      <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.18]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:px-12">
        <div className="relative">
          <div
            ref={imageRef}
            className="relative overflow-hidden border border-white/10 bg-white/[0.03]"
            style={{ aspectRatio: "4 / 5", willChange: "clip-path, transform" }}
          >
            <Image
              src="/images/generated/about-framing-interior.jpg"
              alt="Clean residential framing and construction interior"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
              style={{ filter: "contrast(1.04) saturate(0.98) brightness(0.9)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div className="max-w-[15rem] border-l border-white/22 pl-4">
                <p className="font-labels text-[8px] uppercase tracking-[0.24em] text-white/42">
                  Framing / sequence / control
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/76">
                  Clean sites are planned sites. The quality shows before the
                  finishes arrive.
                </p>
              </div>
              <span className="font-numbers text-[10px] uppercase tracking-[0.22em] text-white/40">
                Field standard
              </span>
            </div>
          </div>

          <div className="absolute -right-6 top-8 hidden h-40 w-28 border border-white/10 bg-black/70 p-4 backdrop-blur-md lg:block">
            <p className="font-labels text-[8px] uppercase tracking-[0.22em] text-white/38">Observed</p>
            <p className="mt-12 font-editorial text-3xl leading-none">Not assumed.</p>
          </div>
        </div>

        <div>
          <p data-origin-reveal className="mb-5 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40">
            The builder profile
          </p>
          <h2 className="sr-only">The builder profile</h2>
          <p data-origin-reveal className="max-w-2xl font-editorial text-[clamp(1.5rem,2.6vw,2.35rem)] font-light leading-snug text-white/88">
            828 Construction is guided by a founder with over two decades of
            hands-on experience in residential construction. This depth of
            knowledge — built from working directly alongside skilled
            tradesmen — shapes a precise understanding of how homes are built
            and perform.
          </p>

          <div className="relative mt-10 pl-7">
            <div className="absolute left-0 top-0 h-full w-px bg-white/10">
              <div ref={lineRef} className="h-full w-px bg-accent" />
            </div>
            <div className="space-y-4">
              {standards.map((item, index) => (
                <div
                  key={item.number}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="grid gap-4 border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm sm:grid-cols-[4rem_1fr]"
                >
                  <span className="font-numbers text-3xl text-white/18">{item.number}</span>
                  <div>
                    <h3 className="font-editorial text-3xl font-semibold leading-none">{item.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/56">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
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
          { xPercent: 5 },
          {
            xPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      // Sustained per-row scrub reveal (Fix 15) — each statement reads in as
      // the visitor scrolls past it, and its rail letter ignites maroon.
      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 88%", end: "top 55%", scrub: 1.1 },
          }
        );

        const letter = letterRefs.current[index];
        if (letter) {
          ScrollTrigger.create({
            trigger: row,
            start: "top 62%",
            onEnter: () => letter.classList.add("text-accent"),
            onLeaveBack: () => letter.classList.remove("text-accent"),
          });
        }
      });
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="" className="relative bg-white py-20 text-black lg:py-32" style={{ overflowX: "clip" }}>
      <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.13]" />

      {/* Joe (IMG_1020): "The word craft dropped in the background, bold." */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap font-editorial font-bold uppercase leading-none text-black/[0.04]"
        style={{ fontSize: "clamp(9rem, 30vw, 26rem)", letterSpacing: "0.02em", willChange: "transform" }}
      >
        Craft
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.42fr_1.58fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p data-craft-reveal className="mb-5 font-labels text-[10px] uppercase tracking-[0.28em] text-black/42">
              Method
            </p>
            <h2 data-craft-reveal className="font-editorial text-[clamp(2.2rem,3.6vw,3.4rem)] font-light leading-[0.95]">
              The principles behind the work.
            </h2>
            <div className="mt-9 hidden flex-col gap-1 lg:flex" aria-hidden="true">
              {craft.map((item, index) => (
                <span
                  key={item.letter}
                  ref={(el) => {
                    letterRefs.current[index] = el;
                  }}
                  className="font-editorial text-[clamp(3rem,4.6vw,4.6rem)] font-semibold leading-[0.94] text-black/85 transition-colors duration-500"
                >
                  {item.letter}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="divide-y divide-black/10 border-y border-black/10">
              {craft.map((item, index) => (
                <div
                  key={item.letter}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className="grid gap-4 py-8 sm:grid-cols-[5rem_1fr] lg:py-10"
                >
                  <span className="font-numbers text-[11px] uppercase tracking-[0.24em] text-black/38">
                    {item.letter} — 0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-editorial text-[clamp(1.7rem,2.6vw,2.5rem)] font-semibold leading-none">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-[clamp(0.98rem,1.15vw,1.08rem)] leading-relaxed text-black/62">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
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
                <span className="font-editorial text-[clamp(2.6rem,6.5vw,6.2rem)] font-semibold uppercase leading-none text-white/[0.09]">
                  {area}
                </span>
                <span className="mx-8 h-2 w-2 rotate-45 bg-accent/50 lg:mx-12" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} data-section="" className="relative bg-[#070707] py-24 text-white lg:py-36" style={{ overflowX: "clip" }}>
      <div
        className="absolute inset-0 opacity-[0.12]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "78px 78px",
        }}
      />
      <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.16]" />
      <div ref={compassRef} className="pointer-events-none absolute -right-24 top-12 hidden h-[32rem] w-[32rem] rounded-full border border-white/10 lg:block">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/8" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/8" />
      </div>

      {/* Joe (IMG_1024): cities rolling across the screen in the background,
          spanning the whole screen. */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 flex-col gap-6 lg:gap-10">
        {marqueeRow("74s")}
        {marqueeRow("92s", true)}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-3xl">
          <p data-area-copy className="mb-5 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40">
            South Bay native
          </p>
          <h2 data-area-copy className="font-editorial text-[clamp(3.2rem,6.6vw,6.8rem)] font-semibold leading-[0.86]">
            Looking for a local contractor?
          </h2>
          <p data-area-copy className="mt-7 max-w-xl text-[clamp(1.05rem,1.3vw,1.2rem)] leading-relaxed text-white/64">
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

function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useReveal(sectionRef, "[data-cta-reveal]", "top 78%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      }
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="" className="relative bg-black text-white" style={{ overflowX: "clip" }}>
      <div ref={imageRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <Image
          src="/images/generated/about-planning-table.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "contrast(1.06) saturate(1.02) brightness(0.92)" }}
        />
      </div>
      <div className="absolute inset-0 bg-black/76" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid min-h-[70svh] max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:px-12 lg:py-28">
        <div>
          <p data-cta-reveal className="mb-5 font-labels text-[10px] uppercase tracking-[0.28em] text-white/42">
            The first conversation
          </p>
          <h2 data-cta-reveal className="max-w-5xl font-editorial text-[clamp(3.2rem,6.6vw,7rem)] font-semibold leading-[0.84]">
            For those who value experience and quality.
          </h2>
        </div>
        <div className="border-l border-white/14 pl-6 lg:pl-8">
          <p data-cta-reveal className="max-w-md text-[clamp(1rem,1.25vw,1.12rem)] leading-relaxed text-white/66">
            Every exceptional home begins with a conversation. By listening
            first, we transform your vision into thoughtfully crafted reality.
          </p>
          <div data-cta-reveal className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
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
