"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { PROCESS_STEPS_V2, SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";

gsap.registerPlugin(ScrollTrigger);

const marquee = [
  "active listening",
  "build your vision",
  "dedicated to your dream",
  "refined building",
  "lasting partnerships",
];

const processImages = [
  "/images/projects/consulting-plans.jpg",
  "/images/process/planning.jpg",
  "/images/process/scope-document.jpg",
  "/images/process/execution.jpg",
  "/images/process/completion-post-construction.png",
];

const listeningSteps = [
  {
    num: "01",
    title: "Listen",
    body: "Goals. Site. Timing.",
  },
  {
    num: "02",
    title: "Measure",
    body: "Scope. Risk. Access.",
  },
  {
    num: "03",
    title: "Direct",
    body: "A clear next step.",
  },
];

export default function HomeVisionSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const splitFrameRef = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const headlineEl = headlineRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      const introSteps = gsap.utils.toArray<HTMLElement>(".vision-step");
      const introPhotos = gsap.utils.toArray<HTMLElement>(".vision-photo-frame");
      const rulerTicks = gsap.utils.toArray<HTMLElement>(".vision-ruler-tick");
      const approachDrift = gsap.utils.toArray<HTMLElement>(".approach-bg-drift");
      const approachRules = gsap.utils.toArray<HTMLElement>(".approach-rule");
      gsap.set(cards, { y: 48, opacity: 0, rotateX: 18 });
      if (lineRef.current) gsap.set(lineRef.current, { scaleY: 0 });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(cards, { y: 0, opacity: 1, rotateX: 0 });
        if (lineRef.current) gsap.set(lineRef.current, { scaleY: 1 });
        gsap.set(approachRules, { scaleX: 1 });
        return;
      }

      if (headlineRef.current) {
        const headline = headlineRef.current;
        splitFrameRef.current = requestAnimationFrame(() => {
          if (!headline.isConnected) return;
          splitRef.current = new SplitType(headline, { types: "words" });
          gsap.fromTo(
            splitRef.current.words ?? [],
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

      gsap.fromTo(
        introSteps,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: introRef.current ?? section, start: "top 72%", once: true },
        }
      );

      introPhotos.forEach((photo, index) => {
        gsap.fromTo(
          photo,
          { clipPath: index === 0 ? "inset(0% 0% 16% 0%)" : "inset(16% 0% 0% 0%)", opacity: 0, y: 24 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: photo, start: "top 84%", once: true },
          }
        );

        const image = photo.querySelector("img");
        if (image) {
          gsap.to(image, {
            yPercent: index === 0 ? -7 : 6,
            ease: "none",
            scrollTrigger: { trigger: introRef.current ?? section, start: "top bottom", end: "bottom top", scrub: 1.35 },
          });
        }
      });

      gsap.fromTo(
        rulerTicks,
        { opacity: 0.18, x: -6 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.045,
          ease: "none",
          scrollTrigger: {
            trigger: introRef.current ?? section,
            start: "top 68%",
            end: "bottom 35%",
            scrub: 1.2,
          },
        }
      );

      approachDrift.forEach((item, index) => {
        gsap.to(item, {
          xPercent: index % 2 === 0 ? 6 : -5,
          yPercent: index % 2 === 0 ? -14 : 16,
          rotate: index % 2 === 0 ? 4 : -5,
          ease: "none",
          scrollTrigger: {
            trigger: panelRef.current ?? section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      gsap.fromTo(
        approachRules,
        { scaleX: 0 },
        {
          scaleX: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: panelRef.current ?? section,
            start: "top 74%",
            end: "top 28%",
            scrub: 1.1,
          },
        }
      );

      if (lineRef.current) {
        gsap.to(lineRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: introRef.current ?? section,
            start: "top 68%",
            end: "bottom 35%",
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
      <div className="relative z-10 overflow-hidden px-6 py-24 lg:px-12 lg:py-36">
        <DraftingMotionLayer
          intensity="strong"
          variant="intro"
          className="hidden lg:block"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_26%,rgba(123,45,38,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_55%)]" />

        <div ref={introRef} className="mx-auto max-w-7xl">
          <div className="relative z-10 grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-12 xl:gap-16">
            <div className="relative">
              <p className="mb-6 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40">
                Our first step is listening
              </p>
              <h2
                ref={headlineRef}
                className="max-w-[12ch] break-normal font-editorial text-[clamp(3.15rem,5.35vw,5.9rem)] font-semibold leading-[0.88] [&_.word]:inline-block [&_.word]:whitespace-nowrap"
                style={{ perspective: "1000px" }}
              >
                One conversation begins the build.
              </h2>
              <p className="mt-7 max-w-md text-base leading-8 text-white/58">
                A short call to understand the project, the site, and the right next move.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={SITE.phoneHref}
                  className="bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
                >
                  Call {SITE.phone}
                </a>
                <Link
                  href="/contact"
                  className="border border-white/14 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white/58 transition-colors hover:border-white/35 hover:text-white"
                >
                  Send project details
                </Link>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[4.2rem_1fr]">
              <div className="relative hidden xl:block" aria-hidden="true">
                <div className="absolute left-5 top-1 h-full w-px bg-white/12" />
                <div
                  ref={lineRef}
                  className="absolute left-5 top-1 h-full w-px origin-top bg-[var(--color-accent)]"
                />
                <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-1">
                  {Array.from({ length: 13 }).map((_, index) => (
                    <div key={index} className="vision-ruler-tick flex items-center gap-2">
                      <span className={`h-px bg-white/42 ${index % 3 === 0 ? "w-8" : "w-4"}`} />
                      {index % 3 === 0 && (
                        <span className="font-labels text-[8px] uppercase tracking-[0.14em] text-white/24">
                          {String(index * 4).padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div
                  aria-hidden="true"
                  className="vision-step pointer-events-none absolute -right-4 top-8 z-20 hidden w-32 rotate-6 border-y border-white/24 opacity-75 xl:block"
                  style={{
                    height: "3.75rem",
                    background:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.44) 0 1px, transparent 1px 16px, rgba(123,45,38,0.38) 16px 17px, transparent 17px 32px)",
                  }}
                >
                  <span className="absolute left-4 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-white/28" />
                </div>

                <div className="vision-photo-frame relative min-h-[22rem] overflow-hidden border border-white/10 bg-white/[0.025] shadow-[0_32px_90px_rgba(0,0,0,0.38)] md:min-h-[30rem] xl:min-h-[34rem]">
                    <Image
                      src="/images/projects/outdoor-patio-pergola.jpg"
                      alt="Completed outdoor living project with wood decking, patio cover, and pool"
                      fill
                      loading="eager"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-center"
                      style={{ filter: "contrast(1.04) saturate(0.96) brightness(0.86)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/42 via-black/8 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/86 via-black/36 to-transparent p-5 md:p-7">
                      <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/52">
                        Real project context
                      </span>
                      <div className="mt-4 h-px w-full bg-white/12">
                        <div className="h-px w-2/5 bg-[var(--color-accent)]" />
                      </div>
                    </div>
                    <div className="vision-step absolute left-5 top-5 border border-white/12 bg-black/58 px-4 py-3 backdrop-blur-md md:left-7 md:top-7">
                      <p className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/42">
                        Scope / Site / Timing
                      </p>
                    </div>
                  </div>

                <div className="mt-5 grid gap-px bg-white/10 md:grid-cols-3">
                  {listeningSteps.map((step) => (
                    <div key={step.num} className="vision-step bg-black/62 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-numbers text-2xl font-bold text-[var(--color-accent)]">
                          {step.num}
                        </span>
                        <span className="h-px flex-1 bg-white/10" />
                      </div>
                      <h3 className="mt-5 font-editorial text-3xl leading-none text-white md:text-4xl">
                        {step.title}
                      </h3>
                      <p className="mt-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white/42">
                        {step.body}
                      </p>
                    </div>
                  ))}
                </div>
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

      <div ref={panelRef} className="relative z-10 overflow-hidden bg-[linear-gradient(180deg,#050505_0%,#080808_42%,#030303_100%)] py-20 lg:min-h-screen lg:py-0">
        <DraftingMotionLayer intensity="quiet" className="opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgba(123,45,38,0.16),transparent_28%),radial-gradient(circle_at_16%_76%,rgba(255,255,255,0.055),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/10 lg:inset-x-12" />
        <div
          aria-hidden="true"
          className="approach-bg-drift pointer-events-none absolute -right-28 top-20 h-56 w-56 rounded-full border border-white/10 opacity-70 lg:-right-32 lg:h-80 lg:w-80 lg:border-white/12 lg:opacity-100"
        >
          <div className="absolute left-1/2 top-0 h-full w-px origin-bottom bg-white/10" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-white/8" />
          <div className="absolute left-[28%] top-[22%] h-2 w-2 rounded-full bg-[var(--color-accent)]/70" />
        </div>
        <div
          aria-hidden="true"
          className="approach-bg-drift pointer-events-none absolute bottom-[34%] left-[-9rem] h-12 w-[24rem] -rotate-6 border-y border-white/12 opacity-40 lg:bottom-28 lg:left-[-7rem] lg:h-16 lg:w-[34rem] lg:border-white/14 lg:opacity-70"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.26) 0 1px, transparent 1px 18px, rgba(123,45,38,0.3) 18px 19px, transparent 19px 54px)",
          }}
        />
        <div
          aria-hidden="true"
          className="approach-rule pointer-events-none absolute left-6 top-[19%] hidden h-px w-[38vw] origin-left bg-white/14 lg:block"
        />
        <div
          aria-hidden="true"
          className="approach-rule pointer-events-none absolute bottom-[18%] right-10 hidden h-px w-[28vw] origin-left bg-[var(--color-accent)]/38 lg:block"
        />
        <div className="flex min-h-[70vh] flex-col justify-center lg:min-h-screen lg:translate-y-[3vh] lg:py-[10vh]">
          <div className="mx-auto mb-10 max-w-7xl px-6 lg:mb-8 lg:px-12">
            <p className="mb-3 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40">
              The approach
            </p>
            <h3 className="max-w-4xl font-editorial text-[clamp(3rem,6vw,6.2rem)] font-semibold leading-[0.86]">
              Build philosophy, made visible.
            </h3>
          </div>

          <div ref={trackRef} className="flex flex-col gap-4 px-6 lg:w-max lg:flex-row lg:px-12">
            {PROCESS_STEPS_V2.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group relative min-h-[22rem] overflow-hidden border border-white/12 bg-black/60 p-7 backdrop-blur-xl lg:w-[34vw] lg:min-w-[28rem]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src={processImages[i] ?? "/images/process/detail.jpg"}
                  alt=""
                  fill
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  className="object-cover opacity-[0.5] transition duration-700 group-hover:scale-105 group-hover:opacity-[0.62]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" aria-hidden="true" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <span className="font-numbers text-[clamp(4rem,9vw,8rem)] font-bold leading-none text-white/16">
                      {step.number}
                    </span>
                    <h4 className="mt-6 font-editorial text-4xl font-semibold leading-none">
                      {step.title}
                    </h4>
                    <p className="mt-3 font-labels text-[10px] uppercase tracking-[0.22em] text-white/45">
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

          <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-5 px-6 lg:mt-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <p className="max-w-lg text-sm leading-relaxed text-white/48">
              Clear communication, clean sequencing, and a finish that holds up after the crew leaves.
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
