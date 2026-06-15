"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { strainSlug } from "@/lib/catalog";
import { knownAsNames } from "@/lib/strain-identity";
import { paletteForTime } from "@/lib/sensory-family-palette";
import { timeProfileOf, artImageSrc, artFocusOf } from "@/lib/strain-art";
import { FitText } from "@/components/fit-text";
import type { CatalogEntry, CatalogMatch } from "@/lib/catalog";

// Poster-style collectible card. The atmospheric gradient *is* the
// composition — foreground stays minimal so the family colour gets to
// carry the eye. Visible per card:
//
//   - match% pip top-left
//   - strain name (large display)
//   - type · potency (fine print)
//   - tagline (2–4 words, italic accent — the headline)
//   - chevron hinting at the detail page
//
// Aroma chips, effect glyphs and full curator quotes used to live here
// in the first pass — they crowded the gradient and made every card
// feel like a search result. The poster minimalism keeps the family
// gradient visible so a row of cards reads as a collection at a glance.
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
  // Other names people know this strain by (e.g. WiFi OG for White Fire OG),
  // so browsing-by-a-name-you-know works, not just exact-canonical.
  const aka = knownAsNames(strain.aliases, identity).filter(
    (a) =>
      a.toLowerCase() !== (identity?.shortName ?? strain.name).toLowerCase(),
  );
  const palette = paletteForTime(timeProfileOf(strain, identity));
  const artSrc = artImageSrc(strain, identity);
  // Over a published image the bottom scrim is dark, so text is always white
  // there; otherwise it follows the gradient's contentTone.
  const lightText = artSrc ? true : palette.contentTone === "light";
  const mutedText = lightText ? "text-white/55" : "text-black/45";
  const showMatch = Boolean(match);
  const badgeValue = match ? match.score : score;
  const badgeLabel = showMatch ? "MATCH" : "CURATED";

  return (
    <li className="relative">
      <Link
        href={`/catalog/${strainSlug(strain.name)}`}
        className={cn(
          "relative flex aspect-[3/4] h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/40 p-5 transition-all",
          "hover:scale-[1.01] hover:border-accent/40 hover:shadow-lg",
          lightText ? "text-white" : "text-foreground",
        )}
        style={{ background: palette.background }}
      >
        {artSrc && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artSrc}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: artFocusOf(identity) }}
            />
            {/* Bottom scrim keeps the overlaid name/tagline legible over any
                image — the artwork itself carries no text. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0) 70%)",
              }}
            />
          </>
        )}
        {/* Top: match badge — leaves the rest of the upper card for
            the gradient to breathe */}
        <div className="relative z-10">
          <div
            className="inline-flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/95 text-foreground shadow-md"
            title={
              showMatch
                ? "Your taste-match score for this strain"
                : "Curator's quality score — match % appears once you build a profile"
            }
          >
            <span className="font-display text-base font-semibold leading-none">
              {Math.round(badgeValue)}
            </span>
            <span className="text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              {badgeLabel}
            </span>
          </div>
        </div>

        {/* Bottom: strain identity + tagline + chevron. Sits at the
            bottom so the gradient has space at the top — the card reads
            as background-first, label-second, like a vintage poster. */}
        <div className="relative z-10">
          <h3 className="font-display font-semibold leading-tight tracking-tight">
            <FitText text={identity?.shortName ?? strain.name} maxPx={24} minPx={12} />
          </h3>
          <p className={cn("mt-1 text-[11px] uppercase tracking-[0.14em]", mutedText)}>
            {strain.type}
          </p>
          {aka.length > 0 && (
            <p className={cn("mt-0.5 text-[10px] italic", mutedText)}>
              aka {aka.slice(0, 2).join(" · ")}
            </p>
          )}
          <div className="mt-3 flex items-end justify-between gap-3">
            {identity?.tagline ? (
              <p
                className="flex-1 font-display text-sm italic leading-snug"
                style={{ color: palette.accent }}
              >
                <FitText text={identity.tagline} maxPx={14} minPx={10} />
              </p>
            ) : (
              <span className="flex-1" />
            )}
            <ChevronRight
              className={cn("h-4 w-4 shrink-0", mutedText)}
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
