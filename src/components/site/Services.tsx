import type { ServicesContent, Lang } from '@/lib/content';
import { tr } from '@/lib/content';
import { rich } from '@/lib/rich';
import { Icon } from '@/lib/icons';
import { SectionHead } from './SectionHead';

export function Services({ data, lang, h1 }: { data: ServicesContent; lang: Lang; h1?: boolean }) {
  const items = data.items.filter((i) => i.visible);
  return (
    <section id="services" className="mx-auto w-full max-w-[1180px] px-3 py-14 md:px-0">
      <SectionHead eyebrow={tr(data.eyebrow, lang)} title={tr(data.title, lang)} lead={tr(data.lead, lang)} h1={h1} />
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <article
            key={s.id}
            className={`glass reveal flex min-h-[190px] flex-col p-6 ${s.featured ? 'sm:col-span-2' : ''}`}
            style={{ '--d': `${(i % 4) * 70}ms` } as React.CSSProperties}
          >
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/25">
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <h3 className={`font-display font-bold ${s.featured ? 'text-[1.4rem]' : 'text-[1.08rem]'}`}>{tr(s.title, lang)}</h3>
            <p className="mt-1.5 text-[.9rem] leading-relaxed text-ink-2">{rich(tr(s.description, lang))}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
