"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCE_SINCE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { ConstructionLineSilhouette } from "@/components/system/silhouettes";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const silhouetteParallaxRef = useRef<HTMLDivElement>(null);
  const ctaMagRef = useMagnetic(0.45) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const headlineEl = textRefs.current[0] as HTMLHeadingElement | null;

    const ctx = gsap.context(() => {
      const textEls = textRefs.current.filter(Boolean) as HTMLElement[];
      const nonHeadlineEls = textEls.filter((_, i) => i !== 0);
      gsap.set(nonHeadlineEls, { y: 24, opacity: 0 });
      if (headlineEl) gsap.set(headlineEl, { y: 34, opacity: 0, clipPath: "inset(0 0 18% 0)" });
      if (imgRef.current) gsap.set(imgRef.current, { clipPath: "inset(8% 8% 8% 0)" });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(textEls, { y: 0, opacity: 1, clipPath: "inset(0%)" });
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

      nonHeadlineEls.forEach((el, i) => {
        gsap.to(el, {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 62%",
            scrub: 1.1,
          },
          delay: i * 0.08,
        });
      });

      if (headlineEl) {
        gsap.to(headlineEl, {
          y: 0,
          opacity: 1,
          clipPath: "inset(0%)",
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: headlineEl, start: "top 82%", once: true },
        });
      }

      if (imgInnerRef.current) {
        gsap.to(imgInnerRef.current, {
          yPercent: -8,
          scale: 1.04,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.35 },
        });
      }

      if (silhouetteParallaxRef.current) {
        gsap.to(silhouetteParallaxRef.current, {
          yPercent: -24,
          rotate: 1.5,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      }
    }, sectionRef);

    return () => {
      try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] text-white"
      style={{ minHeight: "min(100vh, 820px)" }}
      data-section="about-preview"
    >
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

      <div
        ref={silhouetteParallaxRef}
        aria-hidden="true"
        className="pointer-events-none absolute -right-[14%] top-[6%] hidden lg:block"
        style={{ width: "44rem", opacity: 0.045, color: "white", zIndex: 1 }}
      >
        <ConstructionLineSilhouette style={{ width: "100%", height: "auto" }} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden h-px w-[42vw] origin-left bg-[var(--color-accent)]/55 lg:block"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid min-h-[min(82vh,720px)] grid-cols-1 items-center gap-12 lg:grid-cols-[0.72fr_1fr] lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div
              ref={imgRef}
              className="relative min-h-[24rem] overflow-hidden border border-white/10 bg-white/[0.025] md:min-h-[34rem] lg:-ml-12 lg:min-h-[42rem]"
              style={{ clipPath: "inset(0%)" }}
              data-gsap-reveal="true"
            >
              <div ref={imgInnerRef} className="absolute inset-0">
                <Image
                  src="/images/generated/home-about-story-editorial.webp"
                  alt="Architectural plans and finish samples on a residential construction worktable"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                  style={{
                    filter: "contrast(1.04) saturate(0.96) brightness(0.94)",
                    objectPosition: "42% center",
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 h-px w-2/5 bg-[var(--color-accent)]" aria-hidden="true" />
              <div className="absolute left-5 top-5 border border-white/10 bg-black/56 px-3 py-2 backdrop-blur-sm md:left-7 md:top-7">
                <span className="font-labels text-[8px] uppercase tracking-[0.22em] text-white/48">
                  Since {EXPERIENCE_SINCE}
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 flex flex-col justify-center lg:order-2 lg:pl-4">
            <h2
              ref={(el) => { textRefs.current[0] = el as HTMLElement; }}
              className="max-w-[10ch] font-editorial text-[clamp(3.2rem,6vw,6.8rem)] font-semibold leading-[0.86] text-white"
              style={{ opacity: 0 }}
            >
              Refining industry standards.
            </h2>

            <p
              ref={(el) => { textRefs.current[1] = el; }}
              className="mt-7 max-w-xl text-base leading-8 text-white/68 lg:ml-16 lg:text-lg lg:leading-9"
              style={{ opacity: 0 }}
            >
              With more than 20 years of experience across multiple construction trades, 828 Construction brings a comprehensive understanding of the building process. Our mission is to make every project as seamless, effective, and stress-free as possible.
            </p>

            <div
              ref={(el) => { textRefs.current[2] = el; }}
              className="mt-7 h-px w-16 bg-[var(--color-accent)]"
              style={{ opacity: 0.55 }}
              aria-hidden="true"
            />

            <div
              ref={ctaMagRef}
              className="mt-7"
              style={{ display: "inline-block", alignSelf: "flex-start" }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
