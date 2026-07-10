"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { PROCESS_STEPS_V2, SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import { revealOnVisible } from "@/utils/revealOnVisible";

gsap.registerPlugin(ScrollTrigger);

// NS-grammar vision + process: light editorial flow. Asymmetric intro split,
// full-width landscape photograph with parallax scrub, quiet marquee strip,
// then the five-step process as hairline-divided rows that reveal as the
// reader scrolls past each one. No pins, no background washes.

const marquee = [
  "active listening",
  "build your vision",
  "dedicated to your dream",
  "refined building",
  "lasting partnerships",
];

const processImages = [
  "/images/generated/home-process-initial-contact-v2.jpg",
  "/images/generated/home-process-site-visit-v2.jpg",
  "/images/generated/home-process-permit-approval-v2.jpg",
  "/images/generated/home-process-construction-v2.jpg",
  "/images/generated/home-process-post-construction-v2.jpg",
];

export default function HomeVisionSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const statementEl = statementRef.current;
    if (!section) return;

    // Word-fill scrub on the brand statement (Fix 1 — four-guard cleanup)
    let split: SplitType | null = null;
    let mounted = true;
    const frame = requestAnimationFrame(() => {
      if (!mounted || !statementEl?.isConnected) return;
      if (!AnimationController.shouldAnimate()) return;
      split = new SplitType(statementEl, { types: "words" });
      gsap.fromTo(
        split.words ?? [],
        { opacity: 0.28 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: statementEl,
            start: "top 88%",
            end: "top 55%",
            scrub: 0.9,
          },
        }
      );
    });

    // One-shot reveals ride IntersectionObserver, not ScrollTrigger positions —
    // positional once-triggers go stale inside the sticky stack and after
    // client-side route transitions (PATTERNS.md Fix 22).
    const revealCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const headlineLines = gsap.utils.toArray<HTMLElement>(".vision-headline-line");
      const introEls = gsap.utils.toArray<HTMLElement>(".vision-intro-el");
      const processRows = gsap.utils.toArray<HTMLElement>(".process-row");
      const processHead = gsap.utils.toArray<HTMLElement>(".process-head-el");
      const closingEls = gsap.utils.toArray<HTMLElement>(".vision-closing-el");

      gsap.set(headlineLines, { yPercent: 110 });
      gsap.set(introEls, { y: 22, opacity: 0 });
      gsap.set(processRows, { y: 26, opacity: 0 });
      gsap.set(processHead, { y: 20, opacity: 0 });
      gsap.set(closingEls, { y: 18, opacity: 0 });
      if (photoRef.current) gsap.set(photoRef.current, { clipPath: "inset(10% 9% 10% 9%)" });

      if (!AnimationController.shouldAnimate()) {
        gsap.set(headlineLines, { yPercent: 0 });
        gsap.set([...introEls, ...processRows, ...processHead, ...closingEls], {
          y: 0,
          opacity: 1,
        });
        if (photoRef.current) gsap.set(photoRef.current, { clipPath: "inset(0%)" });
        return;
      }

      revealCleanups.push(
        revealOnVisible([headlineRef.current ?? section], () => {
          gsap.to(headlineLines, {
            yPercent: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
          });
        })
      );

      revealCleanups.push(
        revealOnVisible(introEls, (el, i) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.06,
            ease: "power3.out",
          });
        })
      );

      // Landscape photograph — grows from an inset frame to full bleed
      if (photoRef.current) {
        gsap.to(photoRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: photoRef.current,
            start: "top 88%",
            end: "center 45%",
            scrub: 0.9,
          },
        });
      }
      if (photoInnerRef.current) {
        gsap.fromTo(
          photoInnerRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: photoRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      revealCleanups.push(
        revealOnVisible(processHead, (el, i) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.07,
            ease: "power3.out",
          });
        })
      );

      // Process rows — decisive reveal per row
      revealCleanups.push(
        revealOnVisible(processRows, (row) => {
          gsap.to(row, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          });
        })
      );

      // Step-by-step: exactly ONE row is lit at a time. The panel lives
      // inside a sticky-stacked surface, so document-offset bands go stale
      // once the surface pins — select the active row from the rows' actual
      // on-screen rects instead (sticky-proof).
      const stepList = section.querySelector<HTMLElement>(".process-list");
      if (stepList && processRows.length) {
        const setActive = (idx: number) => {
          processRows.forEach((row, i) =>
            row.classList.toggle("process-row-active", i === idx)
          );
        };
        let lastListTop = Infinity;
        let stuckStartY: number | null = null;
        const updateActive = () => {
          // 0.66 (not 0.55): rows must all light BEFORE the next surface
          // covers the shortened panel — the last row now activates during
          // natural scroll, right around the moment the surface pins.
          const focusY = window.innerHeight * 0.66;
          const listRect = stepList.getBoundingClientRect();
          let idx: number;
          if (listRect.top > focusY) {
            idx = -1;
          } else if (listRect.bottom < focusY) {
            idx = processRows.length - 1;
          } else {
            idx = 0;
            processRows.forEach((row, i) => {
              if (row.getBoundingClientRect().top <= focusY) idx = i;
            });
          }
          // Once the surface pins beneath the next one, rects freeze while
          // scrolling continues — keep the walk advancing through the
          // remaining steps over the cover distance.
          const moving = Math.abs(listRect.top - lastListTop) > 0.5;
          lastListTop = listRect.top;
          if (!moving && idx >= 0) {
            if (stuckStartY === null) stuckStartY = window.scrollY;
            // 0.35 viewports, not 0.8: the cover eats the bottom rows first,
            // so any remaining steps must finish in the first third of the
            // cover distance while they are still on screen.
            const p = Math.min(
              1,
              Math.max(0, (window.scrollY - stuckStartY) / (window.innerHeight * 0.35))
            );
            idx = Math.min(
              processRows.length - 1,
              idx + Math.round(p * (processRows.length - 1 - idx))
            );
          } else if (moving) {
            stuckStartY = null;
          }
          setActive(idx);
        };
        ScrollTrigger.create({
          trigger: stepList,
          start: "top bottom",
          end: "bottom top",
          onUpdate: updateActive,
          onRefresh: updateActive,
          onEnter: updateActive,
          onLeaveBack: () => setActive(-1),
        });
        updateActive();
      }

      // Progress rail — maroon fill draws down alongside the rows
      const railFill = section.querySelector<HTMLElement>(".process-rail-fill");
      const railList = section.querySelector<HTMLElement>(".process-list");
      if (railFill && railList) {
        gsap.fromTo(
          railFill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: railList,
              start: "top 78%",
              end: "bottom 52%",
              scrub: 0.9,
            },
          }
        );
      }

      // Hairline under each row draws as it reveals
      const rules = gsap.utils.toArray<HTMLElement>(".process-rule");
      gsap.set(rules, { scaleX: 0, transformOrigin: "left" });
      revealCleanups.push(
        revealOnVisible(rules, (rule) => {
          gsap.to(rule, {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.inOut",
          });
        })
      );

      revealCleanups.push(
        revealOnVisible(closingEls, (el, i) => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.75,
            delay: i * 0.08,
            ease: "power3.out",
          });
        })
      );
    }, sectionRef);

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      revealCleanups.forEach((dispose) => dispose());
      if (split && statementEl?.isConnected) {
        try {
          split.revert();
        } catch {}
      }
      split = null;
      try {
        ctx.revert();
      } catch {}
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="vision"
      className="relative bg-[#f7f7f3] text-[#111]"
    >
      {/* Intro — asymmetric editorial split */}
      <div
        ref={photoRef}
        data-header-dark=""
        className="relative min-h-[44rem] overflow-hidden bg-[#050505] text-white sm:min-h-[48rem] lg:min-h-[92vh]"
        data-gsap-reveal="true"
      >
        <div ref={photoInnerRef} className="absolute -inset-y-[10%] inset-x-0" style={{ willChange: "transform" }}>
          <Image
            src="/images/generated/home-process-fireplace-bg.webp"
            alt="Finished interior with stone fireplace and warm built-in lighting"
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
            style={{ filter: "contrast(1.04) saturate(1.04)" }}
          />
        </div>
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.54)_44%,rgba(0,0,0,0.2)_100%),linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.72)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex min-h-[44rem] max-w-[1680px] flex-col justify-end px-6 py-16 sm:min-h-[48rem] lg:min-h-[92vh] lg:px-12 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="vision-intro-el mb-6 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.26em] text-white/64 lg:mb-8">
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-[var(--color-accent-light)]"
              />
              Our first step is listening
            </p>
            <h3
              ref={headlineRef}
              className="max-w-[12ch] font-editorial text-[clamp(3rem,5vw,5.25rem)] font-normal leading-[0.94] tracking-[-0.01em] text-white"
            >
              <span className="block overflow-hidden">
                <span className="vision-headline-line block">
                  Refining industry standards.
                </span>
              </span>
            </h3>
          </div>

          <div className="flex flex-col justify-end lg:col-span-5 lg:col-start-8">
            <p className="vision-intro-el max-w-md text-[15px] leading-7 text-white/72">
              A short call to understand the project, the site, and the right
              next move.
            </p>
            <p
              ref={statementRef}
              className="vision-intro-el mt-7 max-w-md border-l-2 border-[var(--color-accent-light)] pl-5 text-[15px] leading-7 text-white/84 lg:pl-6"
            >
              Embodying meticulous planning, seamless communication, and
              unparalleled craftsmanship from the first consultation through
              post-construction, ensuring every detail exceeds expectation.
            </p>
            <div className="vision-intro-el mt-8 flex flex-wrap gap-3">
              <a
                href={SITE.phoneHref}
                className="bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                Call {SITE.phone}
              </a>
              <Link
                href="/contact"
                className="border border-white/28 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white/74 transition-colors hover:border-white/60 hover:text-white"
              >
                Send project details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Landscape photograph — expands from an inset frame to full bleed
          as the reader scrolls through it */}
      </div>

      {/* Marquee — refined mono strip, hairline-bounded */}
      <div className="border-y border-black/10 py-5" aria-hidden="true">
        <div
          className="flex w-max gap-10 whitespace-nowrap font-labels text-[11px] uppercase tracking-[0.3em] text-black/45"
          style={{ animation: "marqueeScroll 40s linear infinite" }}
        >
          {[...marquee, ...marquee, ...marquee, ...marquee].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-10">
              <span style={i % 5 === 2 ? { color: "var(--color-accent)" } : undefined}>
                {item}
              </span>
              <span
                className="h-1.5 w-1.5 rotate-45"
                style={{ background: "var(--color-accent)", opacity: 0.55 }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Process — full-bleed black panel, maroon ignition, progress rail */}
      <div data-header-dark="" className="bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-[1680px] px-6 pt-14 pb-16 lg:px-12 lg:pt-16 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="process-head-el mb-6 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.26em] text-[var(--color-accent-light)] lg:mb-8">
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-10 bg-[var(--color-accent-light)]"
                />
                The approach
              </p>
              <h3 className="process-head-el max-w-[12ch] font-editorial text-[clamp(2.2rem,3.8vw,3.7rem)] font-normal leading-[1.06] tracking-[-0.01em] text-white">
                Build philosophy, made visible.
              </h3>
              <p className="process-head-el mt-6 max-w-sm text-[15px] leading-7 text-white/60">
                Clear communication, clean sequencing, and a finish that holds
                up after the crew leaves.
              </p>
              <div className="process-head-el mt-7">
                <Link
                  href="/contact"
                  className="inline-flex w-fit items-center gap-3 bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
                >
                  Start Step 01
                  <span aria-hidden="true">+</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <div className="process-list relative pl-6 lg:pl-8">
                {/* Progress rail — maroon fill draws down as the rows pass */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 top-0 w-px bg-white/12"
                />
                <div
                  aria-hidden="true"
                  className="process-rail-fill absolute bottom-0 left-0 top-0 w-px bg-[var(--color-accent-light)]"
                />
                <ol className="border-t border-white/12">
                  {PROCESS_STEPS_V2.map((step, i) => (
                    <li key={step.number} className="relative">
                      <div className="process-row grid grid-cols-[2rem_8rem_minmax(0,1fr)] items-center gap-4 py-4 sm:grid-cols-[3.25rem_9.5rem_minmax(0,1fr)_auto] lg:grid-cols-[3.5rem_11.5rem_minmax(0,1fr)_auto] lg:gap-5 lg:py-5">
                        <span className="process-num font-numbers text-[11px] text-white/50 transition-colors duration-400">
                          {step.number}
                        </span>
                        <div className="process-thumb relative h-20 overflow-hidden bg-white/5 lg:h-[5.5rem]">
                          <Image
                            src={processImages[i] ?? "/images/process/detail.jpg"}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 128px, (max-width: 1024px) 152px, 184px"
                            quality={92}
                            className="object-cover opacity-90 transition-all duration-500"
                            style={{ filter: "contrast(1.06) saturate(1.08)" }}
                          />
                        </div>
                        <h4 className="process-title font-editorial text-[clamp(1.25rem,2.15vw,2.1rem)] font-normal leading-tight text-white/70 transition-all duration-400">
                          {step.title}
                        </h4>
                        <span className="process-sub hidden font-labels text-[9px] uppercase tracking-[0.2em] text-white/48 transition-colors duration-400 sm:block">
                          {step.subtitle}
                        </span>
                      </div>
                      <div className="process-rule h-px w-full bg-white/12" aria-hidden="true" />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Section footnote */}
          <p className="vision-closing-el mt-8 border-t border-white/10 pt-4 font-labels text-[9px] uppercase tracking-[0.22em] text-white/35 lg:mt-10">
            {SITE.address.city}, CA / South Bay / CA #{SITE.license}
          </p>
        </div>
      </div>
    </section>
  );
}
