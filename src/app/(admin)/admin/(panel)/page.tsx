import Link from 'next/link';
import { getSite, listMessages } from '@/lib/store';

export default async function Dashboard() {
  const [site, messages] = await Promise.all([getSite(), listMessages()]);
  const unread = messages.filter((m) => !m.read).length;
  const cards = [
    { href: '/admin/messages', t: 'Mesajlar', d: `${unread} oxunmamış, cəmi ${messages.length}` },
    { href: '/admin/hero', t: 'Əsas blok', d: site.hero.visible ? 'Görünür' : 'Gizlidir' },
    { href: '/admin/services', t: 'Xidmətlər', d: `${site.services.items.filter((i) => i.visible).length} aktiv xidmət` },
    { href: '/admin/packages', t: 'Paketlər', d: `${site.packages.items.filter((i) => i.visible).length} aktiv paket` },
    { href: '/admin/partners', t: 'Partnyorlar', d: `${site.partners.items.filter((i) => i.visible).length} partnyor` },
    { href: '/admin/contact', t: 'Əlaqə bölməsi', d: 'Başlıqlar və form yazıları' },
    { href: '/admin/navigation', t: 'Menyu', d: `${site.nav.items.length} bənd` },
    { href: '/admin/footer', t: 'Footer', d: `${site.footer.columns.length} sütun` },
    { href: '/admin/seo', t: 'SEO', d: site.seo.robots.index ? 'Axtarışa açıqdır' : 'Axtarışdan gizlədilib' },
    { href: '/admin/settings', t: 'Ümumi ayarlar', d: 'Əlaqə, rənglər' },
  ];
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Xoş gəlmisiniz</h1>
      <p className="mb-6 mt-1 text-sm text-ink-2">Saytdakı bütün məzmun buradan idarə olunur. Dəyişikliklər saxlanılan kimi saytda görünür.</p>
      <div className="grid gap-3.5 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="glass p-5">
            <b className="font-display text-lg">{c.t}</b>
            <p className="mt-1 text-sm text-ink-2">{c.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
