import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import AduServiceContent from "@/components/services/adu/AduServiceContent";
import {
  breadcrumbJsonLd,
  businessProviderJsonLd,
  SEARCH_ROBOTS,
  socialMetadata,
} from "@/lib/seo";

const title = "ADU Builder Torrance | Accessory Dwelling Units";
const description =
  "Expert ADU construction in Torrance and South Bay. Design, permits, and full builds for accessory dwelling units. 20+ years experience. CA License #1141119. Free consultation.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "ADU builder Torrance",
    "accessory dwelling unit Torrance",
    "granny flat construction South Bay",
    "ADU permits Torrance CA",
    "backyard ADU Torrance",
    "garage conversion ADU",
    "junior ADU California",
  ],
  alternates: { canonical: `${SITE.url}/services/adu` },
  robots: SEARCH_ROBOTS,
  ...socialMetadata({
    title,
    description,
    path: "/services/adu",
    image: "/images/generated/adu-hero-exterior-v4.webp",
    imageAlt: "Completed South Bay accessory dwelling unit",
  }),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE.url}/services/adu#service`,
  name: "ADU Construction - Torrance, CA",
  serviceType: "Accessory Dwelling Unit construction",
  description:
    "Accessory Dwelling Unit construction in Torrance and South Bay. Design coordination, permits, and full builds.",
  provider: businessProviderJsonLd(),
  areaServed: SITE.serviceArea,
  url: `${SITE.url}/services/adu`,
  mainEntityOfPage: `${SITE.url}/services/adu`,
  image: `${SITE.url}/images/generated/adu-hero-exterior-v4.webp`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does an ADU cost in Torrance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ADU construction costs in Torrance typically range from $150,000 to $350,000 depending on size, design, and finishes. 828 Construction provides detailed estimates after a free consultation.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a permit for an ADU in Torrance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all ADU construction in Torrance requires building permits. 828 Construction manages the permitting process and ensures full compliance with Torrance zoning regulations.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build an ADU?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A typical ADU takes 6–12 months from initial consultation to completion, including design, permitting, and construction.",
      },
    },
    {
      "@type": "Question",
      name: "What types of ADUs can be built on my property?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depending on your lot and zoning, you may qualify for a detached ADU, an attached ADU, a garage conversion, or a Junior ADU (JADU).",
      },
    },
  ],
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Services", path: "/services" },
  { name: "ADU Construction", path: "/services/adu" },
]);

export default function AduPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbs} />
      <AduServiceContent />
    </>
  );
}
