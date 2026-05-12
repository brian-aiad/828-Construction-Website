"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { PROCESS_STEPS_V2, SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import {
  BlueprintCornerSilhouette,
  ConstructionLineSilhouette,
  LevelSilhouette,
} from "@/components/system/silhouettes";

gsap.registerPlugin(ScrollTrigger);

const marquee = [
  "active listening",
  "build your vision",
  "dedicated to your dream",
  "refined building",
  "lasting partnerships",
];

export default function HomeVisionSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const splitFrameRef = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const headlineEl = headlineRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      gsap.set(cards, { y: 48, opacity: 0, rotateX: 18 });
      if (lineRef.current) gsap.set(lineRef.current, { scaleY: 0 });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(cards, { y: 0, opacity: 1, rotateX: 0 });
        if (lineRef.current) gsap.set(lineRef.current, { scaleY: 1 });
        return;
      }

      if (headlineRef.current) {
        const headline = headlineRef.current;
        splitFrameRef.current = requestAnimationFrame(() => {
          if (!headline.isConnected) return;
          splitRef.current = new SplitType(headline, { types: "words,chars" });
          gsap.fromTo(
            splitRef.current.chars ?? [],
            { yPercent: 120, opacity: 0, rotateX: 60 },
            {
              yPercent: 0,
              opacity: 1,
              rotateX: 0,
              stagger: 0.018,
              duration: 1,
              ease: "power4.out",
              scrollTrigger: { trigger: headline, start: "top 82%", once: true },
            }
          );
        });
      }

      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: introRef.current, start: "top 82%", once: true },
          }
        );
      }

      if (lineRef.current) {
        gsap.to(lineRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 25%",
            scrub: 1,
          },
        });
      }

      gsap.to(cards, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: panelRef.current ?? section,
          start: "top 78%",
          end: "top 20%",
          scrub: 1.25,
        },
      });

      if (levelRef.current) {
        gsap.to(levelRef.current, {
          xPercent: 16,
          yPercent: -32,
          rotate: -5,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }

      if (blueprintRef.current) {
        gsap.to(blueprintRef.current, {
          xPercent: -22,
          yPercent: -46,
          rotate: 8,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.3 },
        });
      }

      if (trackRef.current && window.matchMedia("(min-width: 1024px)").matches) {
        const track = trackRef.current;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.75}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      cancelAnimationFrame(splitFrameRef.current);
      if (splitRef.current && headlineEl?.isConnected) {
        try { splitRef.current.revert(); } catch {}
      }
      splitRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="vision" className="relative overflow-hidden bg-[#050505] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at 50% 30%, black 0%, transparent 70%)",
        }}
      />

      <div
        ref={levelRef}
        aria-hidden="true"
        className="absolute -left-[10vw] top-28 hidden w-[62vw] text-white lg:block"
        style={{ opacity: 0.18 }}
      >
        <LevelSilhouette style={{ width: "100%", height: "auto" }} />
      </div>
      <div
        ref={blueprintRef}
        aria-hidden="true"
        className="absolute -right-[6vw] top-[36rem] hidden w-[44vw] text-white lg:block"
        style={{ opacity: 0.2 }}
      >
        <BlueprintCornerSilhouette style={{ width: "100%", height: "auto" }} />
      </div>
      <div
        aria-hidden="true"
        className="absolute right-[-9rem] top-72 hidden h-[22rem] w-[28rem] pointer-events-none lg:block"
        style={{ opacity: 0.42 }}
      >
        <Image
          src="/images/chatpics/04_home_tool_cutout_set_png.png"
          alt=""
          fill
          sizes="28rem"
          className="object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div ref={introRef} className="relative">
            <p className="mb-6 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40">
              Our first step is listening
            </p>
            <h2
              ref={headlineRef}
              className="font-display text-[clamp(2.7rem,6vw,6.7rem)] font-bold leading-[0.88] tracking-tight"
              style={{ perspective: "1000px" }}
            >
              One conversation begins the build.
            </h2>
          </div>

          <div className="relative border-l border-white/10 pl-8 lg:pl-12">
            <div
              ref={lineRef}
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px origin-top"
              style={{ background: "var(--color-accent)" }}
            />
            <p className="max-w-xl font-body text-[clamp(1.05rem,1.8vw,1.45rem)] leading-relaxed text-white/70">
              Our journey begins with active listening, where each conversation
              becomes the foundation for shaping your vision. 828 is built for
              lasting partnerships defined by artistry, clarity, and enduring
              residential value.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                "Build your vision",
                "Dedicated to your dream",
                "Art of construction",
              ].map((item) => (
                <div key={item} className="border border-white/10 bg-white/[0.035] p-4 backdrop-blur-md">
                  <span className="font-labels text-[9px] uppercase tracking-[0.2em] text-white/45">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[15rem] overflow-hidden border border-white/10 bg-white/[0.025]">
                <Image
                  src="/images/chatpics/03_home_active_listening_table.png"
                  alt="Builder consultation table with plans and material samples"
                  fill
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  className="object-cover"
                  style={{ filter: "contrast(1.04) saturate(0.98) brightness(0.9)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="hidden border border-white/10 bg-black/45 p-5 lg:flex lg:flex-col lg:justify-end">
                <span className="font-labels text-[9px] uppercase tracking-[0.24em] text-white/35">
                  Plans / materials / conversation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-y border-white/10 py-4">
        <div
          className="flex w-max gap-8 whitespace-nowrap font-labels text-[10px] uppercase tracking-[0.28em] text-white/45"
          style={{ animation: "marqueeScroll 34s linear infinite" }}
        >
          {[...marquee, ...marquee, ...marquee, ...marquee].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-8">
              {item}
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
            </span>
          ))}
        </div>
      </div>

      <div ref={panelRef} className="relative z-10 overflow-hidden py-20 lg:min-h-screen lg:py-0">
        <div className="flex min-h-[70vh] flex-col justify-center">
          <div className="mx-auto mb-12 max-w-7xl px-6 lg:px-12">
            <p className="mb-3 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40">
              The approach
            </p>
            <h3 className="max-w-4xl font-display text-[clamp(2.4rem,5vw,5.6rem)] font-bold leading-[0.9] tracking-tight">
              Build philosophy, made visible.
            </h3>
          </div>

          <div ref={trackRef} className="flex flex-col gap-4 px-6 lg:w-max lg:flex-row lg:px-12">
            {PROCESS_STEPS_V2.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="relative min-h-[22rem] overflow-hidden border border-white/12 bg-black/60 p-7 backdrop-blur-xl lg:w-[34vw] lg:min-w-[28rem]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 opacity-50" aria-hidden="true">
                  <ConstructionLineSilhouette
                    style={{
                      width: "120%",
                      height: "auto",
                      color: "white",
                      opacity: 0.08,
                      transform: "translate(-10%, 8%) rotate(-4deg)",
                    }}
                  />
                </div>
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <span className="font-numbers text-[clamp(4rem,9vw,8rem)] font-bold leading-none text-white/10">
                      {step.number}
                    </span>
                    <h4 className="mt-6 font-display text-3xl font-bold leading-none tracking-tight">
                      {step.title}
                    </h4>
                    <p className="mt-3 font-labels text-[10px] uppercase tracking-[0.22em] text-white/40">
                      {step.subtitle}
                    </p>
                  </div>
                  <div className="mt-12 h-px w-full bg-white/10">
                    <div className="h-px w-1/2" style={{ background: "var(--color-accent)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-5 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <p className="max-w-lg text-sm leading-relaxed text-white/48">
              Communication is essential in building your vision. The process
              begins with listening, then moves through design, approvals,
              construction, and post-construction support.
            </p>
            <Link
              href="/contact"
              className="pulse-glow inline-flex w-fit items-center gap-3 bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black"
            >
              Start Step 01
              <span aria-hidden="true">+</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 px-6 py-6 font-labels text-[9px] uppercase tracking-[0.22em] text-white/35 lg:px-12">
        {SITE.address.city}, CA / South Bay / CA #{SITE.license}
      </div>
    </section>
  );
}
