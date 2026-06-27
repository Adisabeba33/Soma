"use client";

import { useState } from "react";
import { ChevronDown, Circle, CheckCircle2, GitCompareArrows, X } from "lucide-react";
import { cn, formatScore } from "@/lib/utils";
import { RecommendationCard } from "@/components/recommendation-card";
import { BlendCompare } from "@/components/blend-compare";
import type { Verdict } from "@/components/feedback-pill";
import type { StrainMatch } from "@/lib/types";

type Rec = StrainMatch & { id?: string };
type Breakdown = Record<string, Array<{ world: string; score: number }>>;

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
// per-strain analysis. Strains can also be picked to compare head-to-head.
export function BlendResultsList({
  recommendations,
  verdicts,
  worlds,
  breakdown,
  startPlace = 4,
}: {
  recommendations: Rec[];
  verdicts?: Record<string, Verdict>;
  worlds: string[];
  breakdown: Breakdown;
  startPlace?: number;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  const places = placesOf(recommendations);
  const sorted = [...recommendations].sort(
    (a, b) => b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );
  const rest = sorted.filter((r) => (places.get(r.strainName) ?? 999) >= startPlace);
  if (rest.length === 0) return null;

  const togglePick = (name: string) =>
    setPicked((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name],
    );

  // Picked strains, ordered by their place in the ranking, as full records.
  const pickedRecs = picked
    .map((name) => recommendations.find((r) => r.strainName === name))
    .filter((r): r is Rec => Boolean(r))
    .sort(
      (a, b) =>
        (places.get(a.strainName) ?? 0) - (places.get(b.strainName) ?? 0),
    );

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
            The rest of the ranking
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Places {startPlace} and down — tap a row to open it, or pick two to
            compare.
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-[0_28px_60px_-42px_rgba(60,45,20,0.45)]">
        {rest.map((r) => {
          const isOpen = open === r.strainName;
          const isPicked = picked.includes(r.strainName);
          const verdict = verdicts?.[r.resolvedName] ?? verdicts?.[r.strainName];
          return (
            <div
              key={r.id ?? r.strainName}
              className={cn(
                "border-b border-border/50 last:border-0",
                isPicked && "bg-brass/[0.06]",
              )}
            >
              <div className="flex items-stretch">
                {/* Pick to compare */}
                <button
                  type="button"
                  onClick={() => togglePick(r.strainName)}
                  aria-label={isPicked ? "Unpick" : "Pick to compare"}
                  aria-pressed={isPicked}
                  className="soma-ease flex shrink-0 items-center pl-4 pr-1 text-muted-foreground transition-colors hover:text-brass sm:pl-5"
                >
                  {isPicked ? (
                    <CheckCircle2 className="h-5 w-5 text-brass" />
                  ) : (
                    <Circle className="h-5 w-5 opacity-50" />
                  )}
                </button>
                {/* Open detail */}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : r.strainName)}
                  aria-expanded={isOpen}
                  className="soma-ease flex flex-1 items-center gap-3 py-3.5 pl-2 pr-4 text-left transition-colors hover:bg-muted/40 sm:pr-5"
                >
                  <span className="w-6 shrink-0 font-display text-sm font-semibold tabular-nums text-brass/70">
                    {places.get(r.strainName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-semibold tracking-tight">
                      {r.strainName}
                    </span>
                    {r.world && (
                      <span className="text-[11px] text-brass/80">
                        via {r.world}
                      </span>
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
              </div>
              {isOpen && (
                <div className="border-t border-border/50 bg-background/30 px-3 py-4 sm:px-4">
                  <RecommendationCard match={r as never} verdict={verdict ?? null} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating compare bar — appears once anything is picked. */}
      {picked.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 px-5 py-3 shadow-[0_-12px_40px_-24px_rgba(60,45,20,0.5)] backdrop-blur-md sm:px-8">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <span className="text-sm">
              <span className="font-display text-base font-semibold">
                {picked.length}
              </span>{" "}
              picked{" "}
              <span className="text-muted-foreground">
                {picked.length < 2 ? "· pick one more" : "to compare"}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPicked([])}
                className="soma-ease inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" /> Clear
              </button>
              <button
                type="button"
                onClick={() => picked.length >= 2 && setComparing(true)}
                disabled={picked.length < 2}
                className="soma-ease inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
              >
                <GitCompareArrows className="h-4 w-4" />
                Compare
              </button>
            </div>
          </div>
        </div>
      )}

      {comparing && pickedRecs.length >= 2 && (
        <BlendCompare
          recs={pickedRecs}
          worlds={worlds}
          breakdown={breakdown}
          onClose={() => setComparing(false)}
        />
      )}
    </div>
  );
}
