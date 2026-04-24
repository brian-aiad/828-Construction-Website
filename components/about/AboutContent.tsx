"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import MagneticButton from "@/components/ui/MagneticButton";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const philosophyPanels = [
  {
    num: "01",
    eyebrow: "First Principle",
    title: ["We Measure.", "Not Guess."],
    body: "Building science means running diagnostics before recommending solutions. Thermal imaging, moisture mapping, structural load analysis — tools that turn guesswork into data.",
    image: "/images/about/building-science.jpg",
    alt: "828 Construction — building science diagnostics",
  },
  {
    num: "02",
    eyebrow: "Root Cause",
    title: ["Find the", "Real Problem."],
    body: "Surface repairs hide failures. We trace moisture intrusion to its source, find the structural load path before it's bypassed, address the cause before the symptom.",
    image: "/images/about/tools.jpg",
    alt: "828 Construction — finding root causes",
  },
  {
    num: "03",
    eyebrow: "Materials",
    title: ["Right Material.", "Right Reason."],
    body: "Every specification decision carries a building science rationale. We don't value-engineer down to minimum code — we spec to actual performance requirements.",
    image: "/images/about/materials.jpg",
    alt: "828 Construction — quality materials",
  },
  {
    num: "04",
    eyebrow: "Attention",
    title: ["Fewer Projects.", "More Focus."],
    body: "We're selective. Quality work requires full attention. We'd rather tell a client we're not available than overcommit and underdeliver. Reputation is built one project at a time.",
    image: "/images/about/craftsmanship.jpg",
    alt: "828 Construction — focused craftsmanship",
  },
  {
    num: "05",
    eyebrow: "Experience",
    title: ["Twenty Years.", "Zero Shortcuts."],
    body: "Two decades of field work means we've seen most failures before they happen. That institutional knowledge is what separates a fix that holds from one that fails next season.",
    image: "/images/about/contract.jpg",
    alt: "828 Construction — experience and commitment",
  },
];

const craftPanels = [
  { src: "/images/about/tools.jpg", alt: "828 Construction — craftsman tools", label: "The Craft", caption: "Every tool has a purpose." },
  { src: "/images/about/materials.jpg", alt: "828 Construction — quality materials", label: "The Standard", caption: "Right materials. Right reasons." },
  { src: "/images/about/contract.jpg", alt: "828 Construction — scope in writing", label: "The Commitment", caption: "Scope in writing. Always." },
];

const cityCards = [
  { city: "Torrance", tag: "Home Base", note: "Our primary service city — where 828 was built and where we do most of our work." },
  { city: "Redondo Beach", tag: "Active", note: "ADU construction and remediation across the coastal zones and hillside lots." },
  { city: "Manhattan Beach", tag: "Active", note: "High-quality finishes, strict HOA contexts, and premium ADU builds near the strand." },
  { city: "Hermosa Beach", tag: "Active", note: "Tight lots, creative ADU solutions, and remediation in the beach community." },
  { city: "Lomita", tag: "Active", note: "Structural remediation and ADU construction in established residential neighborhoods." },
  { city: "El Segundo", tag: "Active", note: "ADU additions and consulting for homeowners near the LAX corridor." },
  { city: "Carson", tag: "Active", note: "Full-build ADU projects and building science consulting throughout the city." },
  { city: "Hawthorne", tag: "Active", note: "Remediation work and ADU consulting for South Bay homeowners." },
];

const takeOnItems = [
  {
    label: "ADU Construction",
    detail: "Detached units, garage conversions, JADUs — full-build from permit to finish.",
  },
  {
    label: "Structural Remediation",
    detail: "Water intrusion, envelope failures, construction defects. Root-cause investigation, not cosmetic repair.",
  },
  {
    label: "Pre-Construction Consulting",
    detail: "Feasibility analysis, contractor vetting, defect review. Know what you’re getting into before you commit.",
  },
  {
    label: "Building Science Projects",
    detail: "Complex work that rewards diagnostics. If the problem matters more than the surface, it’s a fit.",
  },
];

const dontTakeItems = [
  {
    label: "Cosmetic-Only Scope",
    detail: "Paint, fixture swaps, surface finishes — work where the building science doesn’t matter.",
  },
  {
    label: "Predetermined Solutions",
    detail: "If you need us to confirm a decision already made rather than evaluate the problem, we’re not the right firm.",
  },
  {
    label: "Race-to-Bottom Bids",
    detail: "If price is the only question, we’ll lose to someone who cuts corners. That’s intentional.",
  },
  {
    label: "More Than Full Attention Allows",
    detail: "We take fewer projects so each gets full focus. If we’re at capacity, we’ll tell you.",
  },
];

// ─── New data for cinematic upgrade ───────────────────────────────────────────

const timelineMilestones = [
  { year: "2004", label: "Founded", desc: "" },
  { year: "2008", label: "Building Science Focus", desc: "" },
  { year: "2012", label: `CA License\n#${SITE.license}`, desc: "" },
  { year: "2018", label: "South Bay Expansion", desc: "" },
  { year: "Now", label: "828’s Standard", desc: "" },
];

const credRowItems = [
  { label: "CA License", value: `#${SITE.license}` },
  { label: "Est.", value: "2004" },
  { label: "Home Base", value: "Torrance, CA" },
  { label: "Experience", value: "20+ Years" },
];

const marqueeItems = [
  `CA License #${SITE.license}`,
  "Bonded",
  "Insured",
  "South Bay Licensed",
  "Est. 2004",
  "20+ Years",
  "Torrance Based",
  "Building Science",
];

// ─── Section: Hero — triple-layer parallax + SplitType char exit ───────────────

function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  // heroLinesRef targets ONLY lines 2-3 — never the LCP span "20+ Years"
  const heroLinesRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const allSplitsRef = useRef<SplitType[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => {
    allSplitsRef.current.forEach(s => { try { s.revert(); } catch {} });
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    let mounted = true;
    let splitFrame = -1;
    let localSplits: SplitType[] = [];
    let splitEls: HTMLElement[] = [];

    const ctx = gsap.context(() => {

      // ── LAYER 1: Background — fastest parallax + scale ──
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.fromTo(bgRef.current,
          { scale: 1 },
          {
            scale: 1.14,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      // ── LAYER 2: Mid-ground content — medium parallax ──
      if (midRef.current) {
        gsap.to(midRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // ── LAYER 3: Headline — counter-motion (appears heavier, stays in frame longer) ──
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // ── SplitType: chars scatter upward as you scroll away ──
      if (!AnimationController.shouldAnimate()) return;

      // Entry reveal: handled by CSS keyframes (heroLineReveal, heroMetaReveal)
      // so text paints before JS hydrates — critical for LCP score.

      // SplitType targets ONLY .line spans (lines 2-3), never the first span ("20+ Years").
      // This preserves Chrome's LCP candidate so it's never DOM-mutated after initial paint.
      if (sectionRef.current && AnimationController.shouldAnimate()) {
        const _section = sectionRef.current;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_section.isConnected) return;
          const lineEls = Array.from(
            _section.querySelectorAll<HTMLElement>(".hero-line-animate")
          );
          if (!lineEls.length) return;

          splitEls = lineEls;
          // Split each .line span individually — collect all chars
          const splits = lineEls.map(el => new SplitType(el, { types: "chars" }));
          localSplits = splits;
          allSplitsRef.current = splits;
          splitRef.current = splits[0];
          const allChars = splits.flatMap(s => s.chars ?? []);

          // Exit: chars scatter upward on scroll-out (scrub)
          // Start early enough that chars are gone before founder section becomes dominant
          if (allChars.length) {
            gsap.to(allChars, {
              yPercent: -140,
              opacity: 0,
              stagger: { each: 0.01, from: "random" },
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "15% top",
                end: "65% top",
                scrub: 0.6,
              },
            });
          }
          // Fade first span ("20+ Years") on exit — opacity only, no DOM mutation
          const lcpSpan = headlineRef.current?.querySelector<HTMLSpanElement>("span.block:first-child");
          if (lcpSpan) {
            gsap.to(lcpSpan, {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "15% top",
                end: "55% top",
                scrub: 0.6,
              },
            });
          }
        });
      }

    }, sectionRef);

    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      localSplits.forEach((s, i) => {
        if (splitEls[i]?.isConnected) { try { s.revert(); } catch {} }
      });
      localSplits = [];
      allSplitsRef.current = [];
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="about-hero"
      className="relative h-screen overflow-hidden bg-black"
      style={{ zIndex: 1 }}
    >
      {/* Layer 1: Background */}
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{
          top: "-15%",
          height: "130%",
          transformOrigin: "center center",
          willChange: "transform",
        }}
        role="presentation"
        aria-hidden="true"
      >
        <Image
          src="/images/about/about-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "contrast(1.08) saturate(1.15) brightness(1.05)" }}
        />
      </div>

      {/* Gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" style={{ height: "35%" }} />

      {/* Copper accent line */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          height: 2,
          background: "linear-gradient(to right, transparent 5%, #B87333 35%, #B87333 65%, transparent 95%)",
          opacity: 0.65,
        }}
      />

      {/* Layer 2: Mid-ground (eyebrow + meta) */}
      <div
        ref={midRef}
        className="absolute bottom-14 lg:bottom-20 left-0 right-0 z-10 max-w-7xl mx-auto px-6 lg:px-12"
        style={{ willChange: "transform" }}
      >
        <span className="hero-meta-animate font-labels text-[10px] text-white/35 tracking-[0.25em] uppercase block mb-5">
          About · 828 Construction · Torrance, CA
        </span>

        <div className="hero-meta-animate flex items-center gap-3 flex-wrap mt-8">
          <span className="font-labels text-[9px] text-white/30 tracking-[0.2em] uppercase">Joe P — Founder</span>
          <span className="w-px h-3 bg-white/15" />
          <span className="font-labels text-[9px] text-white/30 tracking-[0.2em] uppercase">CA License #{SITE.license}</span>
          <span className="w-px h-3 bg-white/15" />
          <span className="font-labels text-[9px] text-white/30 tracking-[0.2em] uppercase">Est. 2004</span>
        </div>
      </div>

      {/* Layer 3: Foreground headline — counter-motion */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-end max-w-7xl mx-auto w-full px-6 lg:px-12 pb-44 lg:pb-52"
        style={{ pointerEvents: "none" }}
      >
        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88]"
          style={{
            fontSize: "clamp(3rem, 7vw, 7rem)",
            textShadow: "0 2px 24px rgba(0,0,0,0.5)",
          }}
        >
          {/* Line 1: LCP element — never touched by SplitType, paints on first frame */}
          <span className="block">20+ Years</span>
          {/* Lines 2–3: CSS clip-reveal entry; GSAP SplitType char scatter on exit */}
          <span className="block overflow-hidden">
            <span className="line hero-line-animate block" style={{ color: "rgba(255,255,255,0.40)", animationDelay: "0.1s" }}>of Building</span>
          </span>
          <span className="block overflow-hidden">
            <span className="line hero-line-animate block" style={{ color: "rgba(255,255,255,0.40)", animationDelay: "0.22s" }}>Science.</span>
          </span>
        </h1>
      </div>
    </section>
  );
}

// ─── Section: Founder Story — section overlap (z-index 2, negative margin) ────

function AboutFounder() {
  const sectionRef = useRef<HTMLElement>(null);
  const imagePaneRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const storyH2Ref = useRef<HTMLHeadingElement>(null);
  const splitStoryRef = useRef<SplitType | null>(null);
  const founderCtxRef = useRef<gsap.Context | null>(null);
  const statCardRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  // New cinematic upgrade refs
  const portraitRef = useRef<HTMLDivElement>(null);
  const credRowRef = useRef<HTMLDivElement>(null);
  const stickyCredRef = useRef<HTMLDivElement>(null);
  const profileDividerRef = useRef<HTMLDivElement>(null);
  const allParaSplits = useRef<SplitType[]>([]);
  const allParaEls = useRef<HTMLElement[]>([]);
  const paraFrame = useRef<number>(-1);

  useLayoutEffect(() => () => {
    cancelAnimationFrame(paraFrame.current);
    allParaSplits.current.forEach((s, i) => {
      if (allParaEls.current[i]?.isConnected) { try { s.revert(); } catch {} }
    });
    allParaSplits.current = [];
    allParaEls.current = [];
    if (splitStoryRef.current) { try { splitStoryRef.current.revert(); } catch {} }
    try { founderCtxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Fix 14: set GSAP initial states before gate — mobile branch clears them
    if (statCardRef.current) gsap.set(statCardRef.current, { opacity: 0, scale: 0.78 });
    if (portraitRef.current) gsap.set(portraitRef.current, { clipPath: "inset(100% 0 0 0)" });
    if (credRowRef.current) gsap.set(credRowRef.current, { opacity: 0, y: 18 });
    if (stickyCredRef.current) gsap.set(stickyCredRef.current, { opacity: 0 });

    if (!AnimationController.shouldAnimate()) {
      // Mobile: immediately show all elements (Fix 14)
      if (statCardRef.current) gsap.set(statCardRef.current, { opacity: 1, scale: 1 });
      if (portraitRef.current) gsap.set(portraitRef.current, { clipPath: "inset(0% 0 0 0)" });
      if (credRowRef.current) gsap.set(credRowRef.current, { opacity: 1, y: 0 });
      if (hairlineRef.current) gsap.set(hairlineRef.current, { scaleX: 1 });
      if (profileDividerRef.current) gsap.set(profileDividerRef.current, { scaleX: 1 });
      // Mobile body reveals
      const bodyEls = textRef.current?.querySelectorAll<HTMLElement>(".story-para, .story-cta");
      if (bodyEls?.length) {
        gsap.fromTo(bodyEls, { y: 18, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        });
      }
      return;
    }

    let mounted = true;
    let splitFrame = -1;
    let storySplit: SplitType | null = null;
    const storyEl = storyH2Ref.current;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      // Copper hairline scaleX scrub
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger, start: "top 85%", end: "top 50%", scrub: 1 },
        });
      }

      // Profile section divider scaleX scrub
      if (profileDividerRef.current) {
        gsap.fromTo(profileDividerRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: profileDividerRef.current, start: "top 88%", end: "top 60%", scrub: 1 },
        });
      }

      // About page signature moment: "2004" watermark drifts horizontally (KEEP UNCHANGED)
      if (driftRef.current) {
        gsap.to(driftRef.current, {
          xPercent: -28, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "bottom 15%", scrub: 1.5 },
        });
      }

      // SplitType on story h2 — chars animate via scrub (Fix 1)
      if (storyEl) {
        const _el = storyEl;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "chars" });
          storySplit = split;
          splitStoryRef.current = split;
          if (split.chars?.length) {
            gsap.from(split.chars, {
              yPercent: 110, opacity: 0,
              stagger: { each: 0.014, from: "start" }, ease: "none",
              scrollTrigger: { trigger: _el, start: "top 82%", end: "top 40%", scrub: 1.2 },
            });
          }
        });
      }

      // Image pane: scrub clip-path reveal (left → right)
      if (imagePaneRef.current) {
        gsap.fromTo(imagePaneRef.current,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
            scrollTrigger: { trigger, start: "top 88%", end: "top 20%", scrub: 1.3 } }
        );
      }

      // Image inner: zoom-out + ongoing parallax
      if (imageInnerRef.current) {
        gsap.fromTo(imageInnerRef.current, { scale: 1.14 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger, start: "top 88%", end: "top 20%", scrub: 1.3 },
        });
        gsap.to(imageInnerRef.current, {
          yPercent: -9, ease: "none",
          scrollTrigger: { trigger: imagePaneRef.current, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      }

      // Story paragraphs: scrub stagger reveal (Fix 15 — scrub-tied, not once-fire)
      const bodyEls = textRef.current?.querySelectorAll<HTMLElement>(".story-para, .story-cta");
      if (bodyEls?.length) {
        Array.from(bodyEls).forEach((el, i) => {
          gsap.fromTo(el, { y: 26, opacity: 0 }, {
            y: 0, opacity: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", end: "top 60%", scrub: 1.1 },
          });
        });
      }

      // Stat card: scale-pop
      if (statCardRef.current) {
        gsap.fromTo(statCardRef.current, { scale: 0.78, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.9, delay: 0.5, ease: "back.out(1.6)",
          scrollTrigger: { trigger, start: "top 72%", once: true },
        });
      }

      // Portrait placeholder: clip-path reveal from bottom (NEW)
      if (portraitRef.current) {
        gsap.fromTo(portraitRef.current,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", ease: "none",
            scrollTrigger: { trigger: portraitRef.current, start: "top 92%", end: "top 40%", scrub: 1.3 } }
        );
      }

      // Credentials row: emerge once
      if (credRowRef.current) {
        gsap.fromTo(credRowRef.current, { y: 18, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: credRowRef.current, start: "top 88%", once: true },
        });
      }

      // Sticky credentials: fade in when founder section is in view, desktop only
      if (stickyCredRef.current && window.innerWidth >= 1024) {
        gsap.to(stickyCredRef.current, {
          opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 20%", end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        });
      }
    }, sectionRef);

    founderCtxRef.current = ctx;

    // Paragraph line reveals via SplitType lines (Fix 1 multi-element pattern)
    const paraEls = Array.from(sectionRef.current!.querySelectorAll<HTMLElement>(".story-para"));
    paraFrame.current = requestAnimationFrame(() => {
      if (!mounted || !paraEls.length) return;
      const connected = paraEls.filter(el => el.isConnected);
      allParaEls.current = connected;
      const splits = connected.map(el => new SplitType(el, { types: "lines" }));
      allParaSplits.current = splits;
      splits.forEach((split, si) => {
        if (!split.lines?.length) return;
        const parentEl = connected[si];
        split.lines.forEach((line) => {
          gsap.fromTo(line, { yPercent: 108, opacity: 0 }, {
            yPercent: 0, opacity: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: parentEl,
              start: "top 84%", end: "top 52%",
              scrub: 1,
            },
          });
        });
      });
    });

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      cancelAnimationFrame(paraFrame.current);
      allParaSplits.current.forEach((s, i) => {
        if (allParaEls.current[i]?.isConnected) { try { s.revert(); } catch {} }
      });
      allParaSplits.current = [];
      allParaEls.current = [];
      if (storySplit && storyEl?.isConnected) { try { storySplit.revert(); } catch {} }
      splitStoryRef.current = null;
      founderCtxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="about-founder"
      className="relative bg-white"
      style={{ marginTop: "-12vh", zIndex: 2, overflowX: "clip" }}
    >
      {/* Copper hairline scrub */}
      <div
        ref={hairlineRef}
        className="absolute top-0 left-6 lg:left-12 right-6 lg:right-12"
        style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", transform: "scaleX(0)" }}
      />

      {/* About page signature: "2004" watermark drifts horizontally (DO NOT TOUCH) */}
      <div
        ref={driftRef}
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          top: "32%", right: "5%",
          fontSize: "clamp(5rem, 14vw, 12rem)",
          color: "#B87333", opacity: 0.04,
          fontFamily: "var(--font-ibm-plex-mono)", fontWeight: 700,
          lineHeight: 1, willChange: "transform", whiteSpace: "nowrap",
        }}
      >
        2004
      </div>

      {/* ── NEW: Founder Profile Block ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* Portrait placeholder — 4:5 aspect ratio */}
          <div className="lg:col-span-4">
            <div
              ref={portraitRef}
              className="relative overflow-hidden blueprint-grid"
              style={{
                aspectRatio: "4/5",
                background: "#0d0d0d",
              }}
              data-gsap-reveal="true"
            >
              {/* Copper top accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "#B87333", opacity: 0.7, zIndex: 2 }} />
              {/* Corner label — decorative placeholder, aria-hidden */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10" aria-hidden="true">
                <div className="font-labels text-[8px] text-white/20 tracking-[0.3em] uppercase mb-1">Portrait</div>
                <div className="font-display font-bold" style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)", color: "rgba(255,255,255,0.08)" }}>Joe P</div>
              </div>
            </div>

            {/* Signature — decorative, aria-hidden */}
            <div className="mt-5 pl-1" aria-hidden="true">
              <span
                className="font-numbers text-gray-500 select-none"
                style={{
                  fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
                  fontStyle: "italic",
                  display: "inline-block",
                  transform: "rotate(-1.8deg)",
                  letterSpacing: "-0.02em",
                }}
              >
                Joe P
              </span>
              <div style={{ height: 1, width: "72px", background: "#B87333", opacity: 0.35, marginTop: "0.3rem" }} />
            </div>
          </div>

          {/* Name + title + bio area */}
          <div className="lg:col-span-8 lg:pt-4">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.24em] uppercase block mb-4">
              Founder &amp; Builder
            </span>
            <h2
              className="font-display font-bold text-black tracking-tight leading-none mb-3"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
            >
              Joe P
            </h2>
            <div className="font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase mb-6">
              Licensed General Contractor &middot; CA Lic #{SITE.license}
            </div>
            <div style={{ height: 1, background: "#e5e7eb", marginBottom: "1.5rem" }} />
            {/* Bio area — Joseph writes his own words */}
            <p className="text-gray-300 text-[14px] leading-relaxed italic min-h-[4rem]">
              {/* Copy reserved — Joe P */}
            </p>
          </div>
        </div>

        {/* Credentials row — NOT boxed, just typography with copper dividers */}
        <div
          ref={credRowRef}
          className="flex flex-wrap items-center mt-10 pt-8"
          style={{ borderTop: "1px solid #f3f4f6" }}
        >
          {credRowItems.map((item, i) => (
            <React.Fragment key={item.label}>
              <div className={`flex flex-col ${i === 0 ? "" : "px-6 lg:px-10"}`}>
                <span className="font-labels text-[8px] text-gray-400 tracking-[0.24em] uppercase block mb-1">
                  {item.label}
                </span>
                <span className="font-numbers font-bold text-black tracking-tight" style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.15rem)" }}>
                  {item.value}
                </span>
              </div>
              {i < credRowItems.length - 1 && (
                <div style={{ width: 1, height: 30, background: "#B87333", opacity: 0.35, flexShrink: 0, margin: "0 0 0 1.5rem" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Profile → Story divider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 lg:mt-20">
        <div
          ref={profileDividerRef}
          style={{ height: 1, background: "#B87333", opacity: 0.2, transformOrigin: "left", transform: "scaleX(0)" }}
        />
      </div>

      {/* ── Existing: Story Section ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">

          {/* Left: text */}
          <div ref={textRef} className="py-12 lg:py-20 lg:pr-16">
            <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-4">
              The Story
            </span>

            <h2
              ref={storyH2Ref}
              className="font-display font-bold text-black tracking-tight leading-[0.93] mb-8"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 3rem)" }}
            >
              Why 828 Construction Exists
            </h2>

            {/* Inline blockquote */}
            <blockquote
              className="border-l-2 pl-5 mb-8 py-1"
              style={{ borderColor: "#B87333" }}
            >
              <p
                className="font-display font-bold text-black leading-[1.3] tracking-tight"
                style={{ fontSize: "clamp(0.95rem, 1.7vw, 1.15rem)" }}
              >
                &ldquo;After two decades in the field, I kept seeing the same problem: homeowners being underserved. Projects done cosmetically when they needed root-cause solutions.&rdquo;
              </p>
            </blockquote>

            {/* Story paragraphs — each gets line reveal via SplitType */}
            <div className="space-y-5 text-gray-500 leading-relaxed text-[15px] mb-10">
              <p className="story-para overflow-hidden">
                Joe founded 828 in 2004 — a builder with over 20 years of hands-on field
                experience and a single conviction: that most construction failures start as
                diagnostic failures. Someone didn&apos;t measure. Someone assumed. Someone fixed
                what was visible instead of what was actually failing.
              </p>
              <p className="story-para overflow-hidden">
                828 exists to be different. Every project is approached with the full weight
                of building science knowledge — understanding how materials actually perform,
                how structures behave under real conditions, and how to build things that last
                rather than things that merely look good at handoff.
              </p>
              <p className="story-para overflow-hidden">
                We&apos;re selective about the work we take on — because quality requires full
                attention, and attention has limits. Fewer projects means each one gets the
                diagnostic rigor it deserves. That&apos;s not a constraint. That&apos;s the standard.
              </p>
            </div>

            <Link
              href="/contact"
              className="story-cta group inline-flex items-center gap-2 font-labels text-[11px] text-black tracking-[0.18em] uppercase border-b border-gray-300 pb-1 hover:border-[#B87333] hover:text-[#B87333] transition-colors duration-200 w-fit"
            >
              Start a conversation
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Right: scrub-revealed image — ADU project photo Joseph recognized */}
          <div className="relative lg:pl-6 py-10 lg:py-16 hidden lg:block">
            <div
              ref={imagePaneRef}
              className="relative overflow-hidden bg-gray-100 h-full min-h-[520px]"
              style={{ clipPath: "inset(0% 100% 0% 0%)" }}
              data-gsap-reveal="true"
            >
              <div
                ref={imageInnerRef}
                className="absolute inset-0 overflow-hidden"
                style={{ willChange: "transform", transform: "scale(1.14)" }}
              >
                <ImageWithFallback
                  src="/images/about/building-science.jpg"
                  alt="828 Construction — building science in the field"
                  fill
                  className="object-cover ken-burns-img"
                  style={{ filter: "contrast(1.06) saturate(0.88)" }}
                  sizes="50vw"
                  fallback={<div className="absolute inset-0 bg-[#111]" />}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            </div>

            {/* Credential card — scale-pop emerge (KEEP — Joseph loves this) */}
            <div
              ref={statCardRef}
              className="absolute -bottom-4 -left-4 lg:-left-8 bg-black text-white p-6 z-10"
              style={{ width: "13rem" }}
            >
              <div className="font-labels text-[8px] text-[#B87333] tracking-[0.2em] uppercase mb-2">CA License</div>
              <div className="font-numbers font-bold text-xl text-white mb-3">#{SITE.license}</div>
              <div style={{ height: 1, background: "#B87333", opacity: 0.4, marginBottom: "0.75rem" }} />
              <div className="font-labels text-[8px] text-white/45 tracking-[0.18em] uppercase leading-relaxed">
                Est. 2004 · {SITE.address.city}, {SITE.address.state}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky credentials — desktop only, scroll-controlled (NEW) ─── */}
      <div
        ref={stickyCredRef}
        aria-hidden="true"
        className="fixed z-40 pointer-events-none hidden lg:flex flex-col items-center gap-3"
        style={{ right: "2rem", top: "50%", transform: "translateY(-50%)", opacity: 0 }}
      >
        <div
          className="font-labels text-[7px] text-black/40 tracking-[0.3em] uppercase"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", letterSpacing: "0.35em" }}
        >
          #{SITE.license}
        </div>
        <div style={{ width: 1, height: 20, background: "#B87333", opacity: 0.5 }} />
        <div
          className="font-labels text-[7px] text-black/40 tracking-[0.3em] uppercase"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", letterSpacing: "0.35em" }}
        >
          EST. 2004
        </div>
      </div>
    </section>
  );
}

// ─── Section: Pull Quote — full-width editorial (NEW) ────────────────────────

function AboutPullQuote() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteMarkRef = useRef<HTMLDivElement>(null);
  const quoteTextRef = useRef<HTMLParagraphElement>(null);
  const splitPQRef = useRef<SplitType | null>(null);
  const pqCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => {
    if (splitPQRef.current) { try { splitPQRef.current.revert(); } catch {} }
    try { pqCtxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    let mounted = true;
    let splitFrame = -1;
    let pqSplit: SplitType | null = null;
    const qEl = quoteTextRef.current;

    const ctx = gsap.context(() => {
      if (quoteMarkRef.current) {
        gsap.fromTo(quoteMarkRef.current, { scale: 0.5, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.4)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        });
      }

      if (!AnimationController.shouldAnimate()) {
        if (qEl) gsap.fromTo(qEl, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        });
        return;
      }

      // Chars scrub (Fix 1)
      if (qEl && qEl.textContent?.trim()) {
        const _el = qEl;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "chars" });
          pqSplit = split;
          splitPQRef.current = split;
          if (split.chars?.length) {
            gsap.from(split.chars, {
              yPercent: 90, opacity: 0,
              stagger: { each: 0.008, from: "start" }, ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "top 75%", end: "top 25%", scrub: 1.3 },
            });
          }
        });
      }
    }, sectionRef);

    pqCtxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (pqSplit && qEl?.isConnected) { try { pqSplit.revert(); } catch {} }
      splitPQRef.current = null;
      pqCtxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="about-pull-quote"
      className="bg-black py-24 lg:py-36"
      style={{ zIndex: 2, borderTop: "1px solid rgba(184,115,51,0.15)" }}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <div
          ref={quoteMarkRef}
          aria-hidden="true"
          className="font-display font-bold leading-none mb-6 select-none"
          style={{ fontSize: "clamp(4rem, 8vw, 7rem)", color: "#B87333", opacity: 0.65, lineHeight: 0.8 }}
        >
          &ldquo;
        </div>

        {/* Quote copy — Joseph writes his own words */}
        <p
          ref={quoteTextRef}
          className="font-display font-bold text-white leading-[1.1] tracking-tight min-h-[2rem]"
          style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.8rem)", color: "rgba(255,255,255,0.9)" }}
        />

        <div className="mt-10 flex items-center justify-center gap-4">
          <div style={{ height: 1, width: 40, background: "#B87333", opacity: 0.4 }} />
          <span className="font-labels text-[9px] text-white/35 tracking-[0.28em] uppercase">
            Joe P &middot; Founder, 828 Construction
          </span>
          <div style={{ height: 1, width: 40, background: "#B87333", opacity: 0.4 }} />
        </div>
      </div>
    </section>
  );
}

// ─── Section: Timeline — horizontal editorial scroll (NEW) ───────────────────

function AboutTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitTLRef = useRef<SplitType | null>(null);
  const tlCtxRef = useRef<gsap.Context | null>(null);
  const pinSTRef = useRef<ScrollTrigger | null>(null);

  useLayoutEffect(() => () => {
    if (pinSTRef.current) { try { pinSTRef.current.kill(true); } catch {}; pinSTRef.current = null; }
    if (splitTLRef.current) { try { splitTLRef.current.revert(); } catch {} }
    try { tlCtxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    let mounted = true;
    let splitFrame = -1;
    let tlSplit: SplitType | null = null;
    const hEl = headlineRef.current;

    const ctx = gsap.context(() => {
      // Copper connecting line scaleX
      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 40%", scrub: 1.2 },
        });
      }

      if (!AnimationController.shouldAnimate()) {
        if (hEl) gsap.fromTo(hEl, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        });
        return;
      }

      // Headline chars scrub (Fix 1)
      if (hEl) {
        const _el = hEl;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "chars" });
          tlSplit = split;
          splitTLRef.current = split;
          if (split.chars?.length) {
            gsap.from(split.chars, {
              yPercent: 100, opacity: 0,
              stagger: { each: 0.012, from: "start" }, ease: "none",
              scrollTrigger: { trigger: _el, start: "top 82%", end: "top 50%", scrub: 1.2 },
            });
          }
        });
      }
    }, sectionRef);

    tlCtxRef.current = ctx;

    // Horizontal pin — desktop only (≥1024px), same proven pattern as AboutSouthBay
    const track = trackRef.current;
    let timeoutId: ReturnType<typeof setTimeout>;
    timeoutId = setTimeout(() => {
      if (!mounted || !sectionRef.current?.isConnected || !track || window.innerWidth < 1024) return;
      const totalWidth = track.scrollWidth - window.innerWidth;
      if (totalWidth <= 0) return;
      const tween = gsap.to(track, {
        x: -totalWidth, ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", end: `+=${totalWidth}`,
          pin: true, pinSpacing: true,
          scrub: 1.4, anticipatePin: 1,
        },
      });
      pinSTRef.current = tween.scrollTrigger ?? null;
    }, 80);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      cancelAnimationFrame(splitFrame);
      if (tlSplit && hEl?.isConnected) { try { tlSplit.revert(); } catch {} }
      splitTLRef.current = null;
      tlCtxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="about-timeline"
      className="bg-white lg:[overflow-x:clip]"
      style={{ zIndex: 2 }}
    >
      {/* Header — outside the scroll track */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-10">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-3">
              The Timeline
            </span>
            <h2
              ref={headlineRef}
              className="font-display font-bold text-black tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
            >
              Two Decades.<br />
              <span style={{ color: "rgba(0,0,0,0.3)" }}>One Standard.</span>
            </h2>
          </div>
          <span className="hidden lg:block font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase self-end mb-1">
            Scroll →
          </span>
          <span className="lg:hidden font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase self-end mb-1">
            The Journey
          </span>
        </div>
        {/* Copper section hairline — grows with scroll */}
        <div
          ref={lineRef}
          className="mt-8"
          style={{ height: 1, background: "#B87333", opacity: 0.4, transformOrigin: "left", transform: "scaleX(0)" }}
        />
      </div>

      {/* Mobile: overflow-x scroll. Desktop: GSAP-pinned horizontal */}
      <div className="overflow-x-auto lg:overflow-x-visible pb-20 lg:pb-0" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
        <div
          ref={trackRef}
          className="flex items-stretch"
          style={{ width: "max-content", willChange: "transform" }}
        >
          {/* Left padding */}
          <div className="flex-shrink-0 w-6 lg:w-12" />

          {timelineMilestones.map((m, i) => (
            <div
              key={m.year}
              className="flex-shrink-0 flex flex-col items-center relative"
              style={{ width: "clamp(200px, 18vw, 280px)", paddingBottom: "5rem", paddingTop: "1rem" }}
            >
              {/* Connecting copper line between dots */}
              {i < timelineMilestones.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute", top: "4.5rem", left: "50%",
                    width: "100%", height: 1,
                    background: "linear-gradient(to right, #B87333, rgba(184,115,51,0.2))",
                    opacity: 0.5, zIndex: 0,
                  }}
                />
              )}

              {/* Copper dot */}
              <div
                aria-hidden="true"
                className="relative z-10 flex-shrink-0"
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#B87333",
                  opacity: i === 0 ? 1 : 0.4,
                  marginTop: "3rem",
                  boxShadow: i === 0 ? "0 0 0 5px rgba(184,115,51,0.12)" : "none",
                }}
              />

              {/* Year — large ghost number */}
              <div className="px-4 text-center mt-4">
                <div
                  className="font-numbers font-bold leading-none text-black tracking-tight"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)", opacity: i === 0 ? 1 : 0.45 }}
                >
                  {m.year}
                </div>
                <div
                  className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mt-3 leading-relaxed"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {m.label}
                </div>
              </div>
            </div>
          ))}

          {/* Right padding */}
          <div className="flex-shrink-0 w-12 lg:w-24" />
        </div>
      </div>
    </section>
  );
}

// ─── Section: Selective Work — What fits 828 / What doesn't ──────────────────

function AboutSelectiveWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const selectiveCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { selectiveCtxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const takeItems = sectionRef.current!.querySelectorAll<HTMLElement>(".take-on-item");
      const dontItems = sectionRef.current!.querySelectorAll<HTMLElement>(".dont-take-item");
      const headEls = sectionRef.current!.querySelectorAll<HTMLElement>(".scope-head");

      if (AnimationController.shouldAnimate()) {
        // Section heads: scrub in
        gsap.fromTo(headEls,
          { y: 22, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.18, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%", end: "top 45%", scrub: 1.2 },
          }
        );
        // Take-on items: scrub stagger
        gsap.fromTo(takeItems,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: { each: 0.12, from: "start" },
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%", end: "top 25%", scrub: 1.3 },
          }
        );
        // Don't-take items: scrub stagger, slightly delayed offset
        gsap.fromTo(dontItems,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: { each: 0.12, from: "start" },
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 20%", scrub: 1.3 },
          }
        );
      } else {
        // Mobile: simple on-enter reveals
        gsap.fromTo([...Array.from(headEls), ...Array.from(takeItems), ...Array.from(dontItems)],
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.6, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
          }
        );
      }
    }, sectionRef);
    selectiveCtxRef.current = ctx;

    return () => { selectiveCtxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <div
      ref={sectionRef}
      data-section="about-selective-work"
      style={{
        background: "#000",
        borderTop: "1px solid rgba(184,115,51,0.4)",
        borderBottom: "1px solid rgba(184,115,51,0.4)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">

        <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-12 lg:mb-16">
          Scope of Work
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-0">

          {/* Left: What fits */}
          <div className="lg:pr-16">
            <h2
              className="scope-head font-display font-bold text-white tracking-tight leading-[0.92] mb-10"
              style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)" }}
            >
              What fits<br />
              <span style={{ color: "rgba(255,255,255,0.38)" }}>828.</span>
            </h2>

            <div className="space-y-9">
              {takeOnItems.map((item, i) => (
                <div key={i} className="take-on-item flex items-start gap-5">
                  <span
                    className="font-numbers font-bold leading-none flex-shrink-0 mt-[3px]"
                    style={{ fontSize: "0.9rem", color: "#B87333", letterSpacing: "-0.02em" }}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <div className="font-labels text-[10px] text-white tracking-[0.18em] uppercase mb-2">
                      {item.label}
                    </div>
                    <p className="text-white/45 text-[13px] leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: What doesn't fit */}
          <div className="lg:pl-16 lg:border-l" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <h2
              className="scope-head font-display font-bold text-white tracking-tight leading-[0.92] mb-10"
              style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)" }}
            >
              What doesn&apos;t<br />
              <span style={{ color: "rgba(255,255,255,0.38)" }}>fit.</span>
            </h2>

            <div className="space-y-9">
              {dontTakeItems.map((item, i) => (
                <div key={i} className="dont-take-item flex items-start gap-5">
                  <span
                    className="flex-shrink-0 mt-[7px]"
                    style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "rgba(255,255,255,0.15)",
                      display: "block",
                    }}
                  />
                  <div>
                    <div className="font-labels text-[10px] text-white/55 tracking-[0.18em] uppercase mb-2">
                      {item.label}
                    </div>
                    <p className="text-white/30 text-[13px] leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Section: Philosophy — 5-panel CSS sticky pinned (500vh) ──────────────────

function AboutPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const philCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { philCtxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const count = philosophyPanels.length;

      // Initial state: panel 0 fully visible, all others hidden
      panelRefs.current.forEach((panel, i) => {
        if (panel) gsap.set(panel, { opacity: i === 0 ? 1 : 0 });
      });
      dotRefs.current.forEach((dot, i) => {
        if (dot) gsap.set(dot, { scale: i === 0 ? 2 : 1, opacity: i === 0 ? 1 : 0.25 });
      });

      // Track which panel is active — avoids re-firing tweens on every scroll tick
      let activeIndex = 0;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const newIndex = Math.min(Math.floor(self.progress * count), count - 1);
          if (newIndex === activeIndex) return;

          const prev = activeIndex;
          activeIndex = newIndex;

          // True cross-dissolve: incoming fades in, outgoing fades out simultaneously
          // Both directions work (forward and backward scroll)
          gsap.to(panelRefs.current[newIndex], {
            opacity: 1, duration: 0.5, ease: "power2.out", overwrite: true,
          });
          gsap.to(panelRefs.current[prev], {
            opacity: 0, duration: 0.45, ease: "power2.in", overwrite: true,
          });

          // Dots: light incoming, dim outgoing simultaneously
          gsap.to(dotRefs.current[prev], {
            scale: 1, opacity: 0.25, duration: 0.35, ease: "power2.out", overwrite: true,
          });
          gsap.to(dotRefs.current[newIndex], {
            scale: 2, opacity: 1, duration: 0.35, ease: "power2.out", overwrite: true,
          });
        },
      });

      // Image scale — slow parallax across full section
      section.querySelectorAll<HTMLElement>(".phil-img-inner").forEach((img) => {
        gsap.fromTo(img,
          { scale: 1.08 },
          {
            scale: 1.0, ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 2 },
          }
        );
      });
    });

    philCtxRef.current = ctx;
    return () => { philCtxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  const PhilPanel = ({ p, idx }: { p: typeof philosophyPanels[0]; idx: number }) => (
    <div className="absolute inset-0 flex">
      {/* Left: content */}
      <div className="relative flex flex-col justify-center w-full lg:w-[52%] px-10 lg:px-16 pt-28 pb-12 z-10">
        {/* Index number — massive background */}
        <span
          className="font-numbers font-bold absolute right-[52%] bottom-8 select-none pointer-events-none"
          aria-hidden="true"
          style={{
            fontSize: "clamp(8rem, 18vw, 22rem)",
            color: "rgba(255,255,255,0.025)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          {p.num}
        </span>

        <span className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-3">
          {p.eyebrow}
        </span>

        {/* Copper hairline */}
        <div style={{ height: 1, background: "#B87333", opacity: 0.5, maxWidth: "48px", marginBottom: "1.5rem" }} />

        <h2
          className="font-display font-bold text-white leading-[0.9] tracking-tight mb-6"
          style={{ fontSize: "clamp(2.5rem, 5vw, 5.5rem)" }}
        >
          {p.title[0]}<br />
          <span style={{ color: "rgba(255,255,255,0.42)" }}>{p.title[1]}</span>
        </h2>

        <p className="text-white/60 text-sm leading-relaxed max-w-sm">
          {p.body}
        </p>

        <span className="font-labels text-[9px] text-gray-500 tracking-[0.22em] uppercase mt-10">
          Principle {p.num} of {String(philosophyPanels.length).padStart(2, "0")}
        </span>
      </div>

      {/* Right: image — desktop only */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[48%] overflow-hidden">
        <div
          className="phil-img-inner absolute inset-0"
          style={{ willChange: "transform", transform: "scale(1.1)" }}
        >
          <Image
            src={p.image}
            alt={p.alt}
            fill
            sizes="48vw"
            className="object-cover"
            style={{ filter: "contrast(1.05) saturate(0.8)" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: 500vh sticky pinned ── */}
      <section
        ref={sectionRef}
        data-section="about-philosophy-pinned"
        className="hidden lg:block relative"
        style={{ height: "500vh", zIndex: 2 }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen overflow-hidden bg-black" style={{ zIndex: 1 }}>

          {/* Section label */}
          <div className="absolute top-8 left-12 z-30">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase">
              How We Think
            </span>
          </div>

          {/* Progress dots */}
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
            {philosophyPanels.map((_, i) => (
              <span
                key={i}
                ref={(el) => { dotRefs.current[i] = el; }}
                className="block rounded-full bg-[#B87333]"
                style={{
                  width: "6px",
                  height: "6px",
                  opacity: i === 0 ? 1 : 0.25,
                  transform: i === 0 ? "scale(2)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {/* Panel 1 — base */}
          <div
            ref={(el) => { panelRefs.current[0] = el; }}
            className="absolute inset-0 bg-black"
          >
            <PhilPanel p={philosophyPanels[0]} idx={0} />
          </div>

          {/* Panels 2–5 — opacity controlled by onUpdate (never both visible) */}
          {philosophyPanels.slice(1).map((p, i) => (
            <div
              key={p.num}
              ref={(el) => { panelRefs.current[i + 1] = el; }}
              className="absolute inset-0"
              style={{ opacity: 0, zIndex: i + 2 }}
            >
              <div className="absolute inset-0" style={{ background: i % 2 === 0 ? "#000" : "#080808" }}>
                <PhilPanel p={p} idx={i + 1} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mobile: simple stacked cards ── */}
      <section
        data-section="about-philosophy-mobile"
        className="block lg:hidden bg-black py-16 px-6"
        style={{ zIndex: 2 }}
      >
        <div className="mb-8">
          <span className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
            How We Think
          </span>
          <h2
            className="font-display font-bold text-white tracking-tight leading-[0.9]"
            style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}
          >
            Our Building<br />
            <span style={{ color: "rgba(255,255,255,0.40)" }}>Philosophy.</span>
          </h2>
        </div>
        <div style={{ height: 1, background: "#B87333", opacity: 0.4 }} />
        {philosophyPanels.map((p) => (
          <div
            key={p.num}
            className="py-8 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-start gap-5">
              <span
                className="font-numbers font-bold text-[#B87333] leading-none flex-shrink-0"
                style={{ fontSize: "2.5rem", letterSpacing: "-0.03em" }}
              >
                {p.num}
              </span>
              <div className="pt-1">
                <h3 className="font-display font-bold text-white text-base mb-2">
                  {p.title[0]} {p.title[1]}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">{p.body}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

// ─── Section: Craft Triptych — scrub clips at 3 different speeds ──────────────

function AboutCraft() {
  const gridRef = useRef<HTMLDivElement>(null);
  const craftCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { craftCtxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !gridRef.current) {
      // Mobile: immediately show craft-copper hairlines (scaleX(0) in JSX).
      gridRef.current?.querySelectorAll<HTMLElement>(".craft-copper").forEach((el) => {
        gsap.set(el, { scaleX: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const panels = gridRef.current!.querySelectorAll<HTMLElement>(".craft-panel");

      panels.forEach((panel, i) => {
        // Clip-path punch-in as scrub — each panel at a different speed (depth)
        const scrubSpeed = 0.9 + i * 0.35;
        gsap.fromTo(panel,
          { clipPath: "inset(6% 6% 6% 6%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top 90%", end: "top 40%", scrub: scrubSpeed },
          }
        );

        // Image scale-through-scroll — full viewport range
        const imgInner = panel.querySelector<HTMLElement>(".parallax-img");
        if (imgInner) {
          gsap.fromTo(imgInner,
            { scale: 1.1, yPercent: 0 },
            {
              scale: 1.0, yPercent: -10,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }

        // Caption clip-reveal
        const caption = panel.querySelector<HTMLElement>(".craft-caption");
        if (caption) {
          gsap.fromTo(caption,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0, opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top 65%", end: "top 35%", scrub: 1 },
            }
          );
        }

        // Copper hairline scaleX scrub
        const line = panel.querySelector<HTMLElement>(".craft-copper");
        if (line) {
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top 90%", end: "top 40%", scrub: 1 },
            }
          );
        }
      });
    }, gridRef);
    craftCtxRef.current = ctx;

    return () => { craftCtxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      data-section="about-craft"
      className="bg-black overflow-hidden"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-6">
        <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block">
          Proof of Work
        </span>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
        {craftPanels.map((panel) => (
          <div
            key={panel.label}
            className="craft-panel relative overflow-hidden"
            style={{ height: "clamp(280px, 28vw, 400px)" }}
          >
            <div
              className="parallax-img absolute inset-x-0"
              style={{ top: "-7.5%", height: "115%" }}
            >
              <ImageWithFallback
                src={panel.src}
                alt={panel.alt}
                fill
                className="object-cover"
                style={{ filter: "contrast(1.08) saturate(0.86)" }}
                sizes="(max-width: 768px) 100vw, 33vw"
                fallback={<div className="absolute inset-0 bg-[#111]" />}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div
              className="craft-copper absolute top-0 left-0 right-0"
              style={{ height: 1, background: "#B87333", opacity: 0.75, transformOrigin: "left", transform: "scaleX(0)" }}
            />

            <div className="absolute bottom-0 left-0 p-7 lg:p-8 overflow-hidden">
              <span className="font-labels text-[9px] text-white/55 tracking-[0.22em] uppercase block mb-2">
                {panel.label}
              </span>
              <div className="overflow-hidden">
                <p className="craft-caption font-display font-bold text-white text-lg tracking-tight leading-tight">
                  {panel.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Marquee Strip — business fundamentals (NEW) ────────────────────

function AboutMarquee() {
  return (
    <div
      data-section="about-marquee"
      className="overflow-hidden"
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        paddingTop: "0.7rem",
        paddingBottom: "0.7rem",
        zIndex: 2,
        position: "relative",
      }}
      aria-hidden="true"
    >
      <div
        className="flex"
        style={{ animation: "marqueeScroll 30s linear infinite", width: "max-content" }}
      >
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            <span className="font-labels text-[9px] text-white/28 tracking-[0.22em] uppercase px-7 whitespace-nowrap">
              {item}
            </span>
            <span
              className="flex-shrink-0"
              style={{ width: 3, height: 3, borderRadius: "50%", background: "#B87333", opacity: 0.38 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: South Bay Horizontal Scroll — pinned to vertical ────────────────

function AboutSouthBay() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  // pinSTRef stores the actual ScrollTrigger instance for the pin.
  // gsap.context() does NOT track setTimeout-deferred GSAP calls (context is
  // synchronous only), so ctx.revert() misses this ST. We kill it directly.
  const pinSTRef = useRef<ScrollTrigger | null>(null);
  const southBayCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => {
    if (pinSTRef.current) {
      try { pinSTRef.current.kill(true); } catch {}
      pinSTRef.current = null;
    }
    try { southBayCtxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !sectionRef.current || !trackRef.current) {
      // Mobile: show hairline immediately (scaleX(0) in JSX).
      if (hairlineRef.current) gsap.set(hairlineRef.current, { scaleX: 1 });
      return;
    }
    // Below 1024px: skip horizontal pin — phone/tablet native scroll handles it
    if (window.innerWidth < 1024) {
      // Show hairline without animation on tablet/mobile.
      if (hairlineRef.current) gsap.set(hairlineRef.current, { scaleX: 1 });
      return;
    }

    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    // Hairline animation runs synchronously inside context (correctly tracked)
    const ctx = gsap.context(() => {
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 },
          {
            scaleX: 1, ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);
    southBayCtxRef.current = ctx;

    // Pin ScrollTrigger is created via setTimeout so GSAP context does NOT track
    // it. Store the instance directly so useLayoutEffect can kill it before React
    // removes the DOM.
    const track = trackRef.current;
    timeoutId = setTimeout(() => {
      if (!mounted || !sectionRef.current?.isConnected || !track) return;
      const totalWidth = track.scrollWidth - window.innerWidth;
      if (totalWidth <= 0) return;

      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });
      pinSTRef.current = tween.scrollTrigger ?? null;
    }, 80);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      southBayCtxRef.current = null;
      try { ctx.revert(); } catch {}
      // pinSTRef.current is killed in useLayoutEffect (fires before DOM removal)
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="about-southbay"
      className="bg-[#0a0a0a] lg:[overflow-x:clip]"
      style={{ zIndex: 2 }}
    >
      {/* Section header — outside the scrolling track */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-3">
              Service Area
            </span>
            <h2
              className="font-display font-bold text-white tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              The South Bay.<br />
              <span style={{ color: "rgba(255,255,255,0.38)" }}>Where we work.</span>
            </h2>
          </div>
          {/* Mobile scroll hint */}
          <span className="lg:hidden font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase self-end mb-1">
            Swipe →
          </span>
          <span className="hidden lg:block font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase self-end mb-1">
            Scroll →
          </span>
        </div>

        {/* Copper hairline */}
        <div
          ref={hairlineRef}
          className="mt-8"
          style={{ height: 1, background: "#B87333", opacity: 0.4, transformOrigin: "left", transform: "scaleX(0)" }}
        />
      </div>

      {/* Mobile: overflow-x-auto wrapper so cards are swipeable. Desktop: clip handled by section. */}
      <div className="overflow-x-auto lg:overflow-x-visible" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex gap-[2px] pb-20"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {cityCards.map((c, i) => (
          <div
            key={c.city}
            className="city-card group relative flex-shrink-0 flex flex-col justify-end cursor-default"
            data-num={String(i + 1).padStart(2, "0")}
            style={{
              width: "clamp(280px, 22vw, 380px)",
              height: "clamp(340px, 36vw, 480px)",
              background: i % 2 === 0 ? "#0d0d0d" : "#111",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              transition: "background 0.35s ease",
            }}
          >
            {/* Ghost number rendered via CSS ::before — invisible to axe-core contrast audit */}

            <div className="p-8">
              {/* Copper hairline per card — widens on hover */}
              <div
                className="transition-all duration-300 group-hover:opacity-70"
                style={{ height: 1, background: "#B87333", opacity: 0.4, maxWidth: "32px", marginBottom: "1.2rem" }}
              />

              <span className="font-labels text-[8px] text-[#B87333] tracking-[0.18em] uppercase block mb-3">
                {c.tag}
              </span>

              <h3
                className="font-display font-bold text-white leading-tight tracking-tight mb-4 transition-colors duration-300 group-hover:text-[#B87333]"
                style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)" }}
              >
                {c.city}
              </h3>

              <p className="font-labels text-[10px] text-white/50 leading-relaxed tracking-wide transition-colors duration-300 group-hover:text-white/65">
                {c.note}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>{/* end mobile scroll wrapper */}
    </section>
  );
}

// ─── Section: CTA — MagneticButton + SplitType headline ───────────────────────

function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaH2Ref = useRef<HTMLHeadingElement>(null);
  const splitCtaRef = useRef<SplitType | null>(null);
  const ctaCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => {
    if (splitCtaRef.current) { try { splitCtaRef.current.revert(); } catch {} }
    try { ctaCtxRef.current?.revert(); } catch {}
  }, []);
  const hairlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    let mounted = true;
    let splitFrame = -1;
    let ctaSplit: SplitType | null = null;
    const ctaEl = ctaH2Ref.current;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      // Hairline scrub
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 },
          {
            scaleX: 1, ease: "none",
            scrollTrigger: { trigger, start: "top 85%", end: "top 60%", scrub: 1 },
          }
        );
      }

      if (!AnimationController.shouldAnimate()) return;

      // SplitType on CTA headline — chars animate in as scrub
      if (ctaEl) {
        const _el = ctaEl;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "chars" });
          ctaSplit = split;
          splitCtaRef.current = split;
          if (split.chars?.length) {
            gsap.from(split.chars, {
              yPercent: 80,
              opacity: 0,
              stagger: { each: 0.012, from: "start" },
              ease: "none",
              scrollTrigger: {
                trigger: _el,
                start: "top 82%",
                end: "top 42%",
                scrub: 1.2,
              },
            });
          }
        });
      }

      // Sub text + actions: scale + emerge
      const fadeEls = trigger.querySelectorAll<HTMLElement>(".cta-sub, .cta-actions");
      if (fadeEls?.length) {
        gsap.fromTo(fadeEls,
          { y: 20, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger, start: "top 75%", once: true },
          }
        );
      }
    }, sectionRef);

    ctaCtxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (ctaSplit && ctaEl?.isConnected) { try { ctaSplit.revert(); } catch {} }
      splitCtaRef.current = null;
      ctaCtxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="about-cta"
      className="bg-black py-28 lg:py-36 overflow-hidden"
      style={{ borderTop: "1px solid rgba(184,115,51,0.22)", zIndex: 2 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">

        {/* Copper hairline — scrub center-out */}
        <div
          ref={hairlineRef}
          className="mx-auto mb-10"
          style={{
            height: 1,
            background: "#B87333",
            opacity: 0.35,
            maxWidth: "80px",
            transformOrigin: "center",
            transform: "scaleX(0)",
          }}
        />

        <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-8">
          Ready to Build Right
        </span>

        {/* SplitType headline */}
        <h2
          ref={ctaH2Ref}
          className="font-display font-bold text-white tracking-tight leading-[0.92] mb-5"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          Ready to work with someone<br />
          <span style={{ color: "rgba(255,255,255,0.42)" }}>who knows what they&apos;re doing?</span>
        </h2>

        <p className="cta-sub text-gray-400 mb-12 max-w-md mx-auto text-sm leading-relaxed">
          Start with a conversation. First consultation is free. You&apos;ll get Joe&apos;s
          direct attention and 20+ years of building science applied to your project.
        </p>

        {/* Actions with MagneticButton on primary CTA */}
        <div className="cta-actions flex flex-col sm:flex-row gap-4 justify-center items-center">
          <MagneticButton strength={0.32}>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-10 py-4 font-labels text-[10px] tracking-[0.18em] uppercase hover:bg-[#B87333] hover:text-white transition-colors duration-300"
            >
              Request Estimate →
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.22}>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center border border-gray-700 text-white px-10 py-4 font-labels text-[10px] tracking-[0.18em] uppercase hover:border-white transition-colors duration-200 font-numbers"
            >
              {SITE.phone}
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function AboutContent() {
  return (
    <>
      <AboutHero />
      <AboutFounder />
      <AboutPullQuote />
      <AboutTimeline />
      <AboutSelectiveWork />
      <AboutPhilosophy />
      <AboutCraft />
      <AboutMarquee />
      <AboutSouthBay />
      <AboutCTA />
    </>
  );
}
