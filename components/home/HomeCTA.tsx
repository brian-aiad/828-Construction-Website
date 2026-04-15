"use client";

import Link from "next/link";
import { SITE } from "@/lib/constants";
import FadeIn from "@/components/animations/FadeIn";

export default function HomeCTA() {
  return (
    <section className="relative bg-black py-28 lg:py-40 overflow-hidden">
      {/* Background "828" watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-numbers font-bold text-white leading-none"
          style={{
            fontSize: "clamp(12rem, 35vw, 42rem)",
            opacity: 0.025,
            letterSpacing: "-0.06em",
          }}
        >
          828
        </span>
      </div>

      {/* Blueprint grid */}
      <div className="absolute inset-0 blueprint-grid" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <FadeIn>
            <span className="font-labels text-[10px] text-gray-600 tracking-[0.22em] uppercase block mb-6">
              Ready to Start?
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2
              className="font-display font-bold text-white tracking-tight leading-[0.9] mb-8"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Let&apos;s Talk About
              <br />
              Your Project.
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-gray-500 text-base leading-relaxed mb-12 max-w-xl">
              Whether you&apos;re planning an ADU, dealing with a structural issue, or
              need expert advice before committing — we&apos;re here to help. No
              pressure. No jargon. Just honest expertise.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:bg-gray-100 transition-colors"
            >
              Get a Free Estimate
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center border border-gray-700 text-white px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:border-gray-400 transition-colors font-numbers"
            >
              {SITE.phone}
            </a>
          </FadeIn>

          <FadeIn delay={0.4} className="mt-12 pt-12 border-t border-gray-900">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {[
                `CA License #${SITE.license}`,
                "Torrance · Redondo Beach · Manhattan Beach",
                "South Bay, CA",
                "Free Consultations",
              ].map((item) => (
                <span
                  key={item}
                  className="font-labels text-[9px] text-gray-700 tracking-[0.15em] uppercase"
                >
                  {item}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
