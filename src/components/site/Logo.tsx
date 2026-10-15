export function Logo({ name, pill, size = 36 }: { name: string; pill?: string; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <g className="orbit-a">
          <ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(-30 20 20)" stroke="var(--accent)" strokeWidth="2" />
        </g>
        <g className="orbit-b">
          <ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(30 20 20)" stroke="var(--gold)" strokeWidth="2" />
        </g>
        <circle cx="20" cy="20" r="3.2" fill="var(--color-accent-2)" />
      </svg>
      <span className="font-display text-[1.35rem] font-extrabold tracking-tight leading-none">
        {name}
        {pill ? (
          <span className="ml-1.5 align-middle rounded-full border border-white/20 px-2 py-0.5 text-[.62rem] font-semibold uppercase tracking-[.14em] text-ink-2">
            {pill}
          </span>
        ) : null}
      </span>
    </span>
  );
}
