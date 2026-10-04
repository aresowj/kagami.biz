# Cloudflare Pages deployment

This repository is an Astro static site.

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root

The `kagami-biz` Pages project is connected to this GitHub repository
(`production_branch: main`, previews for all branches). Its Build settings must
contain the build command above; if that field is blank, Pages reads
`wrangler.toml` for the output directory, skips the build, and fails with
`Output directory "dist" not found`.

`wrangler.toml` records the Pages output directory for Wrangler-based
deployments.

## Branch previews

Cloudflare Pages builds every non-production branch automatically. Branch
previews are served at:

```
https://<branch-slug>.<project-name>.pages.dev
```

For the `astro-migration` branch this is
`https://astro-migration.kagami-biz.pages.dev`.

## Redirects

`public/_redirects` is copied into `dist/` and applied by Pages. It maps the
legacy feed and sitemap aliases onto the new routes.

Note: do **not** use a `/?s=*` rule to redirect the old WordPress search.
Cloudflare Pages interprets it as a path match on every request and causes an
infinite 301 loop on `/`.

## CJK routes

Cloudflare Pages matches requests against the *decoded* path, so tag page
directories are generated with the raw characters (`dist/tag/百合/`), not with
pre-encoded `%xx` names. Sitemap URLs still use the WordPress lowercase
percent-encoded form.

## Environment

No runtime secrets are required. All content is generated at build time.
