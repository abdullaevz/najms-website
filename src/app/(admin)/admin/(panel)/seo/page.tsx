import { getSite } from '@/lib/store';
import { SeoForm } from '@/components/admin/SeoForm';

export default async function Page() {
  const site = await getSite();
  const sec = (k: 'services' | 'packages' | 'partners' | 'contact') => ({ title: site[k].title, lead: site[k].lead });
  return (
    <SeoForm
      initial={site.seo}
      siteUrl={site.settings.siteUrl}
      sections={{ services: sec('services'), packages: sec('packages'), partners: sec('partners'), contact: sec('contact') }}
    />
  );
}
