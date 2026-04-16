"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import { ease } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSections() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);
  const content2Ref = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Parallax: image travels 25% of its height over the full 200vh scroll ──
      gsap.to(bgRef.current, {
        yPercent: 22,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // ── Section 1 content: fade out + drift up ────────────────────────────
      gsap.to(content1Ref.current, {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "33% top",
          scrub: 1,
        },
      });

      // ── Scroll indicator: fades out early ────────────────────────────────
      gsap.to(scrollLineRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "15% top",
          scrub: 1,
        },
      });

      // ── Section 2 content: fade in + drift up from below ─────────────────
      gsap.fromTo(
        content2Ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "28% top",
            end: "62% top",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    /* Wrapper spans 200vh — provides scroll distance for the sticky panel */
    <div ref={wrapperRef} style={{ height: "200vh" }}>
      {/* Sticky panel — stays pinned while user scrolls through wrapper */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Background image — scaled tall to allow parallax travel ─────── */}
        <div
          ref={bgRef}
          className="absolute left-0 right-0"
          style={{ top: "-15%", height: "130%" }}
        >
          <Image
            src="/images/hero/hero-night.png"
            alt="828 Construction — South Bay outdoor living"
            fill
            priority
            quality={95}
            className="object-cover"
            style={{ filter: "contrast(1.04) saturate(1.1) brightness(1.0)" }}
          />
        </div>

        {/* ── Base gradient ────────────────────────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        {/* ── Copper accent line ───────────────────────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: "2px",
            background:
              "linear-gradient(to right, transparent 5%, #B87333 35%, #B87333 65%, transparent 95%)",
            opacity: 0.7,
          }}
        />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 CONTENT — fades out as user scrolls
        ══════════════════════════════════════════════════════════════════ */}
        <div
          ref={content1Ref}
          className="absolute inset-0 z-10 flex flex-col justify-between max-w-7xl mx-auto w-full px-6 lg:px-12 pt-28 pb-10 lg:pb-14"
        >
          {/* Top editorial label */}
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
              Est. 2004
            </span>
          </motion.div>

          {/* Bottom — headline + CTAs, anchored to floor */}
          <div>
            {/* Headline: masked line-by-line reveal (editorial style) */}
            <h1
              className="font-display font-bold text-white tracking-tight leading-[0.88] mb-8"
              style={{ fontSize: "clamp(5rem, 13vw, 13rem)" }}
            >
              {/* Line 1: full-line reveal */}
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.0, delay: 0.2, ease: ease.out }}
                >
                  Built with
                </motion.span>
              </span>

              {/* Line 2: character-by-character on "Intent." */}
              <span className="block overflow-hidden">
                <span className="flex" aria-label="Intent.">
                  {["I","n","t","e","n","t","."].map((char, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      aria-hidden="true"
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        duration: 0.75,
                        delay: 0.36 + i * 0.055,
                        ease: ease.out,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* Services label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: ease.out }}
                className="font-labels text-[10px] text-white/40 tracking-[0.18em] uppercase"
              >
                ADU · Remediation · Consulting
              </motion.p>

              {/* CTAs — staggered slide up */}
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.62, ease: ease.out }}
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white text-black
                      px-8 py-3.5 font-labels text-[10px] tracking-[0.18em] uppercase
                      hover:bg-gray-100 transition-colors duration-200"
                  >
                    Request Estimate →
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.76, ease: ease.out }}
                >
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex items-center justify-center border border-white/30 text-white
                      px-8 py-3.5 font-labels text-[10px] tracking-[0.18em] uppercase
                      hover:border-white transition-colors duration-200 font-numbers"
                  >
                    {SITE.phone}
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scroll indicator — animated mouse ────────────────────────────── */}
        <motion.div
          ref={scrollLineRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none"
        >
          <span className="font-labels text-[8px] text-white/30 tracking-[0.3em] uppercase">
            Scroll
          </span>
          {/* Mouse outline */}
          <div className="relative w-[1.375rem] h-[2.25rem] rounded-[0.75rem] border border-white/25">
            {/* Scroll wheel — animates down then fades */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-[0.4rem] w-[3px] h-[6px] bg-white/50 rounded-full"
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 CONTENT — fades in on scroll
        ══════════════════════════════════════════════════════════════════ */}
        <div
          ref={content2Ref}
          className="absolute inset-0 z-10"
          style={{ opacity: 0 }}
        >
          {/* Extra overlay for readability at section 2 — kept light to let the pool colors show */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Content anchored to bottom */}
          <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto w-full px-6 lg:px-12 pb-14 lg:pb-20">
            <div className="relative z-10">
              <span className="font-labels text-[9px] text-white/35 tracking-[0.28em] uppercase mb-5 block">
                Torrance · Redondo Beach · Manhattan Beach
              </span>
              <h2
                className="font-display font-bold text-white tracking-tight leading-[0.88] mb-10"
                style={{ fontSize: "clamp(3.2rem, 8vw, 8rem)" }}
              >
                South Bay&apos;s contractor
                <br />
                for work that lasts.
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-4
                    font-labels text-[10px] tracking-[0.18em] uppercase
                    hover:bg-gray-100 transition-colors duration-200"
                >
                  Request Estimate →
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4
                    font-labels text-[10px] tracking-[0.18em] uppercase
                    hover:border-white/70 transition-colors duration-200"
                >
                  About 828
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
