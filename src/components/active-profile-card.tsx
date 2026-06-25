"use client";

import Link from "next/link";
import { Sunrise, Sun, Sunset, Moon, Leaf, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { TIME_LABEL } from "@/lib/time-of-day";
import type { TimeProfile } from "@/lib/types";

export const TIME_ICON: Record<TimeProfile, typeof Moon> = {
  morning: Sunrise,
  daytime: Sun,
  sunset: Sunset,
  night: Moon,
};

// Brand-dark surface for the "who's driving this run" cards (active profile +
// blend). Warm charcoal-olive with brass/gold accents — matches the brand
// (cream bg, dark-green accent, brass), NOT the saturated catalogue palettes.
export const DARK_CARD =
  "linear-gradient(155deg, hsl(120 12% 15%) 0%, hsl(120 14% 9%) 100%)";
export const GOLD = "#c99a4e";

// A thin brass progress ring around the completeness number — the gold circle
// from the mockup. Pure CSS (conic-gradient), no SVG.
function CompletionRing({ percent }: { percent: number }) {
  const deg = Math.max(0, Math.min(100, percent)) * 3.6;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${GOLD} ${deg}deg, rgba(255,255,255,0.12) ${deg}deg)`,
        }}
      />
      <div
        className="absolute inset-[3px] rounded-full"
        style={{ background: "hsl(120 14% 10%)" }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-base font-bold leading-none text-white">
          {percent}%
        </span>
        <span className="mt-0.5 text-[7px] uppercase tracking-[0.12em] text-white/55">
          complete
        </span>
      </div>
    </div>
  );
}

// The active-profile hero on Taste Match: who's driving the run — name,
// sensory + effect chips, completeness ring — themed by the time of day (the
// icon only; the surface stays brand-dark). Replaces the plain text summary in
// the single-profile case; merge / blender runs use the RunBasisCard instead.
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
    <div
      className="relative overflow-hidden rounded-3xl p-5 text-white shadow-md sm:p-6"
      style={{ background: DARK_CARD }}
    >
      {/* faint time-of-day glow in the corner */}
      <Icon
        className="pointer-events-none absolute -right-7 -top-7 h-36 w-36 opacity-[0.07]"
        strokeWidth={1}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: GOLD }}
          >
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
        <div className="relative mt-4 space-y-2">
          {aromas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {aromas.map((a) => (
                <span
                  key={`a-${a}`}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    background: "rgba(201,154,78,0.16)",
                    color: "#e7cfa0",
                  }}
                >
                  <Leaf className="h-3 w-3" style={{ color: GOLD }} />
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
                  className="rounded-full px-2.5 py-1 text-xs text-white/75 ring-1 ring-white/15"
                >
                  {labelFor(e)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="relative mt-5 flex items-center gap-4 border-t border-white/10 pt-3.5 text-sm font-medium">
        <Link
          href="/account"
          className="inline-flex items-center gap-0.5 underline-offset-4 hover:underline"
          style={{ color: GOLD }}
        >
          Switch profile <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          href="/profile"
          className="text-white/55 underline-offset-4 hover:text-white/80 hover:underline"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
