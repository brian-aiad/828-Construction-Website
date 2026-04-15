"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, Project, ProjectCategory } from "@/lib/constants";
import Lightbox from "@/components/gallery/Lightbox";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import FadeIn from "@/components/animations/FadeIn";

const CATEGORIES: ("ALL" | ProjectCategory)[] = [
  "ALL",
  "ADU Construction",
  "Remediation",
  "Consulting",
];

// ── Designed plate (shows until real photo is dropped in) ─────────────────
function ProjectPlate({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const patterns = [
    "repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.025) 48px)",
    "repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,255,255,0.02) 23px)",
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  ];
  return (
    <div
      className="w-full h-full plate-concrete"
      style={{
        backgroundImage: patterns[index % 3],
        backgroundSize: index % 3 === 2 ? "32px 32px" : "auto",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-numbers font-bold text-white leading-none"
          style={{ fontSize: "clamp(5rem, 12vw, 14rem)", opacity: 0.04 }}
        >
          0{project.id}
        </span>
      </div>
      <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-gray-800" />
      <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l border-gray-800" />
    </div>
  );
}

// ── Single project card ────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: (p: Project) => void;
}) {
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
      {/* Image / fallback plate */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          fill
          className="object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
          fallback={
            <ProjectPlate project={project} index={index} />
          }
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500" />

        {/* "View" indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-labels text-[10px] text-white tracking-[0.22em] uppercase bg-black/60 px-4 py-2 backdrop-blur-sm">
            View Project
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-5 left-5">
          <span className="font-labels text-[9px] text-gray-300 tracking-[0.2em] uppercase bg-black/70 px-2 py-1 backdrop-blur-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="font-labels text-[9px] text-gray-600 tracking-[0.18em] uppercase mb-2">
          {project.location}
        </div>
        <h3 className="font-display font-bold text-white text-lg leading-tight group-hover:text-gray-200 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="font-labels text-[9px] text-gray-700 tracking-wide mt-2 line-clamp-1">
          {project.spec}
        </p>
      </div>
    </motion.div>
  );
}

// ── Featured large card ────────────────────────────────────────────────────
function FeaturedCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: (p: Project) => void;
}) {
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
          className="object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
          fallback={
            <ProjectPlate project={project} index={index} />
          }
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-labels text-[10px] text-white tracking-[0.22em] uppercase bg-black/60 px-4 py-2 backdrop-blur-sm">
            View Project
          </span>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
          <span className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase border border-gray-700 px-2 py-1 self-start mb-4">
            {project.category}
          </span>
          <h3
            className="font-display font-bold text-white leading-tight tracking-tight mb-2"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
            {project.title}
          </h3>
          <div className="flex items-center gap-4">
            <span className="font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase">
              {project.location}
            </span>
            <span className="w-px h-3 bg-gray-700" />
            <span className="font-labels text-[9px] text-gray-600 tracking-wide">
              {project.spec}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main gallery ───────────────────────────────────────────────────────────
export default function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState<"ALL" | ProjectCategory>(
    "ALL"
  );
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const filtered =
    activeCategory === "ALL"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || filtered.length <= 1);
  const displayRest = featured ? rest : filtered;

  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <FadeIn>
            <span className="font-labels text-[10px] text-gray-600 tracking-[0.22em] uppercase">
              Our Work
            </span>
            <h1
              className="font-display font-bold text-white mt-4 tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              Projects.
              <br />
              <span style={{ color: "#2a2a2a" }}>Real Work. Real Results.</span>
            </h1>
            <p className="text-gray-500 max-w-xl mt-8 leading-relaxed">
              Every project below represents a real problem solved. Not just
              aesthetics — structural integrity, code compliance, and lasting
              value.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-black border-y border-gray-900 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex gap-0 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-4 px-5 font-labels text-[10px] tracking-[0.18em] uppercase whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeCategory === cat
                    ? "text-white border-white"
                    : "text-gray-600 border-transparent hover:text-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-black py-12 lg:py-16 min-h-[60vh]">
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
                  <p className="font-labels text-[10px] text-gray-700 tracking-[0.18em] uppercase">
                    No projects in this category yet
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Featured card (if any) */}
                  {featured && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      <FeaturedCard
                        project={featured}
                        index={0}
                        onClick={setLightboxProject}
                      />
                    </div>
                  )}

                  {/* Rest in 3-column grid */}
                  {displayRest.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                      {displayRest.map((project, i) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={i}
                          onClick={setLightboxProject}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Photo-pending note */}
          <FadeIn delay={0.4} className="mt-10 text-center">
            <p className="font-labels text-[9px] text-gray-800 tracking-[0.18em] uppercase">
              Project photography in progress · Full portfolio expanding
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        project={lightboxProject}
        onClose={() => setLightboxProject(null)}
      />
    </>
  );
}
