import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { guardAdmin } from '@/lib/auth';
import { DATA_DIR } from '@/lib/store';

const MAX = 1.5 * 1024 * 1024;
const TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg' };

function looksValid(ext: string, b: Buffer): boolean {
  if (ext === 'png') return b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (ext === 'jpg') return b[0] === 0xff && b[1] === 0xd8;
  if (ext === 'webp') return b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP';
  const t = b.toString('utf8');
  return /<svg[\s>]/i.test(t) && !/<script|javascript:|\son\w+\s*=|<foreignObject/i.test(t);
}

export async function POST(req: Request) {
  const denied = await guardAdmin(req);
  if (denied) return denied;
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Fayl seçilməyib' }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: 'Yalnız PNG, JPG, WebP və SVG olar' }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: 'Fayl 1.5 MB-dan böyükdür' }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  if (!looksValid(ext, buf)) return Response.json({ error: 'Fayl məzmunu şəkil formatına uyğun deyil' }, { status: 400 });
  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(DATA_DIR, 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buf);
  return Response.json({ url: `/api/media/${name}` });
}
