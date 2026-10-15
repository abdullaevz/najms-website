import { contactInput } from '@/lib/content';
import { addMessage } from '@/lib/store';
import { clientIp, hit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!hit(`contact:${clientIp(req)}`, 5, 10 * 60_000)) {
    return Response.json({ error: 'Çox sorğu' }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const parsed = contactInput.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Yanlış məlumat' }, { status: 400 });
  const { website, ...data } = parsed.data;
  if (website) return Response.json({ ok: true }); // bot: səssizcə qəbul etmiş kimi
  const msg = await addMessage(data);

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  }
  return Response.json({ ok: true });
}
