import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'node:crypto';

const COOKIE = 'najms_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

function secretKey(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 24) {
    throw new Error('SESSION_SECRET təyin olunmayıb (ən azı 24 simvol). .env.local faylına baxın.');
  }
  return new TextEncoder().encode(s);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 24);
}

const sha = (v: string) => createHash('sha256').update(v).digest();

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(sha(input), sha(expected));
}

export async function createSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return false;
    await jwtVerify(token, secretKey());
    return true;
  } catch {
    return false;
  }
}

/** Admin API üçün qoruma: sessiya + eyni mənşə (Origin) yoxlaması. Uğurlu olarsa null qaytarır. */
export async function guardAdmin(req: Request): Promise<Response | null> {
  if (!(await isAdmin())) return Response.json({ error: 'Giriş tələb olunur' }, { status: 401 });
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get('host')) {
        return Response.json({ error: 'Yanlış mənşə' }, { status: 403 });
      }
    } catch {
      return Response.json({ error: 'Yanlış mənşə' }, { status: 403 });
    }
  }
  return null;
}
