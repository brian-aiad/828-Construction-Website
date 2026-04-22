"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// Three preview projects: featured + two secondaries + one wide bottom
const [featured, secondary1, secondary2, wide] = PROJECTS;

export default function ProjectsPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      // Fix 14: set initial states via gsap.set — never hardcode in JSX
      trigger.querySelectorAll<HTMLElement>(".copper-bar").forEach((bar) => {
        gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
      });

      if (!AnimationController.shouldAnimate()) {
        // Mobile: simple on-enter reveals
        const mobileEls = trigger.querySelectorAll<HTMLElement>(
          ".proj-label, .proj-headline, .proj-counter, .proj-card"
        );
        mobileEls.forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 24, duration: 0.65, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        return;
      }

      const triggerStart = "top 78%";

      // ── Section header: label + headline clip reveal ─────────────────────
      const label = trigger.querySelector<HTMLElement>(".proj-label");
      const headline = trigger.querySelector<HTMLElement>(".proj-headline");
      const counter = trigger.querySelector<HTMLElement>(".proj-counter");

      if (label) {
        gsap.fromTo(label, { yPercent: 110 }, {
          yPercent: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger, start: triggerStart, once: true },
        });
      }
      if (headline) {
        gsap.fromTo(headline, { yPercent: 110 }, {
          yPercent: 0, duration: 0.85, delay: 0.08, ease: "power3.out",
          scrollTrigger: { trigger, start: triggerStart, once: true },
        });
      }
      if (counter) {
        gsap.fromTo(counter, { opacity: 0, y: 16 }, {
          opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out",
          scrollTrigger: { trigger, start: triggerStart, once: true },
        });
      }

      // ── Copper hairline scaleX 0→1 ───────────────────────────────────────
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, duration: 0.9, ease: "power2.inOut", transformOrigin: "left",
          scrollTrigger: { trigger: hairlineRef.current, start: "top 88%", once: true },
        });
      }

      // ── Cards: Olson Kundig punch-in clip-path + stagger ─────────────────
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>(".proj-card");
        gsap.fromTo(
          cards,
          { clipPath: "inset(8% 8% 8% 8%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.05,
            stagger: { each: 0.12, from: "start" },
            ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 82%", once: true },
          }
        );

        // ── Parallax scrub on each image ────────────────────────────────────
        cards.forEach((card) => {
          const imgWrap = card.querySelector<HTMLElement>(".parallax-img-inner");
          if (!imgWrap) return;
          gsap.to(imgWrap, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          });
        });

        // ── Hover: image saturation + copper border ──────────────────────────
        cards.forEach((card) => {
          const img = card.querySelector<HTMLImageElement>("img");
          const copperBar = card.querySelector<HTMLElement>(".copper-bar");

          card.addEventListener("mouseenter", () => {
            if (img) gsap.to(img, { filter: "contrast(1.1) saturate(1.3)", scale: 1.03, duration: 0.45, ease: "power2.out" });
            if (copperBar) gsap.to(copperBar, { scaleX: 1, duration: 0.3, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => {
            if (img) gsap.to(img, { filter: "contrast(1.06) saturate(1.1)", scale: 1, duration: 0.45, ease: "power2.out" });
            if (copperBar) gsap.to(copperBar, { scaleX: 0, duration: 0.3, ease: "power2.in" });
          });
        });
      }
    }, sectionRef);

    ctxRef.current = ctx;

    return () => {
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="projects"
      className="bg-[#0a0a0a] py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-0">
          <div>
            <div className="overflow-hidden mb-3">
              <span className="proj-label font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block">
                Selected Work
              </span>
            </div>
            <div className="overflow-hidden">
              <h2
                className="proj-headline font-display font-bold text-white tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)" }}
              >
                Proof of Craft.
              </h2>
            </div>
          </div>
          <Link
            href="/projects"
            className="proj-counter group inline-flex items-center gap-2 font-labels text-[11px] text-gray-400 tracking-[0.18em] uppercase hover:text-[#B87333] transition-colors duration-200 border-b border-transparent hover:border-[#B87333] pb-0.5 flex-shrink-0 self-start mt-2"
          >
            All Projects
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Copper hairline — scaleX 0→1 */}
        <div
          ref={hairlineRef}
          className="mt-8 mb-1"
          style={{ height: 1, background: "#B87333", opacity: 0.45, transformOrigin: "left" }}
        />

        {/* Grid — mobile: single column stack · desktop: asymmetric 12-col editorial */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-[2px] md:gap-[3px]"
        >
          {/* Featured — mobile: full width · desktop: col 1-8, row 1-2 */}
          {featured && (
            <div className="proj-card relative overflow-hidden md:[grid-column:1/9] md:[grid-row:1/3]">
              <Link
                href="/projects"
                className="group block relative overflow-hidden bg-[#111]"
                style={{ height: "clamp(240px, 42vw, 570px)" }}
              >
                <div className="parallax-img-inner absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
                  <ImageWithFallback
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    className="object-cover"
                    style={{ filter: "contrast(1.06) saturate(1.1)" }}
                    sizes="(max-width: 768px) 100vw, 66vw"
                    fallback={<div className="absolute inset-0 bg-[#1a1a1a]" />}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                  <span className="font-labels text-[9px] text-white/50 tracking-[0.2em] uppercase block mb-2">
                    {featured.category} · {featured.location}
                  </span>
                  <h3
                    className="font-display font-bold text-white leading-tight tracking-tight mb-2"
                    style={{ fontSize: "clamp(1.3rem, 2.8vw, 2.4rem)" }}
                  >
                    {featured.title}
                  </h3>
                  <p className="font-labels text-[9px] text-white/40 tracking-wide hidden md:block">{featured.spec}</p>
                </div>
                <div className="copper-bar absolute bottom-0 left-0 right-0" style={{ height: 2, background: "#B87333", transformOrigin: "left" }} />
              </Link>
            </div>
          )}

          {/* Secondary 1 — mobile: full width · desktop: col 9-12 row 1 */}
          {secondary1 && (
            <div className="proj-card relative overflow-hidden md:[grid-column:9/13] md:[grid-row:1]">
              <Link
                href="/projects"
                className="group block relative overflow-hidden bg-[#111]"
                style={{ height: "clamp(200px, 20.5vw, 282px)" }}
              >
                <div className="parallax-img-inner absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
                  <ImageWithFallback
                    src={secondary1.image}
                    alt={secondary1.title}
                    fill
                    className="object-cover"
                    style={{ filter: "contrast(1.05) saturate(1.08)" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallback={<div className="absolute inset-0 bg-[#1a1a1a]" />}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="font-labels text-[9px] text-white/45 tracking-[0.18em] uppercase block mb-1">{secondary1.category}</span>
                  <h3 className="font-display font-bold text-white text-base leading-tight">{secondary1.title}</h3>
                </div>
                <div className="copper-bar absolute bottom-0 left-0 right-0" style={{ height: 2, background: "#B87333", transformOrigin: "left" }} />
              </Link>
            </div>
          )}

          {/* Secondary 2 — mobile: full width · desktop: col 9-12 row 2 */}
          {secondary2 && (
            <div className="proj-card relative overflow-hidden md:[grid-column:9/13] md:[grid-row:2]">
              <Link
                href="/projects"
                className="group block relative overflow-hidden bg-[#111]"
                style={{ height: "clamp(200px, 20.5vw, 282px)" }}
              >
                <div className="parallax-img-inner absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
                  <ImageWithFallback
                    src={secondary2.image}
                    alt={secondary2.title}
                    fill
                    className="object-cover"
                    style={{ filter: "contrast(1.05) saturate(1.08)" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallback={<div className="absolute inset-0 bg-[#1a1a1a]" />}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="font-labels text-[9px] text-white/45 tracking-[0.18em] uppercase block mb-1">{secondary2.category}</span>
                  <h3 className="font-display font-bold text-white text-base leading-tight">{secondary2.title}</h3>
                  <p className="font-labels text-[9px] text-white/35 tracking-wide mt-1">{secondary2.location}</p>
                </div>
                <div className="copper-bar absolute bottom-0 left-0 right-0" style={{ height: 2, background: "#B87333", transformOrigin: "left" }} />
              </Link>
            </div>
          )}

          {/* Inter-row copper hairline */}
          <div className="col-span-full" style={{ height: 1, background: "rgba(184,115,51,0.18)" }} />

          {/* Wide bottom — full width both viewports */}
          {wide && (
            <div className="proj-card col-span-full relative overflow-hidden">
              <Link
                href="/projects"
                className="group block relative overflow-hidden bg-[#111]"
                style={{ height: "clamp(180px, 22vw, 295px)" }}
              >
                <div className="parallax-img-inner absolute inset-x-0" style={{ top: "-7.5%", height: "115%" }}>
                  <ImageWithFallback
                    src={wide.image}
                    alt={wide.title}
                    fill
                    className="object-cover"
                    style={{ filter: "contrast(1.05) saturate(1.08)" }}
                    sizes="100vw"
                    fallback={<div className="absolute inset-0 bg-[#1a1a1a]" />}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-10">
                  <span className="font-labels text-[9px] text-white/45 tracking-[0.18em] uppercase mb-2">{wide.category} · {wide.location}</span>
                  <h3 className="font-display font-bold text-white leading-tight tracking-tight" style={{ fontSize: "clamp(1.2rem, 2.5vw, 2rem)" }}>
                    {wide.title}
                  </h3>
                </div>
                <div className="copper-bar absolute bottom-0 left-0 right-0" style={{ height: 2, background: "#B87333", transformOrigin: "left" }} />
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
