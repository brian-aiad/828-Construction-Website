"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    num: "01",
    label: "Root Cause Over Symptom",
    body: "Most failures have a predictable cause. We find it before the fix — not after the second round of repairs.",
  },
  {
    num: "02",
    label: "Material Reality",
    body: "Materials move. Water finds paths. Assemblies fail in ways that are well understood — if you're paying attention. We are.",
  },
  {
    num: "03",
    label: "Scope Before Commitment",
    body: "Clear scope before a dollar is spent. No scope creep, no surprise costs, no additions that weren't agreed to.",
  },
];

export default function BuildingScience() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (ctxRef.current) { try { ctxRef.current.revert(); } catch {} } }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Fix 14/15: set initial clips via GSAP (not JSX)
      if (imgRef.current) {
        gsap.set(imgRef.current, { clipPath: "inset(100% 0 0 0)" });
      }
      if (img2Ref.current) {
        gsap.set(img2Ref.current, { clipPath: "inset(0% 0% 100% 0%)" });
      }

      if (!AnimationController.shouldAnimate()) {
        // Mobile: immediately show images, then simple on-enter reveals
        if (imgRef.current) {
          gsap.set(imgRef.current, { clipPath: "inset(0% 0 0 0)" });
        }
        if (img2Ref.current) {
          gsap.set(img2Ref.current, { clipPath: "inset(0% 0% 0% 0%)" });
        }
        const mobileEls: HTMLElement[] = [
          headlineRef.current,
          bodyRef.current,
          ...Array.from(wrapperRef.current!.querySelectorAll<HTMLElement>(".pillar-row, .bs-link")),
        ].filter((el): el is HTMLElement => !!el);
        mobileEls.forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 24, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        return;
      }

      // ── DESKTOP ──────────────────────────────────────────────────────────

      // ── Headline line reveal ─────────────────────────────────────────────
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll<HTMLElement>(".hl");
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: wrapperRef.current, start: "top 75%", once: true },
          }
        );
      }

      // ── Body and link fade up ────────────────────────────────────────────
      const fadeEls = [
        bodyRef.current,
        wrapperRef.current?.querySelector<HTMLElement>(".bs-link"),
      ].filter((el): el is HTMLElement => !!el);

      fadeEls.forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay: 0.3 + i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: wrapperRef.current!, start: "top 75%", once: true },
          }
        );
      });

      // ── Fix 16: Pillars — per-row scrub reveal (not single stagger-once) ─
      const rows = wrapperRef.current!.querySelectorAll<HTMLElement>(".pillar-row");
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              end: "top 52%",
              scrub: 1.2,
            },
          }
        );
      });

      // ── Main image: scrub clip-path reveal + parallax ────────────────────
      if (imgRef.current) {
        gsap.fromTo(imgRef.current,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current!,
              start: "top 85%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        );
        const imgInner = imgRef.current.querySelector<HTMLElement>(".bs-img-inner");
        if (imgInner) {
          gsap.fromTo(imgInner,
            { scale: 1.08 },
            {
              scale: 1.0,
              ease: "none",
              scrollTrigger: {
                trigger: wrapperRef.current!,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }
      }

      // ── Secondary image: staggered clip-path from bottom ─────────────────
      if (img2Ref.current) {
        gsap.fromTo(img2Ref.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current!,
              start: "top 65%",
              end: "top 15%",
              scrub: 1.2,
            },
          }
        );
        const img2Inner = img2Ref.current.querySelector<HTMLElement>(".bs-img2-inner");
        if (img2Inner) {
          gsap.fromTo(img2Inner,
            { scale: 1.08 },
            {
              scale: 1.0,
              ease: "none",
              scrollTrigger: {
                trigger: wrapperRef.current!,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }
      }
    }, wrapperRef);
    ctxRef.current = ctx;

    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <div ref={wrapperRef} data-section="building-science">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: content */}
            <div>
              <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
                The Differentiator
              </span>

              <h2
                ref={headlineRef}
                className="font-display font-bold text-black tracking-tight leading-[0.9] mb-8"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              >
                <span className="block overflow-hidden">
                  <span className="hl block">We Don&apos;t Estimate.</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="hl block">We Measure.</span>
                </span>
              </h2>

              <p ref={bodyRef} className="text-gray-500 leading-relaxed max-w-md mb-12">
                Most contractors know how to build. Fewer understand why buildings
                fail — and fewer still can prevent it before it happens. Every
                decision at 828 starts from how buildings actually perform, not
                from habit or assumption.
              </p>

              {/* All three pillars visible simultaneously */}
              <div className="border-t border-gray-100">
                {pillars.map((p, i) => (
                  <div
                    key={p.num}
                    className="pillar-row py-7 border-b border-gray-100 grid grid-cols-[4.5rem_1fr] gap-6 items-start"
                  >
                    {/* Number */}
                    <span
                      aria-hidden="true"
                      className="font-numbers font-bold leading-none select-none"
                      style={{
                        fontSize: "3.5rem",
                        color: i === 0 ? "#B87333" : "#8a8a8a",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                      }}
                    >
                      {p.num}
                    </span>

                    <div className="pt-1">
                      <h3
                        className="font-display font-bold text-black text-base mb-2 leading-snug"
                      >
                        {p.label}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="bs-link group inline-flex items-center gap-2 font-labels text-[11px] text-black tracking-[0.18em] uppercase border-b border-gray-300 pb-1 hover:border-[#B87333] hover:text-[#B87333] transition-colors duration-200 mt-10 block w-fit"
              >
                About 828 Construction
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Right: dual-image editorial composition */}
            <div className="relative">
              {/* Main image */}
              <div
                ref={imgRef}
                className="relative overflow-hidden bg-gray-100"
                style={{ aspectRatio: "4/3" }}
              >
                <div className="bs-img-inner absolute inset-0" style={{ willChange: "transform" }}>
                  <Image
                    src="/images/about/building-science.jpg"
                    alt="828 Construction — building science diagnostics, Torrance CA"
                    fill
                    className="object-cover saturate-[1.12] contrast-[1.06]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1.5">
                  <span className="font-labels text-[9px] text-gray-300 tracking-[0.18em] uppercase">
                    Structural Precision · Building Science
                  </span>
                </div>
              </div>

              {/* Bottom row: stat card + secondary image */}
              <div className="grid grid-cols-2 gap-[3px] mt-[3px]">
                {/* Stat card */}
                <div className="bg-black text-white p-6 flex flex-col justify-end" style={{ minHeight: 150 }}>
                  <div className="font-numbers font-bold text-3xl leading-none mb-1" style={{ color: "#B87333" }}>20+</div>
                  <div className="font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase leading-relaxed">
                    Years of Field Experience
                  </div>
                </div>

                {/* Secondary image */}
                <div
                  ref={img2Ref}
                  className="relative overflow-hidden bg-gray-200"
                  style={{ minHeight: 150 }}
                >
                  <div className="bs-img2-inner absolute inset-0" style={{ willChange: "transform" }}>
                    <Image
                      src="/images/about/craftsmanship.jpg"
                      alt="828 Construction — craftsmanship detail"
                      fill
                      className="object-cover saturate-[1.1] contrast-[1.05]"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
