import { getSite } from '@/lib/store';
import { HeroForm } from '@/components/admin/forms';

export default async function Page() {
  const site = await getSite();
  return <HeroForm initial={site.hero} />;
}
