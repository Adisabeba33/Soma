"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatScore } from "@/lib/utils";
import { RecommendationCard } from "@/components/recommendation-card";
import type { Verdict } from "@/components/feedback-pill";
import type { StrainMatch } from "@/lib/types";

type Rec = StrainMatch & { id?: string };

// Tie-aware dense places by the displayed score: strains sharing a score share
// one place number (so the list lines up with the overview's tie handling).
function placesOf(recs: Rec[]): Map<string, number> {
  const sorted = [...recs].sort(
    (a, b) => b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );
  const map = new Map<string, number>();
  let place = 0;
  let lastScore = Number.POSITIVE_INFINITY;
  for (const r of sorted) {
    if (r.matchScore !== lastScore) {
      place += 1;
      lastScore = r.matchScore;
    }
    map.set(r.strainName, place);
  }
  return map;
}

// The continued ranking below the Blend Overview: places `startPlace`..N as a
// compact list (place · name · score), each row tapping open to reveal the full
// per-strain analysis. The top places are already summarised in the overview,
// so this picks up where it leaves off.
export function BlendResultsList({
  recommendations,
  verdicts,
  startPlace = 4,
}: {
  recommendations: Rec[];
  verdicts?: Record<string, Verdict>;
  startPlace?: number;
}) {
  const [open, setOpen] = useState<string | null>(null);

  const places = placesOf(recommendations);
  const sorted = [...recommendations].sort(
    (a, b) => b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );
  const rest = sorted.filter((r) => (places.get(r.strainName) ?? 999) >= startPlace);
  if (rest.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
        The rest of the ranking
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Places {startPlace} and down — tap any to open its full analysis.
      </p>

      <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-[0_28px_60px_-42px_rgba(60,45,20,0.45)]">
        {rest.map((r) => {
          const isOpen = open === r.strainName;
          const verdict = verdicts?.[r.resolvedName] ?? verdicts?.[r.strainName];
          return (
            <div
              key={r.id ?? r.strainName}
              className="border-b border-border/50 last:border-0"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : r.strainName)}
                aria-expanded={isOpen}
                className="soma-ease flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40 sm:px-5"
              >
                <span className="w-6 shrink-0 font-display text-sm font-semibold tabular-nums text-brass/70">
                  {places.get(r.strainName)}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base font-semibold tracking-tight">
                    {r.strainName}
                  </span>
                  {r.world && (
                    <span className="text-[11px] text-brass/80">via {r.world}</span>
                  )}
                </div>
                <span className="shrink-0 font-display text-base font-semibold text-brass">
                  {formatScore(r.matchScore)}%
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen && (
                <div className="border-t border-border/50 bg-background/30 px-3 py-4 sm:px-4">
                  <RecommendationCard
                    match={r as never}
                    verdict={verdict ?? null}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
