import { BadgeCheck, ExternalLink } from 'lucide-react';
import type { PartnersContent, Lang } from '@/lib/content';
import { tr } from '@/lib/content';
import { rich } from '@/lib/rich';
import { SectionHead } from './SectionHead';

export function Partners({ data, lang, h1 }: { data: PartnersContent; lang: Lang; h1?: boolean }) {
  const items = data.items.filter((i) => i.visible);
  return (
    <section id="partners" className="mx-auto w-full max-w-[1180px] px-3 py-14 md:px-0">
      <SectionHead eyebrow={tr(data.eyebrow, lang)} title={tr(data.title, lang)} lead={tr(data.lead, lang)} h1={h1} />
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {items.map((p, i) => (
          <article key={p.id} className="glass reveal flex flex-col gap-4 p-8" style={{ '--d': `${i * 90}ms` } as React.CSSProperties}>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <BadgeCheck size={14} /> {tr(data.badge, lang)}
            </span>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-[2.4rem] font-extrabold tracking-tight">{p.name}</h2>
              {p.logo && (
                <span className={`grid h-16 shrink-0 place-items-center rounded-2xl px-4 ${p.logoTile ? 'bg-white/95 shadow-lg shadow-black/20' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt={p.name} loading="lazy" className="max-h-9 w-auto max-w-[150px] object-contain" />
                </span>
              )}
            </div>
            <p className="leading-relaxed text-ink-2">{rich(tr(p.description, lang))}</p>
            {p.url && (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm mt-auto w-fit">
                {tr(data.linkLabel, lang)} <ExternalLink size={14} />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
