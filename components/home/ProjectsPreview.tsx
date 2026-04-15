"use client";

import Link from "next/link";
import { PROJECTS } from "@/lib/constants";
import FadeIn from "@/components/animations/FadeIn";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

function PreviewPlate({ index, label }: { index: number; label: string }) {
  const patterns = [
    "repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.025) 48px)",
    "repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(255,255,255,0.02) 23px)",
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  ];
  return (
    <div
      className="absolute inset-0 plate-concrete"
      style={{
        backgroundImage: patterns[index % 3],
        backgroundSize: index % 3 === 2 ? "32px 32px" : "auto",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-numbers font-bold text-white leading-none"
          style={{
            fontSize: "clamp(4rem, 10vw, 12rem)",
            opacity: 0.04,
            letterSpacing: "-0.04em",
          }}
        >
          0{index + 1}
        </span>
      </div>
      <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-gray-800" />
    </div>
  );
}

const previewProjects = PROJECTS.slice(0, 3);

export default function ProjectsPreview() {
  const [featured, ...rest] = previewProjects;

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
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </FadeIn>

        {/* Featured project */}
        <FadeIn delay={0.1} className="mb-1">
          <Link href="/projects" className="group block relative aspect-[16/7] overflow-hidden bg-gray-950">
            <ImageWithFallback
              src={featured.image}
              alt={featured.title}
              fill
              priority
              className="object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
              fallback={<PreviewPlate index={0} label={featured.title} />}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
              <span className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase border border-gray-700 px-2 py-1 self-start mb-4">
                {featured.category}
              </span>
              <h3
                className="font-display font-bold text-white leading-tight tracking-tight"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
              >
                {featured.title}
              </h3>
              <p className="font-labels text-[9px] text-gray-500 tracking-wide mt-2">
                {featured.location} · {featured.spec}
              </p>
            </div>
          </Link>
        </FadeIn>

        {/* Two smaller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {rest.map((project, i) => (
            <FadeIn key={project.id} delay={0.15 + i * 0.1}>
              <Link
                href="/projects"
                className="group block relative aspect-[4/3] overflow-hidden bg-gray-950"
              >
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
                  fallback={<PreviewPlate index={i + 1} label={project.title} />}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="font-labels text-[9px] text-gray-500 tracking-[0.18em] uppercase">
                    {project.category}
                  </span>
                  <h3 className="font-display font-bold text-white text-base mt-1 leading-tight">
                    {project.title}
                  </h3>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* Photo note */}
        <FadeIn delay={0.4} className="mt-8 text-center">
          <p className="font-labels text-[9px] text-gray-300 tracking-[0.18em] uppercase">
            Project photography in progress · Full portfolio at{" "}
            <Link href="/projects" className="underline">
              /projects
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
