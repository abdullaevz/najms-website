import 'server-only';
import type { Metadata, Viewport } from 'next';
import { getSite } from './store';
import { LANGS, PAGE_KEYS, tr, WEEK_DAYS, type Lang, type PageKey, type SiteContent } from './content';

export { PAGE_KEYS };
export const PAGE_PATH: Record<PageKey, string> = {
  home: '',
  services: '/services',
  packages: '/packages',
  partners: '/partners',
  contact: '/contact',
};

const strip = (s: string) => s.replace(/\*+/g, '').replace(/\s+/g, ' ').trim();
export const baseUrl = (site: SiteContent) => site.settings.siteUrl.replace(/\/+$/, '');
const abs = (site: SiteContent, url: string) => (!url ? '' : /^https?:\/\//.test(url) ? url : `${baseUrl(site)}${url.startsWith('/') ? '' : '/'}${url}`);

/** Səhifənin son (həll olunmuş) başlığı, təsviri və görünürlüyü */
export function resolvePage(site: SiteContent, lang: Lang, key: PageKey) {
  const { seo } = site;
  const pg = seo.pages[key];
  const section = key === 'home' ? null : site[key];
  const own = tr(pg.title, lang).trim();
  let title: string;
  if (key === 'home') {
    title = own || tr(seo.defaultTitle, lang);
  } else {
    const t = own || strip(tr(section!.title, lang));
    const tpl = tr(seo.titleTemplate, lang);
    title = tpl.includes('%s') ? tpl.replace('%s', t) : t;
  }
  const description =
    tr(pg.description, lang).trim() || (section ? strip(tr(section.lead, lang)) : '') || tr(seo.defaultDescription, lang);
  const image = pg.ogImage || seo.ogImage;
  const indexable = seo.robots.index && !pg.noindex && (key === 'home' ? true : site[key].visible);
  return { title, description, image, indexable, path: PAGE_PATH[key] };
}

export async function buildMetadata(lang: Lang, key: PageKey): Promise<Metadata> {
  const site = await getSite();
  const { seo, settings } = site;
  const r = resolvePage(site, lang, key);
  const base = baseUrl(site);
  const other: Lang = lang === 'az' ? 'en' : 'az';
  const url = `${base}/${lang}${r.path}`;
  const image = abs(site, r.image);
  const keywords = tr(seo.keywords, lang).split(',').map((k) => k.trim()).filter(Boolean);

  const v = seo.verification;
  const verifOther: Record<string, string> = {};
  if (v.bing) verifOther['msvalidate.01'] = v.bing;
  if (v.pinterest) verifOther['p:domain_verify'] = v.pinterest;
  if (v.facebook) verifOther['facebook-domain-verification'] = v.facebook;

  const g = seo.geo;
  const geo: Record<string, string> = {};
  if (g.region) geo['geo.region'] = g.region;
  if (g.placename) geo['geo.placename'] = g.placename;
  if (g.latitude && g.longitude) {
    geo['geo.position'] = `${g.latitude};${g.longitude}`;
    geo['ICBM'] = `${g.latitude}, ${g.longitude}`;
  }

  const handle = seo.twitter.handle.replace(/^@?/, '@');
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { absolute: r.title },
    description: r.description,
    keywords: keywords.length ? keywords : undefined,
    applicationName: settings.brandName,
    authors: [{ name: settings.brandName }],
    creator: settings.brandName,
    publisher: settings.brandName,
    icons: { icon: seo.favicon || '/icon.svg' },
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(LANGS.map((l) => [l, `${base}/${l}${r.path}`])), 'x-default': `${base}/az${r.path}` },
    },
    robots: {
      index: r.indexable,
      follow: seo.robots.follow,
      googleBot: {
        index: r.indexable,
        follow: seo.robots.follow,
        'max-snippet': seo.robots.maxSnippet,
        'max-image-preview': seo.robots.maxImagePreview,
        'max-video-preview': seo.robots.maxVideoPreview,
      },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: settings.brandName,
      title: r.title,
      description: r.description,
      locale: lang === 'az' ? 'az_AZ' : 'en_US',
      alternateLocale: other === 'az' ? 'az_AZ' : 'en_US',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? seo.twitter.card : 'summary',
      site: seo.twitter.handle ? handle : undefined,
      title: r.title,
      description: r.description,
      images: image ? [image] : undefined,
    },
    verification: {
      google: v.google || undefined,
      yandex: v.yandex || undefined,
      other: Object.keys(verifOther).length ? verifOther : undefined,
    },
    other: Object.keys(geo).length ? geo : undefined,
  };
}

export async function buildViewport(): Promise<Viewport> {
  const { seo } = await getSite();
  return { themeColor: seo.themeColor };
}

/* ───────── JSON-LD ───────── */
function expandDays(from: string, to: string): string[] {
  const a = WEEK_DAYS.indexOf(from as (typeof WEEK_DAYS)[number]);
  const b = WEEK_DAYS.indexOf(to as (typeof WEEK_DAYS)[number]);
  const out: string[] = [];
  for (let i = a; ; i = (i + 1) % 7) {
    out.push(WEEK_DAYS[i]);
    if (i === b || out.length >= 7) break;
  }
  return out;
}

export async function buildJsonLd(lang: Lang, key: PageKey) {
  const site = await getSite();
  const { seo, settings } = site;
  const base = baseUrl(site);
  const r = resolvePage(site, lang, key);
  const orgId = `${base}/#organization`;
  const b = seo.business;
  const g = seo.geo;
  const graph: Record<string, unknown>[] = [];

  graph.push({
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: settings.brandName,
    inLanguage: lang === 'az' ? 'az-AZ' : 'en-US',
    publisher: { '@id': orgId },
  });

  if (b.enabled) {
    const sameAs = [...settings.social.map((s) => s.url), ...b.sameAs.map((s) => s.url)].filter(Boolean);
    const org: Record<string, unknown> = {
      '@type': b.type,
      '@id': orgId,
      name: settings.brandName,
      url: base,
      description: tr(seo.defaultDescription, lang),
      email: settings.email || undefined,
      telephone: settings.phone || undefined,
      logo: b.logo ? abs(site, b.logo) : undefined,
      image: seo.ogImage ? abs(site, seo.ogImage) : b.logo ? abs(site, b.logo) : undefined,
      legalName: b.legalName || undefined,
      foundingDate: b.foundingDate || undefined,
      priceRange: b.priceRange || undefined,
      sameAs: sameAs.length ? sameAs : undefined,
      areaServed: b.areaServed.length ? b.areaServed.map((a) => a.name).filter(Boolean) : undefined,
      contactPoint: settings.phone || settings.email
        ? [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: settings.phone || undefined, email: settings.email || undefined, availableLanguage: ['az', 'en'] }]
        : undefined,
    };
    if (b.streetAddress || b.locality || b.country) {
      org.address = {
        '@type': 'PostalAddress',
        streetAddress: b.streetAddress || undefined,
        addressLocality: b.locality || undefined,
        addressRegion: b.region || undefined,
        postalCode: b.postalCode || undefined,
        addressCountry: b.country || undefined,
      };
    }
    if (b.type !== 'Organization' && b.type !== 'Corporation') {
      if (g.latitude && g.longitude) org.geo = { '@type': 'GeoCoordinates', latitude: Number(g.latitude), longitude: Number(g.longitude) };
      if (g.mapUrl) org.hasMap = g.mapUrl;
      if (b.hours.length) {
        org.openingHoursSpecification = b.hours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: expandDays(h.from, h.to),
          opens: h.opens,
          closes: h.closes,
        }));
      }
    }
    graph.push(JSON.parse(JSON.stringify(org)));
  }

  const crumbs = [{ name: settings.brandName, url: `${base}/${lang}` }];
  if (key !== 'home') crumbs.push({ name: strip(tr(site[key].title, lang)) || key, url: `${base}/${lang}${r.path}` });
  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
  });

  graph.push({ '@type': 'WebPage', '@id': `${base}/${lang}${r.path}#webpage`, url: `${base}/${lang}${r.path}`, name: r.title, description: r.description, inLanguage: lang === 'az' ? 'az-AZ' : 'en-US', isPartOf: { '@id': `${base}/#website` } });

  if (key === 'services') {
    graph.push({
      '@type': 'ItemList',
      itemListElement: site.services.items
        .filter((s) => s.visible)
        .map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Service', name: strip(tr(s.title, lang)), description: strip(tr(s.description, lang)), provider: { '@id': orgId } },
        })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
