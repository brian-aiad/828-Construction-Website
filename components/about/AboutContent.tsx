"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE, FOUNDING_YEAR, SERVICE_AREAS } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import GlassCard from "@/components/system/GlassCard";
import { ConstructionLineSilhouette, CompassSilhouette } from "@/components/system/silhouettes";

gsap.registerPlugin(ScrollTrigger);

// ─── V2 About — 6 sections per V2 brief ──────────────────────────────────────
// 1. Hero (photo background, Option B)
// 2. Story (short version, FOUNDING_YEAR from constants)
// 3. Three Principles
// 4. CRAFT Acronym (watermark backdrop — page signature: xPercent drift scrub)
// 5. South Bay Native (rolling marquee from SERVICE_AREAS)
// 6. CTA

const PRINCIPLES = [
  {
    num: "01",
    title: "Craft over count.",
    body: "Fewer projects. Full attention. Quality is never a byproduct of volume.",
  },
  {
    num: "02",
    title: "Built with purpose.",
    body: "Every specification carries a rationale. We don't value-engineer down — we build to actual performance requirements.",
  },
  {
    num: "03",
    title: "Quality is the strategy.",
    body: "Reputation is built one project at a time. Long-term client relationships are the only metric that matters.",
  },
];

const CRAFT_ITEMS = [
  {
    letter: "C",
    word: "Curiosity",
    body: "Drives how 828 builds — digging deeper into details, uncovering smarter solutions to complex construction challenges.",
  },
  {
    letter: "R",
    word: "Relatability",
    body: "Guides our work by understanding each client's perspective so we can serve with clarity.",
  },
  {
    letter: "A",
    word: "Alignment",
    body: "Where intent, design, and execution come together seamlessly — like the relationship between builder and client.",
  },
  {
    letter: "F",
    word: "Forged",
    body: "Through experience and precision, 828 translates our clients' vision into remarkable spaces defined with design integrity and strategy.",
  },
  {
    letter: "T",
    word: "Tailored",
    body: "To each client's vision — 828's approach ensures every detail is shaped through close collaboration between builder and owner for a truly bespoke result.",
  },
];

// ─── Section 1: Hero ─────────────────────────────────────────────────────────

function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);

  useLayoutEffect(() => () => {
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let mounted = true;
    let splitFrame = -1;
    let localSplit: SplitType | null = null;
    const headlineEl = headlineRef.current;

    const ctx = gsap.context(() => {
      // Photo parallax — all viewports
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1 },
        });
      }

      // Maroon hairline grows from width 0 → 100%
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: "power2.inOut", transformOrigin: "left", delay: 0.2 }
        );
      }

      // Headline char reveal — desktop only
      if (headlineEl && AnimationController.shouldAnimate()) {
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !headlineEl.isConnected) return;
          const split = new SplitType(headlineEl, { types: "words,chars" });
          localSplit = split;
          splitRef.current = split;
          const chars = split.chars ?? [];
          if (chars.length) {
            gsap.fromTo(chars,
              { y: 100, rotateX: 60, opacity: 0 },
              {
                y: 0, rotateX: 0, opacity: 1,
                stagger: 0.022, duration: 0.8,
                ease: "power3.out",
                delay: 0.3,
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (localSplit && headlineEl?.isConnected) { try { localSplit.revert(); } catch {} }
      splitRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] lg:min-h-screen flex items-end bg-black"
      style={{ overflowX: "clip" }}
      aria-label="About 828 Construction"
    >
      {/* Background photo */}
      <div
        ref={bgRef}
        className="absolute inset-x-0"
        style={{ top: "-12%", height: "125%", willChange: "transform" }}
        aria-hidden="true"
      >
        <Image
          src="/images/about/about-hero.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
          style={{ filter: "contrast(1.04) saturate(1.05) brightness(0.85)" }}
        />
      </div>

      {/* Drifting mesh gradient — depth layer at 0.30 opacity */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: 1 }}>
        <div
          style={{
            position: "absolute", borderRadius: "50%",
            width: "60%", height: "70%", top: "-10%", left: "-5%",
            background: "radial-gradient(ellipse, rgba(123,45,38,0.28) 0%, transparent 70%)",
            animation: "meshDrift1 16s ease-in-out infinite",
            opacity: 0.30,
          }}
        />
        <div
          style={{
            position: "absolute", borderRadius: "50%",
            width: "50%", height: "60%", top: "20%", right: "-10%",
            background: "radial-gradient(ellipse, rgba(184,115,51,0.20) 0%, transparent 70%)",
            animation: "meshDrift2 16s ease-in-out infinite 4s",
            opacity: 0.30,
          }}
        />
        <div
          style={{
            position: "absolute", borderRadius: "50%",
            width: "45%", height: "50%", bottom: "-5%", left: "30%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)",
            animation: "meshDrift3 16s ease-in-out infinite 8s",
            opacity: 0.30,
          }}
        />
      </div>

      {/* ConstructionLineSilhouette — slow 180s rotation at full viewport size */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2, color: "white", opacity: 0.10 }}
      >
        <div style={{ animation: "compassSpinInner 180s linear infinite", width: "100%", maxWidth: "100vw" }}>
          <ConstructionLineSilhouette style={{ width: "100%", height: "auto" }} />
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" aria-hidden="true" style={{ zIndex: 3 }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" style={{ height: "40%", zIndex: 3 }} aria-hidden="true" />

      {/* Maroon hairline — grows on entry, NS Builders signature */}
      <div
        ref={hairlineRef}
        className="absolute top-0 left-0 right-0 z-20"
        aria-hidden="true"
        style={{
          height: 2,
          background: `linear-gradient(to right, transparent 5%, var(--color-accent) 35%, var(--color-accent) 65%, transparent 95%)`,
          opacity: 0.65,
          transformOrigin: "left",
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24 w-full"
        style={{ zIndex: 10 }}
      >
        <div className="hero-meta-animate flex items-center gap-4 mb-8" style={{ animationDelay: "0.1s" }}>
          <div aria-hidden="true" style={{ width: 24, height: 1, background: "var(--color-accent)" }} />
          <span className="font-labels text-[10px] text-white/50 tracking-[0.25em] uppercase">
            Torrance, CA — Est. {FOUNDING_YEAR}
          </span>
        </div>

        {/* LCP headline — first line paints immediately, second line animates */}
        <h1
          ref={headlineRef}
          className="font-display font-bold text-white leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)", perspective: "800px" }}
        >
          <span className="block">828</span>
          <span className="hero-line-animate block" style={{ animationDelay: "0.15s" }}>
            Construction.
          </span>
        </h1>

        <p
          className="hero-meta-animate font-body text-white/50 leading-relaxed mt-6 max-w-md"
          style={{ animationDelay: "0.35s", fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)" }}
        >
          Two decades. One standard.
        </p>
      </div>
    </section>
  );
}

// ─── Section 2: The Story ─────────────────────────────────────────────────────

function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const compassRef = useRef<HTMLDivElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const headRef = useRef<HTMLHeadingElement>(null);
  const splitRefs = useRef<SplitType[]>([]);
  const yearRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => () => {
    splitRefs.current.forEach(s => { try { s.revert(); } catch {} });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let mounted = true;
    let splitFrame = -1;

    const ctx = gsap.context(() => {
      // Compass: scroll parallax — yPercent drift + counter-rotation (desktop only)
      if (compassRef.current && AnimationController.shouldAnimate()) {
        gsap.to(compassRef.current, {
          yPercent: -50, rotation: -45, ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      }

      if (!AnimationController.shouldAnimate()) {
        // Mobile: simple paragraph reveals
        const paras = paraRefs.current.filter(Boolean) as HTMLParagraphElement[];
        paras.forEach((para) => {
          gsap.fromTo(para, { y: 20, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: para, start: "top 80%", once: true },
          });
        });
        return;
      }

      // Headline clip-reveal
      if (headRef.current) {
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !headRef.current?.isConnected) return;
          const spl = new SplitType(headRef.current!, { types: "words,chars" });
          splitRefs.current.push(spl);
          const chars = spl.chars ?? [];
          if (chars.length) {
            gsap.fromTo(chars,
              { yPercent: 110 },
              {
                yPercent: 0, stagger: 0.02, duration: 0.75, ease: "power3.out",
                scrollTrigger: { trigger: headRef.current, start: "top 80%", once: true },
              }
            );
          }
        });
      }

      // Paragraph scrub reveals
      const paras = paraRefs.current.filter(Boolean) as HTMLParagraphElement[];
      paras.forEach((para, i) => {
        gsap.fromTo(para,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, ease: "power3.out",
            scrollTrigger: { trigger: para, start: "top 82%", end: "top 52%", scrub: 1.1 },
            delay: i * 0.05,
          }
        );
      });

      // 2004 founding year: scale + maroon color flash on enter
      if (yearRef.current) {
        gsap.fromTo(yearRef.current,
          { scale: 0.8, color: "inherit" },
          {
            scale: 1, color: "var(--color-accent)",
            duration: 0.5, ease: "power3.out",
            scrollTrigger: { trigger: yearRef.current, start: "top 80%", once: true },
            onComplete: () => {
              gsap.to(yearRef.current!, { color: "inherit", duration: 0.8, ease: "power2.inOut" });
            }
          }
        );
      }
    }, sectionRef);

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      splitRefs.current.forEach((s, i) => {
        if (paraRefs.current[i]?.isConnected) { try { s.revert(); } catch {} }
      });
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-24 lg:py-36"
      data-section="story"
      style={{ overflowX: "clip" }}
    >
      {/* Compass silhouette — 400px, opacity 0.22, slow idle spin + scroll parallax */}
      <div
        ref={compassRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
        style={{ width: "400px", opacity: 0.22, color: "black", willChange: "transform" }}
      >
        <div style={{ animation: "compassSpinInner 60s linear infinite" }}>
          <CompassSilhouette style={{ width: "100%", height: "auto" }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left: eyebrow + headline */}
          <div className="lg:col-span-5">
            <p className="font-labels text-[10px] tracking-[0.25em] uppercase mb-6"
              style={{ color: "var(--color-accent)" }}>
              The story
            </p>
            <div style={{ overflow: "hidden" }}>
              <h2
                ref={headRef}
                className="font-display font-bold text-black leading-tight tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}
              >
                Built from the ground up.
              </h2>
            </div>
          </div>

          {/* Right: copy */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-6">
            <p
              ref={(el) => { paraRefs.current[0] = el; }}
              className="font-body text-gray-600 leading-relaxed"
              style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}
            >
              Founded in <span ref={yearRef} className="font-bold" style={{ display: "inline-block" }}>{FOUNDING_YEAR}</span>, 828 Construction is guided by a founder with over two
              decades of hands-on experience in residential construction. This depth of knowledge —
              built from working directly alongside skilled tradesmen — shapes a precise understanding
              of how homes are built and how they perform.
            </p>
            <p
              ref={(el) => { paraRefs.current[1] = el; }}
              className="font-body text-gray-600 leading-relaxed"
              style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}
            >
              That perspective informs every decision, from structural integrity to refined
              architectural details. The result is a disciplined approach to construction where
              craftsmanship, performance, and design are held to the highest standard.
            </p>
            <p
              ref={(el) => { paraRefs.current[2] = el; }}
              className="font-body text-gray-600 leading-relaxed"
              style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}
            >
              828 Construction exists to build clarity, intention, and enduring quality.
            </p>

            {/* Credentials row */}
            <div className="flex flex-wrap gap-6 mt-4 pt-6 border-t border-gray-100">
              {[
                { label: "CA License", value: `#${SITE.license}` },
                { label: "Est.", value: `${FOUNDING_YEAR}` },
                { label: "Home Base", value: "Torrance, CA" },
                { label: "Experience", value: "20+ Years" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase mb-0.5">
                    {label}
                  </p>
                  <p className="font-numbers text-black font-bold text-sm tracking-wide">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Three Principles ─────────────────────────────────────────────

function AboutPrinciples() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numeralRefs = useRef<(HTMLDivElement | null)[]>([]);
  const underlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hairlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 0.9, ease: "power2.inOut", transformOrigin: "left",
            scrollTrigger: { trigger: section, start: "top 85%", once: true },
          }
        );
      }

      const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
      const numerals = numeralRefs.current.filter(Boolean) as HTMLDivElement[];
      const underlines = underlineRefs.current.filter(Boolean) as HTMLDivElement[];

      if (!AnimationController.shouldAnimate()) {
        gsap.set(rows, { opacity: 1, y: 0 });
        // Underlines still grow on mobile
        underlines.forEach((u) => {
          gsap.fromTo(u, { scaleX: 0 }, {
            scaleX: 1, duration: 0.8, ease: "power2.inOut", transformOrigin: "left",
            scrollTrigger: { trigger: u, start: "top 85%", once: true },
          });
        });
        return;
      }

      // 3D perspective fly-in per row
      rows.forEach((row) => {
        gsap.fromTo(row,
          { translateZ: -200, rotateX: 40, opacity: 0 },
          {
            translateZ: 0, rotateX: 0, opacity: 1,
            duration: 1.0, ease: "power4.out",
            scrollTrigger: { trigger: row, start: "top 88%", end: "top 55%", scrub: 1 },
          }
        );
      });

      // Numeral "scale-land" — animate AFTER row is in (slight offset)
      numerals.forEach((num) => {
        gsap.fromTo(num,
          { scale: 2.0, opacity: 0 },
          {
            scale: 1.0, opacity: 0.9,
            ease: "power4.out",
            scrollTrigger: { trigger: num, start: "top 85%", end: "top 50%", scrub: 1.2 },
          }
        );
      });

      // Maroon underlines grow on entry
      underlines.forEach((u) => {
        gsap.fromTo(u, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: u, start: "top 85%", end: "top 65%", scrub: 1 },
        });
      });
    }, sectionRef);

    return () => { try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-24 lg:py-32"
      data-section="principles"
    >
      {/* Construction line silhouette — opacity elevated to 0.10 (was 0.04) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ overflowX: "clip" }}
      >
        <ConstructionLineSilhouette
          className="w-full max-w-5xl"
          style={{ color: "white", opacity: 0.10 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12" style={{ perspective: "1200px" }}>
        {/* Section header */}
        <div className="mb-12 lg:mb-16">
          <p className="font-labels text-[10px] text-white/40 tracking-[0.25em] uppercase mb-4">
            The standard
          </p>
          <h2
            className="font-display font-bold text-white leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Every detail shaped<br className="hidden lg:block" /> by precision.
          </h2>
          <div
            ref={hairlineRef}
            className="mt-6"
            style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, width: "100%", maxWidth: 320, transformOrigin: "left" }}
            aria-hidden="true"
          />
        </div>

        {/* Three principles — perspective container for 3D fly-in */}
        <div className="space-y-0 divide-y divide-white/[0.06]" style={{ transformStyle: "preserve-3d" }}>
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.num}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="grid grid-cols-[4rem_1fr] lg:grid-cols-[8rem_1fr] gap-6 lg:gap-12 py-10 lg:py-12"
            >
              {/* Numeral — scale-land from 2x */}
              <div
                ref={(el) => { numeralRefs.current[i] = el; }}
                className="font-numbers font-bold leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  color: "var(--color-accent)",
                  opacity: 0.9,
                  display: "inline-block",
                  transformOrigin: "center",
                }}
                aria-hidden="true"
              >
                {p.num}
              </div>

              <div>
                <h3
                  className="font-display font-bold text-white tracking-tight mb-3"
                  style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)" }}
                >
                  {p.title}
                </h3>
                {/* Maroon underline grows on entry */}
                <div
                  ref={(el) => { underlineRefs.current[i] = el; }}
                  style={{ height: 1, background: "var(--color-accent)", opacity: 0.55, transformOrigin: "left", maxWidth: "100%", marginBottom: "0.75rem" }}
                  aria-hidden="true"
                />
                <p className="font-body text-white/50 leading-relaxed max-w-prose"
                  style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}>
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: CRAFT Acronym ─────────────────────────────────────────────────
// Page signature: 5-phase scripted pin-scrub explosion. Watermark zooms in,
// drifts left, cards slide in one-by-one, watermark drifts back across.

function AboutCRAFT() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const wm = watermarkRef.current;
    if (!wrapper || !section || !wm) return;

    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!AnimationController.shouldAnimate()) {
      // Mobile: simple reveals, no pin
      gsap.set(items, { opacity: 0, y: 20 });
      items.forEach((item, i) => {
        gsap.to(item, {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 80%", once: true },
        });
      });
      return;
    }

    const vw = window.innerWidth;

    const ctx = gsap.context(() => {
      // Set initial states via gsap.set (NOT in JSX — Fix 14)
      gsap.set(wm, { scale: 4, opacity: 0.05, x: 0 });
      gsap.set(items, { x: vw, scale: 0.8, opacity: 0 });

      // Letters for individual rotation in phase 4
      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];

      // 5-phase scripted timeline, scrubbed to scroll
      const tl = gsap.timeline();

      // Phase 1 (0–10%): watermark zooms in from giant
      tl.to(wm, { scale: 1.6, opacity: 0.18, duration: 0.1, ease: "power2.inOut" }, 0);

      // Phase 2 (10–25%): watermark drifts left 30vw
      tl.to(wm, { x: -vw * 0.3, duration: 0.15, ease: "none" }, 0.1);

      // Phase 3 (25–80%): each card slides in from off-screen right, staggered
      items.forEach((item, i) => {
        const start = 0.25 + i * 0.11;
        tl.to(item, { x: 0, scale: 1, opacity: 1, duration: 0.09, ease: "power3.out" }, start);
      });

      // Phase 4 (80–95%): watermark drifts back across + letter rotations
      tl.to(wm, { x: vw * 0.25, duration: 0.15, ease: "none" }, 0.80);
      if (letters.length >= 5) {
        const rotations = [-8, -4, 0, 4, 8];
        letters.forEach((letter, i) => {
          tl.to(letter, { rotation: rotations[i], duration: 0.15, ease: "none" }, 0.80);
        });
      }

      // Phase 5 (95–100%): watermark fades
      tl.to(wm, { opacity: 0.05, duration: 0.05 }, 0.95);

      // ScrollTrigger: pin the section, scrub timeline to scroll
      ScrollTrigger.create({
        trigger: wrapper,
        pin: section,
        start: "top top",
        end: "+=200%",
        scrub: 1.2,
        anticipatePin: 1,
        animation: tl,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
        },
      });
    }, wrapper);

    return () => { try { ctx.revert(); } catch {} };
  }, []);

  return (
    // Outer wrapper — provides the scroll distance for the pin
    <div ref={wrapperRef}>
      <section
        ref={sectionRef}
        className="relative bg-[#0a0a0a] py-16 lg:py-24"
        data-section="craft"
        style={{ minHeight: "100vh", overflowX: "clip" }}
      >
        {/* CRAFT watermark — initial state set by gsap.set, not JSX style */}
        <div
          ref={watermarkRef}
          className="absolute inset-0 flex items-center pointer-events-none"
          aria-hidden="true"
          style={{ willChange: "transform" }}
        >
          <span
            className="font-display font-bold text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(12rem, 30vw, 28rem)",
              letterSpacing: "0.05em",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {CRAFT_ITEMS.map((item, i) => (
              <span
                key={item.letter}
                ref={(el) => { letterRefs.current[i] = el; }}
                style={{ display: "inline-block" }}
              >
                {item.letter}
              </span>
            ))}
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10 lg:mb-12">
            <p className="font-labels text-[10px] text-white/40 tracking-[0.25em] uppercase mb-4">
              Our philosophy
            </p>
            <h2
              className="font-display font-bold text-white leading-tight tracking-tight"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Built on craft.
            </h2>
          </div>

          {/* Acronym definitions — cards slide in from right (initial state via GSAP) */}
          <div className="space-y-0 divide-y divide-white/[0.06]">
            {CRAFT_ITEMS.map((item, i) => (
              <div
                key={item.letter}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="grid grid-cols-[3rem_1fr] lg:grid-cols-[5rem_1fr] gap-4 lg:gap-8 py-5 lg:py-6"
                data-gsap-reveal="true"
              >
                {/* Large letter glyph */}
                <div
                  className="font-display font-bold text-white leading-none"
                  style={{ fontSize: "clamp(3rem, 6vw, 6rem)", opacity: 0.85 }}
                  aria-hidden="true"
                >
                  {item.letter}
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span
                      className="font-display font-bold text-white tracking-tight"
                      style={{ fontSize: "clamp(1rem, 1.8vw, 1.4rem)" }}
                    >
                      {item.word}
                    </span>
                    <div style={{ height: 1, width: 24, background: "var(--color-accent)", opacity: 0.5 }} aria-hidden="true" />
                  </div>
                  <GlassCard tone="dark" className="p-4 lg:p-5">
                    <p className="font-body text-white/50 leading-relaxed"
                      style={{ fontSize: "clamp(0.82rem, 1.1vw, 0.9rem)" }}>
                      {item.body}
                    </p>
                  </GlassCard>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maroon progress bar — fills as user scrolls through pin */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2, background: "rgba(255,255,255,0.05)" }}
          aria-hidden="true"
        >
          <div
            ref={progressRef}
            style={{
              height: "100%",
              background: "var(--color-accent)",
              transformOrigin: "left",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </section>
    </div>
  );
}

// ─── Section 5: South Bay Native ─────────────────────────────────────────────

function AboutSouthBay() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (!AnimationController.shouldAnimate()) return;

      if (headRef.current) {
        gsap.fromTo(headRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%", once: true },
          }
        );
      }
    }, sectionRef);

    return () => { try { ctx.revert(); } catch {} };
  }, []);

  // Duplicate the items for seamless loop
  const marqueeItems = [...SERVICE_AREAS, ...SERVICE_AREAS];

  return (
    <section
      ref={sectionRef}
      className="bg-black py-20 lg:py-28 overflow-hidden"
      data-section="south-bay"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <div ref={headRef}>
          <p className="font-labels text-[10px] text-white/40 tracking-[0.25em] uppercase mb-3">
            Where we build
          </p>
          <h2
            className="font-display font-bold text-white leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            South Bay Native.
          </h2>
        </div>
      </div>

      {/* Two-layer marquee — background 3× larger + slower reversed, foreground 32s forward */}
      <div
        className="relative border-t border-b border-white/[0.06]"
        style={{ overflow: "hidden", height: "6rem" }}
        aria-hidden="true"
      >
        {/* Background layer — 3× larger font, 80s reverse, lower opacity */}
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "marqueeScroll 80s linear infinite reverse",
            opacity: 0.18,
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            alignItems: "center",
          }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {SERVICE_AREAS.map((area, j) => (
                <span key={`${copy}-${j}`} className="flex items-center">
                  <span
                    className="font-labels text-white/60 tracking-[0.22em] uppercase whitespace-nowrap px-8"
                    style={{ fontSize: "2.5rem" }}
                  >
                    {area}
                  </span>
                  <span
                    className="rounded-full"
                    style={{ width: 4, height: 4, background: "var(--color-accent)", opacity: 0.5, flexShrink: 0 }}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Foreground layer — 32s (was 40s, slightly faster), full opacity */}
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "marqueeScroll 32s linear infinite",
            position: "relative",
            height: "100%",
            alignItems: "center",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "running"; }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {SERVICE_AREAS.map((area, j) => (
                <span key={`${copy}-${j}`} className="flex items-center">
                  <span
                    className="font-labels text-[11px] text-white/70 tracking-[0.22em] uppercase whitespace-nowrap transition-transform duration-200 hover:-translate-y-1 px-6"
                    style={{ display: "inline-block" }}
                  >
                    <span style={{ color: "var(--color-accent)", marginRight: "0.3em" }}>·</span>
                    {area}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Visually hidden accessible list of service areas */}
      <ul className="sr-only">
        {SERVICE_AREAS.map(area => <li key={area}>{area}</li>)}
      </ul>
    </section>
  );
}

// ─── Section 6: CTA ──────────────────────────────────────────────────────────

function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const [ctaOpen, setCtaOpen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const els = textRefs.current.filter(Boolean) as HTMLElement[];
      if (!AnimationController.shouldAnimate()) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }
      els.forEach((el) => {
        gsap.fromTo(el,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", end: "top 52%", scrub: 1.1 },
          }
        );
      });
    }, sectionRef);

    return () => { try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0a0a0a] py-24 lg:py-36"
      data-section="about-cta"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <p
          ref={(el) => { textRefs.current[0] = el; }}
          className="font-labels text-[10px] text-white/40 tracking-[0.25em] uppercase mb-6"
        >
          Prepared to create
        </p>

        <h2
          ref={(el) => { textRefs.current[1] = el as HTMLElement; }}
          className="font-display font-bold text-white leading-tight tracking-tight mb-8 max-w-3xl mx-auto"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
        >
          Designed for clients who value seasoned experience.
        </h2>

        <div
          ref={(el) => { textRefs.current[2] = el; }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          {/* BOOK CALL asterisk dropdown */}
          <div className="relative">
            <button
              onClick={() => setCtaOpen(!ctaOpen)}
              aria-expanded={ctaOpen}
              className="btn-shine btn-lift flex items-center gap-2 bg-white text-black px-8 py-3.5 font-labels text-[10px] tracking-[0.18em] uppercase"
            >
              Book Call
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                  transform: ctaOpen ? "rotate(45deg)" : "rotate(0deg)",
                  fontWeight: 400,
                }}
              >
                +
              </span>
            </button>
            {ctaOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#000",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderTop: "1px solid var(--color-accent)",
                  padding: "12px 20px",
                  animation: "dropReveal 0.35s cubic-bezier(0.16,1,0.3,1) both",
                  zIndex: 10,
                  minWidth: "180px",
                  textAlign: "center",
                }}
              >
                <a
                  href={SITE.phoneHref}
                  className="font-numbers text-sm text-white hover:text-gray-300 transition-colors whitespace-nowrap tracking-wide"
                >
                  {SITE.phone}
                </a>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="inline-block border border-white/25 text-white px-8 py-3.5 font-labels text-[10px] tracking-[0.18em] uppercase btn-outline-hover"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────

export default function AboutContent() {
  return (
    <>
      {/* Section 1: Hero */}
      <AboutHero />

      {/* Section 2: The Story */}
      <AboutStory />

      {/* Section 3: Three Principles */}
      <AboutPrinciples />

      {/* Section 4: CRAFT Acronym — page signature: watermark xPercent drift */}
      <AboutCRAFT />

      {/* Section 5: South Bay Native — rolling marquee */}
      <AboutSouthBay />

      {/* Section 6: CTA */}
      <AboutCTA />
    </>
  );
}
