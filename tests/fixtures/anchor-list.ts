// The reference ("anchor") strains whose sensory tags are guarded by an
// explicit snapshot (anchor-tags.json + anchor-tags-guard.test.ts). These
// are the most-picked favourites — the strains half the catalog's reference
// similarity is measured against — so an ACCIDENTAL tag change here (a bad
// bulk edit, a stray line in a curation batch) must fail loudly.
//
// A DELIBERATE curator change is one command away:
//   npx tsx scripts/update-anchor-snapshot.ts
// Commit the regenerated snapshot with the data edit — its diff is the
// changelog. This replaces the old implicit freeze, where these strains
// were hardwired into a dozen mechanics tests and couldn't be curated at
// all (docs/sensory-tag-audit-2026-06.md, "the 63 anchors").
export const ANCHOR_STRAINS = [
  "GG4",
  "Sour Diesel",
  "OG Kush",
  "Chemdawg",
  "Blue Dream",
  "Green Crack",
  "Northern Lights",
  "Granddaddy Purple",
  "Wedding Cake",
  "Zkittlez",
  "Jack Herer",
  "Skunk #1",
] as const;
