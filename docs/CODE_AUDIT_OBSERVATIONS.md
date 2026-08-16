# SŌMA code and product audit — observations for the next engineer

**Audit date:** 2026-08-16

**Audited baseline:** `main` at `99da01044112c2a88640a6b666827bc13ef68487`

**Baseline commit:** `chore: redeploy known-good baseline (f4353bf) to restore prod`

**Purpose:** give the next engineer enough verified context to repair the highest-value problems without accidentally changing the product's scoring philosophy.

This document is an engineering handoff, not a mandate to implement every idea in one pull request. The repository was not modified during the audit other than adding this file.

---

## 1. Executive summary

SŌMA already has a strong foundation:

- a distinctive cream / olive / brass visual identity;
- a large, unusually rich catalog (895 strain profiles and 895 identity records);
- a deterministic and auditable matching engine;
- strict TypeScript with very little type-system bypassing;
- 502 passing automated tests;
- a production build that completes successfully;
- thoughtful honesty around batch uncertainty, confidence, and user-specific matching.

The biggest current problems are not a broken scoring engine. They are contradictions and integration seams around it:

1. The UI sometimes presents a **sensory-match score as a purchase/value judgment**, even though the same result card says purchase confidence is unknown.
2. The product exposes **two incompatible score taxonomies**: three purchase-oriented tiers and five engine categories.
3. The “quick” onboarding is now five screens / fourteen questions, while several answers count toward readiness without affecting the match score.
4. Taste Blender persists every pointer movement to the database, creating request floods and stale-response races.
5. Catalog generation and delivery are too heavy: the build repeatedly attempts to cache a 2.87 MB value that Next.js refuses to cache, while catalog pages ship roughly 453–456 KB of first-load JavaScript.
6. Public privacy copy makes an absolute claim that conflicts with the optional AI implementation.
7. Documentation, navigation names, and source comments have drifted away from the actual product.

The recommendation is to repair **truth and consistency first**, then interaction/performance, and only then do broad visual refactors or scoring recalibration.

---

## 2. Scope and verification status

### Reviewed

- Next.js App Router structure and route inventory
- Prisma data model
- authentication, session, verification, and reset flows
- profile creation, completeness, presets, and onboarding
- deterministic matching engine and related layers
- multi-profile merge and Taste Blender
- catalog assembly, filtering, detail pages, and artwork system
- result cards, score labels, purchase confidence, and feedback
- main navigation, account, landing, and educational pages
- responsive Tailwind structure and source visual assets
- repository documentation and current Git branch state

### Automated checks completed

| Check | Result |
|---|---|
| TypeScript (`npx tsc --noEmit`) | Passed |
| Test suite (`node --import tsx --test tests/*.test.ts`) | 502 passed, 0 failed |
| Production build | Passed |
| Static routes generated | 934 / 934 |

In this audit environment, `npm test` through the `tsx` CLI hit a sandbox-only Unix socket permission error. Running the same Node test runner directly with `--import tsx` passed all tests. This is not evidence of a repository test failure.

### Visual-review limitation

The layout, design system, responsive classes, and source imagery were reviewed directly. A full authenticated browser click-through was not completed because the cloud browser session failed independently of the site. Treat browser-only observations below as code-backed findings that still need one final manual desktop/mobile pass before release.

---

## 3. System map

| Area | Main source |
|---|---|
| Deterministic score | `src/lib/taste-engine.ts` |
| Engine input/output types | `src/lib/types.ts` |
| Target and forced-choice dimensions | `src/lib/profile-target.ts` |
| Profile completeness/readiness | `src/lib/profile-completeness.ts` |
| Quick onboarding | `src/app/onboarding/quick/page.tsx` |
| Full profile editor | `src/components/taste-profile-form.tsx` |
| Taste Match flow | `src/app/taste-match/taste-match-client.tsx` |
| Result grouping | `src/components/results-view.tsx` |
| Individual recommendation | `src/components/recommendation-card.tsx` |
| Purchase confidence | `src/lib/purchase-confidence.ts` |
| Multi-profile merge | `src/lib/merge-worlds.ts` |
| Taste Blender UI | `src/components/taste-blender-block.tsx` |
| Taste Blender API | `src/app/api/blender/route.ts` |
| Catalog assembly | `src/lib/catalog.ts` |
| Catalog list UI | `src/app/catalog/catalog-client.tsx` |
| Strain detail UI | `src/app/catalog/[slug]/strain-detail.tsx` |
| Sensory records | `src/lib/strain-data.ts` |
| Identity/editorial records | `src/lib/strain-identity-data.ts` |
| Optional AI prose pass | `src/lib/openai.ts` |
| Session implementation | `src/lib/session.ts`, `src/lib/user.ts` |

---

## 4. What should be preserved

Before fixing anything, preserve these properties unless the owner explicitly changes the product decision:

1. **Scores are deterministic.** The optional model may rewrite prose but must not change scores, categories, confidence, or ranking.
2. **A score is profile-relative, not a universal quality rating.** A famous strain can be a bad match for a specific user.
3. **Favorite anchors remain visibly above alternatives.** Favorites occupy 94–96; non-favorites top out in the 89–92 band, leaving the deliberate gap below favorites.
4. **Uncertainty remains visible.** The system cannot inspect the actual jar, grower, freshness, cure, package date, or storage.
5. **Feedback must remain bounded.** It should refine the model without overwhelming the base sensory match.
6. **Unknown/thin data must degrade honestly.** Do not fabricate confidence or missing batch facts.
7. **Do not combine a copy/taxonomy repair with weight recalibration.** Those are different risk classes and should be separate PRs.

---

## 5. Priority overview

| Priority | Problem | Why it matters |
|---|---|---|
| P0 | Sensory score is presented as “worth your money / buy with confidence” | It overstates what the engine knows and contradicts the card's own purchase-confidence message |
| P0 | Three UI tiers conflict with five engine categories | Users can see two different verdicts for the same score |
| P0 | Taste Blender writes on every pointer movement | Request flood, unnecessary database load, and out-of-order state regression |
| P1 | Readiness/completeness counts non-scoring or partly inert answers | The progress percentage promises precision that the engine does not receive |
| P1 | Catalog cache and client payload are oversized | Repeated build warnings, slow catalog entry, and unnecessary JS/data transfer |
| P1 | Homepage privacy claim conflicts with optional AI sharing | Trust/legal copy should exactly match implementation |
| P1 | “Quick” onboarding is fourteen questions | High first-run friction and direct drift from the documented four-question product plan |
| P2 | Accessibility gaps in Blender and age gate | Pointer-only controls and incomplete modal behavior exclude keyboard/screen-reader use |
| P2 | Large client components, no effective lint/CI, stale docs/branches | Raises regression cost and makes future agent work less reliable |
| P2 | Stateless sessions cannot be revoked on password reset | A stolen session may remain valid until its 30-day expiry |

---

## 6. Detailed findings and recommended repairs

### P0-A. Separate sensory fit from purchase confidence

#### Verified behavior

`src/components/results-view.tsx` groups results into:

- `Worth your money` — 81–100
- `Worth a shot` — 56–80
- `Save your money` — 0–55

The top-tier hint is:

> Strong fit for your taste — buy with confidence.

However, `src/lib/purchase-confidence.ts` deliberately returns all signals as `unknown`, because SŌMA currently captures no grower, package date, cure, storage, or phenotype-consistency signal.

`src/components/recommendation-card.tsx` then correctly tells the same user:

> Purchase confidence: unknown — SŌMA captures no grower, package date, cure or storage information.

Those two statements can appear in the same result section. The score supports “strong sensory fit,” but not “worth the money” or “buy with confidence.” Price is also intentionally ignored by the menu parser.

#### Recommended repair

Until real purchase signals exist, rename the three headers to sensory language. For example:

- `Strong fit`
- `Possible fit`
- `Weak fit`

Or remove the three-tier grouping entirely and make the engine's five categories the single visible taxonomy.

If the owner wants to preserve the emotional clarity of “worth your money,” then it must be presented as a marketing heuristic, not as purchase confidence, and the contradiction still needs explicit resolution. The technically honest recommendation is to avoid the value claim for now.

#### Acceptance tests

- No UI string says “buy with confidence” while `purchaseConfidence.overall === "unknown"`.
- A snapshot/data test verifies the label for every boundary score.
- The score explanation explicitly says “sensory fit,” not product quality or batch quality.
- Purchase-confidence UI remains separate and unknown until real signals are supplied.

---

### P0-B. Choose one canonical score taxonomy

#### Verified behavior

The engine's `categorize()` in `src/lib/taste-engine.ts` uses five categories:

| Score | Engine category |
|---:|---|
| 80+ | Best Match |
| 66–79 | Closest Alternative |
| 50–65 | Worth Trying |
| 36–49 | Risky |
| below 36 | Avoid |

The result view independently uses three boundaries at 81 and 56. Therefore:

- score 80 can be in the UI section `Worth a shot` while its card says `Best Match`;
- score 55 can be in `Save your money` while its card says `Worth Trying`;
- category caps from conflicts can produce additional semantic disagreement with score-only grouping.

The anonymous homepage contains another concrete inconsistency: its sample recommendation shows `Triple Double OG`, `82%`, and `Closest Alternative`. Under the actual engine, 82 is normally `Best Match` unless a conflict cap applies, but the static example does not explain such a cap.

`docs/ux-redesign.md` already acknowledges that reconciling the five-category card label with the three-tier framing remains open.

#### Recommended repair

Create one small source-of-truth module for display taxonomy. It should export:

- thresholds;
- display labels;
- descriptions;
- color/tone tokens;
- boundary helpers;
- optional handling for a conflict-capped category.

Then consume that module from the result list, recommendation card, Compare, homepage sample, docs, and tests.

Do not leave two unlabelled judgments on one card. If both are deliberately kept, name them as different axes, for example:

- `Sensory category: Closest Alternative`
- `Fit band: Strong`

#### Acceptance tests

- Boundary test cases for 35/36, 49/50, 65/66, 79/80, and any retained three-tier boundaries.
- Homepage sample is generated from or validated against the same helper.
- Compare, Taste Match, blended results, saved results, and catalog show consistent language.
- Conflict-capped results explain why category and raw score may differ.

---

### P0-C. Stop persisting every Blender pointer movement

#### Verified behavior

`TasteBlenderBlock.patch()` performs a `PATCH /api/blender` request and then unconditionally applies the returned server state with `setS(d)`.

The SVG slider installs a window-level `pointermove` handler. Every movement calls `onLean1` or `onLean2`, which immediately calls `patch()`.

For an ordinary slider request, `src/app/api/blender/route.ts` performs:

1. one `prisma.user.update()`;
2. one `prisma.user.findUnique()`;
3. one `prisma.tasteProfile.findMany()`.

A normal drag can therefore generate dozens of requests and hundreds of database operations. Responses can arrive out of order; an older slow response can overwrite a newer optimistic value.

#### Recommended repair

Use two layers of state:

1. local visual state updated on every pointer move;
2. persisted state committed on `pointerup` / `pointercancel`.

Optionally add a trailing debounce (roughly 150–250 ms) for keyboard changes or unusually long drags. Also use one of:

- an incrementing request sequence and ignore stale responses;
- `AbortController` to cancel the prior request;
- no server-state replacement for successful lean writes when the sent value is already canonical.

Do not call `router.refresh()` during a drag.

#### Accessibility repair in the same component

The knobs are pointer-only SVG circles. Add:

- `role="slider"`;
- `tabIndex={0}`;
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and an accessible name;
- Arrow key handling;
- Home/End or reasonable step controls;
- a visible focus style.

There is also a duplicated `cy={y}` attribute on the invisible knob hit-area circle. It is visually harmless but should be removed; a functioning lint setup should prevent this class of issue.

#### Acceptance tests

- A long pointer drag causes one persistence request, or a small bounded number if debouncing is used.
- A deliberately delayed older response cannot revert the newest value.
- Arrow keys update the slider and persist the final value.
- Explorer/Harmony behavior remains unchanged.
- Two-profile and three-profile blends retain their current math.

---

### P1-A. Split “profile completeness” from “matching readiness”

#### Verified behavior

`src/lib/profile-completeness.ts` gives users one percentage for both profile progress and access to matching. The comments say the weights total 100 “by construction,” but the current weights total 96 and are normalized to 0–100.

The current base section totals 73 raw points (about 76% after normalization), not the 75 described in comments. Quick onboarding currently has fourteen questions, not fifteen.

More importantly, some questions count toward the 60% match gate without materially affecting `scoreStrain()`:

- `bodyFeel`: 4 raw points; stored and used for profile-to-profile similarity/inference, but not the match score;
- `smokingMethods`: 2 raw points; explicitly contextual and currently a no-op in scoring;
- `avoidedRisks`: 2 raw points; only `racy` has curated strain entries. `paranoia`, `foggy`, and `crash` are offered but deliberately inert in `src/lib/risk-tags.ts`;
- `texturePreferences`: 2 raw points; `moist` and `fluffy` map to `null`, so selecting only those adds completeness but no positive texture signal.

Other stored but non-scoring fields include `lookingFor` and `referenceStrain` (favorite strain anchors are used separately). Free-text notes affect only the optional prose layer, not deterministic scoring.

`profileCompleteness()` computes `hasBase` from `primaryEffect + useTime`, but the analyze and compare gates check only `percent`, not `hasBase`.

#### Recommended repair

Introduce two distinct concepts:

1. **Profile completeness** — how much of the editable profile has been filled in.
2. **Matching readiness** — whether the engine has enough real scoring signal to provide a useful result.

Readiness should depend only on fields actually consumed by the scoring path. A reasonable first rule is:

- a valid primary effect + use time, or
- a sufficiently strong favorite-strain anchor path,
- plus at least one real aroma/effect preference.

The exact rule is a product decision and should be covered by tests. Do not quietly make an inert field influence scoring merely to justify the progress bar.

For risk choices, either curate the missing tags before presenting them as active or visibly mark/remove them until they work.

#### Acceptance tests

- Filling only non-scoring/context fields cannot unlock matching.
- Every field described as “sharpening the match” has a verified scoring path.
- Completeness comments and docs reflect the computed denominator, not hand-maintained totals.
- A test enumerates every onboarding field and classifies it as scoring, contextual, or future/inert.

---

### P1-B. Restore a genuinely quick onboarding path

#### Verified behavior

`/onboarding/quick` currently contains five screens and fourteen questions:

- favorite strain, smoking method, use time;
- broad aroma/flavor and primary aroma;
- preferred effects, primary effect, disliked effects;
- avoided risks, disliked traits, disliked strains;
- disliked aroma, body feel, potency.

Every question is skippable, but the total cognitive load is still much larger than the four-question “budtender flow” documented in `docs/ux-redesign.md`.

The page copy calls this “a few quick answers,” while a new visitor may encounter multiple large chip grids and strain tag inputs before reaching a result.

#### Recommended repair

Keep two clear layers:

- **Quick start:** 4–6 high-signal questions only.
- **Fine-tune profile:** all additional preferences, dislikes, texture, families, and contextual fields.

Prioritize questions that already drive the engine:

1. desired primary effect;
2. use time;
3. primary aroma / broad sensory family;
4. favorite strain if known;
5. one meaningful “avoid” question;
6. potency if needed for the first result.

Smoking method and body-feel collection should either move to fine-tuning or gain a real, documented reason to affect results.

Measure completion and first-result rate after the change; do not assume fewer screens alone proves success.

---

### P1-C. Repair catalog caching and payload shape

#### Verified build evidence

The production build completes, but repeatedly logs:

```text
Failed to set Next.js data cache for unstable_cache ...
items over 2MB can not be cached (2870931 bytes)
```

This appears during generation of the strain detail pages.

`src/lib/catalog.ts` builds the entire catalog and all nearest-neighbor lists, then wraps that full result in `unstable_cache(["soma-catalog-v1"])`.

`getCatalogEntryBySlug()` loads that full catalog and then performs a linear `find`. Both page rendering and metadata generation use it across 895 strain routes. Because the cache value exceeds Next.js's 2 MB limit, the intended persistent cache is not being stored.

The code comment still describes 888 strains and approximately 789K comparisons; the current catalog has 895.

#### Observed route weights

| Route | First-load JS |
|---|---:|
| `/catalog` | ~456 KB |
| `/catalog/[slug]` | ~453 KB |
| `/collection` | ~448 KB |
| `/profile/feedback` | ~446 KB |
| `/taste-match` | ~425 KB |
| `/profile` | ~402 KB |

The catalog list mounts only 40 cards initially, which is good, but all filtered entries are still serialized to the client so search/filtering can operate across the complete dataset. Infinite rendering control does not solve the transfer/bundle cost.

#### Recommended repair

1. Build `Map` indexes once for name and slug lookup.
2. Split catalog data into separate shapes:
   - minimal list/search record;
   - full detail record;
   - optional precomputed similarity record.
3. Make `getCatalogEntryBySlug()` resolve directly from a slug map instead of reading the full cached list.
4. Do not place the entire 2.87 MB graph in one `unstable_cache` entry. Cache small per-slug values, precompute a checked-in/generated similarity artifact, or rely on module-level immutable maps during SSG.
5. Consider server-side search/pagination or a compact search index so the browser does not receive all full list records on first load.
6. If a cache key remains, make versioning data-derived or reliably bump it whenever strain data, identity data, or similarity logic changes.

#### Acceptance tests / budgets

- Production build contains no “items over 2MB can not be cached” warnings.
- Catalog search still finds a strain beyond the first 40 items.
- Strain metadata and detail content remain statically indexable.
- Set an agreed first-load JS budget; an initial target below 250 KB for catalog routes would be a meaningful improvement.
- Add a regression check for serialized catalog payload size.

---

### P1-D. Optimize hero and catalog imagery

#### Verified behavior

- `public/hero/hero.png`: 941×1672, 3,084,243 bytes
- `public/hero/dashboard.png`: 941×1672, 3,047,873 bytes
- both are rendered as native eager `<img>` elements;
- the source currently has no `next/image` imports;
- `/public` is approximately 44 MB, with `/public/strains` taking the majority;
- 181 of 895 identity records have `artStatus: "published"` (about 20%).

The hero artwork is visually strong and aligned to the premium apothecary concept. The issue is delivery, not the art direction.

The strain artwork is also high quality, but the experience changes noticeably between cinematic collectible cards and the fallback palette used for most of the catalog.

#### Recommended repair

- Convert large hero PNGs to modern WebP/AVIF variants.
- Use `next/image` or an equivalent responsive image strategy with explicit `sizes` and intentional priority only for the actual LCP image.
- Keep card artwork lazy-loaded.
- Define one visually deliberate fallback card system that looks complete rather than temporary.
- Track artwork coverage as data, not by counting files manually.
- Avoid requiring all 895 pieces of art before the catalog feels coherent.

---

### P1-E. Make privacy copy match the optional AI behavior

#### Verified behavior

The homepage says:

> Your data stays in your account: never sold, never handed to advertisers or other services.

The “never handed to other services” part is too absolute.

When `OPENAI_API_KEY` is configured, `src/lib/openai.ts` sends a payload to OpenAI containing:

- favorite and disliked strains;
- liked and disliked traits;
- preferred and disliked effects;
- preferred aromas and flavors;
- free-text profile notes;
- the recommendation set and its score/explanation context.

The Privacy page does disclose hosting, database, email, and optional third-party AI assistance, which is good. The problem is that the homepage claim contradicts that disclosure.

#### Recommended repair

Use precise public copy, for example:

> Your profile is private: never sold and never used for advertising. We share data only with the service providers described in our Privacy Policy when needed to run SŌMA.

Also decide whether the AI prose pass needs a user-visible opt-in. At minimum, the production configuration and privacy policy must name the actual provider behavior accurately.

Add a data-flow test or documented contract that enumerates the fields sent to an external model.

---

### P1-F. Consolidate navigation and product language

The same destinations/concepts currently have multiple names:

| Concept | Names currently used |
|---|---|
| Catalog | Harvest, Catalog |
| Saved activity | History, Saved, Your reads |
| User/profile area | Account, Sensory Profile, My Profile, Private Lounge |
| Menu scoring | Taste Match, Analyze Menu, Find My Flower |

Some variety is useful in marketing copy, but global navigation, page headings, breadcrumbs, and documentation should use one canonical noun per concept.

Recommended decision:

- choose a branded display name plus a plain explanatory subtitle, rather than alternating labels;
- keep route paths stable while changing labels;
- make a central navigation/terminology map consumed by header/footer where practical;
- update docs in the same PR.

---

### P2-A. Accessibility pass

#### Taste Blender

Covered above: pointer-only SVG sliders need keyboard and ARIA slider semantics.

#### Age gate

`src/components/age-gate.tsx` uses `role="dialog"` and locks body scrolling, but it does not visibly implement:

- initial focus placement;
- focus trapping;
- restoration of focus after dismissal;
- making the background application inert/hidden from assistive technology.

The age gate should be tested as a real modal, not only as a visual overlay. Do not bypass or weaken the 21+ acknowledgement while repairing accessibility.

#### Motion

The custom hero and Blender animations respect `prefers-reduced-motion`, which is good. Check Tailwind's `animate-bounce` scroll hint and any other utility animations in the same audit.

#### Verification

- keyboard-only walk-through;
- screen-reader labels for score, confidence, sliders, and profile switches;
- automated axe scan on anonymous home, onboarding, catalog, strain detail, account, and Taste Match;
- color contrast verification for brass text and small muted labels.

Do not claim WCAG compliance until those checks are completed.

---

### P2-B. Restore linting and add CI

#### Verified behavior

- `next.config.mjs` sets `eslint.ignoreDuringBuilds: true`;
- `package.json` exposes `next lint`;
- the repository contains no ESLint configuration or ESLint dependency;
- there is no GitHub Actions workflow in `.github/workflows`;
- TypeScript and tests are currently strong, but they are not visibly enforced on every PR.

#### Recommended repair

Add a small CI workflow with separate steps for:

1. dependency installation;
2. Prisma client generation;
3. TypeScript;
4. tests;
5. ESLint;
6. production build (with a safe CI database URL/configuration).

Use a current standalone ESLint configuration rather than relying on a deprecated framework command. Remove `ignoreDuringBuilds` only after the existing codebase is brought to a clean baseline.

Add targeted checks for:

- duplicate JSX attributes;
- unused imports/variables;
- React hook dependencies;
- native image usage where optimization matters;
- accessibility rules.

---

### P2-C. Break up high-change monoliths

Current notable file sizes:

| File | Lines |
|---|---:|
| `src/app/account/page.tsx` | 895 |
| `src/app/catalog/catalog-client.tsx` | 872 |
| `src/app/catalog/[slug]/strain-detail.tsx` | 863 |
| `src/app/taste-match/taste-match-client.tsx` | 741 |
| `src/components/taste-blender-block.tsx` | 711 |
| `src/app/onboarding/quick/page.tsx` | 685 |
| `src/lib/taste-engine.ts` | 1,726 |

The two large data files (`strain-data.ts` and `strain-identity-data.ts`) are a different concern: they are mostly declarative records. The client page monoliths mix state, network behavior, product copy, and rendering, which raises change risk.

Refactor by responsibility, not by arbitrary line count. Good seams include:

- data-loading/state hooks;
- score/taxonomy presentation;
- filter state and catalog query logic;
- Blender persistence hook vs diagram rendering;
- onboarding schema vs step renderer;
- account profile cards vs membership/history sections.

Do not perform this refactor in the same PR as scoring or threshold changes.

---

### P2-D. Session revocation and rate limiting

The authentication core has several good properties:

- passwords use salted scrypt hashes;
- verification/reset tokens are random, hashed at rest, single-use, and expiring;
- login errors do not reveal whether an email exists;
- session signatures use HMAC and timing-safe comparison;
- email verification is enforced before login.

Two future-hardening items remain:

1. Sessions are stateless 30-day tokens containing only user ID and expiry. Password reset does not invalidate sessions already issued on another device. Account deletion clears only the current browser's cookies. Add a revocation/version mechanism before the account system is exposed to meaningful scale.
2. Rate limiting is an in-memory fixed-window map per server instance. The source already calls it a guardrail, not a hard global limit. Replace it with a shared store for real abuse protection.

Also set the anonymous `soma_uid` cookie to `secure` in production for consistency with the authenticated session cookie.

Any revocation design must respect the existing resilience goal: a temporary database outage should not silently downgrade a valid logged-in user into a new anonymous identity.

---

### P2-E. Data provenance and canonical sensory tags

The catalog scale is a strength, but confidence varies:

- 895 sensory strain profiles;
- 895 identity records;
- identity confidence is mostly medium, with a smaller high-confidence subset and roughly 90 low-confidence records;
- 181 published artworks.

Open GitHub issue `#211` — **Canonical sensory-tag model (source · strength · confidence)** — points in the correct long-term direction.

Do not solve provenance by adding more untyped string fields. The desired model should distinguish:

- tag identity;
- whether it is primary or trace;
- evidence/source;
- confidence;
- batch-specific vs cultivar-level information;
- curator override/history.

This should be a planned data migration with compatibility adapters for the current engine, not a broad rewrite inside a UI PR.

---

## 7. Documentation drift to fix alongside code

These are confirmed examples, not an exhaustive list:

- `docs/ux-redesign.md` says the four-question onboarding phase is complete; current quick onboarding is five screens / fourteen questions.
- `docs/catalog-audit.md` references 439 catalog strains; current count is 895.
- `src/lib/catalog.ts` comments reference 888 strains; current count is 895.
- `src/lib/profile-completeness.ts` comments say fifteen onboarding questions, base 75, and total weights 100; current values are fourteen questions, raw base 73, raw total 96 normalized to 100%.
- README's page inventory omits several current surfaces and does not explain the newer Account / Collection / Blender model.
- Some test descriptions and comments refer to older engine versions even though the active version is v9.

Recommendation: generate counts from source where possible. A documentation test can assert catalog size, engine version, and completeness denominator to prevent repeat drift.

---

## 8. Repository hygiene

At audit time:

- default branch: `main`;
- open pull requests: none;
- remote branches: 87;
- many branches use old `claude/*`, feature, or hotfix names.

Do not mass-delete branches automatically. First identify which branches are merged, which contain unique work, and which are deployment artifacts. Then prepare a human-reviewed cleanup list.

All repairs from this document should use focused branches and PRs rather than direct changes to `main`.

---

## 9. Recommended implementation sequence

### PR 1 — Truth model and copy

- Decide canonical score taxonomy.
- Replace unsupported value/purchase claims.
- Fix the 82% homepage example.
- Make purchase confidence a separate axis.
- Correct privacy wording.
- Add boundary/copy tests.

### PR 2 — Readiness and onboarding

- Separate completeness from matching readiness.
- Inventory scoring vs contextual/inert questions.
- Reduce quick onboarding to high-signal inputs.
- Move depth questions to profile fine-tuning.
- Correct documentation and tests.

### PR 3 — Blender interaction

- Keep drag state local.
- Persist on pointer release/debounce.
- prevent stale-response state regression;
- add keyboard/ARIA slider behavior;
- add fetch-count and race tests.

### PR 4 — Catalog architecture/performance

- split list/detail/search shapes;
- remove the oversized cache entry;
- direct slug lookup;
- reduce serialized client payload;
- add bundle/payload budgets.

### PR 5 — Image delivery and visual consistency

- responsive modern hero assets;
- image optimization;
- intentional fallback-card system;
- artwork coverage reporting.

### PR 6 — Engineering guardrails

- ESLint baseline;
- GitHub Actions;
- documentation assertions;
- small component extractions;
- security hardening as a separate, reviewable change.

---

## 10. Open owner decisions

The engineer should not silently decide these product questions:

1. Is the primary result language a five-category sensory scale or a three-band consumer summary?
2. Should SŌMA ever say “worth your money” without batch and price data?
3. What is the maximum acceptable number of quick-onboarding questions?
4. Must optional AI prose require explicit user opt-in, or is Privacy Policy disclosure sufficient?
5. Should `Harvest` remain the branded catalog name everywhere?
6. Is Taste Blender's Explorer/Harmony model final, or should the UI explain the max-vs-min behavior more explicitly?
7. What performance budgets should block a PR?

Record these decisions in the repository once made. Otherwise a future agent will rediscover and re-litigate them.

---

## 11. Definition of done for the repair program

The highest-priority repair work is complete when:

- one score produces one understandable, non-contradictory user verdict;
- sensory fit is never presented as knowledge of the actual jar's quality;
- matching cannot unlock through non-scoring answers alone;
- quick onboarding is genuinely quick and every promise about an answer is true;
- Blender dragging creates bounded persistence traffic and cannot regress to stale state;
- production build has no oversized Next.js cache warnings;
- catalog initial payload and JS are within an agreed budget;
- public privacy copy matches actual data flows;
- critical controls work with keyboard and assistive technology;
- TypeScript, tests, lint, and build run automatically on pull requests;
- documentation counts and terminology match the source.

The existing deterministic engine should remain stable throughout this sequence unless a later, separately measured calibration task demonstrates a real scoring defect.
