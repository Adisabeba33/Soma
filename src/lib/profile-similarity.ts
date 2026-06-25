// Profile similarity — how alike are two taste profiles, 0…100%.
//
// Purpose: warn before merging near-duplicate profiles. If two profiles are
// ~90%+ alike (differ by a tag or two), merging/blending them adds nothing —
// the engine already treats them as one taste. This is a pure tag comparison
// (set overlap + single-value matches), deterministic, no engine needed.
//
// Note: this is the RIGHT use of tag comparison. It's useless for finding
// "bridges" across distinct worlds (their tags barely overlap), but perfect
// for "are these two profiles basically the same?".

type ProfileLike = {
  favoriteStrains?: string[];
  preferredAromas?: string[];
  preferredFlavors?: string[];
  preferredEffects?: string[];
  dislikedEffects?: string[];
  dislikedAromas?: string[];
  likedTraits?: string[];
  primaryAroma?: string | null;
  primaryEffect?: string | null;
  useTime?: string | null;
  potencyPreference?: string | null;
  preferredType?: string | null;
  bodyFeel?: number | null;
};

export type ProfileSimilarity = {
  percent: number; // 0…100 overall
  dims: Array<{ label: string; percent: number }>; // per compared dimension
  // The dimensions where they differ most — for "differ mainly on: …".
  differOn: string[];
};

// Jaccard overlap of two tag sets. null when BOTH are empty (nothing to
// compare — that dimension simply doesn't count).
function jaccard(a: string[] = [], b: string[] = []): number | null {
  const A = new Set(a.map((x) => x.toLowerCase()));
  const B = new Set(b.map((x) => x.toLowerCase()));
  if (A.size === 0 && B.size === 0) return null;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  const union = A.size + B.size - inter;
  return union === 0 ? null : inter / union;
}

function single(a?: string | null, b?: string | null): number | null {
  const x = (a ?? "").trim().toLowerCase();
  const y = (b ?? "").trim().toLowerCase();
  if (!x && !y) return null;
  return x === y ? 1 : 0;
}

function bodyFeel(a?: number | null, b?: number | null): number | null {
  if (a == null && b == null) return null;
  if (a == null || b == null) return 0;
  return 1 - Math.abs(a - b) / 100;
}

export function profileSimilarity(
  a: ProfileLike,
  b: ProfileLike,
): ProfileSimilarity {
  // [label, weight, similarity|null]. Directional/identity fields weigh more.
  const raw: Array<[string, number, number | null]> = [
    ["Favourite strains", 3, jaccard(a.favoriteStrains, b.favoriteStrains)],
    ["Aromas", 2, jaccard(a.preferredAromas, b.preferredAromas)],
    ["Effects", 2, jaccard(a.preferredEffects, b.preferredEffects)],
    ["Flavours", 1.5, jaccard(a.preferredFlavors, b.preferredFlavors)],
    ["Primary aroma", 1.5, single(a.primaryAroma, b.primaryAroma)],
    ["Primary effect", 1.5, single(a.primaryEffect, b.primaryEffect)],
    ["Use time", 1, single(a.useTime, b.useTime)],
    ["Potency", 1, single(a.potencyPreference, b.potencyPreference)],
    ["Type", 1, single(a.preferredType, b.preferredType)],
    ["Body feel", 1, bodyFeel(a.bodyFeel, b.bodyFeel)],
    ["Effects to avoid", 1, jaccard(a.dislikedEffects, b.dislikedEffects)],
    ["Aromas to avoid", 1, jaccard(a.dislikedAromas, b.dislikedAromas)],
    ["Liked traits", 1, jaccard(a.likedTraits, b.likedTraits)],
  ];

  const compared = raw.filter(
    (d): d is [string, number, number] => d[2] !== null,
  );

  const totalWeight = compared.reduce((s, [, w]) => s + w, 0);
  const overall =
    totalWeight === 0
      ? 0
      : compared.reduce((s, [, w, sim]) => s + w * sim, 0) / totalWeight;

  const dims = compared.map(([label, , sim]) => ({
    label,
    percent: Math.round(sim * 100),
  }));

  // The dimensions pulling them apart: below half-overlap, most-different first.
  const differOn = compared
    .filter(([, , sim]) => sim < 0.5)
    .sort((x, y) => x[2] - y[2])
    .map(([label]) => label);

  return { percent: Math.round(overall * 100), dims, differOn };
}
