"use client";

import Link from "next/link";
import { PROCESS_STEPS } from "@/lib/constants";
import FadeIn from "@/components/animations/FadeIn";

export default function ProcessPreview() {
  return (
    <section className="bg-black py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <FadeIn className="mb-20 lg:mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div>
              <span className="font-labels text-[10px] text-gray-600 tracking-[0.22em] uppercase">
                How We Work
              </span>
              <h2
                className="font-display font-bold text-white mt-4 tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
              >
                The Process.
                <br />
                <span style={{ color: "#2a2a2a" }}>No Surprises.</span>
              </h2>
            </div>
            <Link
              href="/process"
              className="font-labels text-[11px] text-gray-600 tracking-[0.18em] uppercase hover:text-white transition-colors duration-200 group inline-flex items-center gap-2 self-start sm:self-auto"
            >
              Full Process
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </FadeIn>

        {/* Timeline — horizontal rule style */}
        <div className="space-y-0">
          {PROCESS_STEPS.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.08}>
              <div className="group border-b border-gray-900 hover:border-gray-700 transition-colors duration-300">
                <div className="py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                  {/* Number */}
                  <div className="lg:col-span-1 flex items-center gap-4">
                    <span className="font-numbers font-bold text-gray-800 text-4xl lg:text-5xl tracking-tight group-hover:text-gray-600 transition-colors duration-300 leading-none">
                      {step.number}
                    </span>
                  </div>

                  {/* Rule line — hidden on mobile */}
                  <div className="hidden lg:flex lg:col-span-1 items-center pt-3">
                    <div className="w-full h-px bg-gray-800 group-hover:bg-gray-600 transition-colors duration-300" />
                  </div>

                  {/* Title */}
                  <div className="lg:col-span-3">
                    <h3 className="font-display font-bold text-white text-xl lg:text-2xl tracking-tight leading-tight">
                      {step.title}
                    </h3>
                    <div className="mt-2 w-8 h-px bg-gray-700 group-hover:w-14 group-hover:bg-white transition-all duration-500" />
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-5">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:flex lg:col-span-2 items-center justify-end">
                    <span className="font-labels text-[10px] text-gray-800 tracking-[0.18em] uppercase group-hover:text-white transition-colors duration-300">
                      Step {step.number}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={0.3} className="mt-16">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:bg-gray-100 transition-colors group"
          >
            Start Step 01 — Free Consultation
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
