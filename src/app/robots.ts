import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// Generated /robots.txt. Allows the public surface and keeps crawlers out of
// account, auth and API paths that hold nothing useful for search and should
// not be indexed. Points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/api/",
        "/profile",
        "/saved",
        "/stats",
        "/login",
        "/signup",
        "/verify",
        "/reset",
        "/forgot-password",
        "/onboarding",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
