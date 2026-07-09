import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import RemediationServiceContent from "@/components/services/remediation/RemediationServiceContent";

export const metadata: Metadata = {
  title: "Construction Remediation Torrance | Mold & Structural Repair",
  description:
    "Expert remediation services in Torrance: mold remediation, foundation repair, structural damage, and building defect correction. 20+ years experience. CA License #1141119.",
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What causes mold growth?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mold needs moisture, oxygen, and organic materials to grow. Common causes: poor ventilation, high humidity, and water intrusion or leaks.",
      },
    },
    {
      "@type": "Question",
      name: "What is mold remediation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It is a process of identifying, containing, removing, and preventing mold growth. It includes cleanup, air filtration, and addressing the moisture source.",
      },
    },
    {
      "@type": "Question",
      name: "Can mold affect my health?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — exposure may cause coughing, sneezing, headaches, skin irritation, asthma flare-ups, and fatigue, especially in sensitive individuals.",
      },
    },
  ],
};

export default function RemediationPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <RemediationServiceContent />
    </>
  );
}
