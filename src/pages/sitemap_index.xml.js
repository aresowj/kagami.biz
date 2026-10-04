export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>/post-sitemap.xml</loc></sitemap><sitemap><loc>/page-sitemap.xml</loc></sitemap><sitemap><loc>/category-sitemap.xml</loc></sitemap><sitemap><loc>/post_tag-sitemap.xml</loc></sitemap></sitemapindex>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
