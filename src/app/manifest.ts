import type { MetadataRoute } from 'next';
import { getSite } from '@/lib/store';
import { tr } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings, seo } = await getSite();
  return {
    name: settings.brandName,
    short_name: settings.brandName,
    description: tr(seo.defaultDescription, 'az'),
    start_url: '/az',
    display: 'standalone',
    background_color: '#0b1628',
    theme_color: seo.themeColor,
    icons: [{ src: seo.favicon || '/icon.svg', sizes: 'any' }],
  };
}
