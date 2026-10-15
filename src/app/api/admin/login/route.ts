import { adminConfigured, checkPassword, createSession } from '@/lib/auth';
import { clientIp, hit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!adminConfigured()) return Response.json({ error: 'Admin quraşdırılmayıb (.env.local)' }, { status: 503 });
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== req.headers.get('host')) return Response.json({ error: 'Yanlış mənşə' }, { status: 403 });
  if (!hit(`login:${clientIp(req)}`, 8, 10 * 60_000)) return Response.json({ error: 'Çox cəhd. Bir az sonra yenidən yoxlayın.' }, { status: 429 });
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  if (typeof body?.password !== 'string' || !checkPassword(body.password)) {
    return Response.json({ error: 'Parol yanlışdır' }, { status: 401 });
  }
  await createSession();
  return Response.json({ ok: true });
}
