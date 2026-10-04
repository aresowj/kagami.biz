import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORY_SLUG_BY_NAME, tagPath, tagSlug } from '../config';

export type Post = CollectionEntry<'blog'>;

/** All blog posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function categorySlug(name: string): string {
  return CATEGORY_SLUG_BY_NAME[name] ?? 'uncategorized';
}

/** Group posts by their (single) category slug. */
export function groupByCategory(posts: Post[]): Map<string, Post[]> {
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    const category = post.data.categories[0] ?? '未分类';
    const slug = categorySlug(category);
    if (!map.has(slug)) map.set(slug, []);
    map.get(slug)!.push(post);
  }
  return map;
}

/** Group posts by tag name. */
export function groupByTag(posts: Post[]): Map<string, Post[]> {
  const map = new Map<string, Post[]>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push(post);
    }
  }
  return map;
}

export function categoryNameForSlug(slug: string): string {
  const entry = Object.entries(CATEGORY_SLUG_BY_NAME).find(([, s]) => s === slug);
  return entry ? entry[0] : slug;
}

export { tagSlug, tagPath };
