"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { TagInput } from "@/components/ui/selectors";
import { Button, buttonClass } from "@/components/ui/button";
import { ScoreBar } from "@/components/match-meter";
import { FeedbackPill, type Verdict } from "@/components/feedback-pill";
import { POPULAR_STRAINS } from "@/lib/profile-state";
import { clearBasket, getBasket } from "@/lib/compare-basket";
import { labelFor } from "@/lib/vocab";
import { cn } from "@/lib/utils";
import type { Category, ComparisonItem } from "@/lib/types";

const TONE: Record<Category, string> = {
  "Best Match": "text-accent",
  "Closest Alternative": "text-brass",
  "Worth Trying": "text-foreground",
  Risky: "text-[#b4791f]",
  Avoid: "text-[#a23b2c]",
};

// Pre-built test clusters. Each one is 5 strains that exemplify a
// recognisable sensory territory, so the owner (and curious users)
// can run a "standard battery" Compare in one tap instead of typing
// the same anchor sets every time. Click → replaces whatever's in
// the TagInput. Strain names are canonical so TagInput's known-strain
// validation lights them green.
const COMPARE_PRESETS: Array<{ label: string; strains: string[] }> = [
  {
    label: "OG cluster",
    strains: ["Face Off OG", "King Louis XIII", "Fire OG", "Tahoe OG", "Alien OG"],
  },
  {
    label: "Gas school",
    strains: ["GG4", "Sour Diesel", "Chemdawg", "GMO Cookies", "Stardawg"],
  },
  {
    label: "Modern dessert",
    strains: ["Wedding Cake", "Gelato", "Runtz", "Permanent Marker", "Sundae Driver"],
  },
  {
    label: "Modern fruity",
    strains: ["Zoap", "RS11", "White Hot Guava", "Pink Runtz", "Lemon Cherry Gelato"],
  },
  {
    label: "Heavy indica",
    strains: ["Northern Lights", "Bubba Kush", "Granddaddy Purple", "Master Yoda", "Hindu Kush"],
  },
];

export default function ComparePage() {
  const [strains, setStrains] = useState<string[]>([]);
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [closestName, setClosestName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needProfile, setNeedProfile] = useState(false);
  // Existing strain-level verdicts keyed by canonical strain name —
  // hydrated once on mount so a returning user sees their prior pill
  // selections highlighted instead of an empty row.
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});

  // Pull the user's existing strain verdicts so the pills land
  // pre-filled when Compare results render.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/strain-feedback")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { verdicts?: Array<{ strainName: string; verdict: string }> } | null) => {
        if (cancelled || !data?.verdicts) return;
        const next: Record<string, Verdict> = {};
        for (const v of data.verdicts) {
          if (
            v.verdict === "loved" ||
            v.verdict === "good" ||
            v.verdict === "neutral" ||
            v.verdict === "avoid"
          ) {
            next[v.strainName] = v.verdict;
          }
        }
        setVerdicts(next);
      })
      .catch(() => {
        // Hydration failure is non-fatal — pills just start empty.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hydrate from the catalog "Compare basket" once on mount: append any
  // queued names that aren't already in the input, then drain the basket
  // so the next visit starts clean.
  useEffect(() => {
    const queued = getBasket();
    if (queued.length === 0) return;
    setStrains((prev) => {
      const seen = new Set(prev.map((s) => s.toLowerCase()));
      const add = queued.filter((s) => !seen.has(s.toLowerCase()));
      return add.length === 0 ? prev : [...prev, ...add];
    });
    clearBasket();
  }, []);

  // When the calibration ceiling collapses several non-anchor scores to
  // the same visible matchScore, the engine still differentiated them
  // internally (via unclampedScore — used as sort tie-breaker above).
  // tieRanks surfaces that: for each item that shares a matchScore with
  // at least one other item, it records its position within the tied
  // group plus the group size, so the card can render a small "#1 of 3"
  // pill explaining the order.
  const tieRanks = useMemo(() => {
    const map = new Map<string, { rank: number; total: number }>();
    let i = 0;
    while (i < items.length) {
      let j = i;
      while (j < items.length && items[j].matchScore === items[i].matchScore) {
        j++;
      }
      const groupSize = j - i;
      if (groupSize > 1) {
        for (let k = 0; k < groupSize; k++) {
          map.set(items[i + k].strainName, {
            rank: k + 1,
            total: groupSize,
          });
        }
      }
      i = j;
    }
    return map;
  }, [items]);

  async function compare() {
    setLoading(true);
    setError(null);
    setNeedProfile(false);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strains }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.profileExists === false) setNeedProfile(true);
        setError(data.error ?? "Comparison failed.");
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
      setClosestName(data.closestName ?? null);
    } catch {
      setError("Comparison failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Compare</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Strain comparison
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        Put two to five strains head to head. SŌMA ranks them against your
        taste profile and shows where they pull apart on aroma, flavour and
        effect.
      </p>

      <div className="mt-8 max-w-xl">
        {/* Quick-start preset clusters. Tap → replaces TagInput with
            the cluster's 5 strains so the standard test batteries are
            one click each. Hover title lists the strains so the user
            can preview what each preset loads. */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Quick start
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMPARE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setStrains(preset.strains)}
                title={preset.strains.join(" · ")}
                className={cn(
                  "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors",
                  "hover:border-accent/40 hover:text-foreground",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <TagInput
            value={strains}
            onChange={setStrains}
            placeholder="Add a strain and press Enter"
            suggestions={POPULAR_STRAINS}
            validateStrains
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={compare}
            disabled={loading || strains.length < 2 || strains.length > 5}
          >
            <GitCompareArrows className="h-4 w-4" />
            {loading ? "Comparing…" : "Compare strains"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {strains.length < 2
              ? "Add at least two."
              : strains.length > 5
                ? "Five at most."
                : `${strains.length} selected`}
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-6 max-w-xl rounded-xl bg-[#a23b2c]/10 px-4 py-3 text-sm text-[#a23b2c]">
          {error}
          {needProfile && (
            <Link
              href="/profile"
              className="ml-1 font-medium underline underline-offset-4"
            >
              Build your taste profile →
            </Link>
          )}
        </div>
      )}

      {items.length > 0 && (
        <>
          {closestName && (
            <p className="mt-10 font-display text-xl">
              <span className="italic text-accent">{closestName}</span> sits
              closest to your taste profile.
            </p>
          )}
          {/* Temporary testing aid — ranked order on one line. Remove later. */}
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
            [debug] Ranked order:{" "}
            {items
              .map(
                (item) =>
                  `${item.strainName} ${item.matchScore}% (raw ${item.unclampedScore.toFixed(2)})`,
              )
              .join(", ")}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const isClosest = item.strainName === closestName;
              return (
                <div
                  key={item.strainName}
                  className={cn(
                    "flex flex-col rounded-2xl border bg-card p-5",
                    isClosest ? "border-accent" : "border-border",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold leading-tight tracking-tight">
                      {item.strainName}
                    </h3>
                    {isClosest && (
                      <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                        Closest
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span
                      className={cn(
                        "font-display text-3xl font-semibold",
                        TONE[item.category],
                      )}
                    >
                      {item.matchScore}%
                    </span>
                    <span
                      className={cn("text-sm font-medium", TONE[item.category])}
                    >
                      {item.category}
                    </span>
                    {tieRanks.get(item.strainName) && (
                      <span
                        className="rounded-full border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                        title={`Internal score ${item.unclampedScore.toFixed(2)} — the engine ranks this #${tieRanks.get(item.strainName)?.rank} of ${tieRanks.get(item.strainName)?.total} strains tied at ${item.matchScore}%. The 88-point non-anchor ceiling compresses the visible score; the order here is the engine's actual judgment.`}
                      >
                        #{tieRanks.get(item.strainName)?.rank} of{" "}
                        {tieRanks.get(item.strainName)?.total}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {item.strainType} · {item.potency.replace("-", " ")} ·{" "}
                    confidence {item.confidence}
                  </p>

                  <div className="mt-4 space-y-2.5">
                    <ScoreBar label="Aroma" value={item.aromaMatch} />
                    <ScoreBar label="Flavor" value={item.flavorMatch} />
                    <ScoreBar label="Effect" value={item.effectMatch} />
                  </div>

                  <dl className="mt-4 space-y-2 text-sm">
                    <Trait label="Aroma" values={item.aromas} />
                    <Trait label="Flavor" values={item.flavors} />
                    <Trait label="Effect" values={item.effects} />
                  </dl>

                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Best use
                    </p>
                    <p className="mt-0.5 text-sm">{item.useCase}</p>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.whyItFits}
                  </p>

                  {/* Strain-level quick verdict. One tap upserts to
                      StrainFeedback; engine learns immediately for
                      the next scoreStrain call across this user. */}
                  <div className="mt-4 border-t border-border pt-3">
                    <FeedbackPill
                      strainName={item.resolvedName || item.strainName}
                      initial={
                        verdicts[item.resolvedName || item.strainName] ?? null
                      }
                      source="compare"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Comparison is a sensory read against your profile — batch quality,
            grower and freshness still decide the final experience.
          </p>
          <div className="mt-6">
            <Link href="/taste-match" className={buttonClass("outline", "md")}>
              Run a full Taste Match
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function Trait({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="flex gap-2">
      <dt className="w-14 shrink-0 text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">
        {values.map((v) => labelFor(v)).join(", ") || "—"}
      </dd>
    </div>
  );
}
