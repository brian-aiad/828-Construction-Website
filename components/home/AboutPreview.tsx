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

// NS-grammar about preview: light editorial close to the page — big quiet
// statement headline, supporting copy, then a horizontal row of real project
// detail photographs with staggered reveal and inner parallax.

const DETAIL_IMAGES = [
  {
    src: "/images/projects/cerritos-residence/home-preview-vanity.jpg",
    alt: "Finished dual vanity from the Cerritos Residence bath remodel",
    project: "Cerritos Residence",
    meta: "Bath Remodel / Cerritos, CA",
    href: "/portfolio#cerritos-residence",
  },
  {
    src: "/images/projects/el-sereno-residence/01-2194.jpg",
    alt: "Round wood-framed mirror over a vessel sink on geometric star tile, El Sereno Residence bath remodel",
    project: "El Sereno Residence",
    meta: "Bath Remodel / El Sereno, CA",
    href: "/portfolio#el-sereno-residence",
  },
  {
    src: "/images/projects/tustin-residence/home-preview-tub-detail.jpg",
    alt: "Warm tub and towel detail from the Tustin Residence bath refresh",
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
      className="relative bg-[#f7f7f3] text-[#111]"
      data-section="about-preview"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-24 lg:px-12 lg:pb-36">
        <div className="grid gap-10 pt-24 lg:grid-cols-12 lg:gap-12 lg:pt-[7.5rem]">
          <div className="lg:col-span-7">
            <p className="about-copy-el mb-6 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.26em] text-[var(--color-accent)] lg:mb-8">
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-[var(--color-accent)]"
              />
              Since {EXPERIENCE_SINCE}
            </p>
            <h2
              ref={headlineRef}
              className="font-editorial text-[clamp(2.1rem,3.2vw,3.4rem)] font-normal leading-[1.06] tracking-[-0.01em]"
            >
              <span className="block overflow-hidden">
                <span className="about-headline-line block whitespace-nowrap max-lg:whitespace-normal">
                  Refining industry standards.
                </span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="about-copy-el max-w-md text-[15px] leading-7 text-black/60">
              With more than 20 years of experience across multiple
              construction trades, 828 Construction brings a comprehensive
              understanding of the building process. Our mission is to make
              every project as seamless, effective, and stress-free as
              possible.
            </p>
            <div className="about-copy-el mt-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 border-b border-black/20 pb-1 font-labels text-[10px] uppercase tracking-[0.18em] text-black/60 transition-colors hover:border-black hover:text-black max-lg:min-h-[44px] max-lg:pt-3 max-lg:pb-1.5"
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
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-20 lg:gap-8">
          {DETAIL_IMAGES.map((img) => (
            <Link
              key={img.src}
              href={img.href}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f3]"
              aria-label={`View ${img.project} in the portfolio`}
            >
              <div
                className="about-frame relative aspect-[4/5] overflow-hidden bg-[#e8e8e3]"
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
                    style={{ filter: "contrast(1.04) saturate(1.06)" }}
                  />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="mt-3 h-px w-10 bg-[var(--color-accent)] opacity-70"
              />
              <div className="mt-4 flex items-start justify-between gap-5">
                <div>
                  <p className="font-editorial text-[clamp(1.35rem,1.7vw,1.9rem)] leading-none text-black">
                    {img.project}
                  </p>
                  <p className="mt-2 font-labels text-[8px] uppercase leading-4 tracking-[0.18em] text-black/38">
                    {img.meta}
                  </p>
                </div>
                <span className="mt-1 whitespace-nowrap font-labels text-[8px] uppercase tracking-[0.18em] text-black/42 transition-colors group-hover:text-black">
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
