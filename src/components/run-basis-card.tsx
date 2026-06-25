"use client";

import Link from "next/link";
import { Blend, GitMerge, ArrowRight } from "lucide-react";

// What's actually driving this Taste Match run — the "Sensory Atelier" light
// treatment, matching the active-profile card. Replaces the single-profile
// card whenever a merge or the Taste Blender is on, so the page never shows one
// lone profile while scoring against several.
//   • blender — a merged pair + a third blended in (the virtual 4th profile)
//   • merge   — two profiles scored together (no Blender)
//   • single  — handled by the caller (the ActiveProfileCard)

const CARD =
  "overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_24px_50px_-40px_rgba(80,64,40,0.45)] sm:p-7";

function chip(text: string) {
  return (
    <span
      key={text}
      className="rounded-full bg-brass/10 px-2.5 py-1 text-xs font-medium text-brass"
    >
      {text}
    </span>
  );
}

function Head({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-brass">
        {icon}
        {label}
      </p>
      <Link
        href="/account"
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Manage <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
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
      <div className={CARD}>
        <Head icon={<Blend className="h-3.5 w-3.5" />} label="Taste Blender in play" />
        <p className="mt-2 font-display text-xl font-semibold tracking-tight">
          {blender.pair.join(" + ")}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Not one profile — a blend of all three is scoring this run.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {blender.pair.map((p) => chip(p))}
          {blender.third ? (
            <>
              <span className="text-xs text-muted-foreground">blended with</span>
              <span className="rounded-full border border-brass px-2.5 py-1 text-xs font-semibold text-brass">
                {blender.third} · {blender.admix}%
              </span>
            </>
          ) : null}
          {blender.balance ? (
            <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
              balance mode
            </span>
          ) : null}
        </div>
        {blender.balance && (
          <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
            Bridge mode is stricter — scores may look lower because each strain
            must fit across all your profiles, not just one.
          </p>
        )}
      </div>
    );
  }

  if (merge && merge.names.length >= 2) {
    return (
      <div className={CARD}>
        <Head
          icon={<GitMerge className="h-3.5 w-3.5" />}
          label="Two merged profiles in play"
        />
        <p className="mt-2 font-display text-xl font-semibold tracking-tight">
          {merge.names.join(" + ")}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Both drive this run together, not one alone.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {merge.names.map((n) => chip(n))}
        </div>
      </div>
    );
  }

  return null;
}
