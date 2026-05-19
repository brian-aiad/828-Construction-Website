import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About - Building Science & Craft | 828 Construction",
  description:
    "Meet 828 Construction. Hands-on residential construction experience serving Torrance and South Bay, CA. CA License #1141119.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default function AboutPage() {
  return <AboutContent />;
}
