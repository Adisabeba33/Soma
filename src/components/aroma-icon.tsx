import {
  Apple,
  Candy,
  Cherry,
  Citrus,
  Flame,
  Flower2,
  Fuel,
  Grape,
  IceCream,
  Leaf,
  Milk,
  Sparkles,
  Sprout,
  TreeDeciduous,
  TreePine,
  Wind,
} from "lucide-react";
import { effectIconFor } from "./effect-icon";

// A minimal icon shape — lucide icons satisfy it, and so do the hand-drawn
// SVGs below, so the emblem map can mix both.
export type EmblemIcon = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

// Hand-drawn pineapple — lucide has no fruit that reads "tropical", and a palm
// tree looked off, so this matches the reference's emblem more closely.
function Pineapple({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* leafy crown */}
      <path d="M12 7c0-2 1-3.8 2.8-4.6C14.4 4.2 14 5.6 14 7" />
      <path d="M12 7c0-2-1-3.8-2.8-4.6C9.6 4.2 10 5.6 10 7" />
      <path d="M12 6.6c1-1.4 2.6-2 4.2-1.8C15.6 6.2 14.1 7 12.6 7" />
      <path d="M12 6.6c-1-1.4-2.6-2-4.2-1.8C8.4 6.2 9.9 7 11.4 7" />
      {/* body */}
      <path d="M12 7c3.2 0 5.4 2.7 5.4 6.6C17.4 18.7 15.2 22 12 22s-5.4-3.3-5.4-8.4C6.6 9.7 8.8 7 12 7Z" />
      {/* crosshatch texture */}
      <path d="M8.6 11.4 12 13.8l3.4-2.4M8.6 15.2 12 17.6l3.4-2.4" opacity="0.55" />
    </svg>
  );
}

// Crescent moon with two small sparkle-stars — for evening / sleepy profiles.
function MoonStars({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 14.2A7.5 7.5 0 1 1 9.8 4.6 6 6 0 0 0 20 14.2Z" />
      <path d="M17.5 3.2 18.2 5l1.8.7-1.8.7-.7 1.8-.7-1.8L15 5.7 16.8 5z" />
      <path d="M14 8.2l.4 1.1 1.1.4-1.1.4-.4 1.1-.4-1.1-1.1-.4 1.1-.4z" opacity="0.85" />
    </svg>
  );
}

// Aroma → glyph map. One mapping per aroma token in vocab.ts (AROMAS), so a
// profile's dominant smell can stand in as its emblem on the account cards —
// the way "Gas/Fuel bombs" reads as a fuel can and "Sweet tropics" as a
// pineapple. Fallback (Sparkles) only fires for an unmapped/new token.
const AROMA_ICONS: Record<string, EmblemIcon> = {
  gassy: Fuel,
  diesel: Fuel,
  earthy: Sprout,
  pine: TreePine,
  citrus: Citrus,
  sweet: Candy,
  fruity: Apple,
  berry: Cherry,
  tropical: Pineapple,
  floral: Flower2,
  herbal: Leaf,
  spicy: Flame,
  woody: TreeDeciduous,
  skunky: Wind,
  cheese: Milk,
  creamy: IceCream,
  vanilla: IceCream,
  mint: Leaf,
  grape: Grape,
};

export function aromaIconFor(aroma: string): EmblemIcon {
  return AROMA_ICONS[aroma] ?? Sparkles;
}

// A profile's emblem: led by its dominant aroma, falling back to its dominant
// effect's glyph (so an effect-led profile like "Evening knock-out" still gets
// a fitting mark), then Sparkles as a last resort. An "evening" / sleepy lean
// resolves to the moon-and-stars.
export function profileEmblem(
  topAromas: string[],
  topEffects: string[],
): EmblemIcon {
  if (topAromas[0] && AROMA_ICONS[topAromas[0]]) return AROMA_ICONS[topAromas[0]];
  if (topEffects.some((e) => e === "sleepy")) return MoonStars;
  if (topEffects[0]) return effectIconFor(topEffects[0]) as EmblemIcon;
  return Sparkles;
}
