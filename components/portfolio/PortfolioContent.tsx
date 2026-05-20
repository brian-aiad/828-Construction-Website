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

gsap.registerPlugin(ScrollTrigger);

type Filter = "All" | ProjectCategory;

const CATEGORIES: Filter[] = ["All", "ADU Construction", "Remediation", "Consulting"];
const INDEX_IDS = [3, 12, 10, 13, 1];
const ARCHIVE_IDS = [3, 12, 8, 13, 1, 10, 15, 14, 4];
const WALL_IDS = [3, 12, 8, 13, 15, 10, 4, 14, 1, 2, 5, 7, 6, 9];

const contactSheetLayout = [
  "col-span-2 row-span-2 md:col-span-4 md:row-span-2",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  "col-span-2 row-span-2 md:col-span-3 md:row-span-2",
  "col-span-2 row-span-1 md:col-span-3 md:row-span-1",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
];

function cleanText(value: string) {
  return value
    .replace(/\u00c2\u00b7/g, "/")
    .replace(/\u00e2\u20ac\u201d/g, "-")
    .replace(/\u00e2\u20ac\u201c/g, "-")
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u0153|\u00e2\u20ac\u009d/g, '"');
}

function categoryCount(category: Filter) {
  if (category === "All") return PROJECTS.length;
  return PROJECTS.filter((project) => project.category === category).length;
}

function projectImage(project: Project) {
  return project.image;
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
      const indexRows = gsap.utils.toArray<HTMLElement>(".index-row");

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

      indexRows.forEach((el, index) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x: -22 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.75,
            delay: index * 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
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

function ArchiveFrame({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className={`archive-frame group relative min-h-[10rem] overflow-hidden bg-black text-left ${contactSheetLayout[index % contactSheetLayout.length]}`}
    >
      <Image
        src={projectImage(project)}
        alt={project.title}
        fill
        preload={index < 3}
        loading={index < 3 ? "eager" : "lazy"}
        fetchPriority={index < 3 ? "high" : "auto"}
        sizes="(max-width: 1024px) 50vw, 28vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ filter: "contrast(1.06) saturate(1.04)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/8 to-transparent opacity-85" />
      <span className="absolute left-3 top-3 bg-black/72 px-2.5 py-1 font-labels text-[8px] uppercase tracking-[0.18em] text-white/58 backdrop-blur">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute bottom-3 left-3 right-3 truncate font-labels text-[8px] uppercase tracking-[0.16em] text-white/62">
        {cleanText(project.location)} / {project.category}
      </span>
    </button>
  );
}

function ProjectIndexRow({
  project,
  active,
  number,
  onFocus,
  onOpen,
}: {
  project: Project;
  active: boolean;
  number: number;
  onFocus: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onClick={onOpen}
      className={`index-row group grid w-full grid-cols-[3.5rem_1fr] gap-4 border-t py-5 text-left transition-colors sm:grid-cols-[4.5rem_1fr_8rem] sm:items-center ${
        active ? "border-white/28 text-white" : "border-white/10 text-white/58 hover:text-white"
      }`}
    >
      <span className={`font-numbers text-2xl font-bold leading-none ${active ? "text-[var(--color-accent)]" : "text-white/22"}`}>
        {String(number).padStart(2, "0")}
      </span>
      <span>
        <span className="block font-editorial text-[clamp(1.7rem,3vw,3.2rem)] leading-[0.92]">
          {cleanText(project.title)}
        </span>
        <span className="mt-3 block font-labels text-[9px] uppercase tracking-[0.16em] text-white/36">
          {project.category} / {cleanText(project.location)} / {cleanText(project.spec)}
        </span>
      </span>
      <span className="hidden justify-self-end border border-white/12 px-4 py-3 font-labels text-[9px] uppercase tracking-[0.16em] text-white/44 transition-colors group-hover:border-white/30 group-hover:text-white sm:block">
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
      <Image
        src={projectImage(project)}
        alt={project.title}
        fill
        sizes={spanClass.includes("col-span-2") ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 31vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
        style={{ filter: "contrast(1.05) saturate(1.04)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/14 to-transparent" />
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

export default function PortfolioContent() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const rootRef = usePortfolioMotion();

  const indexProjects = useMemo(
    () => INDEX_IDS.map((id) => PROJECTS.find((project) => project.id === id)).filter(Boolean) as Project[],
    []
  );
  const archiveProjects = useMemo(
    () => ARCHIVE_IDS.map((id) => PROJECTS.find((project) => project.id === id)).filter(Boolean) as Project[],
    []
  );
  const wallProjects = useMemo(
    () => WALL_IDS.map((id) => PROJECTS.find((project) => project.id === id)).filter(Boolean) as Project[],
    []
  );
  const [activeIndexId, setActiveIndexId] = useState(indexProjects[0]?.id ?? PROJECTS[0].id);

  const activeIndexProject = useMemo(
    () => indexProjects.find((project) => project.id === activeIndexId) ?? indexProjects[0] ?? PROJECTS[0],
    [activeIndexId, indexProjects]
  );

  const filteredProjects = useMemo(() => {
    return activeFilter === "All"
      ? wallProjects
      : wallProjects.filter((project) => project.category === activeFilter);
  }, [activeFilter, wallProjects]);

  return (
    <div ref={rootRef} className="bg-[#f5f0e9] text-black">
      <section className="relative overflow-hidden border-b border-black/10 px-6 pb-14 pt-32 lg:px-12 lg:pb-20">
        <DraftingMotionLayer intensity="quiet" variant="intro" />
        <div className="absolute left-0 top-[18%] hidden h-px w-1/3 origin-left bg-[var(--color-accent)]/40 lg:block" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="portfolio-reveal">
            <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-black/42">
              Portfolio archive / Torrance and South Bay
            </span>
            <h1 className="mt-7 max-w-2xl font-editorial text-[clamp(4rem,8.3vw,8.8rem)] leading-[0.86] tracking-normal">
              <span className="block">Work you </span>
              <span className="block">can inspect.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-black/58">
              A compact record of ADUs, remediation, consulting, and detailed finish work. Less sales copy, more proof.
            </p>
            <div className="mt-9 grid max-w-lg grid-cols-3 border-y border-black/12">
              {[
                [`${PROJECTS.length}`, "Projects"],
                ["03", "Scopes"],
                [SITE.license, "License"],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-black/10 py-4 pr-4 last:border-r-0">
                  <span className="block font-numbers text-2xl font-bold">{value}</span>
                  <span className="mt-1 block font-labels text-[8px] uppercase tracking-[0.16em] text-black/42">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="absolute -right-6 -top-8 hidden h-28 w-28 border border-black/14 lg:block">
              <span className="absolute left-1/2 top-0 h-full w-px bg-black/12" />
              <span className="absolute left-0 top-1/2 h-px w-full bg-black/12" />
            </div>
            <div className="grid auto-rows-[9.5rem] grid-cols-2 gap-2 sm:auto-rows-[10.5rem] md:grid-cols-6 lg:auto-rows-[8.8rem]">
              {archiveProjects.map((project, index) => (
                <ArchiveFrame
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={setLightboxProject}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-6 pb-18 pt-28 text-white lg:px-12 lg:pb-24 lg:pt-32">
        <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.14]" />
        <div className="absolute inset-y-0 left-0 hidden w-px bg-white/12 lg:block" />
        <div className="absolute bottom-10 right-10 hidden h-36 w-36 rounded-full border border-white/10 lg:block" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div>
            <div className="portfolio-reveal mb-9 max-w-2xl">
              <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-white/38">
                Case index
              </span>
              <h2 className="mt-5 font-editorial text-[clamp(2.8rem,6.8vw,6.7rem)] leading-[0.86]">
                Pick the proof by project type.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setLightboxProject(activeIndexProject)}
              className="portfolio-reveal mb-8 block w-full text-left lg:hidden"
            >
              <div className="relative min-h-[18rem] overflow-hidden bg-[#111]">
                <Image
                  key={`mobile-${activeIndexProject.id}`}
                  src={projectImage(activeIndexProject)}
                  alt={activeIndexProject.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={{ filter: "contrast(1.06) saturate(1.04)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/42">
                    Preview / {activeIndexProject.category}
                  </span>
                  <h3 className="mt-3 font-editorial text-[clamp(1.9rem,10vw,3rem)] leading-[0.9] text-white">
                    {cleanText(activeIndexProject.title)}
                  </h3>
                </div>
              </div>
            </button>
            <div className="draw-line mb-1 h-px origin-left bg-[var(--color-accent)]/58" />
            {indexProjects.map((project, index) => (
              <ProjectIndexRow
                key={project.id}
                project={project}
                active={project.id === activeIndexProject.id}
                number={index + 1}
                onFocus={() => setActiveIndexId(project.id)}
                onOpen={() => setLightboxProject(project)}
              />
            ))}
          </div>

          <div className="portfolio-reveal hidden lg:sticky lg:top-24 lg:block">
            <button
              type="button"
              onClick={() => setLightboxProject(activeIndexProject)}
              className="group block w-full text-left"
            >
              <div className="relative min-h-[28rem] overflow-hidden bg-[#111]">
                <Image
                  key={activeIndexProject.id}
                  src={projectImage(activeIndexProject)}
                  alt={activeIndexProject.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  style={{ filter: "contrast(1.06) saturate(1.04)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/42">
                    Live preview / {activeIndexProject.category}
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
                Browse the archive without the pitch.
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {CATEGORIES.map((category) => {
                const active = activeFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
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
              Bring a real project. Get a real answer.
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
