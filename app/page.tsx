import type { Metadata } from "next";
import HeroV2 from "@/components/home/HeroV2";
import EditorialFlow from "@/components/home/EditorialFlow";
import ServicesPreviewV2 from "@/components/home/ServicesPreviewV2";
import HomeVisionSequence from "@/components/home/HomeVisionSequence";
import AboutPreview from "@/components/home/AboutPreview";
import DockedCTA from "@/components/home/DockedCTA";
import SplashScreen from "@/components/home/SplashScreen";
import JsonLd from "@/components/shared/JsonLd";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ADU, Remediation & Consulting - Torrance, CA",
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
      <SplashScreen />
      <JsonLd data={jsonLd} />
      <HeroV2 />
      <EditorialFlow>
        <ServicesPreviewV2 />
        <HomeVisionSequence part="intro" />
        <HomeVisionSequence part="process" />
        <AboutPreview />
      </EditorialFlow>
      <DockedCTA />
    </>
  );
}
