# SŌMA — Sensory Sommelier for Cannabis

SŌMA is an AI cannabis sommelier. It is **not** a strain catalogue or another
Leafly clone — it builds a personal sensory taste profile and tells a person
whether a strain on a dispensary menu is right for **them**, before they spend
a cent.

The product never asks _"what is this strain?"_ — it asks the only question
that matters: _"Is this strain right for this person?"_

## What's inside

- **Taste Match Engine** — a deterministic scoring engine (`src/lib/taste-engine.ts`)
  that compares each available strain against a user's taste profile and sorts
  results into Best Match · Closest Alternative · Worth Trying · Risky · Avoid,
  with per-strain aroma / flavour / effect scores and honest risk notes.
- **Optional AI layer** — when `OPENAI_API_KEY` is set, an OpenAI pass rewrites
  the explanations in a sommelier voice. Scores never change, and it falls back
  to the built-in engine on any failure.
- **Pages** — Home, Taste Match (questionnaire → strain input → results), My
  Taste Profile, Strain Comparison, Saved Recommendations (with a feedback
  loop), and About.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL.

## Getting started

```bash
# 1. Configure the environment
cp .env.example .env
#    set DATABASE_URL to your PostgreSQL / Supabase connection string
#    (optionally set OPENAI_API_KEY to enable the AI explanation layer)

# 2. Install dependencies
npm install

# 3. Sync the database schema
npm run db:push

# 4. Run
npm run dev
```

The app runs at `http://localhost:3000`.

## Honesty by design

SŌMA never fantasises. When data is thin it says so, and every recommendation
keeps the caveat that real quality depends on grower, freshness, packaging date
and storage. A SŌMA recommendation is a **sensory match, not a guarantee**.
