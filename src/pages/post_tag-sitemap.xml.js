import { getSortedPosts, groupByTag } from '../lib/posts';
import { xml } from '../lib/sitemap';
import { SITE } from '../config';
import { tagSlug } from '../config';

export async function GET() {
  const posts = await getSortedPosts();
  const entries = [...groupByTag(posts)].map(([name]) => ({
    loc: `${SITE.url}/tag/${tagSlug(name)}/`,
  }));
  return xml(entries);
}
