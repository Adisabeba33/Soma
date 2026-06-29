import {
  Apple,
  Candy,
  Cherry,
  Citrus,
  Flame,
  Flower2,
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
// SVGs below, so the emblem map can mix both. Accepts className/strokeWidth/
// style so the card can size and gold-tint the glyph.
export type EmblemIcon = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}>;

type SvgProps = { className?: string; strokeWidth?: number; style?: React.CSSProperties };

// Shared svg wrapper — 2px round strokes, per the spec sheet.
function Glyph({
  className,
  strokeWidth = 1.8,
  style,
  children,
}: SvgProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      {children}
    </svg>
  );
}

// Fuel flask with a pump hose — "Gas / Fuel bombs".
function FuelFlask(p: SvgProps) {
  return (
    <Glyph {...p}>
      {/* cap */}
      <path d="M9.2 3.4h3.6a1 1 0 0 1 1 1V6H8.2V4.4a1 1 0 0 1 1-1Z" />
      {/* body */}
      <path d="M7.6 6h6.8v13.4A1.6 1.6 0 0 1 12.8 21H9.2a1.6 1.6 0 0 1-1.6-1.6V6Z" />
      {/* label band */}
      <path d="M7.6 10.2h6.8" />
      {/* pump hose looping off the top-right */}
      <path d="M14.4 7.4c2 0 3.1 1 3.1 3v4.4a1.7 1.7 0 0 0 3.4 0v-2.6" />
    </Glyph>
  );
}

// Crescent moon with two sparkle-stars — "Evening knock-out" / sleepy.
function MoonStars(p: SvgProps) {
  return (
    <Glyph {...p}>
      <path d="M20 14.2A7.5 7.5 0 1 1 9.8 4.6 6 6 0 0 0 20 14.2Z" />
      <path d="M17.6 3 18.4 5.1 20.5 5.9 18.4 6.7 17.6 8.8 16.8 6.7 14.7 5.9 16.8 5.1z" />
      <path d="M14.2 8.4l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" opacity="0.85" />
    </Glyph>
  );
}

// Pineapple — spiky crown + diamond crosshatch body — "Sweet tropics".
function Pineapple(p: SvgProps) {
  return (
    <Glyph {...p}>
      {/* crown */}
      <path d="M12 7V3.2" />
      <path d="M12 6.2c-.9-1-1-2.4-.3-3.6.9.5 1.4 1.7 1 3" />
      <path d="M12 6.2c.9-1 1-2.4.3-3.6-.9.5-1.4 1.7-1 3" />
      <path d="M12 6.6c-1.2-.7-2.8-.6-4 .3 1 .9 2.6 1 3.7.3" />
      <path d="M12 6.6c1.2-.7 2.8-.6 4 .3-1 .9-2.6 1-3.7.3" />
      {/* body */}
      <path d="M12 7c3.1 0 5.3 2.7 5.3 6.5C17.3 18.6 15.1 22 12 22s-5.3-3.4-5.3-8.5C6.7 9.7 8.9 7 12 7Z" />
      {/* diamond crosshatch */}
      <path d="M8 11.2 12 14l4-2.8M8 14.8 12 17.6l4-2.8" opacity="0.6" />
      <path d="M12 8.6v12.8" opacity="0.45" />
    </Glyph>
  );
}

// Aroma → glyph map. One mapping per aroma token in vocab.ts (AROMAS), so a
// profile's dominant smell can stand in as its emblem on the account cards.
// Fallback (Sparkles) only fires for an unmapped/new token.
const AROMA_ICONS: Record<string, EmblemIcon> = {
  gassy: FuelFlask,
  diesel: FuelFlask,
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
