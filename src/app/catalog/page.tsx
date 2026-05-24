import { Suspense } from "react";
import { buildCatalog } from "@/lib/catalog";
import { CatalogClient } from "./catalog-client";

export const metadata = {
  title: "Catalog — SŌMA",
  description:
    "Every strain SOMA knows about. Sensory data, aliases, archetype and nearest matches — the same source the Taste Match Engine reads.",
};

export default function CatalogPage() {
  const entries = buildCatalog();
  return (
    <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Catalog</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        What SŌMA knows
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        The full curated reference set the Taste Match Engine reads from.
        Every entry is hand-mapped to canonical sensory vocab — no images,
        no scraping, no third-party catalog. Use this view to see what we
        know about each strain, where data is thin, and which strains sit
        near each other in sensory space.
      </p>

      <Suspense fallback={null}>
        <CatalogClient entries={entries} />
      </Suspense>
    </div>
  );
}
