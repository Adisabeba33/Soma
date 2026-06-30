# Database migrations

This project uses **`prisma migrate`** for schema changes. Migrations are
versioned SQL files in `prisma/migrations/` — they're committed to git, so the
exact change every database has received is visible in the diff of any PR.

## Why this exists

We used to run `prisma db push` against each database by hand. That works for
local dev, but on prod it caused an outage: code shipped to main that expected
a new column the prod DB didn't have, every request to that endpoint 500'd, and
the UI rendered as "empty". With `migrate deploy` wired into the build, the DB
is always brought up to date **before** the new code starts serving traffic,
so that class of bug can't happen.

## One-time baseline (do this once, on every existing database)

Because the production database was built with `db push` (no migration history),
we first need to create a **baseline** migration that represents the schema as
it stands today, and mark it as "already applied" on every existing DB.

Run these locally where Prisma's CLI works:

```bash
# 1. Generate the baseline SQL from the current schema.prisma.
mkdir -p prisma/migrations/0_init
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# 2. Mark it as applied on the LOCAL database (it already has all those tables).
npx prisma migrate resolve --applied 0_init

# 3. Mark it as applied on the PROD database too (point DATABASE_URL at prod).
DATABASE_URL="postgresql://...prod..." \
  npx prisma migrate resolve --applied 0_init

# 4. Commit and push the baseline.
git add prisma/migrations/
git commit -m "Add baseline migration (0_init) from current schema"
git push
```

After that, every database has a migration history that starts at `0_init`,
and Prisma's tooling treats that as "the world began here".

## After the baseline — enabling auto-deploy

Once `0_init` is committed AND marked-applied on every DB, change the `build`
script in `package.json` so prod deploys apply pending migrations before the
app starts:

```diff
- "build": "prisma generate && next build",
+ "build": "prisma migrate deploy && prisma generate && next build",
```

`prisma migrate deploy` is the prod-safe runner: it applies any
not-yet-applied migrations in order and never prompts. With the baseline
already marked-applied, the first deploy after this change is a no-op; the
*next* schema change you make will flow through this pipeline automatically.

Hold off on this `build` change until step 3 above is done on every database
the prod app can reach. If `migrate deploy` runs against a DB that doesn't
have the baseline marker, it will try to create tables that already exist
and the deploy will fail.

## Day-to-day workflow

After the baseline is in place, schema changes look like this:

```bash
# 1. Edit prisma/schema.prisma (add/change a field).
# 2. Generate a new migration locally — Prisma writes the SQL and applies it
#    to your dev DB in one step. Use a short, descriptive name.
npx prisma migrate dev --name add_mergedAt
# 3. Commit the new file under prisma/migrations/ along with your code change.
# 4. Open a PR. Merging triggers the deploy, which runs `migrate deploy` and
#    applies the new migration on prod before the new code goes live.
```

That's it. No more "did I remember to `db push`?" — the migration travels with
the code.

## When to still use `db:push`

`prisma db push` is fine for **scratch databases** — quick local experiments
where you're iterating on the schema and don't care about history. Never run
it against prod once migrations are wired up; it bypasses the migration log and
will desync the DB from the recorded history.
