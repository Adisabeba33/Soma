import { cn } from "@/lib/utils";

// The one progress/score dial in SŌMA. Antique-gold arc on a hairline
// track, matte centre, number in the display face. Used for profile
// completeness (Home, Account, profiles) and any other 0–100 read — the
// value is always passed in from real data, never decorative.
//
// Sizes are free-form; stroke and type scale with the diameter so a 44px
// inline dial and an 80px hero dial read as the same object.
export function ScoreRing({
  value,
  size = 76,
  label,
  className,
  showSuffix = true,
}: {
  value: number;
  size?: number;
  /** Accessible name, e.g. "Profile completeness". */
  label?: string;
  className?: string;
  /** The small "%" under the number. Off for compact dials. */
  showSuffix?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = Math.max(4, Math.round(size * 0.075));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ? `${label}: ${pct}%` : `${pct}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--brass))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-[600ms] ease-out motion-reduce:transition-none"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-baseline justify-center font-display font-semibold leading-none tabular-nums text-foreground"
        style={{ fontSize: Math.round(size * 0.3), paddingTop: size * 0.34 }}
      >
        {pct}
        {showSuffix && (
          <span className="text-[0.62em] font-medium text-muted-foreground">
            %
          </span>
        )}
      </span>
    </div>
  );
}
