"use client";

import { useEffect, useState } from "react";
import { Copy, GitCompareArrows, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Warns when the two (or merged-pair) profiles are near-duplicates, so the user
// doesn't merge/blend profiles that are basically the same taste. Read-only
// hint — never blocks. Tag-comparison only (see lib/profile-similarity).

type Sim = {
  comparable: boolean;
  a?: string;
  b?: string;
  percent?: number;
  differOn?: string[];
};

export function ProfileSimilarityHint() {
  const [s, setS] = useState<Sim | null>(null);

  useEffect(() => {
    fetch("/api/profiles/similarity")
      .then((r) => r.json())
      .then(setS)
      .catch(() => setS(null));
  }, []);

  if (!s?.comparable) return null;
  const pct = s.percent ?? 0;
  const high = pct >= 85; // near-duplicate
  const low = pct <= 60; // genuinely distinct

  const Icon = high ? Copy : low ? Sparkles : GitCompareArrows;
  const tone = high
    ? "border-[#a23b2c]/30 bg-[#a23b2c]/5 text-[#a23b2c]"
    : low
      ? "border-accent/30 bg-accent/5 text-foreground"
      : "border-border bg-muted/30 text-muted-foreground";

  const differ =
    s.differOn && s.differOn.length > 0
      ? s.differOn.slice(0, 3).join(", ")
      : null;

  return (
    <div
      className={cn(
        "mt-3 flex items-start gap-2.5 rounded-xl border px-4 py-2.5 text-sm",
        tone,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="leading-relaxed">
        <span className="font-medium text-foreground">
          {s.a} and {s.b} are {pct}% alike.
        </span>{" "}
        {high ? (
          <>
            Nearly the same taste — merging them adds little.
            {differ ? ` They differ mainly on: ${differ}.` : ""}
          </>
        ) : low ? (
          <>Distinct sides — good candidates to blend.</>
        ) : (
          <>{differ ? `They differ mainly on: ${differ}.` : "A partial overlap."}</>
        )}
      </span>
    </div>
  );
}
