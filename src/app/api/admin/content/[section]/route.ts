import { ZodError } from 'zod';
import { guardAdmin } from '@/lib/auth';
import { isSection } from '@/lib/content';
import { saveSection } from '@/lib/store';

export async function PUT(req: Request, { params }: { params: Promise<{ section: string }> }) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const { section } = await params;
  if (!isSection(section)) return Response.json({ error: 'Bölmə tapılmadı' }, { status: 404 });
  const body = await req.json().catch(() => null);
  try {
    const saved = await saveSection(section, body);
    return Response.json({ ok: true, data: saved });
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json(
        { error: 'Məlumat yanlışdır', issues: e.issues.map((i) => ({ path: i.path.join('.'), message: i.message })) },
        { status: 400 },
      );
    }
    console.error(e);
    return Response.json({ error: 'Server xətası' }, { status: 500 });
  }
}
