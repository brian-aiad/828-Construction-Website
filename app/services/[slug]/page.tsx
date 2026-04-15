import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES, SITE } from "@/lib/constants";

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} - Torrance, CA`,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const serviceIndex = SERVICES.findIndex((s) => s.slug === slug);
  const nextService = SERVICES[(serviceIndex + 1) % SERVICES.length];

  const serviceKeywords: Record<string, string[]> = {
    adu: [
      "Torrance ADU contractor",
      "ADU builder South Bay",
      "Accessory dwelling unit construction",
      "Garage conversion Torrance",
      "Backyard ADU permits",
      "Junior ADU California",
    ],
    remediation: [
      "Structural remediation Torrance",
      "Foundation repair South Bay",
      "Water damage remediation",
      "Construction defect correction",
      "Building envelope repair",
      "Post-disaster construction",
    ],
    consulting: [
      "Construction consulting Torrance",
      "Building science consultant",
      "Pre-purchase construction inspection",
      "Contractor vetting South Bay",
      "Owner representation California",
      "Project feasibility analysis",
    ],
  };

  const keywords = serviceKeywords[service.slug] || [];

  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/services"
              className="text-xs text-gray-500 tracking-widest uppercase hover:text-white transition-colors font-[var(--font-space-mono)]"
            >
              ← Services
            </Link>
          </div>
          <span className="text-xs font-[var(--font-space-mono)] text-gray-500 tracking-widest uppercase">
            {service.short}
          </span>
          <h1 className="font-[var(--font-space-grotesk)] font-bold text-5xl lg:text-7xl text-white mt-4 tracking-tight leading-none">
            {service.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main */}
            <div className="lg:col-span-2">
              <p className="text-xl text-gray-600 leading-relaxed mb-10">
                {service.description}
              </p>

              <h2 className="font-[var(--font-space-grotesk)] font-bold text-2xl text-black mb-6">
                What&apos;s Included
              </h2>
              <ul className="space-y-4 mb-12">
                {service.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-4">
                    <span className="w-px h-4 bg-black flex-shrink-0 mt-1.5" />
                    <span className="text-gray-700 leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-12">
                <h2 className="font-[var(--font-space-grotesk)] font-bold text-2xl text-black mb-6">
                  Why Choose 828 Construction
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: "20+ Years Experience",
                      body: "Decades of hands-on building science knowledge applied to your project.",
                    },
                    {
                      title: "Licensed in California",
                      body: `CA License #${SITE.license} — fully insured and compliant.`,
                    },
                    {
                      title: "South Bay Focus",
                      body: "We know the local codes, contractors, and conditions in Torrance and surrounding cities.",
                    },
                    {
                      title: "Science-Backed Approach",
                      body: "Every decision is grounded in building science, not guesswork.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="bg-gray-50 p-6">
                      <h3 className="font-[var(--font-space-grotesk)] font-bold text-sm text-black mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              {keywords.length > 0 && (
                <div className="mt-12 border-t border-gray-100 pt-8">
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs text-gray-400 border border-gray-200 px-3 py-1 font-[var(--font-space-mono)]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-black p-8">
                <h3 className="font-[var(--font-space-grotesk)] font-bold text-lg text-white mb-4">
                  Get a Free Estimate
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Ready to discuss your {service.title.toLowerCase()} project?
                  We&apos;ll get back to you within 24 hours.
                </p>
                <Link
                  href="/contact"
                  className="block text-center bg-white text-black px-5 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors mb-4"
                >
                  Request Estimate
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="block text-center border border-gray-700 text-white px-5 py-3 text-xs font-bold tracking-widest uppercase hover:border-white transition-colors font-[var(--font-space-mono)]"
                >
                  {SITE.phone}
                </a>
              </div>

              <div className="border border-gray-200 p-8">
                <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-4">
                  Service Area
                </div>
                <div className="space-y-2">
                  {SITE.serviceArea.map((city) => (
                    <div key={city} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full" />
                      <span className="text-sm text-gray-600">{city}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 p-8">
                <div className="text-xs text-gray-400 tracking-widest uppercase font-[var(--font-space-mono)] mb-4">
                  Next Service
                </div>
                <Link
                  href={`/services/${nextService.slug}`}
                  className="group block"
                >
                  <div className="font-[var(--font-space-grotesk)] font-bold text-black group-hover:text-gray-600 transition-colors mb-1">
                    {nextService.title}
                  </div>
                  <div className="text-xs text-gray-400 tracking-wider">
                    {nextService.short} →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
