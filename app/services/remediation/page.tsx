import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import RemediationServiceContent from "@/components/services/remediation/RemediationServiceContent";
import {
  breadcrumbJsonLd,
  businessProviderJsonLd,
  SEARCH_ROBOTS,
  socialMetadata,
} from "@/lib/seo";

const title = "Construction Remediation Torrance | Mold & Structural Repair";
const description =
  "Expert remediation services in Torrance: mold remediation, foundation repair, structural damage, and building defect correction. 20+ years experience. CA License #1141119.";

export const metadata: Metadata = {
  title,
  description,
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
  robots: SEARCH_ROBOTS,
  ...socialMetadata({
    title,
    description,
    path: "/services/remediation",
    image: "/images/generated/remediation-hero-controlled-work-v3.webp",
    imageAlt: "Controlled residential remediation work area",
  }),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE.url}/services/remediation#service`,
  name: "Remediation Services - Torrance, CA",
  serviceType: "Construction remediation and restoration",
  description:
    "Mold remediation, structural repair, and environmental restoration in Torrance and South Bay. Diagnostic-first approach.",
  provider: businessProviderJsonLd(),
  areaServed: SITE.serviceArea,
  url: `${SITE.url}/services/remediation`,
  mainEntityOfPage: `${SITE.url}/services/remediation`,
  image: `${SITE.url}/images/generated/remediation-hero-controlled-work-v3.webp`,
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Services", path: "/services" },
  { name: "Remediation", path: "/services/remediation" },
]);

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
      <JsonLd data={breadcrumbs} />
      <RemediationServiceContent />
    </>
  );
}
