"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import {
  PORTFOLIO_CASES,
  EXAMPLE_PROJECT,
  PortfolioCase,
} from "@/components/portfolio/portfolioCases.data";
import PortfolioFlow from "@/components/portfolio/PortfolioFlow";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";
import SectionMotionBackdrop from "@/components/system/SectionMotionBackdrop";
import { AnimationController } from "@/utils/animationControl";
import { revealOnVisible } from "@/utils/revealOnVisible";
import { lqip } from "@/lib/image-placeholders";

gsap.registerPlugin(ScrollTrigger);

// V4 revamp (Brian, 2026-07-13): the page IS the three photographed
// residences. Each residence gets its own dossier surface in the site's
// stacked-surface flow; the full photo set stays reachable through the
// per-case lightbox instead of an uncurated thumbnail wall. One clearly
// labeled in-progress example (Redondo Beach) follows the real work.
// Page signature: the traveling contact strip — a decorative row of real
// frames drifting laterally on scrub inside each case surface.

type LightboxState = { c: number; p: number } | null;

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
    if (!root || !AnimationController.shouldAnimate() || window.innerWidth < 1024) return;

    const revealCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // Content reveals: IO-decisive once-tweens only (Fix 22/25) — elements
      // are visible in JSX; GSAP hides them here, immediately before wiring
      // the visibility-truthful reveal.
      const reveals = gsap.utils.toArray<HTMLElement>(".pf-reveal");
      reveals.forEach((el) => {
        gsap.set(el, { autoAlpha: 0, y: 26 });
        revealCleanups.push(
          revealOnVisible([el], () => {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              overwrite: true,
            });
          })
        );
      });

      // Photo tiles settle in with a clip wipe — decisive, observed on the
      // unclipped parent (Fix 23), staggered by the tile's grid position.
      const tileGroups = gsap.utils.toArray<HTMLElement>("[data-tile-group]");
      tileGroups.forEach((group) => {
        const tiles = Array.from(group.querySelectorAll<HTMLElement>(".pf-tile"));
        if (!tiles.length) return;
        tiles.forEach((tile) => {
          gsap.set(tile, { clipPath: "inset(0% 0% 16% 0%)", y: 30, autoAlpha: 0 });
        });
        revealCleanups.push(
          revealOnVisible([group], () => {
            gsap.to(tiles, {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              autoAlpha: 1,
              duration: 1.0,
              stagger: 0.09,
              ease: "power3.out",
              overwrite: true,
            });
          })
        );
      });

      // Signature: traveling contact strip — decorative lateral drift on
      // scrub. Content never depends on it, so a parked scrub is harmless.
      gsap.utils.toArray<HTMLElement>("[data-strip-track]").forEach((track, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          track,
          { xPercent: dir * 7 },
          {
            xPercent: dir * -7,
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          }
        );
      });

      // Maroon hairlines draw on scrub (decorative).
      gsap.utils.toArray<HTMLElement>(".draw-line").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 60%", scrub: 1 },
          }
        );
      });

      // Lead photos breathe: slow inner parallax on scrub (decorative).
      gsap.utils.toArray<HTMLElement>("[data-lead-parallax] img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -5, scale: 1.08 },
          {
            yPercent: 5,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6,
            },
          }
        );
      });
    }, rootRef);

    ctxRef.current = ctx;
    return () => {
      ctxRef.current = null;
      revealCleanups.forEach((dispose) => dispose());
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return rootRef;
}

function CaseTile({
  src,
  caseData,
  index,
  dark,
  aspect = "aspect-[4/5]",
  sizes,
  onOpen,
}: {
  src: string;
  caseData: PortfolioCase;
  index: number;
  dark: boolean;
  aspect?: string;
  sizes: string;
  onOpen: (src: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(src)}
      data-gsap-reveal="true"
      aria-label={`View photo — ${caseData.gallery.title}`}
      className={`pf-tile group relative block w-full overflow-hidden text-left ${aspect} ${
        dark ? "bg-[#111]" : "bg-[#e8e3da]"
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]`}
    >
      <Image
        src={src}
        alt={`${caseData.gallery.title} — ${caseData.gallery.scope}, detail ${index + 1}`}
        fill
        loading="lazy"
        sizes={sizes}
        quality={74}
        placeholder="blur"
        blurDataURL={lqip(src)}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
        style={{ filter: "contrast(1.04) saturate(1.04)" }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 group-hover:scale-x-100"
      />
    </button>
  );
}

// Traveling contact strip — the page's signature. Decorative duplicates of
// real frames on a scrub-drifting track; never interactive, never content.
function ContactStrip({ photos, title, dark }: { photos: string[]; title: string; dark: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none mt-14 overflow-hidden lg:mt-20">
      <div
        data-strip-track=""
        className="flex w-full gap-3 lg:w-[112%] lg:-ml-[6%] lg:gap-4"
      >
        {photos.map((src) => (
          <div
            key={src}
            className={`relative h-32 flex-1 overflow-hidden sm:h-44 lg:h-56 ${
              dark ? "bg-[#111]" : "bg-[#e8e3da]"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 33vw, 40vw"
              quality={62}
              placeholder="blur"
              blurDataURL={lqip(src)}
              className="object-cover"
              style={{ filter: "contrast(1.04) saturate(1.02)" }}
            />
          </div>
        ))}
      </div>
      <div className={`mt-3 font-labels text-[8px] uppercase tracking-[0.2em] ${dark ? "text-white/30" : "text-black/32"}`}>
        {title} / working frames
      </div>
    </div>
  );
}

function CaseLedger({
  caseData,
  dark,
  onOpenSet,
}: {
  caseData: PortfolioCase;
  dark: boolean;
  onOpenSet: () => void;
}) {
  const { project, gallery } = caseData;
  const hairline = dark ? "border-white/12" : "border-black/12";
  const label = dark ? "text-white/38" : "text-black/42";
  const value = dark ? "text-white/72" : "text-black/78";
  const rows: Array<[string, string]> = [
    ["Scope", gallery.scope],
    ["Location", project.location],
    ["Detail", project.spec],
    ["Documentation", `${gallery.photos.length} photographs`],
  ];

  return (
    <div>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className={`grid grid-cols-[7.5rem_1fr] gap-4 border-t ${hairline} py-3.5`}>
            <dt className={`font-labels text-[9px] uppercase leading-5 tracking-[0.18em] ${label}`}>{k}</dt>
            <dd className={`text-[13px] leading-6 ${value}`}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="draw-line h-px bg-[var(--color-accent)]/55" />
      <p className={`mt-6 max-w-md text-sm leading-7 ${dark ? "text-white/56" : "text-black/62"}`}>
        {project.description}
      </p>
      <button
        type="button"
        onClick={onOpenSet}
        className={`mt-8 inline-flex min-h-[44px] items-center gap-3 border px-6 py-3.5 font-labels text-[9px] uppercase tracking-[0.18em] transition-colors ${
          dark
            ? "border-white/25 text-white/80 hover:border-white hover:text-white"
            : "border-black/25 text-black/75 hover:border-black hover:text-black"
        }`}
      >
        Open the full set
        <span className="font-numbers text-[10px] text-[var(--color-accent)]">
          {gallery.photos.length}
        </span>
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </button>
    </div>
  );
}

function CaseNumberBlock({ index, title, dark }: { index: number; title: string; dark: boolean }) {
  return (
    <div className="pf-reveal" data-gsap-reveal="true">
      <span className="font-numbers text-[11px] font-bold text-[var(--color-accent)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2
        className={`mt-3 font-editorial text-[clamp(1.9rem,3.2vw,3.4rem)] leading-[0.94] ${
          dark ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

export default function PortfolioContent() {
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const rootRef = usePortfolioMotion();

  // Deep-link landing (home cards → /portfolio#<residence>): jump instantly
  // to the anchored case, re-asserting across the browser fragment scroll,
  // the Lenis mount reset, and late layout. A real scroll gesture aborts.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!PORTFOLIO_CASES.some((c) => c.gallery.id === id)) return;
    let aborted = false;
    const abort = () => {
      aborted = true;
    };
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
    const timers = [120, 350, 700, 1100].map((ms) => setTimeout(jump, ms));
    return () => {
      window.cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchmove", abort);
    };
  }, []);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback((dir: number) => {
    setLightbox((cur) => {
      if (!cur) return cur;
      const set = PORTFOLIO_CASES[cur.c].gallery.photos;
      return { c: cur.c, p: (cur.p + dir + set.length) % set.length };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
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
  }, [lightbox, close, step]);

  const openAt = useCallback((c: number, src?: string) => {
    const photos = PORTFOLIO_CASES[c].gallery.photos;
    const p = src ? Math.max(0, photos.indexOf(src)) : 0;
    setLightbox({ c, p });
  }, []);

  const active = lightbox ? PORTFOLIO_CASES[lightbox.c] : null;
  const [cerritos, elSereno, tustin] = PORTFOLIO_CASES;

  return (
    <div ref={rootRef} className="bg-[#f5f0e9] text-black">
      <PortfolioFlow>
        {/* ── Surface 1 · Hero: statement + residence index + real triptych ── */}
        <section
          data-section="portfolio-hero"
          data-header-dark=""
          className="relative bg-black px-6 pb-16 pt-28 text-white lg:px-12 lg:pb-20 lg:pt-32"
          style={{ overflowX: "clip" }}
        >
          <DraftingMotionLayer intensity="quiet" variant="intro" />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_76%_12%,rgba(99,26,22,0.16),transparent_30%)]"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
              <div className="flex flex-col justify-between">
                <div>
                  <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-white/38">
                    Portfolio / Selected residential work
                  </span>
                  <h1 className="mt-5 max-w-xl font-editorial text-[clamp(2.2rem,4.5vw,4.6rem)] leading-[0.9]">
                    Remodels, ADUs, repairs.
                  </h1>
                  <p className="mt-6 max-w-md text-sm leading-7 text-white/56">
                    Three residences, photographed the way they were built — completely.
                    Open any project for the full set.
                  </p>
                </div>

                <nav aria-label="Residence index" className="mt-12 lg:mt-10">
                  {PORTFOLIO_CASES.map((c, i) => (
                    <a
                      key={c.gallery.id}
                      href={`#${c.gallery.id}`}
                      className="group grid min-h-[44px] grid-cols-[2.6rem_1fr_auto] items-baseline gap-4 border-t border-white/12 py-4 transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="font-numbers text-sm font-bold text-white/28 transition-colors group-hover:text-[var(--color-accent)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block font-editorial text-[clamp(1.25rem,1.9vw,1.9rem)] leading-tight text-white/86 transition-colors group-hover:text-white">
                          {c.gallery.title}
                        </span>
                        <span className="mt-1 block font-labels text-[8px] uppercase leading-4 tracking-[0.16em] text-white/36">
                          {c.gallery.scope} / {c.project.location}
                        </span>
                      </span>
                      <span className="hidden font-numbers text-[10px] text-white/34 sm:block">
                        {c.gallery.photos.length} photos
                      </span>
                    </a>
                  ))}
                  <div className="draw-line h-px bg-[var(--color-accent)]/55" />
                </nav>
              </div>

              <div className="grid grid-cols-2 grid-rows-2 gap-3">
                <a
                  href={`#${cerritos.gallery.id}`}
                  aria-label="Jump to Cerritos Residence"
                  className="group relative row-span-2 block min-h-[22rem] overflow-hidden bg-[#111] sm:min-h-[26rem]"
                >
                  <Image
                    src={cerritos.lead}
                    alt="Cerritos Residence master bath — glass shower enclosure and dark feature tile"
                    fill
                    priority
                    fetchPriority="high"
                    quality={90}
                    sizes="(max-width: 1024px) 50vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    style={{ filter: "contrast(1.04) saturate(1.05)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-labels text-[8px] uppercase tracking-[0.2em] text-white/74">
                    Cerritos, CA
                  </span>
                </a>
                <a
                  href={`#${elSereno.gallery.id}`}
                  aria-label="Jump to El Sereno Residence"
                  className="group relative block overflow-hidden bg-[#111]"
                >
                  <Image
                    src={elSereno.lead}
                    alt="El Sereno Residence bath — geometric star tile and soaking tub"
                    fill
                    priority
                    quality={86}
                    sizes="(max-width: 1024px) 50vw, 28vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    style={{ filter: "contrast(1.04) saturate(1.05)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-labels text-[8px] uppercase tracking-[0.2em] text-white/74">
                    El Sereno, CA
                  </span>
                </a>
                <a
                  href={`#${tustin.gallery.id}`}
                  aria-label="Jump to Tustin Residence"
                  className="group relative block overflow-hidden bg-[#111]"
                >
                  <Image
                    src={tustin.lead}
                    alt="Tustin Residence — light blue soaking tub with glass shower surround"
                    fill
                    priority
                    quality={86}
                    sizes="(max-width: 1024px) 50vw, 28vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    style={{ filter: "contrast(1.04) saturate(1.05)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-labels text-[8px] uppercase tracking-[0.2em] text-white/74">
                    Tustin, CA
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Surface 2 · Cerritos: lead-left, sticky dossier right ── */}
        <section
          id="cerritos-residence"
          data-section="case-cerritos"
          data-header-light=""
          className="relative scroll-mt-24 bg-[#f5f0e9] px-6 pb-20 pt-24 lg:px-12 lg:pb-28 lg:pt-28"
          style={{ overflowX: "clip" }}
        >
          <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.08]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
              <div data-lead-parallax="" className="relative aspect-[4/5] overflow-hidden bg-[#e8e3da] lg:aspect-auto lg:min-h-[38rem]">
                <Image
                  src={cerritos.lead}
                  alt="Cerritos Residence master bath overview — frameless glass shower, dark vertical feature tile, dual marble vanity"
                  fill
                  loading="lazy"
                  quality={86}
                  sizes="(max-width: 1024px) 100vw, 54vw"
                  placeholder="blur"
                  blurDataURL={lqip(cerritos.lead)}
                  className="object-cover"
                  style={{ filter: "contrast(1.04) saturate(1.05)" }}
                />
              </div>
              <div className="lg:self-stretch">
                <div className="lg:sticky lg:top-28">
                  <CaseNumberBlock index={0} title={cerritos.gallery.title} dark={false} />
                  <div className="pf-reveal mt-8" data-gsap-reveal="true">
                    <CaseLedger caseData={cerritos} dark={false} onOpenSet={() => openAt(0)} />
                  </div>
                </div>
              </div>
            </div>

            <div data-tile-group="" className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:mt-16">
              {cerritos.grid.map((src, i) => (
                <CaseTile
                  key={src}
                  src={src}
                  caseData={cerritos}
                  index={i}
                  dark={false}
                  aspect={i === 0 ? "aspect-[4/5] col-span-2 md:col-span-1" : "aspect-[4/5]"}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  onOpen={(s) => openAt(0, s)}
                />
              ))}
            </div>

            <ContactStrip photos={cerritos.strip} title={cerritos.gallery.title} dark={false} />
          </div>
        </section>

        {/* ── Surface 3 · El Sereno: full-bleed lead, two-chapter grid ── */}
        <section
          id="el-sereno-residence"
          data-section="case-el-sereno"
          data-header-dark=""
          className="relative scroll-mt-24 bg-[#0a0a0a] px-6 pb-20 pt-24 text-white lg:px-12 lg:pb-28 lg:pt-28"
          style={{ overflowX: "clip" }}
        >
          <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.1]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div data-lead-parallax="" className="relative aspect-[4/3] overflow-hidden bg-[#111] sm:aspect-[16/8] lg:aspect-[21/9]">
              <Image
                src={elSereno.lead}
                alt="El Sereno Residence bath — geometric star-pattern tile, soaking tub, and matte black fixtures"
                fill
                loading="lazy"
                quality={88}
                sizes="(max-width: 1280px) 100vw, 1216px"
                placeholder="blur"
                blurDataURL={lqip(elSereno.lead)}
                className="object-cover"
                style={{ filter: "contrast(1.04) saturate(1.05)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent" />
            </div>

            <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14">
              <div className="lg:self-stretch">
                <div className="lg:sticky lg:top-28">
                  <CaseNumberBlock index={1} title={elSereno.gallery.title} dark />
                  <div className="pf-reveal mt-8" data-gsap-reveal="true">
                    <CaseLedger caseData={elSereno} dark onOpenSet={() => openAt(1)} />
                  </div>
                </div>
              </div>

              <div>
                {[elSereno.grid, elSereno.gridB ?? []].map((chapter, chapterIdx) =>
                  chapter.length ? (
                    <div key={chapterIdx} className={chapterIdx === 1 ? "mt-10" : ""}>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-[var(--color-accent)]/70" aria-hidden="true" />
                        <span className="font-labels text-[9px] uppercase tracking-[0.2em] text-white/44">
                          {elSereno.chapterLabels?.[chapterIdx]}
                        </span>
                      </div>
                      <div data-tile-group="" className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {chapter.map((src, i) => (
                          <CaseTile
                            key={src}
                            src={src}
                            caseData={elSereno}
                            index={i}
                            dark
                            aspect={i === 0 ? "aspect-[4/5] col-span-2 md:col-span-1" : "aspect-[4/5]"}
                            sizes="(max-width: 768px) 50vw, 20vw"
                            onOpen={(s) => openAt(1, s)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>

            <ContactStrip photos={elSereno.strip} title={elSereno.gallery.title} dark />
          </div>
        </section>

        {/* ── Surface 4 · Tustin: dossier bar + offset grid ── */}
        <section
          id="tustin-residence"
          data-section="case-tustin"
          data-header-light=""
          className="relative scroll-mt-24 bg-[#f5f0e9] px-6 pb-20 pt-24 lg:px-12 lg:pb-28 lg:pt-28"
          style={{ overflowX: "clip" }}
        >
          <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.08]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <CaseNumberBlock index={2} title={tustin.gallery.title} dark={false} />
              <div className="pf-reveal" data-gsap-reveal="true">
                <CaseLedger caseData={tustin} dark={false} onOpenSet={() => openAt(2)} />
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-3 lg:mt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4">
              <div data-tile-group="" className="grid gap-3 lg:gap-4">
                <CaseTile
                  src={tustin.lead}
                  caseData={tustin}
                  index={0}
                  dark={false}
                  aspect="aspect-[4/3]"
                  sizes="(max-width: 1024px) 50vw, 44vw"
                  onOpen={(s) => openAt(2, s)}
                />
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  {tustin.grid.slice(0, 2).map((src, i) => (
                    <CaseTile
                      key={src}
                      src={src}
                      caseData={tustin}
                      index={i + 1}
                      dark={false}
                      sizes="(max-width: 1024px) 25vw, 22vw"
                      onOpen={(s) => openAt(2, s)}
                    />
                  ))}
                </div>
              </div>
              <div data-tile-group="" className="grid gap-3 lg:mt-20 lg:gap-4">
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  {tustin.grid.slice(2, 4).map((src, i) => (
                    <CaseTile
                      key={src}
                      src={src}
                      caseData={tustin}
                      index={i + 3}
                      dark={false}
                      sizes="(max-width: 1024px) 25vw, 18vw"
                      onOpen={(s) => openAt(2, s)}
                    />
                  ))}
                </div>
                <CaseTile
                  src={tustin.grid[4]}
                  caseData={tustin}
                  index={5}
                  dark={false}
                  aspect="aspect-[4/3]"
                  sizes="(max-width: 1024px) 50vw, 36vw"
                  onOpen={(s) => openAt(2, s)}
                />
              </div>
            </div>

            <ContactStrip photos={tustin.strip} title={tustin.gallery.title} dark={false} />
          </div>
        </section>

        {/* ── Surface 5 · Next up: one honest in-progress example ── */}
        <section
          data-section="portfolio-next"
          data-header-dark=""
          className="relative bg-black px-6 pb-20 pt-24 text-white lg:px-12 lg:pb-24 lg:pt-28"
          style={{ overflowX: "clip" }}
        >
          <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.12]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14">
              <div className="pf-reveal" data-gsap-reveal="true">
                <span className="font-labels text-[10px] uppercase tracking-[0.24em] text-white/38">
                  Next up
                </span>
                <h2 className="mt-4 font-editorial text-[clamp(1.9rem,3.2vw,3.4rem)] leading-[0.94]">
                  {EXAMPLE_PROJECT.title}
                </h2>
                <div className="mt-5 inline-flex items-center gap-2 border border-[var(--color-accent)]/55 px-3 py-2">
                  <span className="h-1.5 w-1.5 bg-[var(--color-accent)]" aria-hidden="true" />
                  <span className="font-labels text-[8px] uppercase tracking-[0.2em] text-white/72">
                    In progress — photography pending
                  </span>
                </div>
                <p className="mt-6 max-w-md text-sm leading-7 text-white/56">
                  {EXAMPLE_PROJECT.description}
                </p>
                <div className="mt-6 border-t border-white/12 pt-4 font-labels text-[8px] uppercase leading-5 tracking-[0.16em] text-white/36">
                  {EXAMPLE_PROJECT.spec} / {EXAMPLE_PROJECT.location}
                </div>
              </div>

              <div data-tile-group="" className="grid grid-cols-3 gap-3">
                {(EXAMPLE_PROJECT.images ?? [EXAMPLE_PROJECT.image]).map((src, i) => (
                  <div
                    key={src}
                    data-gsap-reveal="true"
                    className={`pf-tile relative overflow-hidden bg-[#111] ${
                      i === 0 ? "col-span-3 aspect-[16/8]" : "col-span-3 aspect-[16/8] sm:col-span-1 sm:aspect-[4/5]"
                    } ${i === 0 ? "" : "hidden sm:block"}`}
                  >
                    <Image
                      src={src}
                      alt={`Representative frame ${i + 1} — ${EXAMPLE_PROJECT.title} scope reference`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 30vw"
                      quality={72}
                      placeholder="blur"
                      blurDataURL={lqip(src)}
                      className="object-cover"
                      style={{ filter: "contrast(1.04) saturate(1.02)" }}
                    />
                  </div>
                ))}
                <p className="col-span-3 font-labels text-[8px] uppercase leading-5 tracking-[0.18em] text-white/34">
                  Representative frames — full documentation follows completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Surface 6 · CTA ── */}
        <section
          data-section="portfolio-cta"
          data-header-light=""
          className="relative bg-[#f5f0e9] px-6 pb-14 pt-24 lg:px-12 lg:pb-16 lg:pt-28"
          style={{ overflowX: "clip" }}
        >
          <SectionMotionBackdrop tone="dark" density="quiet" className="opacity-[0.08]" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="pf-reveal" data-gsap-reveal="true">
              <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/42">
                Ready to compare notes
              </span>
              <h2 className="mt-3 max-w-2xl font-editorial text-[clamp(1.9rem,3.2vw,3.4rem)] leading-[0.92]">
                Ready to price the next scope?
              </h2>
            </div>
            <div className="pf-reveal flex flex-wrap gap-3 lg:justify-end" data-gsap-reveal="true">
              <a
                href={SITE.phoneHref}
                className="min-h-[44px] bg-black px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Call {SITE.phone}
              </a>
              <Link
                href="/contact"
                className="min-h-[44px] border border-black/20 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black/70 transition-colors hover:border-black hover:text-black"
              >
                Start a project
              </Link>
            </div>
          </div>
        </section>
      </PortfolioFlow>

      {/* Per-case lightbox — full photo set, arrows/Esc/backdrop/scroll-lock */}
      {active && lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.gallery.title} photo viewer`}
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
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 font-labels text-white/70 transition-colors hover:border-white hover:text-white lg:left-8"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 font-labels text-white/70 transition-colors hover:border-white hover:text-white lg:right-8"
          >
            ›
          </button>
          <div className="relative h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image
              key={active.gallery.photos[lightbox.p]}
              src={active.gallery.photos[lightbox.p]}
              alt={`${active.gallery.title} — ${active.gallery.scope}, photo ${lightbox.p + 1} of ${active.gallery.photos.length}`}
              fill
              sizes="100vw"
              quality={82}
              className="object-contain"
              priority
            />
          </div>
          <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-labels text-[10px] uppercase tracking-[0.2em] text-white/70">
            {active.gallery.title}
            <span className="mx-2 text-white/35">/</span>
            {String(lightbox.p + 1).padStart(2, "0")} — {String(active.gallery.photos.length).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}
