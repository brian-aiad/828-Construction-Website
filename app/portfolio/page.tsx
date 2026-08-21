import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import JsonLd from "@/components/shared/JsonLd";
import PortfolioContent from "@/components/portfolio/PortfolioContent";
import { breadcrumbJsonLd, SEARCH_ROBOTS, socialMetadata } from "@/lib/seo";

const title = "Portfolio | Our Work in Torrance & South Bay";
const description =
  "828 Construction's portfolio — ADU builds, structural remediation, and consulting projects across Torrance and South Bay, CA. Building science over guesswork.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE.url}/portfolio` },
  robots: SEARCH_ROBOTS,
  ...socialMetadata({
    title,
    description,
    path: "/portfolio",
    image: "/images/projects/cerritos-residence/01-2176.jpg",
    imageAlt: "Cerritos bathroom remodel by 828 Construction",
  }),
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "" },
  { name: "Portfolio", path: "/portfolio" },
]);

export default function PortfolioPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <PortfolioContent />
    </>
  );
}
