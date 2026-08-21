import type { Metadata } from "next";
import JsonLd from "@/components/shared/JsonLd";
import { SITE } from "@/lib/constants";
import ContactContent from "@/components/contact/ContactContent";
import PhoneCopyToast from "@/components/ui/PhoneCopyToast";
import {
  BUSINESS_ID,
  breadcrumbJsonLd,
  SEARCH_ROBOTS,
  socialMetadata,
} from "@/lib/seo";

const title = "Contact | Free Estimate - Torrance, CA";
const description =
  "Contact 828 Construction for a free estimate. Call 213-828-2388 or send a message. Serving Torrance, Redondo Beach, Manhattan Beach & South Bay. License #1141119.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/contact` },
  robots: SEARCH_ROBOTS,
  ...socialMetadata({
    title,
    description,
    path: "/contact",
    image: "/images/contact/contact-hero.jpg",
    imageAlt: "Residential architecture detail at dusk",
  }),
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${SITE.url}/contact`,
  mainEntity: {
    "@type": "GeneralContractor",
    "@id": BUSINESS_ID,
    name: SITE.name,
    url: SITE.url,
    telephone: "+12138282388",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: "US",
    },
    areaServed: SITE.serviceArea,
  },
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Contact", path: "/contact" },
]);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      <JsonLd data={breadcrumbs} />
      <ContactContent />
      {/* Easter egg: clicking the phone number copies it to clipboard */}
      <PhoneCopyToast />
    </>
  );
}
