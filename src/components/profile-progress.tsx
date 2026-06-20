// Visual readout of profile completeness — a brass ring with the percent in
// the middle, plus an optional "what's missing" list. Pure presentational;
// the percent/missing come from src/lib/profile-completeness.ts. Used on the
// profile page and the onboarding read-back.
import { cn } from "@/lib/utils";
import type { CompletenessItem } from "@/lib/profile-completeness";

export function ProfileProgressRing({
  percent,
  size = 72,
  className,
}: {
  percent: number;
  size?: number;
  className?: string;
}) {
  const stroke = size >= 64 ? 6 : 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, percent));
  const offset = circ * (1 - pct / 100);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-700 ease-out",
            pct >= 100 ? "text-accent" : "text-brass",
          )}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-semibold tabular-nums">
        {pct}%
      </span>
    </div>
  );
}

// The ordered list of high-value fields the profile is still missing — each a
// gentle prompt to finish. Hidden entirely when nothing is missing.
export function ProfileMissingList({
  missing,
  className,
}: {
  missing: CompletenessItem[];
  className?: string;
}) {
  if (missing.length === 0) return null;
  return (
    <ul className={cn("space-y-1.5 text-sm text-muted-foreground", className)}>
      {missing.map((m) => (
        <li key={m.key} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass/50" />
          {m.label}
        </li>
      ))}
    </ul>
  );
}
