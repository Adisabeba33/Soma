import type { MetadataRoute } from "next";

// Web app manifest — makes SŌMA installable to the home screen and lets it
// open standalone (no browser chrome), like a native app. iOS reads the
// apple-icon + appleWebApp meta; Android/Chrome reads this manifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SŌMA — Sensory Sommelier",
    short_name: "SŌMA",
    description:
      "Find cannabis flower that matches your taste — not just the strain name.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f0e7",
    theme_color: "#334234",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
