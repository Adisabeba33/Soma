"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { strainSlug } from "@/lib/catalog";
import { paletteForFamily } from "@/lib/sensory-family-palette";
import { strainImageBySlug } from "@/lib/strain-images";
import type { CatalogEntry, CatalogMatch } from "@/lib/catalog";

// Poster-style collectible card. When a generated atmospheric image
// exists for the strain (public/strains/<slug>.webp, registered in the
// manifest), it fills the whole card behind a dark bottom scrim. When
// it doesn't, the family-coloured gradient stands in — same composition,
// graceful fallback. Foreground is minimal in both cases: a match pip
// top-left, then name + type + tagline at the bottom.
export function CatalogCollectibleCard({
  entry,
  match,
  score,
}: {
  entry: CatalogEntry;
  match?: CatalogMatch;
  score: number;
}) {
  const { strain, identity } = entry;
  const palette = paletteForFamily(identity?.sensoryFamily ?? null);
  const showMatch = Boolean(match);
  const badgeValue = match ? match.score : score;
  const badgeLabel = showMatch ? "MATCH" : "CURATED";
  const slug = strainSlug(strain.name);
  const imageSrc = strainImageBySlug(slug);

  return (
    <li className="relative">
      <Link
        href={`/catalog/${slug}`}
        className={cn(
          "relative flex aspect-[3/4] h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/40 p-5 text-white transition-all",
          "hover:scale-[1.01] hover:border-accent/40 hover:shadow-lg",
        )}
        style={{ background: palette.background }}
      >
        {/* Atmospheric photo (when available) + scrim for legibility.
            The gradient under it shows through if the image is missing. */}
        {imageSrc && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 38%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.82) 100%)",
              }}
            />
          </>
        )}

        {/* Top: match badge */}
        <div className="relative">
          <div
            className="inline-flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/95 text-foreground shadow-md"
            title={
              showMatch
                ? "Your taste-match score for this strain"
                : "Curator's quality score — match % appears once you build a profile"
            }
          >
            <span className="font-display text-base font-semibold leading-none">
              {badgeValue}
            </span>
            <span className="text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              {badgeLabel}
            </span>
          </div>
        </div>

        {/* Bottom: strain identity + tagline + chevron */}
        <div className="relative">
          <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight drop-shadow-sm">
            {strain.name}
          </h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/65">
            {strain.type} · {strain.potency.replace("-", " ")}
          </p>
          <div className="mt-3 flex items-end justify-between gap-3">
            {identity?.tagline ? (
              <p
                className="flex-1 font-display text-sm italic leading-snug drop-shadow-sm"
                style={{ color: palette.accent }}
              >
                {identity.tagline}
              </p>
            ) : (
              <span className="flex-1" />
            )}
            <ChevronRight
              className="h-4 w-4 shrink-0 text-white/65"
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
