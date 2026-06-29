// Current time-of-day, mapped onto the SAME four moods as the strain artwork
// (morning / daytime / sunset / night). This lets the app chrome — the Taste
// Match hero, the active-profile card — share one vocabulary with the
// catalogue's time-of-day theming, so "tonight" reads with a night palette and
// a moon, "this morning" with a fresh dawn one. Pure: pass the hour so it's
// testable and the caller controls when it's read (client-side, to avoid an
// SSR/clock hydration mismatch).

import type { TimeProfile } from "./types";

export function timeProfileForHour(hour: number): TimeProfile {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "daytime";
  if (hour >= 17 && hour < 21) return "sunset";
  return "night"; // 21:00–04:59
}

// The word that finishes "What's on the menu ___?" for each mood.
export const TIME_HEADLINE: Record<TimeProfile, string> = {
  morning: "this morning",
  daytime: "today",
  sunset: "this evening",
  night: "tonight",
};

// A short atmospheric label for the active-profile card eyebrow.
export const TIME_LABEL: Record<TimeProfile, string> = {
  morning: "Morning",
  daytime: "Daytime",
  sunset: "Evening",
  night: "Night",
};
