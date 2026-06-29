import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

// Default branded share card, inherited by every route without its own
// opengraph-image (homepage, /about, /taste-match, /learn hub, …).
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "SŌMA — Sensory Sommelier for Cannabis";

export default function Image() {
  return renderOgImage({
    eyebrow: "Sensory Sommelier",
    title: "Flower matched to your taste",
    subtitle: "Not just the strain name.",
  });
}
