import { Sparkles, Heart, Smile, Meh, ThumbsDown, Check, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreBar } from "@/components/match-meter";
import { cn, formatScore } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import {
  signalLabel,
  type PurchaseSignals,
  type SignalLevel,
} from "@/lib/purchase-confidence";
import type { Verdict } from "@/components/feedback-pill";
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

// The visitor's own verdict on this strain, surfaced so a confirmed pick reads
// as "you've tried this" rather than just its sensory score — without changing
// the rank (the score stays an honest sensory match).
const VERDICT_BADGE: Record<
  Verdict,
  { label: string; cls: string; Icon: typeof Heart }
> = {
  loved: {
    label: "You loved it",
    cls: "border-accent/50 bg-accent/15 text-accent",
    Icon: Heart,
  },
  good: {
    label: "You rated it Good",
    cls: "border-accent/30 bg-accent/10 text-accent/90",
    Icon: Smile,
  },
  neutral: {
    label: "You rated it Neutral",
    cls: "border-border bg-muted text-foreground/80",
    Icon: Meh,
  },
  avoid: {
    label: "You marked it Avoid",
    cls: "border-[#a23b2c]/40 bg-[#a23b2c]/10 text-[#a23b2c]",
    Icon: ThumbsDown,
  },
};

export function RecommendationCard({
  match,
  rank,
  tie,
  verdict,
  nested = false,
  children,
}: {
  match: RecommendationView;
  rank?: number;
  // When the calibration ceiling collapses several non-anchor strains onto the
  // same visible score, the engine still ranks them internally (unclampedScore).
  // Surfaced as a "#2 of 6" pill so the visitor isn't left to choose blind.
  tie?: { rank: number; total: number } | null;
  verdict?: Verdict | null;
  // Rendered inside the expandable ranking row (blend results), which already
  // shows the name, score and world above the card. In that context we drop the
  // identity hero so the same three facts aren't repeated twice.
  nested?: boolean;
  children?: React.ReactNode;
}) {
  const verdictBadge = verdict ? VERDICT_BADGE[verdict] : null;
  const meta = CATEGORY_META[match.category];
  const matchedChips = [
    ...match.matchedEffects.map((v) => labelFor(v)),
    ...match.matchedAromas.map((v) => labelFor(v)),
  ].slice(0, 6);
  const purchase = match.purchaseConfidence;
  const hasPurchaseSignals = Object.values(purchase.signals).some(
    (s) => s !== "unknown",
  );

  const renamed =
    match.knownStrain &&
    match.resolvedName.toLowerCase() !== match.strainName.toLowerCase();

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        {/* ── Identity ─────────────────────────────────────────────
            Category + verdict on one calm line; name on the left, the
            score as the single hero on the right. Skipped when nested,
            where the ranking row already carries name + score + world. */}
        {nested ? (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <CategoryTag meta={meta} category={match.category} />
            {verdictBadge && <VerdictTag badge={verdictBadge} />}
            <span className="ml-auto text-xs text-muted-foreground">
              Confidence:{" "}
              <span className="font-medium text-foreground/80">
                {match.confidence}
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <CategoryTag meta={meta} category={match.category} />
                {typeof rank === "number" && (
                  <span className="text-xs text-muted-foreground">#{rank}</span>
                )}
                {verdictBadge && <VerdictTag badge={verdictBadge} />}
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight">
                {match.strainName}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                {match.world && (
                  <span className="inline-flex items-center rounded-full bg-brass/10 px-2.5 py-0.5 text-[11px] font-medium text-brass">
                    via {match.world}
                  </span>
                )}
                {!match.knownStrain && (
                  <span className="text-xs text-muted-foreground">
                    Read inferred from the name
                  </span>
                )}
                {renamed && (
                  <span className="text-xs text-muted-foreground">
                    Matched to {match.resolvedName}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="flex items-baseline justify-end gap-0.5">
                <span
                  className={cn(
                    "font-display text-5xl font-semibold tabular-nums leading-none",
                    meta.tone,
                  )}
                >
                  {formatScore(match.matchScore)}
                </span>
                <span className="text-base text-muted-foreground">%</span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Sensory match
              </p>
              <p className="text-xs text-muted-foreground">
                Confidence:{" "}
                <span className="font-medium text-foreground/80">
                  {match.confidence}
                </span>
              </p>
              {tie && (
                <span
                  className="mt-1.5 inline-block rounded-full border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  title={`Internal score ${match.unclampedScore.toFixed(2)} — the engine ranks this #${tie.rank} of ${tie.total} strains tied at ${formatScore(match.matchScore)}%. At the top of the 89–92 elite band the visible score saturates, so close non-anchors can share one; the order here is the engine's actual judgment.`}
                >
                  #{tie.rank} of {tie.total}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Summary ───────────────────────────────────────────── */}
        <p className="text-sm leading-relaxed text-foreground">
          {match.explanation}
        </p>

        {(match.feedbackNote || match.feedbackAdjustment !== 0) && (
          <p className="flex items-start gap-2 rounded-lg bg-brass/10 px-3 py-2 text-sm leading-relaxed text-foreground/90">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
            <span>
              {match.feedbackAdjustment !== 0 && (
                <span className="font-semibold text-brass">
                  {match.feedbackAdjustment > 0 ? "+" : "−"}
                  {Math.abs(match.feedbackAdjustment)} from your feedback
                </span>
              )}
              {match.feedbackNote && (
                <>
                  {match.feedbackAdjustment !== 0 ? " — " : ""}
                  {match.feedbackNote}
                </>
              )}
            </span>
          </p>
        )}

        {/* ── Why it suits / What to watch ──────────────────────────
            Two distinctly tinted blocks (green = fit, amber = caution) so
            the eye separates them instead of reading two grey columns as
            one wall of text. */}
        <div className="grid gap-3 sm:grid-cols-2">
          <FitBlock kind="suits">{match.whyItFits}</FitBlock>
          <FitBlock kind="watch">{match.riskNotes}</FitBlock>
        </div>

        {/* ── Channel breakdown ─────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-3">
          <ScoreBar label="Aroma" value={match.aromaMatch} barClass={meta.bar} />
          <ScoreBar label="Flavor" value={match.flavorMatch} barClass={meta.bar} />
          <ScoreBar label="Effect" value={match.effectMatch} barClass={meta.bar} />
        </div>

        {matchedChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-0.5 text-xs font-medium text-muted-foreground">
              Matched:
            </span>
            {matchedChips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent"
              >
                <Check className="h-3 w-3" aria-hidden />
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* ── Purchase confidence (quiet footer) ────────────────────
            Deliberately demoted: it's about the specific jar, not the
            sensory match, and is usually "unknown" — so it sits at the
            bottom rather than competing with the score at the top. */}
        <div className="border-t border-border/70 pt-4">
          {hasPurchaseSignals ? (
            <PurchaseBreakdown
              overall={purchase.overall}
              signals={purchase.signals}
              notes={purchase.notes}
            />
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground/80">
                Purchase confidence: unknown
              </span>{" "}
              — SŌMA captures no grower, package date, cure or storage
              information. The sensory identity matches your preference; this
              specific jar is a separate question.
            </p>
          )}
        </div>

        {children && (
          <div className="border-t border-border pt-4">{children}</div>
        )}
      </div>
    </Card>
  );
}

function CategoryTag({
  meta,
  category,
}: {
  meta: { tone: string; dot: string };
  category: Category;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold",
        meta.tone,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
      {category}
    </span>
  );
}

function VerdictTag({
  badge,
}: {
  badge: { label: string; cls: string; Icon: typeof Heart };
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        badge.cls,
      )}
    >
      <badge.Icon className="h-3 w-3" aria-hidden />
      {badge.label}
    </span>
  );
}

function FitBlock({
  kind,
  children,
}: {
  kind: "suits" | "watch";
  children: React.ReactNode;
}) {
  const cfg =
    kind === "suits"
      ? {
          Icon: Sparkles,
          label: "Why it suits you",
          accent: "text-accent",
          ring: "border-accent/20 bg-accent/[0.04]",
        }
      : {
          Icon: Eye,
          label: "What to watch",
          accent: "text-brass",
          ring: "border-brass/25 bg-brass/[0.05]",
        };
  return (
    <div className={cn("rounded-xl border p-3.5", cfg.ring)}>
      <p
        className={cn(
          "flex items-center gap-1.5 text-xs font-semibold",
          cfg.accent,
        )}
      >
        <cfg.Icon className="h-3.5 w-3.5" aria-hidden />
        {cfg.label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
        {children}
      </p>
    </div>
  );
}

function PurchaseBreakdown({
  overall,
  signals,
  notes,
}: {
  overall: SignalLevel;
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
    <div>
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        Purchase confidence
        <span className={cn("font-semibold", PURCHASE_TONE[overall])}>
          {PURCHASE_LABEL[overall]}
        </span>
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
