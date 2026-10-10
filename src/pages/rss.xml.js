import rss from '@astrojs/rss';
import { getSortedPosts } from '../lib/posts';
import { SITE } from '../config';

export async function GET(context) {
  const posts = await getSortedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    customData: `<language>zh-cn</language>`,
    items: posts.map(({ data }) => ({
      title: data.title,
      pubDate: data.date,
      link: data.url,
      description: data.description,
    })),
  });
}
