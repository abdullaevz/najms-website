import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { schemas, siteSchema, type Message, type SectionKey, type SiteContent } from './content';

/**
 * Fayl əsaslı məzmun anbarı.
 * Sonradan verilənlər bazasına keçmək üçün yalnız bu fayldakı funksiyalar dəyişdirilməlidir.
 */
export const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(process.cwd(), 'data');
const SITE_FILE = path.join(DATA_DIR, 'site.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Eyni anda yazmaları növbəyə qoyur (yarımçıq fayl yazılmasının qarşısını alır)
let chain: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => undefined);
  return run;
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

/* ───────── Sayt məzmunu ───────── */
export async function getSite(): Promise<SiteContent> {
  const raw = await fs.readFile(SITE_FILE, 'utf8');
  return siteSchema.parse(JSON.parse(raw));
}

export async function siteModified(): Promise<Date> {
  try {
    return (await fs.stat(SITE_FILE)).mtime;
  } catch {
    return new Date();
  }
}

const normPath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p).toLowerCase();

/** Admin paneldəki yönləndirmələrdən uyğun olanı tapır */
export async function findRedirect(path: string) {
  const { seo } = await getSite();
  const target = normPath(path);
  return seo.redirects.find((r) => normPath(r.from) === target) ?? null;
}

export function saveSection(key: SectionKey, value: unknown) {
  return locked(async () => {
    const parsed = schemas[key].parse(value);
    const current = JSON.parse(await fs.readFile(SITE_FILE, 'utf8')) as Record<string, unknown>;
    current[key] = parsed;
    siteSchema.parse(current); // bütün fayl hələ də etibarlı olmalıdır
    await writeJson(SITE_FILE, current);
    return parsed;
  });
}

/* ───────── Mesajlar ───────── */
async function readMessages(): Promise<Message[]> {
  try {
    return JSON.parse(await fs.readFile(MESSAGES_FILE, 'utf8')) as Message[];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw e;
  }
}

export async function listMessages(): Promise<Message[]> {
  const all = await readMessages();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addMessage(input: Omit<Message, 'id' | 'createdAt' | 'read'>) {
  return locked(async () => {
    const all = await readMessages();
    const msg: Message = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), read: false };
    all.push(msg);
    await writeJson(MESSAGES_FILE, all);
    return msg;
  });
}

export function updateMessage(id: string, patch: { read: boolean }) {
  return locked(async () => {
    const all = await readMessages();
    const m = all.find((x) => x.id === id);
    if (!m) return null;
    m.read = patch.read;
    await writeJson(MESSAGES_FILE, all);
    return m;
  });
}

export function deleteMessage(id: string) {
  return locked(async () => {
    const all = await readMessages();
    const next = all.filter((x) => x.id !== id);
    await writeJson(MESSAGES_FILE, next);
    return next.length !== all.length;
  });
}
