import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function AboutPreview() {
  return (
    <section className="bg-black py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: text */}
          <div>
            <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
              About 828
            </span>
            <h2 className="font-[var(--font-space-grotesk)] font-bold text-4xl lg:text-5xl text-white mt-4 mb-8 tracking-tight leading-tight">
              20+ Years of
              <br />
              Building Science.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              828 Construction was built on a simple idea: do the work right,
              every time. Founder Joe P brings over two decades of hands-on
              building science expertise to every project — from ground-up ADU
              construction to complex remediation work.
            </p>
            <p className="text-gray-400 leading-relaxed mb-10">
              We don&apos;t take on every job. We take on the right ones — the ones
              where our expertise makes a real difference. Quality over
              quantity, always.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="border border-gray-800 p-6">
                <div className="font-[var(--font-space-grotesk)] font-bold text-2xl text-white mb-1">
                  Building Science
                </div>
                <div className="text-xs text-gray-500 tracking-wider uppercase">
                  Core Expertise
                </div>
              </div>
              <div className="border border-gray-800 p-6">
                <div className="font-[var(--font-space-grotesk)] font-bold text-2xl text-white mb-1">
                  South Bay
                </div>
                <div className="text-xs text-gray-500 tracking-wider uppercase">
                  Primary Service Area
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center bg-white text-black px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
              >
                Our Story
              </Link>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center border border-gray-700 text-white px-6 py-3 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors font-[var(--font-space-mono)]"
              >
                {SITE.phone}
              </a>
            </div>
          </div>

          {/* Right: credentials block */}
          <div className="border border-gray-800 p-8 lg:p-12">
            <div className="space-y-8">
              <div className="border-b border-gray-800 pb-8">
                <div className="text-xs text-gray-500 tracking-widest uppercase mb-3">
                  California License
                </div>
                <div className="font-[var(--font-space-mono)] text-2xl text-white">
                  #{SITE.license}
                </div>
              </div>
              <div className="border-b border-gray-800 pb-8">
                <div className="text-xs text-gray-500 tracking-widest uppercase mb-3">
                  Founded
                </div>
                <div className="font-[var(--font-space-grotesk)] font-bold text-2xl text-white">
                  2004
                </div>
              </div>
              <div className="border-b border-gray-800 pb-8">
                <div className="text-xs text-gray-500 tracking-widest uppercase mb-3">
                  Specializations
                </div>
                <div className="space-y-2">
                  {["ADU Construction", "Structural Remediation", "Building Science Consulting"].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-white rounded-full flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 tracking-widest uppercase mb-3">
                  Service Area
                </div>
                <div className="text-gray-300 text-sm leading-relaxed">
                  {SITE.serviceArea.slice(0, 5).join(", ")} & surrounding South
                  Bay communities
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
