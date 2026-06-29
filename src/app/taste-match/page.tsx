import { Suspense } from "react";
import { TasteMatchClient } from "./taste-match-client";

export const metadata = {
  title: "Taste Match — SŌMA",
  description:
    "Build your taste profile and let SŌMA match cannabis flower to the aromas and effects you actually want — not just the strain name.",
  alternates: { canonical: "/taste-match" },
  openGraph: {
    type: "website",
    title: "Taste Match — SŌMA",
    description:
      "Build your taste profile and let SŌMA match cannabis flower to the aromas and effects you actually want.",
    url: "/taste-match",
  },
};

export default function TasteMatchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <TasteMatchClient />
    </Suspense>
  );
}
