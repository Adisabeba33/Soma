# Vendored menu parser

These six modules are copied from `packages/core` of the inventory-index
project (`zip-inventory`), where they are covered by ~170 unit tests. The
copies here carry the tests that matter for menu reading, as
`tests/menu-*.test.ts`.

**Vendored at:** upstream commit `f475436`.

**What was changed in the copy:** nothing but the import specifiers. Upstream
resolves modules the Node way and writes `from './types.js'`; Soma resolves
them the bundler way, so the `.js` suffixes are stripped. The upstream
filenames are kept in their original camelCase, against Soma's kebab-case
habit, so this directory stays obviously vendored and trivially diffable
against its source.

**Do not fix bugs only here.** A change made in this copy and not upstream
means the bookmarklet, the render probe and Soma disagree about what an eighth
is. Fix it upstream, then re-vendor.

## What it does, and what it deliberately does not

| Module | Job |
| --- | --- |
| `weights.ts` | Text to one of four package sizes. Refuses to guess on a conflicting or non-standard size |
| `strainName.ts` | Strips producer, price, potency and packaging noise. Never rewrites a cultivar |
| `productType.ts` | Flower only. Excludes pre-rolls, vapes, edibles, concentrates, moonrocks, infused |
| `dedupe.ts` | One row per cultivar per size, keeping the listing count |
| `menuText.ts` | Menu lines to strains. Handles both one-product-per-line and card layouts |
| `types.ts` | The shared vocabulary |

It captures no grower, price or potency — the source schema has no columns for
them, on purpose. Soma does want those, which is why `parse-menu.ts` still
exists and still handles the paste box: it reads a looser shape and returns the
enrichment this parser will not. The two are not yet one thing, and that is a
known seam, not a decision.
