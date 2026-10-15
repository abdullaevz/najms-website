// data/site.json faylının sxemə uyğunluğunu yoxlayır: npm run check:content
import { readFileSync } from 'node:fs';
import { z } from 'zod';

const L = z.object({ az: z.string(), en: z.string() });
const raw = JSON.parse(readFileSync(new URL('../data/site.json', import.meta.url), 'utf8'));

const sections = ['settings', 'nav', 'hero', 'services', 'packages', 'contact', 'partners', 'seo', 'footer'];
let ok = true;
for (const k of sections) {
  if (!(k in raw)) {
    console.error(`✗ "${k}" bölməsi yoxdur`);
    ok = false;
  }
}

// Hər yerdə AZ və EN mətnlərinin dolu olduğunu yoxla (boş tərcümələri tapmaq üçün)
const empty = [];
(function walk(node, path) {
  if (node && typeof node === 'object') {
    if (L.safeParse(node).success && Object.keys(node).length === 2) {
      if ((!node.az.trim() || !node.en.trim()) && !path.startsWith('site.seo.pages')) empty.push(path); // SEO səhifə sahələri ixtiyaridir
      return;
    }
    for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
  }
})(raw, 'site');

if (empty.length) {
  console.warn(`! ${empty.length} yerdə AZ/EN mətnlərindən biri boşdur:`);
  empty.slice(0, 20).forEach((p) => console.warn('  -', p));
}
console.log(ok ? '✓ data/site.json strukturu düzgündür' : '✗ struktur xətası');
process.exit(ok ? 0 : 1);
