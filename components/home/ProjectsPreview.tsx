"use client";

import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

const projects = [
  {
    id: 1,
    title: "Torrance ADU Build",
    category: "ADU Construction",
    location: "Torrance, CA",
    spec: "480 sq ft · Detached · Fully permitted",
    tone: "from-gray-950 to-gray-900",
    size: "lg", // featured
  },
  {
    id: 2,
    title: "Redondo Beach Remediation",
    category: "Remediation",
    location: "Redondo Beach, CA",
    spec: "Structural remediation · Water intrusion source corrected",
    tone: "from-gray-900 to-gray-800",
    size: "sm",
  },
  {
    id: 3,
    title: "South Bay Consultation",
    category: "Consulting",
    location: "Manhattan Beach, CA",
    spec: "Pre-purchase feasibility · $1.2M property",
    tone: "from-gray-800 to-gray-900",
    size: "sm",
  },
];

// ── Full-bleed project plate ──────────────────────────────────────────────
function ProjectPlate({
  project,
  featured = false,
}: {
  project: (typeof projects)[0];
  featured?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden ${
        featured ? "aspect-[16/7]" : "aspect-[16/8]"
      } bg-gradient-to-br ${project.tone}`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.4]" />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Large project number watermark */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span
          className="font-numbers font-bold text-white leading-none"
          style={{
            fontSize: "clamp(6rem, 18vw, 20rem)",
            opacity: 0.03,
            letterSpacing: "-0.05em",
          }}
        >
          0{project.id}
        </span>
      </div>

      {/* Corner bracket decoration */}
      <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-white/10 group-hover:border-white/20 transition-colors duration-500" />
      <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-white/10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
        {/* Category badge */}
        <div className="mb-4">
          <span className="font-labels text-[9px] text-gray-400 tracking-[0.22em] uppercase border border-gray-700 px-2 py-1">
            {project.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold text-white leading-tight tracking-tight mb-2 group-hover:text-gray-100 transition-colors duration-300"
          style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
        >
          {project.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-4">
          <span className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase">
            {project.location}
          </span>
          <span className="w-px h-3 bg-gray-700" />
          <span className="font-labels text-[9px] text-gray-600 tracking-wide">
            {project.spec}
          </span>
        </div>
      </div>

      {/* Hover reveal */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-500" />
    </div>
  );
}

export default function ProjectsPreview() {
  return (
    <section className="bg-white py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <FadeIn className="mb-16 lg:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div>
              <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
                Our Work
              </span>
              <h2
                className="font-display font-bold text-black mt-4 tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
              >
                Projects.
                <br />
                <span className="text-gray-200">Real Work. Real Results.</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="font-labels text-[11px] text-gray-400 tracking-[0.18em] uppercase hover:text-black transition-colors duration-200 group inline-flex items-center gap-2 self-start sm:self-auto"
            >
              All Projects
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </FadeIn>

        {/* Featured project */}
        <FadeIn delay={0.1} className="mb-1">
          <ProjectPlate project={projects[0]} featured />
        </FadeIn>

        {/* Two smaller projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {projects.slice(1).map((project, i) => (
            <FadeIn key={project.id} delay={0.15 + i * 0.1}>
              <ProjectPlate project={project} />
            </FadeIn>
          ))}
        </div>

        {/* Photo pending notice */}
        <FadeIn delay={0.3} className="mt-8 text-center">
          <p className="font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase">
            Project photography in progress — full portfolio coming soon
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
