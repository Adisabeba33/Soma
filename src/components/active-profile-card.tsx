"use client";

import Link from "next/link";
import { Sunrise, Sun, Sunset, Moon, ArrowRight } from "lucide-react";
import { labelFor } from "@/lib/vocab";
import { TIME_LABEL } from "@/lib/time-of-day";
import type { TimeProfile } from "@/lib/types";

export const TIME_ICON: Record<TimeProfile, typeof Moon> = {
  morning: Sunrise,
  daytime: Sun,
  sunset: Sunset,
  night: Moon,
};

// A thin brass completeness ring — the engraved gauge from the Atelier study,
// on a light card.
function CompletionRing({ percent }: { percent: number }) {
  const deg = Math.max(0, Math.min(100, percent)) * 3.6;
  return (
    <div className="relative h-[4.75rem] w-[4.75rem] shrink-0">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(hsl(var(--brass)) ${deg}deg, hsl(var(--border)) ${deg}deg)`,
        }}
      />
      <div className="absolute inset-[5px] flex flex-col items-center justify-center rounded-full bg-card">
        <span className="font-display text-xl font-semibold leading-none">
          {percent}
        </span>
        <span className="mt-0.5 text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
          complete
        </span>
      </div>
    </div>
  );
}

function Note({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 text-[15px] text-foreground">
        {items.map(labelFor).join(" · ")}
      </p>
    </div>
  );
}

// The active-profile card on Taste Match — the "Sensory Atelier" light
// treatment: warm paper, brass completeness ring, refined serif name, Nose /
// Effect notes. Replaces the plain summary in the single-profile case; merge /
// blender runs use the RunBasisCard.
export function ActiveProfileCard({
  name,
  percent,
  aromas,
  effects,
  time,
}: {
  name: string;
  percent: number;
  aromas: string[];
  effects: string[];
  time: TimeProfile;
}) {
  const Icon = TIME_ICON[time];

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_24px_50px_-40px_rgba(80,64,40,0.45)] sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-brass">
            <Icon className="h-3.5 w-3.5" />
            {TIME_LABEL[time]} · your active profile
          </p>
          <p className="mt-2 truncate font-display text-2xl font-semibold tracking-tight">
            {name || "Your taste profile"}
          </p>
        </div>
        <CompletionRing percent={percent} />
      </div>

      {(aromas.length > 0 || effects.length > 0) && (
        <div className="mt-5 grid grid-cols-1 gap-5 border-t border-border pt-4 sm:grid-cols-2">
          <Note label="Nose" items={aromas} />
          <Note label="Effect" items={effects} />
        </div>
      )}

      <div className="mt-5 flex items-center gap-5 text-sm">
        <Link
          href="/account"
          className="inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:underline"
        >
          Switch profile <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/profile"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
