// Named strain families (deferred-improvements #14).
//
// Distinct from `sensoryFamily`: a user's mental "families" (Mint, OG, Chem,
// Haze, …) describe *buying behaviour* — what they seek out or skip — not how
// a strain smells. Crucially they don't map 1:1 to a sensory cluster: the
// Mint family spans funky-exotic / gas-og / gelato-exotic / dessert-cookies
// but every member carries the `mint` token. So a named family is matched by
// the UNION of: a sensoryFamily set, an aroma/flavour token, and a name
// pattern. The engine applies a small bounded modifier for these (see
// familyPreferenceContribution in taste-engine), never overriding sensory.

import type { StrainProfile } from "./types";
import { getIdentity } from "./strain-identity";

export interface NamedFamily {
  key: string;
  label: string;
  sensoryFamilies?: string[];
  tokens?: string[]; // aroma/flavour tokens
  name?: RegExp; // matched against the strain name + aliases
}

export const NAMED_FAMILIES: NamedFamily[] = [
  { key: "og", label: "OG", sensoryFamilies: ["gas-og"], name: /\bog\b/i },
  { key: "kush", label: "Kush", sensoryFamilies: ["kush-classic"], name: /\bkush\b/i },
  { key: "chem", label: "Chem", sensoryFamilies: ["diesel-chem"], name: /\bchem/i },
  { key: "diesel", label: "Diesel", sensoryFamilies: ["diesel-chem"], tokens: ["diesel"], name: /diesel/i },
  { key: "gas", label: "Gas", sensoryFamilies: ["gas-og"] },
  { key: "garlic-funk", label: "Garlic / Funk", sensoryFamilies: ["garlic-funk"], name: /garlic|gmo/i },
  { key: "cheese", label: "Cheese", tokens: ["cheese"], name: /cheese/i },
  { key: "mint", label: "Mint", tokens: ["mint"], name: /mint|menthol/i },
  { key: "haze", label: "Haze", sensoryFamilies: ["haze-sativa", "sweet-haze"], name: /haze/i },
  { key: "purple", label: "Purple", sensoryFamilies: ["purple-berry"], name: /purple|grape/i },
  {
    key: "dessert",
    label: "Dessert",
    sensoryFamilies: ["dessert-cookies", "gelato-exotic"],
    name: /cookie|cake|cream|gelato|sherb|pie|donut|biscotti/i,
  },
  {
    key: "fruit",
    label: "Fruit-forward",
    sensoryFamilies: ["tropical-fruit", "candy-exotic"],
    name: /runtz|zkittle|fruit|berr|guava|punch|tropical/i,
  },
];

const FAMILY_BY_KEY = new Map(NAMED_FAMILIES.map((f) => [f.key, f]));

export function isFamilyKey(key: unknown): key is string {
  return typeof key === "string" && FAMILY_BY_KEY.has(key);
}

// Does a strain belong to the named family `key`? Union of sensoryFamily,
// aroma/flavour token, and name/alias pattern.
export function familyMatches(strain: StrainProfile, key: string): boolean {
  const fam = FAMILY_BY_KEY.get(key);
  if (!fam) return false;

  if (fam.sensoryFamilies) {
    const sf = getIdentity(strain.name)?.sensoryFamily;
    if (sf && fam.sensoryFamilies.includes(sf)) return true;
  }
  if (fam.tokens && fam.tokens.some((t) => strain.aromas.includes(t) || strain.flavors.includes(t))) {
    return true;
  }
  if (fam.name) {
    if (fam.name.test(strain.name)) return true;
    if ((strain.aliases ?? []).some((a) => fam.name!.test(a))) return true;
  }
  return false;
}
