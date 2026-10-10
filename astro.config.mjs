import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kagami.biz',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/page/') &&
        !page.endsWith('/category-sitemap.xml') &&
        !page.endsWith('/post-sitemap.xml') &&
        !page.endsWith('/page-sitemap.xml') &&
        !page.endsWith('/post_tag-sitemap.xml') &&
        !page.endsWith('/sitemap_index.xml'),
    }),
  ],
  build: { format: 'directory' },
});
