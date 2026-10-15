import { getSite } from '@/lib/store';
import { PackagesForm } from '@/components/admin/forms';

export default async function Page() {
  const site = await getSite();
  return <PackagesForm initial={site.packages} />;
}
