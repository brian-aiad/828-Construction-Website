"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Project } from "@/lib/constants";

interface LightboxProps {
  project: Project | null;
  onClose: () => void;
}

export default function Lightbox({ project, onClose }: LightboxProps) {
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const images = useMemo(() => {
    if (!project) return [];
    const gallery = project.images?.length ? project.images : [project.image];
    return Array.from(new Set(gallery));
  }, [project]);
  const safeActiveIndex = images.length && project?.id === activeProjectId ? activeIndex % images.length : 0;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (!images.length) return;
      setDirection(nextIndex > safeActiveIndex ? 1 : -1);
      setActiveProjectId(project?.id ?? null);
      setActiveIndex((nextIndex + images.length) % images.length);
    },
    [images.length, project?.id, safeActiveIndex]
  );

  const goNext = useCallback(() => goTo(safeActiveIndex + 1), [goTo, safeActiveIndex]);
  const goPrev = useCallback(() => goTo(safeActiveIndex - 1), [goTo, safeActiveIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    },
    [goNext, goPrev, onClose]
  );

  useEffect(() => {
    if (!project) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, handleKeyDown]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
          onClick={onClose}
        >
          {/* Top bar */}
          <div
            className="flex flex-shrink-0 items-center justify-between border-b border-gray-900 px-5 py-5 lg:px-8 lg:py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="font-labels text-[9px] text-gray-600 tracking-[0.2em] uppercase">
                {project.category} / {project.location}
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-white">
                {project.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="font-labels text-[10px] text-gray-500 tracking-[0.18em] uppercase hover:text-white transition-colors flex items-center gap-2"
              aria-label="Close"
            >
              Close <span className="text-lg leading-none">X</span>
            </button>
          </div>

          {/* Image area */}
          <div
            className="flex flex-1 items-center justify-center overflow-hidden p-5 lg:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-6xl bg-black"
              style={{ aspectRatio: "16/9" }}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={images[safeActiveIndex]}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 72 : -72, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction > 0 ? -72 : 72, scale: 0.985 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[safeActiveIndex] ?? project.image}
                    alt={`${project.title} image ${safeActiveIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 82vw"
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/55 font-labels text-sm text-white/70 backdrop-blur transition-colors hover:border-white/35 hover:text-white"
                    aria-label="Previous image"
                  >
                    {"<"}
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/55 font-labels text-sm text-white/70 backdrop-blur transition-colors hover:border-white/35 hover:text-white"
                    aria-label="Next image"
                  >
                    {">"}
                  </button>
                  <div className="absolute bottom-4 left-4 border border-white/12 bg-black/55 px-3 py-2 font-labels text-[9px] uppercase tracking-[0.18em] text-white/62 backdrop-blur">
                    {String(safeActiveIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Bottom info */}
          <div
            className="flex-shrink-0 border-t border-gray-900 px-5 py-5 lg:px-8 lg:py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
              <p className="mb-3 text-sm leading-relaxed text-gray-500">
                {project.description}
              </p>
              <span className="font-labels text-[9px] text-gray-700 tracking-[0.2em] uppercase">
                {project.spec}
              </span>
              </div>
              {images.length > 1 && (
                <div className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:max-w-xl">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => goTo(index)}
                      className={`relative h-16 w-24 flex-shrink-0 overflow-hidden border transition-colors ${
                        index === safeActiveIndex ? "border-white/70" : "border-white/12 hover:border-white/35"
                      }`}
                      aria-label={`Open image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
