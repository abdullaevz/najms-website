import { notFound } from 'next/navigation';
import { getSite } from '@/lib/store';
import { isLang } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { SeoJsonLd } from '@/components/site/SeoJsonLd';
import { Contact } from '@/components/site/Contact';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return buildMetadata(lang, 'contact');
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const site = await getSite();
  if (!site.contact.visible) notFound();
  return (
    <>
      <SeoJsonLd lang={lang} page="contact" />
      <Contact data={site.contact} services={site.services} settings={site.settings} lang={lang} h1 />
    </>
  );
}
