"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE, SERVICES } from "@/lib/constants";
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
    imageAlt: "ADU Construction — 828 Construction Torrance CA",
    imageLeft: true,
    bg: "bg-black",
    textOnDark: true,
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
    imageAlt: "Remediation — 828 Construction Torrance CA",
    imageLeft: false,
    bg: "bg-[#0f0f0f]",
    textOnDark: true,
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
    imageAlt: "Consulting — 828 Construction Torrance CA",
    imageLeft: true,
    bg: "bg-black",
    textOnDark: true,
  },
];

// ─── Section: Hero ────────────────────────────────────────────────────────────
// Variation C winner: service index strip at bottom, chapter eyebrow at top,
// brightness fixed to 0.92 (was 0.88 — CLAUDE.md violation)

function ServicesHero() {
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

      // SplitType char scatter EXIT on "One Standard." — 4-guard cleanup
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
              start: "30% top", end: "bottom top", scrub: 1.2,
            },
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
        gsap.fromTo(fadeEls,
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
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="services-hero"
      className="relative h-screen overflow-hidden bg-black"
      style={{ position: "relative", zIndex: 1 }}
    >
      {/* Layer 1: Background — brightness 0.92 (Fix 3: was 0.88, below 0.9 threshold) */}
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{
          top: "-15%", height: "130%",
          backgroundImage: "url('/images/services/services-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "contrast(1.06) saturate(1.1) brightness(0.92)",
        }}
        role="presentation"
        aria-hidden="true"
      />
      {/* Layer 2: Mid gradient — max from-black/65 */}
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.65) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Top eyebrow */}
      <div className="hero-fade absolute top-0 left-0 right-0 z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 lg:pt-32">
        <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
          Services — CA Lic #1141119
        </span>
      </div>

      {/* Layer 4: Bottom content — headline + service index */}
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

        {/* Service index strip — Variation C pattern */}
        <div
          className="hero-fade border-t flex flex-row flex-wrap gap-x-8 gap-y-2 pt-5"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {decisionAid.map((item) => (
            <div key={item.slug} className="flex items-center gap-2">
              <span
                className="font-numbers text-[9px] tracking-[0.2em] font-bold"
                style={{ color: "#B87333" }}
              >
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

// ─── Section: Services Intro (new) ───────────────────────────────────────────
// Editorial chapter between marquee strip and decision aid.
// Establishes WHY building science expertise before asking visitors to self-select.
// Scrub ratio for this section: 3 SCRUB (headline chars, hairline, ghost parallax) : 1 EVENT (proof items)

function ServicesIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (splitRef.current) { try { splitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let splitFrame = -1;
    let introSplit: SplitType | null = null;
    const headlineEl = headlineRef.current;

    const ctx = gsap.context(() => {
      // Copper hairline scaleX scrub (Pattern D)
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // Ghost number parallax scrub — caps at 0.07 so it stays decorative
      if (ghostRef.current) {
        gsap.fromTo(ghostRef.current, { yPercent: 12, opacity: 0 }, {
          yPercent: 0, opacity: 0.07, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "top 20%", scrub: 1.5 },
        });
      }

      // SplitType char scrub on headline — 4-guard cleanup
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

      // Proof items — event, stagger (once)
      const proofEls = sectionRef.current?.querySelectorAll<HTMLElement>(".proof-el");
      if (proofEls?.length) {
        gsap.fromTo(proofEls, { y: 20, opacity: 0 }, {
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
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="services-intro"
      className="bg-black relative"
      style={{ position: "relative", zIndex: 2, paddingTop: "clamp(5rem, 10vw, 8rem)", paddingBottom: "clamp(5rem, 10vw, 8rem)" }}
    >
      {/* Ghost number — decorative 20 (for 20+ years) */}
      <div
        ref={ghostRef}
        className="absolute right-6 lg:right-12 pointer-events-none select-none font-numbers font-bold leading-none"
        aria-hidden="true"
        style={{
          top: "50%", transform: "translateY(-50%)",
          fontSize: "clamp(6rem, 12vw, 12rem)",
          color: "#B87333",
          opacity: 0,
        }}
      >
        20
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-6">
          Building Science Expertise
        </span>

        {/* Copper hairline */}
        <div
          ref={hairlineRef}
          style={{
            height: 1, background: "#B87333", opacity: 0.5,
            transformOrigin: "left", maxWidth: 80, marginBottom: "2rem",
          }}
        />

        <h2
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.9] mb-10"
          style={{ fontSize: "clamp(2.6rem, 5vw, 4.5rem)", maxWidth: "16ch" }}
        >
          <span className="block">Twenty years.</span>
          <span className="block" style={{ color: "rgba(255,255,255,0.45)" }}>Three services.</span>
          <span className="block" style={{ color: "rgba(255,255,255,0.28)" }}>One standard.</span>
        </h2>

        {/* Proof items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 pt-8 border-t border-white/5 max-w-2xl">
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
    </section>
  );
}

// ─── Section: Pinned Decision Aid ─────────────────────────────────────────────
// Counter animation removed (Fix 4: was causing "3"→"0"→"3" jump).
// Static "3" in JSX is the correct behavior — ghost numbers on service rows provide counter decoration.

function PinnedDecisionAid() {
  const isMobile = useMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const pinCtxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (pinCtxRef.current) { try { pinCtxRef.current.revert(); } catch {} } }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !wrapperRef.current) return;
    const isMobileWindow = window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      // Copper hairline scaleX scrub
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      if (isMobileWindow) {
        const panels = wrapperRef.current!.querySelectorAll<HTMLElement>(".decision-panel");
        gsap.fromTo(panels, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 72%", once: true },
        });
        return;
      }

      // Desktop: Pinned scroll — explicit color snap (Fix 2: no panel-level opacity;
      // panel opacity caused text to fail a11y contrast — use per-element color dimming instead)
      const setActive = (activeIndex: number) => {
        decisionAid.forEach((_, i) => {
          const panel = panelRefs.current[i];
          const num = numRefs.current[i];
          if (!panel || !num) return;
          const isActive = i === activeIndex;
          // Panel: border and bg change only — NO opacity on wrapper
          gsap.set(panel, {
            borderColor: isActive ? "#B87333" : "rgba(255,255,255,0.04)",
            backgroundColor: isActive ? "#0d0d0d" : "#070707",
          });
          // Number: explicit color change, no opacity (aria-hidden but still needs contrast)
          gsap.set(num, {
            color: isActive ? "#B87333" : "#666",
            scale: isActive ? 1.05 : 0.95,
          });
          // List items: dim via color, not opacity
          const listItems = panel.querySelectorAll<HTMLElement>(".panel-item-text");
          listItems.forEach(el => {
            gsap.set(el, { color: isActive ? "#9ca3af" : "#555" });
          });
          // CTA link
          const link = panel.querySelector<HTMLElement>(".panel-cta");
          if (link) gsap.set(link, { color: isActive ? "#9ca3af" : "#555", borderColor: isActive ? "transparent" : "transparent" });
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
    pinCtxRef.current = ctx;

    return () => { pinCtxRef.current = null; try { ctx.revert(); } catch {} };
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-section="services-decision"
      style={{ minHeight: isMobile ? "auto" : "260vh", position: "relative", zIndex: 2 }}
    >
      <div ref={stickyRef} className="bg-black" style={{ minHeight: "100vh", overflowX: "clip" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
          <div className="mb-14">
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
              Which service fits your project?
            </span>
            <div
              ref={hairlineRef}
              style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", maxWidth: 80, marginBottom: "2rem" }}
            />
            <h2
              className="font-display font-bold text-white tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Scope it in{" "}
              <span style={{ color: "rgba(255,255,255,0.58)" }}>60 seconds.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            {decisionAid.map((item, i) => {
              const service = SERVICES.find((s) => s.slug === item.slug);
              return (
                <div
                  key={item.slug}
                  ref={(el) => { panelRefs.current[i] = el; }}
                  className="decision-panel border p-10 lg:p-12"
                  style={{ borderColor: i === 0 ? "#B87333" : "rgba(255,255,255,0.04)", backgroundColor: i === 0 ? "#0d0d0d" : "#070707" }}
                >
                  <span
                    ref={(el) => { numRefs.current[i] = el; }}
                    aria-hidden="true"
                    className="font-numbers font-bold leading-none block mb-6 select-none"
                    style={{
                      fontSize: "clamp(2.5rem, 3.5vw, 3.5rem)",
                      color: i === 0 ? "#B87333" : "#666",
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
                        <span className="panel-item-text text-sm leading-relaxed" style={{ color: i === 0 ? "#9ca3af" : "#555" }}>{w}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${item.slug}`}
                    className="panel-cta group inline-flex items-center gap-2 font-labels text-[10px] tracking-[0.16em] uppercase hover:text-[#B87333] transition-colors duration-200 border-b border-transparent hover:border-[#B87333] pb-0.5"
                    style={{ color: i === 0 ? "#9ca3af" : "#555" }}
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
// v3 upgrade: body text now scrub-parallaxed (yPercent), not event-fired.
// Ghost number opacity reduced (0 → 0.08) — was overbrighted at 1.
// Remediation bg changed from white to #0f0f0f — eliminates jarring light flash.

function ServiceSection({ detail, index }: { detail: (typeof serviceDetails)[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imagePaneRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const ghostNumRef = useRef<HTMLDivElement>(null);
  const bodyTextRef = useRef<HTMLDivElement>(null);
  const taglineSplitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (taglineSplitRef.current) { try { taglineSplitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  const service = SERVICES.find((s) => s.slug === detail.slug)!;

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let taglineSplitFrame = -1;
    let taglineSplit: SplitType | null = null;
    const taglineEl = taglineRef.current;

    const ctx = gsap.context(() => {
      const trigger = rowRef.current!;

      // Scrubbed clip-path on image pane (Pattern B)
      const clipFrom = detail.imageLeft ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
      gsap.fromTo(imagePaneRef.current,
        { clipPath: clipFrom },
        {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger, start: "top 80%", end: "top 25%", scrub: 1.2 },
        }
      );

      // Image parallax yPercent (Pattern F)
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      // Scale-through-scroll (Pattern 4)
      const imgEl = imagePaneRef.current?.querySelector("img");
      if (imgEl) {
        gsap.fromTo(imgEl, { scale: 1.08 }, {
          scale: 1.0, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }

      // Ghost number parallax — opacity caps at 0.08 (was 1, too bright)
      if (ghostNumRef.current) {
        gsap.fromTo(ghostNumRef.current, { opacity: 0, yPercent: 8 }, {
          opacity: 0.08, yPercent: 0, ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "top 30%", scrub: 1.5 },
        });
      }

      // Copper hairline scaleX scrub (Pattern D)
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger, start: "top 75%", end: "top 40%", scrub: 1.2 },
        });
      }

      // Copper seam scaleY (event, once — Pattern E)
      if (seamRef.current) {
        gsap.fromTo(seamRef.current, { scaleY: 0 }, {
          scaleY: 1, duration: 1, delay: 0.3, ease: "power2.inOut", transformOrigin: "top",
          scrollTrigger: { trigger, start: "top 65%", once: true },
        });
      }

      // Body text — scrub yPercent (v3 upgrade: was event-only, now scrubbed)
      if (bodyTextRef.current) {
        const bodyEls = bodyTextRef.current.querySelectorAll<HTMLElement>(".body-scrub");
        if (bodyEls.length) {
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
      }

      // SplitType char reveal SCRUB on tagline — 4-guard cleanup
      if (taglineEl) {
        const _el = taglineEl;
        taglineSplitFrame = requestAnimationFrame(() => {
          if (!mounted || !_el.isConnected) return;
          const split = new SplitType(_el, { types: "chars" });
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
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, [detail.imageLeft]);

  // All service rows now dark — eliminates jarring white flash between black sections
  const textPrimary = "text-white";
  const textSecondary = "text-gray-400";
  const labelColor = "text-gray-500";

  const imagePart = (
    <div
      className="relative flex-shrink-0 w-full md:w-[60%] self-stretch"
      style={{ minHeight: "clamp(360px, 50vw, 100%)" }}
    >
      <div ref={imagePaneRef} className="absolute inset-0 overflow-hidden">
        <div ref={imgRef} className="absolute left-0 right-0" style={{ top: "-7.5%", height: "115%" }}>
          <Image
            src={detail.image}
            alt={detail.imageAlt}
            fill
            className="object-cover"
            style={{ filter: "contrast(1.05) saturate(1.08)" }}
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>
        {/* Edge gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: detail.imageLeft
              ? "linear-gradient(to right, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)"
              : "linear-gradient(to left, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* Ghost chapter number */}
      <div
        ref={ghostNumRef}
        className="absolute z-10 pointer-events-none select-none font-numbers font-bold leading-none"
        aria-hidden="true"
        style={{
          fontSize: "clamp(6rem, 10vw, 9rem)",
          color: "#B87333",
          opacity: 0,
          bottom: 32,
          ...(detail.imageLeft ? { right: 28 } : { left: 28 }),
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
      className={`flex flex-col justify-center flex-1 ${detail.bg} px-10 py-16 md:px-14 lg:px-16`}
      style={{ minHeight: "clamp(420px, 40vw, 100%)" }}
    >
      {/* Eyebrow */}
      <span className={`font-labels text-[10px] ${labelColor} tracking-[0.22em] uppercase mb-3 block`}>
        {service.short}
      </span>

      {/* Tagline — SplitType char scrub */}
      <h2
        ref={taglineRef}
        className={`font-display font-bold ${textPrimary} tracking-tight leading-[0.92] mb-5`}
        style={{ fontSize: "clamp(2.2rem, 3.2vw, 3.6rem)" }}
      >
        {detail.tagline[0]}
        {detail.tagline[1] && (
          <span className="block" style={{ color: "rgba(255,255,255,0.42)" }}>
            {detail.tagline[1]}
          </span>
        )}
      </h2>

      {/* Copper hairline scrub */}
      <div
        ref={hairlineRef}
        style={{
          height: 1, background: "#B87333", opacity: 0.4,
          transformOrigin: "left", maxWidth: 56, marginBottom: "1.5rem",
        }}
      />

      {/* Body text — scrub yPercent parallax */}
      <div ref={bodyTextRef}>
        {/* For who */}
        <p className={`body-scrub text-sm leading-relaxed mb-6 max-w-[22rem] italic ${textSecondary}`}>
          &ldquo;{detail.forWho}&rdquo;
        </p>

        {/* Common problems */}
        <div className="body-scrub mb-5">
          <div className={`font-labels text-[9px] ${labelColor} tracking-[0.2em] uppercase mb-2.5`}>
            Common Problems We Solve
          </div>
          <ul className="space-y-2">
            {detail.problems.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <span className="w-px h-3 bg-[#B87333] flex-shrink-0 mt-[3px] opacity-55" />
                <span className={`${textSecondary} text-xs leading-relaxed`}>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What's included */}
        <div className="body-scrub mb-8">
          <div className={`font-labels text-[9px] ${labelColor} tracking-[0.2em] uppercase mb-2.5`}>
            What&apos;s Included
          </div>
          <ul className="space-y-2">
            {service.details.slice(0, 4).map((d) => (
              <li key={d} className="flex items-start gap-2.5">
                <span className="w-px h-3 bg-white/20 flex-shrink-0 mt-[3px]" />
                <span className={`${textSecondary} text-xs leading-relaxed`}>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
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
      className={`flex flex-col ${detail.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} w-full`}
      style={{ position: "relative", zIndex: 2, minHeight: "clamp(560px, 100vh, 100vh)" }}
    >
      {imagePart}
      {textPart}
    </div>
  );
}

// ─── Section: CTA ─────────────────────────────────────────────────────────────
// v3 upgrade: larger headline clamp(3rem, 6vw, 5.5rem), stronger eyebrow, tighter copy

function ServicesCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (splitRef.current) { try { splitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
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

      // SplitType 4-guard cleanup
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
        gsap.fromTo(els, { y: 28, opacity: 0 }, {
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
      <PinnedDecisionAid />
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
