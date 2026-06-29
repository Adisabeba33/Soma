import { getCatalogEntryBySlug } from "@/lib/catalog";
import { labelFor } from "@/lib/vocab";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

// Per-strain share card: name + top aromas + type.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Strain on SŌMA";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCatalogEntryBySlug(slug);

  if (!entry) {
    return renderOgImage({
      eyebrow: "Harvest",
      title: "Strain catalog",
      subtitle: "Explore flower by its sensory profile.",
    });
  }

  const aromas = entry.strain.aromas
    .slice(0, 3)
    .map((a) => labelFor(a).toLowerCase())
    .join(" · ");

  return renderOgImage({
    eyebrow: entry.identity?.sensoryFamily ?? entry.strain.type,
    title: entry.strain.name,
    subtitle: aromas || undefined,
  });
}
