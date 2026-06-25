"use client";

import Link from "next/link";
import { Blend, GitMerge, ChevronRight } from "lucide-react";
import { DARK_CARD, GOLD } from "@/components/active-profile-card";

// What's actually driving this Taste Match run. Replaces the single-profile
// card whenever a merge or the Taste Blender is on — so the page never shows
// one lone profile while scoring against several. Brand-dark surface, matching
// the active-profile card. Three states:
//   • blender — a merged pair + a third blended in (the virtual 4th profile)
//   • merge   — two profiles scored together (no Blender)
//   • single  — handled by the caller (the ActiveProfileCard)

function chip(text: string) {
  return (
    <span
      key={text}
      className="rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: "rgba(201,154,78,0.16)", color: "#e7cfa0" }}
    >
      {text}
    </span>
  );
}

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
      <div
        className="relative overflow-hidden rounded-3xl p-5 text-white shadow-md sm:p-6"
        style={{ background: DARK_CARD }}
      >
        <Blend
          className="pointer-events-none absolute -right-7 -top-7 h-36 w-36 opacity-[0.07]"
          strokeWidth={1}
        />
        <div className="relative flex items-start justify-between gap-3">
          <p
            className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: GOLD }}
          >
            <Blend className="h-3.5 w-3.5" />
            Taste Blender in play
          </p>
          <Link
            href="/account"
            className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium underline-offset-4 hover:underline"
            style={{ color: GOLD }}
          >
            Manage <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="relative mt-2 font-display text-xl font-semibold tracking-tight">
          {blender.pair.join(" + ")}
        </p>
        <p className="relative mt-0.5 text-sm text-white/65">
          Not one profile — a blend of all three is scoring this run.
        </p>

        <div className="relative mt-3.5 flex flex-wrap items-center gap-1.5">
          {blender.pair.map((p) => chip(p))}
          {blender.third ? (
            <>
              <span className="text-xs text-white/45">blended with</span>
              <span
                className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                style={{ color: "#e7cfa0", borderColor: GOLD }}
              >
                {blender.third} · {blender.admix}%
              </span>
            </>
          ) : null}
          {blender.balance ? (
            <span className="rounded-full px-2.5 py-1 text-xs text-white/75 ring-1 ring-white/15">
              balance mode
            </span>
          ) : null}
        </div>

        {blender.balance && (
          <p className="relative mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/55">
            Bridge mode is stricter — scores may look lower because each strain
            must fit across all your profiles, not just one.
          </p>
        )}
      </div>
    );
  }

  if (merge && merge.names.length >= 2) {
    return (
      <div
        className="relative overflow-hidden rounded-3xl p-5 text-white shadow-md sm:p-6"
        style={{ background: DARK_CARD }}
      >
        <GitMerge
          className="pointer-events-none absolute -right-7 -top-7 h-36 w-36 opacity-[0.07]"
          strokeWidth={1}
        />
        <div className="relative flex items-start justify-between gap-3">
          <p
            className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: GOLD }}
          >
            <GitMerge className="h-3.5 w-3.5" />
            Two merged profiles in play
          </p>
          <Link
            href="/account"
            className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium underline-offset-4 hover:underline"
            style={{ color: GOLD }}
          >
            Manage <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="relative mt-2 font-display text-xl font-semibold tracking-tight">
          {merge.names.join(" + ")}
        </p>
        <p className="relative mt-0.5 text-sm text-white/65">
          Both drive this run together, not one alone.
        </p>
        <div className="relative mt-3.5 flex flex-wrap gap-1.5">
          {merge.names.map((n) => chip(n))}
        </div>
      </div>
    );
  }

  return null;
}
