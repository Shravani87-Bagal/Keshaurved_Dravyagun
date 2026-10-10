# Dravyaguna-AI Backend (Phase 1–2)

Node.js + Express + PostgreSQL. Phase 1–2 covers schema, herb import, weighted single-query search, and load testing.

## Local setup

1. Start PostgreSQL: `docker compose up -d`
2. Copy `.env.example` → `.env` and set `DATABASE_URL`, `JWT_SECRET`
3. `npm install`
4. `npm run migrate`
5. `npm run import:frontend -- --fresh`
6. `npm run seed`
7. `npm run dev`

## Phase 2 benchmark

With the server running on port 4000:

```bash
npm run loadtest:search
```

If DB p95 fails the gate:

```bash
npm run explain:search
```

## Production (Supabase)

- Use the Supabase **connection string** as `DATABASE_URL` (pooler URL for serverless if applicable).
- Enable **daily backups** in Supabase (document retention in ops runbook).
- Store herb images in **Supabase Storage**; only URLs in `herbs.image_url` (Phase 3+ upload routes).

## Schema notes

- `herb_mala` matches `herb_dhatu`: `(herb_id, mala_term_id, score 0–5)` — no direction/effect column.
- Only `herb_dosha_actions` uses pacifies/increases.

## Scaling note

Scoring weights use an in-memory TTL cache (`weightsCache.js`). Move to **Redis** when running multiple app instances.
