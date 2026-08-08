"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCE_SINCE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { revealOnVisible } from "@/utils/revealOnVisible";

gsap.registerPlugin(ScrollTrigger);

// NS-grammar about preview: dark editorial close to the page — big quiet
// statement headline, supporting copy, then a horizontal row of real project
// detail photographs with staggered reveal and inner parallax.

const DETAIL_IMAGES = [
  {
    src: "/images/projects/cerritos-residence/home-preview-editorial-v3.jpg",
    alt: "Cerritos Residence bath remodel overview with glass shower, dark feature tile, vanity, and finish details",
    project: "Cerritos Residence",
    meta: "Bath Remodel / Cerritos, CA",
    href: "/portfolio#cerritos-residence",
  },
  {
    src: "/images/projects/el-sereno-residence/home-preview-editorial-v3.jpg",
    alt: "El Sereno Residence bath and outdoor living project with deck, railing, tile, and woodwork details",
    project: "El Sereno Residence",
    meta: "Bath Remodel / El Sereno, CA",
    href: "/portfolio#el-sereno-residence",
  },
  {
    src: "/images/projects/tustin-residence/home-preview-editorial-v3.jpg",
    alt: "Tustin Residence bath refresh with blue tub, glass shower, tile work, lighting, and finish details",
    project: "Tustin Residence",
    meta: "Bath Refresh / Tustin, CA",
    href: "/portfolio#tustin-residence",
  },
];

export default function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // One-shot reveals use IntersectionObserver — ScrollTrigger positional
    // once-triggers go stale after route transitions (PATTERNS.md Fix 22).
    const revealCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const headlineLines = gsap.utils.toArray<HTMLElement>(".about-headline-line");
      const copyEls = gsap.utils.toArray<HTMLElement>(".about-copy-el");
      const frames = gsap.utils.toArray<HTMLElement>(".about-frame");

      gsap.set(headlineLines, { yPercent: 110 });
      gsap.set(copyEls, { y: 20, opacity: 0 });
      gsap.set(frames, { clipPath: "inset(0% 0% 14% 0%)" });

      const { isMobile, prefersReducedMotion } = AnimationController.getConfig();

      if (!AnimationController.shouldAnimate()) {
        gsap.set(headlineLines, { yPercent: 0 });
        gsap.set(frames, { clipPath: "inset(0%)" });

        if (prefersReducedMotion || !isMobile) {
          gsap.set(copyEls, { y: 0, opacity: 1 });
          return;
        }

        // Mobile text entrance — y+opacity only (failsafe-resettable, Fix 18).
        if (headlineRef.current) {
          gsap.set(headlineRef.current, { y: 22, opacity: 0 });
          revealCleanups.push(
            revealOnVisible([headlineRef.current], (el) =>
              gsap.to(el, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
            )
          );
        }
        copyEls.forEach((c) => {
          revealCleanups.push(
            revealOnVisible([c], (el) =>
              gsap.to(el, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" })
            )
          );
        });
        return;
      }

      revealCleanups.push(
        revealOnVisible([headlineRef.current ?? section], () => {
          gsap.to(headlineLines, {
            yPercent: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
          });
        })
      );

      revealCleanups.push(
        revealOnVisible(copyEls, (el, i) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.07,
            ease: "power3.out",
          });
        })
      );

      frames.forEach((frame, i) => {
        gsap.to(frame, {
          clipPath: "inset(0%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: frame,
            start: "top 92%",
            end: "top 58%",
            scrub: 1,
          },
        });

        const inner = frame.querySelector<HTMLElement>(".about-img-inner");
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2 + i * 0.15,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => {
      revealCleanups.forEach((dispose) => dispose());
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-svh overflow-hidden bg-[#050505] text-white"
      data-section="about-preview"
      data-header-dark=""
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,26,22,0.18),transparent_38%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-accent)] opacity-70"
      />
      <div className="mx-auto flex min-h-svh max-w-[1680px] flex-col px-6 pb-10 pt-18 sm:pb-12 lg:px-10 lg:pb-12 lg:pt-[6.75rem] 2xl:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-7 xl:col-span-6">
            <p className="about-copy-el mb-5 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.26em] text-[var(--color-accent)] lg:mb-7">
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-[var(--color-accent)]"
              />
              Since {EXPERIENCE_SINCE}
            </p>
            <h2
              ref={headlineRef}
              className="max-w-[15ch] font-editorial text-[clamp(2.65rem,4.8vw,5.65rem)] font-normal leading-[1.08]"
            >
              <span className="-my-[0.24em] block overflow-hidden py-[0.24em]">
                <span className="about-headline-line block">
                  Refining industry standards.
                </span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col justify-end lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
            <p className="about-copy-el max-w-[34rem] text-[15px] leading-7 text-white/62 lg:text-[16px] lg:leading-8">
              With more than 20 years of experience across multiple
              construction trades, 828 Construction brings a comprehensive
              understanding of the building process. Our mission is to make
              every project as seamless, effective, and stress-free as
              possible.
            </p>
            <div className="about-copy-el mt-6">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 border-b border-white/22 pb-1 font-labels text-[10px] uppercase tracking-[0.18em] text-white/58 transition-colors hover:border-white hover:text-white max-lg:min-h-[44px] max-lg:pt-3 max-lg:pb-1.5"
              >
                Learn more
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Detail photography row */}
        <div className="mt-12 grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:items-end lg:gap-7">
          {DETAIL_IMAGES.map((img) => (
            <Link
              key={img.src}
              href={img.href}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505]"
              aria-label={`View ${img.project} in the portfolio`}
            >
              <div
                className="about-frame relative aspect-[4/5] min-h-[18rem] overflow-hidden bg-[#111] sm:aspect-[3/4] sm:min-h-0 lg:aspect-auto lg:h-[min(42svh,30rem)] xl:h-[min(45svh,34rem)]"
                data-gsap-reveal="true"
              >
                <div className="about-img-inner absolute -inset-y-[8%] inset-x-0" style={{ willChange: "transform" }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    quality={92}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ filter: "contrast(1.08) saturate(0.98) brightness(0.84)" }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 opacity-70" />
              </div>
              <div
                aria-hidden="true"
                className="mt-2.5 h-px w-10 bg-[var(--color-accent)] opacity-70"
              />
              <div className="mt-3.5 flex min-h-[4.75rem] items-start justify-between gap-4 lg:gap-5">
                <div className="min-w-0">
                  <p className="font-editorial text-[clamp(1.55rem,2vw,2.25rem)] leading-[1.02] text-white">
                    {img.project}
                  </p>
                  <p className="mt-2 font-labels text-[8px] uppercase leading-4 tracking-[0.18em] text-white/38">
                    {img.meta}
                  </p>
                </div>
                <span className="mt-1 hidden whitespace-nowrap font-labels text-[8px] uppercase tracking-[0.18em] text-white/42 transition-colors group-hover:text-white xl:block">
                  View in portfolio -&gt;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
