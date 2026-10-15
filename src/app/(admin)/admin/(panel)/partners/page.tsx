import { getSite } from '@/lib/store';
import { PartnersForm } from '@/components/admin/forms';

export default async function Page() {
  const site = await getSite();
  return <PartnersForm initial={site.partners} />;
}
