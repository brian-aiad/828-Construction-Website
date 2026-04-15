"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { heroContainer, heroLine, ease } from "@/lib/animations";

const taglines = [
  "Quality over quantity.",
  "Built with purpose.",
  "20+ years building science.",
  "Torrance's trusted builder.",
  "Fewer pieces. Stronger impact.",
];

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineVisible(false);
      setTimeout(() => {
        setTaglineIndex((i) => (i + 1) % taglines.length);
        setTaglineVisible(true);
      }, 450);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex flex-col pt-20">
      {/* Blueprint grid */}
      <div className="absolute inset-0 blueprint-grid pointer-events-none" />

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent pointer-events-none"
        style={{ height: "70%", right: "12%" }}
      />

      {/* Giant 828 watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: ease.out }}
          className="font-numbers font-bold leading-none text-white"
          style={{
            fontSize: "clamp(10rem, 38vw, 52rem)",
            opacity: 0.042,
            letterSpacing: "-0.06em",
            userSelect: "none",
          }}
        >
          828
        </motion.span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-8">
          {/* Location label */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.0, ease: ease.out }}
            className="mb-12 flex items-center gap-4"
          >
            <span className="w-8 h-px bg-gray-700" />
            <span className="font-labels text-[11px] text-gray-500 tracking-[0.22em] uppercase">
              Torrance, CA &nbsp;·&nbsp; South Bay &nbsp;·&nbsp; Est. 2004
            </span>
          </motion.div>

          {/* Headline — staggered lines */}
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            {/* Line 1 */}
            <div className="overflow-hidden">
              <motion.div variants={heroLine}>
                <h1
                  className="font-display font-bold text-white leading-[0.88] tracking-tight"
                  style={{ fontSize: "clamp(3.8rem, 9.5vw, 8.5rem)" }}
                >
                  Built with
                </h1>
              </motion.div>
            </div>

            {/* Line 2 — indented */}
            <div className="overflow-hidden">
              <motion.div variants={heroLine} className="pl-[6vw] sm:pl-[8vw]">
                <span
                  className="block font-display font-bold text-white leading-[0.88] tracking-tight"
                  style={{ fontSize: "clamp(3.8rem, 9.5vw, 8.5rem)" }}
                >
                  Intent.
                </span>
              </motion.div>
            </div>

            {/* Line 3 — dimmed */}
            <div className="overflow-hidden">
              <motion.div variants={heroLine}>
                <span
                  className="block font-display font-bold leading-[0.88] tracking-tight"
                  style={{
                    fontSize: "clamp(3.8rem, 9.5vw, 8.5rem)",
                    color: "#2a2a2a",
                  }}
                >
                  Not by Accident.
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Rotating tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-12 h-5"
          >
            <p
              className={`font-labels text-[11px] text-gray-500 tracking-[0.2em] uppercase transition-all duration-500 ${
                taglineVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
            >
              &mdash;&nbsp; {taglines[taglineIndex]}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: ease.out }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:bg-gray-100 transition-colors duration-200"
            >
              Request a Consultation
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/services"
              className="group inline-flex items-center justify-center border border-gray-700 text-white px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:border-gray-400 transition-colors duration-200"
            >
              Our Services
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats bar — anchored to bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3, ease: ease.out }}
        className="relative z-10 mt-auto border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-3 divide-x divide-gray-800">
            {[
              { value: "20+", label: "Years Experience" },
              { value: "3", label: "Core Services" },
              { value: `#${SITE.license}`, label: "CA License" },
            ].map((stat) => (
              <div key={stat.label} className="py-6 pr-6 lg:pr-10 first:pl-0">
                <div className="font-numbers font-bold text-white text-2xl lg:text-3xl mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="font-labels text-[9px] text-gray-600 tracking-[0.18em] uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute right-6 lg:right-10 bottom-28 flex flex-col items-center gap-3 pointer-events-none"
      >
        <motion.div
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="w-px h-14 bg-gradient-to-b from-gray-600 to-transparent"
        />
        <span
          className="font-labels text-[9px] text-gray-700 tracking-[0.2em] uppercase"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "0.18em",
          }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
