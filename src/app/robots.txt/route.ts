import { getSite } from '@/lib/store';
import { baseUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function GET() {
  const site = await getSite();
  const { robots, sitemap } = site.seo;
  const lines: string[] = ['User-agent: *'];
  if (!robots.index) {
    lines.push('Disallow: /');
  } else {
    lines.push('Allow: /');
    for (const p of ['/admin', '/api', ...robots.disallow.map((d) => d.path)]) lines.push(`Disallow: ${p}`);
  }
  if (robots.extra.trim()) lines.push('', robots.extra.trim());
  if (robots.index && sitemap.enabled && site.settings.siteUrl) lines.push('', `Sitemap: ${baseUrl(site)}/sitemap.xml`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}
