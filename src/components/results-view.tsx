import { RecommendationCard } from "@/components/recommendation-card";
import type { Verdict } from "@/components/feedback-pill";
import type { Category, StrainMatch } from "@/lib/types";
import { CATEGORY_META, CATEGORY_SECTIONS } from "@/lib/score-taxonomy";

type RecLike = StrainMatch & { id?: string };

// Results group by the engine's own category — the one verdict scale the
// product has (see src/lib/score-taxonomy.ts). Grouping keys off
// `match.category`, not the raw score, so a conflict-capped strain sits in
// the section its card label says, and the section header can never
// contradict the card. The score stays a sensory-fit reading; purchase
// confidence is a separate axis rendered inside each card.

// The calibration ceiling can collapse several non-anchor strains onto the
// same visible matchScore (e.g. four leaders all showing 92). The engine still
// ranks them internally via unclampedScore. Group strains sharing a visible
// score (ordered by the engine's internal judgment) so each card can show a
// "#2 of 6" pill instead of leaving the visitor to choose blind — mirrors the
// Compare page indicator.
function tieRanksOf(
  recs: { strainName: string; matchScore: number; unclampedScore: number }[],
): Map<string, { rank: number; total: number }> {
  const sorted = [...recs].sort(
    (a, b) => b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );
  const map = new Map<string, { rank: number; total: number }>();
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].matchScore === sorted[i].matchScore) {
      j++;
    }
    const total = j - i;
    if (total > 1) {
      for (let k = 0; k < total; k++) {
        map.set(sorted[i + k].strainName, { rank: k + 1, total });
      }
    }
    i = j;
  }
  return map;
}

export function ResultsView<T extends RecLike>({
  recommendations,
  verdicts,
  renderExtra,
}: {
  recommendations: T[];
  // The visitor's own verdict per strain, keyed by canonical (resolved) name.
  verdicts?: Record<string, Verdict>;
  renderExtra?: (rec: T) => React.ReactNode;
}) {
  if (recommendations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No strains were analyzed in this session.
      </p>
    );
  }

  let rank = 0;
  const tieRanks = tieRanksOf(recommendations);

  return (
    <div className="space-y-10">
      {CATEGORY_SECTIONS.map((category: Category) => {
        const meta = CATEGORY_META[category];
        const group = recommendations.filter((r) => r.category === category);
        if (group.length === 0) return null;
        return (
          <section key={category}>
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
              <h3
                className={`font-display text-xl font-semibold tracking-tight ${meta.tone}`}
              >
                {category}
              </h3>
              <span className="text-sm text-muted-foreground">
                {group.length}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                {meta.hint}
              </span>
            </div>
            <div className="space-y-4">
              {group.map((rec) => {
                rank += 1;
                return (
                  <RecommendationCard
                    key={rec.id ?? `${rec.strainName}-${rank}`}
                    match={rec}
                    rank={rank}
                    tie={tieRanks.get(rec.strainName) ?? null}
                    verdict={
                      verdicts?.[rec.resolvedName] ?? verdicts?.[rec.strainName]
                    }
                  >
                    {renderExtra?.(rec)}
                  </RecommendationCard>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
