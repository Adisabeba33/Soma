import { RecommendationCard } from "@/components/recommendation-card";
import type { Verdict } from "@/components/feedback-pill";
import type { StrainMatch } from "@/lib/types";

type RecLike = StrainMatch & { id?: string };

// The buy-decision verdict the visitor actually wants — three tiers over the
// raw match score (owner-set thresholds), so results answer "should I buy
// this?" not "what category is this?". The engine's per-card "why it suits
// you" / "what to watch" already supply the reasons and the risk.
const TIERS = [
  {
    key: "worth",
    label: "Worth your money",
    range: "81–100",
    min: 81,
    hint: "Strong fit for your taste — buy with confidence.",
    label_cls: "text-accent",
    bar_cls: "bg-accent",
  },
  {
    key: "shot",
    label: "Worth a shot",
    range: "56–80",
    min: 56,
    hint: "Decent, with trade-offs — a fair gamble for the day.",
    label_cls: "text-brass",
    bar_cls: "bg-brass",
  },
  {
    key: "save",
    label: "Save your money",
    range: "0–55",
    min: 0,
    hint: "Not your profile — better spent elsewhere.",
    label_cls: "text-[#a23b2c]",
    bar_cls: "bg-[#a23b2c]",
  },
] as const;

function tierOf(score: number): (typeof TIERS)[number]["key"] {
  if (score >= 81) return "worth";
  if (score >= 56) return "shot";
  return "save";
}

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
      {TIERS.map((tier) => {
        const group = recommendations.filter(
          (r) => tierOf(r.matchScore) === tier.key,
        );
        if (group.length === 0) return null;
        return (
          <section key={tier.key}>
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className={`h-2.5 w-2.5 rounded-full ${tier.bar_cls}`} />
              <h3
                className={`font-display text-xl font-semibold tracking-tight ${tier.label_cls}`}
              >
                {tier.label}
              </h3>
              <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {tier.range}
              </span>
              <span className="text-sm text-muted-foreground">
                {group.length}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                {tier.hint}
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
