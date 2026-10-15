import { getSite } from '@/lib/store';
import { FooterForm } from '@/components/admin/forms';

export default async function Page() {
  const site = await getSite();
  return <FooterForm initial={site.footer} />;
}
