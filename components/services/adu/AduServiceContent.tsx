"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";
import SectionMotionBackdrop from "@/components/system/SectionMotionBackdrop";
import { useServicePageMotion } from "@/components/services/useServicePageMotion";

const PATH = [
  ["01", "Feasibility", "Lot, access, setbacks, utilities, and budget direction are checked before design momentum starts."],
  ["02", "Permit-ready scope", "Plans, finish level, and construction realities are aligned so the build is not guessing."],
  ["03", "Field execution", "Foundation, framing, envelope, utilities, and finish work stay under one accountable standard."],
];

export default function AduServiceContent() {
  const rootRef = useServicePageMotion();

  return (
    <div ref={rootRef} className="bg-black text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.56fr_0.44fr]">
          <div className="detail-image relative order-2 min-h-[52vh] overflow-hidden lg:order-1 lg:min-h-screen">
            <Image
              src="/images/projects/adu-exterior-new.jpg"
              alt="Modern detached ADU exterior for 828 Construction"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
              style={{ filter: "contrast(1.03) saturate(1.03)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:to-black/72" />
            <div className="absolute bottom-8 left-8 hidden border border-white/14 bg-black/42 px-5 py-4 backdrop-blur-md lg:block">
              <span className="font-labels text-[9px] uppercase tracking-[0.2em] text-white/52">
                Detached ADU / South Bay scale
              </span>
            </div>
          </div>
          <div className="relative order-1 flex flex-col justify-center px-6 py-28 sm:px-10 lg:order-2 lg:px-16">
            <DraftingMotionLayer intensity="quiet" variant="intro" className="hidden md:block" />
            <div className="relative z-10">
              <Link href="/services" className="font-labels text-[10px] uppercase tracking-[0.18em] text-white/42 hover:text-white">
                Back to services
              </Link>
              <div className="detail-line mt-12 h-px max-w-20 origin-left bg-[var(--color-accent)]" />
              <span className="mt-7 block font-labels text-[10px] uppercase tracking-[0.24em] text-white/48">
                ADU Construction
              </span>
              <h1 className="mt-7 font-editorial text-[clamp(4rem,9vw,9rem)] leading-[0.84]">
                Build more room without lowering the standard.
              </h1>
              <p className="mt-8 max-w-lg text-base leading-8 text-white/58">
                828 builds ADUs with the same seriousness as a primary home: practical planning, clean detailing, and accountable field work from permit through finish.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href={SITE.phoneHref} className="bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black hover:bg-[var(--color-accent)] hover:text-white">
                  Call {SITE.phone}
                </a>
                <Link href="/contact" className="border border-white/18 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white hover:border-white">
                  Start ADU
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f7f4f0] py-20 text-black lg:py-28">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12">
          <div className="detail-reveal">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/45">
              From lot to livable unit
            </span>
            <h2 className="mt-5 font-editorial text-[clamp(2.8rem,6vw,6rem)] leading-[0.9]">
              The value is in the planning.
            </h2>
            <p className="mt-7 max-w-md text-base leading-8 text-black/62">
              The right ADU is not just square footage. It is access, privacy, utilities, durability, and a build sequence that respects the property.
            </p>
          </div>
          <div className="detail-stagger grid gap-4 md:grid-cols-3">
            {PATH.map(([num, title, body]) => (
              <article key={num} className="border-t border-black/15 pt-6">
                <span className="font-numbers text-3xl font-bold text-[var(--color-accent)]">{num}</span>
                <h3 className="mt-5 font-editorial text-3xl leading-none">{title}</h3>
                <p className="mt-5 text-sm leading-7 text-black/58">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <SectionMotionBackdrop tone="light" density="quiet" className="opacity-[0.12]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
          <div className="detail-image relative min-h-[30rem] overflow-hidden">
            <Image
              src="/images/projects/foundation-concrete.jpg"
              alt="ADU framing work"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
              style={{ filter: "contrast(1.05) saturate(1.02)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />
          </div>
          <div className="detail-reveal flex flex-col justify-center">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-white/42">
              What 828 handles
            </span>
            <h2 className="mt-5 font-editorial text-[clamp(2.6rem,5.8vw,5.8rem)] leading-[0.9]">
              One accountable build path.
            </h2>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {["Detached ADUs", "Garage conversions", "Permit coordination", "Foundation to finish"].map((item) => (
                <div key={item} className="border border-white/10 bg-white/[0.035] px-5 py-5">
                  <span className="font-labels text-[10px] uppercase tracking-[0.16em] text-white/68">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 py-20 lg:py-28">
        <DraftingMotionLayer intensity="quiet" className="hidden md:block" />
        <div className="detail-reveal relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl font-editorial text-[clamp(2.8rem,6vw,6rem)] leading-[0.9]">
              Start with the property. Then decide what to build.
            </h2>
            <Link href="/contact" className="bg-white px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black hover:bg-[var(--color-accent)] hover:text-white">
              Talk through an ADU
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
