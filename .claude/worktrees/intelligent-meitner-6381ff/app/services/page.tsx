import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import ServicesContent from "@/components/services/ServicesContent";

export const metadata: Metadata = {
  title: "Services | ADU Construction, Remediation & Consulting | 828 Construction",
  description:
    "828 Construction specializes in ADU construction, structural remediation, and construction consulting in Torrance and South Bay, CA. See which service fits your project.",
  alternates: { canonical: `${SITE.url}/services` },
};

export default function ServicesPage() {
  return (
    <>
      {/* Preload hero image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <link rel="preload" as="image" href="/images/services/services-hero.jpg" />
      <ServicesContent />
    </>
  );
}
