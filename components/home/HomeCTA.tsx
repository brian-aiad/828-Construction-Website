"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import MagneticButton from "@/components/ui/MagneticButton";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

export default function HomeCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const copperTagRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !sectionRef.current) return;

    let mounted = true;
    let splitFrame = -1;
    let ctaSplit: SplitType | null = null;
    const ctaEl = headlineRef.current;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current!;

      // ── Copper hairline: scaleX scrub ────────────────────────────────────
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger, start: "top 85%", end: "top 55%", scrub: 1.2 },
          }
        );
      }

      // ── Label fade ────────────────────────────────────────────────────────
      const labelEl = sectionRef.current!.querySelector<HTMLElement>(".cta-label");
      if (labelEl) {
        gsap.fromTo(labelEl, { y: 16, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 72%", once: true },
        });
      }

      // ── Headline: SplitType char reveal tied to scroll scrub ─────────────
      if (ctaEl) {
        const _trigger = trigger;
        splitFrame = requestAnimationFrame(() => {
          if (!mounted || !ctaEl.isConnected) return;
          const split = new SplitType(ctaEl, { types: "chars" });
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

      // ── Body / CTAs / trust: stagger emerge (no x-axis) ─────────────────
      [bodyRef.current, ctasRef.current, trustRef.current].filter(Boolean).forEach((el, i) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, delay: 0.3 + i * 0.12, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 70%", once: true },
        });
      });

      // ── Image: scrub clip-path reveal (top curtain) ──────────────────────
      if (imageWrapRef.current) {
        gsap.fromTo(imageWrapRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger, start: "top 85%", end: "top 25%", scrub: 1.2 },
          }
        );
        // Image scale-through-scroll
        const imgEl = imageWrapRef.current.querySelector<HTMLElement>("img");
        if (imgEl) {
          gsap.fromTo(imgEl,
            { scale: 1.1 },
            {
              scale: 1.0, ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current!,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }
      }

      // ── Copper stat tag: emerge vertically (no x-axis) ───────────────────
      if (copperTagRef.current) {
        gsap.fromTo(copperTagRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, delay: 0.55, ease: "power3.out",
            scrollTrigger: { trigger, start: "top 70%", once: true },
          }
        );
      }

      // ── Bg image parallax ────────────────────────────────────────────────
      const bgImg = sectionRef.current!.querySelector<HTMLElement>(".cta-bg-img");
      if (bgImg) {
        gsap.to(bgImg, {
          yPercent: -6, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (ctaSplit && ctaEl?.isConnected) { try { ctaSplit.revert(); } catch {} }
      splitRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="cta"
      className="relative bg-black py-28 lg:py-40 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="cta-bg-img absolute inset-x-0" style={{ top: "-6%", height: "112%" }}>
          <Image
            src="/images/hero/cta-background.jpg"
            alt=""
            fill
            className="object-cover opacity-40"
            style={{ filter: "contrast(1.08) saturate(1.05)" }}
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Copper hairline — scaleX scrub */}
        <div
          ref={hairlineRef}
          style={{
            height: 1,
            background: "#B87333",
            opacity: 0.45,
            transformOrigin: "left",
            transform: "scaleX(0)",
            marginBottom: "3rem",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Left: copy + CTAs */}
          <div className="lg:col-span-6">
            <span className="cta-label font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-6">
              Torrance, CA · Est. 2004
            </span>

            <h2
              ref={headlineRef}
              className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
              style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
            >
              Let&apos;s talk about your project.
            </h2>

            <p ref={bodyRef} className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-sm">
              The first conversation is free. We&apos;ll tell you whether the
              project makes sense, what the realistic next step looks like,
              and whether we&apos;re the right fit.
            </p>

            <div ref={ctasRef} className="flex flex-col sm:flex-row items-start gap-4">
              <MagneticButton strength={0.3}>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-colors duration-300 hover:text-white"
                >
                  <span
                    className="absolute inset-0 bg-[#B87333] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
                    aria-hidden="true"
                  />
                  <span className="relative">Request an Estimate</span>
                  <span className="relative transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </MagneticButton>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center border border-gray-800 text-gray-400 px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:border-gray-600 hover:text-gray-200 transition-colors font-numbers"
              >
                {SITE.phone}
              </a>
            </div>

            <div ref={trustRef} className="mt-10 pt-10 border-t border-gray-900">
              <div className="flex flex-col gap-3">
                {[
                  `CA License #${SITE.license}`,
                  "Torrance · South Bay",
                  "Free Initial Consultation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="flex-shrink-0">
                      <circle cx="7" cy="7" r="6.5" stroke="#B87333" strokeOpacity="0.4" />
                      <path d="M4.5 7L6.2 8.7L9.5 5.3" stroke="#B87333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-labels text-[10px] text-gray-400 tracking-[0.15em] uppercase">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: scrub clip-path image + copper stat tag */}
          <div className="lg:col-span-6 hidden lg:block">
            <div className="relative">
              <div
                ref={imageWrapRef}
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/5", clipPath: "inset(100% 0% 0% 0%)" }}
              >
                <Image
                  src="/images/projects/adu-interior-living.jpg"
                  alt="828 Construction — ADU interior, South Bay CA"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(1.1)" }}
                  sizes="(max-width: 1280px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="font-labels text-[8px] text-white/50 tracking-[0.22em] uppercase">
                    Torrance, CA · ADU Interior Build
                  </span>
                </div>
              </div>

              {/* Copper stat tag — emerge vertically (no x-axis) */}
              <div
                ref={copperTagRef}
                className="absolute -bottom-6 -right-6 bg-[#B87333] text-black p-6 w-40"
                style={{ opacity: 0 }}
              >
                <div className="font-numbers font-bold text-3xl leading-none mb-1">20+</div>
                <div className="font-labels text-[8px] tracking-[0.18em] uppercase leading-relaxed opacity-80">
                  Years Building South Bay
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
