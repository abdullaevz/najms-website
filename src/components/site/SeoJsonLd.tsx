import { buildJsonLd } from '@/lib/seo';
import type { Lang, PageKey } from '@/lib/content';

/** Axtarış sistemləri üçün struktur data (schema.org JSON-LD) */
export async function SeoJsonLd({ lang, page }: { lang: Lang; page: PageKey }) {
  const data = await buildJsonLd(lang, page);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
