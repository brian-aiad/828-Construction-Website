import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About - 20+ Years of Building Science",
  description:
    "Meet Joe P and 828 Construction. Over two decades of building science expertise in Torrance and South Bay, CA. CA License #1141119.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            About
          </span>
          <h1 className="font-[var(--font-space-grotesk)] font-bold text-5xl lg:text-7xl text-white mt-4 tracking-tight leading-none">
            Built on Experience.
            <br />
            <span className="text-gray-600">Not Just Reputation.</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <span className="text-xs font-[var(--font-space-mono)] text-gray-400 tracking-widest uppercase">
                The Story
              </span>
              <h2 className="font-[var(--font-space-grotesk)] font-bold text-3xl lg:text-4xl text-black mt-4 mb-8 tracking-tight">
                Why 828 Construction Exists
              </h2>
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>
                  828 Construction was founded by Joe P — a builder with over 20
                  years of hands-on experience in construction, building science,
                  and project management across Southern California.
                </p>
                <p>
                  After two decades working in the industry, Joe saw a recurring
                  problem: homeowners and investors were consistently being
                  underserved. Projects that should have been straightforward
                  turned into drawn-out nightmares. Buildings were going up
                  without proper understanding of how they&apos;d perform. Remediation
                  work was being done cosmetically instead of at the source.
                </p>
                <p>
                  828 Construction was built to fix that. The name is simple —
                  the work is not. Every project is approached with the full
                  weight of building science knowledge: understanding how
                  materials perform, how structures behave, and how to build
                  things that last.
                </p>
                <p>
                  We&apos;re not the biggest company in the South Bay. We&apos;re selective
                  about the projects we take on — because quality requires
                  attention, and attention has limits. That&apos;s not a compromise.
                  That&apos;s the standard.
                </p>
              </div>
            </div>

            {/* Credentials */}
            <div className="space-y-6">
              <div className="border border-gray-200 p-8">
                <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-4">
                  Founder
                </div>
                <div className="font-[var(--font-space-grotesk)] font-bold text-2xl text-black mb-2">
                  Joe P
                </div>
                <div className="text-sm text-gray-500">
                  Principal & Building Science Expert
                </div>
              </div>

              <div className="border border-gray-200 p-8">
                <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-4">
                  License
                </div>
                <div className="font-[var(--font-space-mono)] font-bold text-2xl text-black mb-2">
                  #{SITE.license}
                </div>
                <div className="text-sm text-gray-500">
                  California General Contractor
                </div>
              </div>

              <div className="border border-gray-200 p-8">
                <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-4">
                  Experience
                </div>
                <div className="font-[var(--font-space-grotesk)] font-bold text-2xl text-black mb-2">
                  20+ Years
                </div>
                <div className="text-sm text-gray-500">
                  Building science, construction management, South Bay CA
                </div>
              </div>

              <div className="border border-gray-200 p-8">
                <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-4">
                  Focus
                </div>
                <div className="space-y-2">
                  {[
                    "ADU Construction",
                    "Structural Remediation",
                    "Construction Consulting",
                    "Building Science",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-black rounded-full" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            Our Philosophy
          </span>
          <h2 className="font-[var(--font-space-grotesk)] font-bold text-4xl lg:text-5xl text-white mt-4 mb-16 tracking-tight">
            How We Think About Building
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800">
            {[
              {
                title: "Quality Over Quantity",
                body: "We&apos;d rather do fewer projects done right than many projects done quickly. Our reputation is built on outcomes, not volume.",
              },
              {
                title: "Science, Not Guesswork",
                body: "Building science informs every decision. How materials interact, how structures perform over time, how to anticipate failures before they happen.",
              },
              {
                title: "Necessity-Driven",
                body: "We approach every project with only what&apos;s necessary to achieve the best result. No unnecessary complexity, no upselling, no waste.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-black p-10 lg:p-12">
                <h3 className="font-[var(--font-space-grotesk)] font-bold text-xl text-white mb-4">
                  {v.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: v.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[var(--font-space-grotesk)] font-bold text-3xl lg:text-4xl text-black mb-4 tracking-tight">
            Ready to work with someone who knows what they&apos;re doing?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Let&apos;s start with a conversation about your project.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
