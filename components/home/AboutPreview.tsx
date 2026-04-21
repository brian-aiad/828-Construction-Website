"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

const statItems = [
  { target: 20, suffix: "+", label: "Years of Field Experience", isYear: false },
  { target: 2004, suffix: "", label: "Est. · Torrance, CA", isYear: true },
];

export default function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const stat0Ref = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      // ── Headline: line-by-line clip reveal ──────────────────────────────
      if (headlineRef.current) {
        const lines = Array.from(headlineRef.current.querySelectorAll<HTMLElement>(".hl"));
        if (lines.length) {
          gsap.fromTo(lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger, start: "top 72%", once: true },
            }
          );
        }
      }

      // ── Label + body + CTA: stagger fade up (no x-axis) ─────────────────
      const textEls = [
        sectionRef.current!.querySelector(".about-label"),
        bodyRef.current,
        ctaRef.current,
      ].filter(Boolean);
      gsap.fromTo(textEls,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.2, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 72%", once: true },
        }
      );

      // ── Stats: emerge vertically (no x-axis slides) ─────────────────────
      if (statsRef.current) {
        const rows = statsRef.current.querySelectorAll<HTMLElement>(".stat-row");
        gsap.fromTo(rows,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.65, stagger: 0.1, delay: 0.35, ease: "power3.out",
            scrollTrigger: { trigger, start: "top 72%", once: true },
          }
        );
      }

      // ── GSAP scrub counters (not fire-once NumberCounter) ───────────────
      [
        { ref: stat0Ref, target: 20, suffix: "+" },
        { ref: stat1Ref, target: 2004, suffix: "" },
      ].forEach(({ ref, target, suffix }) => {
        const el = ref.current;
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          ease: "none",
          immediateRender: false,
          onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
          scrollTrigger: {
            trigger,
            start: "top 80%",
            end: "top 30%",
            scrub: 1.5,
          },
        });
      });

      // ── Image 1: scrub clip-path reveal (top → open) ────────────────────
      const img1 = imagesRef.current?.querySelector<HTMLElement>(".about-img-1");
      if (img1) {
        gsap.fromTo(img1,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: imagesRef.current!,
              start: "top 90%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        );
        // Image scale-through-scroll
        const img1Inner = img1.querySelector<HTMLElement>("img");
        if (img1Inner) {
          gsap.fromTo(img1Inner,
            { scale: 1.08 },
            {
              scale: 1.0,
              ease: "none",
              scrollTrigger: {
                trigger: imagesRef.current!,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }
      }

      // ── Image 2: scrub clip-path reveal (offset start) ──────────────────
      const img2 = imagesRef.current?.querySelector<HTMLElement>(".about-img-2");
      if (img2) {
        gsap.fromTo(img2,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: imagesRef.current!,
              start: "top 80%",
              end: "top 20%",
              scrub: 1.4,
            },
          }
        );
        const img2Inner = img2.querySelector<HTMLElement>("img");
        if (img2Inner) {
          gsap.fromTo(img2Inner,
            { scale: 1.1 },
            {
              scale: 1.0,
              ease: "none",
              scrollTrigger: {
                trigger: imagesRef.current!,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.8,
              },
            }
          );
        }
      }

      // ── Caption card: emerge vertically, then subtle parallax ───────────
      const card = imagesRef.current?.querySelector<HTMLElement>(".about-card");
      if (card) {
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.85, delay: 0.5, ease: "power3.out",
            scrollTrigger: { trigger: imagesRef.current!, start: "top 70%", once: true },
          }
        );
        gsap.to(card, {
          y: -20, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="about"
      className="bg-white py-24 lg:py-36 overflow-hidden"
      style={{ position: "relative", zIndex: 2 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left col */}
          <div className="lg:col-span-6">
            <span className="about-label font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
              About 828
            </span>

            <h2
              ref={headlineRef}
              className="font-display font-bold text-black tracking-tight leading-[0.9] mb-8"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
            >
              <span className="block overflow-hidden">
                <span className="hl block">20 years</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hl block">in the field.</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hl block text-gray-500">Zero shortcuts.</span>
              </span>
            </h2>

            <div ref={bodyRef}>
              <p className="text-gray-500 leading-relaxed max-w-sm text-[15px]">
                Every project is backed by real building science knowledge —
                understanding how materials perform, how structures behave,
                and how to build something that actually lasts.
              </p>
            </div>

            {/* Stats — GSAP scrub counters via mutable-object pattern */}
            <div ref={statsRef} className="mt-10 border-t border-gray-100 divide-y divide-gray-100">
              <div className="stat-row py-5 flex items-baseline gap-4">
                <div
                  className="font-numbers font-bold text-black leading-none"
                  style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}
                >
                  <span ref={stat0Ref}>20+</span>
                </div>
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase">
                  Years of Field Experience
                </div>
              </div>

              <div className="stat-row py-5 flex items-baseline gap-4">
                <div
                  className="font-numbers font-bold text-black leading-none"
                  style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}
                >
                  <span ref={stat1Ref}>2004</span>
                </div>
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase">
                  Est. · Torrance, CA
                </div>
              </div>

              <div className="stat-row py-5 flex items-center gap-4">
                <div className="w-1 h-8 bg-[#B87333] flex-shrink-0" />
                <div>
                  <div className="font-numbers font-bold text-black text-xl leading-none">
                    #{SITE.license}
                  </div>
                  <div className="font-labels text-[9px] text-gray-500 tracking-[0.15em] uppercase mt-1">
                    CA General Contractor License
                  </div>
                </div>
              </div>
            </div>

            <div ref={ctaRef} className="mt-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:bg-gray-900 transition-colors"
              >
                Full Story
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Right col — overlapping image composition */}
          <div className="lg:col-span-6 mt-8 lg:mt-0" ref={imagesRef}>
            <div className="relative" style={{ height: "clamp(420px, 55vw, 600px)" }}>

              {/* Image 1 — dominant, top-left */}
              <div
                className="about-img-1 absolute overflow-hidden bg-gray-100 shadow-2xl"
                style={{ top: 0, left: 0, width: "66%", height: "70%", zIndex: 2 }}
              >
                <Image
                  src="/images/about/craftsmanship.jpg"
                  alt="828 Construction — precision craftsmanship"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.07) saturate(1.12)" }}
                  sizes="(max-width: 1024px) 66vw, 33vw"
                />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#B87333]/40" />
              </div>

              {/* Image 2 — bottom-right */}
              <div
                className="about-img-2 absolute overflow-hidden bg-gray-100 shadow-xl"
                style={{ bottom: 0, right: 0, width: "60%", height: "58%", zIndex: 1 }}
              >
                <Image
                  src="/images/about/tools.jpg"
                  alt="828 Construction — quality materials"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(1.1)" }}
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
              </div>

              {/* Caption card */}
              <div
                className="about-card absolute bg-black shadow-2xl flex flex-col justify-between"
                style={{
                  bottom: "10%",
                  left: "40%",
                  width: "46%",
                  padding: "1.5rem",
                  zIndex: 3,
                  minHeight: "120px",
                }}
              >
                <span className="font-labels text-[8px] text-gray-400 tracking-[0.22em] uppercase">
                  The Standard
                </span>
                <div>
                  <p className="font-display font-bold text-white text-base lg:text-lg leading-tight mb-1">
                    Built with Intent.
                  </p>
                  <p className="font-labels text-[9px] text-gray-400 tracking-[0.12em] uppercase leading-relaxed">
                    Not by Accident.
                  </p>
                </div>
                <a
                  href={SITE.phoneHref}
                  className="font-numbers text-sm text-[#B87333] tracking-wide hover:text-white transition-colors duration-200 mt-2"
                >
                  {SITE.phone}
                </a>
              </div>

              {/* Copper left-edge accent */}
              <div
                className="absolute top-[15%] left-0 w-[2px] bg-[#B87333]/30"
                style={{ height: "55%", zIndex: 10 }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
