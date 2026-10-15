import { getSite } from '@/lib/store';
import { ContactForm_ } from '@/components/admin/forms';

export default async function Page() {
  const site = await getSite();
  return <ContactForm_ initial={site.contact} />;
}
