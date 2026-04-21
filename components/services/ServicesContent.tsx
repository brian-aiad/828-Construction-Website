"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE, SERVICES } from "@/lib/constants";
import MagneticButton from "@/components/ui/MagneticButton";
import { AnimationController } from "@/utils/animationControl";
import { useMobile } from "@/hooks/useMobile";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const decisionAid = [
  {
    num: "01",
    service: "ADU Construction",
    slug: "adu",
    when: [
      "Adding a detached or attached unit",
      "Converting a garage or storage space",
      "Creating rental or multigenerational space",
      "Full-build general contracting",
    ],
  },
  {
    num: "02",
    service: "Remediation",
    slug: "remediation",
    when: [
      "Water damage or repeated leaks",
      "Structural failures or defects",
      "Failed shower, envelope, or foundation systems",
      "Post-disaster recovery work",
    ],
  },
  {
    num: "03",
    service: "Consulting",
    slug: "consulting",
    when: [
      "Pre-purchase property evaluation",
      "Getting a second opinion on scope or bid",
      "Project planning before hiring a contractor",
      "Construction defect documentation",
    ],
  },
];

const serviceDetails = [
  {
    slug: "adu",
    tagline: "Accessory Dwelling Units.\nBuilt to Last.",
    forWho:
      "Homeowners planning to add living space who want a builder that balances practicality, durability, and long-term value — not the cheapest bid.",
    problems: [
      "Contractors who cut corners on structure or waterproofing",
      "Projects that run over budget without explanation",
      "ADU designs that ignore how the space will actually live",
    ],
    difference:
      "We approach every ADU with building science fundamentals — envelope performance, moisture management, structural load paths — before aesthetics.",
    image: "/images/projects/service-adu.jpg",
    imageAlt: "ADU Construction — 828 Construction Torrance CA",
    imageLeft: true,
    bg: "bg-black",
    textOnDark: true,
  },
  {
    slug: "remediation",
    tagline: "Fix It Right.\nFix It Once.",
    forWho:
      "Owners dealing with water damage, structural failures, or repeated issues who need the underlying cause addressed — not just cosmetically hidden.",
    problems: [
      "Contractors who patch the symptom without finding the source",
      "Repeated leaks or failures after previous repairs",
      "Unclear scope for insurance claims or legal documentation",
    ],
    difference:
      "Remediation requires understanding why a system failed, not just what failed. 20+ years of building science means we trace failures to their origin.",
    image: "/images/projects/remediation-after.jpg",
    imageAlt: "Remediation — 828 Construction Torrance CA",
    imageLeft: false,
    bg: "bg-white",
    textOnDark: false,
  },
  {
    slug: "consulting",
    tagline: "Clarity Before\nCommitment.",
    forWho:
      "Homeowners and investors who need expert clarity before committing to a contractor, a scope, or a repair strategy.",
    problems: [
      "Competing bids with no basis for comparison",
      "Uncertainty about whether a project scope is complete",
      "Pre-purchase concerns about structural condition",
    ],
    difference:
      "We represent the owner's interests — not a material supplier, not a subcontractor. Our consulting gives you the information to make confident decisions.",
    image: "/images/projects/consulting-plans.jpg",
    imageAlt: "Consulting — 828 Construction Torrance CA",
    imageLeft: true,
    bg: "bg-black",
    textOnDark: true,
  },
];

// ─── Section: Hero ────────────────────────────────────────────────────────────

function ServicesHero() {
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
      // Layer 1: background (yPercent -15 over scroll)
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      // Layer 2: mid gradient overlay (yPercent -8)
      if (midRef.current) {
        gsap.to(midRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      // Layer 3: headline counter-motion (+5 moves DOWN as user scrolls)
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }

      // ── Technique 2: SplitType char scatter EXIT on "One Standard." ─────
      // (entry is CSS clip-reveal below — no DOM mutation on LCP element)
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".svc-hero-line");
        if (heroLine && heroLine.isConnected) {
          heroLineEl = heroLine;
          const split = new SplitType(heroLine, { types: "chars" });
          heroSplit = split;
          splitRef.current = split;
          const chars = split.chars ?? [];
          gsap.to(chars, {
            yPercent: -80, opacity: 0,
            stagger: { each: 0.014, from: "random" },
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "30% top",
              end: "bottom top",
              scrub: 1.2,
            },
          });
          // Also fade the LCP line via opacity only (no DOM mutation)
          const lcpLine = headlineRef.current?.querySelector(".svc-lcp-line");
          if (lcpLine) {
            gsap.to(lcpLine, {
              opacity: 0, ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "25% top", end: "65% top", scrub: 1.2 },
            });
          }
        }
      });

      // Eyebrow + sub fade up
      const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (fadeEls?.length) {
        gsap.fromTo(
          fadeEls,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.35, ease: "power3.out" }
        );
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
      data-section="services-hero"
      className="relative h-screen overflow-hidden bg-black"
      style={{ position: "relative", zIndex: 1 }}
    >
      {/* Layer 1: Background */}
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{
          top: "-15%", height: "130%",
          backgroundImage: "url('/images/services/services-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "contrast(1.08) saturate(0.85) brightness(0.45)",
        }}
        role="presentation"
        aria-hidden="true"
      />
      {/* Layer 2: Mid gradient (independent parallax) */}
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Content (counter-motion) */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <span className="hero-fade font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase mb-6 block">
          Services
        </span>

        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
          style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)", textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
        >
          {/* Line 1: LCP — no SplitType, no will-change */}
          <span className="svc-lcp-line block">Three Services.</span>
          {/* Line 2: CSS clip reveal entry, SplitType exit */}
          <span className="block overflow-hidden">
            <span className="svc-hero-line hero-line-animate block" style={{ color: "rgba(255,255,255,0.40)", animationDelay: "0.1s" }}>
              One Standard.
            </span>
          </span>
        </h1>

        <p
          className="hero-fade text-white/55 max-w-lg leading-relaxed"
          style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
        >
          We don&apos;t try to do everything. Three areas where building science
          knowledge makes the biggest difference — and where bad contractors
          consistently underserve their clients.
        </p>
      </div>
    </section>
  );
}

// ─── Section: Horizontal keyword strip ───────────────────────────────────────
// Technique 7: Horizontal-on-vertical scroll — CSS marquee

function ServiceStrip() {
  const labels = ["ADU Construction", "Remediation", "Consulting", "Building Science", "South Bay CA", "Torrance"];

  return (
    <div
      className="bg-[#B87333] overflow-hidden py-3"
      style={{ position: "relative", zIndex: 2 }}
      aria-hidden="true"
    >
      <div
        className="flex gap-12 items-center"
        style={{
          animation: "marqueeScroll 28s linear infinite",
          width: "max-content",
        }}
      >
        {[...labels, ...labels].map((label, i) => (
          <span key={i} className="font-labels text-[9px] text-black tracking-[0.28em] uppercase whitespace-nowrap flex items-center gap-12">
            {label}
            <span className="w-1 h-1 bg-black/40 rounded-full inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Pinned Decision Aid ─────────────────────────────────────────────
// Technique 5: Pinned section — 3 service panels activate as you scroll

function PinnedDecisionAid() {
  const isMobile = useMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
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

      // ── Technique 9: Counter count-up (scrub) ───────────────────────────
      if (counterRef.current) {
        const el = counterRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 3, ease: "none",
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
          scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", end: "top 20%", scrub: 1.5 },
        });
      }

      if (isMobile) {
        const panels = wrapperRef.current!.querySelectorAll<HTMLElement>(".decision-panel");
        gsap.fromTo(panels, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 72%", once: true },
        });
        return;
      }

      // ── Desktop: Pinned scroll — activate panels as you scroll ──────────
      const setActive = (activeIndex: number) => {
        decisionAid.forEach((_, i) => {
          const panel = panelRefs.current[i];
          const num = numRefs.current[i];
          if (!panel || !num) return;
          const isActive = i === activeIndex;

          gsap.to(panel, { opacity: isActive ? 1 : 0.28, borderColor: isActive ? "#B87333" : "rgba(255,255,255,0.05)", duration: 0.4 });
          gsap.to(num, { color: isActive ? "#B87333" : "#555", opacity: isActive ? 1 : 0.35, scale: isActive ? 1.05 : 0.95, duration: 0.4 });
        });
      };

      setActive(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: stickyRef.current,
          start: "top top",
          end: "+=" + window.innerHeight * 1.6,
          scrub: 0.8,
          pinSpacing: false,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.38) setActive(0);
            else if (p < 0.72) setActive(1);
            else setActive(2);
          },
        },
      });
      tl.to({}, { duration: 1 });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} data-section="services-decision" style={{ minHeight: isMobile ? "auto" : "250vh", position: "relative", zIndex: 2 }}>
      <div ref={stickyRef} className="bg-black overflow-hidden" style={{ minHeight: "100vh" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          {/* Header */}
          <div className="mb-14">
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
              Which service fits your project?
            </span>
            {/* Copper hairline scrub */}
            <div
              ref={hairlineRef}
              style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", maxWidth: 80, marginBottom: "2rem" }}
            />
            <div className="flex items-end justify-between gap-4">
              <h2
                className="font-display font-bold text-white tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Scope it in{" "}
                <span style={{ color: "rgba(255,255,255,0.40)" }}>60 seconds.</span>
              </h2>
              {/* Counter */}
              <div className="text-right flex-shrink-0">
                <div className="font-numbers font-bold text-[#B87333] leading-none" style={{ fontSize: "clamp(2rem, 3vw, 3rem)" }}>
                  <span ref={counterRef}>3</span>
                </div>
                <div className="font-labels text-[8px] text-gray-600 tracking-[0.18em] uppercase mt-1">Services</div>
              </div>
            </div>
          </div>

          {/* 3-panel grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {decisionAid.map((item, i) => {
              const service = SERVICES.find((s) => s.slug === item.slug);
              return (
                <div
                  key={item.slug}
                  ref={(el) => { panelRefs.current[i] = el; }}
                  className="decision-panel bg-[#0a0a0a] border p-10 lg:p-12 transition-colors duration-300"
                  style={{ opacity: i === 0 ? 1 : 0.28, borderColor: i === 0 ? "#B87333" : "rgba(255,255,255,0.05)" }}
                >
                  <span
                    ref={(el) => { numRefs.current[i] = el; }}
                    aria-hidden="true"
                    className="font-numbers font-bold leading-none block mb-6 select-none"
                    style={{
                      fontSize: "clamp(2.5rem, 3.5vw, 3.5rem)",
                      color: i === 0 ? "#B87333" : "#555",
                      opacity: i === 0 ? 1 : 0.35,
                    }}
                  >
                    {item.num}
                  </span>
                  <h3
                    className="font-display font-bold text-white tracking-tight leading-tight mb-6"
                    style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)" }}
                  >
                    {item.service}
                  </h3>
                  <ul className="space-y-3 mb-10">
                    {item.when.map((w) => (
                      <li key={w} className="flex items-start gap-3">
                        <span className="w-px h-3.5 bg-[#B87333] flex-shrink-0 mt-[3px] opacity-60" />
                        <span className="text-gray-400 text-sm leading-relaxed">{w}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group inline-flex items-center gap-2 font-labels text-[10px] text-gray-400 tracking-[0.16em] uppercase hover:text-[#B87333] transition-colors duration-200 border-b border-transparent hover:border-[#B87333] pb-0.5"
                  >
                    {service?.short ?? item.service}
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Service row ─────────────────────────────────────────────────────

function ServiceSection({ detail, index }: { detail: (typeof serviceDetails)[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imagePaneRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const service = SERVICES.find((s) => s.slug === detail.slug)!;

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    const ctx = gsap.context(() => {
      const trigger = rowRef.current!;

      // ── Technique 3: Scrubbed clip-path on image ─────────────────────────
      const clipFrom = detail.imageLeft ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
      gsap.fromTo(
        imagePaneRef.current,
        { clipPath: clipFrom },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger, start: "top 80%", end: "top 30%", scrub: 1.2 },
        }
      );

      // Image parallax
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: -12, ease: "none",
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
      const textEls = textRef.current?.querySelectorAll<HTMLElement>(".reveal-el");
      if (textEls?.length) {
        gsap.fromTo(textEls, { y: 32, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.08, delay: 0.3, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 68%", once: true },
        });
      }

      // Copper seam
      if (seamRef.current) {
        gsap.fromTo(seamRef.current, { scaleY: 0 }, {
          scaleY: 1, duration: 0.9, delay: 0.5, ease: "power2.inOut", transformOrigin: "top",
          scrollTrigger: { trigger, start: "top 68%", once: true },
        });
      }

      // Detail grid stagger
      const detailEls = detailRef.current?.querySelectorAll<HTMLElement>(".detail-cell");
      if (detailEls?.length) {
        gsap.fromTo(detailEls, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: detailRef.current!, start: "top 80%", once: true },
        });
      }
    }, rowRef);

    return () => ctx.revert();
  }, [detail.imageLeft]);

  const imagePart = (
    <div
      className="relative overflow-hidden flex-shrink-0 w-full md:w-[55%]"
      style={{ minHeight: "clamp(380px, 55vw, 680px)" }}
    >
      <div ref={imagePaneRef} className="absolute inset-0">
        <div ref={imgRef} className="absolute left-0 right-0" style={{ top: "-7.5%", height: "115%" }}>
          <Image
            src={detail.image}
            alt={detail.imageAlt}
            fill
            className="object-cover"
            style={{ filter: "contrast(1.06) saturate(1.05)" }}
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: detail.imageLeft
              ? "linear-gradient(to right, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)"
              : "linear-gradient(to left, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>

      {/* Ghost number — CSS ::before would be safer; using aria-hidden */}
      <div
        className="absolute z-10 pointer-events-none select-none font-numbers font-bold leading-none"
        aria-hidden="true"
        style={{
          fontSize: "clamp(6rem, 10vw, 9rem)",
          color: "#B87333", opacity: 0.07,
          bottom: 28,
          ...(detail.imageLeft ? { right: 32 } : { left: 32 }),
        }}
      >
        0{index + 1}
      </div>

      {/* Copper seam */}
      <div
        ref={seamRef}
        className="absolute top-[15%] z-20 pointer-events-none"
        style={{
          [detail.imageLeft ? "right" : "left"]: 0,
          width: 2, height: "70%",
          background: "linear-gradient(to bottom, transparent 0%, #B87333 20%, #B87333 80%, transparent 100%)",
          opacity: 0.5, transformOrigin: "top",
        }}
      />
    </div>
  );

  const isOnDark = detail.textOnDark;
  const textPrimary = isOnDark ? "text-white" : "text-black";
  const textSecondary = isOnDark ? "text-gray-400" : "text-gray-600";
  const eyebrowColor = isOnDark ? "text-gray-400" : "text-gray-600";
  const bgText = isOnDark ? "bg-black" : "bg-white";

  const textPart = (
    <div ref={textRef} className={`flex flex-col justify-center flex-1 ${bgText} px-10 py-16 md:px-14 lg:px-16`}>
      <span className={`reveal-el font-labels text-[10px] ${eyebrowColor} tracking-[0.22em] uppercase mb-4 block`}>
        {service.short}
      </span>
      <h2
        className={`reveal-el font-display font-bold ${textPrimary} tracking-tight leading-[0.92] mb-6 whitespace-pre-line`}
        style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)" }}
      >
        {detail.tagline}
      </h2>
      <p className={`reveal-el ${textSecondary} leading-relaxed mb-8 max-w-sm`} style={{ fontSize: 15 }}>
        {service.description}
      </p>
      <p className={`reveal-el ${isOnDark ? "text-gray-500" : "text-gray-600"} text-sm leading-relaxed mb-10 max-w-xs italic`}>
        &ldquo;{detail.difference}&rdquo;
      </p>
      {/* ── Technique 8: MagneticButton on CTA ───────────────────────────── */}
      <MagneticButton strength={0.25}>
        <Link
          href={`/services/${detail.slug}`}
          className={`reveal-el group inline-flex items-center gap-3 font-labels text-[11px] ${isOnDark ? "text-gray-400 border-gray-700 hover:text-[#B87333] hover:border-[#B87333]" : "text-gray-600 border-gray-300 hover:text-black hover:border-black"} tracking-[0.18em] uppercase border-b pb-1 self-start transition-colors duration-300`}
        >
          Full {service.title} details
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </MagneticButton>
    </div>
  );

  const detailBg = isOnDark ? "bg-[#0a0a0a] border-white/5" : "bg-gray-50 border-gray-100";
  const detailLabel = isOnDark ? "text-gray-400" : "text-gray-600";
  const detailText = isOnDark ? "text-gray-400" : "text-gray-600";
  const detailBullet = isOnDark ? "bg-white/30" : "bg-gray-400";
  const detailIncBullet = isOnDark ? "bg-[#B87333]" : "bg-black";

  return (
    <div ref={rowRef} data-service={detail.slug} style={{ position: "relative", zIndex: 2 }}>
      <div
        className={`flex flex-col ${detail.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} w-full`}
        style={{ minHeight: "clamp(420px, 60vw, 680px)" }}
      >
        {imagePart}
        {textPart}
      </div>

      <div ref={detailRef} className={`grid grid-cols-1 md:grid-cols-3 gap-px ${detailBg} border-t`}>
        <div className={`detail-cell ${isOnDark ? "bg-[#0a0a0a]" : "bg-gray-50"} p-8 lg:p-10`}>
          <div className={`font-labels text-[9px] ${detailLabel} tracking-[0.2em] uppercase mb-4`}>Best For</div>
          <p className={`${detailText} text-sm leading-relaxed`}>{detail.forWho}</p>
        </div>
        <div className={`detail-cell ${isOnDark ? "bg-[#0a0a0a]" : "bg-gray-50"} p-8 lg:p-10`}>
          <div className={`font-labels text-[9px] ${detailLabel} tracking-[0.2em] uppercase mb-4`}>Common Problems We Solve</div>
          <ul className="space-y-2.5">
            {detail.problems.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className={`w-px h-3.5 ${detailBullet} flex-shrink-0 mt-[3px]`} />
                <span className={`${detailText} text-sm leading-relaxed`}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`detail-cell ${isOnDark ? "bg-[#0a0a0a]" : "bg-gray-50"} p-8 lg:p-10`}>
          <div className={`font-labels text-[9px] ${detailLabel} tracking-[0.2em] uppercase mb-4`}>What&apos;s Included</div>
          <ul className="space-y-2.5">
            {service.details.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span className={`w-px h-3.5 ${detailIncBullet} flex-shrink-0 mt-[3px]`} />
                <span className={`${detailText} text-sm leading-relaxed`}>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Section: CTA ─────────────────────────────────────────────────────────────

function ServicesCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
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
                stagger: { each: 0.02, from: "start" },
                ease: "none",
                scrollTrigger: { trigger: _trigger, start: "top 75%", end: "top 35%", scrub: 1.2 },
              }
            );
          }
        });
      }

      const els = sectionRef.current?.querySelectorAll<HTMLElement>(".cta-el");
      if (els?.length) {
        gsap.fromTo(els, { y: 28, opacity: 0 }, {
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
    <section ref={sectionRef} data-section="services-cta" className="bg-black py-28" style={{ position: "relative", zIndex: 2 }}>
      {/* Copper hairline scrub */}
      <div
        ref={hairlineRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 mb-16"
        style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left" }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <span className="cta-el font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
          Still not sure which service fits?
        </span>
        <h2
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.9] mb-6"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
        >
          Start with a free consultation.
        </h2>
        <p className="cta-el text-gray-400 max-w-lg leading-relaxed mb-12">
          We&apos;ll help you figure out exactly what your project requires — no
          obligation, no pressure.
        </p>
        <div className="cta-el flex flex-col sm:flex-row gap-4">
          <MagneticButton strength={0.3}>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-colors duration-300 hover:text-white"
            >
              <span className="absolute inset-0 bg-[#B87333] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" aria-hidden="true" />
              <span className="relative">Get Free Estimate</span>
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
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ServicesContent() {
  return (
    <>
      <ServicesHero />
      <ServiceStrip />
      <PinnedDecisionAid />
      {serviceDetails.map((detail, i) => (
        <div key={detail.slug}>
          <ServiceSection detail={detail} index={i} />
          {i < serviceDetails.length - 1 && (
            <div style={{ height: 1, background: "rgba(184,115,51,0.2)" }} />
          )}
        </div>
      ))}
      <ServicesCTA />
    </>
  );
}
