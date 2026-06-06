import React from 'react';
import { notFound } from 'next/navigation';
import { getEvent } from '@/app/lib/data-service';
import type { Metadata } from 'next';

// ─── Paleta ───────────────────────────────────────────────────────────────
const BLUE   = 'oklch(38% 0.16 263)';
const BLUE_D = 'oklch(28% 0.14 263)';
const GOLD   = 'oklch(78% 0.13 88)';
const RED    = 'oklch(56% 0.20 27)';
const CREAM  = '#f4efe6';
const INK    = '#0e1538';
const MUTED  = 'rgba(14,21,56,0.58)';
const LINE   = 'rgba(14,21,56,0.10)';

// ─── Fuentes ──────────────────────────────────────────────────────────────
const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';
const FJ = 'var(--font-jp),"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';

// ─── Badge colors ─────────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, { bg: string; fg: string }> = {
  pokemon:     { bg: BLUE,   fg: CREAM },
  torneo:      { bg: BLUE,   fg: CREAM },
  prerelease:  { bg: RED,    fg: CREAM },
  lanzamiento: { bg: RED,    fg: CREAM },
  bookclub:    { bg: INK,    fg: GOLD  },
  manga:       { bg: INK,    fg: GOLD  },
  liga:        { bg: BLUE_D, fg: CREAM },
};

function badgeStyle(badge: string) {
  const key = badge.toLowerCase().replace(/[\s·]/g, '');
  return BADGE_COLORS[key] ?? { bg: INK, fg: CREAM };
}

// ─── Kanji per badge type ─────────────────────────────────────────────────
function heroKanji(badge: string) {
  const k = badge.toLowerCase();
  if (k.includes('pokemon') || k.includes('torneo') || k.includes('liga')) return 'ポケモン';
  if (k.includes('manga') || k.includes('book')) return '漫画部';
  if (k.includes('prerelease') || k.includes('lanzamiento')) return '発売';
  return 'イベント';
}

// ─── Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return { title: 'Evento · Pokétienda' };
  return {
    title: `${event.title} · Pokétienda Leganés`,
    description: event.description,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════════

export default async function EventoDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const { bg: badgeBg, fg: badgeFg } = badgeStyle(event.badge);
  const kanji = heroKanji(event.badge);
  const waText = encodeURIComponent(
    `Hola! Me interesa apuntarme al evento: ${event.title} (${event.date_dow} ${event.date_day} ${event.date_month})`
  );

  return (
    <>
      <style>{`
        .ev-body {
          display: grid;
          grid-template-columns: minmax(0,1.65fr) minmax(0,1fr);
          gap: clamp(32px,5vw,64px);
          align-items: start;
          padding: clamp(40px,6vw,80px) clamp(20px,5vw,56px);
          background: ${CREAM};
          border-bottom: 1px solid ${LINE};
        }
        @media (max-width: 767px) {
          .ev-body { grid-template-columns: 1fr !important; }
          .ev-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        background: BLUE, color: CREAM,
        padding: 'clamp(40px,5vw,72px) clamp(20px,5vw,56px) clamp(48px,6vw,80px)',
        position: 'relative', overflow: 'hidden',
        minHeight: 'clamp(380px,52vh,540px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Halftone */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(244,239,230,0.07) 1.1px, transparent 1.4px)',
          backgroundSize: '10px 10px',
        }} />

        {/* Kanji watermark */}
        <div aria-hidden style={{
          position: 'absolute', right: -24, top: -50,
          fontFamily: FJ, fontWeight: 900,
          fontSize: 'clamp(240px,32vw,500px)',
          lineHeight: 0.85, color: 'rgba(244,239,230,0.05)',
          pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
        }}>{kanji}</div>

        {/* Speed lines */}
        <svg viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {[...Array(14)].map((_, i) => {
            const angle = -50 + i * 7.5;
            const rad = (angle * Math.PI) / 180;
            const r = 2200;
            return (
              <line key={i}
                x1={1200} y1={350}
                x2={Math.round(1200 + Math.cos(rad) * r * -1)}
                y2={Math.round(350 + Math.sin(rad) * r)}
                stroke="rgba(244,239,230,0.09)"
                strokeWidth={i % 3 === 0 ? 2 : 1} />
            );
          })}
        </svg>

        {/* Back link */}
        <a href="/eventos" style={{
          position: 'relative',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.55)',
          textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 2,
          alignSelf: 'flex-start',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 2L4 7l5 5" />
          </svg>
          Todos los eventos
        </a>

        {/* Date + title grid */}
        <div className="ev-hero-grid" style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 'clamp(20px,4vw,52px)',
          alignItems: 'flex-end',
          marginTop: 'clamp(24px,3vw,40px)',
        }}>
          {/* Giant date */}
          <div>
            <div style={{
              fontFamily: FD, fontWeight: 900,
              fontSize: 'clamp(88px,13vw,144px)',
              letterSpacing: -5, lineHeight: 0.82,
              color: CREAM,
            }}>{event.date_day}</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginTop: 12,
              fontFamily: FM, fontSize: 12, fontWeight: 700,
              letterSpacing: 2.5, textTransform: 'uppercase', color: GOLD,
            }}>
              <span>{event.date_dow}</span>
              <span style={{
                width: 20, height: 1.5, background: GOLD,
                display: 'inline-block', flexShrink: 0,
              }} />
              <span>{event.date_month}</span>
            </div>
          </div>

          {/* Badge + title + meta */}
          <div style={{ paddingBottom: 4 }}>
            {/* Stamp badge */}
            <div style={{ marginBottom: 18 }}>
              <span style={{
                display: 'inline-block',
                padding: '5px 12px',
                background: badgeBg, color: badgeFg,
                fontFamily: FM, fontSize: 10, fontWeight: 700,
                letterSpacing: 1.5, textTransform: 'uppercase',
                outline: `2px solid ${badgeFg}`, outlineOffset: '-4px',
                transform: 'rotate(-2deg)',
              }}>{event.badge}</span>
            </div>

            <h1 style={{
              margin: 0,
              fontFamily: FD, fontWeight: 700,
              fontSize: 'clamp(26px,4.5vw,54px)',
              letterSpacing: -1.5, lineHeight: 1.05,
              color: CREAM,
            }}>{event.title}</h1>

            {/* Time + price */}
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 16, marginTop: 20, flexWrap: 'wrap',
              fontFamily: FM, fontSize: 11,
              letterSpacing: 1.5, textTransform: 'uppercase',
              color: 'rgba(244,239,230,0.6)',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  stroke="currentColor" strokeWidth="1.6">
                  <circle cx="6" cy="6" r="4.5" />
                  <path d="M6 3.5v2.8l1.8 1.4" strokeLinecap="round" />
                </svg>
                {event.time}
              </span>
              <span style={{ color: 'rgba(244,239,230,0.2)' }}>|</span>
              <span style={{ color: GOLD, fontWeight: 700 }}>{event.price}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="ev-body">

        {/* Left: description + info table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* Description */}
          <div>
            <div style={{
              fontFamily: FM, fontSize: 11, color: BLUE,
              textTransform: 'uppercase', letterSpacing: 2,
              paddingBottom: 14, marginBottom: 20,
              borderBottom: `1px solid ${LINE}`,
            }}>Descripción del evento</div>
            <p style={{
              margin: 0,
              fontFamily: FB, fontSize: 17, lineHeight: 1.75,
              color: INK,
            }}>{event.description}</p>
          </div>

          {/* Practical info table */}
          <div>
            <div style={{
              fontFamily: FM, fontSize: 11, color: BLUE,
              textTransform: 'uppercase', letterSpacing: 2,
              paddingBottom: 14, marginBottom: 4,
              borderBottom: `1px solid ${LINE}`,
            }}>Información práctica</div>

            {([
              { label: 'Fecha',  value: `${event.date_dow} ${event.date_day} de ${event.date_month}` },
              { label: 'Hora',   value: event.time },
              { label: 'Precio', value: event.price },
              { label: 'Dónde',  value: 'Daruma · C. de Butarque, 14 · Local B3 · Leganés, Madrid' },
              { label: 'Aforo',  value: 'Plazas limitadas · apúntate antes' },
            ] as { label: string; value: string }[]).map((row, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr',
                gap: 20,
                padding: '16px 0',
                borderBottom: `1px dashed ${LINE}`,
              }}>
                <span style={{
                  fontFamily: FM, fontSize: 10,
                  color: MUTED,
                  textTransform: 'uppercase', letterSpacing: 1.5,
                  paddingTop: 2,
                }}>{row.label}</span>
                <span style={{
                  fontFamily: FB, fontSize: 15,
                  color: INK, lineHeight: 1.4,
                }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA card */}
        <div style={{
          background: INK, color: CREAM,
          padding: '32px 28px',
          position: 'sticky', top: 24,
          overflow: 'hidden',
        }}>
          {/* Halftone on dark */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(rgba(244,239,230,0.055) 1.1px, transparent 1.4px)',
            backgroundSize: '10px 10px',
          }} />
          {/* Kanji accent */}
          <div aria-hidden style={{
            position: 'absolute', right: -8, bottom: -24,
            fontFamily: FJ, fontWeight: 900, fontSize: 130, lineHeight: 0.8,
            color: 'rgba(244,239,230,0.04)', pointerEvents: 'none', userSelect: 'none',
          }}>参加</div>

          <div style={{ position: 'relative' }}>
            {/* Price callout */}
            <div style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 6,
              marginBottom: 20,
            }}>
              <span style={{
                fontFamily: FD, fontSize: 40, fontWeight: 700,
                letterSpacing: -1.5, color: GOLD, lineHeight: 1,
              }}>{event.price}</span>
              {event.price !== 'Gratis' && (
                <span style={{
                  fontFamily: FM, fontSize: 10, color: 'rgba(244,239,230,0.45)',
                  textTransform: 'uppercase', letterSpacing: 1.5,
                }}>por persona</span>
              )}
            </div>

            <div style={{
              fontFamily: FM, fontSize: 10, color: GOLD,
              letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12,
            }}>Cómo apuntarse</div>

            <p style={{
              margin: '0 0 28px',
              fontFamily: FB, fontSize: 14, lineHeight: 1.65,
              color: 'rgba(244,239,230,0.68)',
            }}>
              {event.price === 'Gratis'
                ? 'Acceso libre. Pásate directamente o avísanos por WhatsApp si quieres que reservemos sitio para ti.'
                : 'Pago en tienda el día del evento. Apúntate en persona o avísanos por WhatsApp para reservar tu plaza.'}
            </p>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/34658483182?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px 20px',
                background: '#25D366', color: '#fff',
                fontFamily: FM, fontSize: 11, fontWeight: 700,
                letterSpacing: 1.5, textTransform: 'uppercase',
                textDecoration: 'none',
                marginBottom: 10,
                boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Apuntarme por WhatsApp
            </a>

            {/* Secondary: visit */}
            <a href="/#visit" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 20px',
              background: 'transparent', color: 'rgba(244,239,230,0.5)',
              border: '1px solid rgba(244,239,230,0.14)',
              fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M8 2L3 6l5 4" />
              </svg>
              Apuntarse en tienda
            </a>

            <div style={{
              marginTop: 24, paddingTop: 20,
              borderTop: '1px solid rgba(244,239,230,0.1)',
              fontFamily: FM, fontSize: 10,
              color: 'rgba(244,239,230,0.3)',
              letterSpacing: 1.5, textTransform: 'uppercase',
              lineHeight: 1.7,
            }}>
              Solo presencial<br />
              C. de Butarque, 14 · Leganés
            </div>
          </div>
        </div>
      </div>

      {/* ── More events strip ─────────────────────────────────────────── */}
      <section style={{
        background: CREAM,
        padding: 'clamp(32px,4vw,56px) clamp(20px,5vw,56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
        borderTop: `1px solid ${LINE}`,
      }}>
        <div>
          <div style={{
            fontFamily: FM, fontSize: 10, color: MUTED,
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6,
          }}>Daruma · Leganés, Madrid</div>
          <p style={{
            margin: 0, fontFamily: FB, fontSize: 14,
            color: MUTED, lineHeight: 1.5,
          }}>
            Solo presencial · sin inscripción online
          </p>
        </div>
        <a href="/eventos" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 22px',
          background: INK, color: CREAM,
          fontFamily: FM, fontSize: 11, fontWeight: 700,
          letterSpacing: 1.5, textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Ver todos los eventos
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M2 6h8M6.5 2l4 4-4 4" />
          </svg>
        </a>
      </section>
    </>
  );
}
