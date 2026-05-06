import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About — 20+ Years of Building Science | 828 Construction",
  description:
    "Meet Joe P and 828 Construction. Over 20 years of building science expertise serving Torrance and South Bay, CA. CA License #1141119.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default function AboutPage() {
  return (
    <>
      {/* Preload hero image for faster background paint */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <link rel="preload" as="image" href="/images/about/about-hero.jpg" />
      <AboutContent />
    </>
  );
}
