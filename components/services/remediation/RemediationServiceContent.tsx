"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import DraftingMotionLayer from "@/components/system/DraftingMotionLayer";
import CraftInstrumentLayer from "@/components/system/CraftInstrumentLayer";
import { useServicePageMotion } from "@/components/services/useServicePageMotion";

const DIAGNOSTICS = [
  ["01", "Trace", "Moisture path, failure point, and affected assemblies are identified before repair scope expands."],
  ["02", "Contain", "The work area is controlled so the fix stays clean, organized, and easier to verify."],
  ["03", "Rebuild", "Failed material is removed and rebuilt with better detailing, not patched over."],
];

export default function RemediationServiceContent() {
  const rootRef = useServicePageMotion();

  return (
    <div ref={rootRef} className="bg-black text-white">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/services/generated/remediation-service-hero-clean.png"
          alt="Clean remediation work area with exposed framing and drying equipment"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "contrast(1.04) saturate(1.02) brightness(0.94)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/62 to-black/12" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/10" />
        <div className="detail-scan absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <DraftingMotionLayer intensity="quiet" variant="intro" className="hidden md:block" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-28 lg:px-12">
          <div className="max-w-4xl">
            <Link href="/services" className="font-labels text-[10px] uppercase tracking-[0.18em] text-white/44 hover:text-white">
              Back to services
            </Link>
            <div className="detail-line mt-12 h-px max-w-20 origin-left bg-[var(--color-accent)]" />
            <span className="mt-7 block font-labels text-[10px] uppercase tracking-[0.24em] text-white/50">
              Remediation
            </span>
            <h1 className="mt-7 font-editorial text-[clamp(4rem,10vw,10rem)] leading-[0.84]">
              Fix the cause, not the stain.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-white/62">
              Remediation should feel measured, not chaotic. 828 opens, documents, controls, and rebuilds with the discipline of a builder who understands what failed.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={SITE.phoneHref} className="bg-white px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black hover:bg-[var(--color-accent)] hover:text-white">
                Call {SITE.phone}
              </a>
              <Link href="/contact" className="border border-white/18 px-7 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-white hover:border-white">
                Start diagnosis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <CraftInstrumentLayer tone="light" density="quiet" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12">
          <div className="detail-reveal">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-white/42">
              Diagnostic method
            </span>
            <h2 className="mt-5 font-editorial text-[clamp(2.8rem,6vw,6rem)] leading-[0.9]">
              A cleaner repair starts with restraint.
            </h2>
            <p className="mt-7 max-w-md text-base leading-8 text-white/58">
              Good remediation does not overreact. It narrows the cause, protects the home, then rebuilds the assembly with better field decisions.
            </p>
          </div>
          <div className="detail-stagger grid gap-4">
            {DIAGNOSTICS.map(([num, title, body]) => (
              <article key={num} className="grid gap-5 border-t border-white/10 py-7 sm:grid-cols-[5rem_1fr]">
                <span className="font-numbers text-4xl font-bold text-[var(--color-accent)]">{num}</span>
                <div>
                  <h3 className="font-editorial text-4xl leading-none">{title}</h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/56">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4f0] py-20 text-black lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="detail-image relative min-h-[24rem] overflow-hidden">
              <Image
                src="/images/projects/generated/remediation-pack-02.jpg"
                alt="Opened wall condition before remediation repair"
                fill
                sizes="(max-width: 1024px) 100vw, 26vw"
                className="object-cover"
              />
            </div>
            <div className="detail-image relative min-h-[24rem] overflow-hidden">
              <Image
                src="/images/projects/generated/remediation-pack-03.jpg"
                alt="Remediation drying equipment in a clean work area"
                fill
                sizes="(max-width: 1024px) 100vw, 26vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="detail-reveal flex flex-col justify-center">
            <span className="font-labels text-[10px] uppercase tracking-[0.22em] text-black/45">
              What customers need to see
            </span>
            <h2 className="mt-5 font-editorial text-[clamp(2.6rem,5.6vw,5.6rem)] leading-[0.9]">
              Proof that the repair is controlled.
            </h2>
            <p className="mt-7 text-base leading-8 text-black/62">
              Remediation customers are usually stressed. The page should communicate calm, documentation, clean work areas, and a correct rebuild path.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10 py-20 lg:py-28">
        <DraftingMotionLayer intensity="quiet" className="hidden md:block" />
        <div className="detail-reveal relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl font-editorial text-[clamp(2.8rem,6vw,6rem)] leading-[0.9]">
              If something keeps coming back, bring us in before another patch.
            </h2>
            <Link href="/contact" className="bg-white px-8 py-4 font-labels text-[10px] uppercase tracking-[0.18em] text-black hover:bg-[var(--color-accent)] hover:text-white">
              Discuss remediation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
