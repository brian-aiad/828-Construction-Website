import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About - Building Science & Craft",
  description:
    "Meet 828 Construction. Hands-on residential construction experience serving Torrance and South Bay, CA. CA License #1141119.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default function AboutPage() {
  // Joe's headshot slot: drop the file in and the portrait renders on the
  // next build/refresh — until then the pending plate holds the composition
  // without firing a failed image request.
  const aboutImageDir = join(process.cwd(), "public", "images", "about");
  const hasPortrait = existsSync(join(aboutImageDir, "joe-portrait.jpg"));
  const hasTemporaryPortrait = existsSync(
    join(aboutImageDir, "joe-portrait-temporary.png")
  );
  return (
    <AboutContent
      hasPortrait={hasPortrait}
      hasTemporaryPortrait={hasTemporaryPortrait}
    />
  );
}
