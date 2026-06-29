import { ImageResponse } from "next/og";

// Shared renderer for dynamic Open Graph / Twitter card images (the previews
// shown when a SŌMA link is shared in messengers and social apps). One
// branded 1200×630 layout, fed different copy per route via opengraph-image
// files. Uses the system font stack (no remote font fetch) and brand colours
// drawn from globals.css so the cards match the site.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Brand tokens (mirrors src/app/globals.css). Satori accepts CSS color strings.
const CREAM = "hsl(44 30% 96%)";
const INK = "hsl(40 9% 12%)";
const BRASS = "hsl(34 36% 46%)";
const GREEN = "hsl(122 13% 23%)";
const MUTED = "hsl(38 7% 38%)";
const BORDER = "hsl(40 17% 84%)";

export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  // Shrink the title a touch for long strings so it never overflows.
  const titleSize = title.length > 34 ? 64 : title.length > 22 ? 76 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: CREAM,
          color: INK,
          fontFamily: "Georgia, 'Times New Roman', serif",
          borderTop: `12px solid ${GREEN}`,
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: 6,
            }}
          >
            SŌMA
          </span>
          {/* Brass diamond drawn in CSS (no glyph → no font fetch). */}
          <div
            style={{
              width: 18,
              height: 18,
              backgroundColor: BRASS,
              transform: "rotate(45deg)",
            }}
          />
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 26,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: BRASS,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              marginTop: 18,
              fontSize: titleSize,
              fontWeight: 600,
              lineHeight: 1.04,
              maxWidth: 1000,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span
              style={{
                marginTop: 22,
                fontSize: 34,
                color: MUTED,
                maxWidth: 940,
              }}
            >
              {subtitle}
            </span>
          ) : null}
        </div>

        {/* Tagline footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderTop: `2px solid ${BORDER}`,
            paddingTop: 24,
          }}
        >
          <span style={{ fontSize: 24, color: MUTED }}>
            Sensory Sommelier for Cannabis
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
