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

gsap.registerPlugin(ScrollTrigger);

const proofStats = [
  { label: "In the Field", value: `Since '04` },
  { label: "License", value: `#${SITE.license}` },
  { label: "Base", value: "Torrance" },
];

const standards = [
  {
    number: "01",
    title: "Listen before scope.",
    body: "The first conversation defines what matters, what is unknown, and what should be solved before a number is put in front of you.",
  },
  {
    number: "02",
    title: "Sequence the work.",
    body: "Planning, materials, trades, inspections, and finish quality all depend on the order of operations being clear.",
  },
  {
    number: "03",
    title: "Protect the finish.",
    body: "A project is not judged by the loudest stage. It is judged by the final pass, the cleanup, and the details that remain.",
  },
];

const fieldRows = [
  ["Planning", "Plans, samples, budget clarity, and constraints are read together before the work moves."],
  ["Construction", "Framing, trades, inspections, and details are coordinated so the site stays controlled."],
  ["Closeout", "The last walk-through is treated as part of the build, not a loose end."],
];

const featuredAreas = SERVICE_AREAS.slice(0, 8);

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
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-x-clip bg-black text-white">
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
      <DraftingMotionLayer intensity="quiet" variant="intro" className="hidden opacity-35 lg:block" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-10 pt-28 lg:px-12 lg:pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <div>
            <p className="mb-6 font-labels text-[10px] uppercase tracking-[0.3em] text-white/48">
              About / 828 Construction
            </p>
            <h1 className="max-w-5xl font-editorial text-[clamp(4rem,10vw,10.8rem)] font-semibold leading-[0.78]">
              Built by the work, not the pitch.
            </h1>
          </div>

          <div className="border-l border-white/14 pl-6 lg:pl-8">
            <p className="max-w-md text-[clamp(1rem,1.45vw,1.22rem)] leading-relaxed text-white/72">
              828 Construction is shaped by field experience, clear planning,
              and residential work that has to perform after the final walk.
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
    <section ref={sectionRef} className="relative overflow-x-clip bg-[#050505] py-20 text-white lg:py-32">
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
          <h2 data-origin-reveal className="max-w-3xl font-editorial text-[clamp(3.4rem,6.8vw,7.2rem)] font-semibold leading-[0.82]">
            Experience that shows up before the finish.
          </h2>
          <p data-origin-reveal className="mt-8 max-w-2xl text-[clamp(1rem,1.25vw,1.14rem)] leading-relaxed text-white/62">
            828 Construction is built around practical field judgment — rooted
            in over 20 years of hands-on experience: listening first, planning
            clearly, and keeping the work grounded enough that homeowners
            always know what is happening next.
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

function FieldMethodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useReveal(sectionRef, "[data-method-reveal]", "top 78%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      }

      imageRefs.current.forEach((image, index) => {
        if (!image) return;
        gsap.fromTo(
          image,
          {
            y: 38,
            rotate: index === 1 ? 1.4 : -1.2,
          },
          {
            y: 0,
            rotate: index === 1 ? -0.6 : 0.4,
            duration: 0.95,
            delay: index * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
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
    <section ref={sectionRef} className="relative overflow-x-clip bg-white py-20 text-black lg:py-32">
      <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.13]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p data-method-reveal className="mb-5 font-labels text-[10px] uppercase tracking-[0.28em] text-black/42">
              Method
            </p>
            <h2 data-method-reveal className="font-editorial text-[clamp(2.8rem,6.2vw,6.4rem)] font-semibold leading-[0.86]">
              <span className="block">Plans first.</span>
              <span className="block">Field tested.</span>
            </h2>
            <p data-method-reveal className="mt-7 max-w-[20rem] text-[clamp(1rem,1.2vw,1.1rem)] leading-relaxed text-black/62 md:max-w-xl">
              Every project moves through the same pressure points: decisions,
              site conditions, trade coordination, and the final pass where the
              details either hold together or they do not.
            </p>
          </div>

          <div className="min-w-0">
            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              <div
                ref={(el) => {
                  imageRefs.current[0] = el;
                }}
                className="relative min-w-0 max-w-full overflow-hidden border border-black/10 bg-black"
              >
                <Image
                  src="/images/generated/about-planning-table.jpg"
                  alt="Construction plans and material samples on a work table"
                  width={1800}
                  height={1012}
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="block object-cover"
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    filter: "contrast(1.04) saturate(1.02) brightness(0.94)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 font-labels text-[9px] uppercase tracking-[0.24em] text-white/58">
                  Planning table
                </p>
              </div>
              <div
                ref={(el) => {
                  imageRefs.current[1] = el;
                }}
                className="relative min-w-0 max-w-full overflow-hidden border border-black/10 bg-black md:mt-16"
              >
                <Image
                  src="/images/about/about-hero.jpg"
                  alt="Finished residential exterior by 828 Construction"
                  width={1536}
                  height={1024}
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="block object-cover"
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    filter: "contrast(1.04) saturate(1.02) brightness(0.9)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/66 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 font-labels text-[9px] uppercase tracking-[0.24em] text-white/58">
                  Finished restraint
                </p>
              </div>
            </div>

            <div className="mt-10 overflow-hidden border-y border-black/10 py-5">
              <div
                ref={marqueeRef}
                className="flex w-max gap-9 whitespace-nowrap font-labels text-[10px] uppercase tracking-[0.28em] text-black/46"
              >
                {[
                  "listen first",
                  "scope clearly",
                  "coordinate trades",
                  "protect finishes",
                  "close out clean",
                  "listen first",
                  "scope clearly",
                  "coordinate trades",
                  "protect finishes",
                  "close out clean",
                ].map((item, index) => (
                  <span key={`${item}-${index}`} className="flex items-center gap-9">
                    {item}
                    <span className="h-1.5 w-1.5 bg-accent" />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
              {fieldRows.map(([label, body]) => (
                <article key={label} className="min-h-52 bg-white p-6">
                  <p className="font-labels text-[9px] uppercase tracking-[0.24em] text-black/42">{label}</p>
                  <p className="mt-12 max-w-sm text-sm leading-relaxed text-black/62">{body}</p>
                </article>
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
  const areaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const compassRef = useRef<HTMLDivElement>(null);

  useReveal(sectionRef, "[data-area-copy]", "top 78%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !AnimationController.shouldAnimate()) return;

    const ctx = gsap.context(() => {
      areaRefs.current.forEach((area, index) => {
        if (!area) return;
        gsap.fromTo(
          area,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            delay: index * 0.045,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 76%", once: true },
          }
        );
      });

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

  return (
    <section ref={sectionRef} className="relative overflow-x-clip bg-[#070707] py-20 text-white lg:py-32">
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

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:px-12">
        <div>
          <p data-area-copy className="mb-5 font-labels text-[10px] uppercase tracking-[0.28em] text-white/40">
            South Bay native
          </p>
          <h2 data-area-copy className="font-editorial text-[clamp(3.2rem,6.2vw,6.4rem)] font-semibold leading-[0.86]">
            Local work should feel accountable.
          </h2>
          <p data-area-copy className="mt-7 max-w-xl text-[clamp(1rem,1.2vw,1.1rem)] leading-relaxed text-white/58">
            828 works from Torrance into the surrounding South Bay. The service
            area is not a decorative list; it is a signal that the work is
            grounded in local homes, local conditions, and local expectations.
          </p>
        </div>

        <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          {featuredAreas.map((area, index) => (
            <div
              key={area}
              ref={(el) => {
                areaRefs.current[index] = el;
              }}
              className="min-h-32 bg-black/68 p-5 backdrop-blur-sm"
            >
              <p className="font-labels text-[8px] uppercase tracking-[0.22em] text-white/34">Area</p>
              <p className="mt-12 text-lg leading-tight text-white/86">{area}</p>
            </div>
          ))}
        </div>
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
    <section ref={sectionRef} className="relative overflow-x-clip bg-black text-white">
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
            Start with the real constraints
          </p>
          <h2 data-cta-reveal className="max-w-5xl font-editorial text-[clamp(3.4rem,7vw,7.4rem)] font-semibold leading-[0.82]">
            Tell us what you want built. We will tell you how it should start.
          </h2>
        </div>
        <div className="border-l border-white/14 pl-6 lg:pl-8">
          <p data-cta-reveal className="max-w-md text-[clamp(1rem,1.25vw,1.12rem)] leading-relaxed text-white/66">
            The first conversation is for fit, scope, timing, and whether 828
            is the right builder for the project.
          </p>
          <div data-cta-reveal className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
            >
              Request an estimate
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
    <>
      <AboutHero />
      <OriginSection />
      <FieldMethodSection />
      <SouthBaySection />
      <AboutCTA />
    </>
  );
}
