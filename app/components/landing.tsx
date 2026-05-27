'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { POKE_SETS, POKEMON_STOCK } from '@/app/data';

// ─── Paleta ────────────────────────────────────────────────────────────────
const BLUE      = 'oklch(38% 0.16 263)';
const BLUE_DARK = 'oklch(28% 0.14 263)';
const GOLD      = 'oklch(78% 0.13 88)';
const RED       = 'oklch(56% 0.20 27)';
const CREAM     = '#f4efe6';
const INK       = '#0e1538';
const MUTED     = 'rgba(14,21,56,0.58)';
const LINE      = 'rgba(14,21,56,0.10)';
const CARD_BG   = '#ffffff';
const CARD_BD   = 'rgba(14,21,56,0.08)';
const CHIP_TR   = 'rgba(14,21,56,0.05)';
const RADIUS    = 4;

// ─── Fuentes ───────────────────────────────────────────────────────────────
const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';
const FJ = 'var(--font-jp),"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';

// ─── Tipos ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string; name: string; set: string; meta: string; tag: string; cat: string;
}
export interface Event {
  id: string;
  date: { d: string; m: string; dow: string };
  when: string; title: string; desc: string; price: string; badge: string;
}
export interface StoreInfo {
  address: string[];
  hours: string[][];
  phone: string; email: string; socials: string[];
}

// ─── useMobile ─────────────────────────────────────────────────────────────
function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return mobile;
}

// ═══════════════════════════════════════════════════════════════════════════
// Manga textures — halftone, kanji watermarks, speed lines, stamps
// ═══════════════════════════════════════════════════════════════════════════

function Halftone({ size = 10, color = 'rgba(14,21,56,0.06)', style = {} }: {
  size?: number; color?: string; style?: React.CSSProperties;
}) {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `radial-gradient(${color} 1.1px, transparent 1.4px)`,
      backgroundSize: `${size}px ${size}px`,
      ...style,
    }} />
  );
}

function KanjiWatermark({ char, size = 480, color = 'rgba(244,239,230,0.06)', style = {} }: {
  char: string; size?: number; color?: string; style?: React.CSSProperties;
}) {
  return (
    <div aria-hidden style={{
      position: 'absolute', fontFamily: FJ,
      fontWeight: 900, fontSize: size, lineHeight: 0.85,
      color, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
      ...style,
    }}>{char}</div>
  );
}

function SpeedLines({ side = 'right', color = 'rgba(244,239,230,0.10)' }: {
  side?: 'left' | 'right'; color?: string;
}) {
  const x = side === 'right' ? 1200 : 0;
  const dir = side === 'right' ? -1 : 1;
  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {[...Array(14)].map((_, i) => {
        const angle = -50 + i * 7.5;
        const rad = (angle * Math.PI) / 180;
        const r = 2200;
        return (
          <line key={i}
            x1={x} y1={350}
            x2={Math.round(x + Math.cos(rad) * r * dir)}
            y2={Math.round(350 + Math.sin(rad) * r)}
            stroke={color}
            strokeWidth={i % 3 === 0 ? 2 : 1} />
        );
      })}
    </svg>
  );
}

function Stamp({ children, rotate = -6, tone = 'red', size = 'md', style = {} }: {
  children: React.ReactNode; rotate?: number; tone?: 'red' | 'gold' | 'navy'; size?: 'sm' | 'md' | 'lg'; style?: React.CSSProperties;
}) {
  const px = size === 'sm' ? { padding: '5px 10px', fontSize: 10 } :
             size === 'lg' ? { padding: '10px 18px', fontSize: 13 } :
                             { padding: '7px 13px', fontSize: 11 };
  const bg = tone === 'gold' ? GOLD : tone === 'navy' ? INK : RED;
  const fg = tone === 'gold' ? INK : CREAM;
  return (
    <span style={{
      display: 'inline-block', transform: `rotate(${rotate}deg)`,
      background: bg, color: fg,
      fontFamily: FM, fontWeight: 700,
      letterSpacing: 2, textTransform: 'uppercase',
      outline: `2px solid ${fg}`, outlineOffset: '-5px',
      whiteSpace: 'nowrap',
      ...px, ...style,
    }}>{children}</span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ProductPlaceholder
// ═══════════════════════════════════════════════════════════════════════════

function ProductPlaceholder({
  label = 'product shot', aspect = '3/4', big = false, dark = false,
}: { label?: string; aspect?: string; big?: boolean; dark?: boolean }) {
  const sA  = dark ? 'rgba(255,255,255,0.04)' : 'rgba(40,30,20,0.04)';
  const sB  = dark ? 'rgba(255,255,255,0.015)' : 'rgba(40,30,20,0.015)';
  const txt = dark ? 'rgba(255,255,255,0.42)' : 'rgba(40,30,20,0.42)';
  const bg  = dark ? '#1a1517' : '#ece7dc';
  return (
    <div style={{
      aspectRatio: aspect, width: '100%',
      background: `repeating-linear-gradient(135deg,${sA} 0 8px,${sB} 8px 16px),${bg}`,
      borderRadius: RADIUS,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FM, fontSize: big ? 13 : 11, letterSpacing: 0.5,
      color: txt, textTransform: 'lowercase', overflow: 'hidden',
    }}>
      <span style={{ padding: '4px 10px', border: `1px dashed ${txt}`, borderRadius: 999 }}>
        {label}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Logo + Wordmark
// ═══════════════════════════════════════════════════════════════════════════

function DarumaMark({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/assets/daruma-logo.png"
      width={size} height={size}
      alt="Daruma"
      style={{ display: 'block', borderRadius: size * 0.16, objectFit: 'cover' }}
    />
  );
}

function Wordmark({ size = 18, fg = INK, muted: mutedColor = MUTED }: { size?: number; fg?: string; muted?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <DarumaMark size={size * 1.9} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: FD, fontWeight: 700, fontSize: size, letterSpacing: -0.5, color: fg }}>
          daruma
        </span>
        <span style={{ fontFamily: FM, fontSize: size * 0.45, letterSpacing: 1.5, color: mutedColor, textTransform: 'uppercase', marginTop: 4 }}>
          cartas · manga · cómics
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OpenStripe — gold ribbon marquee
// ═══════════════════════════════════════════════════════════════════════════

function OpenStripe() {
  const items = [
    'ABIERTO AHORA · L–D 17:00–21:00',
    '★ Torneo Pokémon · Sábado 16 May',
    'Nueva reposición · Obsidian Flames',
    '⊛ COMPRAMOS COLECCIONES ⊛',
    'Prerelease Phantasmal Flames · 30 May',
    'Manga book club · Berserk · 06 Jun',
    '営業中 · Bilbao · Indautxu',
  ];
  const ribbon = items.map((s) => <span key={s} style={{ padding: '0 22px' }}>{s}</span>);

  return (
    <div style={{
      background: GOLD, color: INK,
      borderBottom: `1.5px solid ${INK}`,
      position: 'relative', overflow: 'hidden',
      fontFamily: FM, fontSize: 11, fontWeight: 600,
      letterSpacing: 1.5, textTransform: 'uppercase',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
        <div className="daruma-open-stripe" style={{
          display: 'flex', alignItems: 'center', width: 'max-content', whiteSpace: 'nowrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {ribbon}{ribbon}
          </div>
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 56,
        background: 'repeating-linear-gradient(135deg, #0e1538 0 6px, transparent 6px 14px)',
        opacity: 0.6, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, width: 56,
        background: 'repeating-linear-gradient(135deg, #0e1538 0 6px, transparent 6px 14px)',
        opacity: 0.6, pointerEvents: 'none',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Nav
// ═══════════════════════════════════════════════════════════════════════════

function Nav() {
  const mobile = useMobile();
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Stock',     href: '#stock' },
    { label: 'Eventos',   href: '#events' },
    { label: 'Visítanos', href: '#visit' },
    { label: 'Sobre',     href: '#sobre' },
  ];
  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: mobile ? '16px 20px' : '24px 56px',
        borderBottom: `1px solid ${LINE}`,
        background: CREAM, position: 'sticky', top: 0, zIndex: 10,
        backdropFilter: 'blur(8px)',
      }}>
        <Wordmark size={mobile ? 15 : 17} />
        {mobile ? (
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
            aria-label="Menú"
          >
            <span style={{ display: 'block', width: 22, height: 1.5, background: INK, transition: 'transform .2s, opacity .2s', transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: INK, opacity: open ? 0 : 1, transition: 'opacity .2s' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: INK, transition: 'transform .2s, opacity .2s', transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {links.map((l) => (
              <a key={l.label} href={l.href} style={{
                padding: '10px 18px', textDecoration: 'none', color: INK,
                fontFamily: FB, fontSize: 14, fontWeight: 500,
                borderRadius: 999, transition: 'background .15s',
              }}>{l.label}</a>
            ))}
            <span style={{
              marginLeft: 12, padding: '8px 14px',
              background: GOLD, color: INK,
              fontFamily: FM, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              borderRadius: 999, whiteSpace: 'nowrap',
            }}>solo en tienda · no online</span>
          </div>
        )}
      </nav>
      {mobile && open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30,
            background: 'rgba(244,239,230,0.97)', display: 'flex', flexDirection: 'column',
            paddingTop: 80, paddingInline: 24, gap: 0,
          }}
        >
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '20px 0', textDecoration: 'none', color: INK,
              fontFamily: FD, fontSize: 28, fontWeight: 600, letterSpacing: -0.5,
              borderBottom: `1px solid ${LINE}`,
            }}>{l.label}</a>
          ))}
          <div style={{ marginTop: 28, padding: '10px 16px', background: GOLD, color: INK, borderRadius: 999, fontFamily: FM, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', alignSelf: 'flex-start' }}>
            solo en tienda · no online
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SectionHead
// ═══════════════════════════════════════════════════════════════════════════

function SectionHead({ kicker, title, sub, right }: {
  kicker?: string; title: string; sub?: string; right?: React.ReactNode;
}) {
  const mobile = useMobile();
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, marginBottom: mobile ? 28 : 40, flexWrap: 'wrap' }}>
      <div style={{ maxWidth: 720 }}>
        {kicker && (
          <div style={{ fontFamily: FM, fontSize: 11, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>
            {kicker}
          </div>
        )}
        <h2 style={{ margin: 0, fontFamily: FD, fontSize: mobile ? 30 : 44, fontWeight: 600, letterSpacing: mobile ? -0.6 : -1.2, lineHeight: 1, color: INK, textWrap: 'pretty' as never }}>
          {title}
        </h2>
        {sub && (
          <p style={{ margin: '18px 0 0', fontFamily: FB, fontSize: mobile ? 14 : 16, lineHeight: 1.55, color: MUTED, maxWidth: 560, textWrap: 'pretty' as never }}>
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Hero — Azul Daruma con texturas manga
// ═══════════════════════════════════════════════════════════════════════════

function HeroAzulDaruma() {
  const mobile = useMobile();
  return (
    <section style={{
      background: BLUE, color: CREAM,
      padding: mobile ? '56px 20px 72px' : '96px 56px 112px',
      position: 'relative', overflow: 'hidden',
    }}>
      <Halftone size={10} color="rgba(244,239,230,0.07)" />
      {!mobile && <SpeedLines side="right" color="rgba(244,239,230,0.10)" />}
      {!mobile && (
        <KanjiWatermark char="ダルマ" size={520} color="rgba(244,239,230,0.06)"
          style={{ right: -40, top: -60 }} />
      )}

      <div style={{
        position: 'relative',
        display: mobile ? 'flex' : 'grid',
        gridTemplateColumns: mobile ? undefined : '1.35fr 1fr',
        flexDirection: mobile ? 'column' : undefined,
        gap: mobile ? 40 : 72,
        alignItems: 'center',
      }}>
        {/* Text */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: mobile ? 20 : 32, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 14px', background: GOLD, color: INK,
              fontFamily: FM, fontSize: 11, fontWeight: 600,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}>{'★'} Punto fuerte {'·'} Pok{'é'}mon TCG</span>
            {!mobile && (
              <span style={{
                fontFamily: FJ, fontWeight: 700, fontSize: 18,
                color: GOLD, letterSpacing: 2,
              }}>{'ポケモン専門'}</span>
            )}
          </div>

          <h1 style={{
            margin: 0, fontFamily: FD,
            fontSize: mobile ? 48 : 108, fontWeight: 700,
            letterSpacing: mobile ? -2 : -4.5, lineHeight: 0.88,
            color: CREAM, textWrap: 'balance' as never,
          }}>
            La tienda donde
            <br />
            <em style={{
              fontStyle: 'italic', fontWeight: 500, color: GOLD,
              textDecoration: 'underline', textDecorationThickness: mobile ? 3 : 6,
              textDecorationColor: 'rgba(212,167,58,0.4)', textUnderlineOffset: mobile ? 6 : 12,
            }}>pides el deseo</em>
            <br />
            y vienes a buscarlo.
          </h1>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 24, marginTop: mobile ? 24 : 36,
          }}>
            {!mobile && (
              <div style={{
                width: 3, alignSelf: 'stretch', background: GOLD,
                marginTop: 8, marginBottom: 8,
              }} />
            )}
            <p style={{
              margin: 0, fontFamily: FB, fontSize: mobile ? 15 : 19, lineHeight: 1.5,
              color: 'rgba(244,239,230,0.78)', maxWidth: 480, textWrap: 'pretty' as never,
            }}>
              Daruma {'·'} cartas Pok{'é'}mon, manga y c{'ó'}mics en Bilbao.
              Pinta el primer ojo cuando entras buscando esa carta. El segundo cuando la encuentras.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: mobile ? 28 : 44, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#stock" style={{
              padding: mobile ? '14px 20px' : '16px 26px', background: GOLD, color: INK,
              fontFamily: FB, fontSize: 15, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '6px 6px 0 0 rgba(14,21,56,0.5)',
            }}>
              Ver el stock
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" />
              </svg>
            </a>
            <a href="#visit" style={{
              padding: mobile ? '14px 20px' : '16px 26px', background: 'transparent', color: CREAM,
              border: '1.5px solid rgba(244,239,230,0.35)',
              fontFamily: FB, fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>C{'ó'}mo visitarnos</a>
            {!mobile && (
              <span style={{
                marginLeft: 8, fontFamily: FM, fontSize: 11,
                color: 'rgba(244,239,230,0.5)', letterSpacing: 1.5, textTransform: 'uppercase',
              }}>
                {'⊛'} abierto<br />hasta 21:00
              </span>
            )}
          </div>
        </div>

        {/* Card of the month */}
        <div style={{ position: 'relative' }}>
          {!mobile && (
            <div style={{
              position: 'absolute', inset: 0, transform: 'translate(14px, 14px)',
              background: BLUE_DARK, border: '1.5px solid rgba(244,239,230,0.18)',
            }} />
          )}
          <div style={{
            position: 'relative', padding: mobile ? 20 : 28,
            background: 'rgba(244,239,230,0.06)', backdropFilter: 'blur(2px)',
            border: '1.5px solid rgba(244,239,230,0.22)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 18,
            }}>
              <span style={{
                fontFamily: FM, fontSize: 10, color: GOLD,
                letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 600,
              }}>{'★'} carta del mes {'·'} 05 / 26</span>
              {!mobile && (
                <span style={{
                  fontFamily: FJ, fontSize: 13, color: 'rgba(244,239,230,0.6)',
                  fontWeight: 700, letterSpacing: 2,
                }}>{'限定一枚'}</span>
              )}
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 18 }}>
              <ProductPlaceholder aspect="5/7" label="charizard ex · SIR" big dark />
              <Stamp rotate={-8} style={{ position: 'absolute', top: 18, right: 18 }}>
                {'★'} Chase
              </Stamp>
            </div>
            <div style={{
              fontFamily: FD, fontSize: mobile ? 20 : 24, fontWeight: 700,
              color: CREAM, letterSpacing: -0.4, lineHeight: 1.15,
            }}>Charizard ex {'·'} Special Illustration Rare</div>
            <div style={{
              fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.55)',
              letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 10,
              display: 'flex', gap: 14, flexWrap: 'wrap',
            }}>
              <span>obsidian flames</span>
              <span style={{ opacity: .4 }}>{'·'}</span>
              <span>199/197</span>
              <span style={{ opacity: .4 }}>{'·'}</span>
              <span style={{ color: GOLD }}>NM/M</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LogoMarquee — infinite scrolling brand wordmarks
// ═══════════════════════════════════════════════════════════════════════════

function LM({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      flexShrink: 0, padding: '0 44px', height: 56,
    }}>
      {children}
    </div>
  );
}

const LOGO_MARKS: ((col: string) => React.ReactNode)[] = [
  (col) => (
    <LM>
      <span style={{ width: 10, height: 10, background: col, transform: 'rotate(45deg)' }} />
      <span style={{ fontFamily: FD, fontSize: 26, fontWeight: 700, letterSpacing: -0.8, color: col }}>
        SH{'Ō'}NEN<span style={{ fontWeight: 400, fontStyle: 'italic' }}>press</span>
      </span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FM, fontSize: 13, fontWeight: 600, letterSpacing: 4, color: col, textTransform: 'uppercase', padding: '6px 10px', border: `1.5px solid ${col}` }}>
        // TCG.MUNDO
      </span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 32, fontWeight: 500, fontStyle: 'italic', letterSpacing: -1.2, color: col }}>
        Akihabara &amp; Co.
      </span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 22, color: col }}>{'★'}</span>
      <span style={{ fontFamily: FD, fontSize: 22, fontWeight: 700, letterSpacing: 4, color: col, textTransform: 'uppercase' }}>K A I J {'Ū'}</span>
      <span style={{ fontFamily: FD, fontSize: 22, color: col }}>{'★'}</span>
    </LM>
  ),
  (col) => (
    <LM>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, alignItems: 'center' }}>
        <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 700, letterSpacing: -0.8, color: col }}>OTAKU{'—'}LAB</span>
        <span style={{ fontFamily: FM, fontSize: 9, letterSpacing: 3, color: col, textTransform: 'uppercase', marginTop: 4, opacity: 0.7 }}>est {'·'} two thousand seven</span>
      </div>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: '50%', border: `2px solid ${col}`,
        fontFamily: FD, fontSize: 14, fontWeight: 700, color: col,
      }}>R</span>
      <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 600, letterSpacing: -0.4, color: col }}>Ronin Comics</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FM, fontSize: 22, fontWeight: 500, letterSpacing: -0.4, color: col }}>nipponika<span style={{ color: col }}>.</span></span>
    </LM>
  ),
  (col) => (
    <LM>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 2, background: col, width: '40%' }} />
        <span style={{ fontFamily: FD, fontSize: 22, fontWeight: 700, letterSpacing: 2, color: col, textTransform: 'uppercase' }}>HACHI {'·'} BOOKS</span>
      </div>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 28, fontWeight: 500, fontStyle: 'italic', color: col, letterSpacing: -1 }}>kuroi</span>
      <span style={{ fontFamily: FM, fontSize: 10, color: col, letterSpacing: 2, textTransform: 'uppercase', alignSelf: 'flex-end', paddingBottom: 4 }}>No.07</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 800, letterSpacing: -0.6, color: col }}>MEKA<span style={{ fontWeight: 300 }}>verse</span></span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FM, fontSize: 14, fontWeight: 600, letterSpacing: 2, color: col, textTransform: 'uppercase' }}>[ chibi {'·'} co ]</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 30, fontWeight: 600, letterSpacing: -1.4, color: col, lineHeight: 1 }}>
        {'九'} Ky{'ū'}<span style={{ fontStyle: 'italic', fontWeight: 400 }}>cards</span>
      </span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{
        padding: '6px 14px', borderRadius: 999, border: `1.5px solid ${col}`,
        fontFamily: FD, fontSize: 18, fontWeight: 700, color: col,
        letterSpacing: 2, textTransform: 'uppercase',
      }}>Y{'Ū'}REI</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 600, fontStyle: 'italic', color: col }}>tokyo</span>
      <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 700, color: col }}>+plus</span>
    </LM>
  ),
];

function LogoMarquee() {
  const ink = 'rgba(14,21,56,0.32)';
  const row = (key: string) => (
    <div key={key} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {LOGO_MARKS.map((Mark, i) => (
        <React.Fragment key={i}>{Mark(ink)}</React.Fragment>
      ))}
    </div>
  );

  return (
    <section aria-label="Marcas y editoriales que tenemos en tienda"
      style={{
        padding: '40px 0', background: CREAM,
        borderBottom: `1px solid ${LINE}`,
        position: 'relative', overflow: 'hidden',
      }}>
      <div style={{
        position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
        zIndex: 2, padding: '6px 12px', borderRadius: 999,
        background: CREAM, border: `1px solid ${LINE}`,
        fontFamily: FM, fontSize: 10, letterSpacing: 2,
        textTransform: 'uppercase', color: MUTED, whiteSpace: 'nowrap',
      }}>{'★'} traemos</div>
      <div className="daruma-marquee" style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
        maskImage: 'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
      }}>
        <div className="daruma-marquee-track">
          {row('a')}
          {row('b')}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FeaturedCarousel — horizontal scroll of featured Pokémon cards
// ═══════════════════════════════════════════════════════════════════════════

function FeaturedCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => POKEMON_STOCK.slice(0, 7), []);
  const [progress, setProgress] = useState(0);
  const mobile = useMobile();

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector('[data-carousel-card]') as HTMLElement | null;
    const step = first ? first.getBoundingClientRect().width + 20 : 320;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section style={{
      paddingTop: mobile ? 56 : 96, paddingBottom: mobile ? 56 : 96,
      paddingLeft: mobile ? 20 : 56,
      borderBottom: `1px solid ${LINE}`, position: 'relative', background: CREAM,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        paddingRight: mobile ? 20 : 56, marginBottom: 40, gap: 40, flexWrap: 'wrap',
      }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{
            fontFamily: FM, fontSize: 11, color: BLUE,
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14,
          }}>{'★'} destacadas esta semana</div>
          <h2 style={{
            margin: 0, fontFamily: FD, fontSize: mobile ? 30 : 44, fontWeight: 600,
            letterSpacing: mobile ? -0.6 : -1.2, lineHeight: 1, color: INK, textWrap: 'pretty' as never,
          }}>Lo que acaba de entrar al caj{'ó'}n.</h2>
          <p style={{
            margin: '18px 0 0', fontFamily: FB, fontSize: mobile ? 14 : 16, lineHeight: 1.55,
            color: MUTED, maxWidth: 540, textWrap: 'pretty' as never,
          }}>
            Cartas reci{'é'}n catalogadas esta semana. Una unidad de cada {'—'} si te gusta alguna, p{'á'}sate cuanto antes.
          </p>
        </div>
        {!mobile && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => scrollBy(-1)} aria-label="Anterior" style={{
              width: 44, height: 44, borderRadius: 999,
              border: `1px solid ${LINE}`, background: 'transparent',
              color: INK, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 3L5 8l5 5" /></svg>
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Siguiente" style={{
              width: 44, height: 44, borderRadius: 999,
              border: 'none', background: BLUE, color: CREAM, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3l5 5-5 5" /></svg>
            </button>
          </div>
        )}
      </div>

      <div ref={trackRef} className="daruma-carousel-track" style={{
        display: 'flex', gap: 20, overflowX: 'auto', overflowY: 'visible',
        scrollSnapType: 'x mandatory', paddingBottom: 28,
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {items.map((it, i) => (
          <article key={it.id} data-carousel-card="" style={{
            flex: mobile ? '0 0 260px' : '0 0 320px', scrollSnapAlign: 'start',
            display: 'flex', flexDirection: 'column', gap: 16,
            transition: 'transform .25s',
          }}>
            <div style={{ position: 'relative', borderRadius: RADIUS, overflow: 'hidden' }}>
              <ProductPlaceholder aspect="5/7" label={it.name.toLowerCase()} big />
              <span style={{
                position: 'absolute', top: 14, left: 14,
                padding: '5px 10px', fontFamily: FM, fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', fontWeight: 600,
                background: i === 0 ? BLUE : BLUE,
                color: CREAM, borderRadius: 999,
              }}>{i === 0 ? '★ chase' : it.tag}</span>
              <span style={{
                position: 'absolute', bottom: 14, left: 14,
                padding: '4px 8px', background: CREAM, color: INK,
                fontFamily: FM, fontSize: 9, letterSpacing: 1.5,
                textTransform: 'uppercase', borderRadius: 2,
              }}>#{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div>
              <div style={{ fontFamily: FD, fontSize: 19, fontWeight: 600, letterSpacing: -0.3, color: INK, lineHeight: 1.2 }}>{it.name}</div>
              <div style={{ fontFamily: FB, fontSize: 13, color: MUTED, marginTop: 4 }}>{it.set}</div>
              <div style={{ fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 0.8, textTransform: 'lowercase', marginTop: 6 }}>{it.meta}</div>
            </div>
          </article>
        ))}
        <div style={{ flex: '0 0 56px' }} aria-hidden />
      </div>

      <div style={{
        marginRight: mobile ? 20 : 56, height: 2, background: LINE, borderRadius: 1,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: `${Math.max(15, progress * 100)}%`,
          background: BLUE, transition: 'width .12s linear',
        }} />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PhilosophySection — three columns with kanji
// ═══════════════════════════════════════════════════════════════════════════

function PhilosophySection() {
  const mobile = useMobile();
  const blocks = [
    { char: '触', sub: 'TOCAR', title: 'Cartas que se tocan.', body: 'Aquí abres el sobre tú. Las graduadas se miran en mano. El plástico solo cuando ya es tuya.' },
    { char: '集', sub: 'COLECCIONAR', title: 'Catálogo seleccionado.', body: 'No traemos todo — traemos lo bueno. Pokémon TCG, manga al día, cómic clásico y moderno.' },
    { char: '集会', sub: 'COMUNIDAD', title: 'Liga, club, tertulia.', body: 'Torneos cada sábado, club de manga, prereleases. Si juegas o lees, esto también es tu casa.' },
  ];
  return (
    <section style={{
      position: 'relative', padding: mobile ? '56px 20px' : '112px 56px',
      borderBottom: `1px solid ${LINE}`, overflow: 'hidden',
    }}>
      <Halftone size={14} color="rgba(14,21,56,0.04)" />
      <SectionHead
        kicker={'★ filosofía · 心得'}
        title="Una tienda física para una afición física."
        sub="Cartas que se tocan, sobres que se abren, partidas que se juegan en la misma mesa. Todo lo que sale aquí está físicamente en la tienda — no vendemos online."
      />
      <div style={{
        position: 'relative', display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
        gap: mobile ? 20 : 32, marginTop: 8,
      }}>
        {blocks.map((b, i) => (
          <div key={i} style={{
            position: 'relative', padding: mobile ? '28px 22px 24px' : '36px 28px 32px',
            background: CARD_BG, border: `1px solid ${CARD_BD}`,
            overflow: 'hidden',
          }}>
            <span aria-hidden style={{
              position: 'absolute', right: -14, bottom: -40,
              fontFamily: FJ, fontWeight: 900, fontSize: mobile ? 140 : 200, lineHeight: 0.8,
              color: 'rgba(14,21,56,0.05)', pointerEvents: 'none',
            }}>{b.char}</span>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 22,
              fontFamily: FM, fontSize: 11, color: BLUE,
              letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
            }}>
              <span style={{
                fontFamily: FJ, fontSize: 28, fontWeight: 900,
                color: BLUE, lineHeight: 1,
              }}>{b.char}</span>
              <span>{'·'} {b.sub} {'·'} 0{i + 1}</span>
            </div>
            <h3 style={{
              margin: 0, fontFamily: FD, fontSize: mobile ? 24 : 28, fontWeight: 700,
              letterSpacing: -0.8, lineHeight: 1.1, color: INK,
              position: 'relative', zIndex: 1,
            }}>{b.title}</h3>
            <p style={{
              margin: '14px 0 0', fontFamily: FB, fontSize: 15, lineHeight: 1.55,
              color: MUTED, textWrap: 'pretty' as never, position: 'relative', zIndex: 1,
            }}>{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FiltersBar
// ═══════════════════════════════════════════════════════════════════════════

function FiltersBar({ cat, setCat, query, setQuery, set, setSet, total, count }: {
  cat: string; setCat: (v: string) => void;
  query: string; setQuery: (v: string) => void;
  set: string; setSet: (v: string) => void;
  total: number; count: number;
}) {
  const mobile = useMobile();
  const cats = [
    { key: 'all',     label: 'Todo' },
    { key: 'pokemon', label: 'Pokémon' },
    { key: 'manga',   label: 'Manga' },
    { key: 'comics',  label: 'Cómics' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: mobile ? 'stretch' : 'center',
      flexDirection: mobile ? 'column' : 'row',
      gap: mobile ? 10 : 14, flexWrap: 'wrap',
      padding: '20px 0', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`,
    }}>
      <div style={{ display: 'flex', gap: 6, padding: 4, background: CHIP_TR, borderRadius: 999, flexWrap: 'wrap' }}>
        {cats.map((c) => {
          const on = cat === c.key;
          return (
            <button key={c.key} onClick={() => setCat(c.key)} style={{
              padding: '9px 16px', fontFamily: FB, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer', borderRadius: 999,
              background: on ? BLUE : 'transparent',
              color: on ? CREAM : MUTED,
              transition: 'background .15s, color .15s',
            }}>{c.label}</button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, border: `1px solid ${LINE}` }}>
        <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>expansi{'ó'}n</span>
        <select value={set} onChange={(e) => setSet(e.target.value)} style={{
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: FB, fontSize: 13, color: INK, cursor: 'pointer',
        }}>
          {POKE_SETS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{
        marginLeft: mobile ? 0 : 'auto', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 18px', borderRadius: 999, border: `1px solid ${LINE}`,
        minWidth: mobile ? undefined : 260, flex: mobile ? '1 1 auto' : '0 1 320px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={MUTED} strokeWidth="1.5">
          <circle cx="6" cy="6" r="4.5" /><path d="M9.5 9.5L12.5 12.5" strokeLinecap="round" />
        </svg>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="busca carta, set, autor..."
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FB, fontSize: 13, color: INK }} />
      </div>

      <div style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: 'uppercase' }}>
        mostrando {count}/{total}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ProductCard
// ═══════════════════════════════════════════════════════════════════════════

function ProductCard({ item }: { item: Product }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 14,
      padding: 16, background: CARD_BG, borderRadius: RADIUS,
      border: `1px solid ${CARD_BD}`,
      transition: 'transform .25s, box-shadow .25s',
    }}>
      <div style={{ position: 'relative' }}>
        <ProductPlaceholder aspect={item.cat === 'pokemon' ? '5/7' : '2/3'} label={item.cat} />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          padding: '5px 10px', fontFamily: FM, fontSize: 10, letterSpacing: 1,
          textTransform: 'uppercase',
          background: BLUE, color: CREAM, borderRadius: 999,
        }}>{item.tag}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 64 }}>
        <div style={{ fontFamily: FD, fontSize: 17, fontWeight: 600, color: INK, letterSpacing: -0.2, lineHeight: 1.2 }}>{item.name}</div>
        <div style={{ fontFamily: FB, fontSize: 13, color: MUTED }}>{item.set}</div>
        <div style={{ fontFamily: FM, fontSize: 11, color: MUTED, textTransform: 'lowercase', letterSpacing: 0.4, marginTop: 2 }}>{item.meta}</div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 12, borderTop: `1px dashed ${LINE}`,
      }}>
        <span style={{
          fontFamily: FM, fontSize: 11, color: RED,
          textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 6, height: 6, background: RED }} />
          en tienda
        </span>
        <button style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: INK, fontFamily: FM, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
        }}>ver {'→'}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FeaturedPanel — big hero highlight card for the manga panel grid
// ═══════════════════════════════════════════════════════════════════════════

function FeaturedPanel({ item }: { item: Product }) {
  return (
    <article style={{
      position: 'relative', overflow: 'hidden',
      background: CARD_BG, border: `1.5px solid ${INK}`,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
    }}>
      <div style={{ position: 'relative', borderRight: `1.5px solid ${INK}` }}>
        <ProductPlaceholder aspect="1/1" label={item.cat} big dark={false} />
        <Stamp rotate={-8} tone="red" size="lg"
          style={{ position: 'absolute', top: 20, left: 20 }}>
          {'★'} Destacado
        </Stamp>
      </div>
      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: FM, fontSize: 10, color: BLUE,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
        }}>
          <span style={{ width: 8, height: 8, background: RED }} />
          {item.cat === 'pokemon' ? 'pokémon tcg' : item.cat === 'manga' ? 'manga' : 'cómics'}
          <span style={{ flex: 1, height: 1, background: LINE }} />
          <span style={{ fontFamily: FJ, fontSize: 14, fontWeight: 700, color: INK }}>
            {item.cat === 'pokemon' ? '一番' : item.cat === 'manga' ? '漫画' : '本'}
          </span>
        </div>
        <h3 style={{
          margin: 0, fontFamily: FD, fontSize: 32, fontWeight: 700,
          letterSpacing: -0.8, lineHeight: 1.05, color: INK, textWrap: 'pretty' as never,
        }}>{item.name}</h3>
        <div style={{ fontFamily: FB, fontSize: 14, color: MUTED, lineHeight: 1.5 }}>
          {item.set} {'·'} {item.meta}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap',
          paddingTop: 14, borderTop: `1.5px dashed ${LINE}`,
        }}>
          <span style={{
            fontFamily: FM, fontSize: 11, color: RED,
            textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 7, height: 7, background: RED }} />
            {'ú'}ltima unidad
          </span>
          <a href="#visit" style={{
            padding: '10px 18px', background: INK, color: CREAM,
            fontFamily: FB, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
          }}>Vis{'í'}tanos {'→'}</a>
        </div>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MangaPanelGrid — irregular manga-style grid
// ═══════════════════════════════════════════════════════════════════════════

function MangaPanelGrid({ items }: { items: Product[] }) {
  const mobile = useMobile();
  if (items.length === 0) return null;
  const [hero, ...rest] = items;

  if (mobile) {
    return (
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {items.slice(0, 8).map((it) => <ProductCard key={it.id} item={it} />)}
      </div>
    );
  }

  return (
    <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 18 }}>
        <FeaturedPanel item={hero} />
        {rest.slice(0, 2).map((it) => <ProductCard key={it.id} item={it} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
        {rest.slice(2, 7).map((it) => <ProductCard key={it.id} item={it} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// StockSection
// ═══════════════════════════════════════════════════════════════════════════

function StockSection({ products }: { products: Product[] }) {
  const mobile = useMobile();
  const [cat, setCat]     = useState('all');
  const [query, setQuery] = useState('');
  const [set, setSet]     = useState('Todas');

  const items = useMemo(() => products.filter((it) => {
    if (cat !== 'all' && it.cat !== cat) return false;
    if (set !== 'Todas' && it.cat === 'pokemon' && !it.set.includes(set.split(' ')[0])) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      if (!(it.name + ' ' + it.set + ' ' + it.meta).toLowerCase().includes(q)) return false;
    }
    return true;
  }), [cat, query, set, products]);

  return (
    <section id="stock" style={{
      padding: mobile ? '56px 20px' : '112px 56px 96px', position: 'relative',
    }}>
      {!mobile && (
        <KanjiWatermark char={'物'} size={420}
          color="rgba(14,21,56,0.04)"
          style={{ right: 24, top: -40 }} />
      )}
      <SectionHead
        kicker={'★ Stock destacado · 商品 · actualizado hoy'}
        title="Lo que tenemos ahora mismo en tienda."
        sub="Selección rotatoria. Lo bueno vuela — si ves algo aquí, pásate cuanto antes. Esto es solo una muestra; pregúntanos por lo que busques."
        right={
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: FM, fontSize: 11, color: MUTED,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>
            <span>mostrando {items.length}/{products.length}</span>
          </div>
        }
      />
      <FiltersBar cat={cat} setCat={setCat} query={query} setQuery={setQuery} set={set} setSet={setSet} total={products.length} count={items.length} />
      {items.length === 0 ? (
        <div style={{
          marginTop: 40, padding: '64px 0', textAlign: 'center',
          fontFamily: FB, fontSize: 16, color: MUTED,
        }}>
          Ahora mismo no tenemos eso en stock {'—'} escr{'í'}benos y te avisamos cuando llegue.
        </div>
      ) : (
        <MangaPanelGrid items={items.slice(0, 8)} />
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EventCard
// ═══════════════════════════════════════════════════════════════════════════

function EventCard({ ev, accentDate = false }: { ev: Event; accentDate?: boolean }) {
  const mobile = useMobile();
  return (
    <article style={{
      display: mobile ? 'flex' : 'grid',
      gridTemplateColumns: mobile ? undefined : '108px 1fr auto',
      flexDirection: mobile ? 'column' : undefined,
      gap: mobile ? 16 : 28, alignItems: mobile ? undefined : 'center',
      padding: mobile ? 18 : 24,
      background: CARD_BG, borderRadius: RADIUS, border: `1px solid ${CARD_BD}`,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: mobile ? 'row' : 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: mobile ? '10px 18px' : '14px 0',
        borderRadius: RADIUS,
        background: accentDate ? BLUE : BLUE,
        color: CREAM,
        gap: mobile ? 8 : 0,
        alignSelf: mobile ? 'flex-start' : undefined,
      }}>
        <span style={{ fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', opacity: .7 }}>{ev.date.dow}</span>
        <span style={{ fontFamily: FD, fontSize: mobile ? 28 : 36, fontWeight: 600, lineHeight: 1, marginTop: mobile ? 0 : 4 }}>{ev.date.d}</span>
        <span style={{ fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: mobile ? 0 : 4 }}>{ev.date.m}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '3px 9px', fontFamily: FM, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', background: BLUE, color: CREAM, borderRadius: 999 }}>
            {ev.badge}
          </span>
          <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.5 }}>{ev.when}</span>
        </div>
        <h3 style={{ margin: 0, fontFamily: FD, fontSize: mobile ? 18 : 22, fontWeight: 600, letterSpacing: -0.4, color: INK, lineHeight: 1.15 }}>{ev.title}</h3>
        <p style={{ margin: 0, fontFamily: FB, fontSize: 14, lineHeight: 1.5, color: MUTED, textWrap: 'pretty' as never, maxWidth: 540 }}>{ev.desc}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: mobile ? 'row' : 'column', alignItems: mobile ? 'center' : 'flex-end', justifyContent: mobile ? 'space-between' : undefined, gap: 8 }}>
        <span style={{ fontFamily: FD, fontSize: mobile ? 18 : 20, fontWeight: 600, color: INK }}>{ev.price}</span>
        <button style={{ padding: '9px 16px', borderRadius: 999, background: 'transparent', border: `1px solid ${LINE}`, color: INK, fontFamily: FB, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Ap{'ú'}ntate {'→'}
        </button>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EventsSection
// ═══════════════════════════════════════════════════════════════════════════

function EventsSection({ events }: { events: Event[] }) {
  const mobile = useMobile();
  return (
    <section id="events" style={{
      padding: mobile ? '56px 20px' : '96px 56px',
      borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`,
    }}>
      <SectionHead
        kicker={'★ próximos eventos'}
        title="Pásate también a jugar y hacer comunidad."
        sub="Torneos Pokémon cada sábado, ligas para peques, prereleases y club de manga. La inscripción se hace en tienda o por WhatsApp."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {events.map((ev, i) => <EventCard key={ev.id} ev={ev} accentDate={i === 0} />)}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VisitSection
// ═══════════════════════════════════════════════════════════════════════════

function MapPlaceholder() {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '4/3',
      background: '#ece7dc', borderRadius: RADIUS, overflow: 'hidden', border: `1px solid ${LINE}`,
    }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        {[40, 90, 140, 190, 240, 290].map((y) => (
          <line key={'h' + y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(40,30,20,.05)" strokeWidth="1" />
        ))}
        {[60, 130, 200, 270, 340].map((x) => (
          <line key={'v' + x} x1={x} y1="0" x2={x} y2="300" stroke="rgba(40,30,20,.05)" strokeWidth="1" />
        ))}
        <path d="M0 160 L130 165 L200 110 L340 115 L400 145" fill="none" stroke="rgba(40,30,20,.10)" strokeWidth="3" />
        <path d="M150 0 L160 90 L155 200 L170 300" fill="none" stroke="rgba(40,30,20,.10)" strokeWidth="3" />
        <path d="M270 0 L280 100 L290 220 L295 300" fill="none" stroke="rgba(40,30,20,.08)" strokeWidth="2" />
        <rect x="60" y="50" width="50" height="35" fill="rgba(40,30,20,.05)" />
        <rect x="220" y="170" width="40" height="45" fill="rgba(40,30,20,.05)" />
        <rect x="320" y="200" width="35" height="40" fill="rgba(40,30,20,.05)" />
        <circle cx="200" cy="170" r="14" fill={BLUE} />
        <circle cx="200" cy="170" r="6" fill="#f8f6f1" />
      </svg>
      <span style={{
        position: 'absolute', bottom: 16, left: 16,
        padding: '6px 12px', background: CREAM, color: INK,
        fontFamily: FM, fontSize: 11, letterSpacing: 1,
        borderRadius: 999, border: `1px solid ${LINE}`, textTransform: 'uppercase',
      }}>mapa {'·'} Bilbao centro</span>
    </div>
  );
}

function VisitBlock({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div>
      <div style={{
        fontFamily: FM, fontSize: 11, color: MUTED,
        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14,
        paddingBottom: 14, borderBottom: `1px solid ${LINE}`,
      }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((cols, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontFamily: FB, fontSize: 15, color: INK }}>
            {cols.map((c, j) => (
              <span key={j} style={{ color: j === 0 ? INK : MUTED }}>{c}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function VisitSection({ storeInfo }: { storeInfo: StoreInfo }) {
  const mobile = useMobile();
  return (
    <section id="visit" style={{ padding: mobile ? '56px 20px' : '96px 56px' }}>
      <SectionHead
        kicker={'★ cómo visitarnos'}
        title="Aquí estamos. Pásate cuando quieras."
        sub="A dos minutos del metro Indautxu. Si nos avisas qué vienes a ver, te lo tenemos sacado."
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1.3fr 1fr',
        gap: mobile ? 32 : 56, alignItems: 'start',
      }}>
        <MapPlaceholder />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <VisitBlock title="Dirección" rows={storeInfo.address.map((a) => [a])} />
          <VisitBlock title="Horario" rows={storeInfo.hours.map(([d, h]) => [d, h])} />
          <VisitBlock title="Contacto" rows={[[storeInfo.phone], [storeInfo.email], storeInfo.socials]} />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Footer
// ═══════════════════════════════════════════════════════════════════════════

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div style={{ fontFamily: FM, fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it) => <li key={it} style={{ fontFamily: FB, fontSize: 14, color: INK }}>{it}</li>)}
      </ul>
    </div>
  );
}

function Footer({ storeInfo }: { storeInfo: StoreInfo }) {
  const mobile = useMobile();
  return (
    <footer style={{
      padding: mobile ? '48px 20px 32px' : '56px 56px 40px',
      borderTop: `1px solid ${LINE}`, background: CREAM,
      display: 'flex', flexDirection: 'column', gap: 48,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
        gap: mobile ? 32 : 60,
      }}>
        <div style={{ gridColumn: mobile ? '1 / -1' : undefined }}>
          <Wordmark size={mobile ? 18 : 22} />
          <p style={{ marginTop: 24, fontFamily: FB, fontSize: 14, lineHeight: 1.6, color: MUTED, maxWidth: 360 }}>
            Tienda de cartas Pok{'é'}mon, manga y c{'ó'}mics en Bilbao. Sin tienda online {'—'} si lo ves aqu{'í'}, est{'á'} esper{'á'}ndote all{'í'}.
          </p>
        </div>
        <FooterCol title="Tienda" items={['Stock destacado', 'Pokémon TCG', 'Manga', 'Cómics']} />
        <FooterCol title="Comunidad" items={['Próximos eventos', 'Liga semanal', 'Discord', 'Newsletter']} />
        <FooterCol title="Contacto" items={[storeInfo.email, storeInfo.phone, storeInfo.socials[0]]} />
      </div>
      <div style={{
        display: 'flex', flexDirection: mobile ? 'column' : 'row',
        justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center',
        gap: 10, paddingTop: 24, borderTop: `1px solid ${LINE}`,
        fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: 'uppercase',
      }}>
        <span>{'©'} 2026 daruma {'·'} bilbao</span>
        <span>sin tienda online {'·'} solo presencial</span>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Landing — main composition
// ═══════════════════════════════════════════════════════════════════════════

export function Landing({ products = [], events = [], storeInfo }: {
  products?: Product[];
  events?: Event[];
  storeInfo?: StoreInfo;
}) {
  const info = storeInfo ?? {
    address: [], hours: [], phone: '', email: '', socials: [''],
  };

  return (
    <div style={{ background: CREAM, color: INK, fontFamily: FB, minHeight: '100%' }}>
      <OpenStripe />
      <Nav />
      <HeroAzulDaruma />
      <LogoMarquee />
      <FeaturedCarousel />
      <PhilosophySection />
      <StockSection products={products} />
      <EventsSection events={events} />
      <VisitSection storeInfo={info} />
      <Footer storeInfo={info} />
    </div>
  );
}
