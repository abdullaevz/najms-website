import type { MetadataRoute } from 'next';
import { getSite, siteModified } from '@/lib/store';
import { LANGS, PAGE_KEYS } from '@/lib/content';
import { PAGE_PATH, baseUrl, resolvePage } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  if (!site.seo.sitemap.enabled || !site.seo.robots.index) return [];
  const base = baseUrl(site);
  const last = await siteModified();
  const out: MetadataRoute.Sitemap = [];
  for (const key of PAGE_KEYS) {
    const r = resolvePage(site, 'az', key);
    if (!r.indexable) continue;
    for (const l of LANGS) {
      out.push({
        url: `${base}/${l}${PAGE_PATH[key]}`,
        lastModified: last,
        changeFrequency: site.seo.sitemap.changeFreq,
        priority: key === 'home' ? 1 : 0.8,
        alternates: site.seo.sitemap.hreflang
          ? { languages: Object.fromEntries(LANGS.map((x) => [x, `${base}/${x}${PAGE_PATH[key]}`])) }
          : undefined,
      });
    }
  }
  return out;
}
