import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import ServicesContent from "@/components/services/ServicesContent";
import { breadcrumbJsonLd, SEARCH_ROBOTS, socialMetadata } from "@/lib/seo";

const title = "Services | ADU Construction, Remediation & Consulting";
const description =
  "828 Construction specializes in ADU construction, structural remediation, and construction consulting in Torrance and South Bay, CA. See which service fits your project.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/services` },
  robots: SEARCH_ROBOTS,
  ...socialMetadata({
    title,
    description,
    path: "/services",
    image: "/images/generated/services-process-vision-build-v3.webp",
    imageAlt: "Residential construction framing progressing toward completion",
  }),
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Services", path: "/services" },
]);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <ServicesContent />
    </>
  );
}
