# Compario

Compario is a citation-first optometry school comparison app for web and iOS.
The starter includes a Next.js comparison experience, an Expo iOS app, shared
TypeScript models, and a PostgreSQL schema designed for historical data.

## Run locally

```bash
npm install
npm run dev:web
```

In a second terminal:

```bash
npm run dev:ios
```

Do not use a record for an application decision without reviewing its linked
source and reporting year. Some admissions values are ranges or are marked as
not published because schools do not report every criterion consistently.

## Live web app

The static web app is deployed through GitHub Actions to:

https://jonathangranado.github.io/compario/

## Structure

- `apps/web`: sortable, weighted school comparison
- `apps/mobile`: Expo app targeting iOS
- `packages/data`: shared types and temporary demonstration records
- `database/schema.sql`: normalized PostgreSQL schema with source provenance
- `docs/data-plan.md`: source, ingestion, QA, and launch plan

## Product principles

1. Every value has a source URL, reporting period, and retrieval date.
2. Missing data is shown as unknown, never converted to zero.
3. Estimates and school-reported facts are visually distinct.
4. Historical values remain available when a source is refreshed.
5. A human reviews handbook policies and anomalous imported values.
