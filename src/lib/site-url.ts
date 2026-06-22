// Canonical absolute base URL for SŌMA. Mirrors the resolution order in
// src/lib/email.ts → baseUrl() so links are consistent everywhere: explicit
// NEXT_PUBLIC_APP_URL wins, then the Vercel deployment URL, then localhost.
// Used for metadataBase, the sitemap, robots, and absolute URLs in JSON-LD.
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// Absolute URL for a path, e.g. absoluteUrl("/learn") → "https://…/learn".
export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
