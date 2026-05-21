import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import PortfolioContent from "@/components/portfolio/PortfolioContent";

export const metadata: Metadata = {
  title: "Portfolio | Our Work in Torrance & South Bay",
  description:
    "828 Construction's portfolio — ADU builds, structural remediation, and consulting projects across Torrance and South Bay, CA. Building science over guesswork.",
  alternates: { canonical: `${SITE.url}/portfolio` },
};

export default function PortfolioPage() {
  return <PortfolioContent />;
}
