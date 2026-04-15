"use client";

import Link from "next/link";
import { SITE } from "@/lib/constants";
import FadeIn from "@/components/animations/FadeIn";
import NumberCounter from "@/components/animations/NumberCounter";

// ── Founder monogram placeholder ─────────────────────────────────────────
function FounderPlate() {
  return (
    <div className="plate-steel relative overflow-hidden aspect-[3/4] w-full max-w-xs">
      {/* Blueprint grid */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.5]" />

      {/* Monogram */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-bold text-white leading-none"
          style={{ fontSize: "6rem", opacity: 0.12 }}
        >
          JP
        </span>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-gray-700" />
      <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-gray-700" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-gray-700" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-gray-700" />

      {/* Label */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <span className="font-labels text-[9px] text-gray-700 tracking-[0.2em] uppercase">
          Joe P · Founder
        </span>
      </div>

      {/* Side rule */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-800 to-transparent" />
    </div>
  );
}

const credentials = [
  {
    label: "Founder",
    value: "Joe P",
    sub: "Principal & Building Science Expert",
  },
  { label: "CA License", value: `#${SITE.license}`, sub: "General Contractor" },
  { label: "Experience", value: "20+ Years", sub: "Building science, South Bay CA" },
  { label: "Established", value: "2004", sub: "Torrance, California" },
];

const philosophy = [
  {
    title: "Quality Over Quantity",
    body: "We'd rather do fewer projects done right than many done quickly. Our reputation is built on outcomes, not volume.",
  },
  {
    title: "Science, Not Guesswork",
    body: "Building science informs every decision. How materials interact, how structures perform over time, how to anticipate failures.",
  },
  {
    title: "Necessity-Driven",
    body: "Only what's required to achieve the best result. No unnecessary complexity, no upselling, no waste.",
  },
];

export default function AboutPreview() {
  return (
    <section className="bg-white py-24 lg:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Magazine layout: photo + text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20 lg:mb-28">
          {/* Photo col */}
          <FadeIn direction="right" className="lg:col-span-3">
            <FounderPlate />
          </FadeIn>

          {/* Text col */}
          <div className="lg:col-span-9">
            <FadeIn delay={0.1}>
              <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase">
                About 828
              </span>
              <h2
                className="font-display font-bold text-black mt-4 mb-8 tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
              >
                20+ Years of
                <br />
                Building Science.
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4 text-gray-500 leading-relaxed mb-10 max-w-2xl">
                <p>
                  828 Construction was founded by Joe P — a builder with over
                  two decades of hands-on experience in construction, building
                  science, and project management across Southern California.
                </p>
                <p>
                  After 20 years in the industry, Joe saw a recurring problem:
                  homeowners and investors were consistently being underserved.
                  Projects turned into drawn-out nightmares. Buildings went up
                  without proper understanding of how they&apos;d perform.
                  Remediation was done cosmetically instead of at the source.
                </p>
                <p className="text-black font-medium">
                  828 Construction was built to fix that.
                </p>
              </div>
            </FadeIn>

            {/* Stats row */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                {[
                  { target: 20, suffix: "+", label: "Years" },
                  { target: 3, suffix: "", label: "Services" },
                  { target: 8, suffix: "+", label: "Cities Served" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-numbers font-bold text-black text-4xl lg:text-5xl mb-1 tracking-tight">
                      <NumberCounter
                        target={stat.target}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="font-labels text-[9px] text-gray-400 tracking-[0.18em] uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Credentials grid */}
        <FadeIn delay={0.1} className="mb-20 lg:mb-28">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {credentials.map((c) => (
              <div key={c.label} className="bg-white p-8 lg:p-10">
                <div className="font-labels text-[9px] text-gray-400 tracking-[0.2em] uppercase mb-4">
                  {c.label}
                </div>
                <div className="font-display font-bold text-black text-xl lg:text-2xl mb-1 leading-tight">
                  {c.value}
                </div>
                <div className="text-xs text-gray-400">{c.sub}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Philosophy */}
        <div>
          <FadeIn>
            <span className="font-labels text-[10px] text-gray-400 tracking-[0.22em] uppercase block mb-10">
              Our Philosophy
            </span>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {philosophy.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div className="bg-white p-10 lg:p-12 h-full">
                  <div className="font-numbers text-gray-100 text-6xl font-bold mb-6 leading-none">
                    0{i + 1}
                  </div>
                  <h3 className="font-display font-bold text-black text-lg mb-4">
                    {p.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA */}
        <FadeIn delay={0.2} className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:bg-gray-900 transition-colors group"
          >
            Full Story
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center justify-center border border-gray-200 text-black px-8 py-4 font-labels text-[11px] tracking-[0.18em] uppercase hover:border-black transition-colors font-numbers"
          >
            {SITE.phone}
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
