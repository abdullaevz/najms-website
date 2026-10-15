import { getSite } from '@/lib/store';
import { ServicesForm } from '@/components/admin/forms';

export default async function Page() {
  const site = await getSite();
  return <ServicesForm initial={site.services} />;
}
