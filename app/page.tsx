import type { Metadata } from "next";
import HeroV2 from "@/components/home/HeroV2";
import ServicesPreviewV2 from "@/components/home/ServicesPreviewV2";
import AboutPreview from "@/components/home/AboutPreview";
import SplashScreen from "@/components/home/SplashScreen";
import JsonLd from "@/components/shared/JsonLd";
import { SITE } from "@/lib/constants";

// TODO: FOOTER_V2_PENDING — Footer rebuild (rolling marquee + broken-color
// sections + schedule CTA) is Page 9 in the V2 build sequence.
// The existing Footer component renders below via LenisProvider layout shell.

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
      {/* Cinematic intro splash — plays once per session */}
      <SplashScreen />

      <JsonLd data={jsonLd} />

      {/* Section 1: Hero — asymmetric photo/copy split */}
      <HeroV2 />

      {/* Section 2: Services Preview — asymmetric 3-card grid */}
      <ServicesPreviewV2 />

      {/* Section 3: About Preview — compressed teaser block */}
      <AboutPreview />

      {/* Section 4: Footer — TODO: FOOTER_V2_PENDING (see above) */}
      {/* Existing footer renders via layout shell */}
    </>
  );
}
