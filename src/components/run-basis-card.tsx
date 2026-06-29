"use client";

import Link from "next/link";
import { Blend, GitMerge, ArrowRight } from "lucide-react";

// What's actually driving this Taste Match run — the "Sensory Atelier" light
// treatment. Replaces the single-profile card whenever a merge or the Taste
// Blender is on. The Blender is SŌMA's signature, so it gets a premium
// "technology card" look (glass, deeper shadow, brass sheen); the plain merge
// stays quieter.
//   • blender — a merged pair + a third blended in (the virtual 4th profile)
//   • merge   — two profiles scored together (no Blender)
//   • single  — handled by the caller (the ActiveProfileCard)

function chip(text: string) {
  return (
    <span
      key={text}
      className="rounded-full bg-brass/10 px-3 py-1 text-xs font-medium text-brass"
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
      <div className="soma-lift relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-gradient-to-br from-card via-card to-[hsl(34_36%_46%/0.06)] p-7 shadow-[0_34px_80px_-40px_rgba(60,45,20,0.5)] backdrop-blur-sm hover:shadow-[0_40px_90px_-38px_rgba(60,45,20,0.62)] sm:p-8">
        {/* brass sheen — the "secret sauce" glow */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, hsl(34 36% 46% / 0.18), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-3">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-brass">
            <Blend className="h-4 w-4" />
            Taste Blender in play
          </p>
          <Link
            href="/account"
            className="soma-ease inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent underline-offset-4 transition-colors hover:underline"
          >
            Manage <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <p className="relative mt-3 font-display text-2xl font-semibold leading-tight tracking-tight">
          {blender.pair.join(" + ")}
        </p>
        <p className="relative mt-1.5 text-sm text-muted-foreground">
          Not one profile — a blend of{" "}
          {blender.third ? "all three" : "the pair"} is scoring this run.
        </p>

        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          {blender.pair.map((p) => chip(p))}
          {blender.third ? (
            <>
              <span className="text-xs text-muted-foreground">blended with</span>
              <span className="rounded-full border border-brass/70 px-3 py-1 text-xs font-semibold text-brass">
                {blender.third} · {blender.admix}%
              </span>
            </>
          ) : null}
          {blender.balance ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              balance mode
            </span>
          ) : null}
        </div>

        {blender.balance && (
          <p className="relative mt-5 border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground">
            Bridge mode is stricter — scores may look lower because each strain
            must fit across all your profiles, not just one.
          </p>
        )}
      </div>
    );
  }

  if (merge && merge.names.length >= 2) {
    return (
      <div className="soma-lift rounded-[1.75rem] border border-border/70 bg-card p-7 shadow-[0_28px_60px_-42px_rgba(60,45,20,0.45)] hover:shadow-[0_34px_70px_-40px_rgba(60,45,20,0.55)] sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-brass">
            <GitMerge className="h-4 w-4" />
            Two merged profiles in play
          </p>
          <Link
            href="/account"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Manage <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight">
          {merge.names.join(" + ")}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Both drive this run together, not one alone.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {merge.names.map((n) => chip(n))}
        </div>
      </div>
    );
  }

  return null;
}
