# 終ノ空 · kagami.biz

Personal blog about anime, games, literature, and translation. Built with
[Astro](https://astro.build) and deployed to [Cloudflare Pages](https://pages.cloudflare.com).

## Stack

- **Astro 5** static output, directory build format, trailing slashes
- **@astrojs/rss** feed at `/feed/index.xml`
- **@astrojs/sitemap** plus legacy Yoast-compatible sitemaps
- Content collections for posts and pages

## Commands

| Command           | Action                                    |
| ----------------- | ----------------------------------------- |
| `npm install`     | Install dependencies                      |
| `npm run dev`     | Start the dev server at `localhost:4321`  |
| `npm run build`   | Build the production site to `dist/`      |
| `npm run preview` | Preview the production build              |
| `npm test`        | Verify route parity against legacy routes |
| `npm run migrate` | Re-extract content from the WordPress mirror |

## Structure

```
src/
  config.ts                 site metadata, nav, categories, tag slugs
  content/
    config.ts               content collection schemas
    blog/*.md                71 posts
    pages/*.md               4 standalone pages
  layouts/
    Base.astro              global shell + theme (the whole design system)
    PostLayout.astro        article layout
  components/               PostCard, PostList, ListHead
  lib/                      dates, post grouping, sitemap helpers
  pages/
    index.astro             homepage (paginated)
    page/[page].astro       homepage pagination
    [year]/[month]/[day]/[slug].astro   posts
    [page].astro            standalone pages
    category/, tag/         archives with pagination
    feed/, *-sitemap.xml.js feeds + sitemaps
    rss.xml.js, 404.astro
scripts/migrate.mjs         WordPress mirror → content collections
tests/verify-routes.mjs     route parity test
```

## Deployment

See [docs/cloudflare-pages.md](docs/cloudflare-pages.md). Build command
`npm run build`, output directory `dist`.

## Content

Posts live in `src/content/blog/` as Markdown with HTML preserved from the
original WordPress export. Frontmatter is validated by the schema in
`src/content/config.ts`.
