"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

// NS-grammar services: light editorial section, big quiet headline row,
// large photography with captions BELOW the frame (never overlaid),
// parallax scrub inside each frame, hover scale. One spacing rhythm.

const SERVICE_IMAGES: Record<string, string> = {
  adu: "/images/projects/service-adu.jpg",
  remediation: "/images/projects/remediation-active.jpg",
  consulting: "/images/projects/consulting-plans.jpg",
};

const SERVICE_TAGLINES: Record<string, string> = {
  adu: "Designed for functionality, built to last.",
  remediation: "Root-cause solutions. Not surface fixes.",
  consulting: "Clarity before commitment.",
};

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlOGU4ZTMiLz48L3N2Zz4=";

function imgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

export default function ServicesPreviewV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverCleanups = useRef<Array<() => void>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      const headlineLines = gsap.utils.toArray<HTMLElement>(".svc-headline-line");
      const frames = cards
        .map((card) => card.querySelector<HTMLElement>(".svc-frame"))
        .filter(Boolean) as HTMLElement[];
      const captions = cards
        .map((card) => card.querySelector<HTMLElement>(".svc-caption"))
        .filter(Boolean) as HTMLElement[];

      gsap.set(headlineLines, { yPercent: 110 });
      gsap.set(frames, { clipPath: "inset(0% 0% 14% 0%)" });
      gsap.set(captions, { y: 18, opacity: 0 });
      if (introRef.current) gsap.set(introRef.current, { y: 20, opacity: 0 });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(headlineLines, { yPercent: 0 });
        gsap.set(frames, { clipPath: "inset(0%)" });
        gsap.set(captions, { y: 0, opacity: 1 });
        if (introRef.current) gsap.set(introRef.current, { y: 0, opacity: 1 });
        return;
      }

      // Headline mask reveal — decisive one-shot so it always completes
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

      if (introRef.current) {
        gsap.to(introRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: introRef.current, start: "top 84%", once: true },
        });
      }

      // Each card: frame clip-reveal + caption rise, tied to its own position
      cards.forEach((card) => {
        const frame = card.querySelector<HTMLElement>(".svc-frame");
        const caption = card.querySelector<HTMLElement>(".svc-caption");
        const inner = card.querySelector<HTMLElement>(".svc-img-inner");

        if (frame) {
          gsap.to(frame, {
            clipPath: "inset(0%)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 55%",
              scrub: 1,
            },
          });
        }
        if (caption) {
          gsap.to(caption, {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 70%", once: true },
          });
        }
        // Parallax inside the frame
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      });

      // Hover — quiet image scale only (Fix 20: store removers)
      if (window.matchMedia("(hover: hover)").matches) {
        cards.forEach((card) => {
          const img = card.querySelector<HTMLElement>(".svc-img-inner img");
          const onEnter = () => {
            if (img) gsap.to(img, { scale: 1.045, duration: 0.8, ease: "power2.out" });
          };
          const onLeave = () => {
            if (img) gsap.to(img, { scale: 1, duration: 0.8, ease: "power2.out" });
          };
          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);
          hoverCleanups.current.push(() => {
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
          });
        });
      }
    }, sectionRef);

    return () => {
      hoverCleanups.current.forEach((fn) => fn());
      hoverCleanups.current = [];
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  const [adu, remediation, consulting] = SERVICES;

  const renderCaption = (
    service: (typeof SERVICES)[number],
    index: number
  ) => (
    <div className="svc-caption mt-5 flex items-baseline justify-between gap-6 lg:mt-6">
      <div>
        <h3 className="font-editorial text-[clamp(1.25rem,1.7vw,1.65rem)] font-normal leading-tight text-[#111]">
          {service.title}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-black/52">
          {SERVICE_TAGLINES[service.slug]}
        </p>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="font-labels text-[9px] uppercase tracking-[0.22em] text-black/40">
          {service.short}
        </p>
        <p className="mt-1.5 font-numbers text-[10px] text-[var(--color-accent)]">
          0{index + 1}
        </p>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f7f7f3] py-24 text-[#111] lg:py-36"
      data-section="services-v2"
    >
      <div className="mx-auto max-w-[1680px] px-6 lg:px-12">
        {/* Header row — headline left, copy + link right */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2
              ref={headlineRef}
              className="font-editorial text-[clamp(2.5rem,4.6vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.01em] text-[#111]"
            >
              <span className="block overflow-hidden">
                <span className="svc-headline-line block">One company,</span>
              </span>
              <span className="block overflow-hidden">
                <span className="svc-headline-line block text-[var(--color-accent)]">
                  multiple solutions.
                </span>
              </span>
            </h2>
          </div>
          <div ref={introRef} className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-[15px] leading-7 text-black/60">
              Whether it&apos;s an ongoing maintenance, essential repairs, or a
              new ADU. 828 Construction helps homeowners bring their vision to
              life and keep their homes performing at their best.
            </p>
            <Link
              href="/services"
              className="group mt-7 hidden w-fit items-center gap-2 border-b border-black/20 pb-1 font-labels text-[10px] uppercase tracking-[0.18em] text-black/60 transition-colors hover:border-black hover:text-black lg:inline-flex"
            >
              All Services
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Work grid — one tall frame left, two stacked right, captions below */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 lg:mt-20 lg:grid-cols-12 lg:gap-y-0">
          <div
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
            className="lg:col-span-7"
          >
            <Link href={`/services/${adu.slug}`} aria-label={adu.title} className="block">
              <div
                className="svc-frame relative aspect-[4/3] overflow-hidden bg-[#e8e8e3] lg:aspect-[5/5.4]"
                data-gsap-reveal="true"
              >
                <div className="svc-img-inner absolute -inset-y-[8%] inset-x-0" style={{ willChange: "transform" }}>
                  <Image
                    src={SERVICE_IMAGES[adu.slug]}
                    alt={adu.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    onError={imgError}
                    className="object-cover"
                    style={{ filter: "contrast(1.04) saturate(1.06)" }}
                  />
                </div>
              </div>
              {renderCaption(adu, 0)}
            </Link>
          </div>

          <div className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9 lg:gap-14 lg:pt-24">
            {[remediation, consulting].map((service, i) => (
              <div
                key={service.slug}
                ref={(el) => {
                  cardRefs.current[i + 1] = el;
                }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  aria-label={service.title}
                  className="block"
                >
                  <div
                    className="svc-frame relative aspect-[4/3] overflow-hidden bg-[#e8e8e3]"
                    data-gsap-reveal="true"
                  >
                    <div className="svc-img-inner absolute -inset-y-[8%] inset-x-0" style={{ willChange: "transform" }}>
                      <Image
                        src={SERVICE_IMAGES[service.slug]}
                        alt={service.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 34vw"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        onError={imgError}
                        className="object-cover"
                        style={{ filter: "contrast(1.04) saturate(1.06)" }}
                      />
                    </div>
                  </div>
                  {renderCaption(service, i + 1)}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile "All Services" link */}
        <div className="mt-12 lg:hidden">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 border-b border-black/20 pb-1 font-labels text-[10px] uppercase tracking-[0.18em] text-black/60"
          >
            All Services
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
