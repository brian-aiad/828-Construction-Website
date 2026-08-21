import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import ConsultingServiceContent from "@/components/services/consulting/ConsultingServiceContent";
import {
  breadcrumbJsonLd,
  businessProviderJsonLd,
  SEARCH_ROBOTS,
  socialMetadata,
} from "@/lib/seo";

const title = "Construction Consulting Torrance | Building Science Expert";
const description =
  "Professional construction consulting in Torrance. Pre-construction advisory, project feasibility, and building science expertise. 20+ years experience. CA License #1141119.";

export const metadata: Metadata = {
  title,
  description,
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
  robots: SEARCH_ROBOTS,
  ...socialMetadata({
    title,
    description,
    path: "/services/consulting",
    image: "/images/generated/consulting-hero-advisory-table-v3.webp",
    imageAlt: "Construction consulting session over plans and material samples",
  }),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE.url}/services/consulting#service`,
  name: "Construction Consulting - Torrance, CA",
  serviceType: "Construction consulting",
  description:
    "Construction consulting and home inspection services in Torrance and South Bay. Expert advisory before you commit.",
  provider: businessProviderJsonLd(),
  areaServed: SITE.serviceArea,
  url: `${SITE.url}/services/consulting`,
  mainEntityOfPage: `${SITE.url}/services/consulting`,
  image: `${SITE.url}/images/generated/consulting-hero-advisory-table-v3.webp`,
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Services", path: "/services" },
  { name: "Consulting", path: "/services/consulting" },
]);

export default function ConsultingPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbs} />
      <ConsultingServiceContent />
    </>
  );
}
