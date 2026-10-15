import { getSite } from '@/lib/store';
import { SettingsForm } from '@/components/admin/forms';

export default async function Page() {
  const site = await getSite();
  return <SettingsForm initial={site.settings} />;
}
