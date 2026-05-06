"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { FOUNDING_YEAR } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { ConstructionLineSilhouette } from "@/components/system/silhouettes";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

// V3 About Preview — SplitType char clip-reveal on headline + ConstructionLineSilhouette backdrop.
// Glass/depth overlay per PATTERNS.md to prevent flat look.
// Pulls from FOUNDING_YEAR constant (2004 — never hardcoded).

export default function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const silhouetteParallaxRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const splitFrameRef = useRef(-1);
  const ctaMagRef = useMagnetic(0.45) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Set initial states (Fix 14)
      const textEls = textRefs.current.filter(Boolean) as HTMLElement[];
      // Exclude headline (index 1) from generic stagger — handled by SplitType below
      const nonHeadlineEls = textEls.filter((_, i) => i !== 1);
      gsap.set(nonHeadlineEls, { y: 24, opacity: 0 });
      if (imgRef.current) gsap.set(imgRef.current, { clipPath: "inset(8% 0 8% 0)" });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(textEls, { y: 0, opacity: 1 });
        if (imgRef.current) gsap.set(imgRef.current, { clipPath: "inset(0%)" });
        return;
      }

      // Image clip-path reveal
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          clipPath: "inset(0%)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
      }

      // Text reveals scrub-tied per element (non-headline)
      nonHeadlineEls.forEach((el, i) => {
        gsap.to(el, {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 55%",
            scrub: 1.1,
          },
          delay: i * 0.08,
        });
      });

      // Headline SplitType char clip-reveal (curtain wipe, not fade)
      const headlineEl = textRefs.current[1] as HTMLHeadingElement | null;
      if (headlineEl) {
        splitFrameRef.current = requestAnimationFrame(() => {
          if (!headlineEl.isConnected) return;
          splitRef.current = new SplitType(headlineEl, { types: "chars,words" });
          const chars = splitRef.current.chars ?? [];
          gsap.fromTo(chars,
            { clipPath: "inset(0 100% 0 0)", x: 12 },
            {
              clipPath: "inset(0 0% 0 0)",
              x: 0,
              stagger: 0.022,
              duration: 0.85,
              ease: "power4.out",
              scrollTrigger: { trigger: headlineEl, start: "top 80%", once: true },
            }
          );
          gsap.set(headlineEl, { opacity: 1 });
        });
      }

      // Silhouette parallax
      if (silhouetteParallaxRef.current) {
        gsap.to(silhouetteParallaxRef.current, {
          yPercent: -40,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }
    }, sectionRef);

    return () => {
      cancelAnimationFrame(splitFrameRef.current);
      if (splitRef.current && textRefs.current[1]?.isConnected) {
        try { splitRef.current.revert(); } catch {}
      }
      splitRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] overflow-hidden"
      style={{ minHeight: "min(90vh, 700px)" }}
      data-section="about-preview"
    >
      {/* Glass/depth noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
          opacity: 0.03,
          mixBlendMode: "overlay",
        }}
      />

      {/* Architectural line silhouette — parallax depth */}
      <div
        ref={silhouetteParallaxRef}
        aria-hidden="true"
        className="absolute left-[-5%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
        style={{ width: "55%", opacity: 0.08, color: "white", zIndex: 1 }}
      >
        <ConstructionLineSilhouette style={{ width: "100%", height: "auto" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[min(90vh,700px)]">

          {/* Image side */}
          <div
            ref={imgRef}
            className="relative overflow-hidden order-2 lg:order-1"
            style={{ aspectRatio: "4/3", clipPath: "inset(0%)" }}
            data-gsap-reveal="true"
          >
            <Image
              src="/images/about/craftsmanship.jpg"
              alt="828 Construction — craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{ filter: "contrast(1.05) saturate(1.08)" }}
            />
            {/* Est. badge */}
            <div
              className="absolute top-4 right-4 px-3 py-1.5"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.6)" }}
            >
              <span className="font-labels text-[8px] text-white/50 tracking-[0.22em] uppercase">
                Est. {FOUNDING_YEAR}
              </span>
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">
            <p
              ref={(el) => { textRefs.current[0] = el; }}
              className="font-labels text-[10px] tracking-[0.25em] uppercase mb-6"
              style={{ color: "var(--color-accent)", opacity: 0 }}
            >
              Our story
            </p>

            <h2
              ref={(el) => { textRefs.current[1] = el as HTMLElement; }}
              className="font-display font-normal text-white leading-tight mb-6"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", opacity: 0 }}
            >
              Two decades building what others overlook.
            </h2>

            <p
              ref={(el) => { textRefs.current[2] = el; }}
              className="font-body text-white/55 leading-relaxed mb-8"
              style={{ fontSize: "clamp(0.9rem, 1.3vw, 1rem)", opacity: 0, maxWidth: "42ch" }}
            >
              Founded in {FOUNDING_YEAR}, 828 Construction is guided by a founder with over
              two decades of hands-on residential construction experience — built working
              directly alongside skilled tradesmen. That knowledge shapes every decision,
              from structural integrity to refined finishing details.
            </p>

            {/* Maroon hairline */}
            <div
              ref={(el) => { textRefs.current[3] = el; }}
              style={{ height: 1, background: "var(--color-accent)", opacity: 0.4, width: 48, marginBottom: "2rem" }}
              aria-hidden="true"
            />

            {/* Magnetic CTA wrapper */}
            <div ref={ctaMagRef} style={{ display: "inline-block", alignSelf: "flex-start" }}>
              <Link
                ref={(el) => { textRefs.current[4] = el as HTMLAnchorElement; }}
                href="/about"
                className="cta-pulse inline-flex items-center gap-2 font-labels text-[11px] text-white/50 tracking-[0.18em] uppercase hover:text-white transition-colors group border-b border-white/15 hover:border-white/40 pb-1"
                style={{ opacity: 0 }}
              >
                Learn more
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
