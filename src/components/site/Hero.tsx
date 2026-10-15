import type { HeroContent, Settings, Lang } from '@/lib/content';
import { tr } from '@/lib/content';
import { rich } from '@/lib/rich';
import { CountUp } from './CountUp';
import { SmartLink } from './SmartLink';

export function Hero({ hero, settings, lang }: { hero: HeroContent; settings: Settings; lang: Lang }) {
  return (
    <section id="home" className="mx-auto grid w-full max-w-[1180px] grid-cols-2 gap-3.5 px-3 pt-8 pb-10 md:grid-cols-4 md:px-0">
      <div className="glass pop col-span-2 flex flex-col justify-center gap-5 p-7 md:col-span-3 md:row-span-2 md:p-11" style={{ '--d': '0ms' } as React.CSSProperties}>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.12em] text-accent-2">
          <span className="dot-live" /> {tr(hero.eyebrow, lang)}
        </span>
        <h1 className="font-display text-[clamp(2rem,5.4vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-.035em]">
          {rich(tr(hero.title, lang))}
        </h1>
        <p className="max-w-[34em] text-[1.02rem] leading-relaxed text-ink-2">{rich(tr(hero.subtitle, lang))}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <SmartLink href={hero.primary.href} lang={lang} className="btn btn-primary">{tr(hero.primary.label, lang)}</SmartLink>
          <SmartLink href={hero.secondary.href} lang={lang} className="btn btn-ghost">{tr(hero.secondary.label, lang)}</SmartLink>
        </div>
      </div>

      {hero.stats.slice(0, 2).map((s, i) => (
        <div key={s.id} className={`glass pop col-span-1 flex min-h-[150px] flex-col justify-between p-5 ${s.tone === 'gold' ? 'is-gold' : ''}`} style={{ '--d': `${120 + i * 100}ms` } as React.CSSProperties}>
          <div className={`font-display text-[3.4rem] font-extrabold leading-[.9] tracking-[-.04em] ${s.tone === 'gold' ? 'text-gold' : 'text-accent'}`}>
            <CountUp to={s.value} />
          </div>
          <span className="text-sm text-ink-2">{tr(s.label, lang)}</span>
        </div>
      ))}
    </section>
  );
}
