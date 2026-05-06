"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE, SERVICES } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// ─── Tile data ──────────────────────────────────────────────────────────────

const tiles = [
  {
    num: "01",
    slug: "adu",
    title: "ADU Construction",
    tagline: "Built for permanence.",
    image: "/images/services/adu-detail.jpg",
    imageAlt: "ADU construction — 828 Construction Torrance CA",
    clipFrom: "inset(0% 100% 0% 0%)", // left → right wipe
  },
  {
    num: "02",
    slug: "remediation",
    title: "Remediation",
    tagline: "Fix it right. Fix it once.",
    image: "/images/services/remediation-detail.jpg",
    imageAlt: "Remediation work — 828 Construction Torrance CA",
    clipFrom: "inset(100% 0% 0% 0%)", // top → bottom wipe
  },
  {
    num: "03",
    slug: "consulting",
    title: "Consulting",
    tagline: "Clarity before commitment.",
    image: "/images/services/consulting-detail.jpg",
    imageAlt: "Construction consulting — 828 Construction Torrance CA",
    clipFrom: "inset(0% 0% 100% 0%)", // bottom → top wipe
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

      // SplitType char scatter EXIT on scroll — 4-guard cleanup (Fix 1)
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
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.70) 100%)" }}
        aria-hidden="true"
      />

      {/* Eyebrow label */}
      <div className="hero-fade absolute top-0 left-0 right-0 z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 lg:pt-32">
        <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
          Services — CA Lic #1141119
        </span>
      </div>

      {/* Headline */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 pb-10 lg:pb-16">
        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-10 lg:mb-12"
          style={{ fontSize: "clamp(3.2rem, 8vw, 8.5rem)", textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
        >
          <span className="svc-lcp-line block">Three Services.</span>
          <span className="block overflow-hidden">
            <span
              className="svc-hero-line hero-line-animate block"
              style={{ color: "rgba(255,255,255,0.50)", animationDelay: "0.1s" }}
            >
              One Standard.
            </span>
          </span>
        </h1>

        {/* Service index strip */}
        <div
          className="hero-fade border-t flex flex-row flex-wrap gap-x-8 gap-y-2 pt-5"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {tiles.map((item) => (
            <div key={item.slug} className="flex items-center gap-2">
              <span className="font-numbers text-[9px] tracking-[0.2em] font-bold" style={{ color: "var(--color-accent)" }}>
                {item.num}
              </span>
              <span className="font-labels text-[8px] text-white/40 tracking-[0.16em] uppercase whitespace-nowrap">
                {item.title}
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
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: "var(--color-accent)", opacity: 0.45 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Asymmetric 3-tile gateway ───────────────────────────────────────
// Signature moment: three-vector mosaic entry
// ADU: left→right horizontal clip wipe
// Remediation: top→bottom vertical clip wipe
// Consulting: bottom→top vertical clip wipe
// Three different axes converge on scroll — unique to this gateway page.

function ServicesAsymmetricTiles() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {}; }, []);

  useEffect(() => {
    // Fix 14: set initial clip states before gate — never in JSX
    imgWrapRefs.current.forEach((wrap, i) => {
      if (wrap) gsap.set(wrap, { clipPath: tiles[i].clipFrom });
    });
    barRefs.current.forEach((bar) => {
      if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
    });

    const shouldAnimate = AnimationController.shouldAnimate();

    if (!shouldAnimate) {
      // Fix 15: mobile branch — reveal tiles simply, no clip
      imgWrapRefs.current.forEach((wrap) => {
        if (wrap) gsap.set(wrap, { clipPath: "inset(0%)" });
      });
      tileRefs.current.forEach((tile) => {
        if (tile) {
          gsap.fromTo(tile, { opacity: 0, y: 28 }, {
            opacity: 1, y: 0, duration: 0.65, ease: "power3.out",
            scrollTrigger: { trigger: tile, start: "top 85%", once: true },
          });
        }
      });
      return;
    }

    const hoverCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // Hairline scrub reveal
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 88%", end: "top 58%", scrub: 1.2 },
        });
      }

      // Three-vector clip reveals on scroll (signature moment)
      imgWrapRefs.current.forEach((wrap, i) => {
        if (!wrap) return;
        gsap.to(wrap, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 35%",
            scrub: 1.2,
          },
        });
      });

      // Parallax per tile image inner (Pattern F)
      imgInnerRefs.current.forEach((inner, i) => {
        if (!inner) return;
        gsap.to(inner, {
          yPercent: -10, ease: "none",
          scrollTrigger: {
            trigger: tileRefs.current[i],
            start: "top bottom", end: "bottom top", scrub: true,
          },
        });
      });

      // Section label + tile text reveals — once:true (not scrub — labels are small, fast)
      const headerEls = sectionRef.current?.querySelectorAll<HTMLElement>(".tiles-header-el");
      if (headerEls?.length) {
        gsap.fromTo(Array.from(headerEls),
          { y: 16, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
          }
        );
      }

      // Tile content text reveals — per-tile scrub (Fix 15 converted)
      tileRefs.current.forEach((tile) => {
        if (!tile) return;
        const textEls = tile.querySelectorAll<HTMLElement>(".tile-text-el");
        if (textEls.length) {
          gsap.fromTo(Array.from(textEls), { y: 20, opacity: 0 }, {
            y: 0, opacity: 1,
            stagger: { each: 0.06, from: "start" }, ease: "power2.out",
            scrollTrigger: { trigger: tile, start: "top 80%", end: "top 45%", scrub: 1.1 },
          });
        }
      });

      // Hover: image scale + maroon bar (Fix 20: explicit removeEventListener)
      if (window.matchMedia("(hover: hover)").matches) {
        tileRefs.current.forEach((tile, i) => {
          if (!tile) return;
          const imgInner = imgInnerRefs.current[i];
          const bar = barRefs.current[i];
          const onEnter = () => {
            if (imgInner) gsap.to(imgInner, { scale: 1.05, duration: 0.7, ease: "power2.out" });
            if (bar) gsap.to(bar, { scaleX: 1, duration: 0.3, ease: "power2.out" });
          };
          const onLeave = () => {
            if (imgInner) gsap.to(imgInner, { scale: 1.0, duration: 0.7, ease: "power2.out" });
            if (bar) gsap.to(bar, { scaleX: 0, duration: 0.3, ease: "power2.in" });
          };
          tile.addEventListener("mouseenter", onEnter);
          tile.addEventListener("mouseleave", onLeave);
          hoverCleanups.push(() => {
            tile.removeEventListener("mouseenter", onEnter);
            tile.removeEventListener("mouseleave", onLeave);
          });
        });
      }
    }, sectionRef);
    ctxRef.current = ctx;

    return () => {
      hoverCleanups.forEach((fn) => fn());
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="services-tiles"
      className="bg-black py-16 lg:py-20"
      style={{ position: "relative", zIndex: 2 }}
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <div
          ref={hairlineRef}
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, transformOrigin: "left", maxWidth: 80, marginBottom: "1.25rem" }}
        />
        <span className="tiles-header-el font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block">
          Three services. Select yours.
        </span>
      </div>

      {/* Asymmetric mosaic: ADU left (60%) + Remediation/Consulting stacked right (40%) */}
      <div className="flex flex-col gap-[3px] lg:flex-row">
        {/* Left: ADU — large tile */}
        <div
          ref={(el) => { tileRefs.current[0] = el; }}
          className="relative overflow-hidden group lg:flex-none"
          style={{ height: "clamp(380px, 65vh, 760px)", flexBasis: "60%" }}
        >
          <div
            ref={(el) => { imgWrapRefs.current[0] = el; }}
            data-gsap-reveal="true"
            className="absolute inset-0 overflow-hidden"
          >
            <div
              ref={(el) => { imgInnerRefs.current[0] = el; }}
              className="absolute left-0 right-0"
              style={{ top: "-7.5%", height: "115%", willChange: "transform" }}
            >
              <Image
                src={tiles[0].image}
                alt={tiles[0].imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                style={{ filter: "contrast(1.06) saturate(1.1)" }}
              />
            </div>
          </div>
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.88) 100%)" }}
            aria-hidden="true"
          />
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
            <span className="tile-text-el font-numbers font-bold leading-none mb-3 select-none" aria-hidden="true" style={{ fontSize: "clamp(2.5rem, 3.5vw, 3.5rem)", color: "var(--color-accent)" }}>
              {tiles[0].num}
            </span>
            <h2 className="tile-text-el font-display font-bold text-white tracking-tight leading-[0.9] mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
              {tiles[0].title}
            </h2>
            <p className="tile-text-el font-labels text-[10px] text-white/50 tracking-[0.16em] uppercase mb-6">
              {tiles[0].tagline}
            </p>
            <Link
              href={`/services/${tiles[0].slug}`}
              className="tile-text-el group/link inline-flex items-center gap-2 font-labels text-[10px] text-gray-300 tracking-[0.16em] uppercase border-b border-white/20 hover:text-white hover:border-white pb-0.5 transition-colors duration-200 self-start"
            >
              Explore ADU
              <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
            </Link>
          </div>
          {/* Hover bar */}
          <div
            ref={(el) => { barRefs.current[0] = el; }}
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 3, background: "var(--color-accent)" }}
            aria-hidden="true"
          />
        </div>

        {/* Right: Remediation + Consulting stacked */}
        <div className="flex flex-col gap-[3px] flex-1">
          {[1, 2].map((i) => (
            <div
              key={tiles[i].slug}
              ref={(el) => { tileRefs.current[i] = el; }}
              className="relative overflow-hidden group flex-1"
              style={{ minHeight: "clamp(280px, 32vh, 400px)" }}
            >
              <div
                ref={(el) => { imgWrapRefs.current[i] = el; }}
                data-gsap-reveal="true"
                className="absolute inset-0 overflow-hidden"
              >
                <div
                  ref={(el) => { imgInnerRefs.current[i] = el; }}
                  className="absolute left-0 right-0"
                  style={{ top: "-7.5%", height: "115%", willChange: "transform" }}
                >
                  <Image
                    src={tiles[i].image}
                    alt={tiles[i].imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    style={{ filter: "contrast(1.06) saturate(1.1)" }}
                  />
                </div>
              </div>
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.82) 100%)" }}
                aria-hidden="true"
              />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-7 lg:p-8">
                <span className="tile-text-el font-numbers font-bold leading-none mb-2 select-none" aria-hidden="true" style={{ fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "var(--color-accent)" }}>
                  {tiles[i].num}
                </span>
                <h2 className="tile-text-el font-display font-bold text-white tracking-tight leading-[0.9] mb-1.5" style={{ fontSize: "clamp(1.3rem, 2.2vw, 2rem)" }}>
                  {tiles[i].title}
                </h2>
                <p className="tile-text-el font-labels text-[9px] text-white/45 tracking-[0.14em] uppercase mb-5">
                  {tiles[i].tagline}
                </p>
                <Link
                  href={`/services/${tiles[i].slug}`}
                  className="tile-text-el group/link inline-flex items-center gap-2 font-labels text-[10px] text-gray-300 tracking-[0.14em] uppercase border-b border-white/20 hover:text-white hover:border-white pb-0.5 transition-colors duration-200 self-start"
                >
                  Explore {tiles[i].title.split(" ")[0]}
                  <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                </Link>
              </div>
              {/* Hover bar */}
              <div
                ref={(el) => { barRefs.current[i] = el; }}
                className="absolute bottom-0 left-0 right-0"
                style={{ height: 3, background: "var(--color-accent)" }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Closing CTA with BOOK CALL dropdown ─────────────────────────────

function ServicesBookCTA() {
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
      data-section="services-book-cta"
      className="bg-black py-28 lg:py-40"
      style={{ position: "relative", zIndex: 2 }}
    >
      <div
        ref={hairlineRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 mb-14"
        style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, transformOrigin: "left" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <span className="cta-reveal font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-5">
          Not sure which path?
        </span>
        <h2
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)", maxWidth: "16ch" }}
        >
          Start with a conversation.
        </h2>
        <p className="cta-reveal text-gray-500 max-w-md leading-relaxed mb-12" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)" }}>
          We&apos;ll help you identify the right service for your project — no obligation, no pressure.
        </p>

        {/* CTAs */}
        <div className="cta-reveal flex flex-col sm:flex-row items-start gap-4">
          {/* BOOK CALL asterisk dropdown — Pattern from PATTERNS.md */}
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
                style={{
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                  transform: callOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
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
                <div
                  style={{ height: 1, background: "var(--color-accent)", opacity: 0.5, marginBottom: "0.75rem" }}
                  aria-hidden="true"
                />
                <a
                  href={SITE.phoneHref}
                  className="font-numbers text-white text-lg tracking-wide hover:text-gray-300 transition-colors block"
                >
                  {SITE.phone}
                </a>
                <span className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase mt-1 block">
                  Mon – Fri · 7am – 6pm PT
                </span>
              </div>
            )}
          </div>

          {/* Get in touch secondary */}
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

export default function ServicesContent() {
  return (
    <>
      <ServicesHero />
      <ServiceStrip />
      <ServicesAsymmetricTiles />
      <ServicesBookCTA />
    </>
  );
}
