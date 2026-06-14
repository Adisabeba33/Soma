import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Render a match score for display. Whole numbers stay clean ("86"), while
// elite-band scores keep their two-decimal precision ("91.63") so the order
// among the leaders — who used to all flatten onto 88 — stays visible.
export function formatScore(score: number): string {
  return Number.isInteger(score) ? `${score}` : score.toFixed(2);
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
