"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Project, SITE } from "@/lib/constants";
import { lqip } from "@/lib/image-placeholders";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface Props {
  project: Project | null;
  onClose: () => void;
}

function cleanText(value: string) {
  return value
    .replace(/\u00c2\u00b7/g, "/")
    .replace(/\u00e2\u20ac\u201d/g, "-")
    .replace(/\u00e2\u20ac\u201c/g, "-")
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u0153|\u00e2\u20ac\u009d/g, '"');
}

function imgErr(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.opacity = "0";
}

function PendingPlate({ project }: { project: Project }) {
  return (
    <div className="relative flex h-full min-h-[26rem] w-full overflow-hidden bg-[#101010] text-white">
      <div className="absolute inset-0 blueprint-grid opacity-[0.18]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(99,26,22,0.24),transparent_34%),linear-gradient(135deg,#171717_0%,#050505_76%)]" />
      <div className="relative z-10 m-auto w-full max-w-2xl px-8 py-12">
        <span className="font-labels text-[9px] uppercase tracking-[0.24em] text-white/38">
          Project documentation pending
        </span>
        <h3 className="mt-6 font-editorial text-[clamp(2.6rem,6vw,6rem)] leading-[0.86] text-white">
          {cleanText(project.title)}
        </h3>
        <p className="mt-6 max-w-md text-sm leading-7 text-white/54">
          This project is listed for scope context, but the fake-looking placeholder photo has been removed from the presentation.
        </p>
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const prev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={prev ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/14 bg-black/54 text-white/62 backdrop-blur transition-colors hover:border-white/34 hover:text-white lg:flex ${
        prev ? "left-6" : "right-6"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        {prev ? (
          <path d="M11.5 3L5.5 9L11.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        ) : (
          <path d="M6.5 3L12.5 9L6.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        )}
      </svg>
    </button>
  );
}

export default function Lightbox({ project, onClose }: Props) {
  return (
    <AnimatePresence>
      {project && <LightboxPanel key={project.id} project={project} onClose={onClose} />}
    </AnimatePresence>
  );
}

function LightboxPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const images = useMemo(() => {
    if (!project || project.tempPhoto) return [];
    const gallery = project.images?.length ? project.images : [project.image];
    return Array.from(new Set(gallery));
  }, [project]);

  const safeIdx = images.length ? Math.min(idx, images.length - 1) : 0;
  const currentSrc = images[safeIdx] ?? "";
  const specItems = project.spec
    ? cleanText(project.spec).replace(/\u00b7/g, "/").split(/\s*[\/|]\s*/).filter(Boolean)
    : [];

  const goTo = useCallback(
    (next: number) => {
      if (!images.length) return;
      setDir(next > safeIdx ? 1 : -1);
      setIdx((next + images.length) % images.length);
    },
    [images.length, safeIdx]
  );

  const goNext = useCallback(() => goTo(safeIdx + 1), [goTo, safeIdx]);
  const goPrev = useCallback(() => goTo(safeIdx - 1), [goTo, safeIdx]);

  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, goNext, goPrev, onClose]);

  useEffect(() => {
    if (!images.length) return;
    [safeIdx, safeIdx + 1, safeIdx - 1].forEach((rawIndex) => {
      const src = images[(rawIndex + images.length) % images.length];
      if (!src) return;
      const preloaded = new window.Image();
      preloaded.decoding = "async";
      preloaded.src = src;
    });
  }, [images, safeIdx]);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    touchRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, []);

  const onTouchEnd = useCallback((event: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = event.changedTouches[0].clientX - touchRef.current.x;
    const dy = event.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  return (
        <motion.div
          key="project-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[200] h-[100dvh] overflow-y-auto bg-[#050505] text-white lg:overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-0 blueprint-grid opacity-[0.08]" aria-hidden="true" />
          <div className="relative z-10 grid min-h-full lg:h-full lg:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="relative h-[58dvh] min-h-[27rem] border-white/10 lg:h-full lg:min-h-0 lg:border-r">
              <div className="absolute left-5 top-5 z-30 flex items-center gap-3 lg:left-8 lg:top-7">
                <span className="font-labels text-[8px] uppercase tracking-[0.22em] text-white/34">
                  Project view
                </span>
                {images.length > 1 && (
                  <span className="font-numbers text-[11px] text-white/40">
                    <span className="text-white/72">{String(safeIdx + 1).padStart(2, "0")}</span>
                    <span className="mx-1.5 text-white/16">/</span>
                    {String(images.length).padStart(2, "0")}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project view"
                className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center border border-white/14 bg-black/50 text-white/58 backdrop-blur transition-colors hover:border-white/30 hover:text-white lg:hidden"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
                </svg>
              </button>

              {images.length > 1 && (
                <>
                  <ArrowButton direction="prev" onClick={goPrev} />
                  <ArrowButton direction="next" onClick={goNext} />
                </>
              )}

              <div className="flex h-full items-center justify-center px-3 pb-3 pt-16 sm:px-6 lg:px-18 lg:py-16">
                <div className="relative h-full max-h-full w-full overflow-hidden border border-white/10 bg-black shadow-[0_34px_90px_rgba(0,0,0,0.55)]">
                  {project.tempPhoto || !currentSrc ? (
                    <PendingPlate project={project} />
                  ) : (
                    <AnimatePresence initial={false} custom={dir} mode="wait">
                      <motion.div
                        key={`${project.id}-${safeIdx}`}
                        custom={dir}
                        initial={{ opacity: 0, x: dir > 0 ? 42 : -42, scale: 0.985 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: dir > 0 ? -36 : 36, scale: 1.01 }}
                        transition={{ duration: 0.42, ease: EASE_OUT }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={currentSrc}
                          alt={`${cleanText(project.title)} - photo ${safeIdx + 1} of ${images.length}`}
                          fill
                          loading="eager"
                          fetchPriority="high"
                          quality={92}
                          placeholder="blur"
                          blurDataURL={lqip(currentSrc)}
                          onError={imgErr}
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, calc(100vw - 26rem)"
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {images.length > 1 && (
                <div className="pointer-events-auto absolute bottom-5 left-5 right-5 z-30 flex justify-between lg:hidden">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="border border-white/16 bg-black/62 px-4 py-3 font-labels text-[9px] uppercase tracking-[0.18em] text-white/68 backdrop-blur"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="border border-white/16 bg-black/62 px-4 py-3 font-labels text-[9px] uppercase tracking-[0.18em] text-white/68 backdrop-blur"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            <aside className="border-t border-white/10 bg-[#080808] p-5 lg:min-h-0 lg:overflow-y-auto lg:border-t-0 lg:p-7">
              <div className="mb-7 flex items-start justify-between gap-5">
                <div>
                  <span className="font-labels text-[8px] uppercase tracking-[0.24em] text-[var(--color-accent)]">
                    {project.category}
                  </span>
                  <h2 className="mt-3 font-editorial text-[clamp(2.1rem,4vw,4rem)] leading-[0.86] text-white lg:text-[3.4rem]">
                    {cleanText(project.title)}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close project view"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-white/12 text-white/46 transition-colors hover:border-white/30 hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/10">
                {[
                  ["Location", cleanText(project.location)],
                  ["Photos", project.tempPhoto ? "Pending" : String(images.length).padStart(2, "0")],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#080808] p-4">
                    <span className="block font-labels text-[7px] uppercase tracking-[0.18em] text-white/30">{label}</span>
                    <span className="mt-2 block font-labels text-[10px] uppercase tracking-[0.12em] text-white/68">{value}</span>
                  </div>
                ))}
              </div>

              <p className="mt-7 text-sm leading-7 text-white/58">
                {cleanText(project.description)}
              </p>

              {specItems.length > 0 && (
                <div className="mt-7 border-y border-white/10 py-5">
                  <span className="mb-4 block font-labels text-[8px] uppercase tracking-[0.22em] text-white/32">
                    Scope notes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {specItems.map((item) => (
                      <span key={item} className="border border-white/12 px-3 py-2 font-labels text-[8px] uppercase tracking-[0.14em] text-white/48">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {images.length > 1 && (
                <div className="mt-7">
                  <span className="mb-3 block font-labels text-[8px] uppercase tracking-[0.22em] text-white/32">
                    Photo set
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {images.map((src, imageIndex) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => goTo(imageIndex)}
                        aria-label={`Open photo ${imageIndex + 1}`}
                        className={`relative aspect-square overflow-hidden border transition-opacity ${
                          imageIndex === safeIdx
                            ? "border-[var(--color-accent)] opacity-100"
                            : "border-white/8 opacity-42 hover:opacity-78"
                        }`}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL={lqip(src)}
                          className="object-cover"
                          sizes="72px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-7 grid gap-2">
                <a
                  href={SITE.phoneHref}
                  className="bg-white px-5 py-4 text-center font-labels text-[9px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
                >
                  Call {SITE.phone}
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-white/12 px-5 py-4 font-labels text-[9px] uppercase tracking-[0.18em] text-white/46 transition-colors hover:border-white/30 hover:text-white"
                >
                  Back to portfolio
                </button>
              </div>
            </aside>
          </div>
        </motion.div>
  );
}
