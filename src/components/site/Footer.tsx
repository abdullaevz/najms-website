import type { FooterContent, Settings, Lang } from '@/lib/content';
import { tr } from '@/lib/content';
import { Logo } from './Logo';
import { SmartLink } from './SmartLink';

const SOCIAL_LABEL: Record<string, string> = { linkedin: 'in', instagram: 'ig', facebook: 'fb', x: 'X', telegram: 'tg', youtube: 'yt' };
const SOCIAL_NAME: Record<string, string> = { linkedin: 'LinkedIn', instagram: 'Instagram', facebook: 'Facebook', x: 'X', telegram: 'Telegram', youtube: 'YouTube' };

export function Footer({ data, settings, lang }: { data: FooterContent; settings: Settings; lang: Lang }) {
  return (
    <footer className="mx-auto w-full max-w-[1180px] px-3 pb-8 pt-10 md:px-0">
      <div className="glass relative p-8 md:p-10">
        <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 opacity-[.07]">
          <g className="orbit-a"><ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(-30 20 20)" stroke="#fff" strokeWidth=".6" /></g>
          <g className="orbit-b"><ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(30 20 20)" stroke="#fff" strokeWidth=".6" /></g>
        </svg>
        <div className="grid gap-9 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo name={settings.brandName} pill={settings.brandPill} />
            <p className="mt-4 text-sm leading-relaxed text-ink-2">{tr(data.brandText, lang)}</p>
            {settings.social.length > 0 && (
              <div className="mt-5 flex gap-2">
                {settings.social.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_NAME[s.kind]}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 text-xs font-bold uppercase text-ink-2 transition hover:border-accent hover:text-ink">
                    {SOCIAL_LABEL[s.kind]}
                  </a>
                ))}
              </div>
            )}
          </div>
          {data.columns.map((c) => (
            <div key={c.id}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-ink-3">{tr(c.title, lang)}</h4>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.id}><SmartLink href={l.href} lang={lang} className="text-ink-2 transition hover:text-accent-2">{tr(l.label, lang)}</SmartLink></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-ink-3">
          <span>{tr(data.copyright, lang)}</span>
          <div className="flex gap-4">
            {data.legal.map((l) => <SmartLink key={l.id} href={l.href} lang={lang} className="hover:text-ink">{tr(l.label, lang)}</SmartLink>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
