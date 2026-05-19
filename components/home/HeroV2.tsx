"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { useMagnetic } from "@/lib/hooks/useMagnetic";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";

gsap.registerPlugin(ScrollTrigger);

export default function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const licenseRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const splitFrameRef = useRef(-1);
  const magneticRef = useMagnetic(0.45) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const section = sectionRef.current;
    const headlineEl = headlineRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const revealEls = [
        eyebrowRef.current,
        subRef.current,
        ctaRef.current,
        lineRef.current,
        licenseRef.current,
      ].filter(Boolean) as HTMLElement[];

      gsap.set(revealEls, { y: 22, opacity: 0 });
      if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1 });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(revealEls, { y: 0, opacity: 1 });
        return;
      }

      splitFrameRef.current = requestAnimationFrame(() => {
        if (!headlineRef.current?.isConnected) return;
        splitRef.current = new SplitType(headlineRef.current, {
          types: "words,chars",
        });

        gsap.fromTo(
          splitRef.current.chars ?? [],
          { yPercent: 112, opacity: 0, rotationX: 54 },
          {
            yPercent: 0,
            opacity: 1,
            rotationX: 0,
            stagger: 0.017,
            duration: 1.05,
            ease: "power4.out",
            delay: 0.1,
          }
        );
      });

      gsap.to(revealEls, {
        y: 0,
        opacity: 1,
        stagger: 0.09,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.32,
      });

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.04, yPercent: 0 },
          {
            scale: 1.22,
            yPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      if (copyRef.current) {
        gsap.to(copyRef.current, {
          yPercent: -28,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "10% top",
            end: "42% top",
            scrub: 1,
          },
        });
      }

      if (veilRef.current) {
        gsap.to(veilRef.current, {
          opacity: 0.34,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (licenseRef.current) {
        gsap.to(licenseRef.current, {
          yPercent: -130,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "30% top",
            end: "82% top",
            scrub: 1.1,
          },
        });
      }
    }, sectionRef);

    return () => {
      cancelAnimationFrame(splitFrameRef.current);
      if (splitRef.current && headlineEl?.isConnected) {
        try {
          splitRef.current.revert();
        } catch {}
      }
      splitRef.current = null;
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[165svh] bg-black text-white"
      aria-label="828 Construction homepage hero"
    >
      <div ref={stickyRef} className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={imageRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image
            src="/images/generated/home-hero-simple-adu-bluehour.png"
            alt="Modern ADU and outdoor living build at blue hour"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div
          ref={veilRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0.74,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.62) 38%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.42) 100%), linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.04) 48%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        <DraftingMotionLayer intensity="quiet" className="opacity-25" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14 pt-32 lg:px-12 lg:pb-16">
          <div
            ref={copyRef}
            className="grid max-w-6xl gap-8 lg:grid-cols-[1.12fr_0.72fr] lg:items-end lg:gap-16"
            style={{ willChange: "transform, opacity" }}
          >
            <div>
              <p
                ref={eyebrowRef}
                className="mb-7 font-labels text-[10px] uppercase tracking-[0.28em] text-white/58"
              >
                Torrance / South Bay
              </p>

              <h1
                ref={headlineRef}
                className="font-editorial text-[clamp(4.2rem,10vw,10.8rem)] font-semibold leading-[0.78]"
                style={{ perspective: "1000px" }}
              >
                Build your vision.
              </h1>

              <div ref={lineRef} className="mt-8 h-px w-24 bg-white/38" aria-hidden="true" />
            </div>

            <div className="flex max-w-md flex-col gap-7 border-l border-white/12 pl-6 lg:mb-2 lg:pl-8">
              <p
                ref={subRef}
                className="font-body text-[clamp(1rem,1.35vw,1.18rem)] leading-relaxed text-white/72"
              >
                ADU construction, remediation, and consulting shaped with
                discipline from first conversation to final detail.
              </p>

              <div ref={ctaRef} className="shrink-0">
                <div ref={magneticRef} className="inline-block">
                  <Link
                    href="/contact"
                    className="btn-shine btn-lift inline-flex items-center justify-center bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black"
                  >
                    Start a Project
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={licenseRef}
            className="absolute bottom-8 right-6 hidden font-labels text-[9px] uppercase tracking-[0.22em] text-white/38 lg:block lg:right-12"
            style={{ willChange: "transform, opacity" }}
          >
            CA License #{SITE.license}
          </div>
        </div>
      </div>
    </section>
  );
}
