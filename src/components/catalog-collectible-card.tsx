"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { strainSlug } from "@/lib/catalog";
import { paletteForFamily } from "@/lib/sensory-family-palette";
import { effectIconFor } from "./effect-icon";
import type { CatalogEntry, CatalogMatch } from "@/lib/catalog";

// Collection-style strain card. Atmospheric background derived from the
// strain's curator-defined sensoryFamily (no per-strain artwork yet —
// PR queue: AI image generation, top anchors first). Foreground reads
// like a wine-cellar label rather than a search result:
//
//   ┌────────────────────┐
//   │ 94 MATCH      🔖  │  ← match% pip + bookmark
//   │                    │
//   │  King Louis XIII   │  ← strain name
//   │  Indica · Strong   │  ← type · potency
//   │  Pine OG benchmark │  ← curator one-liner (archetype / curatorNote.lead)
//   │  ⏤                 │
//   │  [Pine][Earth][Gas]│  ← top 3 aromas
//   │                    │
//   │  ☁ Relaxed         │  ← top 3 effects with icons
//   │  ☾ Sleepy          │
//   │  ⚓ Heavy body      │
//   │                    │
//   │  "Even an average  │  ← curator quote (truncated)
//   │   cut still…"     →│
//   └────────────────────┘
//
// Click anywhere on the card → /catalog/[slug] for the full detail page.
export function CatalogCollectibleCard({
  entry,
  match,
  score,
}: {
  entry: CatalogEntry;
  match?: CatalogMatch;
  score: number;
}) {
  const { strain, identity, archetype } = entry;
  const palette = paletteForFamily(identity?.sensoryFamily ?? null);
  const showMatch = Boolean(match);
  const badgeValue = match ? match.score : score;
  const badgeLabel = match ? "MATCH" : "CURATED";

  const aromas = strain.aromas.slice(0, 3);
  const effects = strain.effects.slice(0, 3);
  // One-liner under the type — curatorNote's first sentence if rich, else
  // the inferred archetype, else the raw catalog note.
  const oneLiner = identity?.curatorNote
    ? firstSentence(identity.curatorNote)
    : archetype || strain.note || "";

  return (
    <li className="relative">
      <Link
        href={`/catalog/${strainSlug(strain.name)}`}
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 p-4 transition-all",
          "hover:scale-[1.01] hover:border-accent/40 hover:shadow-lg",
          palette.contentTone === "light" ? "text-white" : "text-foreground",
        )}
        style={{ background: palette.background }}
      >
        {/* Top row: match badge */}
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/95 text-foreground shadow-md"
            title={
              showMatch
                ? `Your taste-match score for this strain`
                : `Curator's quality score — match % appears once you build a profile`
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

        {/* Strain identity */}
        <div className="mt-3">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
            {strain.name}
          </h3>
          <p className="mt-0.5 text-xs capitalize text-white/70">
            {strain.type} · {strain.potency.replace("-", " ")}
          </p>
          {oneLiner && (
            <p
              className="mt-2 text-xs leading-snug text-white/80"
              style={{ color: palette.accent }}
            >
              {oneLiner}
            </p>
          )}
        </div>

        {/* Aroma chips */}
        {aromas.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {aromas.map((a) => (
              <li
                key={`aroma-${a}`}
                className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium capitalize tracking-wide text-white/85 ring-1 ring-white/10"
              >
                {labelFor(a)}
              </li>
            ))}
          </ul>
        )}

        {/* Effect icons */}
        {effects.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {effects.map((e) => {
              const Icon = effectIconFor(e);
              return (
                <li
                  key={`effect-${e}`}
                  className="flex items-center gap-1 text-[10px] text-white/75"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <Icon className="h-3 w-3" aria-hidden />
                  </span>
                  <span className="capitalize">{labelFor(e)}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Bottom: curator quote + arrow */}
        {(identity?.curatorQuote || identity?.curatorNote) && (
          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <p className="line-clamp-2 flex-1 text-[11px] italic leading-snug text-white/70">
              {identity.curatorQuote ?? firstSentence(identity.curatorNote!)}
            </p>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-white/60"
              aria-hidden
            />
          </div>
        )}
        {!identity?.curatorQuote && !identity?.curatorNote && (
          <div className="mt-auto flex justify-end pt-4">
            <ChevronRight
              className="h-4 w-4 shrink-0 text-white/60"
              aria-hidden
            />
          </div>
        )}
      </Link>
    </li>
  );
}

// First-sentence helper duplicated locally so the card stays standalone —
// the strain detail page has its own splitLead() and we don't import
// across the page/component boundary.
function firstSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^.+?[.!?](?=\s|$)/);
  return match ? match[0] : trimmed;
}
