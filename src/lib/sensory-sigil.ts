// Sensory sigil — a deterministic generative mark for a strain, built
// entirely from its own sensory tags. No photos, no invented data: the
// palette comes from the strain's aromas, the silhouette from its effect
// texture, the size from its effects, and a per-name seed makes every
// strain unique while staying stable (the same strain always renders the
// same mark). See src/components/sensory-sigil.tsx for the React renderer.

import { effectTextureOf } from "./effect-texture";
import type { StrainProfile } from "./types";

// ---- deterministic PRNG seeded by name -----------------------------

function hashName(s: string): number {
  let h = 2166136261;
  for (const ch of s) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- aroma → hue (HSL triplets) ------------------------------------

type Hsl = [number, number, number];

const AROMA_HUE: Record<string, Hsl> = {
  gassy: [210, 18, 52],
  diesel: [205, 22, 48],
  earthy: [28, 40, 42],
  woody: [24, 35, 40],
  skunky: [55, 45, 42],
  cheese: [48, 50, 48],
  citrus: [48, 85, 58],
  sweet: [330, 55, 68],
  creamy: [40, 45, 80],
  vanilla: [42, 40, 82],
  fruity: [18, 80, 62],
  berry: [280, 45, 55],
  grape: [285, 40, 50],
  tropical: [165, 55, 52],
  pine: [140, 45, 45],
  herbal: [110, 35, 48],
  spicy: [8, 65, 52],
  floral: [270, 45, 72],
  mint: [160, 50, 66],
  nutty: [30, 35, 55],
};

const DEFAULT_PALETTE: Hsl[] = [
  [40, 15, 60],
  [30, 20, 45],
];

const hsl = (c: Hsl) => `hsl(${Math.round(c[0])} ${Math.round(c[1])}% ${Math.round(c[2])}%)`;

function paletteFor(aromas: string[]): Hsl[] {
  const hits = aromas
    .map((a) => AROMA_HUE[a])
    .filter((c): c is Hsl => Boolean(c));
  return hits.length > 0 ? hits.slice(0, 3) : DEFAULT_PALETTE;
}

// ---- effect texture → silhouette character -------------------------

interface ShapeParams {
  spike: number;
  freq: number;
}

function shapeParams(texture: string): ShapeParams {
  switch (texture) {
    case "electric":
    case "sharp":
      return { spike: 0.34, freq: 11 };
    case "chaotic":
      return { spike: 0.3, freq: 9 };
    case "lucid":
      return { spike: 0.16, freq: 7 };
    case "floaty":
      return { spike: 0.12, freq: 5 };
    case "smooth":
      return { spike: 0.07, freq: 6 };
    case "dreamy":
      return { spike: 0.06, freq: 5 };
    case "grounded":
      return { spike: 0.1, freq: 8 };
    case "pressure-heavy":
      return { spike: 0.13, freq: 8 };
    default:
      return { spike: 0.12, freq: 6 };
  }
}

function blobPath(
  cx: number,
  cy: number,
  base: number,
  p: ShapeParams,
  rnd: () => number,
): string {
  const N = 160;
  const ph = rnd() * Math.PI * 2;
  const ph2 = rnd() * Math.PI * 2;
  const j = Array.from({ length: 4 }, () => rnd() * 0.5 + 0.75);
  let d = "";
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r =
      base *
      (1 +
        0.12 * Math.sin(a * 3 + ph) * j[0] +
        0.08 * Math.sin(a * 5 + ph2) * j[1] +
        p.spike * Math.sin(a * p.freq + ph) * j[2] +
        0.05 * Math.cos(a * 2 + ph2) * j[3]);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : `L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + "Z";
}

// ---- public spec ---------------------------------------------------

export interface SigilDot {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

export interface SigilSpec {
  size: number;
  rotation: number;
  outerPath: string;
  innerPath: string;
  dots: SigilDot[];
  c0: string;
  c1: string;
  c2: string;
  // Stable id fragment so an SVG <defs> gradient never collides on a page.
  id: string;
}

const ENERGETIC = ["energetic", "uplifted", "focused", "creative", "head-high"];
const HEAVY = ["body-heavy", "couch-lock", "sleepy"];

export function buildSigil(strain: StrainProfile, size = 220): SigilSpec {
  const seed = hashName(strain.name);
  const rnd = mulberry32(seed);
  const pal = paletteFor(strain.aromas);
  const sp = shapeParams(effectTextureOf(strain));

  const cx = size / 2;
  const cy = size / 2;
  const energetic = strain.effects.some((e) => ENERGETIC.includes(e));
  const heavy = strain.effects.some((e) => HEAVY.includes(e));
  // Base radius as a fraction of the canvas; heavy strains read bigger.
  const baseFrac = heavy ? 0.33 : energetic ? 0.29 : 0.31;
  const base = size * baseFrac;

  const rotation = rnd() * 360;

  const frosty = strain.traits.some((t) =>
    ["frosty", "sticky", "terpy", "dense-buds"].includes(t),
  );
  const dots: SigilDot[] = [];
  if (frosty) {
    for (let i = 0; i < 70; i++) {
      const a = rnd() * Math.PI * 2;
      const rr = Math.sqrt(rnd()) * base * 0.92;
      dots.push({
        cx: cx + Math.cos(a) * rr,
        cy: cy + Math.sin(a) * rr,
        r: rnd() * 1.1 + 0.4,
        opacity: rnd() * 0.35 + 0.12,
      });
    }
  }

  const outerPath = blobPath(cx, cy, base, sp, rnd);
  const innerPath = blobPath(
    cx,
    cy,
    base * 0.62,
    { spike: sp.spike * 0.6, freq: sp.freq },
    mulberry32(seed ^ 0x9e3779b9),
  );

  return {
    size,
    rotation,
    outerPath,
    innerPath,
    dots,
    c0: hsl(pal[0]),
    c1: hsl(pal[1] ?? pal[0]),
    c2: hsl(pal[2] ?? pal[1] ?? pal[0]),
    id: `sig${seed.toString(36)}`,
  };
}

// Serialize a spec to a standalone SVG string (server/preview/testing).
export function sigilToSvg(strain: StrainProfile, size = 220): string {
  const s = buildSigil(strain, size);
  const dots = s.dots
    .map(
      (d) =>
        `<circle cx="${d.cx.toFixed(1)}" cy="${d.cy.toFixed(1)}" r="${d.r.toFixed(1)}" fill="#fff" opacity="${d.opacity.toFixed(2)}"/>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="${s.id}" cx="42%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${s.c2}"/>
      <stop offset="55%" stop-color="${s.c0}"/>
      <stop offset="100%" stop-color="${s.c1}"/>
    </radialGradient>
  </defs>
  <g transform="rotate(${s.rotation.toFixed(1)} ${s.size / 2} ${s.size / 2})">
    <path d="${s.outerPath}" fill="${s.c0}" opacity="0.18"/>
    <path d="${s.outerPath}" fill="url(#${s.id})"/>
    <path d="${s.innerPath}" fill="${s.c2}" opacity="0.45"/>
    ${dots}
  </g>
</svg>`;
}
