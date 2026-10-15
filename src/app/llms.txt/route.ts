import { getSite } from '@/lib/store';
import { LANGS, tr } from '@/lib/content';
import { PAGE_KEYS, PAGE_PATH, baseUrl, resolvePage } from '@/lib/seo';

export const dynamic = 'force-dynamic';

/** AI axtarış və cavab sistemləri üçün sayt xülasəsi (llms.txt) */
export async function GET() {
  const site = await getSite();
  if (!site.seo.llmsTxt || !site.seo.robots.index) return new Response('Not found', { status: 404 });
  const base = baseUrl(site);
  const { settings } = site;
  const strip = (s: string) => s.replace(/\*+/g, '');
  const out: string[] = [`# ${settings.brandName}`, '', `> ${tr(site.seo.defaultDescription, 'en')}`, ''];
  const contact = [settings.email && `Email: ${settings.email}`, settings.phone && `Phone: ${settings.phone}`, tr(settings.address, 'en') && `Address: ${tr(settings.address, 'en')}`].filter(Boolean);
  if (contact.length) out.push('## Contact', ...contact.map((c) => `- ${c}`), '');
  for (const lang of LANGS) {
    out.push(`## Pages (${lang.toUpperCase()})`);
    for (const key of PAGE_KEYS) {
      const r = resolvePage(site, lang, key);
      if (!r.indexable) continue;
      out.push(`- [${r.title}](${base}/${lang}${PAGE_PATH[key]}): ${r.description}`);
    }
    out.push('');
  }
  if (site.services.visible) {
    out.push('## Services');
    for (const s of site.services.items.filter((i) => i.visible)) out.push(`- ${strip(tr(s.title, 'en'))}: ${strip(tr(s.description, 'en'))}`);
    out.push('');
  }
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
