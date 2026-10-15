'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Check, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { ICON_NAMES, Icon } from '@/lib/icons';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Ctx = { data: any; get: (p: string) => any; set: (p: string, v: any) => void };
const C = createContext<Ctx>(null as unknown as Ctx);
const useEd = () => useContext(C);
export { useEd as useEditor };

const getAt = (o: any, path: string) => (path ? path.split('.').reduce((a, k) => a?.[k], o) : o);
function setAt(o: any, keys: string[], v: any): any {
  if (!keys.length) return v;
  const [k, ...rest] = keys;
  const clone = Array.isArray(o) ? [...o] : { ...o };
  clone[k] = setAt(o?.[k], rest, v);
  return clone;
}
export const uid = (p = 'x') => `${p}-${Math.random().toString(36).slice(2, 8)}`;

/* ───────── Əsas redaktor + saxla paneli ───────── */
export function Editor({ section, title, desc, initial, children }: { section: string; title: string; desc?: string; initial: any; children: ReactNode }) {
  const router = useRouter();
  const [data, setData] = useState<any>(initial);
  const [snap, setSnap] = useState(() => JSON.stringify(initial));
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const [errMsg, setErrMsg] = useState('');
  const dirty = JSON.stringify(data) !== snap;

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  async function save() {
    setState('saving');
    setErrors([]);
    setErrMsg('');
    try {
      const res = await fetch(`/api/admin/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(j.issues ?? []);
        setErrMsg(res.status === 401 ? 'Sessiya bitib, yenidən daxil olun.' : j.error ?? 'Xəta');
        setState('error');
        return;
      }
      setSnap(JSON.stringify(data));
      setState('saved');
      router.refresh();
      setTimeout(() => setState((s) => (s === 'saved' ? 'idle' : s)), 2500);
    } catch {
      setErrMsg('Şəbəkə xətası');
      setState('error');
    }
  }

  const ctx: Ctx = { data, get: (p) => getAt(data, p), set: (p, v) => setData((d: any) => setAt(d, p.split('.'), v)) };

  return (
    <C.Provider value={ctx}>
      <div className="mx-auto max-w-4xl pb-28">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
        {desc && <p className="mt-1 text-sm text-ink-2">{desc}</p>}
        <div className="mt-6 grid gap-5">{children}</div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0a1424]/92 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <button onClick={save} disabled={!dirty || state === 'saving'} className="btn btn-primary btn-sm disabled:cursor-not-allowed disabled:opacity-40">
            {state === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Yadda saxla
          </button>
          <span role="status" className="text-sm">
            {state === 'saved' && <span className="flex items-center gap-1.5 text-emerald-400"><Check size={16} /> Saxlanıldı, sayt yeniləndi</span>}
            {state === 'error' && <span className="text-red-400">{errMsg}</span>}
            {state !== 'saved' && state !== 'error' && dirty && <span className="text-gold">Saxlanılmamış dəyişikliklər var</span>}
          </span>
        </div>
        {errors.length > 0 && (
          <ul className="mx-auto max-w-4xl px-4 pb-3 text-xs text-red-400">
            {errors.slice(0, 5).map((e, i) => <li key={i}><code>{e.path}</code>: {e.message}</li>)}
          </ul>
        )}
      </div>
    </C.Provider>
  );
}

/* ───────── Qrup (kart) ───────── */
export function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[.035] p-5">
      <h2 className="font-display text-base font-bold">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-ink-3">{hint}</p>}
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}
export const Row = ({ children }: { children: ReactNode }) => <div className="grid gap-4 sm:grid-cols-2">{children}</div>;

const Label = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label className="grid gap-1.5">
    <span className="text-xs font-semibold text-ink-2">{label}</span>
    {children}
    {hint && <span className="text-[.7rem] text-ink-3">{hint}</span>}
  </label>
);

/* ───────── Sahələr ───────── */
export function Counter({ text, max }: { text: string; max: number }) {
  const n = (text ?? '').length;
  return <span className={`text-[.7rem] tabular-nums ${n > max ? 'text-red-400' : n > max * 0.9 ? 'text-gold' : 'text-ink-3'}`}>{n}/{max}</span>;
}

export function Text({ path, label, hint, area, rows = 3, type = 'text', max }: { path: string; label: string; hint?: string; area?: boolean; rows?: number; type?: string; max?: number }) {
  const { get, set } = useEd();
  const v = get(path) ?? '';
  return (
    <Label label={label} hint={hint}>
      {area ? (
        <textarea className="field" rows={rows} value={v} onChange={(e) => set(path, e.target.value)} />
      ) : (
        <input className="field" type={type} value={v} onChange={(e) => set(path, e.target.value)} />
      )}
      {max ? <Counter text={v} max={max} /> : null}
    </Label>
  );
}

/** İki dilli sahə: AZ və EN yan-yana */
export function LText({ path, label, hint, area, rows = 3, max }: { path: string; label: string; hint?: string; area?: boolean; rows?: number; max?: number }) {
  const { get } = useEd();
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold text-ink-2">{label}</span>
      <div className="grid gap-3 sm:grid-cols-2">
        {(['az', 'en'] as const).map((l) => (
          <div key={l} className="relative">
            <span className="pointer-events-none absolute right-2.5 top-2 z-10 rounded bg-white/8 px-1.5 text-[.62rem] font-bold uppercase text-ink-3">{l}</span>
            <LInner path={`${path}.${l}`} area={area} rows={rows} />
            {max ? <div className="mt-1 text-right"><Counter text={get(`${path}.${l}`)} max={max} /></div> : null}
          </div>
        ))}
      </div>
      {hint && <span className="text-[.7rem] text-ink-3">{hint}</span>}
    </div>
  );
}
function LInner({ path, area, rows }: { path: string; area?: boolean; rows: number }) {
  const { get, set } = useEd();
  const v = get(path) ?? '';
  return area ? (
    <textarea className="field pr-10" rows={rows} value={v} onChange={(e) => set(path, e.target.value)} />
  ) : (
    <input className="field pr-10" value={v} onChange={(e) => set(path, e.target.value)} />
  );
}

export function Num({ path, label, hint }: { path: string; label: string; hint?: string }) {
  const { get, set } = useEd();
  return (
    <Label label={label} hint={hint}>
      <input className="field" type="number" value={get(path) ?? 0} onChange={(e) => set(path, Number(e.target.value) || 0)} />
    </Label>
  );
}

export function Check_({ path, label }: { path: string; label: string }) {
  const { get, set } = useEd();
  const on = Boolean(get(path));
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => set(path, !on)} className="flex w-fit items-center gap-3 text-sm text-ink">
      <span className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-accent' : 'bg-white/15'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  );
}
export { Check_ as Toggle };

export function Pick({ path, label, options }: { path: string; label: string; options: { value: string; label: string }[] }) {
  const { get, set } = useEd();
  return (
    <Label label={label}>
      <select className="field" value={get(path) ?? ''} onChange={(e) => set(path, e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Label>
  );
}

export function IconPick({ path, label }: { path: string; label: string }) {
  const { get, set } = useEd();
  const v = get(path) as string;
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold text-ink-2">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {ICON_NAMES.map((n) => (
          <button
            key={n}
            type="button"
            title={n}
            aria-label={n}
            aria-pressed={v === n}
            onClick={() => set(path, n)}
            className={`grid h-10 w-10 place-items-center rounded-xl border transition ${v === n ? 'border-accent bg-accent/15 text-accent' : 'border-white/10 text-ink-2 hover:border-white/30'}`}
          >
            <Icon name={n} className="h-5 w-5" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function Color({ path, label }: { path: string; label: string }) {
  const { get, set } = useEd();
  const v = (get(path) as string) || '#000000';
  return (
    <Label label={label} hint="#RRGGBB">
      <div className="flex gap-2">
        <input type="color" value={/^#[0-9a-f]{6}$/i.test(v) ? v : '#000000'} onChange={(e) => set(path, e.target.value)} className="h-[46px] w-14 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1" />
        <input className="field font-mono" value={v} onChange={(e) => set(path, e.target.value)} />
      </div>
    </Label>
  );
}

/* ───────── Siyahı redaktoru ───────── */
export function List({ path, label, addLabel = 'Əlavə et', make, title, children, nested }: {
  path: string; label?: string; addLabel?: string; make: () => any;
  title?: (item: any, i: number) => string; children: (base: string, i: number) => ReactNode; nested?: boolean;
}) {
  const { get, set } = useEd();
  const items: any[] = get(path) ?? [];
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    set(path, next);
  };
  const remove = (i: number) => {
    if (window.confirm('Silinsin?')) set(path, items.filter((_, k) => k !== i));
  };
  return (
    <div className="grid gap-2.5">
      {label && <span className="text-xs font-semibold text-ink-2">{label}</span>}
      {items.map((it, i) => (
        <details key={it.id ?? i} open={!nested && items.length <= 4} className={`group rounded-xl border border-white/10 ${nested ? 'bg-black/15' : 'bg-white/[.03]'}`}>
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 text-sm font-medium">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-white/8 text-[.7rem] text-ink-3">{i + 1}</span>
            <span className="flex-1 truncate">{title?.(it, i) || `#${i + 1}`}</span>
            <span className="flex gap-1" onClick={(e) => e.preventDefault()}>
              <IconBtn label="Yuxarı" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp size={15} /></IconBtn>
              <IconBtn label="Aşağı" onClick={() => move(i, 1)} disabled={i === items.length - 1}><ArrowDown size={15} /></IconBtn>
              <IconBtn label="Sil" onClick={() => remove(i)} danger><Trash2 size={15} /></IconBtn>
            </span>
          </summary>
          <div className="grid gap-4 border-t border-white/10 p-3.5">{children(`${path}.${i}`, i)}</div>
        </details>
      ))}
      <button type="button" onClick={() => set(path, [...items, make()])} className="btn btn-ghost btn-sm w-fit">
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}
function IconBtn({ children, label, onClick, disabled, danger }: { children: ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className={`grid h-7 w-7 place-items-center rounded-lg border border-white/10 transition disabled:opacity-30 ${danger ? 'hover:border-red-400 hover:text-red-400' : 'hover:border-accent hover:text-accent'}`}>
      {children}
    </button>
  );
}

/* ───────── Şəkil yükləmə ───────── */
export function ImageField({ path, label, hint }: { path: string; label: string; hint?: string }) {
  const { get, set } = useEd();
  const v = (get(path) as string) || '';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true);
    setErr('');
    const fd = new FormData();
    fd.append('file', f);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) setErr(j.error ?? 'Yükləmə alınmadı');
      else set(path, j.url);
    } catch {
      setErr('Şəbəkə xətası');
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-semibold text-ink-2">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        {v && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v} alt="" className="h-12 max-w-[160px] rounded-lg bg-white p-1.5 object-contain" />
        )}
        <label className="btn btn-ghost btn-sm cursor-pointer">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {busy ? 'Yüklənir…' : v ? 'Dəyiş' : 'Şəkil yüklə'}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={onFile} disabled={busy} />
        </label>
        {v && <button type="button" onClick={() => set(path, '')} className="btn btn-ghost btn-sm">Sil</button>}
      </div>
      {err && <span className="text-xs text-red-400">{err}</span>}
      {hint && <span className="text-[.7rem] text-ink-3">{hint}</span>}
    </div>
  );
}
