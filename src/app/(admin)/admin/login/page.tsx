import { redirect } from 'next/navigation';
import { adminConfigured, isAdmin } from '@/lib/auth';
import { Logo } from '@/components/site/Logo';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin');
  const ok = adminConfigured();
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="glass w-full max-w-sm p-8">
        <Logo name="najms" pill="admin" />
        <h1 className="mb-5 mt-6 font-display text-xl font-bold">Admin girişi</h1>
        {ok ? (
          <LoginForm />
        ) : (
          <p className="text-sm text-gold">
            Admin hələ quraşdırılmayıb. <code>.env.local</code> faylında <code>ADMIN_PASSWORD</code> və <code>SESSION_SECRET</code> (ən azı 24 simvol) təyin edib serveri yenidən başladın.
          </p>
        )}
      </div>
    </main>
  );
}
