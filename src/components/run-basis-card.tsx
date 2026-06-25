"use client";

import Link from "next/link";
import { Blend, GitMerge } from "lucide-react";

// What's actually driving this Taste Match run. Replaces the single-profile
// summary whenever a merge or the Taste Blender is on — so the page never shows
// one lone profile while scoring against several. Three states:
//   • blender — a merged pair + a third blended in (the virtual 4th profile)
//   • merge   — two profiles scored together (no Blender)
//   • single  — handled by the caller (the normal "Your taste profile" card)

export function RunBasisCard({
  merge,
  blender,
}: {
  merge?: { names: string[] } | null;
  blender?: {
    pair: string[];
    third: string;
    admix: number;
    balance: boolean;
  } | null;
}) {
  if (blender) {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold">
            <Blend className="h-4 w-4 shrink-0 text-accent" />
            Taste Blender in play
          </h3>
          <Link
            href="/account"
            className="shrink-0 text-sm text-accent underline-offset-4 hover:underline"
          >
            Manage
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Not one profile — a blend of all three is scoring this run.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed">
          <span className="font-medium text-foreground">
            {blender.pair.join(" + ")}
          </span>
          {blender.third ? (
            <>
              {" "}
              blended with{" "}
              <span className="font-medium text-foreground">
                {blender.third}
              </span>{" "}
              ({blender.admix}%)
            </>
          ) : null}
          {blender.balance ? " · balance mode" : ""}
        </p>
      </div>
    );
  }

  if (merge && merge.names.length >= 2) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold">
            <GitMerge className="h-4 w-4 shrink-0 text-accent" />
            Two merged profiles in play
          </h3>
          <Link
            href="/account"
            className="shrink-0 text-sm text-accent underline-offset-4 hover:underline"
          >
            Manage
          </Link>
        </div>
        <p className="mt-2 text-sm leading-relaxed">
          <span className="font-medium text-foreground">
            {merge.names.join(" + ")}
          </span>
          <span className="text-muted-foreground">
            {" "}
            — both drive this run together, not one alone.
          </span>
        </p>
      </div>
    );
  }

  return null;
}
