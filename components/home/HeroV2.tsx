"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// NS-grammar hero: one full viewport, full-bleed photography, statement
// headline bottom-left, small mono metadata top/bottom corners. Motion is
// restrained — line mask reveal on load, image parallax scrub on scroll.

export default function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const licenseRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(".hero-line-inner");
      const support = section.querySelector<HTMLElement>(".hero-support");
      const metaEls = [
        eyebrowRef.current,
        support,
        ctaRef.current,
        licenseRef.current,
        scrollHintRef.current,
      ].filter(Boolean) as HTMLElement[];

      gsap.set(lines, { yPercent: 110 });
      gsap.set(metaEls, { y: 14, opacity: 0 });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(lines, { yPercent: 0 });
        gsap.set(metaEls, { y: 0, opacity: 1 });
        return;
      }

      // Entry — line-by-line mask reveal, then metadata
      gsap.to(lines, {
        yPercent: 0,
        duration: 0.95,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.15,
      });
      gsap.to(metaEls, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.55,
      });

      // Scroll — the hero is pinned (CSS sticky) beneath the page surface.
      // All scrub motion is driven by the covering surface's position so the
      // hero recedes (scale, dim, drift) as the light surface rides over it.
      const surface = document.querySelector<HTMLElement>("[data-editorial-flow]");
      const coverTrigger = surface
        ? { trigger: surface, start: "top bottom", end: "top top" }
        : { trigger: section, start: "top top", end: "bottom top" };

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1, yPercent: 0 },
          {
            scale: 1.1,
            yPercent: -4,
            ease: "none",
            scrollTrigger: { ...coverTrigger, scrub: 1 },
          }
        );
      }

      if (veilRef.current) {
        gsap.to(veilRef.current, {
          opacity: 0.55,
          ease: "none",
          scrollTrigger: { ...coverTrigger, scrub: 1 },
        });
      }

      if (copyRef.current) {
        gsap.to(copyRef.current, {
          yPercent: -16,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: { ...coverTrigger, scrub: 0.9 },
        });
      }

      if (scrollHintRef.current && surface) {
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: surface,
            start: "top 95%",
            end: "top 75%",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => {
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-header-dark=""
      className="sticky top-0 z-0 h-[100svh] overflow-hidden bg-black text-white"
      aria-label="828 Construction homepage hero"
    >
      <div ref={imageRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <Image
          src="/images/generated/home-hero-simple-adu-bluehour.jpg"
          alt="Modern ADU and outdoor living build at blue hour"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="hero-kenburns object-cover"
        />
      </div>

      {/* Single quiet veil — bottom-weighted so the photo stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.06) 38%, rgba(0,0,0,0.16) 62%, rgba(0,0,0,0.64) 100%)",
        }}
      />

      {/* Cover dim — darkens as the page surface rides over the pinned hero */}
      <div
        ref={veilRef}
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{ opacity: 0 }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-end px-6 pb-12 pt-28 lg:px-12 lg:pb-16">
        <div ref={copyRef} style={{ willChange: "transform, opacity" }}>
          <p
            ref={eyebrowRef}
            className="mb-6 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.26em] text-white/70 lg:mb-8"
          >
            <span
              aria-hidden="true"
              className="inline-block h-px w-10"
              style={{ background: "var(--color-accent-light)" }}
            />
            Torrance / South Bay
          </p>

          {/* One flowing statement, organized as a single readable block —
              lead sentence, quiet support line, then the CTA */}
          <div className="max-w-[46rem]">
            <h1
              ref={headlineRef}
              className="font-editorial text-[clamp(1.8rem,2.95vw,2.95rem)] font-normal leading-[1.18] tracking-[-0.01em] text-white"
            >
              <span className="block overflow-hidden">
                <span className="hero-line-inner block">
                  Transforming properties, delivering solutions.
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line-inner block text-white/62">
                  828 Construction is the partner of choice for your next
                  project.
                </span>
              </span>
            </h1>

            <div ref={ctaRef} className="mt-8">
              <Link
                href="/contact"
                className="btn-shine btn-lift inline-flex items-center justify-center bg-white px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                Book Call
              </Link>
            </div>
          </div>
        </div>

        <div
          ref={licenseRef}
          className="absolute bottom-12 right-6 hidden font-labels text-[9px] uppercase tracking-[0.22em] text-white/42 lg:right-12 lg:bottom-16 lg:block"
        >
          CA License #{SITE.license}
        </div>

        <div
          ref={scrollHintRef}
          aria-hidden="true"
          className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 items-center gap-3 lg:flex lg:bottom-16"
        >
          <span className="block h-10 w-px bg-white/35" />
        </div>
      </div>
    </section>
  );
}
