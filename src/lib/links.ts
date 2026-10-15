import type { Lang } from './content';

/**
 * Admin paneldə yazılan keçidləri dilə uyğun ünvana çevirir:
 *   "/services" → "/az/services", "/" → "/az"
 * "#bölmə", "https://…", "mailto:…" və artıq "/az/…" ilə başlayanlar dəyişmir.
 */
export function resolveHref(h: string, lang: Lang): string {
  if (/^\/(az|en)(\/|$)/.test(h)) return h;
  if (h === '/') return `/${lang}`;
  if (h.startsWith('/') && !h.startsWith('//')) return `/${lang}${h}`;
  return h;
}
