'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Kursor işığı (.glass) və görünəndə açılma (.reveal). Səhifə dəyişəndə yenidən qurulur. */
export function Effects() {
  const pathname = usePathname();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const g = (e.target as Element | null)?.closest?.('.glass') as HTMLElement | null;
      if (!g) return;
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', `${e.clientX - r.left}px`);
      g.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
