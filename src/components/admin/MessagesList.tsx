'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import type { Message } from '@/lib/content';

export function MessagesList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  async function call(id: string, init: RequestInit) {
    setBusy(id);
    await fetch(`/api/admin/messages/${id}`, { ...init, headers: { 'Content-Type': 'application/json' } });
    setBusy(null);
    router.refresh();
  }
  if (!messages.length) return <p className="rounded-2xl border border-white/10 bg-white p-8 text-center text-ink-2">Hələ mesaj yoxdur.</p>;
  return (
    <ul className="grid gap-3">
      {messages.map((m) => (
        <li key={m.id} className={`rounded-2xl border p-5 ${m.read ? 'border-white/10 bg-white/[.03]' : 'border-accent/50 bg-accent/[.07]'}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <b className="font-display">{m.name} {m.surname}</b>
              <div className="text-sm text-ink-2">
                <a className="hover:text-accent" href={`mailto:${m.email}`}>{m.email}</a>
                {m.company && <> · {m.company}</>}
              </div>
              <div className="mt-0.5 text-xs text-ink-3">
                {new Date(m.createdAt).toLocaleString('az-AZ')} · {m.lang.toUpperCase()}{m.service && <> · {m.service}</>}
              </div>
            </div>
            <div className="flex gap-2">
              <button disabled={busy === m.id} onClick={() => call(m.id, { method: 'PATCH', body: JSON.stringify({ read: !m.read }) })} className="btn btn-ghost btn-sm">
                {m.read ? <Mail size={15} /> : <MailOpen size={15} />} {m.read ? 'Oxunmamış et' : 'Oxundu'}
              </button>
              <button disabled={busy === m.id} onClick={() => confirm('Mesaj silinsin?') && call(m.id, { method: 'DELETE' })} className="btn btn-ghost btn-sm hover:!border-red-400 hover:!text-red-400" aria-label="Sil">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
