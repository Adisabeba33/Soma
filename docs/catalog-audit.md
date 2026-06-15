# Catalog audit — duplicates & completeness (2026-06-15)

Full pass over all **439** catalog strains (`STRAINS` ↔ `IDENTITIES`, 1:1).

## Verified clean
- **Identity coverage:** 439 / 439 profiles have a `StrainIdentity` record (every card has lineage scaffold + curator note + pull-quote).
- **Duplicate names:** 0 · **slug collisions:** 0 · **alias collisions:** 0 · **duplicate `curatorNote`:** 0 · **duplicate profile `note`:** 0.
- Every `curatorNote` is ≥ 140 chars; every strain has a `curatorQuote`.

## Fixed in this pass
- **25 strains shared 11 identical `curatorQuote` lines** (copy-paste from the landrace batch). Rewrote each to a unique, strain-specific pull-quote. Affected: Bubble Gum/Boggle Gum; Trinity/Crystal Locomotive; Nevil's Wreck/Neville's Haze; Panama Red/Aceh/Power Plant; Thai/Luang Prabang/Highland Thai; Mexican/Oaxacan; Swazi Gold/Punto Rojo; Holland's Hope/South Indian; Vietnamese Black/Angola Roja; Ethiopian Highland/Manipuri/Highland Guatemalan; B-52/AK-48.

## To work on later — lineage gaps (26)
Modern / named cuts whose lineage is currently **uncertain or undocumented** in the record. Re-check when better sources surface; several may be genuinely unknowable (flagged ‡ = cult/heritage cut where "unknown" is itself the documented truth — likely no action possible):

Chemdawg ‡, The White ‡, G13 ‡, Purple Urkle ‡, Purple Haze ‡, Mendo Purps ‡, Romulan ‡, Sensi Star ‡, Williams Wonder ‡, Power Plant, Trinity, Lemon G, Watermelon, Strawberry Fields, Orange Velvet, Burmese Kush, Alien Tech, 91 Hollywood Pure Kush, Ed Rosenthal Super Bud, Eddy OG, Florida Kush, Lemon Joy, OG LA Affie, Ortega, Razzleberry, South Florida OG.

## Complete by nature — landraces / heritage (44, no lineage expected)
Hindu Kush, Afghani, Durban Poison, Maui Wowie, Acapulco Gold, Chocolate Thai, Mazar, Haze, Colombian Gold, Hawaiian, Lamb's Bread, Panama Red, Kali Mist, Malawi, Thai, Mexican, Nepalese, Swazi Gold, Pakistani Chitral Kush, Lebanese, Moroccan, Congolese, Oaxacan, Punto Rojo, Luang Prabang, Aceh, Kilimanjaro, Zamal, Vietnamese Black, Ethiopian Highland, Sinai, Kandahar, Mullumbimby Madness, Angola Roja, Cambodian, Brazilian, South Indian, Korean, Highland Thai, Persian, Manipuri, Highland Guatemalan, Jamaica, Laos.

## Note on `sourceConfidence: low` (105 strains)
This is an **honesty marker**, not an "empty card" flag — these strains have full sensory + note data but contested/undocumented genetics. No bulk action needed; revisit individually only if a strain's genetics get firmly sourced.
