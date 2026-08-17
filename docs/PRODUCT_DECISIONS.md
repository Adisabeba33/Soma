# Product decisions

Owner decisions recorded 2026-08-16, resolving the open questions in
`docs/CODE_AUDIT_OBSERVATIONS.md` §10. Future agents: do not re-litigate
these without a new owner decision recorded here.

## 1. Canonical score taxonomy

The engine's **five sensory categories** (Best Match / Closest Alternative /
Worth Trying / Risky / Avoid) are the single visible verdict scale. The
three consumer tiers ("Worth your money" / "Worth a shot" / "Save your
money") are removed entirely. Source of truth: `src/lib/score-taxonomy.ts` —
every surface (results list, recommendation card, Compare, homepage sample)
consumes thresholds, labels, hints and tone tokens from that module.

## 2. No purchase-value claims

SŌMA never says "worth your money" / "buy with confidence" while purchase
confidence has no real signals (`src/lib/purchase-confidence.ts` returns all
signals as `unknown`). A match score is sensory fit, never a batch-quality
or value-for-money judgment. Purchase confidence stays a separate axis
rendered next to — never merged into — the sensory score. Enforced by
`tests/score-taxonomy.test.ts` (banned-phrase scan over `src/`).

## 3. Quick onboarding budget

Maximum **5 questions** in `/onboarding/quick`. Everything else moves to
profile fine-tuning. The quick path prioritizes fields the engine actually
scores: primary effect, use time, primary aroma/family, favorite strain,
one avoid question.

## 4. Optional AI prose requires opt-in

The optional AI prose pass (`src/lib/openai.ts`) requires an explicit
user-visible opt-in; Privacy Policy disclosure alone is not sufficient.
Until the opt-in ships, public copy must accurately describe provider
sharing (homepage copy fixed accordingly) and the feature stays limited to
prose — it must never change scores, categories, confidence or ranking.

## 5. Catalog naming

**Harvest** remains the branded catalog name, always paired with a plain
explanatory subtitle ("Catalog"). One canonical noun per concept in global
navigation, breadcrumbs and docs; route paths stay stable.

## 6. Taste Blender model

The Explorer/Harmony (max-vs-min) blend model is kept as-is, but the UI
gets a short explanation of the behavior. No changes to blend math.

## 7. Performance budgets

- Production build must emit **no** "items over 2MB can not be cached"
  warnings — enforced in CI (blocking).
- First-load JS for catalog routes: **250 KB target**. Enforced today as a
  non-regression ratchet in CI (currently 450 KB ceiling; tighten as the
  number drops, never raise it) plus a 700 KB budget on the serialized
  catalog list payload in tests/doc-drift.test.ts.
