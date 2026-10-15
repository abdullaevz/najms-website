import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import type { Lang } from '@/lib/content';
import { resolveHref } from '@/lib/links';

/** Daxili səhifələr üçün <Link>, xarici və #-keçidlər üçün <a>. */
export function SmartLink({ href, lang, ...rest }: { href: string; lang: Lang } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const h = resolveHref(href, lang);
  if (h.startsWith('/')) return <Link href={h} {...rest} />;
  const external = /^https?:/.test(h);
  return <a href={h} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest} />;
}
