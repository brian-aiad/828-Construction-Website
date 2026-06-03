"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, Project, ProjectCategory, SITE } from "@/lib/constants";
import Lightbox from "@/components/gallery/Lightbox";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";
import SectionMotionBackdrop from "@/components/system/SectionMotionBackdrop";
import { lqip } from "@/lib/image-placeholders";

gsap.registerPlugin(ScrollTrigger);

// Dark 1×1 SVG — shows instantly while real image loads, no blank flash
function imgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

type Filter = "All" | ProjectCategory;

const CATEGORY_ORDER: ProjectCategory[] = ["Bath Remodel", "ADU Construction", "Remediation", "Consulting"];
const MAX_HERO_PROJECTS = 5;
const MAX_INDEX_PROJECTS = 5;

function cleanText(value: string) {
  return value
    .replace(/\u00c2\u00b7/g, "/")
    .replace(/\u00e2\u20ac\u201d/g, "-")
    .replace(/\u00e2\u20ac\u201c/g, "-")
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u0153|\u00e2\u20ac\u009d/g, '"');
}

function projectImage(project: Project) {
  return project.image;
}

function hasRealPhoto(project: Project) {
  return !project.tempPhoto;
}

function categorySortValue(category: ProjectCategory) {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function categoryList(projects: Project[]): Filter[] {
  const found = Array.from(new Set(projects.map((project) => project.category)));
  found.sort((a, b) => categorySortValue(a) - categorySortValue(b));
  return ["All", ...found];
}

function archiveSort(projects: Project[]) {
  return [...projects].sort((a, b) => {
    const rankA = a.portfolioRank ?? Number.POSITIVE_INFINITY;
    const rankB = b.portfolioRank ?? Number.POSITIVE_INFINITY;
    if (rankA !== rankB) return rankA - rankB;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return categorySortValue(a.category) - categorySortValue(b.category) || a.id - b.id;
  });
}

function diverseProjectSet(projects: Project[], limit: number) {
  const ordered = archiveSort(projects);
  const selected: Project[] = [];

  CATEGORY_ORDER.forEach((category) => {
    const match = ordered.find(
      (project) => project.category === category && !selected.some((item) => item.id === project.id)
    );
    if (match) selected.push(match);
  });

  ordered.forEach((project) => {
    if (selected.length < limit && !selected.some((item) => item.id === project.id)) {
      selected.push(project);
    }
  });

  return selected.slice(0, limit);
}

function heroProjectSet(projects: Project[]) {
  const heroReady = projects.filter((project) => project.heroReady);
  return archiveSort(heroReady.length ? heroReady : projects).slice(0, MAX_HERO_PROJECTS);
}

function PendingProjectPlate({
  project,
  index,
  compact = false,
}: {
  project: Project;
  index?: number;
  compact?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#111] text-white">
      <div className="absolute inset-0 blueprint-grid opacity-[0.18]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(123,45,38,0.20),transparent_34%),linear-gradient(135deg,#161616_0%,#080808_72%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-white/12" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-[var(--color-accent)]/45" />
      <div className="relative z-10 flex h-full flex-col justify-between p-4 lg:p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="font-labels text-[8px] uppercase tracking-[0.2em] text-white/38">
            Documentation pending
          </span>
          {typeof index === "number" && (
            <span className="font-numbers text-xs font-bold text-white/24">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
        <div>
          <span className="mb-4 block h-px w-12 bg-[var(--color-accent)]/70" />
          <h3 className={`${compact ? "text-2xl" : "text-[clamp(1.8rem,4vw,4rem)]"} max-w-xl font-editorial leading-[0.9] text-white`}>
            {cleanText(project.title)}
          </h3>
          <p className="mt-4 max-w-sm font-labels text-[8px] uppercase leading-5 tracking-[0.16em] text-white/34">
            Scope logged. Photography pending.
          </p>
        </div>
      </div>
    </div>
  );
}

function usePortfolioMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => {
    try {
      ctxRef.current?.revert();
    } catch {}
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      window.innerWidth < 1024 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>(".portfolio-reveal");
      const tiles = gsap.utils.toArray<HTMLElement>(".portfolio-tile");
      const lines = gsap.utils.toArray<HTMLElement>(".draw-line");
      const contactFrames = gsap.utils.toArray<HTMLElement>(".archive-frame");

      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 58%",
              scrub: 1.35,
            },
          }
        );
      });

      contactFrames.forEach((el, index) => {
        gsap.fromTo(
          el,
          {
            autoAlpha: 0,
            y: 42 + index * 3,
            rotate: index % 2 === 0 ? -1.6 : 1.2,
            clipPath: "inset(12% 0% 12% 0%)",
          },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            delay: index * 0.035,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          }
        );

        const image = el.querySelector("img");
        if (image) {
          gsap.to(image, {
            yPercent: index % 2 === 0 ? -8 : 6,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.8 },
          });
        }
      });

      tiles.forEach((el, index) => {
        gsap.fromTo(
          el,
          {
            y: 34,
            clipPath: index % 3 === 0 ? "inset(0% 0% 18% 0%)" : "inset(14% 0% 0% 0%)",
          },
          {
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 58%", scrub: 1.35 },
          }
        );
      });

      lines.forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 62%",
              scrub: 1,
            },
          }
        );
      });
    }, rootRef);

    ctxRef.current = ctx;
    return () => {
      ctxRef.current = null;
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return rootRef;
}

function ProjectIndexRow({
  project,
  active,
  number,
  onSelect,
  onOpen,
}: {
  project: Project;
  active: boolean;
  number: number;
  onSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onPointerEnter={onSelect}
      onFocus={onSelect}
      onMouseDown={onSelect}
      onClick={onOpen}
      className={`index-row group relative grid w-full grid-cols-[3rem_1fr] gap-4 overflow-hidden border px-4 py-4 text-left transition-colors sm:grid-cols-[4rem_1fr_7rem] sm:items-center ${
        active ? "border-white/24 bg-white/[0.055] text-white" : "border-white/10 bg-white/[0.018] text-white/60 hover:border-white/20 hover:bg-white/[0.035] hover:text-white"
      }`}
      style={{ opacity: 1, transform: "none", visibility: "visible" }}
    >
      <span
        className={`absolute bottom-0 left-0 top-0 w-[3px] bg-[var(--color-accent)] transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
      <span className={`font-numbers text-xl font-bold leading-none ${active ? "text-[var(--color-accent)]" : "text-white/24"}`}>
        {String(number).padStart(2, "0")}
      </span>
      <span>
        <span className="block font-editorial text-[clamp(1.45rem,2.45vw,2.7rem)] leading-[0.94]">
          {cleanText(project.title)}
        </span>
        <span className="mt-2 block font-labels text-[8px] uppercase leading-5 tracking-[0.16em] text-white/36">
          {project.category} / {cleanText(project.location)} / {cleanText(project.spec)}
        </span>
      </span>
      <span className={`hidden justify-self-end border px-4 py-3 font-labels text-[8px] uppercase tracking-[0.16em] transition-colors sm:block ${
        active ? "border-white/28 text-white/70" : "border-white/12 text-white/38 group-hover:border-white/30 group-hover:text-white"
      }`}>
        Open
      </span>
    </button>
  );
}

function ProjectWallTile({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const spanClass = index % 9 === 0 || index % 9 === 5
    ? "md:col-span-2 md:row-span-2"
    : index % 9 === 2
      ? "md:row-span-2"
      : "";

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className={`portfolio-tile group relative min-h-[18rem] overflow-hidden bg-black text-left ${spanClass}`}
    >
      {hasRealPhoto(project) ? (
        <>
          <Image
            src={projectImage(project)}
            alt={project.title}
            fill
            loading="lazy"
            sizes={spanClass.includes("col-span-2") ? "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 52vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 28vw"}
            placeholder="blur"
            blurDataURL={lqip(projectImage(project))}
            onError={imgError}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
            style={{ filter: "contrast(1.05) saturate(1.04)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/14 to-transparent" />
        </>
      ) : (
        <PendingProjectPlate project={project} index={index} />
      )}
      <div className="absolute left-4 top-4 flex items-center gap-3">
        <span className="h-px w-8 bg-[var(--color-accent)]" />
        <span className="font-labels text-[8px] uppercase tracking-[0.18em] text-white/52">
          {project.category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="font-labels text-[8px] uppercase tracking-[0.18em] text-white/38">
          {cleanText(project.location)}
        </div>
        <h3 className="mt-2 max-w-lg font-editorial text-[clamp(1.55rem,2.6vw,3rem)] leading-[0.94] text-white">
          {cleanText(project.title)}
        </h3>
      </div>
    </button>
  );
}

function HeroProjectFrame({
  project,
  index,
  onOpen,
  className = "",
  size = "wide",
  hero = false,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
  className?: string;
  size?: "wide" | "tall" | "small";
  hero?: boolean;
}) {
  const sizes = hero
    ? size === "wide"
      ? "(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 56vw"
      : size === "tall"
        ? "(max-width: 768px) 100vw, (max-width: 1200px) 42vw, 34vw"
        : "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 28vw"
    : size === "wide"
      ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42vw"
      : size === "tall"
        ? "(max-width: 768px) 100vw, (max-width: 1200px) 34vw, 28vw"
        : "(max-width: 768px) 50vw, (max-width: 1200px) 24vw, 18vw";
  const titleClass =
    size === "small"
      ? "text-[clamp(1.15rem,1.7vw,1.8rem)] leading-[0.96]"
      : "text-[clamp(1.65rem,3vw,3.4rem)] leading-[0.9]";

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className={`group relative min-h-[14rem] overflow-hidden bg-black text-left ${className}`}
    >
      {hasRealPhoto(project) ? (
        <>
          <Image
            src={projectImage(project)}
            alt={project.title}
            fill
            loading={hero || index === 0 ? "eager" : "lazy"}
            fetchPriority={hero && index === 0 ? "high" : "auto"}
            quality={hero ? 92 : 88}
            sizes={sizes}
            placeholder="blur"
            blurDataURL={lqip(projectImage(project))}
            onError={imgError}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            style={{ filter: "contrast(1.03) saturate(1.02)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/6 to-transparent" />
        </>
      ) : (
        <PendingProjectPlate project={project} index={index} />
      )}
      <div className="absolute left-4 top-4 flex items-center gap-3">
        <span className="font-numbers text-xs font-bold text-white/36">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px w-9 bg-[var(--color-accent)]/75" />
        <span className="font-labels text-[8px] uppercase tracking-[0.2em] text-white/48">
          {project.category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
        <span className="font-labels text-[8px] uppercase tracking-[0.2em] text-white/44">
          {cleanText(project.location)}
        </span>
        <h2 className={`mt-2 max-w-xl font-editorial text-white ${titleClass}`}>
          {cleanText(project.title)}
        </h2>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 group-hover:scale-x-100" />
    </button>
  );
}

function PortfolioHero({
  projects,
  categories,
  onOpen,
}: {
  projects: Project[];
  categories: Filter[];
  onOpen: (project: Project) => void;
}) {
  const scopeLine = categories.filter((category) => category !== "All").join(" / ");
  const heroClasses = [
    "lg:col-span-4 lg:row-span-2",
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-6",
    "lg:col-span-6",
  ];
  const heroSizes: Array<"wide" | "tall" | "small"> = ["tall", "small", "small", "wide", "wide"];

  return (
    <section className="relative overflow-hidden bg-black px-4 pb-4 pt-24 text-white sm:px-6 lg:px-8 lg:pt-28">
      <DraftingMotionLayer intensity="quiet" variant="intro" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_14%,rgba(123,45,38,0.14),transparent_28%)]" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[92rem]">
        <div className="grid auto-rows-[16rem] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[15.5rem]">
          <div className="relative row-span-2 flex min-h-[31rem] flex-col gap-10 border border-white/10 bg-white/[0.025] p-5 backdrop-blur-sm sm:col-span-2 sm:min-h-[29rem] lg:col-span-5 lg:row-span-2 lg:min-h-0 lg:justify-between lg:gap-0 lg:p-7">
            <div className="absolute -left-px top-7 hidden h-24 w-px bg-[var(--color-accent)]/60 lg:block" aria-hidden="true" />
            <div>
              <span className="font-labels text-[9px] uppercase tracking-[0.24em] text-white/36">
                Selected residential work
              </span>
              <h1 className="mt-4 max-w-4xl font-editorial text-[clamp(3rem,7.5vw,8.2rem)] leading-[0.82] tracking-normal">
                Remodels, ADUs, repairs.
              </h1>
            </div>
            <div>
              <p className="max-w-md text-sm leading-7 text-white/54">
                Browse finished work by scope, then open a project for the complete photo set.
              </p>
              <div className="mt-5 border-t border-white/10 pt-4 font-labels text-[8px] uppercase leading-5 tracking-[0.18em] text-white/34">
                {scopeLine}
              </div>
            </div>
          </div>

          {projects.slice(0, MAX_HERO_PROJECTS).map((project, index) => {
            return (
              <HeroProjectFrame
                key={project.id}
                project={project}
                index={index}
                onOpen={onOpen}
                size={heroSizes[index] ?? "small"}
                hero
                className={`min-h-0 ${heroClasses[index] ?? "lg:col-span-3"}`}
              />
            );
          })}
          {projects.length === 0 && (
            <div className="col-span-2 row-span-2 border border-white/10 bg-[#101010] p-6">
              <div className="flex h-full flex-col justify-end">
                <span className="font-labels text-[9px] uppercase tracking-[0.22em] text-white/34">
                  Archive pending
                </span>
                <h2 className="mt-4 font-editorial text-[clamp(2rem,5vw,4rem)] leading-[0.9]">
                  Project photography will appear here.
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function PortfolioContent() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const rootRef = usePortfolioMotion();

  const portfolioProjects = useMemo(() => archiveSort(PROJECTS.filter(hasRealPhoto)), []);
  const heroProjects = useMemo(() => heroProjectSet(portfolioProjects), [portfolioProjects]);
  const indexProjects = useMemo(() => diverseProjectSet(portfolioProjects, MAX_INDEX_PROJECTS), [portfolioProjects]);
  const wallProjects = portfolioProjects;
  const categories = useMemo(() => categoryList(portfolioProjects), [portfolioProjects]);
  const [activeIndexId, setActiveIndexId] = useState(indexProjects[0]?.id ?? PROJECTS[0].id);

  const activeIndexProject = useMemo(
    () => indexProjects.find((project) => project.id === activeIndexId) ?? indexProjects[0] ?? PROJECTS[0],
    [activeIndexId, indexProjects]
  );

  useEffect(() => {
    indexProjects.forEach((project) => {
      if (!hasRealPhoto(project)) return;
      const image = new window.Image();
      image.decoding = "async";
      image.src = projectImage(project);
    });
  }, [indexProjects]);

  const filteredProjects = useMemo(() => {
    return activeFilter === "All"
      ? wallProjects
      : wallProjects.filter((project) => project.category === activeFilter);
  }, [activeFilter, wallProjects]);
  const categoryCount = (category: Filter) => {
    if (category === "All") return wallProjects.length;
    return wallProjects.filter((project) => project.category === category).length;
  };
  const visibleCategories = categories.filter((category) => category === "All" || categoryCount(category) > 0);

  return (
    <div ref={rootRef} className="bg-[#f5f0e9] text-black">
      <PortfolioHero projects={heroProjects} categories={categories} onOpen={setLightboxProject} />

      <section className="relative bg-black px-6 pb-14 pt-24 text-white lg:px-12 lg:pb-20 lg:pt-28">
        <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.14]" />
        <div className="absolute inset-y-0 left-0 hidden w-px bg-white/12 lg:block" />
        <div className="absolute bottom-10 right-10 hidden h-32 w-32 border border-white/10 lg:block" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.94fr] lg:items-start">
          <div>
            <div className="portfolio-reveal mb-7 max-w-2xl">
              <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-white/38">
                Case index
              </span>
              <h2 className="mt-4 font-editorial text-[clamp(2.7rem,5.8vw,5.8rem)] leading-[0.86]">
                Project index
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setLightboxProject(activeIndexProject)}
              className="mb-8 block w-full text-left lg:hidden"
            >
              <div className="mb-3 flex items-center justify-between border-y border-white/12 py-3">
                <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/46">
                  Selected preview
                </span>
                <span className="font-numbers text-sm font-bold text-[var(--color-accent)]">
                  {String(indexProjects.findIndex((project) => project.id === activeIndexProject.id) + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="relative min-h-[18rem] overflow-hidden border border-white/12 bg-[#111]">
                {hasRealPhoto(activeIndexProject) ? (
                  <>
                    <Image
                      key={`mobile-${activeIndexProject.id}`}
                      src={projectImage(activeIndexProject)}
                      alt={activeIndexProject.title}
                      fill
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      placeholder="blur"
                      blurDataURL={lqip(projectImage(activeIndexProject))}
                      onError={imgError}
                      className="object-cover"
                      style={{ filter: "contrast(1.06) saturate(1.04)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/10 to-transparent" />
                  </>
                ) : (
                  <PendingProjectPlate project={activeIndexProject} compact />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/42">
                    {activeIndexProject.category}
                  </span>
                  <h3 className="mt-3 font-editorial text-[clamp(1.9rem,10vw,3rem)] leading-[0.9] text-white">
                    {cleanText(activeIndexProject.title)}
                  </h3>
                </div>
              </div>
            </button>
            <div className="draw-line mb-3 h-px origin-left bg-[var(--color-accent)]/58" />
            <div className="grid gap-2">
              {indexProjects.map((project, index) => (
                <ProjectIndexRow
                  key={project.id}
                  project={project}
                  active={project.id === activeIndexProject.id}
                  number={index + 1}
                  onSelect={() => setActiveIndexId(project.id)}
                  onOpen={() => setLightboxProject(project)}
                />
              ))}
            </div>
          </div>

          <div
            className="hidden lg:block lg:self-stretch"
            style={{ opacity: 1, transform: "none", visibility: "visible" }}
          >
            <div className="sticky top-24">
              <button
                type="button"
                onClick={() => setLightboxProject(activeIndexProject)}
                className="group block w-full text-left"
                aria-live="polite"
              >
                <div className="mb-4 flex items-center justify-between border-y border-white/12 py-3">
                  <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/46">
                    Selected preview / {activeIndexProject.category}
                  </span>
                  <span className="font-numbers text-sm font-bold text-[var(--color-accent)]">
                    {String(indexProjects.findIndex((project) => project.id === activeIndexProject.id) + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative min-h-[25rem] overflow-hidden border border-white/12 bg-[#111]">
                  {hasRealPhoto(activeIndexProject) ? (
                    <>
                      <Image
                        key={activeIndexProject.id}
                        src={projectImage(activeIndexProject)}
                        alt={activeIndexProject.title}
                        fill
                        loading="eager"
                        fetchPriority="high"
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        placeholder="blur"
                        blurDataURL={lqip(projectImage(activeIndexProject))}
                        onError={imgError}
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        style={{ filter: "contrast(1.06) saturate(1.04)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-transparent to-transparent" />
                    </>
                  ) : (
                    <PendingProjectPlate project={activeIndexProject} />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/42">
                      {cleanText(activeIndexProject.location)}
                    </span>
                    <h3 className="mt-3 font-editorial text-[clamp(2rem,4vw,4rem)] leading-[0.9] text-white">
                      {cleanText(activeIndexProject.title)}
                    </h3>
                  </div>
                </div>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/50">
                  {cleanText(activeIndexProject.description)}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 pb-18 pt-28 lg:px-12 lg:pb-24 lg:pt-32">
        <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.1]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="portfolio-reveal mb-10 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/42">
                Work wall
              </span>
              <h2 className="mt-5 font-editorial text-[clamp(2.8rem,6vw,6rem)] leading-[0.88]">
                Photo sets, details, and close reads.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {visibleCategories.map((category) => {
                const active = activeFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    data-portfolio-filter={category}
                    aria-label={`Filter portfolio by ${category}`}
                    onClick={() => setActiveFilter(category)}
                    className={`border px-4 py-3 font-labels text-[9px] uppercase tracking-[0.16em] transition-colors ${
                      active
                        ? "border-black bg-black text-white"
                        : "border-black/12 bg-white/62 text-black/54 hover:border-black/35 hover:text-black"
                    }`}
                  >
                    {category} / {categoryCount(category)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid auto-rows-[18rem] grid-cols-1 gap-3 md:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectWallTile
                key={`${activeFilter}-${project.id}`}
                project={project}
                index={index}
                onOpen={setLightboxProject}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-black/10 px-6 py-12 lg:px-12">
        <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.08]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="portfolio-reveal">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/42">
              Ready to compare notes
            </span>
            <h2 className="mt-3 max-w-3xl font-editorial text-[clamp(2.6rem,5vw,5.6rem)] leading-[0.88]">
              Ready to price the next scope?
            </h2>
          </div>
          <div className="portfolio-reveal flex flex-wrap gap-3 lg:justify-end">
            <a
              href={SITE.phoneHref}
              className="bg-black px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)]"
            >
              Call {SITE.phone}
            </a>
            <Link
              href="/contact"
              className="border border-black/15 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black/62 transition-colors hover:border-black hover:text-black"
            >
              Start a project
            </Link>
          </div>
        </div>
      </section>

      <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
    </div>
  );
}
