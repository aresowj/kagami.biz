import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FIX = path.join(ROOT, 'tests', 'fixtures');
const DIST = path.join(ROOT, 'dist');

const POSTS_PER_PAGE = 9;
const ARCHIVE_PER_PAGE = 10;

function readLocs(file) {
  const xml = fs.readFileSync(path.join(FIX, file), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function normalize(route) {
  let r = route;
  if (!r.endsWith('/')) r += '/';
  return r;
}

function walk(dir, base = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = `${base}/${entry.name}`;
    if (entry.isDirectory()) out.push(...walk(full, rel));
    else if (entry.name === 'index.html') out.push(normalize(rel.replace(/\/index\.html$/, '')));
  }
  return out;
}

const postLocs = readLocs('post-sitemap.xml').filter((l) => /^\/\d{4}\//.test(l));
const pageLocs = readLocs('page-sitemap.xml').filter((l) => l !== '/');
const categoryLocs = readLocs('category-sitemap.xml');
const tagLocs = readLocs('post_tag-sitemap.xml');

const actual = new Set(walk(DIST).map(normalize));

const errors = [];
const check = (route, label) => {
  if (!actual.has(normalize(route))) errors.push(`MISSING ${label}: ${route}`);
};

// 1. Every original post + page must exist.
for (const loc of [...postLocs, ...pageLocs]) check(loc, 'content');
// Homepage.
check('/', 'home');
// Categories.
for (const loc of categoryLocs) check(loc, 'category');
// Tags.
for (const loc of tagLocs) check(loc, 'tag');

// 2. Pagination expectations.
const homePages = Math.ceil(postLocs.length / POSTS_PER_PAGE);
for (let p = 2; p <= homePages; p++) check(`/page/${p}/`, 'home-pagination');

// 3. Sanity: posts count.
if (postLocs.length !== 71) errors.push(`Expected 71 posts, found ${postLocs.length}`);

// 4. No double-encoded segments.
for (const route of actual) {
  if (/%25/i.test(route)) errors.push(`DOUBLE-ENCODED: ${route}`);
}

// Report.
const expected = new Set([
  '/',
  ...postLocs,
  ...pageLocs,
  ...categoryLocs,
  ...tagLocs,
  ...Array.from({ length: homePages - 1 }, (_, i) => `/page/${i + 2}/`),
].map(normalize));

const extras = [...actual].filter((r) => !expected.has(r)).sort();

console.log(`Source posts: ${postLocs.length}`);
console.log(`Source pages: ${pageLocs.length}`);
console.log(`Source categories: ${categoryLocs.length}`);
console.log(`Source tags: ${tagLocs.length}`);
console.log(`Built routes: ${actual.size}`);
console.log(`Archive/extra routes (category/tag pagination, etc.): ${extras.length}`);

if (errors.length) {
  console.error(`\n✗ ${errors.length} route error(s):`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}

console.log('\n✓ All source routes are present in the build.');
