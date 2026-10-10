import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const SOURCE = process.env.KAGAMI_SOURCE
  ? path.resolve(process.env.KAGAMI_SOURCE)
  : path.resolve(PROJECT_ROOT, '..', 'kagami.biz');
const BLOG_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'blog');
const PAGES_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'pages');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

const SITE = 'https://kagami.biz';

/** Decode the handful of HTML entities WordPress emits in attributes/text. */
function decodeEntities(input) {
  return input
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&hellip;/g, '…')
    .replace(/&raquo;/g, '»')
    .replace(/&laquo;/g, '«')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201c')
    .replace(/&#8221;/g, '\u201d')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014');
}

function meta(html, prop) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)="${prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*content="([^"]*)"`,
    'i'
  );
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : null;
}

function firstMatch(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

/** Extract inner HTML of <div class="entry-content"> ... matching closing div. */
function extractEntryContent(html) {
  const marker = html.search(/<div[^>]*class="[^"]*\bentry-content\b[^"]*"[^>]*>/i);
  if (marker === -1) return null;
  const openEnd = html.indexOf('>', marker) + 1;
  let depth = 1;
  let i = openEnd;
  const divRe = /<div\b[^>]*>|<\/div>/gi;
  divRe.lastIndex = openEnd;
  let m;
  while ((m = divRe.exec(html)) !== null) {
    if (m[0].startsWith('</')) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return html.slice(openEnd, m.index);
    }
    i = m.index;
  }
  return null;
}

/** Extract the entry-title text. */
function extractTitle(html) {
  const m = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (m) return decodeEntities(m[1].replace(/<[^>]+>/g, '').trim());
  return meta(html, 'og:title');
}

/** Extract categories/tags from entry-footer. */
function extractTerms(html, kind) {
  const re =
    kind === 'category'
      ? /<span[^>]*class="[^"]*cat-links[^"]*"[^>]*>([\s\S]*?)<\/span>/i
      : /<span[^>]*class="[^"]*tags-links[^"]*"[^>]*>([\s\S]*?)<\/span>/i;
  const block = firstMatch(html, re);
  if (!block) return [];
  const terms = [];
  const linkRe = /href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = linkRe.exec(block)) !== null) {
    const text = decodeEntities(m[2].replace(/<[^>]+>/g, '').trim());
    if (text) terms.push({ href: m[1], name: text });
  }
  return terms;
}

/** First paragraph text used as a description fallback. */
function extractDescription(html) {
  const og = meta(html, 'og:description');
  return og || '';
}

/** Remove WP artefacts: the more-tag, leftover shortcodes, stray anchor images. */
function cleanContent(content) {
  if (!content) return content;
  let out = content;
  out = out.replace(/<span[^>]*id="more-\d+"[^>]*><\/span>/gi, '');
  // Resolve relative upload links to site-root absolute (Astro serves public/).
  out = out.replace(/https?:\/\/(?:www\.)?kagami\.biz\/wp-content/gi, '/wp-content');
  out = out.replace(/srcset="[^"]*"/gi, '');
  out = out.replace(/sizes="[^"]*"/gi, '');
  out = out.replace(/decoding="async"/gi, '');
  out = out.replace(/loading="lazy"/gi, '');
  out = out.replace(/fetchpriority="[^"]*"/gi, '');
  return out.trim();
}

/** Pick the best cover image: og:image if it lives on the site. */
function extractCover(html) {
  const og = meta(html, 'og:image');
  if (!og) return null;
  return og.replace(/^https?:\/\/(?:www\.)?kagami\.biz/gi, '');
}

async function walk(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'wp-content' || entry.name === 'wp-includes') continue;
      await walk(full, acc);
    } else if (entry.isFile() && entry.name.toLowerCase() === 'index.html') {
      acc.push(full);
    }
  }
  return acc;
}

function isPostUrl(url) {
  return /^\/\d{4}\/\d{2}\/\d{2}\/.+\/$/.test(url);
}

function isPageUrl(url) {
  return /^\/(?:about|memory|avg-memo|privacy-policy)\/$/.test(url);
}

async function copyUploads() {
  const srcUploads = path.join(SOURCE, 'wp-content', 'uploads');
  const destUploads = path.join(PUBLIC_DIR, 'wp-content', 'uploads');
  await fs.mkdir(destUploads, { recursive: true });
  await fs.cp(srcUploads, destUploads, { recursive: true });
}

/**
 * The static mirror missed a handful of uploads that the live site still
 * serves. Fetch any referenced-but-absent images from the live origin so the
 * rebuilt site has no broken media.
 */
async function fetchMissingUploads(referenced) {
  const destUploads = path.join(PUBLIC_DIR, 'wp-content', 'uploads');
  const missing = referenced.filter((r) => !existsSync(path.join(PUBLIC_DIR, r)));
  let fetched = 0;
  for (const rel of missing) {
    const url = `https://kagami.biz${rel}`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const dest = path.join(PUBLIC_DIR, rel);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, buf);
      fetched += 1;
    } catch {
      // Leave the reference intact; it mirrors the original site's behaviour.
    }
  }
  return { total: missing.length, fetched };
}

/**
 * Rewrite resized image variants (e.g. `-300x300.jpg`) to their full-size
 * original when the original is available, then download any still-missing
 * uploads from the live site.
 */
async function resolveAndFetchImages() {
  const referenced = new Set();
  for (const dir of [BLOG_DIR, PAGES_DIR]) {
    for (const f of await fs.readdir(dir)) {
      const file = path.join(dir, f);
      let text = await fs.readFile(file, 'utf8');
      const refs = [...text.matchAll(/\/wp-content\/uploads\/[^"'\s)]+/g)].map((m) => m[0]);
      let changed = false;
      for (const ref of refs) {
        const ext = path.extname(ref);
        const base = ref.slice(0, -ext.length).replace(/-\d+x\d+$/, '') + ext;
        if (base !== ref && existsSync(path.join(PUBLIC_DIR, base))) {
          text = text.split(ref).join(base);
          changed = true;
        }
      }
      if (changed) await fs.writeFile(file, text, 'utf8');
      for (const m of text.matchAll(/\/wp-content\/uploads\/[^"'\s)]+/g)) referenced.add(m[0]);
    }
  }
  const result = await fetchMissingUploads([...referenced]);
  console.log(`Media: ${result.fetched}/${result.total} missing uploads fetched from live site.`);
}

async function main() {
  const files = await walk(SOURCE);
  const posts = [];
  const pages = [];
  const routes = [];

  for (const file of files) {
    const html = await fs.readFile(file, 'utf8');
    const canonical = meta(html, 'og:url') || firstMatch(html, /rel="canonical" href="([^"]*)"/i);
    if (!canonical) continue;

    let url = canonical;
    if (!url.startsWith('/')) {
      url = url.replace(/^https?:\/\/(?:www\.)?kagami\.biz/i, '');
    }
    if (!url.endsWith('/')) url += '/';

    const bodyClass = (html.match(/<body[^>]*class="([^"]*)"/i) || [, ''])[1];
    const isArchive = /\barchive\b/.test(bodyClass) || /\bsearch\b/.test(bodyClass);
    const isPost = !isArchive && (isPostUrl(url) || /\bsingle-post\b/.test(bodyClass));
    const isPage = !isArchive && (isPageUrl(url) || /\bpage-id-\d+/.test(bodyClass));

    if (!isPost && !isPage) continue;

    const content = cleanContent(extractEntryContent(html));
    const title = extractTitle(html);
    if (!title) continue;

    const dateRaw = meta(html, 'article:published_time');
    const modifiedRaw = meta(html, 'article:modified_time');
    const categories = extractTerms(html, 'category').map((t) => t.name);
    const tags = extractTerms(html, 'tag').map((t) => t.name);
    const description = extractDescription(html).slice(0, 280);
    const cover = extractCover(html);

    const record = {
      url,
      title,
      description,
      date: dateRaw,
      modified: modifiedRaw,
      categories,
      tags,
      cover,
      content,
    };

    routes.push(url);
    if (isPost) posts.push(record);
    else pages.push(record);
  }

  // Emit markdown files.
  await fs.rm(BLOG_DIR, { recursive: true, force: true });
  await fs.rm(PAGES_DIR, { recursive: true, force: true });
  await fs.mkdir(BLOG_DIR, { recursive: true });
  await fs.mkdir(PAGES_DIR, { recursive: true });

  const slugFor = (url) => url.replace(/^\/|\/$/g, '').replace(/\//g, '-');

  for (const post of posts) {
    const slug = slugFor(post.url);
    const fm = [
      '---',
      `title: ${JSON.stringify(post.title)}`,
      `description: ${JSON.stringify(post.description)}`,
      `date: ${JSON.stringify(post.date || '')}`,
      `updated: ${JSON.stringify(post.modified || post.date || '')}`,
      `routeSlug: ${JSON.stringify(slug)}`,
      `url: ${JSON.stringify(post.url)}`,
      `categories: ${JSON.stringify(post.categories)}`,
      `tags: ${JSON.stringify(post.tags)}`,
      `cover: ${JSON.stringify(post.cover || '')}`,
      '---',
      '',
    ].join('\n');
    await fs.writeFile(path.join(BLOG_DIR, `${slug}.md`), fm + (post.content || '') + '\n', 'utf8');
  }

  for (const page of pages) {
    const slug = page.url.replace(/^\/|\/$/g, '') || 'home';
    const fm = [
      '---',
      `title: ${JSON.stringify(page.title)}`,
      `description: ${JSON.stringify(page.description)}`,
      `routeSlug: ${JSON.stringify(slug)}`,
      `url: ${JSON.stringify(page.url)}`,
      '---',
      '',
    ].join('\n');
    await fs.writeFile(path.join(PAGES_DIR, `${slug}.md`), fm + (page.content || '') + '\n', 'utf8');
  }

  await copyUploads();

  await resolveAndFetchImages();

  await fs.writeFile(
    path.join(PROJECT_ROOT, 'tests', 'fixtures', 'source-routes.json'),
    JSON.stringify(routes.sort(), null, 2),
    'utf8'
  );

  console.log(`Extracted ${posts.length} posts, ${pages.length} pages, ${routes.length} routes.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});