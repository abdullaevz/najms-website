import { Check } from 'lucide-react';
import type { PackagesContent, Lang } from '@/lib/content';
import { tr } from '@/lib/content';
import { rich } from '@/lib/rich';
import { SectionHead } from './SectionHead';
import { SmartLink } from './SmartLink';

export function Packages({ data, lang, h1 }: { data: PackagesContent; lang: Lang; h1?: boolean }) {
  const items = data.items.filter((i) => i.visible);
  return (
    <section id="packages" className="mx-auto w-full max-w-[1180px] px-3 py-14 md:px-0">
      <SectionHead eyebrow={tr(data.eyebrow, lang)} title={tr(data.title, lang)} lead={tr(data.lead, lang)} h1={h1} />
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
        {items.map((p, i) => (
          <article
            key={p.id}
            className={`glass reveal flex flex-col gap-3 p-7 ${p.highlighted ? 'is-gold' : ''}`}
            style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
          >
            <small className="text-[.72rem] font-semibold uppercase tracking-[.1em] text-ink-3">{tr(p.tier, lang)}</small>
            <h3 className={`font-display text-[1.9rem] font-extrabold tracking-tight ${p.highlighted ? 'text-gold' : ''}`}>{p.name}</h3>
            <p className="text-sm text-ink-2">{rich(tr(p.subtitle, lang))}</p>
            <ul className="my-2 flex-1 space-y-2.5 text-[.9rem] text-[#c9d6ea]">
              {p.features.map((f) => (
                <li key={f.id} className="flex gap-2.5">
                  <Check size={16} className={`mt-0.5 shrink-0 ${p.highlighted ? 'text-gold' : 'text-accent'}`} strokeWidth={2.6} />
                  <span>{rich(tr(f.text, lang))}</span>
                </li>
              ))}
            </ul>
            <SmartLink href="/contact" lang={lang} className={`btn ${p.highlighted ? 'btn-gold' : 'btn-ghost'} w-fit`}>{tr(p.ctaLabel, lang)}</SmartLink>
          </article>
        ))}
      </div>
    </section>
  );
}
