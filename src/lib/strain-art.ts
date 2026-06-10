// Strain artwork layer — derives a time-of-day mood for every strain and
// resolves the (optional) generated image for it. See docs/strain-artwork.md.
//
// Design notes:
//  - Time-of-day is a PURE FUNCTION of the existing behavioural family
//    (behavioralFamilyOf), so the entire catalogue gets a sensible mood with
//    zero curation. A curator only sets identity.timeProfile to override a
//    specific strain (e.g. Super Lemon Haze → "morning" instead of the
//    derived "daytime").
//  - Image filenames mirror the URL slug (GG4 → gg4.webp), so artwork drops
//    into /public/strains/<slug>.webp with no extra wiring.
//  - The image only renders once artStatus is "published"; until then the
//    card shows the time-of-day gradient (see paletteForTime).

import { behavioralFamilyOf } from "./behavioral-family";
import { strainSlug } from "./catalog";
import type { StrainProfile, TimeProfile, ArtStatus } from "./types";
import type { StrainIdentity } from "./strain-identity";

export const TIME_PROFILES: readonly TimeProfile[] = [
  "morning",
  "daytime",
  "sunset",
  "night",
] as const;

// Behavioural family → time-of-day. The family already encodes the
// experiential universe a strain lives in, which maps naturally onto the
// arc of a day: functional/edgy energy in the first half, exotic/quiet
// wind-down toward dusk, heavy indica at night.
//
// When the family is null (composition doesn't resolve to a clear universe)
// we fall back on the strain TYPE so every strain still gets a mood:
// sativa → daytime, indica → night, hybrid → sunset. Never throws.
export function deriveTimeProfile(strain: StrainProfile): TimeProfile {
  switch (behavioralFamilyOf(strain)) {
    case "nighttime-indica":
      return "night";
    case "contemplative-quiet":
    case "exotic-modern-hybrid":
      return "sunset";
    case "daytime-functional":
      return "daytime";
    case "edgy-stimulant":
      return "morning";
    default:
      break; // null — no clear family; fall back on the strain type
  }
  switch (strain.type) {
    case "indica":
      return "night";
    case "sativa":
      return "daytime";
    case "hybrid":
      return "sunset";
  }
}

// Effective time-of-day for a strain: curator override wins, otherwise derived.
export function timeProfileOf(
  strain: StrainProfile,
  identity?: StrainIdentity | null,
): TimeProfile {
  return identity?.timeProfile ?? deriveTimeProfile(strain);
}

// Image filename for a strain: override wins, otherwise `${slug}.webp`.
export function artFileNameOf(
  strain: StrainProfile,
  identity?: StrainIdentity | null,
): string {
  return identity?.artFileName ?? `${strainSlug(strain.name)}.webp`;
}

export function artStatusOf(identity?: StrainIdentity | null): ArtStatus {
  return identity?.artStatus ?? "none";
}

export function artVersionOf(identity?: StrainIdentity | null): number {
  return identity?.artVersion ?? 1;
}

// Public URL of the strain's image, or null when no published art exists.
// Served from /public/strains/, so a published "gg4.webp" resolves to
// "/strains/gg4.webp".
export function artImageSrc(
  strain: StrainProfile,
  identity?: StrainIdentity | null,
): string | null {
  if (artStatusOf(identity) !== "published") return null;
  return `/strains/${artFileNameOf(strain, identity)}`;
}

// Short mood brief per time-of-day, fed into the generation prompt.
const MOOD_BRIEF: Record<TimeProfile, string> = {
  morning:
    "soft early-morning light, fresh and airy, pale gold and dewy green, crisp and awakening",
  daytime:
    "bright midday energy, vivid and social, clear open light, lively and active",
  sunset:
    "warm golden-hour glow fading into amber and rose dusk, relaxed and flavourful",
  night:
    "deep nocturnal mood, heavy and sedative, indigo and near-black, still and weighted",
};

// Build a default image-generation prompt for a strain. The hard constraints
// (no text/logos/names/people/products/cannabis leaves; vertical 3:4) are
// always present so generated art stays a pure atmospheric backdrop the UI
// can overlay the name and data onto. Curators can store a hand-tuned
// override in identity.artPrompt when the default misses the strain.
export function buildArtPrompt(
  strain: StrainProfile,
  identity?: StrainIdentity | null,
): string {
  const tp = timeProfileOf(strain, identity);
  const family = identity?.sensoryFamily
    ? `the ${identity.sensoryFamily} sensory territory`
    : "its sensory character";
  const aromas = strain.aromas.slice(0, 4).join(", ");
  return [
    "Atmospheric vertical 3:4 poster artwork (768x1024) evoking the full sensory experience of a cannabis strain.",
    `Mood: ${MOOD_BRIEF[tp]}.`,
    `Evoke ${family}${aromas ? ` — notes of ${aromas}` : ""}, expressed only through colour, light, texture and abstract form.`,
    "Absolutely no text, no letters, no numbers, no logos, no watermark, no strain name.",
    "No people, no products, no packaging, no cannabis leaves or buds, no smoke clichés.",
    "Painterly, evocative, premium editorial feel. Keep the lower third visually calm so the interface can overlay the name and data legibly.",
  ].join(" ");
}
