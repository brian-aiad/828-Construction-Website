"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS, Project, ProjectCategory } from "@/lib/constants";
import Lightbox from "@/components/gallery/Lightbox";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import SectionMotionBackdrop from "@/components/system/SectionMotionBackdrop";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES: ("ALL" | ProjectCategory)[] = [
  "ALL",
  "ADU Construction",
  "Remediation",
  "Consulting",
];

// ── Designed plate ────────────────────────────────────────────────────────
function ProjectPlate({ project, index }: { project: Project; index: number }) {
  const patterns = [
    "repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.025) 48px)",
    "repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,255,255,0.02) 23px)",
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  ];
  return (
    <div
      className="w-full h-full plate-concrete"
      style={{ backgroundImage: patterns[index % 3], backgroundSize: index % 3 === 2 ? "32px 32px" : "auto" }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-numbers font-bold text-white leading-none" style={{ fontSize: "clamp(5rem, 12vw, 14rem)", opacity: 0.04 }}>
          0{project.id}
        </span>
      </div>
      <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-gray-800" />
      <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l border-gray-800" />
    </div>
  );
}

// ── Single project card — text overlay, GSAP parallax + hover ─────────────
function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: (p: Project) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const imgInner = imgInnerRef.current;
    const bar = barRef.current;
    if (!wrap || !imgInner || !bar) return;

    // Fix 14: set initial states via gsap.set before conditional gate
    gsap.set(wrap, { clipPath: "inset(7% 4% 7% 4%)", opacity: 0 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left" });

    if (!AnimationController.shouldAnimate()) {
      // Fix 15: mobile branch — clear initial state immediately
      gsap.set(wrap, { clipPath: "inset(0%)", opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Pattern B: clip-path punch-in on scroll entry
      gsap.to(wrap, {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 1.0,
        ease: "power3.out",
        delay: (index % 3) * 0.09,
        scrollTrigger: { trigger: wrap, start: "top 90%", once: true },
      });

      // Pattern F: parallax on image inner — scrub tied to scroll
      gsap.to(imgInner, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, wrapRef);

    // Pattern J: GSAP copper bar hover
    const onEnter = () => gsap.to(bar, { scaleX: 1, duration: 0.3, ease: "power2.out" });
    const onLeave = () => gsap.to(bar, { scaleX: 0, duration: 0.3, ease: "power2.in" });
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      try { ctx.revert(); } catch {}
    };
  }, [index]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.055, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={wrapRef}
        className="group relative cursor-pointer bg-[#111] overflow-hidden"
        onClick={() => onClick(project)}
        data-gsap-reveal="true"
      >
        {/* Parallax image wrapper */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
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
              fallback={<ProjectPlate project={project} index={index} />}
            />
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/15 to-transparent" />
          {/* Category label */}
          <div className="absolute top-4 left-4">
            <span className="font-labels text-[9px] text-white/55 tracking-[0.2em] uppercase bg-black/65 px-2 py-1 backdrop-blur-sm">
              {project.category}
            </span>
          </div>
          {/* View project hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            style={{ transition: "opacity 0.3s ease" }}
          >
            <span className="font-labels text-[10px] text-white tracking-[0.22em] uppercase bg-black/65 px-4 py-2 backdrop-blur-sm">
              View Project
            </span>
          </div>
          {/* Editorial text overlay — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="font-labels text-[8px] text-white/40 tracking-[0.2em] uppercase mb-1.5">
              {project.location}
            </div>
            <h2
              className="font-display font-bold text-white leading-[1.04] tracking-tight"
              style={{ fontSize: "clamp(0.95rem, 1.55vw, 1.3rem)" }}
            >
              {project.title}
            </h2>
            <p className="font-labels text-[8px] text-white/35 tracking-wide mt-1.5 line-clamp-1">
              {project.spec}
            </p>
          </div>
        </div>
        {/* Copper bar hover — Pattern J */}
        <div
          ref={barRef}
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2, background: "#B87333" }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}

// ── Featured large card — 16:7 ratio, full text overlay ───────────────────
function FeaturedCard({ project, index, onClick }: { project: Project; index: number; onClick: (p: Project) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const imgInner = imgInnerRef.current;
    const bar = barRef.current;
    if (!wrap || !imgInner || !bar) return;

    gsap.set(wrap, { clipPath: "inset(5% 2% 5% 2%)", opacity: 0 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left" });

    if (!AnimationController.shouldAnimate()) {
      gsap.set(wrap, { clipPath: "inset(0%)", opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(wrap, {
        clipPath: "inset(0%)",
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 88%", once: true },
      });
      gsap.to(imgInner, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, wrapRef);

    const onEnter = () => gsap.to(bar, { scaleX: 1, duration: 0.35, ease: "power2.out" });
    const onLeave = () => gsap.to(bar, { scaleX: 0, duration: 0.3, ease: "power2.in" });
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="col-span-1 md:col-span-2"
    >
      <div
        ref={wrapRef}
        className="group relative cursor-pointer bg-[#111] overflow-hidden"
        onClick={() => onClick(project)}
        data-gsap-reveal="true"
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/7" }}>
          <div
            ref={imgInnerRef}
            className="absolute inset-x-0"
            style={{ top: "-5%", height: "110%" }}
          >
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              fill
              priority
              className="object-cover"
              style={{ filter: "contrast(1.06) saturate(1.1)" }}
              sizes="(max-width: 768px) 100vw, 85vw"
              fallback={<ProjectPlate project={project} index={index} />}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/25 to-black/10" />
          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            style={{ transition: "opacity 0.3s ease" }}
          >
            <span className="font-labels text-[10px] text-white tracking-[0.22em] uppercase bg-black/65 px-4 py-2 backdrop-blur-sm">
              View Project
            </span>
          </div>
          {/* Editorial text layout */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-labels text-[9px] text-white/50 tracking-[0.22em] uppercase border border-white/20 px-2 py-1">
                {project.category}
              </span>
              <span className="font-labels text-[8px] text-white/30 tracking-[0.18em] uppercase">
                {project.location}
              </span>
            </div>
            <h2
              className="font-display font-bold text-white leading-[0.93] tracking-tight mb-2"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)" }}
            >
              {project.title}
            </h2>
            <p className="font-labels text-[9px] text-white/38 tracking-wide">{project.spec}</p>
          </div>
        </div>
        <div
          ref={barRef}
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2, background: "#B87333" }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
function ProjectsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(
    () => () => {
      if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
      try { ctxRef.current?.revert(); } catch {}
    },
    []
  );

  useEffect(() => {
    const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
    if (fadeEls?.length) {
      gsap.set(Array.from(fadeEls), { y: 20, opacity: 0 });
    }

    if (!AnimationController.shouldAnimate()) {
      if (fadeEls?.length) {
        gsap.set(Array.from(fadeEls), { y: 0, opacity: 1 });
      }
      return;
    }

    let mounted = true;
    let splitFrame = -1;
    let heroLineEl: HTMLElement | null = null;
    let herSplit: SplitType | null = null;

    const ctx = gsap.context(() => {
      // Triple-layer parallax
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -15, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (midRef.current) {
        gsap.to(midRef.current, {
          yPercent: -8, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: 5, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }

      // Copper hairline scaleX scrub
      if (hairlineRef.current) {
        gsap.fromTo(
          hairlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
          }
        );
      }

      // Counter — once:true (Fix 10)
      if (counterRef.current) {
        const el = counterRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: PROJECTS.length,
          duration: 2,
          ease: "power2.out",
          immediateRender: false,
          onUpdate: () => { const v = Math.round(obj.val); if (v > 0) el.textContent = v.toString(); },
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        });
      }

      // Fade-in hero supporting elements
      if (fadeEls?.length) {
        gsap.to(Array.from(fadeEls), {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.1, delay: 0.3, ease: "power3.out",
        });
      }

      // SplitType char scatter exit on "Built to Last."
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".proj-hero-line");
        if (heroLine && heroLine.isConnected) {
          heroLineEl = heroLine;
          const split = new SplitType(heroLine, { types: "words,chars" });
          herSplit = split;
          splitRef.current = split;
          const chars = split.chars ?? [];
          gsap.to(chars, {
            yPercent: -80, opacity: 0,
            stagger: { each: 0.014, from: "random" }, ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current, start: "30% top", end: "bottom top", scrub: 1.2,
            },
          });
          const lcpLine = headlineRef.current?.querySelector(".proj-lcp-line");
          if (lcpLine) {
            gsap.to(lcpLine, {
              opacity: 0, ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current, start: "25% top", end: "65% top", scrub: 1.2,
              },
            });
          }
        }
      });
    }, sectionRef);

    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (herSplit && heroLineEl?.isConnected) { try { herSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="projects-hero"
      className="relative bg-black overflow-hidden"
      style={{ minHeight: "55vh" }}
    >
      {/* Bg parallax layer — Next.js Image for preload + LCP optimization */}
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
          style={{ filter: "contrast(1.05) saturate(1.1) brightness(0.92)" }}
        />
      </div>
      {/* Mid gradient parallax */}
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.92) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 pt-36 pb-16 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Copper hairline */}
        <div
          ref={hairlineRef}
          style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", marginBottom: "1.5rem" }}
          aria-hidden="true"
        />

        <div className="flex items-end justify-between gap-8 mb-4">
          <span className="hero-fade font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
            Our Work
          </span>
          <div className="hero-fade text-right">
            <span className="font-numbers font-bold text-[#B87333] leading-none" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
              <span ref={counterRef}>{PROJECTS.length}</span>
            </span>
            <span className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase ml-2">Projects</span>
          </div>
        </div>

        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.9] mb-6"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
        >
          <span className="proj-lcp-line block">Our Work.</span>
          <span className="block overflow-hidden" style={{ color: "rgba(255,255,255,0.40)" }}>
            <span className="proj-hero-line hero-line-animate block" style={{ animationDelay: "0.1s" }}>
              Built to Last.
            </span>
          </span>
        </h1>

        <p className="hero-fade font-body text-gray-300 max-w-xl leading-relaxed mb-10">
          Every project below represents a real problem solved. Not just aesthetics —
          structural integrity, code compliance, and lasting value.
        </p>

        <Link
          href="/contact"
          className="hero-fade group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden"
          style={{ transition: "color 0.3s" }}
        >
          <span className="absolute inset-0 bg-[#B87333] translate-x-[-101%] group-hover:translate-x-0" style={{ transition: "transform 0.3s ease-in-out" }} aria-hidden="true" />
          <span className="relative">Discuss Your Project</span>
          <span className="relative" style={{ transition: "transform 0.2s" }}>→</span>
        </Link>
      </div>
    </section>
  );
}

// ── Marquee strip ─────────────────────────────────────────────────────────
function ProjectsStrip() {
  const labels = ["ADU Construction", "Water Remediation", "Structural Repair", "Consulting", "South Bay CA", "Torrance", "20+ Years"];
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
            <span className="w-px h-3 bg-[#B87333]/30 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Editorial highlights section — 3 curated images + stats ──────────────
function ProjectsHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const img1WrapRef = useRef<HTMLDivElement>(null);
  const img1InnerRef = useRef<HTMLDivElement>(null);
  const img2WrapRef = useRef<HTMLDivElement>(null);
  const img2InnerRef = useRef<HTMLDivElement>(null);
  const img3WrapRef = useRef<HTMLDivElement>(null);
  const img3InnerRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const wraps = [img1WrapRef, img2WrapRef, img3WrapRef];

    // Fix 14: initial states before gate
    wraps.forEach((r) => {
      if (r.current) gsap.set(r.current, { clipPath: "inset(100% 0% 0% 0%)" });
    });

    if (!AnimationController.shouldAnimate()) {
      // Fix 15: mobile branch
      wraps.forEach((r) => {
        if (r.current) gsap.set(r.current, { clipPath: "inset(0%)" });
      });
      const mobileTargets = [img1WrapRef.current, img2WrapRef.current, img3WrapRef.current, headlineRef.current].filter(Boolean) as HTMLElement[];
      if (mobileTargets.length) {
        gsap.fromTo(mobileTargets, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Hairline scaleX scrub
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 90%", end: "top 60%", scrub: 1 },
        });
      }

      // Headline reveal
      if (headlineRef.current) {
        gsap.fromTo(headlineRef.current, { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        });
      }

      // Image clip-path scrub reveals (from bottom up)
      const imgConfig = [
        { wrap: img1WrapRef, inner: img1InnerRef, start: "top 115%", end: "top 30%" },
        { wrap: img2WrapRef, inner: img2InnerRef, start: "top 110%", end: "top 25%" },
        { wrap: img3WrapRef, inner: img3InnerRef, start: "top 105%", end: "top 20%" },
      ];

      imgConfig.forEach(({ wrap, inner, start, end }) => {
        if (!wrap.current || !inner.current) return;
        gsap.to(wrap.current, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: wrap.current, start, end, scrub: 1.4 },
        });
        gsap.to(inner.current, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Stats counters — once:true (Fix 10)
      if (stat1Ref.current) {
        const el = stat1Ref.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 25, duration: 2, ease: "power2.out", immediateRender: false,
          onUpdate: () => { if (el) el.textContent = Math.round(obj.val) + "+"; },
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true },
        });
      }
      if (stat2Ref.current) {
        const el = stat2Ref.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: PROJECTS.length, duration: 2, ease: "power2.out", delay: 0.25, immediateRender: false,
          onUpdate: () => { if (el) el.textContent = Math.round(obj.val).toString(); },
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true },
        });
      }
    }, sectionRef);

    return () => { try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="projects-highlights"
      className="relative overflow-hidden bg-[#0a0a0a] py-16 lg:py-24"
    >
      <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.14]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header row */}
        <div className="flex items-center justify-between mb-10 lg:mb-14">
          <div>
            <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-3">
              Selected Work
            </span>
            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.92]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              The Standard
              <br />
              <span style={{ color: "rgba(255,255,255,0.40)" }}>We Build To.</span>
            </h2>
          </div>

          {/* Hairline + stats */}
          <div className="hidden lg:flex items-center gap-10">
            <div
              ref={hairlineRef}
              className="w-24"
              style={{ height: 1, background: "#B87333", opacity: 0.45, transformOrigin: "left" }}
              aria-hidden="true"
            />
            <div className="text-right">
              <div className="font-numbers font-bold text-[#B87333] leading-none" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
                <span ref={stat1Ref}>25+</span>
              </div>
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase mt-1">Years Active</div>
            </div>
            <div className="text-right">
              <div className="font-numbers font-bold text-white leading-none" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
                <span ref={stat2Ref}>{PROJECTS.length}</span>
              </div>
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase mt-1">Projects</div>
            </div>
          </div>
        </div>

        {/* Editorial 3-image grid */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-[3px]">
          {/* Left: large vertical image */}
          <div
            ref={img1WrapRef}
            className="relative overflow-hidden"
            style={{ minHeight: "clamp(280px, 48vw, 580px)" }}
            data-gsap-reveal="true"
          >
            <div
              ref={img1InnerRef}
              className="absolute inset-x-0"
              style={{ top: "-7.5%", height: "115%" }}
            >
              <Image
                src="/images/projects/adu-exterior-new.jpg"
                alt="828 Construction — Detached ADU, Torrance CA"
                fill
                className="object-cover"
                style={{ filter: "contrast(1.06) saturate(1.1)" }}
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="font-labels text-[9px] text-white/50 tracking-[0.2em] uppercase mb-1">
                ADU Construction
              </div>
              <div
                className="font-display font-bold text-white leading-tight"
                style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
              >
                Built to Last
              </div>
            </div>
          </div>

          {/* Right: two stacked images */}
          <div className="flex flex-col gap-[3px]">
            <div
              ref={img2WrapRef}
              className="relative overflow-hidden flex-1"
              style={{ minHeight: "clamp(135px, 22vw, 288px)" }}
              data-gsap-reveal="true"
            >
              <div
                ref={img2InnerRef}
                className="absolute inset-x-0"
                style={{ top: "-7.5%", height: "115%" }}
              >
                <Image
                  src="/images/projects/outdoor-living-editorial.jpg"
                  alt="828 Construction — Outdoor Living, South Bay CA"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(1.1)" }}
                  sizes="(max-width: 768px) 100vw, 38vw"
                />
              </div>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4">
                <div className="font-labels text-[8px] text-white/45 tracking-[0.2em] uppercase">
                  Outdoor Living
                </div>
              </div>
            </div>

            <div
              ref={img3WrapRef}
              data-gsap-reveal="true"
              className="relative overflow-hidden flex-1"
              style={{ minHeight: "clamp(135px, 22vw, 288px)" }}
            >
              <div
                ref={img3InnerRef}
                className="absolute inset-x-0"
                style={{ top: "-7.5%", height: "115%" }}
              >
                <Image
                  src="/images/projects/kitchen-dark.jpg"
                  alt="828 Construction — Kitchen Renovation, Manhattan Beach CA"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(1.1)" }}
                  sizes="(max-width: 768px) 100vw, 38vw"
                />
              </div>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4">
                <div className="font-labels text-[8px] text-white/45 tracking-[0.2em] uppercase">
                  Interior Finish
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main gallery ───────────────────────────────────────────────────────────
export default function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState<"ALL" | ProjectCategory>("ALL");
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const filtered = activeCategory === "ALL" ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory);
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || filtered.length <= 1);
  const displayRest = featured ? rest : filtered;

  return (
    <>
      <ProjectsHero />
      <ProjectsStrip />
      <ProjectsHighlights />

      {/* Sticky filter tabs */}
      <section
        data-section="projects-filter"
        className="bg-black border-y border-gray-900 sticky top-16 lg:top-20"
        style={{ zIndex: 30 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-0 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-4 px-5 font-labels text-[10px] tracking-[0.18em] uppercase whitespace-nowrap border-b-2 transition-all duration-300 ${
                  activeCategory === cat
                    ? "text-white border-[#B87333]"
                    : "text-gray-500 border-transparent hover:text-gray-300 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section
        data-section="projects-gallery"
        className="overflow-hidden bg-black py-10 lg:py-14 min-h-[60vh]"
        style={{ position: "relative", zIndex: 2 }}
      >
        <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.11]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="font-labels text-[10px] text-gray-500 tracking-[0.18em] uppercase">
                    No projects in this category yet
                  </p>
                </div>
              ) : (
                <div className="space-y-[3px]">
                  {featured && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
                      <FeaturedCard project={featured} index={0} onClick={setLightboxProject} />
                    </div>
                  )}
                  {displayRest.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3px]">
                      {displayRest.map((project, i) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={i}
                          onClick={setLightboxProject}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
    </>
  );
}
