import { notFound } from 'next/navigation';
import { getSite } from '@/lib/store';
import { isLang } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { SeoJsonLd } from '@/components/site/SeoJsonLd';
import { Packages } from '@/components/site/Packages';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return buildMetadata(lang, 'packages');
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const site = await getSite();
  if (!site.packages.visible) notFound();
  return (
    <>
      <SeoJsonLd lang={lang} page="packages" />
      <Packages data={site.packages} lang={lang} h1 />
    </>
  );
}
