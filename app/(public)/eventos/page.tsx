import React from 'react';
import { getEvents } from '@/app/lib/data-service';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eventos · Pokétienda',
  description: 'Torneos Pokémon, prerelease, book club de manga y más eventos en Pokétienda Leganés.',
};

const BLUE  = 'oklch(38% 0.16 263)';
const BLUE_D = 'oklch(28% 0.14 263)';
const GOLD  = 'oklch(78% 0.13 88)';
const RED   = 'oklch(56% 0.20 27)';
const CREAM = '#f4efe6';
const INK   = '#0e1538';
const LINE  = 'rgba(14,21,56,0.10)';
const MUTED = 'rgba(14,21,56,0.55)';
const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';
const FJ = 'var(--font-jp),"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';

const BADGE_COLORS: Record<string, { bg: string; fg: string }> = {
  torneo:    { bg: BLUE,  fg: CREAM },
  prerelease:{ bg: RED,   fg: CREAM },
  bookclub:  { bg: INK,   fg: GOLD  },
  liga:      { bg: BLUE_D,fg: CREAM },
};

function badgeStyle(badge: string) {
  const key = badge.toLowerCase().replace(/\s/g, '');
  return BADGE_COLORS[key] ?? { bg: INK, fg: CREAM };
}

const RECURRING = [
  {
    id: 'liga',
    title: 'Liga Pokémon',
    subtitle: 'リーグ',
    freq: 'Cada sábado · 17:00',
    desc: 'Formato estándar. Apúntate en tienda antes del viernes. Todos los niveles.',
    badge: 'Liga',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    id: 'bookclub',
    title: 'Book Club Manga',
    subtitle: '漫画部',
    freq: 'Primer viernes de mes · 19:00',
    desc: 'Lectura y debate colectivo. Cada mes un título distinto — consultad el siguiente en tienda.',
    badge: 'BookClub',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
];

export default async function EventosPage() {
  const rawEvents = await getEvents();
  const events = rawEvents.map((ev) => ({
    id: ev.id,
    date: { d: ev.date_day, m: ev.date_month, dow: ev.date_dow },
    when: ev.time,
    title: ev.title,
    desc: ev.description,
    price: ev.price,
    badge: ev.badge,
  }));

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        background: BLUE, color: CREAM,
        padding: '80px 56px 72px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', right: -20, top: -60,
          fontFamily: FJ, fontWeight: 900, fontSize: 480, lineHeight: 0.85,
          color: 'rgba(244,239,230,0.05)', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>イベント</div>
        <div style={{ position: 'relative', maxWidth: 720 }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: GOLD, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 20 }}>
            ★ Eventos · イベント
          </div>
          <h1 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(40px,6vw,80px)', fontWeight: 700, letterSpacing: -3, lineHeight: 0.92, color: CREAM }}>
            Juega,<br />
            <em style={{ fontStyle: 'italic', color: GOLD }}>debate,</em><br />
            colecciona.
          </h1>
          <p style={{ margin: '28px 0 0', fontFamily: FB, fontSize: 17, lineHeight: 1.55, color: 'rgba(244,239,230,0.72)', maxWidth: 480 }}>
            Torneos semanales, prerelease de los nuevos sets y club de lectura de manga. Si juegas o lees, esto también es tu casa.
          </p>
        </div>
      </section>

      {/* ── Próximos eventos ── */}
      <section style={{ padding: '80px 56px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>
            ★ Próximos eventos
          </div>
          <h2 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, letterSpacing: -1.2, lineHeight: 1, color: INK }}>
            En el calendario.
          </h2>
        </div>

        {events.length === 0 ? (
          <div style={{ padding: '56px 0', textAlign: 'center', color: MUTED, fontFamily: FB, fontSize: 16 }}>
            No hay eventos programados ahora mismo. Pásate por la tienda para enterarte de lo que se cuece.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {events.map((ev) => {
              const { bg, fg } = badgeStyle(ev.badge);
              return (
                <article key={ev.id} style={{
                  background: 'white', border: `1px solid ${LINE}`,
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                }}>
                  {/* Date strip */}
                  <div style={{ background: BLUE, padding: '20px 24px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: FD, fontSize: 52, fontWeight: 700, letterSpacing: -2, lineHeight: 1, color: CREAM }}>{ev.date.d}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontFamily: FM, fontSize: 12, color: GOLD, letterSpacing: 1.5, textTransform: 'uppercase' }}>{ev.date.m}</span>
                      <span style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.55)', textTransform: 'uppercase', letterSpacing: 1 }}>{ev.date.dow}</span>
                    </div>
                    <span style={{ marginLeft: 'auto', alignSelf: 'center', padding: '5px 11px', background: bg, color: fg, fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                      {ev.badge}
                    </span>
                  </div>
                  {/* Content */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: 'uppercase' }}>{ev.when}</div>
                    <h3 style={{ margin: 0, fontFamily: FD, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.15, color: INK }}>{ev.title}</h3>
                    <p style={{ margin: 0, fontFamily: FB, fontSize: 14, lineHeight: 1.55, color: MUTED, flex: 1 }}>{ev.desc}</p>
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FD, fontSize: 18, fontWeight: 700, color: INK }}>{ev.price}</span>
                      <a href={`/eventos/${ev.id}`} style={{
                        padding: '8px 16px', background: GOLD, color: INK,
                        fontFamily: FB, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}>
                        Ver evento →
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Eventos recurrentes ── */}
      <section id="torneos" style={{ padding: '80px 56px', background: CREAM, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>
            Siempre en tienda
          </div>
          <h2 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, letterSpacing: -1.2, lineHeight: 1, color: INK }}>
            Cada semana, sin falta.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
          {RECURRING.map((r) => {
            const { bg, fg } = badgeStyle(r.badge);
            return (
              <div key={r.id} id={r.id} style={{ background: 'white', border: `1px solid ${LINE}`, padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden style={{ position: 'absolute', right: -12, bottom: -28, fontFamily: FJ, fontWeight: 900, fontSize: 120, color: 'rgba(14,21,56,0.04)', lineHeight: 1 }}>{r.subtitle}</div>
                <div style={{ marginBottom: 20, color: BLUE }}>{r.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 10px', background: bg, color: fg, fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>{r.badge}</span>
                  <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.5 }}>{r.freq}</span>
                </div>
                <h3 style={{ margin: '0 0 10px', fontFamily: FD, fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: INK }}>{r.title}</h3>
                <p style={{ margin: 0, fontFamily: FB, fontSize: 14, lineHeight: 1.6, color: MUTED }}>{r.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Visitar ── */}
      <section style={{ padding: '80px 56px', background: INK, color: CREAM }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ fontFamily: FJ, fontSize: 64, fontWeight: 900, color: 'rgba(244,239,230,0.06)', lineHeight: 1, marginBottom: 8 }}>参加</div>
          <h2 style={{ margin: '0 0 16px', fontFamily: FD, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: -1.2, lineHeight: 1, color: CREAM }}>
            ¿Te apuntas?
          </h2>
          <p style={{ margin: '0 0 32px', fontFamily: FB, fontSize: 17, lineHeight: 1.55, color: 'rgba(244,239,230,0.65)' }}>
            Pásate por la tienda o escríbenos. No hay inscripción online — todo se hace en persona, como tiene que ser.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/#visit" style={{ padding: '14px 24px', background: GOLD, color: INK, fontFamily: FB, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Cómo visitarnos →
            </a>
            <a href="/" style={{ padding: '14px 24px', background: 'transparent', color: CREAM, border: '1.5px solid rgba(244,239,230,0.3)', fontFamily: FB, fontSize: 15, textDecoration: 'none' }}>
              Ver el stock
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
