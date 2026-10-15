'use client';
import { useState } from 'react';

type T = Record<'name' | 'surname' | 'email' | 'company' | 'service' | 'selectDefault' | 'otherOption' | 'message' | 'placeholder' | 'submit' | 'sending' | 'success' | 'error', string>;

export function ContactForm({ t, services, lang }: { t: T; services: string[]; lang: 'az' | 'en' }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(fd), lang }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setState('ok');
    } catch {
      setState('err');
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass reveal grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
      <label className="grid gap-1.5 text-sm text-ink-2">{t.name}
        <input className="field" name="name" required maxLength={80} autoComplete="given-name" />
      </label>
      <label className="grid gap-1.5 text-sm text-ink-2">{t.surname}
        <input className="field" name="surname" maxLength={80} autoComplete="family-name" />
      </label>
      <label className="grid gap-1.5 text-sm text-ink-2">{t.email}
        <input className="field" type="email" name="email" required maxLength={160} autoComplete="email" />
      </label>
      <label className="grid gap-1.5 text-sm text-ink-2">{t.company}
        <input className="field" name="company" maxLength={120} autoComplete="organization" />
      </label>
      <label className="grid gap-1.5 text-sm text-ink-2 sm:col-span-2">{t.service}
        <select className="field" name="service" defaultValue="">
          <option value="">{t.selectDefault}</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
          <option value={t.otherOption}>{t.otherOption}</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-sm text-ink-2 sm:col-span-2">{t.message}
        <textarea className="field min-h-[130px] resize-y" name="message" required minLength={5} maxLength={4000} placeholder={t.placeholder} />
      </label>
      {/* Spam tələsi: insanlar görmür */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? t.sending : t.submit}</button>
        <p role="status" aria-live="polite" className={`text-sm ${state === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>
          {state === 'ok' ? t.success : state === 'err' ? t.error : ''}
        </p>
      </div>
    </form>
  );
}
