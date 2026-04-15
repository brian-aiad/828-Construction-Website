"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Project } from "@/lib/constants";

interface LightboxProps {
  project: Project | null;
  onClose: () => void;
}

export default function Lightbox({ project, onClose }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
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
            className="flex items-center justify-between px-8 py-6 border-b border-gray-900 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="font-labels text-[9px] text-gray-600 tracking-[0.2em] uppercase">
                {project.category} · {project.location}
              </span>
              <h2 className="font-display font-bold text-white text-xl mt-1">
                {project.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="font-labels text-[10px] text-gray-500 tracking-[0.18em] uppercase hover:text-white transition-colors flex items-center gap-2"
              aria-label="Close"
            >
              Close <span className="text-lg leading-none">×</span>
            </button>
          </div>

          {/* Image area */}
          <div
            className="flex-1 flex items-center justify-center p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl mx-auto"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover grayscale contrast-110"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </motion.div>
          </div>

          {/* Bottom info */}
          <div
            className="px-8 py-6 border-t border-gray-900 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl">
              <p className="text-gray-500 text-sm leading-relaxed mb-3">
                {project.description}
              </p>
              <span className="font-labels text-[9px] text-gray-700 tracking-[0.2em] uppercase">
                {project.spec}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
