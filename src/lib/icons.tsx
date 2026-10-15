import {
  Bot,
  BarChart3,
  Cloud,
  Cpu,
  Database,
  FileSearch,
  Globe,
  Headset,
  Lock,
  MessageSquare,
  Monitor,
  Network,
  Server,
  ShieldCheck,
  Smartphone,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/** Admin paneldən seçilə bilən ikonlar. Yeni ikon əlavə etmək üçün bura əlavə edin. */
export const ICONS: Record<string, LucideIcon> = {
  headset: Headset,
  network: Network,
  'file-search': FileSearch,
  bot: Bot,
  database: Database,
  server: Server,
  shield: ShieldCheck,
  chart: BarChart3,
  globe: Globe,
  message: MessageSquare,
  monitor: Monitor,
  cloud: Cloud,
  cpu: Cpu,
  lock: Lock,
  mobile: Smartphone,
  wrench: Wrench,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Monitor;
  return <C className={className} aria-hidden="true" strokeWidth={1.8} />;
}
