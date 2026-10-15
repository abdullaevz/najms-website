import { notFound } from 'next/navigation';
import { getSite } from '@/lib/store';
import { isLang } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { SeoJsonLd } from '@/components/site/SeoJsonLd';
import { Hero } from '@/components/site/Hero';
import { Services } from '@/components/site/Services';
import { Packages } from '@/components/site/Packages';
import { Partners } from '@/components/site/Partners';
import { Contact } from '@/components/site/Contact';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return buildMetadata(lang, 'home');
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const site = await getSite();
  const on = (s: { visible: boolean; showOnHome: boolean }) => s.visible && s.showOnHome;
  return (
    <>
      <SeoJsonLd lang={lang} page="home" />
      {site.hero.visible && <Hero hero={site.hero} settings={site.settings} lang={lang} />}
      {on(site.services) && <Services data={site.services} lang={lang} />}
      {on(site.packages) && <Packages data={site.packages} lang={lang} />}
      {on(site.partners) && <Partners data={site.partners} lang={lang} />}
      {on(site.contact) && <Contact data={site.contact} services={site.services} settings={site.settings} lang={lang} />}
    </>
  );
}
