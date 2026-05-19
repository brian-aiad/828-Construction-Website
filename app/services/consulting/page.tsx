import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import ConsultingServiceContent from "@/components/services/consulting/ConsultingServiceContent";

export const metadata: Metadata = {
  title: "Construction Consulting Torrance | Building Science Expert | 828 Construction",
  description:
    "Professional construction consulting in Torrance. Pre-construction advisory, project feasibility, and building science expertise. 20+ years experience. CA License #1141119.",
  keywords: [
    "construction consulting Torrance",
    "building science consultant",
    "pre-construction advisory South Bay",
    "construction project consulting",
    "feasibility analysis Torrance",
    "owner representation California",
    "home inspection consulting",
  ],
  alternates: { canonical: `${SITE.url}/services/consulting` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Construction Consulting - Torrance, CA",
  description:
    "Construction consulting and home inspection services in Torrance and South Bay. Expert advisory before you commit.",
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
  url: `${SITE.url}/services/consulting`,
};

export default function ConsultingPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <ConsultingServiceContent />
    </>
  );
}
