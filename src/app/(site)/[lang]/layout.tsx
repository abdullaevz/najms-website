import type { Metadata, Viewport } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import '@fontsource-variable/inter';
import '@fontsource-variable/plus-jakarta-sans';
import '../../globals.css';
import { findRedirect, getSite } from '@/lib/store';
import { isLang, tr } from '@/lib/content';
import { buildMetadata, buildViewport } from '@/lib/seo';
import { Effects } from '@/components/site/Effects';
import { Cosmos } from '@/components/site/Cosmos';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Analytics } from '@/components/site/Analytics';
import { resolveHref } from '@/lib/links';

export const dynamic = 'force-dynamic';

export async function generateViewport(): Promise<Viewport> {
  return buildViewport();
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return buildMetadata(lang, 'home');
}

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) {
    // /köhnə-ünvan kimi tək seqmentli yollar üçün admin paneldəki yönləndirmə
    const r = await findRedirect(`/${lang}`);
    if (r) (r.permanent ? permanentRedirect : redirect)(r.to);
    notFound();
  }
  const site = await getSite();
  const { settings, nav } = site;
  // Gizlədilmiş bölmənin menyu bəndi göstərilmir
  const hidden = new Set<string>();
  if (!site.services.visible) hidden.add('/services');
  if (!site.packages.visible) hidden.add('/packages');
  if (!site.contact.visible) hidden.add('/contact');
  if (!site.partners.visible) hidden.add('/partners');
  const items = nav.items
    .filter((i) => i.visible && !hidden.has(i.href))
    .map((i) => ({ id: i.id, label: tr(i.label, lang), href: resolveHref(i.href, lang) }));
  return (
    <html lang={lang} style={{ '--accent': settings.theme.accent, '--gold': settings.theme.gold } as React.CSSProperties}>
      <body className="flex min-h-screen flex-col">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="blob" style={{ width: 420, height: 420, background: 'var(--accent)', left: -120, top: 40, opacity: 0.26 }} />
          <div className="blob" style={{ width: 360, height: 360, background: 'var(--gold)', right: -100, top: '45%', opacity: 0.14, animationDelay: '-6s' }} />
          <div className="blob" style={{ width: 420, height: 420, background: 'var(--accent)', left: '30%', bottom: -120, opacity: 0.14, animationDelay: '-11s' }} />
        </div>
        {site.seo.analytics.gtm && process.env.NODE_ENV === 'production' && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${site.seo.analytics.gtm}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>
        )}
        <Cosmos />
        <Header
          lang={lang}
          brand={{ name: settings.brandName, pill: settings.brandPill }}
          items={items}
          cta={{ label: tr(nav.cta.label, lang), href: resolveHref(nav.cta.href, lang) }}
        />
        <main className="flex-1">{children}</main>
        <Footer data={site.footer} settings={settings} lang={lang} />
        <Effects />
        <Analytics a={site.seo.analytics} />
      </body>
    </html>
  );
}
