# AGENTS.md

## Project

Astro static blog for `kagami.biz`. Content is a migrated WordPress export.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Test (route parity): `npm test`
- Re-run content migration: `npm run migrate`

Always run `npm run build` then `npm test` before committing.

## Conventions

- Static output only; no SSR adapters.
- `trailingSlash: 'always'` and `build.format: 'directory'`. Every internal
  link must end in `/`.
- Post URLs keep the legacy `/YYYY/MM/DD/slug/` shape.
- Tag/category slugs must match WordPress exactly, including lowercase
  percent-encoding for CJK. Always build tag URLs with `tagSlug()` from
  `src/config.ts` rather than encoding inline.
- The whole visual design lives in `src/layouts/Base.astro` using CSS custom
  properties (`--paper`, `--ink`, `--accent`, …). Reuse those variables in
  component styles; do not introduce new hard-coded colours.
- Do not hand-edit generated files under `src/content/`; regenerate them with
  `npm run migrate` and keep `scripts/migrate.mjs` as the source of truth.

## Deployment

Cloudflare Pages. Build command `npm run build`, output `dist`. See
`docs/cloudflare-pages.md`.
