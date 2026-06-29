import { getArticle } from "@/lib/learn-articles";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

// Per-article share card: article title + reading time.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "SŌMA — Learn";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return renderOgImage({
      eyebrow: "Learn",
      title: "Field notes",
      subtitle: "Plain-language guides to cannabis flower.",
    });
  }

  return renderOgImage({
    eyebrow: "Learn",
    title: article.title,
    subtitle: article.readingTime,
  });
}
