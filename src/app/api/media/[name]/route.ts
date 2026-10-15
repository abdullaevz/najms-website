import { promises as fs } from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from '@/lib/store';

const MIME: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml' };

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const m = /^[a-f0-9-]{36}\.(png|jpg|webp|svg)$/.exec(name);
  if (!m) return new Response('Not found', { status: 404 });
  try {
    const buf = await fs.readFile(path.join(DATA_DIR, 'uploads', name));
    return new Response(new Uint8Array(buf), {
      headers: {
        'Content-Type': MIME[m[1]],
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
