"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "@/components/animations/FadeIn";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    label: "Root Cause Over Symptom",
    body: "Most failures have a predictable cause. We find it before the fix — not after the second round of repairs.",
  },
  {
    label: "Material Reality",
    body: "Materials move. Water finds paths. Assemblies fail in ways that are well understood — if you're paying attention. We are.",
  },
  {
    label: "Scope Before Commitment",
    body: "Clear scope before a dollar is spent. No scope creep, no surprise costs, no 'while we were in there' additions that weren't agreed to.",
  },
];

export default function BuildingScience() {
  const pillarsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !pillarsRef.current) return;

    const rows = pillarsRef.current.querySelectorAll<HTMLElement>(".pillar-row");
    const numbers = pillarsRef.current.querySelectorAll<HTMLElement>(".pillar-number");

    const ctx = gsap.context(() => {
      // Sequential pillar reveal (stagger 0.25s for emphasis)
      gsap.from(rows, {
        opacity: 0,
        x: -50,
        duration: 0.9,
        stagger: { each: 0.25, from: "start" },
        ease: "power3.out",
        scrollTrigger: {
          trigger: pillarsRef.current,
          start: "top 78%",
        },
      });

      // Numbers: slide up from below with spring
      gsap.from(numbers, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: { each: 0.22, from: "start" },
        ease: "power3.out",
        scrollTrigger: {
          trigger: pillarsRef.current,
          start: "top 78%",
        },
      });

      // Image parallax — drifts up slightly as user scrolls
      if (imageRef.current) {
        gsap.to(imageRef.current.querySelector("img"), {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, pillarsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section data-section="building-science" className="bg-white py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: content */}
          <div>
            <FadeIn>
              <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
                The Differentiator
              </span>
              <h2
                className="font-display font-bold text-black mt-4 tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
              >
                We Don&apos;t Estimate.
                <br />
                We Measure.
              </h2>
              <p className="text-gray-500 mt-8 leading-relaxed max-w-md">
                Most contractors know how to build. Fewer understand why buildings
                fail — and fewer still can prevent it before it happens. Every
                decision at 828 starts from how buildings actually perform, not from
                habit or assumption.
              </p>
            </FadeIn>

            {/* Pillars — editorial: large number anchors each row */}
            <div ref={pillarsRef} className="mt-12 border-t border-gray-100">
              {pillars.map((p, i) => (
                <div
                  key={p.label}
                  className="pillar-row py-7 border-b border-gray-100 grid grid-cols-[4.5rem_1fr] gap-6 items-start"
                >
                  {/* Large decorative number */}
                  <span
                    className="pillar-number font-numbers font-bold leading-none select-none"
                    style={{ fontSize: "3.5rem", color: "#B87333", lineHeight: 1, letterSpacing: "-0.03em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display font-bold text-black text-base mb-2 leading-snug">
                      {p.label}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <FadeIn delay={0.3} className="mt-10">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 font-labels text-[11px] text-black tracking-[0.18em] uppercase border-b border-gray-300 pb-1 hover:border-[#B87333] hover:text-[#B87333] transition-colors duration-200"
              >
                About 828 Construction
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </FadeIn>
          </div>

          {/* Right: image */}
          <div className="relative" ref={imageRef}>
            <FadeIn delay={0.2}>
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src="/images/about/building-science.jpg"
                  alt="828 Construction — building science precision framing"
                  fill
                  className="object-cover saturate-[1.12] contrast-[1.06]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1.5">
                  <span className="font-labels text-[9px] text-gray-300 tracking-[0.18em] uppercase">
                    Structural Precision · Building Science
                  </span>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-black text-white p-6 w-44">
                <div className="font-numbers font-bold text-3xl text-white mb-1">20+</div>
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase leading-relaxed">
                  Years of Field Experience
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
