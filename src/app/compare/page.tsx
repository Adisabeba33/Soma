"use client";

import { useState } from "react";
import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { TagInput } from "@/components/ui/selectors";
import { Button, buttonClass } from "@/components/ui/button";
import { ScoreBar } from "@/components/match-meter";
import { POPULAR_STRAINS } from "@/lib/profile-state";
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

export default function ComparePage() {
  const [strains, setStrains] = useState<string[]>([]);
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [closestName, setClosestName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needProfile, setNeedProfile] = useState(false);

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
        <TagInput
          value={strains}
          onChange={setStrains}
          placeholder="Add a strain and press Enter"
          suggestions={POPULAR_STRAINS}
          validateStrains
        />
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
              .map((item) => `${item.strainName} ${item.matchScore}%`)
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
