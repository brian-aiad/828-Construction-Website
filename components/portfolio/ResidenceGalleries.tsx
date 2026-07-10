"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { RESIDENCE_GALLERIES } from "@/components/portfolio/residenceGalleries.data";

// Additive residence galleries for /portfolio (Brian, 2026-07-10: real photos).
// Each residence is an anchored section (#cerritos-residence / #el-sereno-residence
// / #tustin-residence) the home "Refining industry standards." cards deep-link to.
// Fixed-aspect cells reserve space so lazy images never shift layout — which is
// also what makes the hash jump land accurately. A lightweight lightbox lets a
// customer read each full frame (grid thumbs are cropped to a uniform portrait).

type Selected = { r: number; p: number } | null;

export default function ResidenceGalleries() {
  const [selected, setSelected] = useState<Selected>(null);

  // Deep-link landing: jump to the residence section named in the URL hash.
  // Cells are fixed-aspect (no CLS) so the target offset is stable; we jump
  // INSTANTLY (bypassing the global `scroll-behavior: smooth`, which would glide
  // for ~2s) to the section's scroll-margin offset (96px = scroll-mt-24). A
  // single re-assert at 250ms survives the LenisProvider mount scroll-reset.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!RESIDENCE_GALLERIES.some((g) => g.id === id)) return;
    let aborted = false;
    // Only a real scroll gesture yields — a tap (touchstart) must NOT, or the
    // re-asserts that correct late layout never fire.
    const abort = () => { aborted = true; };
    window.addEventListener("wheel", abort, { passive: true, once: true });
    window.addEventListener("touchmove", abort, { passive: true, once: true });
    const jump = () => {
      if (aborted) return;
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      const root = document.documentElement;
      const prev = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, Math.max(0, y));
      root.style.scrollBehavior = prev;
    };
    const raf = window.requestAnimationFrame(jump);
    // Re-assert across a short window: the browser's own fragment scroll, the
    // Lenis mount reset, and late layout above can each land us short once.
    const timers = [120, 350, 700, 1100].map((ms) => setTimeout(jump, ms));
    return () => {
      window.cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchmove", abort);
    };
  }, []);

  const close = useCallback(() => setSelected(null), []);
  const step = useCallback((dir: number) => {
    setSelected((cur) => {
      if (!cur) return cur;
      const set = RESIDENCE_GALLERIES[cur.r].photos;
      return { r: cur.r, p: (cur.p + dir + set.length) % set.length };
    });
  }, []);

  // Lightbox keyboard + body-scroll lock
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected, close, step]);

  const active = selected ? RESIDENCE_GALLERIES[selected.r] : null;

  return (
    <section
      aria-label="Featured residences"
      className="relative overflow-hidden border-t border-black/10 bg-[#f5f0e9] px-6 pt-24 pb-16 lg:px-12 lg:pt-32 lg:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl lg:mb-20">
          <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/42">
            Featured residences
          </span>
          <h2 className="mt-5 font-editorial text-[clamp(2.8rem,6vw,6rem)] leading-[0.88]">
            The full sets.
          </h2>
        </div>

        <div className="space-y-24 lg:space-y-36">
          {RESIDENCE_GALLERIES.map((residence, r) => (
            <div
              key={residence.id}
              id={residence.id}
              className="scroll-mt-24"
            >
              <div className="mb-8 grid gap-5 border-t border-black/12 pt-7 lg:grid-cols-[1fr_auto] lg:items-end lg:pt-9">
                <div>
                  <span className="font-numbers text-[11px] text-[var(--color-accent)]">
                    {String(r + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-editorial text-[clamp(2rem,4vw,3.6rem)] leading-[0.92]">
                    {residence.title}
                  </h3>
                </div>
                <p className="font-labels text-[9px] uppercase leading-5 tracking-[0.18em] text-black/45 lg:text-right">
                  {residence.scope}
                  <span className="mx-2 text-black/25">/</span>
                  {residence.location}
                  <span className="mx-2 text-black/25">/</span>
                  {residence.photos.length} photos
                </p>
              </div>

              <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
                {residence.photos.map((src, p) => (
                  <li key={src}>
                    <button
                      type="button"
                      onClick={() => setSelected({ r, p })}
                      aria-label={`View photo ${p + 1} of ${residence.photos.length}, ${residence.title}`}
                      className="group relative block aspect-[4/5] w-full overflow-hidden bg-[#e8e3da] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f0e9]"
                    >
                      <Image
                        src={src}
                        alt={`${residence.title} — ${residence.scope}, photo ${p + 1}`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        quality={68}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-2 left-2 font-numbers text-[9px] text-white/0 transition-colors duration-300 group-hover:text-white/85"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                      >
                        {String(p + 1).padStart(2, "0")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {active && selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} photo viewer`}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-4 lg:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-white/25 font-labels text-lg text-white/80 transition-colors hover:border-white hover:text-white lg:right-8 lg:top-8"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 font-labels text-white/70 transition-colors hover:border-white hover:text-white lg:left-8"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 font-labels text-white/70 transition-colors hover:border-white hover:text-white lg:right-8"
          >
            ›
          </button>
          <div
            className="relative h-full w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={active.photos[selected.p]}
              src={active.photos[selected.p]}
              alt={`${active.title} — ${active.scope}, photo ${selected.p + 1} of ${active.photos.length}`}
              fill
              sizes="100vw"
              quality={82}
              className="object-contain"
              priority
            />
          </div>
          <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-labels text-[10px] uppercase tracking-[0.2em] text-white/70">
            {active.title}
            <span className="mx-2 text-white/35">/</span>
            {String(selected.p + 1).padStart(2, "0")} — {String(active.photos.length).padStart(2, "0")}
          </p>
        </div>
      )}
    </section>
  );
}
