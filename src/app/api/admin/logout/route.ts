import { destroySession, guardAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  await destroySession();
  return Response.json({ ok: true });
}
