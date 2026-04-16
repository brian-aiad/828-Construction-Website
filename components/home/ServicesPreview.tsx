"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "@/components/animations/FadeIn";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    slug: "adu",
    heading: "ADU Construction",
    tagline: "Built for added space that actually performs.",
    keywords: ["Permitting", "Layout logic", "Full build"],
    image: "/images/projects/service-adu.jpg",
    size: "large",
  },
  {
    slug: "remediation",
    heading: "Remediation",
    tagline: "Fix the cause. Not just the visible symptom.",
    keywords: ["Water intrusion", "Structural repair", "Failure diagnosis"],
    image: "/images/projects/remediation-after.jpg",
    size: "small",
  },
  {
    slug: "consulting",
    heading: "Consulting",
    tagline: "Get clarity before you commit money.",
    keywords: ["Pre-purchase review", "Scope analysis", "Owner guidance"],
    image: "/images/projects/consulting-plans.jpg",
    size: "small",
  },
];

function ServicePlate({ index }: { index: number }) {
  const patterns = [
    "repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.025) 48px)",
    "repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,255,255,0.02) 23px)",
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  ];
  return (
    <div
      className="absolute inset-0 bg-gray-950"
      style={{
        backgroundImage: patterns[index % 3],
        backgroundSize: index % 3 === 2 ? "32px 32px" : "auto",
      }}
    />
  );
}

export default function ServicesPreview() {
  const [adu, remediation, consulting] = services;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AnimationController.shouldAnimate() || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll<HTMLElement>(".service-card");

    const ctx = gsap.context(() => {
      // Cascade reveal with 3D depth
      gsap.from(cards, {
        opacity: 0,
        y: 90,
        scale: 0.95,
        rotateX: 10,
        transformPerspective: 900,
        duration: 0.95,
        stagger: { each: 0.15, from: "start" },
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 78%",
        },
      });

      // Hover lift — y:-8 on enter, y:0 on leave
      cards.forEach((card) => {
        const inner = card.querySelector<HTMLElement>("a");
        if (!inner) return;

        card.addEventListener("mouseenter", () => {
          gsap.to(inner, { y: -8, duration: 0.35, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(inner, { y: 0, duration: 0.35, ease: "power2.out" });
        });
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section data-testid="services-section" data-section="services" className="bg-black py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <FadeIn>
          <div className="mb-16 lg:mb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="font-labels text-[10px] text-gray-600 tracking-[0.22em] uppercase">
                Services
              </span>
              <h2
                className="font-display font-bold text-white mt-4 tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
              >
                Three services.
                <br />
                <span style={{ color: "rgba(255,255,255,0.35)" }}>One standard.</span>
              </h2>
            </div>
            <Link
              href="/services"
              className="font-labels text-[11px] text-gray-600 tracking-[0.18em] uppercase hover:text-[#B87333] transition-colors duration-200 group inline-flex items-center gap-2 self-start sm:self-auto border-b border-transparent hover:border-[#B87333]"
            >
              All Services
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </FadeIn>

        {/* 12-col asymmetric grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-2">

          {/* ADU — col 1-7 */}
          <div className="service-card md:col-span-7">
            <Link
              href={`/services/${adu.slug}`}
              className="group block relative overflow-hidden"
              style={{ height: "clamp(280px, 42vw, 520px)" }}
            >
              <ImageWithFallback
                src={adu.image}
                alt={adu.heading}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "contrast(1.05) saturate(1.1)" }}
                fallback={<ServicePlate index={0} />}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Ghost number */}
              <div
                className="absolute top-4 right-5 font-numbers font-bold leading-none select-none pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
                style={{ fontSize: "clamp(5rem, 10vw, 8rem)", color: "#B87333", opacity: 0.08 }}
              >
                01
              </div>

              {/* 4-side animated border */}
              <div className="service-card-border-wrap">
                <span className="service-card-border-left" />
                <span className="service-card-border-right" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {adu.keywords.map((kw) => (
                    <span key={kw} className="font-labels text-[9px] text-white/60 tracking-[0.14em] uppercase border border-white/15 px-2 py-0.5 group-hover:border-[#B87333]/40 group-hover:text-white/80 transition-colors duration-300">
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3
                      className="font-display font-bold text-white leading-tight tracking-tight"
                      style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                      {adu.heading}
                    </h3>
                    <p className="text-white/60 mt-1 text-sm">{adu.tagline}</p>
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-[#B87333] transition-colors duration-300">
                    <span className="text-white/60 group-hover:text-[#B87333] transition-colors duration-300 text-sm">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Remediation — col 8-12 */}
          <div className="service-card md:col-span-5">
            <Link
              href={`/services/${remediation.slug}`}
              className="group block relative overflow-hidden"
              style={{ height: "clamp(280px, 42vw, 520px)" }}
            >
              <ImageWithFallback
                src={remediation.image}
                alt={remediation.heading}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "contrast(1.05) saturate(1.1)" }}
                fallback={<ServicePlate index={1} />}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Ghost number */}
              <div
                className="absolute top-4 right-5 font-numbers font-bold leading-none select-none pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
                style={{ fontSize: "clamp(5rem, 10vw, 8rem)", color: "#B87333", opacity: 0.08 }}
              >
                02
              </div>

              {/* 4-side animated border */}
              <div className="service-card-border-wrap">
                <span className="service-card-border-left" />
                <span className="service-card-border-right" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {remediation.keywords.map((kw) => (
                    <span key={kw} className="font-labels text-[9px] text-white/60 tracking-[0.14em] uppercase border border-white/15 px-2 py-0.5 group-hover:border-[#B87333]/40 group-hover:text-white/80 transition-colors duration-300">
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3
                      className="font-display font-bold text-white leading-tight tracking-tight"
                      style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                    >
                      {remediation.heading}
                    </h3>
                    <p className="text-white/60 mt-1 text-xs">{remediation.tagline}</p>
                  </div>
                  <div className="flex-shrink-0 w-9 h-9 border border-white/20 flex items-center justify-center group-hover:border-[#B87333] transition-colors duration-300">
                    <span className="text-white/60 group-hover:text-[#B87333] transition-colors duration-300 text-sm">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Consulting — col 3-7, offset below ADU */}
          <div className="service-card md:col-span-5 md:col-start-3">
            <Link
              href={`/services/${consulting.slug}`}
              className="group block relative overflow-hidden"
              style={{ height: "clamp(240px, 30vw, 380px)" }}
            >
              <ImageWithFallback
                src={consulting.image}
                alt={consulting.heading}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "contrast(1.05) saturate(1.1)" }}
                fallback={<ServicePlate index={2} />}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Ghost number */}
              <div
                className="absolute top-4 right-5 font-numbers font-bold leading-none select-none pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
                style={{ fontSize: "clamp(5rem, 10vw, 8rem)", color: "#B87333", opacity: 0.08 }}
              >
                03
              </div>

              {/* 4-side animated border */}
              <div className="service-card-border-wrap">
                <span className="service-card-border-left" />
                <span className="service-card-border-right" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {consulting.keywords.map((kw) => (
                    <span key={kw} className="font-labels text-[9px] text-white/60 tracking-[0.14em] uppercase border border-white/15 px-2 py-0.5 group-hover:border-[#B87333]/40 group-hover:text-white/80 transition-colors duration-300">
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3
                      className="font-display font-bold text-white leading-tight tracking-tight"
                      style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                    >
                      {consulting.heading}
                    </h3>
                    <p className="text-white/60 mt-1 text-xs">{consulting.tagline}</p>
                  </div>
                  <div className="flex-shrink-0 w-9 h-9 border border-white/20 flex items-center justify-center group-hover:border-[#B87333] transition-colors duration-300">
                    <span className="text-white/60 group-hover:text-[#B87333] transition-colors duration-300 text-sm">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
