import { getSortedPosts, groupByCategory } from '../lib/posts';
import { xml } from '../lib/sitemap';
import { SITE } from '../config';

export async function GET() {
  const posts = await getSortedPosts();
  const entries = [...groupByCategory(posts)].map(([slug]) => ({
    loc: `${SITE.url}/category/${slug}/`,
  }));
  return xml(entries);
}
