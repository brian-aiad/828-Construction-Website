import type { Metadata } from "next";
import JsonLd from "@/components/shared/JsonLd";
import { SITE } from "@/lib/constants";
import ContactContent from "@/components/contact/ContactContent";
import PhoneCopyToast from "@/components/ui/PhoneCopyToast";

export const metadata: Metadata = {
  title: "Contact | Free Estimate - Torrance, CA",
  description:
    "Contact 828 Construction for a free estimate. Call 213-828-2388 or send a message. Serving Torrance, Redondo Beach, Manhattan Beach & South Bay. License #1141119.",
  alternates: { canonical: `${SITE.url}/contact` },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${SITE.url}/contact`,
  mainEntity: {
    "@type": "LocalBusiness",
    name: SITE.name,
    telephone: "+12138282388",
    email: SITE.email,
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

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      <ContactContent />
      {/* Easter egg: clicking the phone number copies it to clipboard */}
      <PhoneCopyToast />
    </>
  );
}
