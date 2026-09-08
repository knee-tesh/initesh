import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";
import { rfcs } from "@/data/rfcs";
import { articles } from "@/data/writing";

const baseUrl = "https://nitesh.in";
const today = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: today, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/work`, lastModified: today, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/architecture`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/experience`, lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/writing`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: today, changeFrequency: "yearly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: today, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/resume`, lastModified: today, changeFrequency: "yearly", priority: 0.5 },
  ];

  const workRoutes = caseStudies.map((cs) => ({
    url: `${baseUrl}/work/${cs.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const rfcRoutes = rfcs.map((r) => ({
    url: `${baseUrl}/architecture/rfcs/${r.id}`,
    lastModified: today,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${baseUrl}/writing/${a.slug}`,
    lastModified: today,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...workRoutes, ...rfcRoutes, ...articleRoutes];
}
