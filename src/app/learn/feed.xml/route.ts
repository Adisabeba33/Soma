import { LEARN_ARTICLES } from "@/lib/learn-articles";
import { siteUrl, absoluteUrl } from "@/lib/site-url";

// RSS 2.0 feed for the Learn section, served at /learn/feed.xml. Helps readers
// and AI crawlers discover new articles. Driven by the same article registry
// as the hub and the sitemap, so it stays in sync automatically.

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = siteUrl();
  const self = absoluteUrl("/learn/feed.xml");

  const items = [...LEARN_ARTICLES]
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .map((article) => {
      const url = absoluteUrl(`/learn/${article.slug}`);
      const pubDate = new Date(`${article.updated}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SŌMA — Learn</title>
    <link>${base}/learn</link>
    <description>Plain-language guides to choosing, reading and storing cannabis flower.</description>
    <language>en</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
