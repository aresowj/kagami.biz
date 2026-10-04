import { getSortedPosts } from '../lib/posts';
import { xml } from '../lib/sitemap';
import { SITE } from '../config';

export async function GET() {
  const posts = await getSortedPosts();
  const entries = [
    { loc: `${SITE.url}/`, lastmod: posts[0]?.data.date.toISOString() },
    ...posts.map((p) => ({ loc: `${SITE.url}${p.data.url}`, lastmod: p.data.date.toISOString() })),
  ];
  return xml(entries);
}
