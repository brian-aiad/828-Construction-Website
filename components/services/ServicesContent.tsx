"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES, SITE } from "@/lib/constants";
import { AnimationController } from "@/utils/animationControl";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";
import CraftInstrumentLayer from "@/components/system/CraftInstrumentLayer";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_VISUALS: Record<string, { image: string; label: string; line: string }> = {
  adu: {
    image: "/images/services/generated/adu-service-hero-clean.png",
    label: "01 / ADU",
    line: "New living space, permitted and built to hold value.",
  },
  remediation: {
    image: "/images/services/generated/remediation-service-hero-clean.png",
    label: "02 / Remediation",
    line: "Find the cause, open only what matters, rebuild correctly.",
  },
  consulting: {
    image: "/images/services/generated/consulting-service-hero-clean.png",
    label: "03 / Consulting",
    line: "Decide before you spend. Scope, risk, cost, and next moves.",
  },
};

function useServicesMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => () => {
    try {
      ctxRef.current?.revert();
    } catch {}
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>(".services-reveal");
      const images = gsap.utils.toArray<HTMLElement>(".services-image");
      const lines = gsap.utils.toArray<HTMLElement>(".services-line");

      if (!AnimationController.shouldAnimate()) {
        gsap.set([...reveals, ...images, ...lines], { autoAlpha: 1, y: 0, clipPath: "inset(0%)", scaleX: 1 });
        return;
      }

      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", end: "top 58%", scrub: 1.3 },
          }
        );
      });

      images.forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 88%", end: "top 48%", scrub: 1.45 },
          }
        );
        const img = el.querySelector("img");
        if (img) {
          gsap.to(img, {
            yPercent: -7,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.7 },
          });
        }
      });

      lines.forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 60%", scrub: 1.2 },
          }
        );
      });
    }, root);

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

function ServiceCard({ slug, index }: { slug: string; index: number }) {
  const service = SERVICES.find((item) => item.slug === slug)!;
  const visual = SERVICE_VISUALS[slug];

  return (
    <Link
      href={`/services/${slug}`}
      className="services-reveal group grid min-h-[28rem] grid-cols-1 overflow-hidden border border-white/10 bg-black lg:grid-cols-[1.1fr_0.9fr]"
      aria-label={`View ${service.title}`}
    >
      <div className={`services-image relative min-h-[18rem] overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""}`}>
        <Image
          src={visual.image}
          alt={`${service.title} by 828 Construction`}
          fill
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          style={{ filter: "contrast(1.04) saturate(1.03)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/12 to-transparent" />
      </div>
      <div className="relative flex flex-col justify-between p-7 sm:p-9 lg:p-12">
        <div>
          <div className="mb-8 flex items-center gap-4">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-white/42">
              {visual.label}
            </span>
            <span className="services-line h-px flex-1 origin-left bg-[var(--color-accent)]/55" />
          </div>
          <h2 className="font-editorial text-[clamp(2.25rem,5vw,5rem)] leading-[0.9] text-white">
            {service.title}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/58 sm:text-base">
            {visual.line}
          </p>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="font-labels text-[10px] uppercase tracking-[0.18em] text-white/42">
            {service.short}
          </span>
          <span className="font-labels text-[11px] uppercase tracking-[0.18em] text-white transition-transform duration-300 group-hover:translate-x-1">
            Open
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ServicesContent() {
  const rootRef = useServicesMotion();

  return (
    <div ref={rootRef} className="bg-black text-white">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/services/services-hero.jpg"
          alt="Framed construction interior for 828 Construction services"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "contrast(1.05) saturate(1.02) brightness(0.92)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/32 to-black" />
        <DraftingMotionLayer intensity="quiet" variant="intro" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-16 pt-32 lg:px-12">
          <div className="max-w-5xl">
            <span className="hero-meta-animate font-labels text-[10px] uppercase tracking-[0.24em] text-white/55">
              Services / CA License #{SITE.license}
            </span>
            <h1 className="mt-8 font-editorial text-[clamp(4rem,11vw,11rem)] leading-[0.84] tracking-normal text-white">
              Three ways to build with control.
            </h1>
          </div>
          <div className="mt-12 grid gap-3 border-t border-white/12 pt-6 md:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex items-center justify-between border border-white/10 bg-black/20 px-4 py-4 backdrop-blur-md transition-colors hover:border-[var(--color-accent)]/70"
              >
                <span className="font-labels text-[9px] uppercase tracking-[0.18em] text-white/48">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-labels text-[10px] uppercase tracking-[0.18em] text-white">
                  {service.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <CraftInstrumentLayer tone="light" density="quiet" />
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="services-reveal mb-12 max-w-3xl">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-white/42">
              Choose the right lane
            </span>
            <h2 className="mt-5 font-editorial text-[clamp(2.6rem,6vw,6rem)] leading-[0.9] text-white">
              Not every job needs the same kind of contractor.
            </h2>
          </div>
          <div className="space-y-5">
            {["adu", "remediation", "consulting"].map((slug, index) => (
              <ServiceCard key={slug} slug={slug} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f3ef] py-20 text-black lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-12">
          <div className="services-image relative min-h-[28rem] overflow-hidden">
            <Image
              src="/images/services/generated/consulting-service-hero-clean.png"
              alt="Construction plans, measure, and material samples"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
          <div className="services-reveal flex flex-col justify-center">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/45">
              The 828 standard
            </span>
            <h2 className="mt-5 font-editorial text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.9]">
              Scope first. Then build.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["01", "See the condition"],
                ["02", "Define the risk"],
                ["03", "Build the right fix"],
              ].map(([num, text]) => (
                <div key={num} className="border-t border-black/15 pt-5">
                  <span className="font-numbers text-2xl font-bold text-[var(--color-accent)]">{num}</span>
                  <p className="mt-4 text-sm leading-6 text-black/62">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <DraftingMotionLayer intensity="quiet" />
        <div className="services-reveal relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-10 border-y border-white/10 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl font-editorial text-[clamp(2.6rem,6vw,6rem)] leading-[0.9]">
              Bring the project in before the guesswork starts.
            </h2>
            <div className="flex flex-wrap gap-4">
              <a
                href={SITE.phoneHref}
                className="bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--color-accent)] hover:text-white"
              >
                Call {SITE.phone}
              </a>
              <Link
                href="/contact"
                className="border border-white/16 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:border-white"
              >
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
