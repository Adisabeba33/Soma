// Profile completeness, drawn by the one ring component the app has
// (src/components/ui/score-ring.tsx). This wrapper stays because several
// screens already speak in terms of "profile progress"; the visual itself
// is shared with Home and Account so the dial is identical everywhere.
import { ScoreRing } from "@/components/ui/score-ring";
import type { CompletenessItem } from "@/lib/profile-completeness";
import { cn } from "@/lib/utils";

export function ProfileProgressRing({
  percent,
  size = 72,
  className,
}: {
  percent: number;
  size?: number;
  className?: string;
}) {
  return (
    <ScoreRing
      value={percent}
      size={size}
      label="Profile completeness"
      className={className}
    />
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
