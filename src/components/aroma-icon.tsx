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
  Palmtree,
  Sparkles,
  Sprout,
  TreeDeciduous,
  TreePine,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { effectIconFor } from "./effect-icon";

// Aroma → glyph map. One mapping per aroma token in vocab.ts (AROMAS), so a
// profile's dominant smell can stand in as its emblem on the account cards —
// the way "Gas/Fuel bombs" reads as a fuel can and "Sweet tropics" as a palm.
// Picks lean literal: gas → fuel, citrus → citrus, tropical → palm, etc.
// Fallback (Sparkles) only fires for an unmapped/new token.
const AROMA_ICONS: Record<string, LucideIcon> = {
  gassy: Fuel,
  diesel: Fuel,
  earthy: Sprout,
  pine: TreePine,
  citrus: Citrus,
  sweet: Candy,
  fruity: Apple,
  berry: Cherry,
  tropical: Palmtree,
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

export function aromaIconFor(aroma: string): LucideIcon {
  return AROMA_ICONS[aroma] ?? Sparkles;
}

// A profile's emblem: led by its dominant aroma, falling back to its dominant
// effect's glyph (so an effect-led profile like "Evening knock-out" still gets
// a fitting mark), then Sparkles as a last resort.
export function profileEmblem(
  topAromas: string[],
  topEffects: string[],
): LucideIcon {
  if (topAromas[0] && AROMA_ICONS[topAromas[0]]) return AROMA_ICONS[topAromas[0]];
  if (topEffects[0]) return effectIconFor(topEffects[0]);
  return Sparkles;
}
