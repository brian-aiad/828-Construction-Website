"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SITE } from "@/lib/constants";

const taglines = [
  "Quality over quantity.",
  "Built with intention.",
  "20+ years. Zero shortcuts.",
  "Building science. Applied.",
  "Every detail matters.",
];

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTaglineIndex((i) => (i + 1) % taglines.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-black flex flex-col justify-end pt-20">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24 pt-32">
        {/* Label */}
        <div className="mb-8">
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            Torrance, CA · South Bay · Est. 2004
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-[var(--font-space-grotesk)] font-bold text-white leading-none tracking-tight mb-8">
          <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-9xl">
            Built with
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-white">
            Intent.
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-gray-600">
            Not by Accident.
          </span>
        </h1>

        {/* Rotating tagline */}
        <div className="mb-12 h-8">
          <p
            className={`text-lg text-gray-400 font-[var(--font-space-mono)] tracking-wide transition-opacity duration-400 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            — {taglines[taglineIndex]}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-black px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
          >
            Request a Consultation
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center border border-gray-700 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors"
          >
            Our Services
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-8 border-t border-gray-800 pt-10 max-w-xl">
          <div>
            <div className="font-[var(--font-space-grotesk)] font-bold text-3xl text-white">
              20+
            </div>
            <div className="text-xs text-gray-500 tracking-wider uppercase mt-1">
              Years Experience
            </div>
          </div>
          <div>
            <div className="font-[var(--font-space-grotesk)] font-bold text-3xl text-white">
              3
            </div>
            <div className="text-xs text-gray-500 tracking-wider uppercase mt-1">
              Core Services
            </div>
          </div>
          <div>
            <div className="font-[var(--font-space-grotesk)] font-bold text-3xl text-white">
              CA
            </div>
            <div className="text-xs text-gray-500 tracking-wider uppercase mt-1">
              Lic. #{SITE.license}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-gray-600" />
        <span className="text-xs text-gray-600 tracking-widest uppercase rotate-90 origin-center translate-x-6">
          Scroll
        </span>
      </div>
    </section>
  );
}
