"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE, SERVICES } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const choiceCards = [
  {
    num: "01",
    service: "ADU Construction",
    slug: "adu",
    image: "/images/projects/adu-framing.jpg",
    imageAlt: "ADU framing — 828 Construction",
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
    image: "/images/projects/remediation-active.jpg",
    imageAlt: "Remediation work — 828 Construction",
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
    image: "/images/projects/consulting-inspection.jpg",
    imageAlt: "Consulting inspection — 828 Construction",
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
    tagline: ["Accessory Dwelling Units.", "Built to Last."],
    forWho:
      "Homeowners planning to add living space who want a builder that balances practicality, durability, and long-term value — not the cheapest bid.",
    problems: [
      "Contractors who cut corners on structure or waterproofing",
      "Projects that run over budget without explanation",
      "ADU designs that ignore how the space will actually live",
    ],
    difference:
      "We approach every ADU with building science fundamentals — envelope performance, moisture management, structural load paths — before aesthetics.",
    image: "/images/projects/adu-exterior-new.jpg",
    imageSecondary: "/images/projects/adu-interior-living.jpg",
    imageAlt: "ADU Construction — 828 Construction Torrance CA",
    imageSecondaryAlt: "ADU interior living space — 828 Construction",
    imageLeft: true,
  },
  {
    slug: "remediation",
    tagline: ["Fix It Right.", "Fix It Once."],
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
    imageSecondary: "/images/projects/waterproofing-membrane.jpg",
    imageAlt: "Remediation — 828 Construction Torrance CA",
    imageSecondaryAlt: "Waterproofing membrane application — 828 Construction",
    imageLeft: false,
  },
  {
    slug: "consulting",
    tagline: ["Clarity Before", "Commitment."],
    forWho:
      "Homeowners and investors who need expert clarity before committing to a contractor, a scope, or a repair strategy.",
    problems: [
      "Competing bids with no basis for comparison",
      "Uncertainty about whether a project scope is complete",
      "Pre-purchase concerns about structural condition",
    ],
    difference:
      "We represent the owner's interests — not a material supplier, not a subcontractor. Our consulting gives you the information to make confident decisions.",
    image: "/images/projects/consulting-blueprints.jpg",
    imageSecondary: "/images/projects/consulting-plans.jpg",
    imageAlt: "Consulting — 828 Construction Torrance CA",
    imageSecondaryAlt: "Consulting plans review — 828 Construction",
    imageLeft: true,
  },
];

// ─── Section: Hero ────────────────────────────────────────────────────────────

function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
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
      // Mobile: fade in hero content once
      const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (fadeEls?.length) {
        gsap.fromTo(Array.from(fadeEls),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.2 }
        );
      }
      return;
    }

    let mounted = true;
    let splitFrame = -1;
    let heroSplit: SplitType | null = null;
    let heroLineEl: HTMLElement | null = null;

    const ctx = gsap.context(() => {
      // Triple-layer parallax scrub
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

      // SplitType char scatter EXIT — 4-guard cleanup (Fix 1)
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".svc-hero-line");
        if (heroLine && heroLine.isConnected) {
          heroLineEl = heroLine;
          const split = new SplitType(heroLine, { types: "words,chars" });
          heroSplit = split;
          splitRef.current = split;
          const chars = split.chars ?? [];
          gsap.to(chars, {
            yPercent: -80, opacity: 0,
            stagger: { each: 0.014, from: "random" },
            ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "30% top", end: "bottom top", scrub: 1.2 },
          });
          const lcpLine = headlineRef.current?.querySelector(".svc-lcp-line");
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
      data-section="services-hero"
      className="relative h-screen overflow-hidden bg-black"
      style={{ position: "relative", zIndex: 1 }}
    >
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{ top: "-15%", height: "130%" }}
        role="presentation"
        aria-hidden="true"
      >
        <Image
          src="/images/services/services-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "contrast(1.06) saturate(1.1) brightness(0.92)" }}
        />
      </div>
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.65) 100%)" }}
        aria-hidden="true"
      />

      <div className="hero-fade absolute top-0 left-0 right-0 z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 lg:pt-32">
        <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
          Services — CA Lic #1141119
        </span>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 pb-8 lg:pb-14">
        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-10 lg:mb-12"
          style={{ fontSize: "clamp(3.2rem, 8vw, 8.5rem)", textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
        >
          <span className="svc-lcp-line block">Three Services.</span>
          <span className="block overflow-hidden">
            <span
              className="svc-hero-line hero-line-animate block"
              style={{ color: "rgba(255,255,255,0.55)", animationDelay: "0.1s" }}
            >
              One Standard.
            </span>
          </span>
        </h1>

        <div
          className="hero-fade border-t flex flex-row flex-wrap gap-x-8 gap-y-2 pt-5"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {choiceCards.map((item) => (
            <div key={item.slug} className="flex items-center gap-2">
              <span className="font-numbers text-[9px] tracking-[0.2em] font-bold" style={{ color: "#B87333" }}>
                {item.num}
              </span>
              <span className="font-labels text-[8px] text-white/40 tracking-[0.16em] uppercase whitespace-nowrap">
                {item.service}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Keyword strip ───────────────────────────────────────────────────

function ServiceStrip() {
  const labels = ["ADU Construction", "Remediation", "Consulting", "Building Science", "South Bay CA", "Torrance"];
  return (
    <div
      className="bg-[#0a0a0a] overflow-hidden py-3 border-t border-b border-white/5"
      style={{ position: "relative", zIndex: 2 }}
      aria-hidden="true"
    >
      <div
        className="flex gap-12 items-center"
        style={{ animation: "marqueeScroll 28s linear infinite", width: "max-content" }}
      >
        {[...labels, ...labels].map((label, i) => (
          <span
            key={i}
            className="font-labels text-[9px] text-gray-500 tracking-[0.28em] uppercase whitespace-nowrap flex items-center gap-12"
          >
            {label}
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: "#B87333", opacity: 0.5 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Services Intro ──────────────────────────────────────────────────
// Two-column: left=text+stats, right=image mosaic (2 stacked photos)
// Ghost number opacity set via gsap.set(), NOT hardcoded in JSX (Fix 14)

function ServicesIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => {
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    const shouldAnimate = AnimationController.shouldAnimate();

    // Set ghost number initial state via gsap.set (Fix 14: not in JSX)
    if (ghostRef.current) {
      gsap.set(ghostRef.current, { opacity: 0, yPercent: 12 });
    }

    if (!shouldAnimate) {
      // Mobile branch (Fix 15): simple reveals
      if (ghostRef.current) gsap.set(ghostRef.current, { opacity: 0.06, yPercent: 0 });
      const revealEls = sectionRef.current?.querySelectorAll<HTMLElement>(".intro-reveal");
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
    let introSplit: SplitType | null = null;
    const headlineEl = headlineRef.current;

    const ctx = gsap.context(() => {
      // Copper hairline scaleX scrub
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // Ghost number parallax scrub
      if (ghostRef.current) {
        gsap.to(ghostRef.current, {
          yPercent: 0, opacity: 0.07, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "top 20%", scrub: 1.5 },
        });
      }

      // Image mosaic: clip-path scrub reveals
      if (img1Ref.current) {
        gsap.fromTo(img1Ref.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%", end: "top 25%", scrub: 1.4 } }
        );
      }
      if (img2Ref.current) {
        gsap.fromTo(img2Ref.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%", end: "top 15%", scrub: 1.4 } }
        );
      }

      // SplitType char scrub on headline — 4-guard (Fix 1)
      if (headlineEl) {
        const _el = headlineEl;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "words,chars" });
          introSplit = split;
          splitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(split.chars,
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0, opacity: 1,
                stagger: { each: 0.016, from: "start" },
                ease: "none",
                scrollTrigger: { trigger: sectionRef.current, start: "top 78%", end: "top 20%", scrub: 1.2 },
              }
            );
          }
        });
      }

      // Proof items — event once
      const proofEls = sectionRef.current?.querySelectorAll<HTMLElement>(".proof-el");
      if (proofEls?.length) {
        gsap.fromTo(Array.from(proofEls), { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%", once: true },
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (introSplit && headlineEl?.isConnected) { try { introSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="services-intro"
      className="bg-black relative"
      style={{ position: "relative", zIndex: 2, paddingTop: "clamp(5rem, 10vw, 8rem)", paddingBottom: "clamp(5rem, 10vw, 8rem)" }}
    >
      {/* Ghost number — opacity controlled via gsap.set, never hardcoded */}
      <div
        ref={ghostRef}
        className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none font-numbers font-bold leading-none hidden lg:block"
        aria-hidden="true"
        style={{ fontSize: "clamp(6rem, 12vw, 12rem)", color: "#B87333" }}
      >
        20
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-16 lg:gap-24 items-start">

          {/* Left: label + headline + stats */}
          <div className="lg:col-span-2">
            <span className="intro-reveal font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-6">
              Building Science Expertise
            </span>

            <div
              ref={hairlineRef}
              style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", maxWidth: 80, marginBottom: "2rem" }}
            />

            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.9] mb-10"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.5rem)", maxWidth: "16ch" }}
            >
              <span className="block">Building science.</span>
              <span className="block" style={{ color: "rgba(255,255,255,0.45)" }}>Not guesswork.</span>
              <span className="block" style={{ color: "rgba(255,255,255,0.28)" }}>Twenty years.</span>
            </h2>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5 max-w-lg">
              <div className="proof-el">
                <div className="font-numbers font-bold text-[#B87333] leading-none mb-2" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
                  20+
                </div>
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase leading-relaxed">
                  Years field experience
                </div>
              </div>
              <div className="proof-el">
                <div className="font-numbers font-bold text-white leading-none mb-2" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
                  3
                </div>
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase leading-relaxed">
                  Services. Carefully chosen.
                </div>
              </div>
              <div className="proof-el">
                <div className="font-numbers font-bold text-white leading-none mb-2" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
                  1
                </div>
                <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase leading-relaxed">
                  Standard. No exceptions.
                </div>
              </div>
            </div>
          </div>

          {/* Right: image mosaic — 2 stacked photos */}
          <div className="hidden lg:flex flex-col gap-3 self-stretch">
            {/* Top image */}
            <div
              ref={img1Ref}
              data-gsap-reveal="true"
              className="relative overflow-hidden flex-[3]"
              style={{ minHeight: "clamp(160px, 18vw, 260px)" }}
            >
              <Image
                src="/images/projects/adu-construction.jpg"
                alt="ADU construction site — 828 Construction"
                fill
                className="object-cover"
                style={{ filter: "contrast(1.05) saturate(1.08)" }}
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
            </div>
            {/* Bottom image */}
            <div
              ref={img2Ref}
              data-gsap-reveal="true"
              className="relative overflow-hidden flex-[2]"
              style={{ minHeight: "clamp(110px, 12vw, 180px)" }}
            >
              <Image
                src="/images/projects/outdoor-patio-pergola.jpg"
                alt="Outdoor construction — 828 Construction"
                fill
                className="object-cover"
                style={{ filter: "contrast(1.06) saturate(1.1)" }}
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Copper accent line */}
            <div style={{ height: 2, background: "#B87333", opacity: 0.35 }} />
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Section: Service Choice Cards (replaces PinnedDecisionAid) ───────────────
// Three full-bleed image cards — NO PIN. Staggered clip-path reveals.
// Eliminates black dead zone (Fix 11) and snappy panel transitions entirely.

function ServiceChoiceCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    const shouldAnimate = AnimationController.shouldAnimate();

    if (!shouldAnimate) {
      // Mobile: stagger reveal
      const cards = cardsRef.current?.querySelectorAll<HTMLElement>(".choice-card");
      if (cards?.length) {
        gsap.fromTo(Array.from(cards),
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true } }
        );
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Copper hairline scrub
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 88%", end: "top 60%", scrub: 1.2 },
        });
      }

      // Header text reveals — once:true (these are section labels, not scrub content)
      const headerEls = sectionRef.current?.querySelectorAll<HTMLElement>(".choice-header-el");
      if (headerEls?.length) {
        gsap.fromTo(Array.from(headerEls),
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 0.75,
            stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
          }
        );
      }

      // Cards: clip-path punch-in — once:true (Pattern B). Scrub on a card section
      // with readable text content creates lag where cards look empty too long.
      const cards = cardsRef.current?.querySelectorAll<HTMLElement>(".choice-card");
      if (cards?.length) {
        gsap.fromTo(Array.from(cards),
          { clipPath: "inset(8% 4% 8% 4%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)", opacity: 1,
            duration: 1.05,
            stagger: { each: 0.15, from: "start" },
            ease: "power3.out",
            scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true },
          }
        );
      }

      // Image parallax per card
      imgRefs.current.forEach((imgInner) => {
        if (!imgInner) return;
        gsap.to(imgInner, {
          yPercent: -10, ease: "none",
          scrollTrigger: {
            trigger: imgInner.closest(".choice-card"),
            start: "top bottom", end: "bottom top", scrub: true,
          },
        });
      });
    }, sectionRef);
    ctxRef.current = ctx;

    return () => { ctxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="services-decision"
      className="bg-black py-20 lg:py-28"
      style={{ position: "relative", zIndex: 2 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="overflow-hidden mb-3">
              <span className="choice-header-el font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block">
                Which service fits your project?
              </span>
            </div>
            <div
              ref={hairlineRef}
              style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", maxWidth: 80, marginBottom: "1.25rem" }}
            />
            <div className="overflow-hidden">
              <h2
                className="choice-header-el font-display font-bold text-white tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Scope it in{" "}
                <span style={{ color: "rgba(255,255,255,0.5)" }}>60 seconds.</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Three image cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 lg:grid-cols-3 gap-[3px]"
      >
        {choiceCards.map((card, i) => {
          const service = SERVICES.find((s) => s.slug === card.slug);
          return (
            <div
              key={card.slug}
              className="choice-card relative overflow-hidden group"
              style={{ minHeight: "clamp(380px, 55vw, 520px)" }}
            >
              {/* Background image */}
              <div
                ref={(el) => { imgRefs.current[i] = el; }}
                className="absolute left-0 right-0"
                style={{ top: "-7.5%", height: "115%", willChange: "transform" }}
              >
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(1.08)" }}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              {/* Dark overlay — heavier at bottom for text legibility */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.85) 100%)" }}
              />

              {/* Copper top accent line */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{ height: 2, background: "#B87333", opacity: i === 0 ? 0.7 : 0.25, transition: "opacity 0.3s" }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                {/* Number */}
                <span
                  className="font-numbers font-bold leading-none mb-4 select-none"
                  aria-hidden="true"
                  style={{ fontSize: "clamp(2rem, 2.8vw, 2.8rem)", color: "#B87333" }}
                >
                  {card.num}
                </span>

                <h3
                  className="font-display font-bold text-white tracking-tight leading-[0.92] mb-5"
                  style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)" }}
                >
                  {card.service}
                </h3>

                {/* When to use — shown on hover on desktop, always visible on mobile */}
                <ul className="space-y-2 mb-6 lg:max-h-0 lg:overflow-hidden lg:group-hover:max-h-40 transition-all duration-500">
                  {card.when.slice(0, 3).map((w) => (
                    <li key={w} className="flex items-start gap-2.5">
                      <span className="w-px h-3 bg-[#B87333] flex-shrink-0 mt-[3px] opacity-60" />
                      <span className="text-gray-300 text-xs leading-relaxed">{w}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services/${card.slug}`}
                  className="group/link inline-flex items-center gap-2 font-labels text-[10px] text-gray-300 tracking-[0.16em] uppercase border-b border-white/20 hover:text-[#B87333] hover:border-[#B87333] pb-0.5 transition-colors duration-200 self-start"
                >
                  {service?.short ?? card.service}
                  <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Section: Service row ─────────────────────────────────────────────────────
// Enhanced: main image + secondary inset (absolute, bottom corner)
// Fixes: opacity:0 removed from JSX (Fix 14), mobile branch added (Fix 15),
//        clip-path starts at top 115% so image isn't black on entry

function ServiceSection({ detail, index }: { detail: (typeof serviceDetails)[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imagePaneRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const ghostNumRef = useRef<HTMLDivElement>(null);
  const bodyTextRef = useRef<HTMLDivElement>(null);
  const taglineSplitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => {
    if (taglineSplitRef.current) { try { taglineSplitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {}
  }, []);

  const service = SERVICES.find((s) => s.slug === detail.slug)!;

  useEffect(() => {
    // Set ghost number initial state via gsap.set (Fix 14: not in JSX)
    if (ghostNumRef.current) {
      gsap.set(ghostNumRef.current, { opacity: 0, yPercent: 8 });
    }

    const shouldAnimate = AnimationController.shouldAnimate();

    if (!shouldAnimate) {
      // Mobile branch (Fix 15): set ghost to final state, reveal elements
      if (ghostNumRef.current) gsap.set(ghostNumRef.current, { opacity: 0.06, yPercent: 0 });
      const revealEls = [imagePaneRef.current, secondaryRef.current, textRef.current].filter(Boolean);
      if (revealEls.length) {
        gsap.fromTo(revealEls,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: rowRef.current, start: "top 85%", once: true } }
        );
      }
      return;
    }

    let mounted = true;
    let taglineSplitFrame = -1;
    let taglineSplit: SplitType | null = null;
    const taglineEl = taglineRef.current;

    const ctx = gsap.context(() => {
      const trigger = rowRef.current!;

      // Main image: clip-path scrub — starts at top 115% so reveal begins as section enters (fixes black flash)
      const clipFrom = detail.imageLeft ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
      gsap.fromTo(imagePaneRef.current,
        { clipPath: clipFrom },
        {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger, start: "top 115%", end: "top 30%", scrub: 1.4 },
        }
      );

      // Secondary image: clip-path from bottom
      if (secondaryRef.current) {
        gsap.fromTo(secondaryRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)", ease: "none",
            scrollTrigger: { trigger, start: "top 85%", end: "top 30%", scrub: 1.6 },
          }
        );
      }

      // Main image parallax yPercent
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      // Image scale-through-scroll
      const imgEl = imagePaneRef.current?.querySelector("img");
      if (imgEl) {
        gsap.fromTo(imgEl, { scale: 1.08 }, {
          scale: 1.0, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }

      // Ghost number parallax
      if (ghostNumRef.current) {
        gsap.to(ghostNumRef.current, {
          opacity: 0.08, yPercent: 0, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "top 30%", scrub: 1.5 },
        });
      }

      // Copper hairline scaleX scrub
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger, start: "top 75%", end: "top 40%", scrub: 1.2 },
        });
      }

      // Copper seam scaleY (event, once)
      if (seamRef.current) {
        gsap.fromTo(seamRef.current, { scaleY: 0 }, {
          scaleY: 1, duration: 1, delay: 0.3, ease: "power2.inOut", transformOrigin: "top",
          scrollTrigger: { trigger, start: "top 65%", once: true },
        });
      }

      // Body text scrub parallax
      if (bodyTextRef.current) {
        const bodyEls = bodyTextRef.current.querySelectorAll<HTMLElement>(".body-scrub");
        bodyEls.forEach((el, i) => {
          gsap.fromTo(el, { yPercent: 8, opacity: 0 }, {
            yPercent: 0, opacity: 1, ease: "none",
            scrollTrigger: {
              trigger,
              start: `top ${72 - i * 4}%`,
              end: `top ${35 - i * 3}%`,
              scrub: 1.2,
            },
          });
        });
      }

      // SplitType char reveal SCRUB on tagline — 4-guard (Fix 1)
      if (taglineEl) {
        const _el = taglineEl;
        taglineSplitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "words,chars" });
          taglineSplit = split;
          taglineSplitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(split.chars,
              { yPercent: 110, opacity: 0 },
              {
                yPercent: 0, opacity: 1,
                stagger: { each: 0.018, from: "start" },
                ease: "none",
                scrollTrigger: { trigger, start: "top 72%", end: "top 20%", scrub: 1.2 },
              }
            );
          }
        });
      }
    }, rowRef);
    ctxRef.current = ctx;

    return () => {
      mounted = false;
      cancelAnimationFrame(taglineSplitFrame);
      if (taglineSplit && taglineEl?.isConnected) { try { taglineSplit.revert(); } catch {} }
      taglineSplitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, [detail.imageLeft]);

  const imagePart = (
    <div
      className="relative flex-shrink-0 w-full lg:w-[58%] self-stretch"
      style={{ minHeight: "clamp(380px, 52vw, 100%)" }}
    >
      {/* Main image */}
      <div ref={imagePaneRef} className="absolute inset-0 overflow-hidden" data-gsap-reveal="true">
        <div ref={imgRef} className="absolute left-0 right-0" style={{ top: "-7.5%", height: "115%" }}>
          <Image
            src={detail.image}
            alt={detail.imageAlt}
            fill
            className="object-cover"
            style={{ filter: "contrast(1.05) saturate(1.08)" }}
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        </div>
        {/* Edge gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: detail.imageLeft
              ? "linear-gradient(to right, rgba(0,0,0,0) 55%, rgba(0,0,0,0.30) 100%)"
              : "linear-gradient(to left, rgba(0,0,0,0) 55%, rgba(0,0,0,0.30) 100%)",
          }}
        />
      </div>

      {/* Secondary image inset — absolute, bottom corner, 40%×42% of pane */}
      <div
        ref={secondaryRef}
        className="absolute z-10 overflow-hidden border border-white/10"
        data-gsap-reveal="true"
        style={{
          width: "40%",
          aspectRatio: "4/3",
          bottom: "1.5rem",
          ...(detail.imageLeft ? { right: "1.5rem" } : { left: "1.5rem" }),
        }}
      >
        <Image
          src={detail.imageSecondary}
          alt={detail.imageSecondaryAlt}
          fill
          className="object-cover"
          style={{ filter: "contrast(1.06) saturate(1.1)" }}
          sizes="(max-width: 1024px) 40vw, 23vw"
        />
        <div className="absolute inset-0 bg-black/15" />
        {/* Copper corner accent */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: 2, background: "#B87333", opacity: 0.55 }}
        />
      </div>

      {/* Ghost chapter number — opacity controlled via gsap.set (Fix 14) */}
      <div
        ref={ghostNumRef}
        className="absolute z-10 pointer-events-none select-none font-numbers font-bold leading-none"
        aria-hidden="true"
        style={{
          fontSize: "clamp(6rem, 10vw, 9rem)",
          color: "#B87333",
          top: 32,
          ...(detail.imageLeft ? { left: 28 } : { right: 28 }),
        }}
      >
        0{index + 1}
      </div>

      {/* Copper seam */}
      <div
        ref={seamRef}
        className="absolute top-[12%] z-20 pointer-events-none"
        style={{
          [detail.imageLeft ? "right" : "left"]: 0,
          width: 2, height: "76%",
          background: "linear-gradient(to bottom, transparent 0%, #B87333 18%, #B87333 82%, transparent 100%)",
          opacity: 0.45, transformOrigin: "top",
        }}
      />
    </div>
  );

  const textPart = (
    <div
      ref={textRef}
      className="flex flex-col justify-center flex-1 bg-black px-10 py-16 lg:px-14 lg:py-20"
      style={{ minHeight: "clamp(420px, 42vw, 100%)" }}
    >
      <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase mb-3 block">
        {service.short}
      </span>

      <h2
        ref={taglineRef}
        className="font-display font-bold text-white tracking-tight leading-[0.92] mb-5"
        style={{ fontSize: "clamp(2.2rem, 3.2vw, 3.6rem)" }}
      >
        {detail.tagline[0]}
        {detail.tagline[1] && (
          <span className="block" style={{ color: "rgba(255,255,255,0.42)" }}>
            {detail.tagline[1]}
          </span>
        )}
      </h2>

      <div
        ref={hairlineRef}
        style={{ height: 1, background: "#B87333", opacity: 0.4, transformOrigin: "left", maxWidth: 56, marginBottom: "1.5rem" }}
      />

      <div ref={bodyTextRef}>
        <p className="body-scrub text-sm leading-relaxed mb-6 max-w-[22rem] italic text-gray-400">
          &ldquo;{detail.forWho}&rdquo;
        </p>

        <div className="body-scrub mb-5">
          <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-2.5">
            Common Problems We Solve
          </div>
          <ul className="space-y-2">
            {detail.problems.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <span className="w-px h-3 bg-[#B87333] flex-shrink-0 mt-[3px] opacity-55" />
                <span className="text-gray-400 text-xs leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="body-scrub mb-8">
          <div className="font-labels text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-2.5">
            What&apos;s Included
          </div>
          <ul className="space-y-2">
            {service.details.slice(0, 4).map((d) => (
              <li key={d} className="flex items-start gap-2.5">
                <span className="w-px h-3 bg-white/20 flex-shrink-0 mt-[3px]" />
                <span className="text-gray-400 text-xs leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        href={`/services/${detail.slug}`}
        className="group inline-flex items-center gap-2 font-labels text-[10px] tracking-[0.16em] uppercase border-b pb-0.5 self-start transition-colors duration-200 text-gray-400 border-gray-700 hover:text-[#B87333] hover:border-[#B87333]"
      >
        Full {service.title} details
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );

  return (
    <div
      ref={rowRef}
      data-service={detail.slug}
      className={`flex flex-col ${detail.imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"} w-full`}
      style={{ position: "relative", zIndex: 2, minHeight: "clamp(560px, 100vh, 100vh)" }}
    >
      {imagePart}
      {textPart}
    </div>
  );
}

// ─── Section: CTA ─────────────────────────────────────────────────────────────

function ServicesCTA() {
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
      const revealEls = sectionRef.current?.querySelectorAll<HTMLElement>(".cta-el");
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
                stagger: { each: 0.018, from: "start" },
                ease: "none",
                scrollTrigger: { trigger: _trigger, start: "top 75%", end: "top 35%", scrub: 1.2 },
              }
            );
          }
        });
      }

      const els = sectionRef.current?.querySelectorAll<HTMLElement>(".cta-el");
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
    <section ref={sectionRef} data-section="services-cta" className="bg-black py-28 lg:py-36" style={{ position: "relative", zIndex: 2 }}>
      <div
        ref={hairlineRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 mb-16"
        style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left" }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <span className="cta-el font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
          Still deciding?
        </span>
        <h2
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.9] mb-6"
          style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
        >
          Start with a free consultation.
        </h2>
        <p className="cta-el text-gray-500 max-w-lg leading-relaxed mb-12">
          We&apos;ll help you figure out exactly what your project requires — no obligation, no pressure.
        </p>
        <div className="cta-el flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-colors duration-300 hover:text-white"
          >
            <span
              className="absolute inset-0 bg-[#B87333] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
              aria-hidden="true"
            />
            <span className="relative">Get Free Estimate</span>
            <span className="relative transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
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
      <ServicesIntro />
      <ServiceChoiceCards />
      {serviceDetails.map((detail, i) => (
        <div key={detail.slug}>
          <ServiceSection detail={detail} index={i} />
          {i < serviceDetails.length - 1 && (
            <div style={{ height: 1, background: "rgba(184,115,51,0.12)" }} />
          )}
        </div>
      ))}
      <ServicesCTA />
    </>
  );
}
