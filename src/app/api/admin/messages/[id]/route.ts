import { guardAdmin } from '@/lib/auth';
import { deleteMessage, updateMessage } from '@/lib/store';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { read?: unknown } | null;
  if (typeof body?.read !== 'boolean') return Response.json({ error: 'Yanlış məlumat' }, { status: 400 });
  const m = await updateMessage(id, { read: body.read });
  return m ? Response.json({ ok: true }) : Response.json({ error: 'Tapılmadı' }, { status: 404 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const { id } = await params;
  return (await deleteMessage(id)) ? Response.json({ ok: true }) : Response.json({ error: 'Tapılmadı' }, { status: 404 });
}
