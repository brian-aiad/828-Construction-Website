"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { ArchOutlineSilhouette } from "@/components/system/silhouettes";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

// V3 hero: mesh gradient idle drift + silhouette 65vw/0.55 + aggressive parallax.
// Headline fires on page load (delay 0.6s) with rotateX channel + scroll fade-out.

export default function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const silhouetteRef = useRef<HTMLDivElement>(null);
  const copyBlockRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const splitFrameRef = useRef(-1);
  const magneticRef = useMagnetic(0.55) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    let mounted = true;
    const section = sectionRef.current;
    if (!section) return;

    // Mesh gradient idle drift — runs always, regardless of shouldAnimate
    const meshTl = gsap.timeline({ repeat: -1, yoyo: true });
    meshTl.to(document.documentElement, {
      duration: 14,
      ease: "sine.inOut",
      "--mesh-x-1": "60%",
      "--mesh-y-1": "70%",
      "--mesh-x-2": "30%",
      "--mesh-y-2": "20%",
      "--mesh-x-3": "80%",
      "--mesh-y-3": "40%",
    });

    const ctx = gsap.context(() => {
      // Set initial GSAP states here — never in JSX (Fix 14)
      if (imgInnerRef.current) {
        gsap.set(imgInnerRef.current, { scale: 1 });
      }

      if (!AnimationController.shouldAnimate()) {
        // Mobile: immediate reveals, no scroll hooks
        if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
        if (subRef.current) gsap.set(subRef.current, { opacity: 1, y: 0 });
        if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Desktop: image scale-through-scroll (1.0 → 1.10)
      if (imgInnerRef.current) {
        gsap.to(imgInnerRef.current, {
          scale: 1.10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Floating silhouette parallax — 85% aggressive travel
      if (silhouetteRef.current) {
        gsap.to(silhouetteRef.current, {
          yPercent: -85,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
        // Idle float animation
        gsap.to(silhouetteRef.current, {
          yPercent: 8,
          duration: 4.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // Copy block aggressive parallax -20%
      if (copyBlockRef.current) {
        gsap.to(copyBlockRef.current, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.0,
          },
        });
      }

      // Eyebrow + sub + CTA: stagger reveal on scroll enter
      const revealEls = [eyebrowRef.current, subRef.current, ctaRef.current].filter(Boolean) as HTMLElement[];
      gsap.fromTo(revealEls,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.12,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        }
      );

      // Headline: fires on page load (delay 0.6s to clear splash exit) with rotateX channel
      if (headlineRef.current) {
        splitFrameRef.current = requestAnimationFrame(() => {
          if (!mounted || !headlineRef.current?.isConnected) return;
          splitRef.current = new SplitType(headlineRef.current!, { types: "words,chars" });
          const chars = splitRef.current.chars ?? [];
          if (chars.length) {
            // Entry on load
            gsap.fromTo(chars,
              { yPercent: 110, opacity: 0, rotateX: 50 },
              {
                yPercent: 0, opacity: 1, rotateX: 0,
                stagger: 0.024,
                duration: 1.1,
                ease: "power3.out",
                delay: 0.6,
                onStart: () => {
                  if (headlineRef.current) headlineRef.current.style.opacity = "1";
                },
              }
            );
          }
        });

        // Scroll fade-out — headline lifts as user scrolls past
        gsap.to(headlineRef.current, {
          opacity: 0,
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "60% top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => {
      mounted = false;
      meshTl.kill();
      cancelAnimationFrame(splitFrameRef.current);
      if (splitRef.current && headlineRef.current?.isConnected) {
        try { splitRef.current.revert(); } catch {}
      }
      splitRef.current = null;
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen grid grid-cols-1 lg:grid-cols-[3fr_2fr] overflow-hidden bg-black"
      aria-label="Hero"
    >
      {/* Animated mesh gradient — idle motion, maroon/copper blobs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          opacity: 0.45,
          mixBlendMode: "soft-light" as const,
          background: `
            radial-gradient(800px at var(--mesh-x-1, 20%) var(--mesh-y-1, 30%), rgba(123,45,38,0.65), transparent 60%),
            radial-gradient(700px at var(--mesh-x-2, 70%) var(--mesh-y-2, 70%), rgba(184,115,51,0.4), transparent 55%),
            radial-gradient(900px at var(--mesh-x-3, 50%) var(--mesh-y-3, 50%), rgba(255,255,255,0.07), transparent 65%)
          `,
        }}
      />

      {/* Photo side — 60% width, full height */}
      <div className="relative overflow-hidden order-2 lg:order-1 min-h-[50vh] lg:min-h-screen">
        {/* Image wrapper — tall for parallax travel budget */}
        <div
          ref={imgInnerRef}
          className="absolute inset-0"
          style={{ willChange: "transform" }}
          aria-hidden="true"
        >
          <Image
            src="/images/hero/patio-pool.jpg"
            alt="828 Construction — premium residential construction"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            style={{ filter: "contrast(1.05) saturate(1.1)" }}
          />
        </div>

        {/* Gradient overlay on photo — lighter than V1, preserves photo quality */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60 lg:block hidden"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden"
          aria-hidden="true"
        />

        {/* Floating architectural silhouette — parallax depth layer, 65vw */}
        <div
          ref={silhouetteRef}
          aria-hidden="true"
          className="absolute pointer-events-none hidden lg:block"
          style={{
            width: "65vw",
            bottom: "-5%",
            right: "-8%",
            zIndex: 10,
            color: "white",
            opacity: 0.55,
            willChange: "transform",
          }}
        >
          <ArchOutlineSilhouette style={{ width: "100%", height: "auto" }} />
        </div>
      </div>

      {/* Copy side — 40% width, centered with intentional negative space */}
      <div className="relative flex flex-col justify-center px-8 lg:px-12 xl:px-16 py-20 lg:py-0 order-1 lg:order-2 z-10">
        <div ref={copyBlockRef} className="flex flex-col" style={{ willChange: "transform" }}>

        {/* Subtle maroon top hairline on copy side */}
        <div
          className="absolute top-0 left-0 right-0 lg:hidden"
          aria-hidden="true"
          style={{ height: 1, background: "var(--color-accent)", opacity: 0.4 }}
        />

        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="flex items-center gap-3 mb-8"
          style={{ opacity: 0 }}
        >
          <div
            aria-hidden="true"
            style={{ width: 24, height: 1, background: "var(--color-accent)" }}
          />
          <span className="font-labels text-[10px] text-white/50 tracking-[0.25em] uppercase">
            Torrance, CA — Est. 2004
          </span>
        </div>

        {/* Headline — bold display font with perspective for rotateX visibility */}
        {/* TODO: HERO_COPY_PENDING — final copy from Joe. Current: "Improving the unimproved." */}
        <h1
          ref={headlineRef}
          className="font-display font-bold leading-[0.92] tracking-tight text-white mb-8"
          style={{ fontSize: "clamp(2.8rem, 5vw, 4.8rem)", perspective: "1000px" }}
        >
          Improving the unimproved.
        </h1>

        {/* Sub-line */}
        <p
          ref={subRef}
          className="font-body text-white/55 leading-relaxed mb-10 max-w-xs"
          style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)", opacity: 0 }}
        >
          Residential construction for homeowners who refuse to compromise.
          ADU. Remediation. Consulting.
        </p>

        {/* CTA row — magnetic wrapper on primary button */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-start gap-4"
          style={{ opacity: 0 }}
        >
          <div ref={magneticRef} style={{ display: "inline-block" }}>
            <Link
              href="/services"
              className="btn-shine btn-lift inline-block bg-white text-black px-7 py-3 font-labels text-[10px] tracking-[0.18em] uppercase"
            >
              Explore Services
            </Link>
          </div>
          <Link
            href="/about"
            className="inline-block border border-white/25 text-white px-7 py-3 font-labels text-[10px] tracking-[0.18em] uppercase btn-outline-hover"
          >
            About 828
          </Link>
        </div>

        </div>{/* end copyBlockRef */}

        {/* Scroll indicator — bottom of copy side */}
        <div
          className="absolute bottom-8 left-8 lg:left-12 xl:left-16 flex items-center gap-3"
          aria-hidden="true"
        >
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.2)" }} />
          <span className="font-labels text-[8px] text-white/30 tracking-[0.22em] uppercase">
            Scroll
          </span>
        </div>
      </div>

      {/* Maroon top accent line (desktop full-width) */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        aria-hidden="true"
        style={{
          height: "2px",
          background: `linear-gradient(to right, transparent 5%, var(--color-accent) 35%, var(--color-accent) 65%, transparent 95%)`,
          opacity: 0.5,
        }}
      />
    </section>
  );
}
