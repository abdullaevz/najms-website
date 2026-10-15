'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Settings, Sparkles, Layers, Package, BadgeCheck, Search, Mail, Menu as MenuIcon, PanelBottom, Inbox, LogOut, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/site/Logo';

const ITEMS = [
  { href: '/admin', label: 'İdarə paneli', icon: Home },
  { href: '/admin/messages', label: 'Mesajlar', icon: Inbox, badge: true },
  { href: '/admin/hero', label: 'Əsas blok', icon: Sparkles },
  { href: '/admin/services', label: 'Xidmətlər', icon: Layers },
  { href: '/admin/packages', label: 'Paketlər', icon: Package },
  { href: '/admin/partners', label: 'Partnyorlar', icon: BadgeCheck },
  { href: '/admin/contact', label: 'Əlaqə bölməsi', icon: Mail },
  { href: '/admin/navigation', label: 'Menyu', icon: MenuIcon },
  { href: '/admin/footer', label: 'Footer', icon: PanelBottom },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/settings', label: 'Ümumi ayarlar', icon: Settings },
];

export function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }
  return (
    <aside className="border-b border-white/10 bg-[#0a1424] md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-4 md:block">
        <Logo name="najms" pill="admin" size={30} />
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:overflow-visible" aria-label="Admin">
        {ITEMS.map((i) => {
          const active = i.href === '/admin' ? path === '/admin' : path.startsWith(i.href);
          return (
            <Link key={i.href} href={i.href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-accent/15 text-accent-2' : 'text-ink-2 hover:bg-white/6 hover:text-ink'}`}>
              <i.icon size={18} />
              <span>{i.label}</span>
              {i.badge && unread > 0 && <span className="ml-auto rounded-full bg-gold px-2 text-xs font-bold text-[#06101f]">{unread}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="hidden gap-1 px-3 pb-4 md:absolute md:inset-x-0 md:bottom-0 md:grid">
        <a href="/az" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-2 hover:bg-white/6 hover:text-ink"><ExternalLink size={18} /> Saytı aç</a>
        <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-ink-2 hover:bg-white/6 hover:text-red-400"><LogOut size={18} /> Çıxış</button>
      </div>
      <div className="flex gap-2 px-3 pb-3 md:hidden">
        <a href="/az" target="_blank" className="btn btn-ghost btn-sm flex-1"><ExternalLink size={15} /> Sayt</a>
        <button onClick={logout} className="btn btn-ghost btn-sm flex-1"><LogOut size={15} /> Çıxış</button>
      </div>
    </aside>
  );
}
