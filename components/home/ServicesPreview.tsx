"use client";

import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import FadeIn from "@/components/animations/FadeIn";

// ── Material panels — intentional design placeholders ─────────────────────
function MaterialPanel({
  label,
  index,
}: {
  label: string;
  index: number;
}) {
  const patterns = [
    // ADU — architectural lines
    "repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.03) 48px)",
    // Remediation — diagonal hatching
    "repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,255,255,0.025) 23px)",
    // Consulting — blueprint grid
    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
  ];

  return (
    <div
      className="plate-concrete relative overflow-hidden w-full h-full min-h-[320px]"
      style={{ backgroundImage: patterns[index] || patterns[0], backgroundSize: index === 2 ? "32px 32px" : "auto" }}
    >
      {/* Large service number watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-numbers font-bold text-white leading-none"
          style={{ fontSize: "clamp(6rem, 14vw, 16rem)", opacity: 0.04, letterSpacing: "-0.04em" }}
        >
          0{index + 1}
        </span>
      </div>
      {/* Corner label */}
      <div className="absolute bottom-6 left-6">
        <span className="font-labels text-[9px] text-gray-700 tracking-[0.2em] uppercase border border-gray-800 px-2 py-1">
          {label}
        </span>
      </div>
      {/* Decorative corner lines */}
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-gray-800" />
      <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-gray-700" />
    </div>
  );
}

export default function ServicesPreview() {
  return (
    <section className="bg-black py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <FadeIn>
          <div className="mb-20 lg:mb-28">
            <span className="font-labels text-[10px] text-gray-600 tracking-[0.22em] uppercase">
              What We Do
            </span>
            <h2
              className="font-display font-bold text-white mt-5 tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Three Services.
              <br />
              <span style={{ color: "#2a2a2a" }}>One Standard.</span>
            </h2>
          </div>
        </FadeIn>

        {/* Alternating service sections */}
        <div className="space-y-1">
          {SERVICES.map((service, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={service.slug}
                className={`group flex flex-col lg:flex-row ${
                  isEven ? "" : "lg:flex-row-reverse"
                } border border-gray-900 hover:border-gray-800 transition-colors duration-500`}
              >
                {/* Text panel */}
                <FadeIn
                  direction={isEven ? "right" : "left"}
                  delay={0.1}
                  className="flex-[6] bg-black p-10 lg:p-14 xl:p-16 flex flex-col justify-between min-h-[360px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-numbers font-bold text-gray-800 text-6xl lg:text-7xl leading-none tracking-tight">
                        0{index + 1}
                      </span>
                      <span className="font-labels text-[9px] text-gray-700 tracking-[0.2em] uppercase border border-gray-800 px-2 py-1">
                        {service.short}
                      </span>
                    </div>

                    <h3
                      className="font-display font-bold text-white mb-6 leading-tight tracking-tight"
                      style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                    >
                      {service.slug === "adu" && "Accessory Dwelling Units. Built to Last."}
                      {service.slug === "remediation" && "Fix It Right. Fix It Once."}
                      {service.slug === "consulting" && "Clarity Before Commitment."}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-6">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-3 font-labels text-[11px] text-white tracking-[0.18em] uppercase border-b border-gray-700 pb-1 hover:border-white transition-colors duration-200 group/link"
                    >
                      Learn More
                      <span className="transition-transform duration-200 group-hover/link:translate-x-1">
                        →
                      </span>
                    </Link>
                    <div className="flex gap-2">
                      {service.details.slice(0, 2).map((d) => (
                        <span
                          key={d}
                          className="font-labels text-[9px] text-gray-700 border border-gray-800 px-2 py-1 tracking-wide"
                        >
                          {d.split(" ").slice(0, 2).join(" ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                {/* Material panel */}
                <FadeIn
                  direction={isEven ? "left" : "right"}
                  delay={0.2}
                  className="flex-[4] min-h-[280px] lg:min-h-0"
                >
                  <div className="h-full group-hover:opacity-90 transition-opacity duration-500">
                    <MaterialPanel label={service.title} index={index} />
                  </div>
                </FadeIn>
              </div>
            );
          })}
        </div>

        {/* Footer link */}
        <FadeIn delay={0.2} className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 font-labels text-[11px] text-gray-500 tracking-[0.18em] uppercase hover:text-white transition-colors duration-200 group"
          >
            View All Services
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
