"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { useTilt } from "@/lib/hooks/useTilt";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";

gsap.registerPlugin(ScrollTrigger);

// V3 asymmetric 3-card services grid with 3D tilt + z-lift + maroon shadow.
// Layout: one tall featured card (ADU) left + two stacked smaller cards right.
// Hover: image scale 1.08 + z:40 + maroon box-shadow + 3D tilt.
// Pattern B (clip-path punch-in + rotateY) on scroll enter. Fix 20 (hover cleanup).

const SERVICE_IMAGES: Record<string, string> = {
  adu: "/images/projects/service-adu.jpg",
  remediation: "/images/projects/remediation-active.jpg",
  consulting: "/images/projects/consulting-plans.jpg",
};

const SERVICE_TAGLINES: Record<string, string> = {
  adu: "Designed for functionality, built to last.",
  remediation: "Root-cause solutions. Not surface fixes.",
  consulting: "Clarity before commitment.",
};

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=";

function imgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

export default function ServicesPreviewV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverCleanups = useRef<Array<() => void>>([]);

  // 3D tilt refs — one per card
  const tilt0Ref = useTilt(10) as React.MutableRefObject<HTMLDivElement | null>;
  const tilt1Ref = useTilt(10) as React.MutableRefObject<HTMLDivElement | null>;
  const tilt2Ref = useTilt(10) as React.MutableRefObject<HTMLDivElement | null>;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      if (!AnimationController.shouldAnimate()) {
        // Mobile: immediate reveal
        gsap.set(cards, { clipPath: "inset(0%)", opacity: 1, rotationY: 0, y: 0 });
        return;
      }

      const imageEls = cards
        .map((card) => card.querySelector<HTMLElement>(".svc-card-img"))
        .filter(Boolean) as HTMLElement[];
      const textEls = cards
        .flatMap((card) => Array.from(card.querySelectorAll<HTMLElement>(".svc-card-copy > *")));

      gsap.set(cards, {
        clipPath: "inset(16% 5% 16% 5%)",
        opacity: 0,
        y: 58,
        rotationY: 10,
      });
      gsap.set(imageEls, { scale: 1.14, yPercent: 4 });
      gsap.set(textEls, { y: 14, opacity: 0 });

      const revealTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: gridRef.current ?? section,
          start: "top 92%",
          end: "top 32%",
          scrub: 0.85,
        },
      });

      revealTl
        .to(cards, {
          clipPath: "inset(0%)",
          opacity: 1,
          y: 0,
          rotationY: 0,
          stagger: { each: 0.22, from: "start" },
          duration: 1.35,
        })
        .to(
          imageEls,
          {
            scale: 1,
            yPercent: 0,
            stagger: { each: 0.22, from: "start" },
            duration: 1.45,
          },
          "<0.05"
        )
        .to(
          textEls,
          {
            y: 0,
            opacity: 1,
            stagger: 0.045,
            duration: 0.75,
          },
          "<0.42"
        );

      // Hover: image scale + maroon border + z-lift + box-shadow (Fix 20 — store removers)
      if (window.matchMedia("(hover: hover)").matches) {
        cards.forEach((card) => {
          const imgEl = card.querySelector<HTMLElement>(".svc-card-img");
          const barEl = card.querySelector<HTMLElement>(".svc-card-bar");

          const onEnter = () => {
            if (imgEl) gsap.to(imgEl, { scale: 1.08, duration: 0.7, ease: "power2.out" });
            if (barEl) gsap.to(barEl, { scaleX: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(card, { z: 40, boxShadow: "0 30px 60px -20px rgba(99,26,22,0.5)", duration: 0.5, ease: "power2.out" });
          };
          const onLeave = () => {
            if (imgEl) gsap.to(imgEl, { scale: 1, duration: 0.7, ease: "power2.out" });
            if (barEl) gsap.to(barEl, { scaleX: 0, duration: 0.3, ease: "power2.in" });
            gsap.to(card, { z: 0, boxShadow: "none", duration: 0.5, ease: "power2.out" });
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
      className="relative -mt-[16svh] overflow-hidden bg-black pb-24 pt-[22svh] lg:pb-40 lg:pt-[26svh]"
      data-section="services-v2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[24svh] bg-gradient-to-b from-transparent via-black/78 to-black"
      />
      <DraftingMotionLayer intensity="standard" className="opacity-35" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-10 grid gap-7 lg:mb-16 lg:grid-cols-[0.9fr_1fr] lg:items-end lg:gap-12">
          <div>
            <h2 className="max-w-[12ch] font-editorial font-semibold text-white leading-[0.88]"
              style={{ fontSize: "clamp(3.2rem, 5.5vw, 5.8rem)" }}>
              One company,<br className="hidden lg:block" /> <span className="text-white/40">multiple solutions.</span>
            </h2>
          </div>
          <div className="max-w-xl border-l border-white/10 pl-5 lg:justify-self-end lg:pl-8">
            <p className="font-body text-sm leading-6 text-white/58 sm:text-base lg:text-lg lg:leading-relaxed">
              Whether it&apos;s an ongoing maintenance, essential repairs, or a
              new ADU. 828 Construction helps homeowners bring their vision to
              life and keep their homes performing at their best.
            </p>
            <Link
              href="/services"
              className="mt-7 hidden w-fit items-center gap-2 border-b border-white/15 pb-1 font-labels text-[11px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white lg:flex group"
            >
              All Services
              <span className="transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
            </Link>
          </div>
        </div>

        {/* Asymmetric grid: ADU tall left | Remediation + Consulting stacked right */}
        <div ref={gridRef} className="grid grid-cols-1 gap-3 lg:grid-cols-[3fr_2fr] lg:gap-4">

          {/* ADU — tall featured card with 3D tilt */}
          <div
            ref={(el) => {
              cardRefs.current[0] = el;
              tilt0Ref.current = el;
            }}
            className="relative group min-h-[21rem] overflow-hidden cursor-pointer sm:min-h-[24rem] lg:min-h-[clamp(350px,58vh,560px)]"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            data-gsap-reveal="true"
          >
            <Link href={`/services/${adu.slug}`} className="absolute inset-0 z-20" aria-label={adu.title} />
            <div className="svc-card-img absolute inset-0" style={{ willChange: "transform" }}>
              <Image
                src={SERVICE_IMAGES[adu.slug]}
                alt={adu.title}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 60vw"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                onError={imgError}
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

            <div className="svc-card-copy absolute bottom-0 left-0 right-0 z-10 p-5 lg:p-8">
              <p className="font-labels text-[9px] text-white/40 tracking-[0.22em] uppercase mb-2">
                {adu.short}
              </p>
              <h3 className="font-editorial font-semibold text-white tracking-normal mb-2 leading-none"
                style={{ fontSize: "clamp(1.65rem, 6vw, 2.35rem)" }}>
                {adu.title}
              </h3>
              <p className="font-body text-white/55 text-sm leading-relaxed max-w-xs">
                {SERVICE_TAGLINES[adu.slug]}
              </p>
            </div>
          </div>

          {/* Right column: Remediation + Consulting stacked */}
          <div className="flex flex-col gap-3">

            {/* Remediation — 3D tilt */}
            <div
              ref={(el) => {
                cardRefs.current[1] = el;
                tilt1Ref.current = el;
              }}
              className="relative group min-h-[13.75rem] flex-1 overflow-hidden cursor-pointer sm:min-h-[15rem] lg:min-h-[clamp(170px,27vh,272px)]"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
              data-gsap-reveal="true"
            >
              <Link href={`/services/${remediation.slug}`} className="absolute inset-0 z-20" aria-label={remediation.title} />
              <div className="svc-card-img absolute inset-0" style={{ willChange: "transform" }}>
                <Image
                  src={SERVICE_IMAGES[remediation.slug]}
                  alt={remediation.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  onError={imgError}
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
              <div className="svc-card-copy absolute bottom-0 left-0 right-0 z-10 p-5 lg:p-6">
                <p className="font-labels text-[9px] text-white/40 tracking-[0.22em] uppercase mb-1.5">
                  {remediation.short}
                </p>
                <h3 className="font-editorial font-semibold text-white tracking-normal leading-none"
                  style={{ fontSize: "clamp(1.4rem, 5vw, 1.9rem)" }}>
                  {remediation.title}
                </h3>
                <p className="font-body text-white/50 text-xs leading-relaxed mt-1">
                  {SERVICE_TAGLINES[remediation.slug]}
                </p>
              </div>
            </div>

            {/* Consulting — 3D tilt */}
            <div
              ref={(el) => {
                cardRefs.current[2] = el;
                tilt2Ref.current = el;
              }}
              className="relative group min-h-[13.75rem] flex-1 overflow-hidden cursor-pointer sm:min-h-[15rem] lg:min-h-[clamp(170px,27vh,272px)]"
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
              data-gsap-reveal="true"
            >
              <Link href={`/services/${consulting.slug}`} className="absolute inset-0 z-20" aria-label={consulting.title} />
              <div className="svc-card-img absolute inset-0" style={{ willChange: "transform" }}>
                <Image
                  src={SERVICE_IMAGES[consulting.slug]}
                  alt={consulting.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  onError={imgError}
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
              <div className="svc-card-copy absolute bottom-0 left-0 right-0 z-10 p-5 lg:p-6">
                <p className="font-labels text-[9px] text-white/40 tracking-[0.22em] uppercase mb-1.5">
                  {consulting.short}
                </p>
                <h3 className="font-editorial font-semibold text-white tracking-normal leading-none"
                  style={{ fontSize: "clamp(1.4rem, 5vw, 1.9rem)" }}>
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
