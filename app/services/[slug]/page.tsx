import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES, SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

// Per-service meta overrides for precise title/description targeting
const serviceMeta: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  adu: {
    title: "ADU Builder Torrance | Accessory Dwelling Units | 828 Construction",
    description:
      "Expert ADU construction in Torrance and South Bay. Design, permits, and full builds for accessory dwelling units. 20+ years experience. CA License #1141119. Free consultation.",
    keywords: [
      "ADU builder Torrance",
      "accessory dwelling unit Torrance",
      "granny flat construction South Bay",
      "ADU permits Torrance CA",
      "backyard ADU Torrance",
      "garage conversion ADU",
      "junior ADU California",
    ],
  },
  remediation: {
    title:
      "Construction Remediation Torrance | Structural Repair | 828 Construction",
    description:
      "Expert remediation services in Torrance: foundation repair, structural damage, water damage, and building defect correction. 20+ years building science. CA License #1141119.",
    keywords: [
      "remediation contractor Torrance",
      "foundation repair Torrance",
      "structural remediation South Bay",
      "building defect repair",
      "water damage remediation Torrance",
      "construction defect correction",
    ],
  },
  consulting: {
    title:
      "Construction Consulting Torrance | Building Science Expert | 828 Construction",
    description:
      "Professional construction consulting in Torrance. Pre-construction advisory, project feasibility, and building science expertise. 20+ years experience. CA License #1141119.",
    keywords: [
      "construction consulting Torrance",
      "building science consultant",
      "pre-construction advisory South Bay",
      "construction project consulting",
      "feasibility analysis Torrance",
      "owner representation California",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  const meta = serviceMeta[slug];
  return {
    title: meta?.title ?? `${service.title} - Torrance, CA`,
    description: meta?.description ?? service.description,
    keywords: meta?.keywords,
    alternates: { canonical: `${SITE.url}/services/${slug}` },
  };
}

// ADU-specific FAQ for schema + rendering
const aduFaq = [
  {
    q: "How much does an ADU cost in Torrance?",
    a: "ADU construction costs in Torrance typically range from $150,000 to $350,000 depending on size, design, and finishes. We provide detailed estimates after a free consultation.",
  },
  {
    q: "Do I need a permit for an ADU in Torrance?",
    a: "Yes, all ADU construction in Torrance requires building permits. 828 Construction handles the permitting process and ensures full compliance with Torrance zoning regulations.",
  },
  {
    q: "How long does it take to build an ADU in Torrance?",
    a: "A typical ADU takes 6–12 months from initial consultation to completion, including design, permitting, and construction. The permit phase alone can take 2–4 months depending on city workload.",
  },
  {
    q: "What types of ADUs can be built on my property?",
    a: "Depending on your lot and zoning, you may qualify for a detached ADU, an attached ADU, a garage conversion, or a Junior ADU (JADU). We assess your property and advise which option is feasible.",
  },
];

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
  const keywords = serviceMeta[slug]?.keywords ?? [];

  // Service JSON-LD
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.title} - Torrance, CA`,
    description: service.description,
    provider: {
      "@type": "GeneralContractor",
      name: SITE.name,
      telephone: "+12138282388",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.state,
        postalCode: SITE.address.zip,
        addressCountry: "US",
      },
    },
    areaServed: SITE.serviceArea,
    url: `${SITE.url}/services/${slug}`,
  };

  // FAQ JSON-LD (ADU page only)
  const faqJsonLd =
    slug === "adu"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: aduFaq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

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
            {slug === "adu" && (
              <span className="block text-gray-600 text-3xl lg:text-4xl mt-3">
                Construction in Torrance, California
              </span>
            )}
            {slug === "remediation" && (
              <span className="block text-gray-600 text-3xl lg:text-4xl mt-3">
                Services in Torrance, California
              </span>
            )}
            {slug === "consulting" && (
              <span className="block text-gray-600 text-3xl lg:text-4xl mt-3">
                Services — Torrance & South Bay
              </span>
            )}
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
                    <span className="text-gray-700 leading-relaxed">
                      {detail}
                    </span>
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

              {/* ADU FAQ Section */}
              {slug === "adu" && (
                <div className="border-t border-gray-100 pt-12 mt-12">
                  <h2 className="font-[var(--font-space-grotesk)] font-bold text-2xl text-black mb-8">
                    ADU Questions & Answers
                  </h2>
                  <div className="space-y-6">
                    {aduFaq.map((item) => (
                      <div key={item.q} className="border-b border-gray-100 pb-6">
                        <h3 className="font-[var(--font-space-grotesk)] font-bold text-base text-black mb-3">
                          {item.q}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
