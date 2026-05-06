import type { Metadata } from "next";
import ProjectsGallery from "@/components/gallery/ProjectsGallery";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Projects - Our Work in Torrance & South Bay",
  description:
    "See 828 Construction's work — ADU builds, structural remediation, and consulting projects across Torrance and South Bay, CA.",
  alternates: { canonical: `${SITE.url}/projects` },
};

export default function ProjectsPage() {
  return <ProjectsGallery />;
}
