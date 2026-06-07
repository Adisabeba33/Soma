import { buildRadar } from "@/lib/sensory-radar";
import type { StrainProfile } from "@/lib/types";

// Renders a strain's sensory radar — 6 effect axes, coloured by aroma.
// Pure function of the strain's tags (no photos, no network), safe to
// render server-side. Labels are off by default so it works as a small
// thumbnail; turn them on for larger, standalone use.
export function SensoryRadar({
  strain,
  size = 220,
  labels = false,
  className,
  title,
}: {
  strain: StrainProfile;
  size?: number;
  labels?: boolean;
  className?: string;
  title?: string;
}) {
  const s = buildRadar(strain, { size, labels });
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={title ?? `${strain.name} sensory radar`}
    >
      {s.ringPaths.map((d, i) => (
        <path
          key={`ring-${i}`}
          d={d}
          fill="none"
          stroke="#cdc4b4"
          strokeWidth={0.7}
          opacity={0.6}
        />
      ))}
      {s.spokes.map((sp, i) => (
        <line
          key={`spoke-${i}`}
          x1={sp.x1}
          y1={sp.y1}
          x2={sp.x2}
          y2={sp.y2}
          stroke="#cdc4b4"
          strokeWidth={0.7}
          opacity={0.5}
        />
      ))}
      <path d={s.polygon} fill={s.fill} stroke={s.stroke} strokeWidth={1.6} />
      {s.vertices.map((p, i) => (
        <circle key={`v-${i}`} cx={p.x} cy={p.y} r={2} fill={s.stroke} />
      ))}
      {s.axisLabels.map((l, i) => (
        <text
          key={`l-${i}`}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Georgia, serif"
          fontSize={size * 0.04}
          fill="#6b6356"
        >
          {l.label}
        </text>
      ))}
    </svg>
  );
}
