'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import type { Lang } from '@/lib/content';

type Props = {
  lang: Lang;
  brand: { name: string; pill: string };
  items: { id: string; label: string; href: string }[];
  cta: { label: string; href: string };
};

const isInternal = (h: string) => h.startsWith('/');

export function Header({ lang, brand, items, cta }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const other: Lang = lang === 'az' ? 'en' : 'az';
  const otherPath = pathname.replace(/^\/(az|en)/, `/${other}`);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const Item = ({ href, className, children }: { href: string; className: string; children: React.ReactNode }) =>
    isInternal(href) ? (
      <Link href={href} className={className}>{children}</Link>
    ) : (
      <a href={href} className={className}>{children}</a>
    );

  return (
    <header className={`site-head ${scrolled ? 'scrolled' : ''}`}>
      <Link href={`/${lang}`} aria-label={brand.name} className="shrink-0">
        <Logo name={brand.name} pill={brand.pill} />
      </Link>

      <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
        {items.map((i) => (
          <Item
            key={i.id}
            href={i.href}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition hover:bg-white/8 hover:text-ink ${pathname === i.href ? 'bg-white/8 text-ink' : 'text-ink-2'}`}
          >
            {i.label}
          </Item>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href={otherPath}
          className="rounded-xl border border-white/15 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-2 transition hover:border-accent hover:text-ink"
          hrefLang={other}
          aria-label={other === 'en' ? 'English' : 'Azərbaycanca'}
        >
          {other}
        </Link>
        <Item href={cta.href} className="btn btn-primary btn-sm hidden sm:inline-flex">{cta.label}</Item>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="glass absolute left-0 right-0 top-[calc(100%+8px)] p-3 md:hidden" style={{ background: 'rgba(10,20,36,.96)' }}>
          {items.map((i) => (
            <Item key={i.id} href={i.href} className="block rounded-xl px-4 py-3 text-ink-2 hover:bg-white/8 hover:text-ink">{i.label}</Item>
          ))}
          <Item href={cta.href} className="btn btn-primary mt-2 w-full">{cta.label}</Item>
        </div>
      )}
    </header>
  );
}
