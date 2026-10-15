import { notFound } from 'next/navigation';
import { getSite } from '@/lib/store';
import { isLang } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { SeoJsonLd } from '@/components/site/SeoJsonLd';
import { Services } from '@/components/site/Services';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return buildMetadata(lang, 'services');
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const site = await getSite();
  if (!site.services.visible) notFound();
  return (
    <>
      <SeoJsonLd lang={lang} page="services" />
      <Services data={site.services} lang={lang} h1 />
    </>
  );
}
