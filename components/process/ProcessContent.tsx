"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import MagneticButton from "@/components/ui/MagneticButton";
import { AnimationController } from "@/utils/animationControl";
import { useMobile } from "@/hooks/useMobile";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Consultation",
    thesis:
      "A real conversation about your goals, site conditions, and constraints — before any commitment is made. We'll tell you honestly whether the project makes sense.",
    promise:
      "You'll leave knowing whether the project is feasible, what it realistically involves, and whether 828 is the right fit.",
    image: "/images/process/planning.jpg",
    tag: "Before Anything Begins",
  },
  {
    number: "02",
    title: "Planning",
    thesis:
      "Every decision is made before work starts — scope, materials, sequencing, and budget. No ambiguity, no scope creep, no surprises later.",
    promise:
      "Changes to scope are discussed with you before they become costs. Not after.",
    image: "/images/process/scope-document.jpg",
    tag: "No Surprises by Design",
  },
  {
    number: "03",
    title: "Execution",
    thesis:
      "Precise, quality-focused work with proactive communication. You'll know what's happening — we don't wait until you ask.",
    promise:
      "If something unexpected comes up, you hear it from us first — along with a clear path forward.",
    image: "/images/process/execution.jpg",
    tag: "Quality at Every Stage",
  },
  {
    number: "04",
    title: "Completion",
    thesis:
      "A thorough walkthrough, full documentation, and continued availability after handoff. The job isn't done when the tools leave the site.",
    promise:
      "We stay available. If a question comes up six months later, we're still here.",
    image: "/images/process/completion.jpg",
    tag: "Done Right, Not Just Done",
  },
];

const standards = [
  {
    title: "Transparency",
    body: "You know what's happening at every stage. No surprises. No information held back.",
  },
  {
    title: "Honest Assessment",
    body: "If something changes — scope, budget, timeline — you hear it from us before it becomes a problem.",
  },
  {
    title: "Field-Level Quality",
    body: "We hold ourselves to the standard we'd apply to our own home. Quality control at every stage, not just the visible finish.",
  },
  {
    title: "Direct Communication",
    body: "A real person responds. Joe is accessible for the duration of every project. Not a call center. Not a form auto-reply.",
  },
];

// ─── Section: Hero ────────────────────────────────────────────────────────────

function ProcessHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (splitRef.current) { try { splitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let splitFrame = -1;
    let heroLineEl: HTMLElement | null = null;
    let heroSplit: SplitType | null = null;
    const ctx = gsap.context(() => {
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

      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".proc-hero-line");
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
          const lcpLine = headlineRef.current?.querySelector(".proc-lcp-line");
          if (lcpLine) {
            gsap.to(lcpLine, {
              opacity: 0, ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "25% top", end: "65% top", scrub: 1.2 },
            });
          }
        }
      });

      // hero-fade elements render immediately from SSR — no opacity:0 initial state
      // (PATTERNS.md Fix 14: above-fold text must not start invisible, kills LCP)
    }, sectionRef);
    ctxRef.current = ctx;

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (heroSplit && heroLineEl?.isConnected) { try { heroSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="process-hero"
      className="relative h-screen bg-black"
      style={{ position: "relative", zIndex: 1, overflowX: "clip" }}
    >
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{ top: "-15%", height: "130%" }}
        role="presentation"
        aria-hidden="true"
      >
        <Image
          src="/images/process/quality-check.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "contrast(1.06) saturate(1.0) brightness(0.92)" }}
        />
      </div>
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.85) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <span className="hero-fade font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase mb-6 block">
          How We Work
        </span>
        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
          style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)", textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
        >
          <span className="proc-lcp-line block">How We</span>
          <span className="block overflow-hidden">
            <span className="proc-hero-line hero-line-animate block" style={{ color: "rgba(255,255,255,0.40)", animationDelay: "0.1s" }}>
              Work.
            </span>
          </span>
        </h1>
        <p
          className="hero-fade text-gray-300 max-w-lg leading-relaxed"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
        >
          Every project follows the same structured approach — not because
          we&apos;re rigid, but because structure is what prevents problems
          before they happen.
        </p>
      </div>
    </section>
  );
}

// ─── Section: Process horizontal strip ───────────────────────────────────────

function ProcessStrip() {
  const labels = ["01 Consultation", "02 Planning", "03 Execution", "04 Completion", "No Surprises", "Clear Scope"];

  return (
    <div
      className="bg-[#0a0a0a] border-t border-b border-white/5 py-3"
      style={{ position: "relative", zIndex: 2, overflow: "hidden" }}
      aria-hidden="true"
    >
      <div
        className="flex gap-12 items-center"
        style={{ animation: "marqueeScroll 32s linear infinite", width: "max-content" }}
      >
        {[...labels, ...labels].map((label, i) => (
          <span key={i} className="font-labels text-[9px] text-gray-600 tracking-[0.28em] uppercase whitespace-nowrap flex items-center gap-12">
            {label}
            <span className="w-px h-3 bg-[#B87333]/40 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Pinned Timeline (signature moment) ──────────────────────────────
// Technique: ONE long pinned scroll section where 4 phases unlock sequentially.
// Each phase: number, title, thesis, commitment quote, photo clip-path reveal.
// This is unique to the Process page — no other page uses this chapter progression.

function PinnedTimeline() {
  const isMobile = useMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ghostNumRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const pinCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (pinCtxRef.current) { try { pinCtxRef.current.revert(); } catch {} } }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Hairline enter
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // Fix 14: Set initial image clip states here, NOT in JSX.
      // JSX-hardcoded clipPath survives navigation and is never cleared if
      // the onUpdate callback hasn't fired yet — causing permanently invisible images.
      imgRefs.current.forEach((imgWrap, i) => {
        if (!imgWrap) return;
        gsap.set(imgWrap, {
          clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        });
        // Scale-through-scroll on image inner
        const inner = imgInnerRefs.current[i];
        if (inner) {
          gsap.fromTo(inner, { scale: 1.08 }, {
            scale: 1.0, ease: "none",
            scrollTrigger: { trigger: wrapperRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
          });
        }
      });

      // Main pin: 4 phases over 4×vh travel
      const phaseCount = steps.length;
      const travelMultiple = 3.6; // total = 3.6×vh for all 4 phases

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        pin: stickyRef.current,
        start: "top top",
        end: "+=" + window.innerHeight * travelMultiple,
        scrub: 0.8,
        pinSpacing: false,
        onUpdate: (self) => {
          const p = self.progress;
          // Each phase gets equal share of progress
          const threshold = 1 / phaseCount;
          let newIndex = Math.min(phaseCount - 1, Math.floor(p / threshold));
          // Last 5% of progress stays on last panel
          if (p >= 0.98) newIndex = phaseCount - 1;

          // Ghost number counter (01→04) via snap
          if (ghostNumRef.current) {
            ghostNumRef.current.textContent = String(newIndex + 1).padStart(2, "0");
          }

          // Progress bar scrub
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: p });
          }

          // Panel opacity snap (Fix 2 — no tweened opacity between panels)
          panelRefs.current.forEach((panel, i) => {
            if (!panel) return;
            gsap.set(panel, { opacity: i === newIndex ? 1 : 0, pointerEvents: i === newIndex ? "auto" : "none" });
          });

          // Image clip-path snap (each photo is inset(0) when active, inset(100% 0% 0% 0%) when not)
          imgRefs.current.forEach((imgWrap, i) => {
            if (!imgWrap) return;
            if (i === newIndex) {
              gsap.to(imgWrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.out", overwrite: true });
            } else {
              gsap.set(imgWrap, { clipPath: "inset(100% 0% 0% 0%)" });
            }
          });
        },
      });
    }, wrapperRef);
    pinCtxRef.current = ctx;
    return () => { pinCtxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  // Mobile fallback: sequential stagger, no pin
  if (isMobile) {
    return (
      <div data-section="process-timeline" className="bg-black" style={{ position: "relative", zIndex: 2 }}>
        {/* Copper hairline */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-4">
          <div style={{ height: 1, background: "#B87333", opacity: 0.5 }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-8 pt-4">
          <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-2">Our Process</span>
          <h2 className="font-display font-bold text-white tracking-tight leading-[0.9] mb-8" style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}>
            Four phases.<br />
            <span style={{ color: "rgba(255,255,255,0.40)" }}>No shortcuts.</span>
          </h2>
        </div>
        {steps.map((step, i) => (
          <div key={step.number} className="border-t border-white/5">
            <div className="relative overflow-hidden" style={{ height: "clamp(240px, 55vw, 320px)" }}>
              <Image
                src={step.image}
                alt={`828 Construction — ${step.title}`}
                fill
                className="object-cover"
                style={{ filter: "contrast(1.06) saturate(0.9)" }}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-numbers font-bold text-[#B87333] leading-none block" style={{ fontSize: "2.5rem" }}>
                  {step.number}
                </span>
                <h3 className="font-display font-bold text-white text-2xl leading-tight">{step.title}</h3>
              </div>
            </div>
            <div className="px-6 py-8 bg-black">
              <span className="font-labels text-[9px] text-gray-500 tracking-[0.22em] uppercase block mb-4">{step.tag}</span>
              <p className="text-gray-300 leading-relaxed mb-5" style={{ fontSize: 15 }}>{step.thesis}</p>
              <div className="border border-white/5 p-4">
                <span className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase block mb-2">Our Commitment</span>
                <p className="text-gray-400 text-sm leading-relaxed italic">&ldquo;{step.promise}&rdquo;</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: full pinned timeline
  return (
    <div
      ref={wrapperRef}
      data-section="process-timeline"
      style={{ minHeight: `${3.6 * 100 + 100}vh`, position: "relative", zIndex: 2 }}
    >
      <div
        ref={stickyRef}
        className="bg-black"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-16 pb-0">
          <div
            ref={hairlineRef}
            style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", marginBottom: "1.5rem" }}
          />
          <div className="flex items-end justify-between">
            <div>
              <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-2">Our Process</span>
              <h2
                className="font-display font-bold text-white tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                Four phases.<br />
                <span style={{ color: "rgba(255,255,255,0.40)" }}>No shortcuts.</span>
              </h2>
            </div>
            {/* Ghost number — snaps 01→04 */}
            <div className="text-right select-none" aria-hidden="true">
              <span
                ref={ghostNumRef}
                className="font-numbers font-bold leading-none text-[#B87333]"
                style={{ fontSize: "clamp(4rem, 8vw, 7rem)", opacity: 0.1 }}
              >
                01
              </span>
            </div>
          </div>
          {/* Scrub progress bar */}
          <div className="mt-5 mb-0" style={{ height: 1, background: "rgba(255,255,255,0.08)" }}>
            <div
              ref={progressBarRef}
              style={{ height: "100%", background: "#B87333", opacity: 0.6, transformOrigin: "left", transform: "scaleX(0)" }}
            />
          </div>
          {/* Phase labels */}
          <div className="flex mt-2 mb-0">
            {steps.map((step) => (
              <div key={step.number} aria-hidden="true" className="flex-1 font-labels text-[8px] text-gray-600 tracking-[0.2em] uppercase">
                {step.number}
              </div>
            ))}
          </div>
        </div>

        {/* Panels stack — only 1 visible at a time via opacity snap */}
        <div className="flex-1 relative" style={{ minHeight: "calc(100vh - 160px)" }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full h-full flex items-center pt-8 pb-16">
                <div className="grid grid-cols-12 gap-12 lg:gap-16 w-full items-center">

                  {/* Left: text */}
                  <div className="col-span-12 lg:col-span-5">
                    {/* Tag */}
                    <span className="font-labels text-[9px] text-gray-500 tracking-[0.22em] uppercase block mb-5">
                      {step.tag}
                    </span>
                    {/* Phase number + title */}
                    <div className="flex items-baseline gap-5 mb-6">
                      <span
                        className="font-numbers font-bold text-[#B87333] leading-none flex-shrink-0"
                        style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>
                      <h3
                        className="font-display font-bold text-white tracking-tight leading-[0.92]"
                        style={{ fontSize: "clamp(1.8rem, 3vw, 3rem)" }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Copper seam */}
                    <div style={{ height: 1, background: "#B87333", opacity: 0.35, marginBottom: "1.5rem" }} />

                    {/* Thesis */}
                    <p className="text-gray-300 leading-relaxed mb-8 max-w-md" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}>
                      {step.thesis}
                    </p>

                    {/* Commitment */}
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem" }}>
                      <span className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase block mb-2">
                        Our Commitment
                      </span>
                      <p className="text-gray-400 text-sm leading-relaxed italic">
                        &ldquo;{step.promise}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right: photo — scrubbed clip-path + scale */}
                  <div className="col-span-12 lg:col-span-7">
                    <div
                      ref={(el) => { imgRefs.current[i] = el; }}
                      data-pin-image="true"
                      className="relative"
                      style={{
                        height: "clamp(340px, 42vw, 560px)",
                        overflow: "hidden",
                      }}
                      data-gsap-reveal="true"
                    >
                      <div
                        ref={(el) => { imgInnerRefs.current[i] = el; }}
                        className="absolute left-0 right-0"
                        style={{ top: "-7.5%", height: "115%" }}
                      >
                        <Image
                          src={step.image}
                          alt={`828 Construction — ${step.title} phase`}
                          fill
                          className="object-cover"
                          style={{ filter: "contrast(1.06) saturate(0.9)" }}
                          sizes="(max-width: 1280px) 55vw, 700px"
                          priority={i === 0}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {/* Phase tag bottom-right */}
                      <div className="absolute bottom-5 right-5">
                        <span className="font-labels text-[9px] text-white/50 tracking-[0.18em] uppercase">
                          Phase {step.number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Editorial Standards (replaces PinnedStandards) ─────────────────
// Natural scroll — no pin. Each row reveals via per-row scrub trigger.
// Vertical copper rule grows top→bottom as user reads through the section
// (distinct from the timeline's horizontal progress bar).

function EditorialStandards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const vertRuleRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => {
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;

    let mounted = true;
    let splitFrame = -1;
    let headlineSplit: SplitType | null = null;

    const ctx = gsap.context(() => {
      // Copper hairline reveal (Pattern D)
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // Vertical copper rule — grows from top as user reads through the section
      if (vertRuleRef.current) {
        gsap.fromTo(vertRuleRef.current, { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          transformOrigin: "top",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 55%", end: "bottom 55%", scrub: 1.2 },
        });
      }

      // Headline char scrub reveal (Fix 1 — 4-guard SplitType cleanup)
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
                scrollTrigger: { trigger: wrapperRef.current, start: "top 82%", end: "top 45%", scrub: 1.1 },
              }
            );
          }
        });
      }

      // Per-row scrub reveals — each standard activates independently as user scrolls to it
      // (Fix 15: converted from once-on-enter to per-row scrub)
      rowRefs.current.forEach((row) => {
        if (!row) return;
        gsap.fromTo(row,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 88%", end: "top 52%", scrub: 1.2 },
          }
        );
      });

      // Years counter — fires once when section is well into view (Fix 4: immediateRender:false)
      if (counterRef.current) {
        const el = counterRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 25, duration: 2, ease: "power2.out",
          immediateRender: false,
          onUpdate: () => { el.textContent = Math.round(obj.val) + "+"; },
          scrollTrigger: { trigger: wrapperRef.current, start: "75% 80%", once: true },
        });
      }
    }, wrapperRef);

    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (headlineSplit && headlineRef.current?.isConnected) {
        try { headlineSplit.revert(); } catch {}
      }
      splitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      data-section="process-standards"
      className="bg-[#0a0a0a] py-24 lg:py-36"
      style={{ position: "relative", zIndex: 2, overflowX: "clip" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Copper hairline */}
        <div
          ref={hairlineRef}
          style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", marginBottom: "4rem" }}
        />

        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 lg:mb-20">
          <div className="lg:col-span-5">
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
              Across Every Project
            </span>
            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              What doesn&apos;t{" "}
              <span style={{ color: "rgba(255,255,255,0.40)" }}>change.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="text-gray-400 leading-relaxed max-w-md" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1rem)" }}>
              Structure varies project to project. Standards don&apos;t.
              These four principles apply to every engagement.
            </p>
          </div>
        </div>

        {/* Standards rows with vertical rule */}
        <div className="relative">
          {/* Vertical copper rule — grows as user reads through (section signature) */}
          <div
            ref={vertRuleRef}
            className="hidden lg:block absolute left-0 top-0 h-full"
            style={{ width: 1, background: "#B87333", opacity: 0.35, transformOrigin: "top", transform: "scaleY(0)" }}
            aria-hidden="true"
          />

          <div className="lg:pl-8">
            {standards.map((item, i) => (
              <div
                key={item.title}
                ref={(el) => { rowRefs.current[i] = el; }}
                className="py-8 lg:py-10 border-t border-white/5 group cursor-default transition-colors duration-300 hover:bg-white/[0.015]"
              >
                <div className="grid grid-cols-[3rem_1fr] gap-5">
                  <span
                    className="font-numbers font-bold leading-none text-[#B87333] select-none transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                    style={{ fontSize: "clamp(1.5rem, 2.2vw, 2rem)", opacity: 0.75, letterSpacing: "-0.03em", paddingTop: "0.15em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="lg:grid lg:grid-cols-[1fr_1.8fr] lg:gap-10 items-start">
                    <h3
                      className="font-display font-bold text-white leading-tight mb-3 lg:mb-0 transition-colors duration-300 group-hover:text-white/95"
                      style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed transition-colors duration-300 group-hover:text-gray-300" style={{ fontSize: "clamp(0.875rem, 1.2vw, 0.95rem)" }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Years counter — below the last standard row */}
            <div className="py-8 border-t border-white/5">
              <div className="font-numbers font-bold text-[#B87333] leading-none" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}>
                <span ref={counterRef}>25+</span>
              </div>
              <div className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase mt-2">
                Years Building South Bay
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: CTA ─────────────────────────────────────────────────────────────

function ProcessCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (splitRef.current) { try { splitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    // Fix 14: set GSAP initial state before shouldAnimate() gate.
    // imageWrapRef is inside hidden lg:block (display:none < 1024px) but we
    // still set/clear defensively. Never put GSAP initial states in JSX.
    if (imageWrapRef.current) {
      gsap.set(imageWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
    }

    if (!AnimationController.shouldAnimate()) {
      if (imageWrapRef.current) gsap.set(imageWrapRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
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

      if (imageWrapRef.current) {
        gsap.fromTo(imageWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 30%", scrub: 1.2 },
        });
        const imgEl = imageWrapRef.current.querySelector("img");
        if (imgEl) {
          gsap.fromTo(imgEl, { scale: 1.1 }, {
            scale: 1.0, ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
          });
        }
      }

      const els = sectionRef.current?.querySelectorAll<HTMLElement>(".cta-el");
      if (els?.length) {
        gsap.fromTo(els, { y: 24, opacity: 0 }, {
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
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="process-cta" className="bg-black py-28 lg:py-36" style={{ position: "relative", zIndex: 2, overflowX: "clip" }}>
      <div
        ref={hairlineRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 mb-16"
        style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left" }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6">
            <span className="cta-el font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
              Start Step One
            </span>
            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
            >
              Ready to start with step one?
            </h2>
            <p className="cta-el text-gray-400 mb-10 max-w-sm leading-relaxed">
              The first consultation is free. Let&apos;s understand your project
              before any commitment is made.
            </p>
            <div className="cta-el flex flex-col sm:flex-row gap-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-colors duration-300 hover:text-white"
                >
                  <span className="absolute inset-0 bg-[#B87333] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" aria-hidden="true" />
                  <span className="relative">Request Consultation</span>
                  <span className="relative transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </MagneticButton>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center border border-gray-700 text-gray-300 px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:border-white hover:text-white transition-colors font-numbers"
              >
                {SITE.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 hidden lg:block">
            <div
              ref={imageWrapRef}
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src="/images/process/final-detail.jpg"
                alt="828 Construction — final walkthrough"
                fill
                className="object-cover"
                style={{ filter: "contrast(1.06) saturate(0.95)" }}
                sizes="(max-width: 1280px) 50vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ProcessContent() {
  return (
    <>
      <ProcessHero />
      <ProcessStrip />
      <PinnedTimeline />
      <EditorialStandards />
      <ProcessCTA />
    </>
  );
}
