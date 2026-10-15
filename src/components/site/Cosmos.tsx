'use client';
import { useEffect, useRef } from 'react';

const BASE = 600; // logonun vahid ölçüsü; real ölçü transform: scale ilə verilir

type Star = { x: number; y: number; r: number; depth: number; ph: number; sp: number; a: number; c: string };

/**
 * Saytın fon qatı: orijinal najms.az-dakı orbital loqo və ulduz səması.
 * Scroll ilə: ulduzlar fərqli sürətlərdə (parallaks) sürüşür, loqo isə
 * ekran boyu süzərək dönür, kiçilir və solğunlaşır.
 */
export function Cosmos() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const logo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const lg = logo.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !lg || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let vw = 0, vh = 0, raf = 0;
    let cur = window.scrollY; // hamarlaşdırılmış scroll dəyəri (ətalət effekti)

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const COLORS = ['#ffffff', '#ffffff', '#ffffff', '#a8d4ff', '#a8d4ff', '#c8a96e'];
    const stars: Star[] = Array.from({ length: 160 }, () => {
      const big = Math.random() < 0.12;
      return {
        x: Math.random(), y: Math.random(),
        r: big ? rnd(1.4, 2.2) : rnd(0.5, 1.2),
        depth: big ? rnd(0.35, 0.6) : rnd(0.08, 0.35),
        ph: rnd(0, 6.28), sp: rnd(0.6, 2.2), a: rnd(0.35, 1),
        c: COLORS[(Math.random() * COLORS.length) | 0],
      };
    });

    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(vw * dpr);
      cv.height = Math.round(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const place = () => {
      const maxS = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, cur / maxS));
      const mobile = vw < 768;
      const base = mobile ? Math.min(vw * 1.05, 420) : Math.min(vw * 0.46, 640);
      const sc = (base / BASE) * (1 - 0.3 * p);
      // Masaüstü: başlanğıc nöqtə — kartların sağındakı boş sahənin ortası, sonra sola süzür
      const startX = vw - Math.max(36, (vw - 1180) / 4);
      const sway = Math.sin(p * Math.PI * 3) ** 2;
      const cx = mobile ? vw * (0.5 + 0.22 * Math.sin(p * Math.PI * 3)) : startX - (startX - vw * 0.5) * 0.85 * sway;
      const cy = vh * (mobile ? 0.62 - 0.17 * p : 0.25 + 0.4 * p);
      lg.style.transform = `translate3d(${cx - BASE / 2}px, ${cy - BASE / 2}px, 0) rotate(${cur * 0.04}deg) scale(${sc})`;
      lg.style.opacity = String((0.95 - 0.5 * Math.min(1, cur / 700)) * (mobile ? 0.7 : 1));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, vw, vh);
      const H = vh + 80;
      for (const s of stars) {
        const y = ((((s.y * H - cur * s.depth) % H) + H) % H) - 40;
        const x = s.x * vw;
        const tw = reduce ? 1 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.sp + s.ph));
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, 6.283);
        ctx.fill();
        if (s.r > 1.4) {
          ctx.globalAlpha *= 0.5;
          ctx.fillRect(x - s.r * 3, y - 0.4, s.r * 6, 0.8);
          ctx.fillRect(x - 0.4, y - s.r * 3, 0.8, s.r * 6);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (t: number) => {
      raf = 0;
      cur += (window.scrollY - cur) * (reduce ? 1 : 0.1);
      place();
      draw(t);
      if (!reduce && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    resize();
    kick();
    window.addEventListener('resize', () => { resize(); kick(); });
    window.addEventListener('scroll', kick, { passive: true });
    document.addEventListener('visibilitychange', kick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      document.removeEventListener('visibilitychange', kick);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div ref={logo} className="absolute left-0 top-0 opacity-0 will-change-transform" style={{ width: BASE, height: BASE }}>
        <div className="cosmos-float h-full w-full">
          <svg viewBox="0 0 220 220" fill="none" className="h-full w-full overflow-visible">
            <defs>
              <radialGradient id="cosGlow">
                <stop offset="0" stopColor="var(--accent)" stopOpacity=".38" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cosBlue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
                <stop offset=".4" stopColor="var(--accent)" stopOpacity="1" />
                <stop offset="1" stopColor="var(--color-accent-2)" stopOpacity=".7" />
              </linearGradient>
              <linearGradient id="cosGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--gold)" stopOpacity="0" />
                <stop offset=".5" stopColor="var(--gold)" stopOpacity="1" />
                <stop offset="1" stopColor="#e8c98e" stopOpacity=".5" />
              </linearGradient>
              <radialGradient id="cosCore">
                <stop offset="0" stopColor="var(--accent)" stopOpacity=".95" />
                <stop offset=".45" stopColor="var(--accent)" stopOpacity=".45" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="110" cy="110" r="105" fill="url(#cosGlow)" />
            <circle cx="110" cy="110" r="95" stroke="rgba(79,156,249,.12)" strokeWidth=".6" />
            <circle cx="110" cy="110" r="78" stroke="rgba(79,156,249,.09)" strokeWidth=".6" />
            <ellipse className="orbital-ring" style={{ '--spd': '14s' } as React.CSSProperties} cx="110" cy="110" rx="80" ry="36" stroke="url(#cosBlue)" strokeWidth="1.6" transform="rotate(-30 110 110)" />
            <ellipse className="orbital-ring" style={{ '--spd': '10s', '--rev': 'reverse' } as React.CSSProperties} cx="110" cy="110" rx="80" ry="36" stroke="url(#cosGold)" strokeWidth="1.3" transform="rotate(30 110 110)" />
            <ellipse className="orbital-ring" style={{ '--spd': '18s' } as React.CSSProperties} cx="110" cy="110" rx="60" ry="28" stroke="rgba(79,156,249,.5)" strokeWidth=".9" />
            <circle cx="110" cy="110" r="20" fill="url(#cosCore)" />
            <circle cx="110" cy="110" r="7" fill="var(--accent)" opacity=".9" />
            <circle cx="110" cy="110" r="3.5" fill="#fff" />
            <circle cx="110" cy="32" r="2.5" fill="#fff" opacity=".95" />
            <circle cx="168" cy="56" r="1.5" fill="var(--gold)" opacity=".8" />
            <circle cx="52" cy="164" r="1.8" fill="var(--accent)" opacity=".7" />
            <circle cx="188" cy="148" r="1.2" fill="#fff" opacity=".6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
