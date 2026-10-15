import { rich } from '@/lib/rich';

export function SectionHead({ eyebrow, title, lead, h1 }: { eyebrow: string; title: string; lead: string; h1?: boolean }) {
  const H = h1 ? 'h1' : 'h2';
  return (
    <div className="reveal mb-9 max-w-2xl">
      <span className="text-xs font-bold uppercase tracking-[.16em] text-accent">{eyebrow}</span>
      <H className="mt-2 font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-.03em]">{rich(title)}</H>
      {lead && <p className="mt-3 text-ink-2">{rich(lead)}</p>}
    </div>
  );
}
