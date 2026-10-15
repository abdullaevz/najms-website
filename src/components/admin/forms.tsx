'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor, Group, IconPick, ImageField, LText, List, Num, Pick, Row, Text, Toggle, Color, uid } from './Editor';

const RICH = 'İstəyə görə: **qalın**, *vurğulanmış söz*';
const az = (v: any) => v?.az || '';
const Link = ({ base, label }: { base: string; label: string }) => (
  <Row>
    <LText path={`${base}.label`} label={`${label} — yazı`} />
    <Text path={`${base}.href`} label={`${label} — keçid`} hint="/contact kimi səhifə və ya https://… ünvanı" />
  </Row>
);

export function SettingsForm({ initial }: { initial: any }) {
  return (
    <Editor section="settings" title="Ümumi ayarlar" desc="Brend, əlaqə məlumatları, tərəfdaşlar, SEO və rənglər." initial={initial}>
      <Group title="Brend">
        <Row>
          <Text path="brandName" label="Brend adı" />
          <Text path="brandPill" label="Brend etiketi (ad yanındakı)" />
        </Row>
        <Text path="siteUrl" label="Sayt ünvanı" hint="https://najms.az — canonical, sitemap və SEO üçün əsas ünvan (SEO bölməsi bunu istifadə edir)" />
      </Group>
      <Group title="Əlaqə">
        <Row>
          <Text path="phone" label="Telefon" />
          <Text path="whatsapp" label="WhatsApp nömrəsi" hint="Yalnız rəqəmlər, ölkə kodu ilə: 994552189508" />
        </Row>
        <Text path="email" label="E-poçt" type="email" />
        <LText path="address" label="Ünvan" />
      </Group>
      <Group title="Sosial şəbəkələr" hint="Əlavə etdikdə footerdə görünür.">
        <List path="social" addLabel="Şəbəkə əlavə et" make={() => ({ id: uid('s'), kind: 'linkedin', url: '' })} title={(i) => `${i.kind} — ${i.url}`}>
          {(b) => (
            <Row>
              <Pick path={`${b}.kind`} label="Şəbəkə" options={['linkedin', 'instagram', 'facebook', 'x', 'telegram', 'youtube'].map((v) => ({ value: v, label: v }))} />
              <Text path={`${b}.url`} label="Ünvan (https://…)" />
            </Row>
          )}
        </List>
      </Group>
      <Group title="Rənglər" hint="Saytın vurğu rəngləri bütün səhifədə dərhal dəyişir.">
        <Row>
          <Color path="theme.accent" label="Əsas vurğu rəngi" />
          <Color path="theme.gold" label="Qızılı rəng" />
        </Row>
      </Group>
    </Editor>
  );
}

export function HeroForm({ initial }: { initial: any }) {
  return (
    <Editor section="hero" title="Əsas blok (Hero)" desc="Səhifənin yuxarısındakı bento kartlar." initial={initial}>
      <Group title="Görünüş"><Toggle path="visible" label="Bu blok saytda görünsün" /></Group>
      <Group title="Mətnlər">
        <LText path="eyebrow" label="Kiçik etiket" />
        <LText path="title" label="Başlıq" hint={RICH} area rows={2} />
        <LText path="subtitle" label="Alt mətn" hint={RICH} area rows={3} />
      </Group>
      <Group title="Düymələr">
        <Link base="primary" label="Əsas düymə" />
        <Link base="secondary" label="İkinci düymə" />
      </Group>
      <Group title="Statistika kartları" hint="İlk 2 kart göstərilir.">
        <List path="stats" addLabel="Kart əlavə et" make={() => ({ id: uid('st'), value: 0, tone: 'accent', label: { az: '', en: '' } })} title={(i) => `${i.value} — ${az(i.label)}`}>
          {(b) => (
            <>
              <Row>
                <Num path={`${b}.value`} label="Rəqəm" />
                <Pick path={`${b}.tone`} label="Rəng" options={[{ value: 'accent', label: 'Mavi' }, { value: 'gold', label: 'Qızılı' }]} />
              </Row>
              <LText path={`${b}.label`} label="Yazı" />
            </>
          )}
        </List>
      </Group>
      <Group title="Alt kartlar">
        <LText path="partnerCardLabel" label="Tərəfdaş kartı başlığı" hint="Tərəfdaş adları Ümumi ayarlardan gəlir." />
        <LText path="contactCardLabel" label="Əlaqə kartı başlığı" hint="Nömrə Ümumi ayarlardan gəlir." />
      </Group>
    </Editor>
  );
}

export function ServicesForm({ initial }: { initial: any }) {
  return (
    <Editor section="services" title="Xidmətlər" desc="Xidmət kartları. “Böyük kart” iki sütun tutur." initial={initial}>
      <Group title="Bölmə başlığı">
        <Toggle path="visible" label="Bölmənin öz səhifəsi görünsün" />
        <Toggle path="showOnHome" label="Əsas səhifədə də göstər" />
        <LText path="eyebrow" label="Kiçik etiket" />
        <LText path="title" label="Başlıq" hint={RICH} />
        <LText path="lead" label="Giriş mətni" area rows={2} />
      </Group>
      <Group title="Xidmətlər">
        <List path="items" addLabel="Xidmət əlavə et" make={() => ({ id: uid('sv'), icon: 'monitor', title: { az: '', en: '' }, description: { az: '', en: '' }, featured: false, visible: true })} title={(i) => `${az(i.title)}${i.visible ? '' : ' (gizli)'}`}>
          {(b) => (
            <>
              <IconPick path={`${b}.icon`} label="İkon" />
              <LText path={`${b}.title`} label="Ad" />
              <LText path={`${b}.description`} label="Təsvir" hint={RICH} area rows={3} />
              <div className="flex flex-wrap gap-6">
                <Toggle path={`${b}.featured`} label="Böyük kart" />
                <Toggle path={`${b}.visible`} label="Görünsün" />
              </div>
            </>
          )}
        </List>
      </Group>
    </Editor>
  );
}

export function PackagesForm({ initial }: { initial: any }) {
  return (
    <Editor section="packages" title="Xidmət paketləri" initial={initial}>
      <Group title="Bölmə başlığı">
        <Toggle path="visible" label="Bölmənin öz səhifəsi görünsün" />
        <Toggle path="showOnHome" label="Əsas səhifədə də göstər" />
        <LText path="eyebrow" label="Kiçik etiket" />
        <LText path="title" label="Başlıq" hint={RICH} />
        <LText path="lead" label="Giriş mətni" area rows={2} />
      </Group>
      <Group title="Paketlər">
        <List path="items" addLabel="Paket əlavə et" make={() => ({ id: uid('pk'), tier: { az: '', en: '' }, name: '', subtitle: { az: '', en: '' }, features: [], highlighted: false, ctaLabel: { az: 'Seç', en: 'Choose' }, visible: true })} title={(i) => `${i.name}${i.visible ? '' : ' (gizli)'}`}>
          {(b) => (
            <>
              <Row>
                <Text path={`${b}.name`} label="Paket adı" />
                <LText path={`${b}.tier`} label="Səviyyə yazısı" />
              </Row>
              <LText path={`${b}.subtitle`} label="Qısa təsvir" hint={RICH} area rows={2} />
              <List path={`${b}.features`} nested label="Xüsusiyyətlər" addLabel="Xüsusiyyət əlavə et" make={() => ({ id: uid('f'), text: { az: '', en: '' } })} title={(f) => az(f.text)}>
                {(fb) => <LText path={`${fb}.text`} label="Mətn" hint={RICH} />}
              </List>
              <LText path={`${b}.ctaLabel`} label="Düymə yazısı" />
              <div className="flex flex-wrap gap-6">
                <Toggle path={`${b}.highlighted`} label="Seçilmiş (qızılı çərçivə)" />
                <Toggle path={`${b}.visible`} label="Görünsün" />
              </div>
            </>
          )}
        </List>
      </Group>
    </Editor>
  );
}

const FORM_FIELDS: [string, string][] = [
  ['name', 'Ad sahəsi'], ['surname', 'Soyad sahəsi'], ['email', 'E-poçt sahəsi'], ['company', 'Şirkət sahəsi'],
  ['service', 'Xidmət sahəsi'], ['selectDefault', 'Xidmət siyahısı — ilkin seçim'], ['otherOption', 'Xidmət siyahısı — “digər”'],
  ['message', 'Mesaj sahəsi'], ['placeholder', 'Mesaj nümunə yazısı'], ['submit', 'Göndər düyməsi'], ['sending', 'Göndərilir…'],
  ['success', 'Uğur mesajı'], ['error', 'Xəta mesajı'],
];

export function ContactForm_({ initial }: { initial: any }) {
  return (
    <Editor section="contact" title="Əlaqə bölməsi" desc="Telefon, e-poçt və ünvan Ümumi ayarlardan gəlir. Gələn mesajlar “Mesajlar” bölməsində." initial={initial}>
      <Group title="Bölmə">
        <Toggle path="visible" label="Bölmənin öz səhifəsi görünsün" />
        <Toggle path="showOnHome" label="Əsas səhifədə də göstər" />
        <LText path="eyebrow" label="Kiçik etiket" />
        <LText path="title" label="Başlıq" hint={RICH} />
        <LText path="lead" label="Giriş mətni" area rows={2} />
        <LText path="addressLabel" label="“Ünvan” yazısı" />
        <LText path="phoneLabel" label="“Telefon” yazısı" />
        <LText path="emailLabel" label="“E-poçt” yazısı" />
      </Group>
      <Group title="Form yazıları">
        {FORM_FIELDS.map(([k, l]) => <LText key={k} path={`form.${k}`} label={l} />)}
      </Group>
    </Editor>
  );
}

export function NavForm({ initial }: { initial: any }) {
  return (
    <Editor section="nav" title="Menyu" desc="Yuxarı naviqasiya." initial={initial}>
      <Group title="Menyu bəndləri">
        <List path="items" addLabel="Bənd əlavə et" make={() => ({ id: uid('n'), label: { az: '', en: '' }, href: '#', visible: true })} title={(i) => `${az(i.label)}${i.visible ? '' : ' (gizli)'}`}>
          {(b) => (
            <>
              <LText path={`${b}.label`} label="Yazı" />
              <Text path={`${b}.href`} label="Keçid" hint="/services, /packages, /partners, /contact (səhifələr) və ya https://… ünvanı" />
              <Toggle path={`${b}.visible`} label="Görünsün" />
            </>
          )}
        </List>
      </Group>
      <Group title="Yuxarı sağ düymə"><Link base="cta" label="Düymə" /></Group>
    </Editor>
  );
}

export function FooterForm({ initial }: { initial: any }) {
  return (
    <Editor section="footer" title="Footer" desc="Alt hissə. Sosial şəbəkələr Ümumi ayarlardan gəlir." initial={initial}>
      <Group title="Brend mətni"><LText path="brandText" label="Təsvir" area rows={3} /></Group>
      <Group title="Sütunlar">
        <List path="columns" addLabel="Sütun əlavə et" make={() => ({ id: uid('fc'), title: { az: '', en: '' }, links: [] })} title={(c) => az(c.title)}>
          {(b) => (
            <>
              <LText path={`${b}.title`} label="Sütun başlığı" />
              <List path={`${b}.links`} nested label="Keçidlər" addLabel="Keçid əlavə et" make={() => ({ id: uid('fl'), label: { az: '', en: '' }, href: '#' })} title={(l) => az(l.label)}>
                {(lb) => <Link base={lb} label="Keçid" />}
              </List>
            </>
          )}
        </List>
      </Group>
      <Group title="Hüquqi keçidlər" hint="Məs. Məxfilik siyasəti. Səhifəsi hazır olduqda əlavə edin.">
        <List path="legal" addLabel="Keçid əlavə et" make={() => ({ id: uid('lg'), label: { az: '', en: '' }, href: '' })} title={(l) => az(l.label)}>
          {(b) => <Link base={b} label="Keçid" />}
        </List>
      </Group>
      <Group title="Müəllif hüququ"><LText path="copyright" label="Yazı" /></Group>
    </Editor>
  );
}

export function PartnersForm({ initial }: { initial: any }) {
  return (
    <Editor section="partners" title="Partnyorlar" desc="Partnyorlar səhifəsi (/partners)." initial={initial}>
      <Group title="Səhifə başlığı">
        <Toggle path="visible" label="Partnyorlar səhifəsi görünsün" />
        <Toggle path="showOnHome" label="Əsas səhifədə də göstər" />
        <LText path="eyebrow" label="Kiçik etiket" />
        <LText path="title" label="Başlıq" hint={RICH} />
        <LText path="lead" label="Giriş mətni" area rows={3} />
        <Row>
          <LText path="badge" label="Kartdakı nişan yazısı" />
          <LText path="linkLabel" label="Sayta keçid düyməsi" />
        </Row>
      </Group>
      <Group title="Partnyorlar">
        <List path="items" addLabel="Partnyor əlavə et" make={() => ({ id: uid('pt'), name: '', description: { az: '', en: '' }, url: '', logo: '', logoTile: true, visible: true })} title={(i) => `${i.name}${i.visible ? '' : ' (gizli)'}`}>
          {(b) => (
            <>
              <Text path={`${b}.name`} label="Ad" />
              <LText path={`${b}.description`} label="Təsvir" hint={RICH} area rows={3} />
              <ImageField path={`${b}.logo`} label="Logo" hint="PNG, JPG, WebP və ya SVG, ən çoxu 1.5 MB. Rəsmi logonu partnyorun brend səhifəsindən yükləyin." />
              <Toggle path={`${b}.logoTile`} label="Logonun arxasında ağ fon (tünd logolar üçün)" />
              <Text path={`${b}.url`} label="Sayt ünvanı" hint="https://… (boş olsa düymə göstərilmir)" />
              <Toggle path={`${b}.visible`} label="Görünsün" />
            </>
          )}
        </List>
      </Group>
    </Editor>
  );
}
