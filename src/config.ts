export const SITE = {
  title: '終ノ空',
  titleLatin: 'Kagami',
  description: '坚定步伐。',
  author: '岡崎鏡',
  url: 'https://kagami.biz',
  twitter: '@jogfi2002',
  weibo: 'https://weibo.com/jogfi2002',
  twitterUrl: 'https://twitter.com/jogfi2002',
  startYear: 2010,
};

export const NAV = [
  { label: '首页', href: '/' },
  { label: '一些回忆', href: '/memory/' },
  { label: '关于我', href: '/about/' },
  { label: 'AVG记录', href: '/avg-memo/' },
];

/** Display order + colour key for the primary categories. */
export const CATEGORIES = [
  { slug: 'acg', name: 'ACG', key: 'acg' },
  { slug: 'reading', name: '读书', key: 'reading' },
  { slug: 'translation', name: '翻译', key: 'translation' },
  { slug: 'writing', name: '随笔', key: 'writing' },
  { slug: 'uncategorized', name: '未分类', key: 'uncategorized' },
];

/** The live WordPress site grouped posts by category slug in its URLs. */
export const CATEGORY_SLUG_BY_NAME = {
  ACG: 'acg',
  读书: 'reading',
  翻译: 'translation',
  随笔: 'writing',
  未分类: 'uncategorized',
};

/**
 * Percent-encode a tag name the same way WordPress does in its URLs:
 * ASCII tags are lowercased, CJK uses lowercase percent-escapes.
 */
/**
 * The filesystem/route form of a tag slug. WordPress used lowercase,
 * percent-encoded slugs; Cloudflare Pages matches on the decoded path, so the
 * generated directory must contain the raw characters (lowercased for ASCII,
 * and CJK left as-is). Browsers and Cloudflare percent-encode on request.
 */
export function tagPath(name) {
  return name.replace(/[''\u2019]/g, '').toLowerCase();
}

/**
 * The percent-encoded slug as WordPress emitted it (lowercase hex), used for
 * sitemap URLs so they match the legacy site exactly.
 */
export function tagSlug(name) {
  return encodeURIComponent(tagPath(name));
}
