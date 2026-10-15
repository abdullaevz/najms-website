import { MapPin, Phone, Mail } from 'lucide-react';
import type { ContactContent, ServicesContent, Settings, Lang } from '@/lib/content';
import { tr } from '@/lib/content';
import { SectionHead } from './SectionHead';
import { ContactForm } from './ContactForm';

export function Contact({ data, services, settings, lang, h1 }: { data: ContactContent; services: ServicesContent; settings: Settings; lang: Lang; h1?: boolean }) {
  const f = data.form;
  const t = {
    name: tr(f.name, lang), surname: tr(f.surname, lang), email: tr(f.email, lang), company: tr(f.company, lang),
    service: tr(f.service, lang), selectDefault: tr(f.selectDefault, lang), otherOption: tr(f.otherOption, lang),
    message: tr(f.message, lang), placeholder: tr(f.placeholder, lang), submit: tr(f.submit, lang),
    sending: tr(f.sending, lang), success: tr(f.success, lang), error: tr(f.error, lang),
  };
  const rows = [
    { icon: MapPin, label: tr(data.addressLabel, lang), value: tr(settings.address, lang), href: '' },
    { icon: Phone, label: tr(data.phoneLabel, lang), value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: tr(data.emailLabel, lang), value: settings.email, href: `mailto:${settings.email}` },
  ].filter((r) => r.value);
  return (
    <section id="contact" className="mx-auto grid w-full max-w-[1180px] gap-8 px-3 py-14 md:px-0 lg:grid-cols-[.8fr_1.2fr]">
      <div>
        <SectionHead eyebrow={tr(data.eyebrow, lang)} title={tr(data.title, lang)} lead={tr(data.lead, lang)} h1={h1} />
        <div className="grid gap-3">
          {rows.map((r) => (
            <div key={r.label} className="glass reveal flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/25">
                <r.icon size={20} />
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-3">{r.label}</div>
                {r.href ? <a href={r.href} className="font-medium hover:text-accent">{r.value}</a> : <div className="font-medium">{r.value}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ContactForm t={t} lang={lang} services={services.items.filter((i) => i.visible).map((i) => tr(i.title, lang))} />
    </section>
  );
}
