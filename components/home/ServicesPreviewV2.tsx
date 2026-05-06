"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// V2 asymmetric 3-card services grid.
// Layout: one tall featured card (ADU) left + two stacked smaller cards right.
// Hover: image scale 1.05 + maroon bottom border reveal.
// Pattern B (clip-path punch-in) on scroll enter. Fix 20 (hover cleanup).

const SERVICE_IMAGES: Record<string, string> = {
  adu: "/images/projects/adu-exterior-new.jpg",
  remediation: "/images/projects/remediation-after.jpg",
  consulting: "/images/projects/consulting-blueprints.jpg",
};

const SERVICE_TAGLINES: Record<string, string> = {
  adu: "Designed for functionality, built to last.",
  remediation: "Root-cause solutions. Not surface fixes.",
  consulting: "Clarity before commitment.",
};

export default function ServicesPreviewV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverCleanups = useRef<Array<() => void>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      // Set GSAP initial states (Fix 14 — never in JSX)
      gsap.set(cards, { clipPath: "inset(8% 4% 8% 4%)", opacity: 0 });

      if (!AnimationController.shouldAnimate()) {
        // Mobile: immediate reveal
        gsap.set(cards, { clipPath: "inset(0%)", opacity: 1 });
        return;
      }

      // Pattern B: clip-path punch-in on scroll enter
      gsap.to(cards, {
        clipPath: "inset(0%)",
        opacity: 1,
        stagger: { each: 0.12, from: "start" },
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });

      // Hover: image scale + maroon border (Fix 20 — store removers)
      if (window.matchMedia("(hover: hover)").matches) {
        cards.forEach((card) => {
          const imgEl = card.querySelector<HTMLElement>(".svc-card-img");
          const barEl = card.querySelector<HTMLElement>(".svc-card-bar");

          const onEnter = () => {
            if (imgEl) gsap.to(imgEl, { scale: 1.05, duration: 0.7, ease: "power2.out" });
            if (barEl) gsap.to(barEl, { scaleX: 1, duration: 0.3, ease: "power2.out" });
          };
          const onLeave = () => {
            if (imgEl) gsap.to(imgEl, { scale: 1, duration: 0.7, ease: "power2.out" });
            if (barEl) gsap.to(barEl, { scaleX: 0, duration: 0.3, ease: "power2.in" });
          };

          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);
          hoverCleanups.current.push(() => {
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
          });
        });
      }
    }, sectionRef);

    return () => {
      hoverCleanups.current.forEach(fn => fn());
      hoverCleanups.current = [];
      try { ctx.revert(); } catch {}
    };
  }, []);

  const [adu, remediation, consulting] = SERVICES;

  return (
    <section
      ref={sectionRef}
      className="bg-black py-20 lg:py-28"
      data-section="services-v2"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10 lg:mb-14">
          <div>
            <p className="font-labels text-[10px] text-white/40 tracking-[0.25em] uppercase mb-3">
              What we build
            </p>
            <h2 className="font-display font-normal text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Three disciplines.<br className="hidden lg:block" /> One standard.
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden lg:flex items-center gap-2 font-labels text-[11px] text-white/40 tracking-[0.18em] uppercase hover:text-white transition-colors group"
          >
            All Services
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Asymmetric grid: ADU tall left | Remediation + Consulting stacked right */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-3">

          {/* ADU — tall featured card */}
          <div
            ref={(el) => { cardRefs.current[0] = el; }}
            className="relative group overflow-hidden cursor-pointer"
            style={{ minHeight: "clamp(360px, 60vh, 600px)" }}
            data-gsap-reveal="true"
          >
            <Link href={`/services/${adu.slug}`} className="absolute inset-0 z-20" aria-label={adu.title} />
            <div className="svc-card-img absolute inset-0" style={{ willChange: "transform" }}>
              <Image
                src={SERVICE_IMAGES[adu.slug]}
                alt={adu.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                style={{ filter: "contrast(1.05) saturate(1.08)" }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />

            {/* Maroon bottom bar — scaleX 0→1 on hover */}
            <div
              className="svc-card-bar absolute bottom-0 left-0 right-0 z-10"
              style={{ height: 2, background: "var(--color-accent)", transform: "scaleX(0)", transformOrigin: "left" }}
              aria-hidden="true"
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-10">
              <p className="font-labels text-[9px] text-white/40 tracking-[0.22em] uppercase mb-2">
                {adu.short}
              </p>
              <h3 className="font-display font-bold text-white tracking-tight mb-2"
                style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)" }}>
                {adu.title}
              </h3>
              <p className="font-body text-white/55 text-sm leading-relaxed max-w-xs">
                {SERVICE_TAGLINES[adu.slug]}
              </p>
            </div>
          </div>

          {/* Right column: Remediation + Consulting stacked */}
          <div className="flex flex-col gap-3">

            {/* Remediation */}
            <div
              ref={(el) => { cardRefs.current[1] = el; }}
              className="relative group overflow-hidden cursor-pointer flex-1"
              style={{ minHeight: "clamp(180px, 28vh, 290px)" }}
              data-gsap-reveal="true"
            >
              <Link href={`/services/${remediation.slug}`} className="absolute inset-0 z-20" aria-label={remediation.title} />
              <div className="svc-card-img absolute inset-0" style={{ willChange: "transform" }}>
                <Image
                  src={SERVICE_IMAGES[remediation.slug]}
                  alt={remediation.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  style={{ filter: "contrast(1.05) saturate(1.08)" }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
              <div
                className="svc-card-bar absolute bottom-0 left-0 right-0 z-10"
                style={{ height: 2, background: "var(--color-accent)", transform: "scaleX(0)", transformOrigin: "left" }}
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 z-10">
                <p className="font-labels text-[9px] text-white/40 tracking-[0.22em] uppercase mb-1.5">
                  {remediation.short}
                </p>
                <h3 className="font-display font-bold text-white tracking-tight"
                  style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)" }}>
                  {remediation.title}
                </h3>
                <p className="font-body text-white/50 text-xs leading-relaxed mt-1">
                  {SERVICE_TAGLINES[remediation.slug]}
                </p>
              </div>
            </div>

            {/* Consulting */}
            <div
              ref={(el) => { cardRefs.current[2] = el; }}
              className="relative group overflow-hidden cursor-pointer flex-1"
              style={{ minHeight: "clamp(180px, 28vh, 290px)" }}
              data-gsap-reveal="true"
            >
              <Link href={`/services/${consulting.slug}`} className="absolute inset-0 z-20" aria-label={consulting.title} />
              <div className="svc-card-img absolute inset-0" style={{ willChange: "transform" }}>
                <Image
                  src={SERVICE_IMAGES[consulting.slug]}
                  alt={consulting.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  style={{ filter: "contrast(1.05) saturate(1.08)" }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
              <div
                className="svc-card-bar absolute bottom-0 left-0 right-0 z-10"
                style={{ height: 2, background: "var(--color-accent)", transform: "scaleX(0)", transformOrigin: "left" }}
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 z-10">
                <p className="font-labels text-[9px] text-white/40 tracking-[0.22em] uppercase mb-1.5">
                  {consulting.short}
                </p>
                <h3 className="font-display font-bold text-white tracking-tight"
                  style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)" }}>
                  {consulting.title}
                </h3>
                <p className="font-body text-white/50 text-xs leading-relaxed mt-1">
                  {SERVICE_TAGLINES[consulting.slug]}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile "All Services" CTA */}
        <div className="mt-8 lg:hidden text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-labels text-[11px] text-white/40 tracking-[0.18em] uppercase hover:text-white transition-colors group border-b border-white/15 pb-1"
          >
            All Services
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
