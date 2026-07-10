# Branch cleanup — verified classification (2026-07-10)

86 stale remote branches were audited for the H1 cleanup
(docs/project-issues-2026-07.md). The managed environment this audit ran in
can push commits but is blocked from deleting remote branches (403 from the
git proxy), so the deletion itself is a one-paste command for the owner —
everything below has already been verified.

## Verdict

**Every branch except `main` and the active working branch is safe to
delete.** Verification method: ancestor check (`git merge-base
--is-ancestor`), patch-equivalence (`git cherry`), and — because most
branches were squash-merged, which defeats both — a content check of each
branch's headline deliverable against main (the component/doc/data the
branch existed to produce).

Findings that needed action:

- **`claude/github-project-review-nDujE`** carried ONE unmerged commit —
  the AK-48 artwork (`public/strains/ak-48.webp` + its identity line).
  **Rescued:** cherry-picked onto `claude/project-engine-review-w87568`
  before cleanup. Nothing else on the branch is unique.
- **`claude/prisma-migrate-setup`** is genuinely unmerged (adds
  `prisma/MIGRATIONS.md` + migrate scripts) but was deliberately not
  adopted — the project uses `db:push`. Content is one small commit
  (`e995bd1`) recoverable from reflog/PR history if the migrate workflow is
  ever wanted; per the owner's call it goes with the rest.
- **`claude/blend-weighted-engine`** is superseded: its module was brought
  onto the working branch, fixed (B1–B4), tested and wired behind
  `BLEND_MODEL=target`.
- Everything else: squash-merged sessions whose deliverables are all in
  main (verified by content: priority sliders, engine-philosophy doc,
  how-it-works page, collectible cards, artwork batches, bud curation,
  onboarding screens, auth phase 1, SEO pages, legal pages, risk layer,
  describe parser/telemetry, favicon/icons, genetics layout, feedback
  pills, taste blender iterations, age gate + Gas Lit art, …).

## The command (run where you have delete rights)

```bash
git fetch origin --prune
for b in $(git branch -r | grep -v HEAD | sed 's|origin/||' \
    | grep -vE '^(main|claude/project-engine-review-w87568)$'); do
  git push origin --delete "$b"
done
git fetch origin --prune
```

(Adjust the kept-branch pattern when the review branch merges — after that
it can go too.)
