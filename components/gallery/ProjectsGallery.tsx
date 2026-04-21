"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Link from "next/link";
import { PROJECTS, Project, ProjectCategory } from "@/lib/constants";
import Lightbox from "@/components/gallery/Lightbox";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import MagneticButton from "@/components/ui/MagneticButton";
import { AnimationController } from "@/utils/animationControl";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES: ("ALL" | ProjectCategory)[] = [
  "ALL",
  "ADU Construction",
  "Remediation",
  "Consulting",
];

// ── Designed plate (shows until real photo is dropped in) ─────────────────
function ProjectPlate({ project, index }: { project: Project; index: number }) {
  const patterns = [
    "repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.025) 48px)",
    "repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,255,255,0.02) 23px)",
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  ];
  return (
    <div
      className="w-full h-full plate-concrete"
      style={{ backgroundImage: patterns[index % 3], backgroundSize: index % 3 === 2 ? "32px 32px" : "auto" }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-numbers font-bold text-white leading-none" style={{ fontSize: "clamp(5rem, 12vw, 14rem)", opacity: 0.04 }}>
          0{project.id}
        </span>
      </div>
      <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-gray-800" />
      <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l border-gray-800" />
    </div>
  );
}

// ── Single project card ────────────────────────────────────────────────────
function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: (p: Project) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden cursor-pointer bg-gray-950"
      onClick={() => onClick(project)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105 saturate-[1.06] contrast-[1.03]"
          fallback={<ProjectPlate project={project} index={index} />}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-labels text-[10px] text-white tracking-[0.22em] uppercase bg-black/60 px-4 py-2 backdrop-blur-sm">
            View Project
          </span>
        </div>
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <span className="font-labels text-[9px] text-gray-300 tracking-[0.2em] uppercase bg-black/70 px-2 py-1 backdrop-blur-sm">
            {project.category}
          </span>
          {project.tempPhoto && (
            <span className="font-labels text-[8px] text-amber-300 tracking-[0.15em] uppercase bg-black/80 px-2 py-1 backdrop-blur-sm border border-amber-800/50">
              ★ Temp Photo
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase mb-2">{project.location}</div>
        <h2 className="font-display font-bold text-white text-lg leading-tight group-hover:text-gray-200 transition-colors duration-200">
          {project.title}
        </h2>
        <p className="font-labels text-[9px] text-gray-400 tracking-wide mt-2 line-clamp-1">{project.spec}</p>
      </div>
    </motion.div>
  );
}

// ── Featured large card ────────────────────────────────────────────────────
function FeaturedCard({ project, index, onClick }: { project: Project; index: number; onClick: (p: Project) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden cursor-pointer col-span-1 md:col-span-2 bg-gray-950"
      onClick={() => onClick(project)}
    >
      <div className="relative aspect-[16/7] overflow-hidden">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover transition-all duration-700 group-hover:scale-105 saturate-[1.06] contrast-[1.03]"
          fallback={<ProjectPlate project={project} index={index} />}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-labels text-[10px] text-white tracking-[0.22em] uppercase bg-black/60 px-4 py-2 backdrop-blur-sm">
            View Project
          </span>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase border border-gray-700 px-2 py-1">
              {project.category}
            </span>
            {project.tempPhoto && (
              <span className="font-labels text-[8px] text-amber-300 tracking-[0.15em] uppercase border border-amber-800/50 px-2 py-1">
                ★ Temp Photo
              </span>
            )}
          </div>
          <h2 className="font-display font-bold text-white leading-tight tracking-tight mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            {project.title}
          </h2>
          <div className="flex items-center gap-4">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase">{project.location}</span>
            <span className="w-px h-3 bg-gray-700" />
            <span className="font-labels text-[9px] text-gray-400 tracking-wide">{project.spec}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Hero — all 10 techniques: parallax, SplitType, hairline, strip, counter ──
function ProjectsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  useLayoutEffect(() => () => { if (splitRef.current) { try { splitRef.current.revert(); } catch {} } try { ctxRef.current?.revert(); } catch {} }, []);

  useEffect(() => {
    if (!AnimationController.shouldAnimate()) return;
    let mounted = true;
    let splitFrame = -1;
    let heroLineEl: HTMLElement | null = null;
    let herSplit: SplitType | null = null;
    const ctx = gsap.context(() => {
      // ── Technique 1: Triple-layer parallax ──────────────────────────────
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -15, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (midRef.current) {
        gsap.to(midRef.current, {
          yPercent: -8, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: 5, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }

      // ── Technique 10: Copper hairline scaleX scrub ──────────────────────
      if (hairlineRef.current) {
        gsap.fromTo(hairlineRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 55%", scrub: 1.2 },
        });
      }

      // Fix 10: once:true — counter fires on enter, never reverses
      if (counterRef.current) {
        const el = counterRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: PROJECTS.length, duration: 2, ease: "power2.out",
          immediateRender: false,
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        });
      }

      // ── Technique 2: SplitType char scatter exit on "Built to Last." ────
      splitFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        const heroLine = sectionRef.current?.querySelector<HTMLElement>(".proj-hero-line");
        if (heroLine && heroLine.isConnected) {
          heroLineEl = heroLine;
          const split = new SplitType(heroLine, { types: "chars" });
          herSplit = split;
          splitRef.current = split;
          const chars = split.chars ?? [];
          gsap.to(chars, {
            yPercent: -80, opacity: 0,
            stagger: { each: 0.014, from: "random" }, ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "30% top", end: "bottom top", scrub: 1.2 },
          });
          const lcpLine = headlineRef.current?.querySelector(".proj-lcp-line");
          if (lcpLine) {
            gsap.to(lcpLine, {
              opacity: 0, ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "25% top", end: "65% top", scrub: 1.2 },
            });
          }
        }
      });

      const fadeEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hero-fade");
      if (fadeEls?.length) {
        gsap.fromTo(fadeEls, { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.65, stagger: 0.1, delay: 0.3, ease: "power3.out",
        });
      }
    }, sectionRef);

    ctxRef.current = ctx;
    return () => {
      mounted = false;
      cancelAnimationFrame(splitFrame);
      if (herSplit && heroLineEl?.isConnected) { try { herSplit.revert(); } catch {} }
      splitRef.current = null;
      ctxRef.current = null; try { ctx.revert(); } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="projects-hero"
      className="relative bg-black overflow-hidden"
      style={{ minHeight: "55vh", position: "relative", zIndex: 1 }}
    >
      {/* Layer 1: bg image parallax */}
      <div
        ref={bgRef}
        className="absolute left-0 right-0"
        style={{
          top: "-15%", height: "130%",
          backgroundImage: "url('/images/projects/service-adu.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "contrast(1.05) saturate(0.7) brightness(0.25)",
        }}
        role="presentation"
        aria-hidden="true"
      />
      {/* Layer 2: mid overlay parallax */}
      <div
        ref={midRef}
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.9) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 pt-36 pb-16 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Copper hairline scrub */}
        <div
          ref={hairlineRef}
          style={{ height: 1, background: "#B87333", opacity: 0.5, transformOrigin: "left", marginBottom: "1.5rem" }}
        />

        <div className="flex items-end justify-between gap-8 mb-4">
          <span className="hero-fade font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block">
            Our Work
          </span>
          {/* Counter */}
          <div className="hero-fade text-right">
            <span className="font-numbers font-bold text-[#B87333] leading-none" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
              <span ref={counterRef}>15</span>
            </span>
            <span className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase ml-2">Projects</span>
          </div>
        </div>

        <h1
          ref={headlineRef}
          className="font-display font-bold text-white tracking-tight leading-[0.9] mb-6"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
        >
          <span className="proj-lcp-line block">Our Work.</span>
          <span className="block overflow-hidden" style={{ color: "rgba(255,255,255,0.40)" }}>
            <span className="proj-hero-line hero-line-animate block" style={{ animationDelay: "0.1s" }}>
              Built to Last.
            </span>
          </span>
        </h1>

        <p className="hero-fade text-gray-300 max-w-xl leading-relaxed mb-10">
          Every project below represents a real problem solved. Not just
          aesthetics — structural integrity, code compliance, and lasting value.
        </p>

        {/* ── Technique 8: MagneticButton ───────────────────────────────── */}
        <MagneticButton strength={0.25}>
          <Link
            href="/contact"
            className="hero-fade group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-colors duration-300 hover:text-white"
          >
            <span className="absolute inset-0 bg-[#B87333] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" aria-hidden="true" />
            <span className="relative">Discuss Your Project</span>
            <span className="relative transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </MagneticButton>
      </div>
    </section>
  );
}

// ── Horizontal projects strip — Technique 7 ───────────────────────────────
function ProjectsStrip() {
  const labels = ["ADU Construction", "Water Remediation", "Structural Repair", "Consulting", "South Bay CA", "Torrance"];

  return (
    <div
      className="bg-[#0a0a0a] border-b border-white/5 overflow-hidden py-3"
      style={{ position: "relative", zIndex: 2 }}
      aria-hidden="true"
    >
      <div
        className="flex gap-12 items-center"
        style={{ animation: "marqueeScroll 30s linear infinite", width: "max-content" }}
      >
        {[...labels, ...labels].map((label, i) => (
          <span key={i} className="font-labels text-[9px] text-gray-600 tracking-[0.28em] uppercase whitespace-nowrap flex items-center gap-12">
            {label}
            <span className="w-px h-3 bg-[#B87333]/30 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main gallery ───────────────────────────────────────────────────────────
export default function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState<"ALL" | ProjectCategory>("ALL");
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const filtered = activeCategory === "ALL" ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory);
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || filtered.length <= 1);
  const displayRest = featured ? rest : filtered;

  return (
    <>
      <ProjectsHero />
      <ProjectsStrip />

      {/* Filter tabs — Technique 6: Section overlap (sticky, rides over hero) */}
      <section className="bg-black border-y border-gray-900 sticky top-16 lg:top-20" style={{ zIndex: 30 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-0 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-4 px-5 font-labels text-[10px] tracking-[0.18em] uppercase whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeCategory === cat
                    ? "text-white border-[#B87333]"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-black py-12 lg:py-16 min-h-[60vh]" style={{ position: "relative", zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="font-labels text-[10px] text-gray-400 tracking-[0.18em] uppercase">
                    No projects in this category yet
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {featured && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      <FeaturedCard project={featured} index={0} onClick={setLightboxProject} />
                    </div>
                  )}
                  {displayRest.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                      {displayRest.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} onClick={setLightboxProject} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <p className="font-labels text-[9px] text-gray-500 tracking-[0.14em] uppercase mt-10 text-center">
            <span className="text-amber-500">★ Temp Photo</span>
            {" "}— stock images used as placeholders · Joe&apos;s professional photos replacing these shortly
          </p>
        </div>
      </section>

      <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
    </>
  );
}
