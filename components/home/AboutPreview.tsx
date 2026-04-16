"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import FadeIn from "@/components/animations/FadeIn";
import NumberCounter from "@/components/animations/NumberCounter";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPreview() {
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !imagesRef.current) return;

    const ctx = gsap.context(() => {
      const [img1, img2, card] = Array.from(
        imagesRef.current!.querySelectorAll<HTMLElement>(".about-image-wrap")
      );

      const trigger = {
        trigger: imagesRef.current,
        start: "top 72%",
      };

      // Image 1: reveal from right → left (wipes open)
      gsap.from(img1, {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.15,
        ease: "power3.inOut",
        scrollTrigger: trigger,
      });

      // Image 2: reveal from left → right (opposite direction, offset)
      gsap.from(img2, {
        clipPath: "inset(0 0 0 100%)",
        duration: 1.1,
        delay: 0.22,
        ease: "power3.inOut",
        scrollTrigger: trigger,
      });

      // Caption card: slides up from below
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.85,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: trigger,
      });
    }, imagesRef);

    return () => ctx.revert();
  }, []);

  return (
    <section data-section="about" className="bg-white py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left col: label + headline + copy + CTAs + stats */}
          <div className="lg:col-span-6">
            <FadeIn>
              <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
                About 828
              </span>
              <h2
                className="font-display font-bold text-black mt-4 mb-8 tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
              >
                20 years
                <br />
                in the field.
                <br />
                <span className="text-gray-300">Zero shortcuts.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-gray-500 leading-relaxed max-w-sm text-[15px]">
                Every project is backed by real building science knowledge —
                understanding how materials perform, how structures behave,
                and how to build something that actually lasts.
              </p>
            </FadeIn>

            {/* Stats — stacked, not a proof strip */}
            <FadeIn delay={0.15}>
              <div className="mt-10 border-t border-gray-100 divide-y divide-gray-100">
                <div className="py-5 flex items-baseline gap-4">
                  <div
                    className="font-numbers font-bold text-black leading-none"
                    style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}
                  >
                    <NumberCounter target={20} suffix="+" duration={1400} />
                  </div>
                  <div className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase">
                    Years of Field Experience
                  </div>
                </div>

                <div className="py-5 flex items-baseline gap-4">
                  <div
                    className="font-numbers font-bold text-black leading-none"
                    style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)" }}
                  >
                    <NumberCounter target={2004} duration={1800} />
                  </div>
                  <div className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase">
                    Est. · Torrance, CA
                  </div>
                </div>

                <div className="py-5 flex items-center gap-4">
                  <div className="w-1 h-8 bg-[#B87333] flex-shrink-0" />
                  <div>
                    <div className="font-numbers font-bold text-black text-xl leading-none">
                      #{SITE.license}
                    </div>
                    <div className="font-labels text-[9px] text-gray-400 tracking-[0.15em] uppercase mt-1">
                      CA General Contractor License
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Primary CTA only — one direction */}
            <FadeIn delay={0.25} className="mt-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:bg-gray-900 transition-colors"
              >
                Full Story
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </FadeIn>
          </div>

          {/* Right col: overlapping image composition */}
          <div className="lg:col-span-6 mt-8 lg:mt-0" ref={imagesRef}>
            {/* Fixed-height stage — images overlap within this container */}
            <div className="relative" style={{ height: "clamp(420px, 55vw, 600px)" }}>

              {/* Image 1 — dominant, top-left */}
              <div
                className="about-image-wrap absolute overflow-hidden bg-gray-100 shadow-2xl"
                style={{ top: 0, left: 0, width: "66%", height: "70%", zIndex: 2 }}
              >
                <Image
                  src="/images/about/craftsmanship.jpg"
                  alt="828 Construction — precision craftsmanship"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.07) saturate(1.12)" }}
                  sizes="(max-width: 1024px) 66vw, 33vw"
                />
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#B87333]/40" />
              </div>

              {/* Image 2 — secondary, bottom-right, behind card */}
              <div
                className="about-image-wrap absolute overflow-hidden bg-gray-100 shadow-xl"
                style={{ bottom: 0, right: 0, width: "60%", height: "58%", zIndex: 1 }}
              >
                <Image
                  src="/images/about/materials.jpg"
                  alt="828 Construction — quality materials"
                  fill
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(1.1)" }}
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
              </div>

              {/* Caption card — floats over the overlap zone */}
              <div
                className="about-image-wrap absolute bg-black shadow-2xl flex flex-col justify-between"
                style={{
                  bottom: "10%",
                  left: "40%",
                  width: "46%",
                  padding: "1.5rem",
                  zIndex: 3,
                  minHeight: "120px",
                }}
              >
                <span className="font-labels text-[8px] text-gray-600 tracking-[0.22em] uppercase">
                  The Standard
                </span>
                <div>
                  <p className="font-display font-bold text-white text-base lg:text-lg leading-tight mb-1">
                    Built with Intent.
                  </p>
                  <p className="font-labels text-[9px] text-gray-500 tracking-[0.12em] uppercase leading-relaxed">
                    Not by Accident.
                  </p>
                </div>
                <a
                  href={SITE.phoneHref}
                  className="font-numbers text-sm text-[#B87333] tracking-wide hover:text-white transition-colors duration-200 mt-2"
                >
                  {SITE.phone}
                </a>
              </div>

              {/* Decorative copper line — left edge accent */}
              <div
                className="absolute top-[15%] left-0 w-[2px] bg-[#B87333]/30"
                style={{ height: "55%", zIndex: 10 }}
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
