import { z } from 'zod';

/* ───────── Dillər ───────── */
export const LANGS = ['az', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'az';
export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);

/** İki dilli mətn */
export const L = z.object({ az: z.string(), en: z.string() });
export type LText = z.infer<typeof L>;

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Rəng #RRGGBB formatında olmalıdır');
const id = z.string().min(1);
const cta = z.object({ label: L, href: z.string() });

/* ───────── Bölmə sxemləri ───────── */
export const SOCIAL_KINDS = ['linkedin', 'instagram', 'facebook', 'x', 'telegram', 'youtube'] as const;

const settings = z.object({
  brandName: z.string().min(1),
  brandPill: z.string(),
  siteUrl: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  email: z.string(),
  address: L,
  social: z.array(z.object({ id, kind: z.enum(SOCIAL_KINDS), url: z.string() })),
  theme: z.object({ accent: hex, gold: hex }),
});

const nav = z.object({
  items: z.array(z.object({ id, label: L, href: z.string(), visible: z.boolean() })),
  cta: cta,
});

const hero = z.object({
  visible: z.boolean(),
  eyebrow: L,
  title: L,
  subtitle: L,
  primary: cta,
  secondary: cta,
  stats: z.array(
    z.object({ id, value: z.number(), label: L, tone: z.enum(['accent', 'gold']) }),
  ),
  partnerCardLabel: L,
  contactCardLabel: L,
});

const services = z.object({
  visible: z.boolean(),
  showOnHome: z.boolean().default(true),
  eyebrow: L,
  title: L,
  lead: L,
  items: z.array(
    z.object({
      id,
      icon: z.string(),
      title: L,
      description: L,
      featured: z.boolean(),
      visible: z.boolean(),
    }),
  ),
});

const packages = z.object({
  visible: z.boolean(),
  showOnHome: z.boolean().default(true),
  eyebrow: L,
  title: L,
  lead: L,
  items: z.array(
    z.object({
      id,
      tier: L,
      name: z.string(),
      subtitle: L,
      features: z.array(z.object({ id, text: L })),
      highlighted: z.boolean(),
      ctaLabel: L,
      visible: z.boolean(),
    }),
  ),
});

const contact = z.object({
  visible: z.boolean(),
  showOnHome: z.boolean().default(true),
  eyebrow: L,
  title: L,
  lead: L,
  addressLabel: L,
  phoneLabel: L,
  emailLabel: L,
  form: z.object({
    name: L,
    surname: L,
    email: L,
    company: L,
    service: L,
    selectDefault: L,
    otherOption: L,
    message: L,
    placeholder: L,
    submit: L,
    sending: L,
    success: L,
    error: L,
  }),
});

const partners = z.object({
  visible: z.boolean(),
  showOnHome: z.boolean().default(true),
  eyebrow: L,
  title: L,
  lead: L,
  badge: L,
  linkLabel: L,
  items: z.array(
    z.object({
      id,
      name: z.string(),
      description: L,
      url: z.string(),
      logo: z.string().default(''),
      logoTile: z.boolean().default(true),
      visible: z.boolean(),
    }),
  ),
});

/* ───────── SEO ───────── */
export const PAGE_KEYS = ['home', 'services', 'packages', 'partners', 'contact'] as const;
export type PageKey = (typeof PAGE_KEYS)[number];
export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export const BUSINESS_TYPES = ['Organization', 'LocalBusiness', 'ProfessionalService', 'Corporation'] as const;

const tag = (re: RegExp, msg: string) => z.string().regex(re, msg);
const pageSeo = z.object({ title: L, description: L, ogImage: z.string(), noindex: z.boolean() });

const seo = z.object({
  defaultTitle: L,
  titleTemplate: L, // məs. "%s | najms"
  defaultDescription: L,
  keywords: L,
  ogImage: z.string(),
  favicon: z.string(),
  themeColor: hex,
  twitter: z.object({ card: z.enum(['summary', 'summary_large_image']), handle: z.string() }),
  robots: z.object({
    index: z.boolean(),
    follow: z.boolean(),
    maxSnippet: z.number().int().min(-1).max(1000),
    maxImagePreview: z.enum(['none', 'standard', 'large']),
    maxVideoPreview: z.number().int().min(-1).max(1000),
    disallow: z.array(z.object({ id, path: z.string().startsWith('/', 'Yol / ilə başlamalıdır') })),
    extra: z.string().max(2000),
  }),
  sitemap: z.object({
    enabled: z.boolean(),
    changeFreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']),
    hreflang: z.boolean(),
  }),
  llmsTxt: z.boolean(),
  verification: z.object({
    google: tag(/^[\w\-.:]*$/, 'Yalnız kodu yazın'),
    bing: tag(/^[\w\-.:]*$/, 'Yalnız kodu yazın'),
    yandex: tag(/^[\w\-.:]*$/, 'Yalnız kodu yazın'),
    facebook: tag(/^[\w\-.:]*$/, 'Yalnız kodu yazın'),
    pinterest: tag(/^[\w\-.:]*$/, 'Yalnız kodu yazın'),
  }),
  analytics: z.object({
    ga4: tag(/^$|^G-[A-Z0-9]{4,20}$/, 'GA4 ID belə olmalıdır: G-XXXXXXXXXX'),
    gtm: tag(/^$|^GTM-[A-Z0-9]{3,12}$/, 'GTM ID belə olmalıdır: GTM-XXXXXXX'),
    metaPixel: tag(/^$|^\d{5,20}$/, 'Meta Pixel ID yalnız rəqəmlərdən ibarətdir'),
    yandexMetrica: tag(/^$|^\d{4,12}$/, 'Yandex Metrica ID yalnız rəqəmlərdən ibarətdir'),
    clarity: tag(/^$|^[a-z0-9]{6,15}$/, 'Clarity ID yanlışdır'),
  }),
  geo: z.object({
    region: tag(/^$|^[A-Z]{2}(-[A-Z0-9]{1,3})?$/, 'Məs. AZ-BA'),
    placename: z.string(),
    latitude: tag(/^$|^-?\d{1,2}(\.\d+)?$/, 'Enlik rəqəm olmalıdır, məs. 40.4093'),
    longitude: tag(/^$|^-?\d{1,3}(\.\d+)?$/, 'Uzunluq rəqəm olmalıdır, məs. 49.8671'),
    mapUrl: z.string(),
  }),
  business: z.object({
    enabled: z.boolean(),
    type: z.enum(BUSINESS_TYPES),
    legalName: z.string(),
    logo: z.string(),
    foundingDate: z.string(),
    priceRange: z.string(),
    streetAddress: z.string(),
    locality: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: tag(/^$|^[A-Z]{2}$/, 'İki hərfli ölkə kodu, məs. AZ'),
    hours: z.array(z.object({ id, from: z.enum(WEEK_DAYS), to: z.enum(WEEK_DAYS), opens: z.string(), closes: z.string() })),
    areaServed: z.array(z.object({ id, name: z.string() })),
    sameAs: z.array(z.object({ id, url: z.string() })),
  }),
  pages: z.object({ home: pageSeo, services: pageSeo, packages: pageSeo, partners: pageSeo, contact: pageSeo }),
  redirects: z.array(
    z.object({
      id,
      from: z.string().startsWith('/', 'Köhnə ünvan / ilə başlamalıdır'),
      to: z.string().min(1),
      permanent: z.boolean(),
    }),
  ),
});

const footer = z.object({
  brandText: L,
  columns: z.array(
    z.object({
      id,
      title: L,
      links: z.array(z.object({ id, label: L, href: z.string() })),
    }),
  ),
  legal: z.array(z.object({ id, label: L, href: z.string() })),
  copyright: L,
});

export const schemas = { settings, nav, hero, services, packages, contact, partners, seo, footer } as const;
export type SectionKey = keyof typeof schemas;
export const SECTION_KEYS = Object.keys(schemas) as SectionKey[];
export const isSection = (v: string): v is SectionKey => (SECTION_KEYS as string[]).includes(v);

export const siteSchema = z.object(schemas);
export type SiteContent = z.infer<typeof siteSchema>;
export type Settings = SiteContent['settings'];
export type NavContent = SiteContent['nav'];
export type HeroContent = SiteContent['hero'];
export type ServicesContent = SiteContent['services'];
export type PackagesContent = SiteContent['packages'];
export type ContactContent = SiteContent['contact'];
export type PartnersContent = SiteContent['partners'];
export type SeoContent = SiteContent['seo'];
export type FooterContent = SiteContent['footer'];

/* ───────── Mesajlar (əlaqə formu) ───────── */
export type Message = {
  id: string;
  createdAt: string;
  name: string;
  surname: string;
  email: string;
  company: string;
  service: string;
  message: string;
  lang: Lang;
  read: boolean;
};

export const contactInput = z.object({
  name: z.string().trim().min(1).max(80),
  surname: z.string().trim().max(80).default(''),
  email: z.email().max(160),
  company: z.string().trim().max(120).default(''),
  service: z.string().trim().max(120).default(''),
  message: z.string().trim().min(5).max(4000),
  lang: z.enum(LANGS).default('az'),
  website: z.string().optional(), // honeypot
});

/* ───────── Köməkçilər ───────── */
export const tr = (v: LText, lang: Lang): string => v[lang] || v.az;
