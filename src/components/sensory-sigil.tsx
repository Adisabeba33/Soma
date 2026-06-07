import { buildSigil } from "@/lib/sensory-sigil";
import type { StrainProfile } from "@/lib/types";

// Renders a strain's deterministic sensory sigil. Pure function of the
// strain's tags — no photos, no network, safe to render server-side.
export function SensorySigil({
  strain,
  size = 220,
  className,
  title,
}: {
  strain: StrainProfile;
  size?: number;
  className?: string;
  title?: string;
}) {
  const s = buildSigil(strain, size);
  const half = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={title ?? `${strain.name} sensory sigil`}
    >
      <defs>
        <radialGradient id={s.id} cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor={s.c2} />
          <stop offset="55%" stopColor={s.c0} />
          <stop offset="100%" stopColor={s.c1} />
        </radialGradient>
      </defs>
      <g transform={`rotate(${s.rotation} ${half} ${half})`}>
        <path d={s.outerPath} fill={s.c0} opacity={0.18} />
        <path d={s.outerPath} fill={`url(#${s.id})`} />
        <path d={s.innerPath} fill={s.c2} opacity={0.45} />
        {s.dots.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="#fff"
            opacity={d.opacity}
          />
        ))}
      </g>
    </svg>
  );
}
