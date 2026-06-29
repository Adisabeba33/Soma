import type { Metadata } from "next";
import ComparePage from "./compare-client";

// Server wrapper so the interactive compare tool (a client component in
// ./compare-client.tsx) still gets unique, indexable metadata.
export const metadata: Metadata = {
  title: "Compare strains — SŌMA",
  description:
    "Compare cannabis strains side by side against your taste profile — match scores, sensory overlap and the closest alternative.",
  alternates: { canonical: "/compare" },
  openGraph: {
    type: "website",
    title: "Compare strains — SŌMA",
    description:
      "Compare cannabis strains side by side against your taste profile.",
    url: "/compare",
  },
};

export default function Page() {
  return <ComparePage />;
}
