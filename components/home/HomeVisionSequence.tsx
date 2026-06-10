"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { PROCESS_STEPS_V2, SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";

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

      gsap.to(headlineLines, {
        yPercent: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current ?? section,
          start: "top 85%",
          once: true,
        },
      });

      introEls.forEach((el, i) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

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

      processHead.forEach((el, i) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        });
      });

      // Process rows — decisive reveal per row
      processRows.forEach((row) => {
        gsap.to(row, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            once: true,
          },
        });
      });

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
          const focusY = window.innerHeight * 0.55;
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
            const p = Math.min(
              1,
              Math.max(0, (window.scrollY - stuckStartY) / (window.innerHeight * 0.8))
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
      gsap.utils.toArray<HTMLElement>(".process-rule").forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.inOut",
            transformOrigin: "left",
            scrollTrigger: {
              trigger: rule,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      closingEls.forEach((el, i) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.75,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, sectionRef);

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
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
      <div className="mx-auto max-w-[1680px] px-6 pb-20 lg:px-12 lg:pb-28">
        <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:gap-12 lg:pt-14">
          <div className="lg:col-span-7">
            <p className="vision-intro-el mb-6 flex items-center gap-3 font-labels text-[10px] uppercase tracking-[0.26em] text-[var(--color-accent)] lg:mb-8">
              <span
                aria-hidden="true"
                className="inline-block h-px w-10 bg-[var(--color-accent)]"
              />
              Our first step is listening
            </p>
            <h2
              ref={headlineRef}
              className="font-editorial text-[clamp(2.1rem,3.2vw,3.4rem)] font-normal leading-[1.06] tracking-[-0.01em]"
            >
              <span className="block overflow-hidden">
                <span className="vision-headline-line block whitespace-nowrap max-lg:whitespace-normal">
                  Refining industry standards.
                </span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col justify-end lg:col-span-5 lg:col-start-8">
            <p className="vision-intro-el max-w-md text-[15px] leading-7 text-black/60">
              A short call to understand the project, the site, and the right
              next move.
            </p>
            <p
              ref={statementRef}
              className="vision-intro-el mt-7 max-w-md border-l-2 border-[var(--color-accent)] pl-5 text-[15px] leading-7 text-black/78 lg:pl-6"
            >
              Embodying meticulous planning, seamless communication, and
              unparalleled craftsmanship from the first consultation through
              post-construction, ensuring every detail exceeds expectation.
            </p>
            <div className="vision-intro-el mt-9 flex flex-wrap gap-3">
              <a
                href={SITE.phoneHref}
                className="bg-[#111] px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Call {SITE.phone}
              </a>
              <Link
                href="/contact"
                className="border border-black/15 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black/65 transition-colors hover:border-black/45 hover:text-black"
              >
                Send project details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Landscape photograph — expands from an inset frame to full bleed
          as the reader scrolls through it */}
      <div className="relative w-full">
        <div
          ref={photoRef}
          data-header-dark=""
          className="relative h-[58vh] overflow-hidden bg-[#e8e8e3] sm:h-[72vh] lg:h-[92vh]"
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
        </div>
      </div>

      {/* Marquee — refined mono strip, hairline-bounded */}
      <div className="mt-20 border-y border-black/10 py-5 lg:mt-28" aria-hidden="true">
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
        <div className="mx-auto max-w-[1680px] px-6 py-24 lg:px-12 lg:py-32">
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
              <p className="process-head-el mt-8 max-w-sm text-[15px] leading-7 text-white/60">
                Clear communication, clean sequencing, and a finish that holds
                up after the crew leaves.
              </p>
              <div className="process-head-el mt-9">
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
                  {PROCESS_STEPS_V2.map((step) => (
                    <li key={step.number} className="relative">
                      <div className="process-row grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 py-7 lg:py-8">
                        <span className="process-num font-numbers text-[11px] text-white/25 transition-colors duration-400">
                          {step.number}
                        </span>
                        <h4 className="process-title font-editorial text-[clamp(1.35rem,2vw,1.9rem)] font-normal leading-tight text-white/35 transition-all duration-400">
                          {step.title}
                        </h4>
                        <span className="process-sub hidden font-labels text-[9px] uppercase tracking-[0.2em] text-white/25 transition-colors duration-400 sm:block">
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
          <p className="vision-closing-el mt-16 border-t border-white/10 pt-6 font-labels text-[9px] uppercase tracking-[0.22em] text-white/35 lg:mt-24">
            {SITE.address.city}, CA / South Bay / CA #{SITE.license}
          </p>
        </div>
      </div>
    </section>
  );
}
