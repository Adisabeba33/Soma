"use client";

import Link from "next/link";
import { Sunrise, Sun, Sunset, Moon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { paletteForTime } from "@/lib/sensory-family-palette";
import { TIME_LABEL } from "@/lib/time-of-day";
import type { TimeProfile } from "@/lib/types";

export const TIME_ICON: Record<TimeProfile, typeof Moon> = {
  morning: Sunrise,
  daytime: Sun,
  sunset: Sunset,
  night: Moon,
};

// The active-profile hero on Taste Match: a single card, themed by the current
// time of day (same four moods as the catalogue artwork), showing who's
// driving the run — name, sensory + effect chips, and how complete the profile
// is. Replaces the plain text summary in the single-profile case; merge /
// blender runs keep the RunBasisCard instead.
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
  const palette = paletteForTime(time);
  const Icon = TIME_ICON[time];
  const light = palette.contentTone === "light";

  // Tone helpers so text/chips stay legible on either a light (morning/day) or
  // dark (sunset/night) gradient.
  const muted = light ? "text-white/70" : "text-black/60";
  const chip = light
    ? "bg-white/15 text-white ring-1 ring-white/15"
    : "bg-black/10 text-black/80 ring-1 ring-black/10";

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 shadow-sm sm:p-6"
      style={{ background: palette.background, color: light ? "#fff" : "#11131f" }}
    >
      {/* Soft time-of-day glow in the corner — the placeholder "hero" motif. */}
      <Icon
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-15"
        strokeWidth={1}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em]",
              muted,
            )}
          >
            <Icon className="h-3.5 w-3.5" style={{ color: palette.accent }} />
            {TIME_LABEL[time]} · your active profile
          </p>
          <p className="mt-1.5 truncate font-display text-2xl font-semibold tracking-tight">
            {name || "Your taste profile"}
          </p>
        </div>

        {/* Completeness — how much of the sensory profile is filled in. */}
        <div
          className="flex shrink-0 flex-col items-center rounded-2xl px-3 py-2 text-center"
          style={{ background: light ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" }}
        >
          <span className="font-display text-xl font-bold leading-none">
            {percent}%
          </span>
          <span className={cn("mt-0.5 text-[9px] uppercase tracking-wide", muted)}>
            complete
          </span>
        </div>
      </div>

      {(aromas.length > 0 || effects.length > 0) && (
        <div className="relative mt-4 space-y-2">
          {aromas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {aromas.map((a) => (
                <span
                  key={`a-${a}`}
                  className={cn("rounded-full px-2.5 py-1 text-xs font-medium", chip)}
                >
                  {labelFor(a)}
                </span>
              ))}
            </div>
          )}
          {effects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {effects.map((e) => (
                <span
                  key={`e-${e}`}
                  className={cn("rounded-full px-2.5 py-1 text-xs", chip)}
                >
                  {labelFor(e)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="relative mt-4 flex items-center gap-4 text-sm font-medium">
        <Link
          href="/account"
          className="inline-flex items-center gap-0.5 underline-offset-4 hover:underline"
          style={{ color: palette.accent }}
        >
          Switch profile <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          href="/profile"
          className={cn("underline-offset-4 hover:underline", muted)}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
