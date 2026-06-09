import {
  Anchor,
  Cloud,
  Cookie,
  Lightbulb,
  Moon,
  Smile,
  Sparkles,
  Sun,
  Target,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Effect → glyph map. Kept tight on purpose — every effect token in
// vocab.ts has exactly one mapping. New effects added to vocab MUST
// extend this map or the fallback (Sparkles) silently takes over.
// Picks lean visual-metaphorical: relaxed → cloud, sleepy → moon,
// energetic → zap, hungry → cookie, etc.
const EFFECT_ICONS: Record<string, LucideIcon> = {
  relaxed: Cloud,
  calm: Cloud,
  sleepy: Moon,
  "body-heavy": Anchor,
  "couch-lock": Anchor,
  euphoric: Sparkles,
  happy: Smile,
  uplifted: Sun,
  giggly: Smile,
  focused: Target,
  creative: Lightbulb,
  energetic: Zap,
  hungry: Cookie,
  "head-high": Wind,
};

export function effectIconFor(effect: string): LucideIcon {
  return EFFECT_ICONS[effect] ?? Sparkles;
}
