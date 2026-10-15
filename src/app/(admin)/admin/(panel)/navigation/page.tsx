import { getSite } from '@/lib/store';
import { NavForm } from '@/components/admin/forms';

export default async function Page() {
  const site = await getSite();
  return <NavForm initial={site.nav} />;
}
