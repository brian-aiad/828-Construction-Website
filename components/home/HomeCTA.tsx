"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import FadeIn from "@/components/animations/FadeIn";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

export default function HomeCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Left content slides in from left
      if (contentRef.current) {
        gsap.from(contentRef.current, {
          opacity: 0,
          x: -60,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        });
      }

      // Right image slides in from right
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          opacity: 0,
          x: 60,
          scale: 0.97,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="cta"
      className="relative bg-black py-28 lg:py-40 overflow-hidden"
    >
      {/* Background image — more vibrant than before */}
      <Image
        src="/images/hero/cta-background.jpg"
        alt=""
        fill
        className="object-cover opacity-55"
        style={{ filter: "contrast(1.08) saturate(1.05)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Left: copy + CTAs */}
          <div ref={contentRef} className="lg:col-span-6">
            <span className="font-labels text-[10px] text-gray-500 tracking-[0.22em] uppercase block mb-6">
              Torrance, CA · Est. 2004
            </span>

            <h2
              className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
              style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
            >
              Let&apos;s talk about
              <br />
              your project.
            </h2>

            <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-sm">
              The first conversation is free. We&apos;ll tell you whether the
              project makes sense, what the realistic next step looks like,
              and whether we&apos;re the right fit.
            </p>

            {/* Primary CTA — one dominant action */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-colors duration-300 hover:text-white"
              >
                {/* Fill sweep on hover */}
                <span
                  className="absolute inset-0 bg-[#B87333] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
                  aria-hidden="true"
                />
                <span className="relative">Request an Estimate</span>
                <span className="relative transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center border border-gray-800 text-gray-500 px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:border-gray-600 hover:text-gray-300 transition-colors font-numbers"
              >
                {SITE.phone}
              </a>
            </div>

            <div className="mt-10 pt-10 border-t border-gray-900">
              <div className="flex flex-col gap-3">
                {[
                  `CA License #${SITE.license}`,
                  "Torrance · South Bay",
                  "Free Initial Consultation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    {/* Copper check */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="flex-shrink-0"
                    >
                      <circle cx="7" cy="7" r="6.5" stroke="#B87333" strokeOpacity="0.4" />
                      <path
                        d="M4.5 7L6.2 8.7L9.5 5.3"
                        stroke="#B87333"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-labels text-[10px] text-gray-500 tracking-[0.15em] uppercase">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: project image + stat overlay */}
          <div ref={imageRef} className="lg:col-span-6 hidden lg:block">
            <div className="relative">
              {/* Main image — full color now */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <Image
                  src="/images/projects/adu-interior-living.jpg"
                  alt="828 Construction — ADU interior, South Bay CA"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(1.1)" }}
                  sizes="(max-width: 1280px) 50vw, 600px"
                />
                {/* Subtle overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Project label */}
                <div className="absolute bottom-5 left-5">
                  <span className="font-labels text-[8px] text-white/50 tracking-[0.22em] uppercase">
                    Torrance, CA · ADU Interior Build
                  </span>
                </div>
              </div>

              {/* Floating stat card — bottom right */}
              <div className="absolute -bottom-6 -right-6 bg-[#B87333] text-black p-6 w-40">
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
