// Client-safe lookup for "is this strain in our seed catalog?"
//
// Uses the same findStrain() resolution path the engine uses on the
// server, so the UI's visual indicator stays in sync with what the
// engine will treat as known vs inferred at scoring time. If we ever
// change canonical/alias resolution, both surfaces update from the
// same source.

import { findStrain } from "./strain-data";

export function isKnownStrain(rawName: string): boolean {
  const trimmed = rawName.trim();
  if (!trimmed) return false;
  return findStrain(trimmed) !== null;
}

// Returns the canonical strain name when the input resolves (possibly
// through an alias), or null when it doesn't. Useful for showing
// "Matched to <canonical>" hints in the UI.
export function resolveCanonical(rawName: string): string | null {
  const trimmed = rawName.trim();
  if (!trimmed) return null;
  const match = findStrain(trimmed);
  return match ? match.name : null;
}
