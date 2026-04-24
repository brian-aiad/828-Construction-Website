"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { ease } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* ── Full-color photo — image is the star ────────────────────────── */}
      <Image
        src="/images/hero/hero-night.jpg"
        alt="828 Construction — South Bay modern construction"
        fill
        priority
        quality={95}
        className="object-cover"
        style={{ filter: "contrast(1.12) saturate(0.9) brightness(1.0)" }}
      />

      {/* ── Gradient: bottom only — top of image completely visible ──────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* ── Copper line ──────────────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          height: "2px",
          background:
            "linear-gradient(to right, transparent 5%, #B87333 35%, #B87333 65%, transparent 95%)",
          opacity: 0.7,
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between max-w-7xl mx-auto w-full px-6 lg:px-12 pt-28 pb-10 lg:pb-14">

        {/* Top — clears fixed header, minimal editorial label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <span className="font-labels text-[10px] text-white/50 tracking-[0.25em] uppercase">
            Torrance, CA
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="font-labels text-[10px] text-white/50 tracking-[0.25em] uppercase">
            South Bay
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="font-labels text-[10px] text-white/50 tracking-[0.25em] uppercase">
            Est. 2025
          </span>
        </motion.div>

        {/* Bottom — headline + CTA, anchored to viewport floor */}
        <div>
          {/* Headline */}
          <div className="mb-8 overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: ease.out }}
              className="font-display font-bold text-white tracking-tight leading-[0.85]"
              style={{ fontSize: "clamp(4rem, 10.5vw, 10rem)" }}
            >
              Built with
              <br />
              Intent.
            </motion.h1>
          </div>

          {/* Bottom row: tagline left, CTAs right */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: ease.out }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            {/* Tagline */}
            <div>
              <p className="font-labels text-[10px] text-white/40 tracking-[0.18em] uppercase">
                ADU · Remediation · Consulting
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-black
                  px-8 py-3.5 font-labels text-[10px] tracking-[0.18em] uppercase
                  hover:bg-gray-100 transition-colors duration-200"
              >
                Request Estimate →
              </Link>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center border border-white/30 text-white
                  px-8 py-3.5 font-labels text-[10px] tracking-[0.18em] uppercase
                  hover:border-white transition-colors duration-200 font-numbers"
              >
                {SITE.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
