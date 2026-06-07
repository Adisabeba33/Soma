// Sensory radar — a strain's mark as a 6-axis effect radar, coloured by its
// aroma. Built entirely from the strain's own tags: no photos, no invented
// numbers. The polygon shape comes from effect tags, the colour from aroma,
// a light potency scaling sets the overall reach. Fully deterministic — a
// pure function of the strain, so the same strain always renders the same
// radar. See src/components/sensory-radar.tsx for the React renderer.

import type { StrainProfile } from "./types";

// ---- aroma → hue (HSL) ---------------------------------------------

type Hsl = [number, number, number];

const AROMA_HUE: Record<string, Hsl> = {
  gassy: [210, 18, 52],
  diesel: [205, 22, 48],
  earthy: [28, 40, 42],
  woody: [24, 35, 40],
  skunky: [55, 45, 42],
  cheese: [48, 50, 48],
  citrus: [48, 80, 55],
  sweet: [330, 50, 64],
  creamy: [40, 42, 72],
  vanilla: [42, 40, 74],
  fruity: [18, 72, 58],
  berry: [280, 42, 52],
  grape: [285, 40, 50],
  tropical: [165, 52, 48],
  pine: [140, 42, 42],
  herbal: [110, 33, 46],
  spicy: [8, 62, 50],
  floral: [270, 42, 68],
  mint: [160, 46, 60],
  nutty: [30, 33, 52],
};

const DEFAULT_HUE: Hsl = [40, 25, 50];

const hslStr = (c: Hsl, alpha = 1) =>
  alpha < 1
    ? `hsl(${c[0]} ${c[1]}% ${c[2]}% / ${alpha})`
    : `hsl(${c[0]} ${c[1]}% ${c[2]}%)`;

function aromaColor(aromas: string[]): Hsl {
  for (const a of aromas) {
    const hit = AROMA_HUE[a];
    if (hit) return hit;
  }
  return DEFAULT_HUE;
}

// ---- the 6 axes (derived transparently from effect tags) -----------

export interface RadarAxis {
  label: string;
  tags: [string, number][];
}

export const RADAR_AXES: RadarAxis[] = [
  { label: "Relax", tags: [["relaxed", 1], ["calm", 0.7]] },
  { label: "Sleep", tags: [["sleepy", 1], ["couch-lock", 1], ["body-heavy", 0.7]] },
  { label: "Euphoria", tags: [["euphoric", 1], ["happy", 0.7], ["giggly", 0.7]] },
  { label: "Energy", tags: [["energetic", 1], ["uplifted", 0.8]] },
  { label: "Focus", tags: [["focused", 1], ["head-high", 0.6]] },
  { label: "Creative", tags: [["creative", 1]] },
];

const POTENCY: Record<string, number> = {
  mild: 0.6,
  moderate: 0.8,
  strong: 0.95,
  "very-strong": 1,
};

// A single axis value in [0,1]. Highest-weight matching tag wins, plus a
// small floor so the polygon never collapses, gently scaled by potency.
export function axisValue(strain: StrainProfile, axis: RadarAxis): number {
  let v = 0;
  for (const [tag, w] of axis.tags) {
    if (strain.effects.includes(tag)) v = Math.max(v, w);
  }
  const pot = POTENCY[strain.potency] ?? 0.8;
  return Math.min(1, 0.12 + v * pot);
}

// ---- public spec ---------------------------------------------------

export interface Point {
  x: number;
  y: number;
}

export interface RadarSpec {
  size: number;
  center: Point;
  radius: number;
  ringPaths: string[];
  spokes: { x1: number; y1: number; x2: number; y2: number }[];
  polygon: string;
  vertices: Point[];
  axisLabels: { x: number; y: number; label: string }[];
  stroke: string;
  fill: string;
  values: number[];
}

export interface RadarOptions {
  size?: number;
  labels?: boolean;
}

export function buildRadar(
  strain: StrainProfile,
  opts: RadarOptions = {},
): RadarSpec {
  const size = opts.size ?? 220;
  const labels = opts.labels ?? false;
  const cx = size / 2;
  const cy = size / 2;
  // Leave room for labels when shown.
  const radius = size * (labels ? 0.32 : 0.4);
  const n = RADAR_AXES.length;
  const color = aromaColor(strain.aromas);

  const at = (i: number, r: number): Point => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  };
  const poly = (r: number) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const p = at(i, r);
      d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1);
    }
    return d + "Z";
  };

  const ringPaths = [0.33, 0.66, 1].map((f) => poly(radius * f));
  const spokes = Array.from({ length: n }, (_, i) => {
    const p = at(i, radius);
    return { x1: cx, y1: cy, x2: p.x, y2: p.y };
  });

  const values = RADAR_AXES.map((ax) => axisValue(strain, ax));
  const vertices = values.map((v, i) => at(i, radius * v));
  let polygon = "";
  vertices.forEach((p, i) => {
    polygon += (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1);
  });
  polygon += "Z";

  const axisLabels = labels
    ? RADAR_AXES.map((ax, i) => {
        const p = at(i, radius + size * 0.07);
        return { x: p.x, y: p.y, label: ax.label };
      })
    : [];

  return {
    size,
    center: { x: cx, y: cy },
    radius,
    ringPaths,
    spokes,
    polygon,
    vertices,
    axisLabels,
    stroke: hslStr(color),
    fill: hslStr(color, 0.3),
    values,
  };
}

// Serialize to a standalone SVG string (preview / server / testing).
export function radarToSvg(strain: StrainProfile, opts: RadarOptions = {}): string {
  const s = buildRadar(strain, opts);
  const grid = [
    ...s.ringPaths.map(
      (d) =>
        `<path d="${d}" fill="none" stroke="#cdc4b4" stroke-width="0.7" opacity="0.6"/>`,
    ),
    ...s.spokes.map(
      (sp) =>
        `<line x1="${sp.x1}" y1="${sp.y1}" x2="${sp.x2.toFixed(1)}" y2="${sp.y2.toFixed(1)}" stroke="#cdc4b4" stroke-width="0.7" opacity="0.5"/>`,
    ),
  ].join("");
  const dots = s.vertices
    .map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2" fill="${s.stroke}"/>`)
    .join("");
  const labels = s.axisLabels
    .map(
      (l) =>
        `<text x="${l.x.toFixed(1)}" y="${l.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,serif" font-size="9" fill="#6b6356">${l.label}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s.size}" height="${s.size}" viewBox="0 0 ${s.size} ${s.size}">${grid}<path d="${s.polygon}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="1.6"/>${dots}${labels}</svg>`;
}
