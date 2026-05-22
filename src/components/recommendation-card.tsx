import { Card } from "@/components/ui/card";
import { ScoreBar } from "@/components/match-meter";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import type { Category, StrainMatch } from "@/lib/types";

export type RecommendationView = StrainMatch & { id?: string };

const CATEGORY_META: Record<
  Category,
  { tone: string; bar: string; dot: string }
> = {
  "Best Match": { tone: "text-accent", bar: "bg-accent", dot: "bg-accent" },
  "Closest Alternative": {
    tone: "text-brass",
    bar: "bg-brass",
    dot: "bg-brass",
  },
  "Worth Trying": {
    tone: "text-foreground",
    bar: "bg-foreground/65",
    dot: "bg-foreground/55",
  },
  Risky: {
    tone: "text-[#b4791f]",
    bar: "bg-[#b4791f]",
    dot: "bg-[#b4791f]",
  },
  Avoid: {
    tone: "text-[#a23b2c]",
    bar: "bg-[#a23b2c]",
    dot: "bg-[#a23b2c]",
  },
};

export function RecommendationCard({
  match,
  rank,
  children,
}: {
  match: RecommendationView;
  rank?: number;
  children?: React.ReactNode;
}) {
  const meta = CATEGORY_META[match.category];
  const matchedChips = [
    ...match.matchedEffects.map((v) => labelFor(v)),
    ...match.matchedAromas.map((v) => labelFor(v)),
  ].slice(0, 6);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:gap-7">
        {/* Score column */}
        <div className="flex shrink-0 flex-row items-center gap-4 sm:w-32 sm:flex-col sm:items-start sm:gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "font-display text-5xl font-semibold tabular-nums",
                  meta.tone,
                )}
              >
                {match.matchScore}
              </span>
              <span className="text-lg text-muted-foreground">%</span>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Taste match
            </p>
          </div>
          <div className="hidden h-1.5 w-full overflow-hidden rounded-full bg-muted sm:block">
            <div
              className={cn("h-full rounded-full animate-grow", meta.bar)}
              style={{ width: `${match.matchScore}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium",
                meta.tone,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              {match.category}
            </span>
            {typeof rank === "number" && (
              <span className="text-xs text-muted-foreground">#{rank}</span>
            )}
            <span className="ml-auto rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              Confidence: {match.confidence}
            </span>
          </div>

          <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight">
            {match.strainName}
          </h3>
          {!match.knownStrain && (
            <p className="text-xs text-muted-foreground">
              Not in our reference set — read inferred from the name.
            </p>
          )}
          {match.knownStrain &&
            match.resolvedName.toLowerCase() !==
              match.strainName.toLowerCase() && (
              <p className="text-xs text-muted-foreground">
                Matched to {match.resolvedName}
              </p>
            )}

          <p className="mt-3 text-sm leading-relaxed text-foreground">
            {match.explanation}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Section label="Why it suits you">{match.whyItFits}</Section>
            <Section label="What to watch">{match.riskNotes}</Section>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ScoreBar
              label="Aroma"
              value={match.aromaMatch}
              barClass={meta.bar}
            />
            <ScoreBar
              label="Flavor"
              value={match.flavorMatch}
              barClass={meta.bar}
            />
            <ScoreBar
              label="Effect"
              value={match.effectMatch}
              barClass={meta.bar}
            />
          </div>

          {matchedChips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {matchedChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {children && (
            <div className="mt-5 border-t border-border pt-4">{children}</div>
          )}
        </div>
      </div>
    </Card>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-foreground/90">
        {children}
      </p>
    </div>
  );
}
