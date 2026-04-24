import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import ServiceDetailContent from "@/components/services/ServiceDetailContent";

const serviceImages: Record<string, { src: string; caption: string }> = {
  adu: {
    src: "/images/services/adu-permit.jpg",
    caption: "Approved Permit · Active Jobsite",
  },
  remediation: {
    src: "/images/services/remediation-before.jpg",
    caption: "Wall Opened · Source Identified",
  },
  consulting: {
    src: "/images/services/consulting-report.jpg",
    caption: "Inspector Report · Written Findings",
  },
};

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

const serviceMeta: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  adu: {
    title: "ADU Builder Torrance | Accessory Dwelling Units | 828 Construction",
    description:
      "Expert ADU construction in Torrance and South Bay. Design, permits, and full builds for accessory dwelling units. 25+ years experience. CA License #1141119. Free consultation.",
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
    title: "Construction Remediation Torrance | Structural Repair | 828 Construction",
    description:
      "Expert remediation services in Torrance: foundation repair, structural damage, water damage, and building defect correction. 25+ years building science. CA License #1141119.",
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
    title: "Construction Consulting Torrance | Building Science Expert | 828 Construction",
    description:
      "Professional construction consulting in Torrance. Pre-construction advisory, project feasibility, and building science expertise. 25+ years experience. CA License #1141119.",
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
  const imgData = serviceImages[slug] ?? { src: "", caption: "" };

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
      <ServiceDetailContent
        service={service}
        nextService={nextService}
        keywords={keywords}
        aduFaq={slug === "adu" ? aduFaq : undefined}
        serviceImageSrc={imgData.src}
        serviceImageCaption={imgData.caption}
      />
    </>
  );
}
