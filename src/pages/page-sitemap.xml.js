import { getCollection } from 'astro:content';
import { xml } from '../lib/sitemap';
import { SITE } from '../config';

export async function GET() {
  const pages = await getCollection('pages');
  const entries = [
    { loc: `${SITE.url}/` },
    ...pages.map((p) => ({ loc: `${SITE.url}${p.data.url}` })),
  ];
  return xml(entries);
}
