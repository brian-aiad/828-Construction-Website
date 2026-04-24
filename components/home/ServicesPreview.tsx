"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// ─── Service data ────────────────────────────────────────────────────────────

const services = [
  {
    num: "01",
    slug: "adu",
    heading: "ADU Construction",
    tagline:
      "Built for added space that actually performs. Every ADU starts with a site walk, a scope document, and a clear permit path.",
    keywords: ["Permitting", "Layout logic", "Full build"],
    image: "/images/projects/service-adu.jpg",
    imageAlt: "ADU Construction — 828 Construction Torrance CA",
    // image-left = image on left desktop, image on top mobile
    imageLeft: true,
    minHeight: "100vh",
  },
  {
    num: "02",
    slug: "remediation",
    heading: "Remediation",
    tagline:
      "Fix the cause. Not just the visible symptom. Water intrusion and structural failure have root causes — we find and solve them permanently.",
    keywords: ["Water intrusion", "Structural repair", "Failure diagnosis"],
    image: "/images/projects/remediation-after.jpg",
    imageAlt: "Remediation — 828 Construction Torrance CA",
    // image-right = image on right desktop, image on top mobile
    imageLeft: false,
    minHeight: "100vh",
  },
  {
    num: "03",
    slug: "consulting",
    heading: "Consulting",
    tagline:
      "Get clarity before you commit money. Pre-purchase reviews and scope analysis so you know exactly what you're getting into.",
    keywords: ["Pre-purchase review", "Scope analysis", "Owner guidance"],
    image: "/images/projects/consulting-plans.jpg",
    imageAlt: "Consulting — 828 Construction Torrance CA",
    imageLeft: true,
    minHeight: "75vh",
  },
];

// ─── Single service row ───────────────────────────────────────────────────────

function ServiceRow({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imagePaneRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!rowRef.current || !imagePaneRef.current || !textRef.current) return;

    // Hover handlers defined outside ctx so they can be removed in cleanup
    const imgEl = imgRef.current?.querySelector<HTMLImageElement>("img");
    const onEnter = () => {
      if (imgEl) gsap.to(imgEl, { filter: "contrast(1.1) saturate(1.25) brightness(1.02)", scale: 1.03, duration: 0.5, ease: "power2.out" });
    };
    const onLeave = () => {
      if (imgEl) gsap.to(imgEl, { filter: "contrast(1.06) saturate(1.1)", scale: 1, duration: 0.5, ease: "power2.out" });
    };
    const supportsHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
    if (supportsHover && rowRef.current) {
      rowRef.current.addEventListener("mouseenter", onEnter);
      rowRef.current.addEventListener("mouseleave", onLeave);
    }

    const ctx = gsap.context(() => {
      const trigger = rowRef.current!;

      // Fix 14: set GSAP initial state before the shouldAnimate gate
      const revealNum = textRef.current!.querySelector<HTMLElement>(".reveal-num");
      if (revealNum) gsap.set(revealNum, { opacity: 0 });

      if (!AnimationController.shouldAnimate()) {
        // Mobile: simple on-enter reveals, no clip/scrub
        // reveal-num stays hidden on mobile (decorative chapter number, not needed on small screens)
        const textEls = textRef.current!.querySelectorAll<HTMLElement>(
          ".reveal-heading, .reveal-tagline, .reveal-tag, .reveal-cta"
        );
        textEls.forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: 20, duration: 0.65, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        return;
      }

      // 1. Image pane clip-path reveal (from outside edge inward)
      const clipFrom = service.imageLeft
        ? "inset(0% 100% 0% 0%)"
        : "inset(0% 0% 0% 100%)";

      gsap.fromTo(
        imagePaneRef.current,
        { clipPath: clipFrom },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          ease: "power3.inOut",
          scrollTrigger: { trigger, start: "top 68%", once: true },
        }
      );

      // 2. Image parallax — scrub -12%
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      // 3. Fix 16: Text panel — scrub-tied reveal (not once-time)
      const textEls = textRef.current!.querySelectorAll<HTMLElement>(
        ".reveal-num, .reveal-heading, .reveal-tagline, .reveal-tag, .reveal-cta"
      );

      gsap.fromTo(
        textEls,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: { each: 0.06, from: "start" },
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger, start: "top 72%", end: "top 32%", scrub: 1.1 },
        }
      );

      // 4. Copper vertical seam grows from 0 → full
      if (seamRef.current) {
        gsap.fromTo(
          seamRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.9,
            delay: 0.45,
            ease: "power2.inOut",
            transformOrigin: "top",
            scrollTrigger: { trigger, start: "top 68%", once: true },
          }
        );
      }
    }, rowRef);

    ctxRef.current = ctx;

    return () => {
      if (supportsHover && rowRef.current) {
        rowRef.current.removeEventListener("mouseenter", onEnter);
        rowRef.current.removeEventListener("mouseleave", onLeave);
      }
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, [service.imageLeft]);

  const imagePart = (
    <div
      className="relative overflow-hidden flex-shrink-0 w-full md:w-1/2 lg:w-[58%]"
      style={{ minHeight: "clamp(320px, 55vw, 700px)" }}
    >
      {/* Clipping wrapper — clip-path animates on this */}
      <div ref={imagePaneRef} className="absolute inset-0" data-gsap-reveal="true">
        {/* Parallax wrapper: 115% tall, offset -7.5% top, GSAP moves this */}
        <div
          ref={imgRef as React.RefObject<HTMLDivElement>}
          className="absolute left-0 right-0"
          style={{ top: "-7.5%", height: "115%" }}
        >
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            className="object-cover"
            style={{ filter: "contrast(1.06) saturate(1.1)" }}
            sizes="(max-width: 768px) 100vw, 58vw"
          />
        </div>
        {/* Gradient toward the text side */}
        <div
          className="absolute inset-0"
          style={{
            background: service.imageLeft
              ? "linear-gradient(to right, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)"
              : "linear-gradient(to left, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* Ghost number inside image pane — aria-hidden: purely decorative */}
      <div
        aria-hidden="true"
        className="absolute z-10 pointer-events-none select-none font-numbers font-bold leading-none"
        style={{
          fontSize: "clamp(6rem, 10vw, 9rem)",
          color: "#B87333",
          opacity: 0.08,
          bottom: 28,
          ...(service.imageLeft ? { right: 32 } : { left: 32 }),
        }}
      >
        {service.num}
      </div>

      {/* Copper vertical seam — positioned at the inner edge */}
      <div
        ref={seamRef}
        className="absolute top-[15%] z-20 pointer-events-none"
        style={{
          [service.imageLeft ? "right" : "left"]: 0,
          width: 2,
          height: "70%",
          background:
            "linear-gradient(to bottom, transparent 0%, #B87333 20%, #B87333 80%, transparent 100%)",
          opacity: 0.5,
          transformOrigin: "top",
        }}
      />
    </div>
  );

  const textPart = (
    <div
      ref={textRef}
      className="svc-text-panel flex flex-col justify-center flex-1 bg-black px-8 py-16 md:px-10 lg:px-16 xl:px-20 relative overflow-hidden"
      data-num={service.num}
    >
      {/* Chapter number */}
      <div
        className="reveal-num font-numbers font-bold leading-none mb-6 select-none"
        aria-hidden="true"
        style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", color: "#B87333" }}
      >
        {service.num}
      </div>

      {/* Heading */}
      <h3
        className="reveal-heading font-display font-bold text-white tracking-tight leading-[0.95] mb-5"
        style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)" }}
      >
        {service.heading}
      </h3>

      {/* Tagline */}
      <p className="reveal-tagline text-white/50 leading-relaxed mb-8 max-w-xs" style={{ fontSize: 15 }}>
        {service.tagline}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {service.keywords.map((kw) => (
          <span
            key={kw}
            className="reveal-tag font-labels text-[9px] text-white/60 tracking-[0.14em] uppercase border border-white/20 px-3 py-1"
          >
            {kw}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={`/services/${service.slug}`}
        className="reveal-cta group inline-flex items-center gap-3 font-labels text-[11px] text-white/50 tracking-[0.18em] uppercase border-b border-white/15 pb-1 self-start hover:text-[#B87333] hover:border-[#B87333] transition-colors duration-300"
      >
        Learn about {service.heading}
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );

  return (
    <div
      ref={rowRef}
      className={`flex flex-col ${service.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} w-full`}
      style={{ minHeight: service.minHeight }}
      data-service={service.slug}
    >
      {/* Always image first in DOM (top on mobile) */}
      {imagePart}
      {textPart}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ServicesPreview() {
  const headerRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const labelEls = headerRef.current?.querySelectorAll<HTMLElement>(".hdr-label, .hdr-link");
      const hlLines = headerRef.current?.querySelectorAll<HTMLElement>(".hdr-line");

      if (!AnimationController.shouldAnimate()) {
        // Mobile: simple reveals
        const allEls = headerRef.current?.querySelectorAll<HTMLElement>(".hdr-label, .hdr-line, .hdr-link");
        if (allEls?.length) {
          allEls.forEach((el) => {
            gsap.from(el, {
              opacity: 0, y: 20, duration: 0.65, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          });
        }
        return;
      }

      // Label + link: fade up
      if (labelEls?.length) {
        gsap.fromTo(labelEls, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 82%", once: true },
        });
      }

      // Headline lines: Pattern C clip-from-below reveal
      if (hlLines?.length) {
        gsap.fromTo(hlLines, { yPercent: 110 }, {
          yPercent: 0, duration: 0.75, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 82%", once: true },
        });
      }

      if (seamRef.current) {
        gsap.fromTo(seamRef.current, { scaleX: 0 }, {
          scaleX: 1, duration: 0.85, ease: "power2.inOut", transformOrigin: "left",
          scrollTrigger: { trigger: headerRef.current, start: "top 82%", once: true },
        });
      }
    });

    ctxRef.current = ctx;

    return () => {
      ctxRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      data-testid="services-section"
      data-section="services"
      className="bg-black overflow-hidden"
    >
      {/* Section header — constrained */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-8 lg:pt-32 lg:pb-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="hdr-label font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-4">
              Services
            </span>
            <h2
              className="svc-headline font-display font-bold text-white tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              <span className="block overflow-hidden">
                <span className="hdr-line block">Three services.</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hdr-line block" style={{ color: "rgba(255,255,255,0.40)" }}>
                  One standard.
                </span>
              </span>
            </h2>
          </div>
          <Link
            href="/services"
            className="hdr-link font-labels text-[11px] text-gray-400 tracking-[0.18em] uppercase hover:text-[#B87333] transition-colors duration-200 group inline-flex items-center gap-2 self-start border-b border-transparent hover:border-[#B87333] pb-0.5 flex-shrink-0"
          >
            All Services
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* Copper seam — full-bleed */}
      <div
        ref={seamRef}
        style={{ height: 1, background: "#B87333", opacity: 0.5 }}
      />

      {/* Editorial alternating rows — full-width, no container */}
      <div>
        {services.map((service, i) => (
          <div key={service.slug}>
            <ServiceRow service={service} index={i} />
            {/* Inter-row copper hairline (not after last row) */}
            {i < services.length - 1 && (
              <div style={{ height: 1, background: "rgba(184,115,51,0.2)" }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
