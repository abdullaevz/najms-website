'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Color, Editor, Group, ImageField, LText, List, Num, Pick, Row, Text, Toggle, uid, useEditor } from './Editor';

type LT = { az: string; en: string };
type Props = {
  initial: any;
  siteUrl: string;
  sections: Record<'services' | 'packages' | 'partners' | 'contact', { title: LT; lead: LT }>;
};

const strip = (s: string) => (s || '').replace(/\*+/g, '').trim();
const DAY_OPTS = [
  ['Monday', 'Bazar ertəsi'], ['Tuesday', 'Çərşənbə axşamı'], ['Wednesday', 'Çərşənbə'], ['Thursday', 'Cümə axşamı'],
  ['Friday', 'Cümə'], ['Saturday', 'Şənbə'], ['Sunday', 'Bazar'],
].map(([value, label]) => ({ value, label }));

const PAGES: { key: 'home' | 'services' | 'packages' | 'partners' | 'contact'; label: string; path: string }[] = [
  { key: 'home', label: 'Əsas səhifə', path: '' },
  { key: 'services', label: 'Xidmətlər', path: '/services' },
  { key: 'packages', label: 'Paketlər', path: '/packages' },
  { key: 'partners', label: 'Partnyorlar', path: '/partners' },
  { key: 'contact', label: 'Əlaqə', path: '/contact' },
];

/** Saytdakı kimi son başlıq/təsvir (server tərəfdəki resolvePage ilə eyni məntiq) */
function resolve(d: any, sections: Props['sections'], key: string, lang: 'az' | 'en') {
  const pg = d.pages[key];
  const sec = key === 'home' ? null : sections[key as keyof Props['sections']];
  const own = (pg.title[lang] || '').trim();
  let title: string;
  if (key === 'home') title = own || d.defaultTitle[lang];
  else {
    const t = own || strip(sec!.title[lang]);
    const tpl = d.titleTemplate[lang] || '';
    title = tpl.includes('%s') ? tpl.replace('%s', t) : t;
  }
  const description = (pg.description[lang] || '').trim() || (sec ? strip(sec.lead[lang]) : '') || d.defaultDescription[lang];
  return { title, description };
}

function Serp({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[.03] p-4">
      <div className="truncate text-xs text-emerald-400">{url}</div>
      <div className="mt-0.5 truncate text-[1.05rem] text-[#8ab4f8]">{title || '—'}</div>
      <div className="mt-0.5 line-clamp-2 text-sm text-ink-2">{description || '—'}</div>
    </div>
  );
}

type Check = { level: 'ok' | 'warn' | 'bad' | 'info'; text: string };

function Checks({ siteUrl }: { siteUrl: string }) {
  const { data: d } = useEditor();
  const c: Check[] = [];
  if (!d.robots.index) c.push({ level: 'bad', text: 'Sayt axtarış sistemlərindən GİZLƏDİLİB (indekslənmə söndürülüb). Yayımda bunu açın.' });
  if (!siteUrl || !/^https:\/\//.test(siteUrl)) c.push({ level: 'bad', text: 'Ümumi ayarlarda "Sayt ünvanı" https:// ilə yazılmayıb. Canonical, sitemap və OG ünvanları buna əsaslanır.' });
  for (const l of ['az', 'en'] as const) {
    const t = d.defaultTitle[l].length, desc = d.defaultDescription[l].length;
    if (!t) c.push({ level: 'bad', text: `${l.toUpperCase()}: əsas başlıq boşdur.` });
    else if (t > 60) c.push({ level: 'warn', text: `${l.toUpperCase()}: əsas başlıq ${t} simvoldur, Google-da kəsilə bilər (ideal ≤ 60).` });
    else if (t < 25) c.push({ level: 'warn', text: `${l.toUpperCase()}: əsas başlıq qısadır (${t}). 30–60 simvol ideal sayılır.` });
    if (!desc) c.push({ level: 'bad', text: `${l.toUpperCase()}: əsas təsvir boşdur.` });
    else if (desc > 160) c.push({ level: 'warn', text: `${l.toUpperCase()}: təsvir ${desc} simvoldur, kəsilə bilər (ideal 70–160).` });
    else if (desc < 70) c.push({ level: 'warn', text: `${l.toUpperCase()}: təsvir qısadır (${desc}). 70–160 simvol ideal sayılır.` });
  }
  if (!d.ogImage) c.push({ level: 'warn', text: 'Paylaşım şəkli (OG) yoxdur. Sosial şəbəkələrdə link şəkilsiz görünəcək (ideal 1200×630).' });
  if (!d.verification.google) c.push({ level: 'info', text: 'Google Search Console doğrulama kodu əlavə olunmayıb.' });
  if (!d.analytics.ga4 && !d.analytics.gtm) c.push({ level: 'info', text: 'Analitika (GA4 və ya GTM) qoşulmayıb.' });
  if (d.business.enabled && !d.business.streetAddress) c.push({ level: 'info', text: 'Struktur datada küçə ünvanı yoxdur; yerli axtarış üçün "Struktur data" bölməsində doldurun.' });
  if (!d.geo.latitude || !d.geo.longitude) c.push({ level: 'info', text: 'Geo koordinatlar boşdur ("Geo" bölməsi).' });
  const bad = c.filter((x) => x.level === 'bad' || x.level === 'warn');
  const icon = { ok: <CheckCircle2 size={16} className="text-emerald-400" />, warn: <AlertTriangle size={16} className="text-gold" />, bad: <AlertTriangle size={16} className="text-red-400" />, info: <Info size={16} className="text-accent" /> };
  return (
    <Group title="SEO yoxlaması" hint="Cari (saxlanılmamış) dəyərlərə görə canlı hesablanır.">
      {c.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-emerald-400"><CheckCircle2 size={16} /> Bütün əsas yoxlamalar uğurludur.</div>
      ) : (
        <ul className="grid gap-2 text-sm">
          {[...c].sort((a, b) => ['bad', 'warn', 'info', 'ok'].indexOf(a.level) - ['bad', 'warn', 'info', 'ok'].indexOf(b.level)).map((x, i) => (
            <li key={i} className="flex items-start gap-2 text-ink-2"><span className="mt-0.5 shrink-0">{icon[x.level]}</span>{x.text}</li>
          ))}
        </ul>
      )}
      {bad.length === 0 && c.length > 0 && <div className="text-xs text-emerald-400">Kritik problem yoxdur, yuxarıdakılar tövsiyələrdir.</div>}
    </Group>
  );
}

function Body({ siteUrl, sections }: Omit<Props, 'initial'>) {
  const { data: d } = useEditor();
  const [tab, setTab] = useState('general');
  const tabs = [
    ['general', 'Ümumi'], ['pages', 'Səhifələr'], ['social', 'Sosial'], ['robots', 'Robot və Sitemap'],
    ['schema', 'Struktur data'], ['geo', 'Geo'], ['tools', 'Doğrulama və Analitika'], ['redirects', 'Yönləndirmələr'],
  ];
  const base = siteUrl.replace(/\/+$/, '') || 'https://sayt.az';

  return (
    <>
      <Checks siteUrl={siteUrl} />
      <div role="tablist" className="flex flex-wrap gap-1.5">
        {tabs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${tab === id ? 'border-accent bg-accent/15 text-accent-2' : 'border-white/10 text-ink-2 hover:border-white/30'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <>
          <Group title="Başlıq və təsvir" hint="Səhifənin öz başlığı/təsviri boş olduqda bunlar istifadə olunur.">
            <LText path="defaultTitle" label="Əsas səhifənin başlığı (title)" max={60} hint="Google nəticələrində mavi başlıq. 30–60 simvol." />
            <LText path="titleTemplate" label="Digər səhifələrin başlıq şablonu" hint="%s səhifənin adı ilə əvəz olunur. Məs.: %s | najms" />
            <LText path="defaultDescription" label="Əsas təsvir (meta description)" area rows={3} max={160} hint="70–160 simvol. Axtarış nəticəsində başlığın altında görünür." />
            <LText path="keywords" label="Açar sözlər" hint="Vergüllə ayırın. Müasir axtarışda təsiri azdır, amma bəzi sistemlər oxuyur." />
          </Group>
          <Group title="Şəkillər və rəng">
            <ImageField path="ogImage" label="Paylaşım şəkli (Open Graph)" hint="Tövsiyə: 1200×630 piksel. WhatsApp, Telegram, Facebook, LinkedIn-də link önizləməsi." />
            <ImageField path="favicon" label="Favicon (brauzer ikonu)" hint="Boş olsa standart ikon istifadə olunur. SVG və ya PNG." />
            <Color path="themeColor" label="Brauzer mövzu rəngi (theme-color)" />
          </Group>
        </>
      )}

      {tab === 'pages' && (
        <>
          <p className="text-sm text-ink-2">Hər səhifə üçün öz başlığını və təsvirini yaza bilərsiniz. Boş buraxsanız, bölmənin adı/giriş mətni və ya əsas dəyərlər götürülür.</p>
          {PAGES.map((p) => (
            <Group key={p.key} title={`${p.label} (${p.path || '/'})`}>
              <Toggle path={`pages.${p.key}.noindex`} label="Axtarışda göstərilməsin (noindex)" />
              <LText path={`pages.${p.key}.title`} label="Başlıq (title)" max={60} hint={p.key === 'home' ? 'Boş = əsas başlıq (şablonsuz).' : 'Boş = bölmənin adı. Şablon avtomatik əlavə olunur.'} />
              <LText path={`pages.${p.key}.description`} label="Təsvir (description)" area rows={2} max={160} />
              <ImageField path={`pages.${p.key}.ogImage`} label="Bu səhifənin paylaşım şəkli" hint="Boş = əsas paylaşım şəkli." />
              {(['az', 'en'] as const).map((l) => {
                const r = resolve(d, sections, p.key, l);
                return <Serp key={l} title={r.title} description={r.description} url={`${base}/${l}${p.path}`} />;
              })}
            </Group>
          ))}
        </>
      )}

      {tab === 'social' && (
        <Group title="Sosial şəbəkə önizləməsi" hint="Open Graph (Facebook, LinkedIn, WhatsApp, Telegram) teqləri başlıq, təsvir və şəkildən avtomatik yaranır. Sosial profil linkləri Ümumi ayarlardan götürülür və struktur dataya əlavə olunur.">
          <Row>
            <Pick path="twitter.card" label="X (Twitter) kart növü" options={[{ value: 'summary_large_image', label: 'Böyük şəkilli kart' }, { value: 'summary', label: 'Kiçik kart' }]} />
            <Text path="twitter.handle" label="X istifadəçi adı" hint="@olmadan və ya @ilə, məs. najms" />
          </Row>
        </Group>
      )}

      {tab === 'robots' && (
        <>
          <Group title="İndeksləmə" hint="Bunlar həm robots.txt-ə, həm hər səhifənin meta robots teqinə təsir edir.">
            <Toggle path="robots.index" label="Sayt axtarış sistemlərində indekslənsin" />
            <Toggle path="robots.follow" label="Robotlar linkləri izləsin" />
            <Row>
              <Pick path="robots.maxImagePreview" label="Şəkil önizləməsi (max-image-preview)" options={[{ value: 'large', label: 'Böyük' }, { value: 'standard', label: 'Standart' }, { value: 'none', label: 'Yoxdur' }]} />
              <Num path="robots.maxSnippet" label="Maksimum mətn parçası (max-snippet)" hint="-1 = məhdudiyyətsiz" />
            </Row>
            <Num path="robots.maxVideoPreview" label="Maksimum video önizləmə saniyəsi (max-video-preview)" hint="-1 = məhdudiyyətsiz" />
          </Group>
          <Group title="robots.txt" hint="/admin və /api həmişə bağlıdır.">
            <List path="robots.disallow" addLabel="Bağlanacaq yol əlavə et" make={() => ({ id: uid('d'), path: '/' })} title={(i) => i.path}>
              {(b) => <Text path={`${b}.path`} label="Yol" hint="/ ilə başlayır, məs. /private" />}
            </List>
            <Text path="robots.extra" label="Əlavə robots.txt sətirləri" area rows={4} hint="Xüsusi robotlar üçün, məs.: User-agent: GPTBot ⏎ Disallow: /" />
            <p className="text-xs text-ink-3">Nəticəni yoxlayın: <code>/robots.txt</code></p>
          </Group>
          <Group title="Sitemap və AI">
            <Toggle path="sitemap.enabled" label="sitemap.xml yaradılsın" />
            <Toggle path="sitemap.hreflang" label="Sitemap-da dil alternativləri (hreflang) olsun" />
            <Pick path="sitemap.changeFreq" label="Yenilənmə tezliyi" options={['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map((v) => ({ value: v, label: v }))} />
            <Toggle path="llmsTxt" label="llms.txt yaradılsın (ChatGPT, Perplexity kimi AI sistemləri üçün sayt xülasəsi)" />
            <p className="text-xs text-ink-3">Yoxlayın: <code>/sitemap.xml</code>, <code>/llms.txt</code></p>
          </Group>
        </>
      )}

      {tab === 'schema' && (
        <>
          <Group title="Şirkət (schema.org)" hint="Google-un şirkət məlumat panelini və yerli nəticələri qidalandıran struktur data (JSON-LD). Telefon, e-poçt və sosial linklər Ümumi ayarlardan gəlir.">
            <Toggle path="business.enabled" label="Struktur data göndərilsin" />
            <Pick path="business.type" label="Şirkət növü" options={[
              { value: 'ProfessionalService', label: 'ProfessionalService (xidmət şirkəti, tövsiyə olunur)' },
              { value: 'LocalBusiness', label: 'LocalBusiness (yerli biznes)' },
              { value: 'Organization', label: 'Organization (ümumi təşkilat)' },
              { value: 'Corporation', label: 'Corporation (korporasiya)' },
            ]} />
            <Row>
              <Text path="business.legalName" label="Hüquqi ad" hint="Məs. Najms Systems MMC" />
              <Text path="business.foundingDate" label="Təsis ili/tarixi" hint="2019 və ya 2019-05-20" />
            </Row>
            <Row>
              <Text path="business.priceRange" label="Qiymət aralığı" hint="Məs. $$ (ixtiyari)" />
              <div />
            </Row>
            <ImageField path="business.logo" label="Şirkət loqosu" hint="Kvadrat və ya üfüqi, min. 112×112. Google nəticələrində istifadə olunur." />
          </Group>
          <Group title="Ünvan">
            <Text path="business.streetAddress" label="Küçə, bina" />
            <Row>
              <Text path="business.locality" label="Şəhər" />
              <Text path="business.region" label="Rayon/region" />
            </Row>
            <Row>
              <Text path="business.postalCode" label="Poçt indeksi" />
              <Text path="business.country" label="Ölkə kodu" hint="AZ" />
            </Row>
          </Group>
          <Group title="İş saatları" hint="Yalnız LocalBusiness və ProfessionalService üçün göndərilir.">
            <List path="business.hours" addLabel="İş saatı əlavə et" make={() => ({ id: uid('h'), from: 'Monday', to: 'Friday', opens: '09:00', closes: '18:00' })} title={(h) => `${h.from} – ${h.to}, ${h.opens}–${h.closes}`}>
              {(b) => (
                <>
                  <Row>
                    <Pick path={`${b}.from`} label="Gündən" options={DAY_OPTS} />
                    <Pick path={`${b}.to`} label="Günə qədər" options={DAY_OPTS} />
                  </Row>
                  <Row>
                    <Text path={`${b}.opens`} label="Açılış" type="time" />
                    <Text path={`${b}.closes`} label="Bağlanış" type="time" />
                  </Row>
                </>
              )}
            </List>
          </Group>
          <Group title="Xidmət əraziləri və əlavə profillər">
            <List path="business.areaServed" addLabel="Ərazi əlavə et" make={() => ({ id: uid('a'), name: '' })} title={(i) => i.name}>
              {(b) => <Text path={`${b}.name`} label="Ölkə/şəhər" hint="Məs. Azerbaijan, Baku" />}
            </List>
            <List path="business.sameAs" addLabel="Profil linki əlavə et" make={() => ({ id: uid('sa'), url: '' })} title={(i) => i.url}>
              {(b) => <Text path={`${b}.url`} label="Link (https://…)" hint="Wikipedia, Crunchbase, Google Business kimi rəsmi profillər" />}
            </List>
          </Group>
        </>
      )}

      {tab === 'geo' && (
        <Group title="Geo məlumatları" hint="Yerli axtarış üçün: geo meta teqləri və struktur datadakı koordinatlar. Dəqiq koordinat üçün Google Maps-də ofisə sağ klik edib rəqəmləri kopyalayın.">
          <Row>
            <Text path="geo.region" label="Region kodu (geo.region)" hint="ISO 3166-2, Bakı üçün AZ-BA" />
            <Text path="geo.placename" label="Yer adı (geo.placename)" hint="Bakı" />
          </Row>
          <Row>
            <Text path="geo.latitude" label="Enlik (latitude)" hint="Məs. 40.4093" />
            <Text path="geo.longitude" label="Uzunluq (longitude)" hint="Məs. 49.8671" />
          </Row>
          <Text path="geo.mapUrl" label="Google Maps linki" hint="https://maps.google.com/… (struktur dataya hasMap kimi əlavə olunur)" />
          <p className="text-xs text-gold">Qeyd: ilkin koordinatlar Bakı şəhər mərkəzidir. Dəqiq ofis ünvanı ilə əvəz edin.</p>
        </Group>
      )}

      {tab === 'tools' && (
        <>
          <Group title="Sayt sahibliyi doğrulaması" hint="Hər xidmətin verdiyi meta teqdəki content dəyərini yazın (bütün teqi yox, yalnız kodu).">
            <Row>
              <Text path="verification.google" label="Google Search Console" />
              <Text path="verification.bing" label="Bing Webmaster (msvalidate.01)" />
            </Row>
            <Row>
              <Text path="verification.yandex" label="Yandex Webmaster" />
              <Text path="verification.facebook" label="Facebook domain verification" />
            </Row>
            <Text path="verification.pinterest" label="Pinterest (p:domain_verify)" />
          </Group>
          <Group title="Analitika və pikseller" hint="Yalnız canlı (production) saytda yüklənir. Qanunvericiliyə görə istifadəçi razılığı (cookie banneri) lazım ola bilər.">
            <Row>
              <Text path="analytics.ga4" label="Google Analytics 4" hint="G-XXXXXXXXXX" />
              <Text path="analytics.gtm" label="Google Tag Manager" hint="GTM-XXXXXXX" />
            </Row>
            <Row>
              <Text path="analytics.metaPixel" label="Meta (Facebook) Pixel ID" />
              <Text path="analytics.yandexMetrica" label="Yandex Metrica ID" />
            </Row>
            <Text path="analytics.clarity" label="Microsoft Clarity ID" />
          </Group>
        </>
      )}

      {tab === 'redirects' && (
        <Group title="Yönləndirmələr" hint="Köhnə ünvanları yeni ünvana yönləndirin ki, reytinq itməsin. Köhnə ünvan mövcud olmayan bir yol olmalıdır.">
          <List path="redirects" addLabel="Yönləndirmə əlavə et" make={() => ({ id: uid('r'), from: '/', to: '/az', permanent: true })} title={(r) => `${r.from} → ${r.to}`}>
            {(b) => (
              <>
                <Row>
                  <Text path={`${b}.from`} label="Köhnə ünvan" hint="/köhnə-səhifə (domensiz)" />
                  <Text path={`${b}.to`} label="Yeni ünvan" hint="/az/services və ya https://…" />
                </Row>
                <Toggle path={`${b}.permanent`} label="Daimi yönləndirmə (308, axtarış reytinqini ötürür). Söndürülsə müvəqqəti (307) olur." />
              </>
            )}
          </List>
        </Group>
      )}
    </>
  );
}

export function SeoForm({ initial, siteUrl, sections }: Props) {
  return (
    <Editor section="seo" title="SEO" desc="Axtarış sistemləri üçün bütün ayarlar. Saxladıqdan sonra dəyişikliklər dərhal saytda tətbiq olunur." initial={initial}>
      <Body siteUrl={siteUrl} sections={sections} />
    </Editor>
  );
}
