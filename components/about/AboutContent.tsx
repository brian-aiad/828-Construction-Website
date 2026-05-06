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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (!AnimationController.shouldAnimate()) return;

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
    }, sectionRef);

    return () => { try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] lg:min-h-screen flex items-end overflow-hidden bg-black"
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

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" style={{ height: "40%" }} aria-hidden="true" />

      {/* Maroon top accent */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        aria-hidden="true"
        style={{ height: 2, background: `linear-gradient(to right, transparent 5%, var(--color-accent) 35%, var(--color-accent) 65%, transparent 95%)`, opacity: 0.5 }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24 w-full"
      >
        <div className="hero-meta-animate flex items-center gap-4 mb-8" style={{ animationDelay: "0.1s" }}>
          <div aria-hidden="true" style={{ width: 24, height: 1, background: "var(--color-accent)" }} />
          <span className="font-labels text-[10px] text-white/50 tracking-[0.25em] uppercase">
            Torrance, CA — Est. {FOUNDING_YEAR}
          </span>
        </div>

        {/* LCP headline — no initial-state animation, paints on first frame */}
        <h1
          className="font-display font-bold text-white leading-[0.92] tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)" }}
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
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const headRef = useRef<HTMLHeadingElement>(null);
  const splitRefs = useRef<SplitType[]>([]);

  useLayoutEffect(() => () => {
    splitRefs.current.forEach(s => { try { s.revert(); } catch {} });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let mounted = true;
    let splitFrame = -1;

    const ctx = gsap.context(() => {
      if (!AnimationController.shouldAnimate()) return;

      // Headline clip-reveal (Pattern C)
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
                yPercent: 0,
                stagger: 0.02,
                duration: 0.75,
                ease: "power3.out",
                scrollTrigger: { trigger: headRef.current, start: "top 80%", once: true },
              }
            );
          }
        });
      }

      // Paragraph line-by-line scrub reveals
      const paras = paraRefs.current.filter(Boolean) as HTMLParagraphElement[];
      paras.forEach((para, i) => {
        gsap.fromTo(para,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: para,
              start: "top 82%",
              end: "top 52%",
              scrub: 1.1,
            },
            delay: i * 0.05,
          }
        );
      });
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
    >
      {/* Compass silhouette — desktop right margin, slow spin */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
        style={{ width: "120px", opacity: 0.10, color: "black" }}
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
              Founded in {FOUNDING_YEAR}, 828 Construction is guided by a founder with over two
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
  const hairlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Hairline scaleX (Pattern D)
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.inOut",
            transformOrigin: "left",
            scrollTrigger: { trigger: section, start: "top 85%", once: true },
          }
        );
      }

      // Principle rows: scrub reveal per row (Fix 15)
      const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!AnimationController.shouldAnimate()) {
        gsap.set(rows, { opacity: 1, y: 0 });
        return;
      }
      rows.forEach((row) => {
        gsap.fromTo(row,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1,
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
    }, sectionRef);

    return () => { try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-24 lg:py-32"
      data-section="principles"
    >
      {/* Construction line silhouette — full-width drafting backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <ConstructionLineSilhouette
          className="w-full max-w-5xl"
          style={{ color: "white", opacity: 0.04 }}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
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
            style={{ height: 1, background: "var(--color-accent)", opacity: 0.45, width: "100%", maxWidth: 320 }}
            aria-hidden="true"
          />
        </div>

        {/* Optional laser-levels photo placeholder */}
        {/* TODO: Add laser-levels photo from Joe when available */}

        {/* Three principles */}
        <div className="space-y-0 divide-y divide-white/[0.06]">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.num}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="grid grid-cols-[4rem_1fr] lg:grid-cols-[8rem_1fr] gap-6 lg:gap-12 py-10 lg:py-12"
            >
              {/* Accent numeral */}
              <div
                className="font-numbers font-bold leading-none"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "var(--color-accent)", opacity: 0.9 }}
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
// Page signature: CRAFT watermark drifts horizontally via scrub as user scrolls.
// Unique to the About page — no other page uses this dual-layer typographic drift.

function AboutCRAFT() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // PAGE SIGNATURE: watermark drifts left as user scrolls through section
      if (watermarkRef.current && AnimationController.shouldAnimate()) {
        gsap.fromTo(watermarkRef.current,
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

      // Acronym items: reveal per item on scroll
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!AnimationController.shouldAnimate()) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      items.forEach((item) => {
        gsap.fromTo(item,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "top 55%",
              scrub: 1.1,
            },
          }
        );
      });
    }, sectionRef);

    return () => { try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] py-24 lg:py-36 overflow-hidden"
      data-section="craft"
    >
      {/* CRAFT watermark — background typographic element */}
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
            opacity: 0.04,
            letterSpacing: "0.05em",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          CRAFT
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12 lg:mb-16">
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

        {/* Acronym definitions */}
        <div className="space-y-0 divide-y divide-white/[0.06]">
          {CRAFT_ITEMS.map((item, i) => (
            <div
              key={item.letter}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="grid grid-cols-[3.5rem_1fr] lg:grid-cols-[6rem_1fr] gap-6 lg:gap-10 py-8 lg:py-10"
            >
              {/* Large letter anchor */}
              <div
                className="font-display font-bold text-white leading-none"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", opacity: 0.7 }}
                aria-hidden="true"
              >
                {item.letter}
              </div>

              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className="font-display font-bold text-white tracking-tight"
                    style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
                  >
                    {item.word}
                  </span>
                  <div style={{ height: 1, width: 24, background: "var(--color-accent)", opacity: 0.5 }} aria-hidden="true" />
                </div>
                <GlassCard tone="dark" className="p-6 mt-3">
                  <p className="font-body text-white/50 leading-relaxed max-w-prose"
                    style={{ fontSize: "clamp(0.88rem, 1.25vw, 0.97rem)" }}>
                    {item.body}
                  </p>
                </GlassCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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

      {/* Two-layer marquee — background slower + reversed, foreground full speed */}
      <div
        className="relative overflow-hidden border-t border-b border-white/[0.06] py-5"
        aria-hidden="true"
      >
        {/* Background layer — slower, reversed, lower opacity */}
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "marqueeScroll 80s linear infinite reverse",
            opacity: 0.35,
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            alignItems: "center",
          }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-0 pr-0">
              {SERVICE_AREAS.map((area, j) => (
                <span key={`${copy}-${j}`} className="flex items-center">
                  <span className="font-labels text-[11px] text-white/60 tracking-[0.22em] uppercase whitespace-nowrap px-6">
                    {area}
                  </span>
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--color-accent)", opacity: 0.4 }}
                    aria-hidden="true"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* Foreground layer — existing speed, full opacity */}
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "marqueeScroll 40s linear infinite",
            position: "relative",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "running"; }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-0 pr-0">
              {SERVICE_AREAS.map((area, j) => (
                <span key={`${copy}-${j}`} className="flex items-center">
                  <span className="font-labels text-[11px] text-white/60 tracking-[0.22em] uppercase whitespace-nowrap px-6">
                    {area}
                  </span>
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--color-accent)", opacity: 0.4 }}
                    aria-hidden="true"
                  />
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
