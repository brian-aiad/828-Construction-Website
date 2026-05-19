"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";
import { useServicePageMotion } from "@/components/services/useServicePageMotion";

const MATRIX = [
  ["Before purchase", "Understand defects, leverage, and realistic repair exposure."],
  ["Before hiring", "Review scope quality, missing work, and bid risk."],
  ["Before permits", "Clarify feasibility, sequencing, and likely constraints."],
  ["During conflict", "Get a field-based read on what is actually happening."],
];

export default function ConsultingServiceContent() {
  const rootRef = useServicePageMotion();

  return (
    <div ref={rootRef} className="bg-[#f7f4f0] text-black">
      <section className="relative min-h-screen overflow-hidden">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.46fr_0.54fr]">
          <div className="relative flex flex-col justify-center px-6 py-28 sm:px-10 lg:px-16">
            <div className="relative z-10">
              <Link href="/services" className="font-labels text-[10px] uppercase tracking-[0.18em] text-black/45 hover:text-black">
                Back to services
              </Link>
              <div className="detail-line mt-12 h-px max-w-20 origin-left bg-[var(--color-accent)]" />
              <span className="mt-7 block font-labels text-[10px] uppercase tracking-[0.24em] text-black/48">
                Construction Consulting
              </span>
              <h1 className="mt-7 max-w-[8ch] font-editorial text-[clamp(4rem,8vw,8rem)] leading-[0.86]">
                Know what you are walking into.
              </h1>
              <p className="mt-8 max-w-lg text-base leading-8 text-black/62">
                828 helps homeowners and investors make clearer construction decisions before money, time, and trust are committed in the wrong direction.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href={SITE.phoneHref} className="bg-black px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white hover:bg-[var(--color-accent)]">
                  Call {SITE.phone}
                </a>
                <Link href="/contact" className="border border-black/18 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black hover:border-black">
                  Request consulting
                </Link>
              </div>
            </div>
          </div>
          <div className="detail-image relative min-h-[52vh] overflow-hidden lg:min-h-screen">
            <Image
              src="/images/services/generated/consulting-service-hero-clean.png"
              alt="Construction consulting table with plans and measuring tools"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
              style={{ filter: "contrast(1.04) saturate(1.02)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-20 text-white lg:py-28">
        <DraftingMotionLayer intensity="quiet" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16 lg:px-12">
          <div className="detail-reveal">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-white/42">
              Decision matrix
            </span>
            <h2 className="mt-5 font-editorial text-[clamp(2.8rem,6vw,6rem)] leading-[0.9]">
              The best time to ask is before the mistake.
            </h2>
          </div>
          <div className="detail-stagger border-t border-white/10">
            {MATRIX.map(([title, body], i) => (
              <article key={title} className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[5rem_1fr]">
                <span className="font-numbers text-3xl font-bold text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-editorial text-4xl leading-none">{title}</h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/56">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
          <div className="detail-image relative min-h-[30rem] overflow-hidden">
            <Image
              src="/images/projects/generated/consulting-pack-02.jpg"
              alt="Construction inspection and consulting access point"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
          </div>
          <div className="detail-reveal flex flex-col justify-center">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/45">
              Field-based advisory
            </span>
            <h2 className="mt-5 font-editorial text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.9]">
              Practical eyes on a complicated decision.
            </h2>
            <p className="mt-7 text-base leading-8 text-black/62">
              Consulting should not feel academic. Joe brings contractor-level pattern recognition to the site, report, bid, or property decision.
            </p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {["Feasibility", "Bid review", "Defect review", "Owner guidance"].map((item) => (
                <div key={item} className="border border-black/10 bg-white px-5 py-5">
                  <span className="font-labels text-[10px] uppercase tracking-[0.16em] text-black/68">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-20 text-white lg:py-28">
        <DraftingMotionLayer intensity="quiet" className="hidden md:block" />
        <div className="detail-reveal relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-10 border-y border-white/10 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl font-editorial text-[clamp(2.8rem,6vw,6rem)] leading-[0.9]">
              A short call can prevent a very expensive assumption.
            </h2>
            <Link href="/contact" className="bg-white px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black hover:bg-[var(--color-accent)] hover:text-white">
              Ask for Joe&apos;s read
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
