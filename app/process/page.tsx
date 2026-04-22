import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import ProcessContent from "@/components/process/ProcessContent";

export const metadata: Metadata = {
  title: "Our Process | How 828 Construction Works | Torrance, CA",
  description:
    "Our structured, transparent process from consultation through completion. Learn how 828 Construction approaches every project in Torrance and South Bay, CA.",
  alternates: { canonical: `${SITE.url}/process` },
};

export default function ProcessPage() {
  return <ProcessContent />;
}
