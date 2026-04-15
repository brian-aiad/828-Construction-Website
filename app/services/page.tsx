import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services - ADU, Remediation & Consulting",
  description:
    "828 Construction specializes in ADU construction, structural remediation, and construction consulting in Torrance and South Bay, CA.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            Services
          </span>
          <h1 className="font-[var(--font-space-grotesk)] font-bold text-5xl lg:text-7xl text-white mt-4 tracking-tight leading-none">
            Three Services.
            <br />
            <span className="text-gray-600">One Standard of Excellence.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mt-8 leading-relaxed">
            We don&apos;t try to do everything. We&apos;ve focused our expertise on three
            areas where building science knowledge makes the biggest difference
            for our clients.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-px bg-gray-100">
            {SERVICES.map((service, index) => (
              <div key={service.slug} className="bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Number + Title */}
                  <div className="p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-gray-100">
                    <div className="font-[var(--font-space-mono)] text-7xl font-bold text-gray-100 mb-6">
                      0{index + 1}
                    </div>
                    <span className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)]">
                      {service.short}
                    </span>
                    <h2 className="font-[var(--font-space-grotesk)] font-bold text-4xl text-black mt-3 mb-6 tracking-tight">
                      {service.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-8">
                      {service.description}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-center bg-black text-white px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
                    >
                      Learn More →
                    </Link>
                  </div>

                  {/* Details */}
                  <div className="p-12 lg:p-16 bg-gray-50">
                    <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-8">
                      What&apos;s Included
                    </div>
                    <ul className="space-y-4">
                      {service.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-4">
                          <span className="w-px h-4 bg-black flex-shrink-0 mt-1" />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[var(--font-space-grotesk)] font-bold text-3xl lg:text-4xl text-white mb-4 tracking-tight">
            Not sure which service you need?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Start with a consultation. We&apos;ll help you figure out exactly what
            your project requires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-black px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors"
            >
              Get Free Estimate
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center border border-gray-700 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors font-[var(--font-space-mono)]"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
