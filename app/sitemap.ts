import { MetadataRoute } from "next";
import { SITE, SERVICES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  // Update this only when public page content or search metadata changes.
  // Build time is not a truthful `lastmod` signal for crawlers.
  const lastModified = new Date("2026-08-31T00:00:00-07:00");

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${base}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...SERVICES.map((service) => ({
      url: `${base}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${base}/portfolio`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
