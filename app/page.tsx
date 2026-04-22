import type { Metadata } from "next";
import HeroSections from "@/components/home/HeroSections";
import BuildingScience from "@/components/home/BuildingScience";
import ServicesPreview from "@/components/home/ServicesPreview";
import HomeInterstitial from "@/components/home/HomeInterstitial";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import HomeCTA from "@/components/home/HomeCTA";
import SectionDivider from "@/components/layout/SectionDivider";
import JsonLd from "@/components/shared/JsonLd";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "828 Construction | ADU, Remediation & Consulting - Torrance, CA",
  description:
    "828 Construction brings 20+ years of building science expertise to Torrance and South Bay. Specializing in ADU construction, remediation, and consulting. CA License #1141119.",
  alternates: {
    canonical: SITE.url,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "828 Construction",
  image: `${SITE.url}/og-image.jpg`,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.state,
    postalCode: SITE.address.zip,
    addressCountry: "US",
  },
  telephone: "+12138282388",
  priceRange: "$$$",
  areaServed: SITE.serviceArea,
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "License",
    identifier: SITE.license,
  },
  url: SITE.url,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero — 200vh with sticky parallax panel */}
      <HeroSections />

      {/* Hero → Differentiator: black-to-white — WHY before WHAT */}
      <SectionDivider opacity={0.6} />
      <BuildingScience />

      {/* Differentiator → Services: white-to-black, copper seam */}
      <SectionDivider opacity={0.5} />
      <ServicesPreview />

      {/* Services → Interstitial → Projects */}
      <HomeInterstitial />

      {/* Services → Projects: black-to-dark, copper seam */}
      <SectionDivider opacity={0.5} />
      <ProjectsPreview />

      {/* Projects → CTA: dark-to-black, copper seam */}
      <SectionDivider opacity={0.6} />
      <HomeCTA />
    </>
  );
}
