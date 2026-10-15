# Najms Systems — veb sayt (Next.js + admin panel)

Dizayn: **E variantı (Glass Bento)**. Saytdakı bütün görünən məzmun `data/site.json`-da saxlanılır və **admin paneldən** idarə olunur (AZ / EN).

## İşə salmaq (Windows)
Node.js 20+ lazımdır.

```
npm install
npm run dev
```

- Sayt: http://localhost:3000  (avtomatik /az-a yönləndirir; İngiliscə: /en)
- Admin: http://localhost:3000/admin
- Parol `.env.local` faylındadır (`ADMIN_PASSWORD`). **Yayımlamazdan əvvəl mütləq dəyişin.**

Produksiya: `npm run build` → `npm start`

## Admin paneldə nələr idarə olunur
Əsas blok (hero), Xidmətlər (ikon, ad, təsvir, böyük kart, gizlətmə, sıralama), Paketlər, Əlaqə bölməsi və form yazıları, Menyu, Footer, Ümumi ayarlar (brend, telefon, WhatsApp, e-poçt, ünvan, sosial şəbəkələr, rənglər), Partnyorlar və **SEO** və **Mesajlar** (əlaqə formundan gələnlər).
Mətnlərdə `**qalın**` və `*vurğulanmış*` işarələməsi işləyir.

## SEO (admin → SEO)
Hamısı admin paneldən idarə olunur və saytda dərhal tətbiq olunur:
- Başlıq şablonu, təsvir, açar sözlər, OG şəkli, favicon, theme-color, Twitter kartı
- Hər səhifə üçün ayrıca başlıq/təsvir/şəkil/noindex + Google nəticə önbaxışı (AZ/EN)
- canonical, hreflang (x-default), `robots.txt` (qadağalar + əlavə sətirlər), `sitemap.xml`, `llms.txt`, `manifest`
- Struktur data (JSON-LD): WebSite, biznes tipi, ünvan, iş saatları, xidmət əhatəsi, sameAs, Breadcrumb, Service siyahısı
- Geo: region, yer adı, koordinatlar (geo.* və ICBM meta, JSON-LD geo), xəritə linki
- Doğrulama kodları (Google, Bing, Yandex, Facebook, Pinterest) və analitika (GA4, GTM, Meta Pixel, Yandex Metrica, Clarity — yalnız production-da yüklənir)
- Yönləndirmələr (308 daimi / 307 müvəqqəti)
- Saytı tam noindex etmək: robots.txt `Disallow: /`, sitemap boş
Başlamazdan əvvəl: real sayt ünvanını, ofis koordinatlarını (seed Bakı mərkəzidir) və OG şəklini daxil edin.

## Mühit dəyişənləri (`.env.local`, bax `.env.example`)
- `ADMIN_PASSWORD` — admin parolu
- `SESSION_SECRET` — ən azı 24 simvol (təsadüfi uzun mətn)
- `CONTACT_WEBHOOK_URL` — (ixtiyari) yeni mesaj gələndə n8n və s. webhook
- `DATA_DIR` — (ixtiyari) data qovluğunun yeri

## Qeydlər
- Məlumat fayl əsaslıdır (`data/site.json`, `data/messages.json`) → daimi diski olan serverdə (VPS/Docker) işlədin. Vercel kimi yalnız-oxu mühitdə `src/lib/store.ts` verilənlər bazası ilə əvəz edilməlidir (yalnız bu fayl dəyişir).
- Rate-limit yaddaşdadır (tək server üçün).
- `data/messages.json` git-ə düşmür.
