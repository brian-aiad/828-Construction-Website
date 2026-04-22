"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// ── Home page signature moment ────────────────────────────────────────────────
// Ghost watermark counter scrubs 0→150 behind SplitType headline chars.
// Dual-layer typographic scrub unique to the home page.

const STATS = [
  { value: "20+", label: "Years South Bay" },
  { value: "150+", label: "Projects Completed" },
  { value: "3", label: "Core Services" },
];

export default function HomeInterstitial() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => {
    if (splitRef.current) { try { splitRef.current.revert(); } catch {} }
    try { ctxRef.current?.revert(); } catch {}
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    let mounted = true;
    let splitFrame = -1;
    let localSplit: SplitType | null = null;
    const headEl = headlineRef.current;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      // ── Background parallax ──────────────────────────────────────────────
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }

      if (!AnimationController.shouldAnimate()) {
        // Mobile: simple on-enter reveals
        [labelRef.current, headEl, statsRef.current].filter(Boolean).forEach((el, i) => {
          gsap.from(el!, {
            opacity: 0, y: 20, duration: 0.65, delay: i * 0.1, ease: "power3.out",
            scrollTrigger: { trigger: el!, start: "top 85%", once: true },
          });
        });
        return;
      }

      // ── Copper hairline scaleX 0→1 ───────────────────────────────────────
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger, start: "top 80%", end: "top 50%", scrub: 1 },
        });
      }

      // ── Label fade ─────────────────────────────────────────────────────────
      if (labelRef.current) {
        gsap.fromTo(labelRef.current, { opacity: 0, y: 16 }, {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 72%", once: true },
        });
      }

      // ── Ghost watermark counter scrub: 0→150 (home page signature) ────────
      if (ghostRef.current) {
        const ghostObj = { val: 0 };
        const el = ghostRef.current;
        gsap.to(ghostObj, {
          val: 150,
          ease: "none",
          immediateRender: false,
          onUpdate: () => { const v = Math.round(ghostObj.val); if (v > 0) el.textContent = v + "+"; },
          scrollTrigger: { trigger, start: "top 85%", end: "bottom 10%", scrub: 1.2 },
        });
      }

      // ── Headline: SplitType chars scrub in (scrub-tied, not once-on-enter) ─
      if (headEl) {
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !headEl.isConnected) return;
          const split = new SplitType(headEl, { types: "chars" });
          localSplit = split;
          splitRef.current = split;
          if (split.chars?.length) {
            gsap.fromTo(
              split.chars,
              { yPercent: 105, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                stagger: { each: 0.022, from: "start" },
                ease: "none",
                scrollTrigger: {
                  trigger,
                  start: "top 72%",
                  end: "top 18%",
                  scrub: 1.2,
                },
              }
            );
          }
        });
      }

      // ── Stats: stagger scrub up ────────────────────────────────────────────
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll<HTMLElement>(".stat-item");
        gsap.fromTo(
          statEls,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: { each: 0.12 },
            ease: "none",
            scrollTrigger: { trigger, start: "top 50%", end: "top 15%", scrub: 1 },
          }
        );
      }
    }, sectionRef);

    ctxRef.current = ctx;

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (localSplit && headEl?.isConnected) { try { localSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="home-interstitial"
      className="relative overflow-hidden"
      style={{ minHeight: "75vh" }}
    >
      {/* Background — scaled tall for parallax travel */}
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{ top: "-10%", height: "120%", willChange: "transform" }}
        aria-hidden="true"
      >
        <Image
          src="/images/hero/patio-pool.jpg"
          alt=""
          fill
          className="object-cover"
          style={{ filter: "contrast(1.08) saturate(1.1) brightness(0.9)" }}
          sizes="100vw"
        />
      </div>

      {/* Layered gradients */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"
        aria-hidden="true"
      />

      {/* Ghost watermark — home page signature */}
      {/* Fix 4: JSX shows final value "150+" so the element is never blank.
          GSAP uses immediateRender:false to keep this until scroll fires. */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-numbers font-bold"
        style={{
          fontSize: "clamp(12rem, 28vw, 22rem)",
          color: "white",
          opacity: 0.045,
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        150+
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[75vh] px-6 lg:px-12 py-28">

        <div
          ref={labelRef}
          className="font-labels text-[10px] text-white/45 tracking-[0.3em] uppercase mb-6"
        >
          South Bay · Torrance CA · Since 2004
        </div>

        {/* Copper hairline */}
        <div
          ref={hairlineRef}
          style={{
            height: 1,
            width: "clamp(3rem, 8vw, 7rem)",
            background: "#B87333",
            opacity: 0.6,
            transformOrigin: "left",
            marginBottom: "2rem",
          }}
        />

        <h2
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.88] mb-16"
          style={{ fontSize: "clamp(3.2rem, 8.5vw, 8rem)" }}
        >
          <span className="block">Executed.</span>
          <span className="block" style={{ color: "rgba(255,255,255,0.55)" }}>
            Not estimated.
          </span>
        </h2>

        {/* Divider */}
        <div
          style={{ height: 1, width: "100%", maxWidth: 480, background: "rgba(184,115,51,0.2)", marginBottom: "2.5rem" }}
          aria-hidden="true"
        />

        {/* Stats */}
        <div ref={statsRef} className="flex flex-col sm:flex-row items-center gap-10 sm:gap-16 lg:gap-20">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="stat-item text-center">
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2"
                  style={{ width: 1, height: 36, background: "rgba(255,255,255,0.12)" }}
                />
              )}
              <div className="font-numbers font-bold text-white leading-none mb-1" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                {stat.value}
              </div>
              <div className="font-labels text-[10px] text-white/40 tracking-[0.2em] uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
