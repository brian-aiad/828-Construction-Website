"use client";

import { useEffect, useRef } from "react";
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
    details: [
      "Understand your goals, timeline, and realistic budget",
      "Assess site conditions and any prior work",
      "Identify issues to address before scope is locked",
    ],
    promise:
      "You'll leave knowing whether the project is feasible, what it realistically involves, and whether 828 is the right fit.",
    image: "/images/process/planning.jpg",
  },
  {
    number: "02",
    title: "Planning",
    thesis:
      "Every decision is made before work starts — scope, materials, sequencing, and budget. No ambiguity, no scope creep, no surprises later.",
    details: [
      "Written scope of work before any work begins",
      "Material selection grounded in performance, not just price",
      "Timeline with milestones and realistic contingency",
    ],
    promise:
      "Changes to scope are discussed with you before they become costs. Not after.",
    image: "/images/process/scope-document.jpg",
  },
  {
    number: "03",
    title: "Execution",
    thesis:
      "Precise, quality-focused work with proactive communication. You'll know what's happening — we don't wait until you ask.",
    details: [
      "Regular progress updates on your schedule",
      "Quality checkpoints at critical stages",
      "Transparent communication if conditions change",
    ],
    promise:
      "If something unexpected comes up, you hear it from us first — along with a clear path forward.",
    image: "/images/process/quality-check.jpg",
  },
  {
    number: "04",
    title: "Completion",
    thesis:
      "A thorough walkthrough, full documentation, and continued availability after handoff. The job isn't done when the tools leave the site.",
    details: [
      "Complete walkthrough of all finished work",
      "Full project documentation package",
      "Post-project support for questions or follow-up",
    ],
    promise:
      "We stay available. If a question comes up six months later, we're still here.",
    image: "/images/process/final-detail.jpg",
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

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let splitFrame = -1;
    let heroLineEl: HTMLElement | null = null;
    let heroSplit: SplitType | null = null;
    const ctx = gsap.context(() => {
      // ── Technique 1: Triple-layer parallax ──────────────────────────────
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

      // ── Technique 2: SplitType char scatter exit on "Work." line ────────
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".proc-hero-line");
        if (heroLine && heroLine.isConnected) {
          heroLineEl = heroLine;
          const split = new SplitType(heroLine, { types: "chars" });
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

      const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (fadeEls?.length) {
        gsap.fromTo(fadeEls, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.35, ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (heroSplit && heroLineEl?.isConnected) { try { heroSplit.revert(); } catch {} }
      splitRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="process-hero"
      className="relative h-screen overflow-hidden bg-black"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{
          top: "-15%", height: "130%",
          backgroundImage: "url('/images/process/planning.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "contrast(1.05) saturate(0.8) brightness(0.38)",
        }}
        role="presentation"
        aria-hidden="true"
      />
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
// Technique 7: Horizontal-on-vertical scroll

function ProcessStrip() {
  const labels = ["01 Consultation", "02 Planning", "03 Execution", "04 Completion", "No Surprises", "Clear Scope"];

  return (
    <div
      className="bg-[#0a0a0a] border-t border-b border-white/5 overflow-hidden py-3"
      style={{ position: "relative", zIndex: 2 }}
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

// ─── Section: Pinned standards ────────────────────────────────────────────────
// Technique 5: Pinned moment — standards activate as you scroll

function PinnedStandards() {
  const isMobile = useMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !wrapperRef.current) return;

    const isMobile = window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      // ── Technique 10: Copper hairline scaleX scrub ──────────────────────
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // ── Technique 9: Counter count-up scrub ─────────────────────────────
      if (counterRef.current) {
        const el = counterRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 20, ease: "none",
          onUpdate: () => { el.textContent = Math.round(obj.val) + "+"; },
          scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", end: "top 20%", scrub: 1.5 },
        });
      }

      if (isMobile) {
        const rows = wrapperRef.current!.querySelectorAll<HTMLElement>(".standard-row");
        gsap.fromTo(rows, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 72%", once: true },
        });
        return;
      }

      // ── Desktop: Pinned scroll with row activation ───────────────────────
      const setActive = (activeIndex: number) => {
        standards.forEach((_, i) => {
          const row = rowRefs.current[i];
          if (!row) return;
          const isActive = i === activeIndex;
          const heading = row.querySelector<HTMLElement>(".std-heading");
          const body = row.querySelector<HTMLElement>(".std-body");
          const num = row.querySelector<HTMLElement>(".std-num");
          if (heading) gsap.to(heading, { color: isActive ? "#ffffff" : "#374151", duration: 0.35 });
          if (body) gsap.to(body, { opacity: isActive ? 1 : 0.3, duration: 0.35 });
          if (num) gsap.to(num, { color: isActive ? "#B87333" : "#374151", opacity: isActive ? 1 : 0.3, duration: 0.35 });
        });
      };

      setActive(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: stickyRef.current,
          start: "top top",
          end: "+=" + window.innerHeight * 1.8,
          scrub: 0.8,
          pinSpacing: false,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.28) setActive(0);
            else if (p < 0.53) setActive(1);
            else if (p < 0.78) setActive(2);
            else setActive(3);
          },
        },
      });
      tl.to({}, { duration: 1 });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} data-section="process-standards" style={{ minHeight: isMobile ? "auto" : "280vh", position: "relative", zIndex: 2 }}>
      <div ref={stickyRef} className="bg-black overflow-hidden" style={{ minHeight: "100vh" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">

          {/* Copper hairline scrub */}
          <div
            ref={hairlineRef}
            style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", marginBottom: "4rem" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
                Across Every Project
              </span>
              <h2
                className="font-display font-bold text-white tracking-tight leading-[0.9] mb-8"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                What doesn&apos;t{" "}
                <span style={{ color: "rgba(255,255,255,0.40)" }}>change.</span>
              </h2>
              <p className="text-gray-400 leading-relaxed max-w-sm mb-10">
                Structure varies project to project. Standards don&apos;t.
                These four principles apply to every engagement.
              </p>
              {/* Counter */}
              <div className="border-t border-white/5 pt-8">
                <div className="font-numbers font-bold text-[#B87333] leading-none" style={{ fontSize: "clamp(3rem, 5vw, 4rem)" }}>
                  <span ref={counterRef}>20+</span>
                </div>
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase mt-2">
                  Years Building South Bay
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 border-t border-white/5">
              {standards.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  className="standard-row py-7 border-b border-white/5 grid grid-cols-[4rem_1fr] gap-6"
                >
                  <span
                    className="std-num font-numbers font-bold leading-none select-none"
                    aria-hidden="true"
                    style={{
                      fontSize: "2.5rem",
                      color: i === 0 ? "#B87333" : "#374151",
                      opacity: i === 0 ? 1 : 0.3,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      className="std-heading font-display font-bold text-base mb-2 leading-snug"
                      style={{ color: i === 0 ? "#ffffff" : "#374151" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="std-body text-gray-400 text-sm leading-relaxed"
                      style={{ opacity: i === 0 ? 1 : 0.3 }}
                    >
                      {item.body}
                    </p>
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

// ─── Section: Step Row ────────────────────────────────────────────────────────

function StepRow({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imagePaneRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);

  const imageLeft = index % 2 === 0;

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const trigger = rowRef.current!;

      // ── Technique 3: Scrubbed clip-path ─────────────────────────────────
      const clipFrom = imageLeft ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
      gsap.fromTo(imagePaneRef.current, { clipPath: clipFrom }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger, start: "top 80%", end: "top 30%", scrub: 1.2 },
      });

      // Image parallax
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: -10, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      // ── Technique 4: Scale-through-scroll ───────────────────────────────
      const imgEl = imagePaneRef.current?.querySelector("img");
      if (imgEl) {
        gsap.fromTo(imgEl, { scale: 1.08 }, {
          scale: 1.0, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }

      // Text stagger
      const textEls = textRef.current?.querySelectorAll<HTMLElement>(".text-el");
      if (textEls?.length) {
        gsap.fromTo(textEls, { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.08, delay: 0.3, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 68%", once: true },
        });
      }

      // Copper seam
      if (seamRef.current) {
        gsap.fromTo(seamRef.current, { scaleY: 0 }, {
          scaleY: 1, duration: 0.9, delay: 0.45, ease: "power2.inOut", transformOrigin: "top",
          scrollTrigger: { trigger, start: "top 68%", once: true },
        });
      }
    }, rowRef);
    return () => ctx.revert();
  }, [imageLeft]);

  const isEven = index % 2 === 0;
  const bg = isEven ? "bg-black" : "bg-white";
  const textPrimary = isEven ? "text-white" : "text-black";
  const textSec = isEven ? "text-gray-400" : "text-gray-600";
  const eyebrow = isEven ? "text-gray-400" : "text-gray-600";
  const bullet = isEven ? "bg-[#B87333]/60" : "bg-black";
  const commitBg = isEven ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100";
  const commitText = isEven ? "text-gray-400" : "text-gray-600";

  return (
    <div ref={rowRef} data-step={step.number} style={{ position: "relative", zIndex: 2 }}>
      <div
        className={`flex flex-col ${imageLeft ? "md:flex-row" : "md:flex-row-reverse"} w-full`}
      >
        {/* Image pane */}
        <div className="relative overflow-hidden flex-shrink-0 w-full md:w-[50%]" style={{ minHeight: "clamp(340px, 48vw, 600px)" }}>
          <div ref={imagePaneRef} className="absolute inset-0">
            <div ref={imgRef} className="absolute left-0 right-0" style={{ top: "-7.5%", height: "115%" }}>
              <Image
                src={step.image}
                alt={`828 Construction — ${step.title}`}
                fill
                className="object-cover"
                style={{ filter: "contrast(1.06) saturate(0.9)" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background: imageLeft
                  ? "linear-gradient(to right, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)"
                  : "linear-gradient(to left, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)",
              }}
            />
          </div>

          <div
            className="absolute z-10 pointer-events-none select-none font-numbers font-bold leading-none"
            aria-hidden="true"
            style={{
              fontSize: "clamp(5rem, 8vw, 8rem)",
              color: "#B87333", opacity: 0.12,
              bottom: 24,
              ...(imageLeft ? { right: 28 } : { left: 28 }),
            }}
          >
            {step.number}
          </div>

          <div
            ref={seamRef}
            className="absolute top-[15%] z-20 pointer-events-none"
            style={{
              [imageLeft ? "right" : "left"]: 0,
              width: 2, height: "70%",
              background: "linear-gradient(to bottom, transparent 0%, #B87333 20%, #B87333 80%, transparent 100%)",
              opacity: 0.5, transformOrigin: "top",
            }}
          />
        </div>

        {/* Text pane */}
        <div ref={textRef} className={`flex flex-col justify-center flex-1 ${bg} px-10 py-16 md:px-14 lg:px-16`}>
          <span
            className="text-el font-numbers font-bold leading-none block mb-6 select-none"
            aria-hidden="true"
            style={{ fontSize: "clamp(3rem, 5vw, 5rem)", color: isEven ? "#B87333" : "#6b7280", opacity: isEven ? 0.8 : 0.6 }}
          >
            {step.number}
          </span>

          <h2
            className={`text-el font-display font-bold ${textPrimary} tracking-tight leading-[0.92] mb-5`}
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
          >
            {step.title}
          </h2>

          <p className={`text-el ${textSec} leading-relaxed mb-8 max-w-sm`} style={{ fontSize: 15 }}>
            {step.thesis}
          </p>

          <div className="text-el mb-8">
            <span className={`font-labels text-[9px] ${eyebrow} tracking-[0.2em] uppercase block mb-4`}>
              What We Do
            </span>
            <ul className="space-y-3">
              {step.details.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <span className={`w-px h-3.5 ${bullet} flex-shrink-0 mt-[3px]`} />
                  <span className={`${textSec} text-sm leading-relaxed`}>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`text-el border ${commitBg} p-5`}>
            <span className={`font-labels text-[9px] ${eyebrow} tracking-[0.2em] uppercase block mb-2`}>
              Our Commitment
            </span>
            <p className={`${commitText} text-sm leading-relaxed italic`}>
              &ldquo;{step.promise}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: CTA ─────────────────────────────────────────────────────────────

function ProcessCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let splitFrame = -1;
    let ctaSplit: SplitType | null = null;
    const ctaEl = headlineRef.current;
    const ctx = gsap.context(() => {
      // ── Technique 10: Copper hairline scaleX scrub ──────────────────────
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // ── Technique 2: SplitType char reveal scrub ─────────────────────────
      if (ctaEl) {
        const _el = ctaEl;
        const _trigger = sectionRef.current;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "chars" });
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

      // ── Technique 3: Scrubbed clip-path on decorative image ─────────────
      if (imageWrapRef.current) {
        gsap.fromTo(imageWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 30%", scrub: 1.2 },
        });
        // ── Technique 4: Scale-through-scroll ─────────────────────────────
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
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (ctaSplit && ctaEl?.isConnected) { try { ctaSplit.revert(); } catch {} }
      splitRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} data-section="process-cta" className="bg-black py-28 lg:py-36 overflow-hidden" style={{ position: "relative", zIndex: 2 }}>
      {/* Copper hairline scrub */}
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
            {/* ── Technique 8: MagneticButton ─────────────────────────────── */}
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

          {/* Right: scrub clip-path image */}
          <div className="lg:col-span-6 hidden lg:block">
            <div
              ref={imageWrapRef}
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/3", clipPath: "inset(100% 0% 0% 0%)" }}
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
      {steps.map((step, i) => (
        <div key={step.number}>
          <StepRow step={step} index={i} />
          {i < steps.length - 1 && (
            <div style={{ height: 1, background: "rgba(184,115,51,0.2)" }} />
          )}
        </div>
      ))}
      <PinnedStandards />
      <ProcessCTA />
    </>
  );
}
