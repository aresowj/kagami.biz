# Cloudflare Pages deployment

This repository is an Astro static site.

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root

`wrangler.toml` records the Pages output directory for Wrangler-based
deployments. Cloudflare Pages Git integration still needs the build command set
in the Pages project's **Build settings**; if that field is blank, Pages skips
the Astro build and fails because `dist/` does not exist.

## Branch previews

Cloudflare Pages builds every non-production branch automatically when the Git
integration is enabled. Branch previews are served at:

```
https://<branch-slug>.<project-name>.pages.dev
```

For the `astro-migration` branch this is:

```
https://astro-migration.kagami-biz.pages.dev
```

## Redirects

`public/_redirects` is copied into `dist/` and applied by Pages. It maps the
legacy WordPress search endpoint and sitemap aliases onto the new routes.

## Environment

No runtime secrets are required. All content is generated at build time.
