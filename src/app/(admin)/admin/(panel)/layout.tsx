import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { listMessages } from '@/lib/store';
import { AdminNav } from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/admin/login');
  const unread = (await listMessages()).filter((m) => !m.read).length;
  return (
    <div className="min-h-screen">
      <AdminNav unread={unread} />
      <main className="px-4 py-8 md:ml-64 md:px-8">{children}</main>
    </div>
  );
}
