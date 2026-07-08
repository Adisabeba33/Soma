import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Render a match score for display — always a whole number. The engine keeps
// two-decimal precision internally (elite band, unclampedScore) and uses it
// for ORDERING, but showing "91.63" implies a resolution the underlying data
// can't support (hand-tuned label matching, not measurement). The order among
// the leaders survives via sort + the "#2 of 6" tie pill; Audit mode still
// shows the precise values.
export function formatScore(score: number): string {
  return `${Math.round(score)}`;
}

export function titleCase(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
