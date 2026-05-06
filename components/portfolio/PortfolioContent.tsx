"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE, PROJECTS, PROCESS_STEPS_V2, Project } from "@/lib/constants";
import Lightbox from "@/components/gallery/Lightbox";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { AnimationController } from "@/utils/animationControl";
import { CompassSilhouette } from "@/components/system/silhouettes";

gsap.registerPlugin(ScrollTrigger);

// ─── Gallery layout data ──────────────────────────────────────────────────────
// Mixed-size grid: NOT uniform 3-up. Rows alternate between 2:1, full-width, 3-equal.
// Signature: sequential row-by-row reveal — portfolio "reads" like a visual timeline.

type RowLayout =
  | { type: "split21"; wide: Project; narrow: Project }
  | { type: "full"; project: Project }
  | { type: "triple"; a: Project; b: Project; c: Project }
  | { type: "split12"; narrow: Project; wide: Project };

const P = PROJECTS;

const galleryRows: RowLayout[] = [
  { type: "split21", wide: P[10], narrow: P[0] },      // ADU exterior (large) + Bath herringbone
  { type: "full",    project: P[2] },                  // South Bay Outdoor (full-width banner)
  { type: "triple",  a: P[11], b: P[9],  c: P[8] },   // Garage + Remediation + Consulting
  { type: "split12", narrow: P[7], wide: P[12] },      // Outdoor patio + Kitchen dark (large)
  { type: "triple",  a: P[3],  b: P[1],  c: P[4] },   // Shower + Bath geometric + Bath LED
  { type: "split21", wide: P[13], narrow: P[6] },      // Foundation (large) + Bath warm
];

// ─── Gallery image tile ───────────────────────────────────────────────────────

function GalleryTile({
  project,
  height,
  tileIndex,
  onClick,
}: {
  project: Project;
  height: string;
  tileIndex: number;
  onClick: (p: Project) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = imgInnerRef.current;
    const bar = barRef.current;
    if (!wrap || !inner || !bar) return;

    // Fix 14: set initial states before gate
    gsap.set(wrap, { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left" });

    if (!AnimationController.shouldAnimate()) {
      // Fix 15: mobile — clear immediately
      gsap.set(wrap, { clipPath: "inset(0%)", opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(wrap, {
        clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
        duration: 1.1, ease: "power3.out",
        delay: (tileIndex % 3) * 0.1,
        scrollTrigger: { trigger: wrap, start: "top 92%", once: true },
      });

      // Pattern F: parallax image inner
      gsap.to(inner, {
        yPercent: -10, ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, wrapRef);

    const onEnter = () => {
      gsap.to(inner, { scale: 1.04, duration: 0.7, ease: "power2.out" });
      gsap.to(bar, { scaleX: 1, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => {
      gsap.to(inner, { scale: 1.0, duration: 0.7, ease: "power2.out" });
      gsap.to(bar, { scaleX: 0, duration: 0.3, ease: "power2.in" });
    };

    if (window.matchMedia("(hover: hover)").matches) {
      wrap.addEventListener("mouseenter", onEnter);
      wrap.addEventListener("mouseleave", onLeave);
    }

    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      try { ctx.revert(); } catch {}
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden group cursor-pointer bg-[#111] h-full"
      style={{ minHeight: height }}
      onClick={() => onClick(project)}
      data-gsap-reveal="true"
    >
      <div
        ref={imgInnerRef}
        className="absolute inset-x-0"
        style={{ top: "-7.5%", height: "115%" }}
      >
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          style={{ filter: "contrast(1.06) saturate(1.1)" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          fallback={<div className="w-full h-full plate-concrete" aria-hidden="true" />}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      {/* Category badge */}
      <div className="absolute top-4 left-4">
        <span className="font-labels text-[8px] text-white/55 tracking-[0.2em] uppercase bg-black/60 px-2 py-1 backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      {/* View overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
        style={{ transition: "opacity 0.3s ease" }}
      >
        <span className="font-labels text-[10px] text-white tracking-[0.22em] uppercase bg-black/60 px-4 py-2 backdrop-blur-sm">
          View Project
        </span>
      </div>

      {/* Project info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="font-labels text-[8px] text-white/40 tracking-[0.2em] uppercase mb-1">
          {project.location}
        </div>
        <h3
          className="font-display font-bold text-white leading-[1.04] tracking-tight"
          style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)" }}
        >
          {project.title}
        </h3>
        <p className="font-labels text-[8px] text-white/30 tracking-wide mt-1 line-clamp-1">
          {project.spec}
        </p>
      </div>

      {/* Maroon hover bar */}
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 2, background: "var(--color-accent)" }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Section: Hero ────────────────────────────────────────────────────────────

function PortfolioHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => {
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    const shouldAnimate = AnimationController.shouldAnimate();

    if (!shouldAnimate) {
      const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (fadeEls?.length) gsap.set(Array.from(fadeEls), { opacity: 1, y: 0 });
      return;
    }

    let mounted = true;
    let splitFrame = -1;
    let heroSplit: SplitType | null = null;
    let heroLineEl: HTMLElement | null = null;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -15, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: 5, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // 4-guard SplitType (Fix 1)
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".portfolio-hero-line");
        if (heroLine && heroLine.isConnected) {
          heroLineEl = heroLine;
          const split = new SplitType(heroLine, { types: "words,chars" });
          heroSplit = split;
          splitRef.current = split;
          const chars = split.chars ?? [];
          gsap.to(chars, {
            yPercent: -80, opacity: 0,
            stagger: { each: 0.014, from: "random" }, ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "30% top", end: "bottom top", scrub: 1.2 },
          });
          const lcpLine = headlineRef.current?.querySelector(".portfolio-lcp-line");
          if (lcpLine) {
            gsap.to(lcpLine, {
              opacity: 0, ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "25% top", end: "65% top", scrub: 1.2 },
            });
          }
        }
      });

      const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (fadeEls?.length) {
        gsap.fromTo(Array.from(fadeEls),
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, delay: 0.3, ease: "power3.out" }
        );
      }
    }, sectionRef);
    ctxRef.current = ctx;

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (heroSplit && heroLineEl?.isConnected) { try { heroSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="portfolio-hero"
      className="relative bg-black"
      style={{ minHeight: "55vh", overflowX: "clip", position: "relative", zIndex: 1 }}
    >
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{ top: "-15%", height: "130%" }}
        role="presentation"
        aria-hidden="true"
      >
        <Image
          src="/images/projects/service-adu.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[center_30%]"
          style={{ filter: "contrast(1.05) saturate(1.1) brightness(0.88)" }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.92) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 pt-36 pb-16 max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, transformOrigin: "left", marginBottom: "1.5rem" }}
          aria-hidden="true"
        />

        <span className="hero-fade font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
          Our Work — Torrance &amp; South Bay
        </span>

        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.9] mb-6"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
        >
          <span className="portfolio-lcp-line block">Art of</span>
          <span className="block overflow-hidden" style={{ color: "rgba(255,255,255,0.42)" }}>
            <span className="portfolio-hero-line hero-line-animate block" style={{ animationDelay: "0.1s" }}>
              Construction.
            </span>
          </span>
        </h1>

        <p className="hero-fade text-gray-300 max-w-xl leading-relaxed">
          Fourteen projects. Real work. Every job below represents a problem solved with building science — not guesswork.
        </p>
      </div>
    </section>
  );
}

// ─── Keyword strip ────────────────────────────────────────────────────────────

function PortfolioStrip() {
  const labels = ["ADU Construction", "Water Remediation", "Structural Repair", "Consulting", "South Bay CA", "Torrance", "Est. 2004"];
  return (
    <div
      className="bg-[#0a0a0a] border-b border-white/5 overflow-hidden py-3"
      style={{ position: "relative", zIndex: 2 }}
      aria-hidden="true"
    >
      <div
        className="flex gap-12 items-center"
        style={{ animation: "marqueeScroll 30s linear infinite", width: "max-content" }}
      >
        {[...labels, ...labels].map((label, i) => (
          <span
            key={i}
            className="font-labels text-[9px] text-gray-600 tracking-[0.28em] uppercase whitespace-nowrap flex items-center gap-12"
          >
            {label}
            <span className="w-px h-3 inline-block" style={{ background: "var(--color-accent)", opacity: 0.3 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Mixed-size Gallery ─────────────────────────────────────────────

function PortfolioGallery({ onOpen }: { onOpen: (p: Project) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 88%", end: "top 58%", scrub: 1.2 },
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;
    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  const h = {
    tall:   "clamp(340px, 52vh, 600px)",
    medium: "clamp(300px, 42vh, 520px)",
    short:  "clamp(260px, 36vh, 440px)",
    banner: "clamp(260px, 40vh, 480px)",
  };

  let tileIdx = 0;

  return (
    <section
      ref={sectionRef}
      data-section="portfolio-gallery"
      className="bg-black py-10 lg:py-14"
      style={{ position: "relative", zIndex: 2 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <div
          ref={hairlineRef}
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, transformOrigin: "left", maxWidth: 80, marginBottom: "1.25rem" }}
          aria-hidden="true"
        />
        <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block">
          Selected Work
        </span>
      </div>

      <div className="flex flex-col gap-[3px] max-w-7xl mx-auto px-6 lg:px-12">
        {galleryRows.map((row, rowIdx) => {
          if (row.type === "full") {
            const i = tileIdx++;
            return (
              <div key={rowIdx}>
                <GalleryTile project={row.project} height={h.banner} tileIndex={i} onClick={onOpen} />
              </div>
            );
          }
          if (row.type === "split21") {
            const iA = tileIdx++; const iB = tileIdx++;
            return (
              <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
                <div className="md:col-span-2">
                  <GalleryTile project={row.wide} height={h.tall} tileIndex={iA} onClick={onOpen} />
                </div>
                <GalleryTile project={row.narrow} height={h.tall} tileIndex={iB} onClick={onOpen} />
              </div>
            );
          }
          if (row.type === "split12") {
            const iA = tileIdx++; const iB = tileIdx++;
            return (
              <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
                <GalleryTile project={row.narrow} height={h.medium} tileIndex={iA} onClick={onOpen} />
                <div className="md:col-span-2">
                  <GalleryTile project={row.wide} height={h.medium} tileIndex={iB} onClick={onOpen} />
                </div>
              </div>
            );
          }
          // triple
          const iA = tileIdx++; const iB = tileIdx++; const iC = tileIdx++;
          const r = row as Extract<RowLayout, { type: "triple" }>;
          return (
            <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
              <GalleryTile project={r.a} height={h.short} tileIndex={iA} onClick={onOpen} />
              <GalleryTile project={r.b} height={h.short} tileIndex={iB} onClick={onOpen} />
              <GalleryTile project={r.c} height={h.short} tileIndex={iC} onClick={onOpen} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Section: Build Philosophy (merged from /process) ─────────────────────────

function BuildPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const vertRuleRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => {
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    const shouldAnimate = AnimationController.shouldAnimate();

    if (!shouldAnimate) {
      rowRefs.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(row, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
      });
      return;
    }

    let mounted = true;
    let splitFrame = -1;
    let headlineSplit: SplitType | null = null;

    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      if (vertRuleRef.current) {
        gsap.fromTo(vertRuleRef.current, { scaleY: 0 }, {
          scaleY: 1, ease: "none", transformOrigin: "top",
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%", end: "bottom 55%", scrub: 1.2 },
        });
      }

      const headEl = headlineRef.current;
      if (headEl) {
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !headEl.isConnected) return;
          const split = new SplitType(headEl, { types: "words,chars" });
          headlineSplit = split;
          splitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(split.chars,
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0, opacity: 1,
                stagger: { each: 0.018, from: "start" }, ease: "none",
                scrollTrigger: { trigger: sectionRef.current, start: "top 82%", end: "top 45%", scrub: 1.1 },
              }
            );
          }
        });
      }

      rowRefs.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(row, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 88%", end: "top 52%", scrub: 1.2 },
        });
      });
    }, sectionRef);

    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (headlineSplit && headlineRef.current?.isConnected) { try { headlineSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="portfolio-approach"
      className="bg-[#0a0a0a] py-24 lg:py-36"
      style={{ position: "relative", zIndex: 2, overflowX: "clip" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={hairlineRef}
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, transformOrigin: "left", marginBottom: "3.5rem" }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 lg:mb-20">
          <div className="lg:col-span-5">
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
              The Approach
            </span>
            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Build{" "}
              <span style={{ color: "rgba(255,255,255,0.40)" }}>philosophy.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="text-gray-400 leading-relaxed max-w-md" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
              Every project follows the same structured approach — not because we&apos;re rigid, but because structure is what prevents problems before they happen.
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            ref={vertRuleRef}
            className="hidden lg:block absolute left-0 top-0 h-full"
            style={{ width: 1, background: "var(--color-accent)", opacity: 0.35, transformOrigin: "top", transform: "scaleY(0)" }}
            aria-hidden="true"
          />
          <div className="lg:pl-8">
            {PROCESS_STEPS_V2.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="py-7 lg:py-9 border-t border-white/5"
              >
                <div className="grid grid-cols-[3.5rem_1fr] gap-5">
                  <span
                    className="font-numbers font-bold leading-none flex-shrink-0"
                    aria-hidden="true"
                    style={{ fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "var(--color-accent)", opacity: 0.75, letterSpacing: "-0.03em", paddingTop: "0.1em" }}
                  >
                    {step.number}
                  </span>
                  <div className="lg:grid lg:grid-cols-[1fr_1.8fr] lg:gap-10 items-start">
                    <div>
                      <h3 className="font-display font-bold text-white leading-tight mb-0.5" style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}>
                        {step.title}
                      </h3>
                      <span className="font-labels text-[9px] text-gray-600 tracking-[0.18em] uppercase">
                        {step.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Working With Us CTA ─────────────────────────────────────────────

function PortfolioCTA() {
  const [callOpen, setCallOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => {
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    const shouldAnimate = AnimationController.shouldAnimate();

    if (!shouldAnimate) {
      const revealEls = sectionRef.current?.querySelectorAll<HTMLElement>(".cta-reveal");
      if (revealEls?.length) {
        gsap.fromTo(Array.from(revealEls),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true } }
        );
      }
      return;
    }

    let mounted = true;
    let splitFrame = -1;
    let ctaSplit: SplitType | null = null;
    const ctaEl = headlineRef.current;

    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      if (ctaEl) {
        const _el = ctaEl;
        const _trigger = sectionRef.current;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "words,chars" });
          ctaSplit = split;
          splitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(split.chars,
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0, opacity: 1,
                stagger: { each: 0.018, from: "start" }, ease: "none",
                scrollTrigger: { trigger: _trigger, start: "top 75%", end: "top 35%", scrub: 1.2 },
              }
            );
          }
        });
      }

      const els = sectionRef.current?.querySelectorAll<HTMLElement>(".cta-reveal");
      if (els?.length) {
        gsap.fromTo(Array.from(els), { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (ctaSplit && ctaEl?.isConnected) { try { ctaSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="portfolio-cta"
      className="relative bg-black py-28 lg:py-40"
      style={{ position: "relative", zIndex: 2 }}
    >
      {/* Compass silhouette — right side, slow drift */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block"
        style={{ width: "160px", opacity: 0.10, color: "white" }}
      >
        <div style={{ animation: "compassSpinInner 90s linear infinite" }}>
          <CompassSilhouette style={{ width: "100%", height: "auto" }} />
        </div>
      </div>
      <div
        ref={hairlineRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 mb-14"
        style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, transformOrigin: "left" }}
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <span className="cta-reveal font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
          Working With Us
        </span>
        <h2
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)", maxWidth: "20ch" }}
        >
          Communication is essential in building your vision.
        </h2>
        <p className="cta-reveal text-gray-500 max-w-md leading-relaxed mb-12" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}>
          Every project begins with a direct conversation — scope, budget, timeline, and your goals. We stay accountable for the duration.
        </p>

        <div className="cta-reveal flex flex-col sm:flex-row items-start gap-4">
          <div className="relative">
            <button
              onClick={() => setCallOpen(!callOpen)}
              aria-expanded={callOpen}
              className="group relative inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-colors duration-300 hover:text-white"
            >
              <span
                className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
                style={{ background: "var(--color-accent)" }}
                aria-hidden="true"
              />
              <span className="relative">Book Call</span>
              <span
                className="relative"
                style={{ display: "inline-block", transition: "transform 0.3s ease", transform: callOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                *
              </span>
            </button>

            {callOpen && (
              <div
                className="absolute top-full left-0 mt-2 bg-black border border-white/10 px-5 py-4 whitespace-nowrap"
                style={{ overflow: "hidden", animation: "dropReveal 0.35s cubic-bezier(0.16,1,0.3,1) both", zIndex: 20 }}
              >
                <div style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, marginBottom: "0.75rem" }} aria-hidden="true" />
                <a href={SITE.phoneHref} className="font-numbers text-white text-lg tracking-wide hover:text-gray-300 transition-colors block">
                  {SITE.phone}
                </a>
                <span className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase mt-1 block">
                  Mon – Fri · 7am – 6pm PT
                </span>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 font-labels text-[10px] text-gray-400 tracking-[0.18em] uppercase border-b border-gray-700 hover:text-white hover:border-white pb-0.5 transition-colors duration-200 py-4"
          >
            Get in touch
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function PortfolioContent() {
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  return (
    <>
      <PortfolioHero />
      <PortfolioStrip />
      <PortfolioGallery onOpen={setLightboxProject} />
      <BuildPhilosophy />
      <PortfolioCTA />
      <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
    </>
  );
}
