# Migration notes

The blog was originally a WordPress site. The repository previously contained a
static mirror of the rendered WordPress HTML (`index.html` files, `wp-content/`,
`wp-includes/`, Yoast sitemaps). This Astro project replaces that mirror.

## What was migrated

`scripts/migrate.mjs` walks the legacy HTML mirror and produces:

- `src/content/blog/*.md` — 71 posts, with frontmatter (title, description,
  dates, category, tags, cover) and the original `entry-content` HTML preserved.
- `src/content/pages/*.md` — 4 pages (`about`, `memory`, `avg-memo`,
  `privacy-policy`).
- `public/wp-content/uploads/**` — all media referenced by the posts.
- `tests/fixtures/source-routes.json` — the set of post/page routes.

The legacy source tree is expected beside this project at `../kagami.biz`. Run:

```sh
npm run migrate
```

with `KAGAMI_SOURCE` set to override the source directory.

## Route parity

`tests/verify-routes.mjs` compares the built `dist/` output against the legacy
Yoast sitemaps (`tests/fixtures/*-sitemap.xml`) and asserts that:

- every legacy post, page, category, and tag route exists,
- the homepage and its pagination exist,
- no route segment is double-encoded.

Tag and category slugs reproduce the WordPress slugs exactly, including the
lowercase percent-encoding used for CJK tag names.

## Content model

Post URLs keep their original `/YYYY/MM/DD/slug/` shape, so they are generated
by the nested dynamic route `src/pages/[year]/[month]/[day]/[slug].astro`.
