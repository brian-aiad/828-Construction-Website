"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCE_SINCE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// NS-grammar about preview: light editorial close to the page — big quiet
// statement headline, supporting copy, then a horizontal row of real project
// detail photographs with staggered reveal and inner parallax.

const DETAIL_IMAGES = [
  {
    src: "/images/projects/cerritos-residence/13-2110.jpg",
    alt: "Dark vertical tile feature wall with recessed shower niche, Cerritos residence",
  },
  {
    src: "/images/projects/outdoor-patio-pergola.jpg",
    alt: "Custom pergola and pool deck outdoor living build in South Bay",
  },
  {
    src: "/images/projects/tustin-residence/13-1947.jpg",
    alt: "Blue herringbone tile niche detail, Tustin residence bath remodel",
  },
];

export default function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const headlineLines = gsap.utils.toArray<HTMLElement>(".about-headline-line");
      const copyEls = gsap.utils.toArray<HTMLElement>(".about-copy-el");
      const frames = gsap.utils.toArray<HTMLElement>(".about-frame");

      gsap.set(headlineLines, { yPercent: 110 });
      gsap.set(copyEls, { y: 20, opacity: 0 });
      gsap.set(frames, { clipPath: "inset(0% 0% 14% 0%)" });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(headlineLines, { yPercent: 0 });
        gsap.set(copyEls, { y: 0, opacity: 1 });
        gsap.set(frames, { clipPath: "inset(0%)" });
        return;
      }

      gsap.to(headlineLines, {
        yPercent: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current ?? section,
          start: "top 85%",
          once: true,
        },
      });

      copyEls.forEach((el, i) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

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
        <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:gap-12 lg:pt-14">
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
              className="font-editorial text-[clamp(2.1rem,3.5vw,3.55rem)] font-normal leading-[1.06] tracking-[-0.01em]"
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
                className="group inline-flex items-center gap-2 border-b border-black/20 pb-1 font-labels text-[10px] uppercase tracking-[0.18em] text-black/60 transition-colors hover:border-black hover:text-black"
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
            <div key={img.src}>
              <div
                className="about-frame group relative aspect-[4/5] overflow-hidden bg-[#e8e8e3]"
                data-gsap-reveal="true"
              >
                <div className="about-img-inner absolute -inset-y-[8%] inset-x-0" style={{ willChange: "transform" }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ filter: "contrast(1.04) saturate(1.06)" }}
                  />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="mt-3 h-px w-10 bg-[var(--color-accent)] opacity-70"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
