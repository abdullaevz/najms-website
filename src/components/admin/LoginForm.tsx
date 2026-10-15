'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const password = new FormData(e.currentTarget).get('password');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (res.ok) {
      router.replace('/admin');
      router.refresh();
    } else {
      setErr((await res.json().catch(() => ({}))).error ?? 'Xəta');
      setBusy(false);
    }
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm text-ink-2">Parol
        <input className="field" type="password" name="password" required autoFocus autoComplete="current-password" />
      </label>
      <button className="btn btn-primary" disabled={busy}>{busy ? '…' : 'Daxil ol'}</button>
      <p role="alert" className="min-h-5 text-sm text-red-400">{err}</p>
    </form>
  );
}
