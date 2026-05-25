import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreBar } from "@/components/match-meter";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import {
  signalLabel,
  type PurchaseSignals,
  type SignalLevel,
} from "@/lib/purchase-confidence";
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

const PURCHASE_TONE: Record<SignalLevel, string> = {
  unknown: "text-muted-foreground",
  low: "text-[#a23b2c]",
  medium: "text-brass",
  high: "text-accent",
};

const PURCHASE_LABEL: Record<SignalLevel, string> = {
  unknown: "Unknown",
  low: "Low",
  medium: "Medium",
  high: "High",
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
  const purchase = match.purchaseConfidence;
  const hasPurchaseSignals = Object.values(purchase.signals).some(
    (s) => s !== "unknown",
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:gap-7">
        {/* Score column — two stacked axes: Sensory match (big) and Purchase confidence (small). */}
        <div className="flex shrink-0 flex-row items-center gap-5 sm:w-32 sm:flex-col sm:items-start sm:gap-3">
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
              Sensory match
            </p>
            <div className="mt-2 hidden h-1.5 w-full overflow-hidden rounded-full bg-muted sm:block">
              <div
                className={cn("h-full rounded-full animate-grow", meta.bar)}
                style={{ width: `${match.matchScore}%` }}
              />
            </div>
          </div>
          <div className="sm:w-full sm:border-t sm:border-border sm:pt-3">
            <p
              className={cn(
                "font-display text-2xl font-semibold leading-tight",
                PURCHASE_TONE[purchase.overall],
              )}
            >
              {PURCHASE_LABEL[purchase.overall]}
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Purchase confidence
            </p>
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
              Sensory confidence: {match.confidence}
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

          {match.feedbackNote && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-brass/10 px-3 py-2 text-sm leading-relaxed text-foreground/90">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
              <span>{match.feedbackNote}</span>
            </p>
          )}

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

          {hasPurchaseSignals ? (
            <PurchaseBreakdown
              signals={purchase.signals}
              notes={purchase.notes}
            />
          ) : (
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                Purchase confidence is unknown
              </span>{" "}
              — SŌMA captures no grower, package date, cure or storage
              information. Sensory identity matches your preference; this
              specific purchase is a separate question.
            </p>
          )}

          {children && (
            <div className="mt-5 border-t border-border pt-4">{children}</div>
          )}
        </div>
      </div>
    </Card>
  );
}

function PurchaseBreakdown({
  signals,
  notes,
}: {
  signals: PurchaseSignals;
  notes: string[];
}) {
  const keys: Array<keyof PurchaseSignals> = [
    "freshness",
    "cure",
    "storage",
    "growerReliability",
    "phenotypeConsistency",
  ];
  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Purchase signals
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {keys.map((k) => {
          const level = signals[k];
          return (
            <li key={k}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs",
                  PURCHASE_TONE[level],
                )}
              >
                <span className="text-muted-foreground">{signalLabel(k)}:</span>
                <span className="font-medium">{PURCHASE_LABEL[level]}</span>
              </span>
            </li>
          );
        })}
      </ul>
      {notes.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted-foreground">
          {notes.map((n, i) => (
            <li key={i}>— {n}</li>
          ))}
        </ul>
      )}
    </div>
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
