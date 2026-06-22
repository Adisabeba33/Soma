import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { STRAINS } from "@/lib/strain-data";
import { strainSlug } from "@/lib/catalog";
import { LEARN_ARTICLES } from "@/lib/learn-articles";

// Generated /sitemap.xml. Lists the public, indexable surface: static
// marketing/content routes, every Learn article, and one URL per strain in
// the catalog. Private/account routes are intentionally excluded (see
// robots.ts). URLs are absolute, built from the canonical base.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes = [
    "/",
    "/about",
    "/taste-match",
    "/compare",
    "/catalog",
    "/learn",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const articleRoutes = LEARN_ARTICLES.map((article) => ({
    url: `${base}/learn/${article.slug}`,
    lastModified: new Date(article.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const strainRoutes = STRAINS.map((strain) => ({
    url: `${base}/catalog/${strainSlug(strain.name)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...articleRoutes, ...strainRoutes];
}
