import { RecommendationCard } from "@/components/recommendation-card";
import type { Category, StrainMatch } from "@/lib/types";

type RecLike = StrainMatch & { id?: string };

const ORDER: Category[] = [
  "Best Match",
  "Closest Alternative",
  "Worth Trying",
  "Risky",
  "Avoid",
];

const GROUP_HINT: Record<Category, string> = {
  "Best Match": "Closest to your sensory profile.",
  "Closest Alternative": "Not your favourite, but clearly the same lane.",
  "Worth Trying": "Real overlap with your taste — a reasonable gamble.",
  Risky: "Possible, but with friction. Read the caveats.",
  Avoid: "Likely a poor use of your money.",
};

export function ResultsView<T extends RecLike>({
  recommendations,
  renderExtra,
}: {
  recommendations: T[];
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

  return (
    <div className="space-y-10">
      {ORDER.map((category) => {
        const group = recommendations.filter((r) => r.category === category);
        if (group.length === 0) return null;
        return (
          <section key={category}>
            <div className="mb-4 flex items-baseline gap-3">
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {category}
              </h3>
              <span className="text-sm text-muted-foreground">
                {group.length}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                {GROUP_HINT[category]}
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
