import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import RemediationServiceContent from "@/components/services/remediation/RemediationServiceContent";

export const metadata: Metadata = {
  title: "Construction Remediation Torrance | Mold & Structural Repair | 828 Construction",
  description:
    "Expert remediation services in Torrance: mold remediation, foundation repair, structural damage, and building defect correction. Est. 2004. CA License #1141119.",
  keywords: [
    "remediation contractor Torrance",
    "mold remediation Torrance",
    "foundation repair Torrance",
    "structural remediation South Bay",
    "building defect repair",
    "water damage remediation Torrance",
    "construction defect correction",
  ],
  alternates: { canonical: `${SITE.url}/services/remediation` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Remediation Services - Torrance, CA",
  description:
    "Mold remediation, structural repair, and environmental restoration in Torrance and South Bay. Diagnostic-first approach.",
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
  url: `${SITE.url}/services/remediation`,
};

export default function RemediationPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <RemediationServiceContent />
    </>
  );
}
