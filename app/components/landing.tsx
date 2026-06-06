'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { POKE_SETS, POKEMON_STOCK } from '@/app/data';
import { PublicNav } from '@/app/components/public-nav';

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
  id: string; name: string; set: string; meta: string; tags: string[]; cat: string;
  image_url?: string; pokemon_card_id?: string; price?: string;
  section?: 'stock' | 'carousel' | 'hero';
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
export interface HeroSlideDef {
  set: string;
  kicker: string;
  kickerJp: string;
  cta: string;
  href: string;
  imageUrl: string;
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
  label = 'product shot', aspect = '3/4', big = false, dark = false, imageUrl, fit = 'contain', halftone = false,
}: { label?: string; aspect?: string; big?: boolean; dark?: boolean; imageUrl?: string; fit?: 'contain' | 'cover'; halftone?: boolean }) {
  if (imageUrl) {
    return (
      <div style={{
        aspectRatio: aspect, width: '100%', position: 'relative',
        borderRadius: RADIUS, overflow: 'hidden',
        background: dark ? '#1a1517' : '#ece7dc',
      }}>
        {halftone && (
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(14,21,56,0.06) 1.1px, transparent 1.4px)', backgroundSize: '9px 9px' }} />
        )}
        <Image
          src={imageUrl}
          alt={label}
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          style={{ objectFit: fit, padding: fit === 'contain' ? 8 : 0 }}
          unoptimized
        />
      </div>
    );
  }
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
      overflow: 'hidden',
    }}>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Logo + Wordmark
// ═══════════════════════════════════════════════════════════════════════════

function Wordmark({ size = 18, fg = INK, muted: mutedColor = MUTED }: { size?: number; fg?: string; muted?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: FD, fontWeight: 700, fontSize: size, letterSpacing: -0.5, color: fg }}>
          Pokétienda
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

const DEFAULT_STRIPE_ITEMS: string[] = [
  'ABIERTO AHORA · MAR–DOM 10:00–14:00',
  '★ Torneo Pokémon · Sábado 16 May',
  'Nueva reposición · Obsidian Flames',
  '⊛ COMPRAMOS COLECCIONES ⊛',
  'Prerelease Phantasmal Flames · 30 May',
  'Manga book club · Berserk · 06 Jun',
  '営業中 · Leganés · Madrid',
];

function OpenStripe({ items = DEFAULT_STRIPE_ITEMS }: { items?: string[] }) {
  const ribbon = items.map((s, i) => <span key={i} style={{ padding: '0 22px' }}>{s}</span>);

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
// ═══════════════════════════════════════════════════════════════════════════
// SectionHead
// ═══════════════════════════════════════════════════════════════════════════

function SectionHead({ kicker, title, sub, right, className }: {
  kicker?: string; title: string; sub?: string; right?: React.ReactNode; className?: string;
}) {
  const mobile = useMobile();
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, marginBottom: mobile ? 28 : 40, flexWrap: 'wrap' }}>
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

function HeroAzulDaruma({ heroProduct }: { heroProduct?: Product }) {
  const mobile = useMobile();
  const now = new Date();
  const monthLabel = `${String(now.getMonth() + 1).padStart(2, '0')} / ${String(now.getFullYear()).slice(2)}`;
  const hp = heroProduct ?? {
    name: 'Charizard ex · Special Illustration Rare',
    set: 'Obsidian Flames',
    meta: '199/197',
    tags: ['Chase'],
    image_url: POKEMON_STOCK[0]?.image_url,
    cat: 'pokemon',
  };
  return (
    <section className="daruma-dark-section" style={{
      background: BLUE, color: CREAM,
      padding: mobile ? '56px 20px 72px' : '0 56px',
      position: 'relative', overflow: 'hidden',
      ...(!mobile && {
        height: 'calc(100dvh - 114px)',
        minHeight: 560,
        display: 'flex',
        alignItems: 'center',
      }),
    }}>
      <Halftone size={10} color="rgba(244,239,230,0.07)" />
      {!mobile && <SpeedLines side="right" color="rgba(244,239,230,0.10)" />}
      {!mobile && (
        <KanjiWatermark char="ダルマ" size={520} color="rgba(244,239,230,0.06)"
          style={{ right: -40, top: -60 }} />
      )}

      <div style={{
        position: 'relative', width: '100%',
        display: mobile ? 'flex' : 'grid',
        gridTemplateColumns: mobile ? undefined : '1.35fr 1fr',
        flexDirection: mobile ? 'column' : undefined,
        gap: mobile ? 40 : 56,
        alignItems: 'center',
      }}>
        {/* Text */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: mobile ? 20 : 24, flexWrap: 'wrap' }}>
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
            fontSize: mobile ? 48 : 84, fontWeight: 700,
            letterSpacing: mobile ? -2 : -3.5, lineHeight: 0.9,
            color: CREAM, textWrap: 'balance' as never,
          }}>
            La tienda donde
            <br />
            <em style={{
              fontStyle: 'italic', fontWeight: 500, color: GOLD,
              textDecoration: 'underline', textDecorationThickness: mobile ? 3 : 5,
              textDecorationColor: 'rgba(212,167,58,0.4)', textUnderlineOffset: mobile ? 6 : 10,
            }}>pides el deseo</em>
            <br />
            y vienes a buscarlo.
          </h1>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 24, marginTop: mobile ? 24 : 28,
          }}>
            {!mobile && (
              <div style={{
                width: 3, alignSelf: 'stretch', background: GOLD,
                marginTop: 8, marginBottom: 8,
              }} />
            )}
            <p style={{
              margin: 0, fontFamily: FB, fontSize: mobile ? 15 : 17, lineHeight: 1.5,
              color: 'rgba(244,239,230,0.78)', maxWidth: 480, textWrap: 'pretty' as never,
            }}>
              Pok{'é'}tienda {'·'} cartas Pok{'é'}mon, manga y c{'ó'}mics en Legan{'é'}s.
              Pinta el primer ojo cuando entras buscando esa carta. El segundo cuando la encuentras.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: mobile ? 28 : 32, alignItems: 'center', flexWrap: 'wrap' }}>
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
                {'⊛'} abierto<br />hasta 20:30
              </span>
            )}
          </div>
        </div>

        {/* Card of the month */}
        <div style={{ position: 'relative', maxWidth: mobile ? undefined : 460, justifySelf: 'end' }}>
          {!mobile && (
            <div style={{
              position: 'absolute', inset: 0, transform: 'translate(10px, 10px)',
              background: BLUE_DARK, border: '1.5px solid rgba(244,239,230,0.18)',
            }} />
          )}
          <div style={{
            position: 'relative', padding: mobile ? 20 : 24,
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
              }}>{'★'} carta del mes {'·'} {monthLabel}</span>
              {!mobile && (
                <span style={{
                  fontFamily: FJ, fontSize: 13, color: 'rgba(244,239,230,0.6)',
                  fontWeight: 700, letterSpacing: 2,
                }}>{'限定一枚'}</span>
              )}
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 18 }}>
              <ProductPlaceholder
                aspect="4/5"
                label={hp.name}
                big
                dark
                imageUrl={hp.image_url}
                fit={hp.cat === 'pokemon' ? 'contain' : 'cover'}
              />
              <Stamp rotate={-8} style={{ position: 'absolute', top: 18, right: 18 }}>
                {'★'} {(hp.tags ?? [])[0]}
              </Stamp>
            </div>
            <div style={{
              fontFamily: FD, fontSize: mobile ? 20 : 22, fontWeight: 700,
              color: CREAM, letterSpacing: -0.4, lineHeight: 1.15,
            }}>{hp.name}</div>
            <div style={{
              fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.55)',
              letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 10,
              display: 'flex', gap: 14, flexWrap: 'wrap',
            }}>
              {hp.set && <span>{hp.set.toLowerCase()}</span>}
              {hp.meta && <>
                <span style={{ opacity: .4 }}>{'·'}</span>
                <span>{hp.meta}</span>
              </>}
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

function SetLogo({ src, alt, w = 140, h = 40 }: { src: string; alt: string; w?: number; h?: number }) {
  return (
    <LM>
      <Image src={src} alt={alt} width={w} height={h} style={{ objectFit: 'contain' }} unoptimized />
    </LM>
  );
}

const TCG_SET_LOGOS: { src: string; alt: string; w?: number; h?: number }[] = [
  { src: 'https://assets.tcgdex.net/en/sv/sv03.5/logo.png', alt: 'Scarlet & Violet 151', w: 80, h: 60 },
  { src: 'https://assets.tcgdex.net/en/sv/sv03/logo.png', alt: 'Obsidian Flames' },
  { src: 'https://assets.tcgdex.net/en/sv/sv08/logo.png', alt: 'Surging Sparks' },
  { src: 'https://assets.tcgdex.net/en/swsh/swsh7/logo.png', alt: 'Evolving Skies' },
  { src: 'https://assets.tcgdex.net/en/sv/sv04.5/logo.png', alt: 'Paldean Fates' },
  { src: 'https://assets.tcgdex.net/en/swsh/swsh11/logo.png', alt: 'Lost Origin' },
  { src: 'https://assets.tcgdex.net/en/sv/sv06/logo.png', alt: 'Twilight Masquerade' },
  { src: 'https://assets.tcgdex.net/en/sv/sv08.5/logo.png', alt: 'Prismatic Evolutions' },
  { src: 'https://assets.tcgdex.net/en/sv/sv09/logo.png', alt: 'Journey Together' },
  { src: 'https://assets.tcgdex.net/en/sv/sv10/logo.png', alt: 'Destined Rivals' },
];

const BRAND_MARKS: ((col: string) => React.ReactNode)[] = [
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 26, fontWeight: 800, letterSpacing: -0.8, color: col }}>
        POK{'É'}MON<span style={{ fontWeight: 400, fontSize: 18, marginLeft: 4 }}>TCG</span>
      </span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 700, letterSpacing: 1.5, color: col, textTransform: 'uppercase' }}>One Piece</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 22, fontWeight: 800, letterSpacing: 3, color: col, textTransform: 'uppercase' }}>Dragon Ball</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{
        fontFamily: FM, fontSize: 13, fontWeight: 600, letterSpacing: 4, color: col,
        textTransform: 'uppercase', padding: '6px 10px', border: `1.5px solid ${col}`,
      }}>
        Yu-Gi-Oh!
      </span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 28, fontWeight: 700, fontStyle: 'italic', letterSpacing: -1, color: col }}>Naruto</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{
        padding: '6px 14px', borderRadius: 999, border: `1.5px solid ${col}`,
        fontFamily: FD, fontSize: 18, fontWeight: 700, color: col,
        letterSpacing: 2, textTransform: 'uppercase',
      }}>MARVEL</span>
    </LM>
  ),
  (col) => (
    <LM>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, alignItems: 'center' }}>
        <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 700, letterSpacing: -0.8, color: col }}>DC</span>
        <span style={{ fontFamily: FM, fontSize: 9, letterSpacing: 3, color: col, textTransform: 'uppercase', marginTop: 4, opacity: 0.7 }}>comics</span>
      </div>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 22, fontWeight: 600, letterSpacing: -0.4, color: col }}>Jujutsu Kaisen</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FM, fontSize: 22, fontWeight: 500, letterSpacing: -0.4, color: col }}>
        Chainsaw<span style={{ fontWeight: 700 }}>Man</span>
      </span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 800, letterSpacing: 2, color: col, textTransform: 'uppercase' }}>
        {'鬼'} Demon Slayer
      </span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 600, fontStyle: 'italic', color: col }}>My Hero</span>
      <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 800, color: col }}>Academia</span>
    </LM>
  ),
  (col) => (
    <LM>
      <span style={{ fontFamily: FD, fontSize: 22, fontWeight: 700, letterSpacing: 1, color: col, textTransform: 'uppercase' }}>
        Magic<span style={{ fontWeight: 400, fontStyle: 'italic' }}> the Gathering</span>
      </span>
    </LM>
  ),
];

// ─── Hero Slideshow data ───────────────────────────────────────────────────
const DEFAULT_HERO_SLIDES: HeroSlideDef[] = [
  {
    kicker: 'Lo último en llegar',
    kickerJp: '最新入荷',
    cta: 'Ver stock',
    href: '#stock',
    imageUrl: '/fotos/BANNERS1_5bac1109-e710-489f-bbdf-3fec13f9d50f.webp',
    set: 'Abyss Eye',
  },
  {
    kicker: 'Nuevo set disponible',
    kickerJp: '新セット発売',
    cta: 'Ver stock',
    href: '#stock',
    imageUrl: '/fotos/BANNERS1_ee05748a-9e6e-47ff-9f32-a71771a175e2.webp',
    set: 'Chaos Rising',
  },
  {
    kicker: 'En tienda ahora',
    kickerJp: '店内在庫あり',
    cta: 'Preguntanos',
    href: '#visit',
    imageUrl: '/fotos/BANNERS1_efa8d084-c4cd-4540-9fb0-3a5c97fbb43c.webp',
    set: 'Equilibrio Perfecto',
  },
];

// ─── LogoMarquee ──────────────────────────────────────────────────────────
function LogoMarquee({ items = TCG_SET_LOGOS }: { items?: { src: string; alt: string; w?: number; h?: number }[] }) {
  const row = (key: string) => (
    <div key={key} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {items.map((logo, i) => (
        <SetLogo key={`set-${i}`} src={logo.src} alt={logo.alt} w={logo.w} h={logo.h} />
      ))}
    </div>
  );

  return (
    <section aria-label="Marcas y colecciones que tenemos en tienda"
      style={{
        padding: '20px 0', background: CREAM,
        borderTop: `1px solid ${LINE}`,
        borderBottom: `1px solid ${LINE}`,
        overflow: 'hidden',
      }}>
      <div className="daruma-marquee">
        <div className="daruma-marquee-track">
          {row('a')}
          {row('b')}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HeroSlideshow — full-screen collection image carousel
// ═══════════════════════════════════════════════════════════════════════════

function HeroSlideshow({ slides = DEFAULT_HERO_SLIDES }: { slides?: HeroSlideDef[] }) {
  const mobile = useMobile();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        minHeight: mobile ? '52dvh' : '68dvh',
        overflow: 'hidden',
        background: INK,
      }}
    >
      {/* Slides */}
      {slides.map((slide, i) => {
        const isActive = i === current;
        return (
          <div
            key={slide.set}
            aria-hidden={!isActive}
            className={isActive ? 'daruma-hero-active' : undefined}
            style={{
              position: 'absolute', inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.1s cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.set}
              fill
              sizes="100vw"
              className="daruma-hero-img"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={i === 0}
            />
            {/* Bottom gradient — keeps CTA legible over any image */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(14,21,56,0.88) 0%, rgba(14,21,56,0.35) 30%, transparent 58%)',
            }} />
          </div>
        );
      })}

      {/* Bottom bar: kicker + dots (left) | CTA (right) */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: mobile ? '20px' : '24px 56px',
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        alignItems: mobile ? 'flex-start' : 'flex-end',
        justifyContent: mobile ? 'flex-end' : 'space-between',
        gap: mobile ? 14 : 16,
      }}>
        {/* Left: live kicker + nav dots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            display: 'inline-flex', flexDirection: 'column', gap: 4,
            padding: '8px 14px', background: INK,
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              fontFamily: FM, fontSize: 11, fontWeight: 600,
              letterSpacing: 1.5, textTransform: 'uppercase',
              color: CREAM, display: 'inline-flex', alignItems: 'center', gap: 7,
            }}>
              <span style={{ color: GOLD }}>{'★'}</span>
              {slides[current].kicker}
            </span>
            <span style={{
              fontFamily: FJ, fontSize: 12, fontWeight: 700,
              letterSpacing: 2.5, color: GOLD,
            }}>
              {slides[current].kickerJp}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Coleccion ${i + 1}`}
                style={{
                  height: 3, padding: 0, border: 'none', cursor: 'pointer',
                  borderRadius: 999,
                  width: i === current ? 28 : 8,
                  background: i === current ? GOLD : 'rgba(244,239,230,0.30)',
                  transition: 'width .4s cubic-bezier(0.16,1,0.3,1), background .3s',
                }}
              />
            ))}
            <span style={{
              fontFamily: FM, fontSize: 10,
              color: 'rgba(244,239,230,0.38)',
              letterSpacing: 1.5, marginLeft: 4,
            }}>
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Right: CTA button */}
        <a
          href={slides[current].href}
          style={{
            padding: mobile ? '11px 18px' : '13px 24px',
            background: GOLD, color: INK,
            fontFamily: FB, fontSize: mobile ? 13 : 14, fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '4px 4px 0 rgba(14,21,56,0.45)',
            whiteSpace: 'nowrap',
          }}
        >
          {slides[current].cta}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M2 6h8M6.5 2l4 4-4 4" />
          </svg>
        </a>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CategoryGrid — 4 category tiles below the hero
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_TILES: { label: string; sub: string; href: string; kanji: string; bg: string; accent: string; lines: boolean; image?: string; imageSize?: string; imageFit?: 'contain' | 'cover'; overlayOpacity?: number }[] = [
  {
    label: 'Cartas Sueltas',
    sub: '単体カード',
    href: '/buscar?cat=pokemon',
    kanji: '札',
    bg: BLUE,
    accent: GOLD,
    lines: true,
    image: '/fotos/siguemeeninstagram_1920x1920px_-2025-02-17T135140.087.webp',
    imageSize: '100%',
    imageFit: 'cover',
    overlayOpacity: 0.25,
  },
  {
    label: 'ETBs',
    sub: 'エリートトレーナー',
    href: '/buscar?cat=pokemon&q=etb',
    kanji: '箱',
    bg: INK,
    accent: GOLD,
    lines: false,
    image: '/fotos/siguemeeninstagram_1920x1920px_-2025-11-28T102950.586.webp',
    imageSize: '95%',
  },
  {
    label: 'Accesorios',
    sub: 'アクセサリー',
    href: '/buscar',
    kanji: '具',
    bg: BLUE_DARK,
    accent: RED,
    lines: true,
    image: '/fotos/siguemeeninstagram_1920x1920px_-2024-07-19T203828.078.webp',
    imageSize: '95%',
  },
  {
    label: 'Mangas',
    sub: 'マンガ',
    href: '/buscar?cat=manga',
    kanji: '漫',
    bg: '#1a1517',
    accent: GOLD,
    lines: false,
    image: '/fotos/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_.jpg',
    imageSize: '85%',
  },
];

function CategoryGrid() {
  const mobile = useMobile();
  return (
    <section aria-label="Categorías" style={{
      background: CREAM,
      padding: mobile ? '32px 20px 40px' : '48px 56px 56px',
      borderBottom: `1px solid ${LINE}`,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: mobile ? 12 : 16,
      }}>
        {CATEGORY_TILES.map((cat, i) => (
          <a
            key={cat.label}
            href={cat.href}
            className={`daruma-category-tile daruma-reveal daruma-s${i + 1}`}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              aspectRatio: mobile ? '4/3' : '5/4',
              background: cat.bg,
              overflow: 'hidden',
              textDecoration: 'none',
              borderRadius: RADIUS,
            }}
          >
            {/* Upper: image + decorations */}
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {/* Background cover image — rendered first so decorations appear on top */}
              {cat.image && cat.imageFit === 'cover' && (
                <>
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover', zIndex: 0 }}
                    unoptimized
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `rgba(14,21,56,${cat.overlayOpacity ?? 0.45})`,
                    zIndex: 1,
                  }} />
                </>
              )}

              <Halftone size={9} color="rgba(244,239,230,0.055)" style={{ zIndex: 2 }} />
              {cat.lines && <SpeedLines side="right" color="rgba(244,239,230,0.07)" />}

              {/* Kanji watermark */}
              <span aria-hidden style={{
                position: 'absolute',
                right: -12,
                bottom: -20,
                fontFamily: FJ,
                fontWeight: 900,
                fontSize: mobile ? 120 : 160,
                lineHeight: 0.8,
                color: 'rgba(244,239,230,0.12)',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 2,
              }}>{cat.kanji}</span>

              {/* Index top-left */}
              <span style={{
                position: 'absolute',
                top: mobile ? 12 : 16,
                left: mobile ? 12 : 16,
                fontFamily: FM,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: CREAM,
                textTransform: 'uppercase',
                zIndex: 2,
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}>0{i + 1}</span>

              {/* Accent dot top-right */}
              <span style={{
                position: 'absolute',
                top: mobile ? 14 : 18,
                right: mobile ? 12 : 16,
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: cat.accent,
                zIndex: 2,
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }} />

              {/* Centered contain image */}
              {cat.image && cat.imageFit !== 'cover' ? (
                <div style={{
                  position: 'relative',
                  width: cat.imageSize ?? '95%',
                  height: cat.imageSize ?? '95%',
                  zIndex: 1,
                }}>
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
              ) : null}
            </div>

            {/* Lower: label */}
            <div style={{
              padding: mobile ? '12px 14px' : '16px 20px',
              borderTop: `1px solid rgba(244,239,230,0.12)`,
              background: cat.bg,
            }}>
              <div style={{
                fontFamily: FJ,
                fontSize: mobile ? 9 : 10,
                fontWeight: 700,
                letterSpacing: 2,
                color: cat.accent,
                marginBottom: 3,
              }}>{cat.sub}</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <span style={{
                  fontFamily: FD,
                  fontSize: mobile ? 15 : 18,
                  fontWeight: 700,
                  letterSpacing: -0.4,
                  color: CREAM,
                  lineHeight: 1.1,
                }}>{cat.label}</span>
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none"
                  stroke={cat.accent} strokeWidth="2" strokeLinecap="round">
                  <path d="M2 6h8M6.5 2l4 4-4 4" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PokemonStockSection — dense small-card grid, pokemon only
// ═══════════════════════════════════════════════════════════════════════════

function PokemonStockSection({ products }: { products: Product[] }) {
  const mobile = useMobile();
  const items = useMemo(() => products.filter((it) => it.cat === 'pokemon'), [products]);

  if (items.length === 0) return null;

  return (
    <section style={{
      padding: mobile ? '28px 20px 56px' : '48px 56px 88px',
      borderBottom: `1px solid ${LINE}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {!mobile && (
        <KanjiWatermark char={'ポケ'} size={420}
          color="rgba(14,21,56,0.04)"
          style={{ right: 20, top: -30 }} />
      )}
      <SectionHead
        className="daruma-reveal"
        kicker={'★ cartas pokémon · ポケモンカード'}
        title="Cartas sueltas Pokémon en tienda."
        sub={undefined}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
        gap: mobile ? 12 : 14,
        alignItems: 'start',
        marginTop: mobile ? 28 : 40,
      }}>
        {items.slice(0, 6).map((it, i) => (
          <ProductCard key={it.id} item={it} className={`daruma-reveal daruma-s${i + 1}`} />
        ))}
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
        className="daruma-reveal"
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
          <div key={i} className={`daruma-reveal daruma-s${i + 1}`} style={{
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
              padding: mobile ? '11px 16px' : '9px 16px', fontFamily: FB, fontSize: 13, fontWeight: 500,
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
        <select value={set} onChange={(e) => setSet(e.target.value)} aria-label="Filtrar por expansión" style={{
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
          aria-label="Buscar cartas, sets o autores"
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

export function ProductCard({ item, className }: { item: Product; className?: string }) {
  const tags     = item.tags ?? [];
  const isChase  = tags.some(t => t === 'Chase' || t === 'Alt Art');
  const isNew    = !isChase && tags.some(t => t === 'Nuevo' || t === 'Promo');
  const tagBg    = isChase ? GOLD : isNew ? RED : BLUE;
  const tagColor = isChase ? INK : CREAM;
  const firstTag = tags[0];

  return (
    <Link href={`/producto/${item.id}`} className={className} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
    <div className="daruma-product-card" style={{
      display: 'flex', flexDirection: 'column',
      background: CARD_BG, borderRadius: RADIUS,
      border: `1px solid ${CARD_BD}`,
      overflow: 'hidden', cursor: 'pointer',
      flex: 1,
    }}>
      {/* Image + overlays */}
      <div style={{ position: 'relative', padding: '10px 10px 0' }}>
        <ProductPlaceholder
          aspect="1/1"
          label={item.cat}
          imageUrl={item.image_url}
          fit="contain"
          halftone
        />
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          {firstTag && (
            <span style={{
              padding: '3px 7px', fontFamily: FM, fontSize: 9, letterSpacing: 0.8,
              textTransform: 'uppercase', fontWeight: 600,
              background: tagBg, color: tagColor,
              borderRadius: 999,
            }}>{firstTag}</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Fixed 2-line height so all cards are identical regardless of name length */}
            <div style={{
              fontFamily: FD, fontSize: 13, fontWeight: 600, color: INK,
              letterSpacing: -0.2, lineHeight: 1.3,
              height: '2.6em',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as never,
              overflow: 'hidden',
            }}>{item.name}</div>
            <div style={{
              fontFamily: FB, fontSize: 11, color: MUTED, marginTop: 3,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}>{item.set}</div>
          </div>
          {item.price && (
            <div style={{
              fontFamily: FD, fontSize: 16, fontWeight: 700,
              color: INK, flexShrink: 0, paddingTop: 1,
            }}>{item.price}</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px 10px',
        borderTop: `1px dashed ${LINE}`,
      }}>
        <span style={{
          fontFamily: FM, fontSize: 9, color: RED,
          textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span className="daruma-live-dot" style={{ width: 5, height: 5, background: RED, borderRadius: '50%', display: 'inline-block' }} />
          en tienda
        </span>
        {!item.price && (
          <span style={{
            color: INK, fontFamily: FM, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
          }}>ver {'->'}</span>
        )}
      </div>
    </div>
    </Link>
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
        <ProductPlaceholder
          aspect="1/1"
          label={item.cat}
          big
          dark={false}
          imageUrl={item.image_url}
          fit={item.cat === 'pokemon' ? 'contain' : 'cover'}
        />
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 14, alignItems: 'start' }}>
        <FeaturedPanel item={hero} />
        {rest.slice(0, 3).map((it) => <ProductCard key={it.id} item={it} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, alignItems: 'start' }}>
        {rest.slice(3, 9).map((it) => <ProductCard key={it.id} item={it} />)}
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
      scrollMarginTop: '64px',
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
        <div style={{
          marginTop: mobile ? 28 : 40,
          display: 'grid',
          gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
          gap: mobile ? 12 : 14,
          alignItems: 'start',
        }}>
          {items.slice(0, 6).map((it) => <ProductCard key={it.id} item={it} />)}
        </div>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EventCard
// ═══════════════════════════════════════════════════════════════════════════

function EventCardFeatured({ ev }: { ev: Event }) {
  const mobile = useMobile();
  return (
    <article style={{
      position: 'relative', overflow: 'hidden',
      background: BLUE,
      padding: mobile ? '28px 24px 32px' : '44px 44px 48px',
      display: 'flex', flexDirection: 'column',
      minHeight: mobile ? 320 : 440,
    }}>
      <Halftone size={10} color="rgba(244,239,230,0.07)" />
      <SpeedLines side="right" color="rgba(244,239,230,0.09)" />

      {/* Badge */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: 28 }}>
        <Stamp tone="gold" size="sm" rotate={-3}>{ev.badge}</Stamp>
      </div>

      {/* Date */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: 20 }}>
        <div style={{
          fontFamily: FD, fontWeight: 900,
          fontSize: mobile ? 88 : 120,
          letterSpacing: -4, lineHeight: 0.85,
          color: CREAM,
        }}>{ev.date.d}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginTop: 10,
          fontFamily: FM, fontSize: 11, fontWeight: 700,
          letterSpacing: 2.5, textTransform: 'uppercase', color: GOLD,
        }}>
          <span>{ev.date.dow}</span>
          <span style={{ width: 20, height: 1.5, background: GOLD, flexShrink: 0, display: 'inline-block' }} />
          <span>{ev.date.m}</span>
        </div>
      </div>

      {/* Title + desc */}
      <h3 style={{
        position: 'relative', zIndex: 1,
        margin: '0 0 10px',
        fontFamily: FD,
        fontSize: mobile ? 26 : 36,
        fontWeight: 700, letterSpacing: -0.9, lineHeight: 1.05,
        color: CREAM, textWrap: 'pretty' as never,
      }}>{ev.title}</h3>
      <p style={{
        position: 'relative', zIndex: 1,
        margin: '0 0 0',
        fontFamily: FB, fontSize: 14, lineHeight: 1.55,
        color: 'rgba(244,239,230,0.68)',
        textWrap: 'pretty' as never,
        flex: 1,
      }}>{ev.desc}</p>

      {/* Bottom */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 14, flexWrap: 'wrap',
        paddingTop: 20, marginTop: 24,
        borderTop: '1px solid rgba(244,239,230,0.18)',
      }}>
        <div>
          <div style={{ fontFamily: FM, fontSize: 9, color: 'rgba(244,239,230,0.45)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>Hora</div>
          <div style={{ fontFamily: FB, fontSize: 15, fontWeight: 600, color: CREAM }}>{ev.when}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: FD, fontSize: 28, fontWeight: 700, color: GOLD, letterSpacing: -0.8 }}>{ev.price}</span>
          <a href="#visit" style={{
            padding: '12px 22px', background: GOLD, color: INK,
            fontFamily: FB, fontSize: 13, fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 7,
            boxShadow: '4px 4px 0 rgba(14,21,56,0.45)',
            whiteSpace: 'nowrap',
          }}>
            Ap{'ú'}ntate
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M2 6h8M6.5 2l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

function EventCardSecondary({ ev }: { ev: Event }) {
  const mobile = useMobile();
  return (
    <article style={{
      position: 'relative', overflow: 'hidden',
      background: 'rgba(244,239,230,0.05)',
      border: '1px solid rgba(244,239,230,0.09)',
      padding: mobile ? '20px' : '22px 28px',
    }}>
      <Halftone size={14} color="rgba(244,239,230,0.025)" />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: mobile ? '64px 1fr' : '76px 1fr auto',
        gap: mobile ? '0 16px' : '0 24px',
        alignItems: 'start',
      }}>

        {/* Date block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: 2 }}>
          <span style={{ fontFamily: FM, fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: GOLD, fontWeight: 700 }}>{ev.date.dow}</span>
          <span style={{ fontFamily: FD, fontSize: mobile ? 44 : 50, fontWeight: 900, letterSpacing: -2.5, lineHeight: 0.86, color: CREAM, marginTop: 3 }}>{ev.date.d}</span>
          <span style={{ fontFamily: FM, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(244,239,230,0.45)', fontWeight: 600, marginTop: 7 }}>{ev.date.m}</span>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
            <span style={{
              padding: '3px 8px',
              background: GOLD, color: INK,
              fontFamily: FM, fontSize: 9, fontWeight: 700,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}>{ev.badge}</span>
            <span style={{ fontFamily: FM, fontSize: 10, color: 'rgba(244,239,230,0.48)', letterSpacing: 0.5 }}>{ev.when}</span>
          </div>
          <h3 style={{
            margin: 0, fontFamily: FD,
            fontSize: mobile ? 17 : 19, fontWeight: 700,
            letterSpacing: -0.4, lineHeight: 1.15, color: CREAM,
            textWrap: 'pretty' as never,
          }}>{ev.title}</h3>
          <p style={{
            margin: 0, fontFamily: FB, fontSize: 13, lineHeight: 1.55,
            color: 'rgba(244,239,230,0.70)',
          }}>{ev.desc}</p>
          {mobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: FD, fontSize: 22, fontWeight: 700, color: GOLD, letterSpacing: -0.5 }}>{ev.price}</span>
              <a href="#visit" style={{
                padding: '8px 16px', background: 'transparent', color: CREAM,
                border: '1px solid rgba(244,239,230,0.28)',
                fontFamily: FM, fontSize: 9, fontWeight: 700,
                letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
              }}>Ap{'ú'}ntate</a>
            </div>
          )}
        </div>

        {/* Price + CTA — desktop only */}
        {!mobile && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0, paddingTop: 2 }}>
            <span style={{ fontFamily: FD, fontSize: 24, fontWeight: 700, color: GOLD, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>{ev.price}</span>
            <a href="#visit" style={{
              padding: '9px 18px', background: 'transparent', color: CREAM,
              border: '1px solid rgba(244,239,230,0.28)',
              fontFamily: FM, fontSize: 9, fontWeight: 700,
              letterSpacing: 1.5, textTransform: 'uppercase',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>Ap{'ú'}ntate {'→'}</a>
          </div>
        )}
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EventsSection
// ═══════════════════════════════════════════════════════════════════════════

function EventsSection({ events }: { events: Event[] }) {
  const mobile = useMobile();
  if (events.length === 0) return null;
  const [featured, ...rest] = events;

  return (
    <section id="events" style={{
      background: INK,
      padding: mobile ? '56px 20px 64px' : '88px 56px 100px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background kanji — decorative */}
      <KanjiWatermark
        char="祭"
        size={mobile ? 280 : 480}
        color="rgba(244,239,230,0.025)"
        style={{ right: mobile ? -40 : -60, bottom: mobile ? -40 : -60, zIndex: 0 }}
      />

      <div style={{
        position: 'relative', zIndex: 1,
        display: mobile ? 'flex' : 'grid',
        flexDirection: mobile ? 'column' : undefined,
        gridTemplateColumns: mobile ? undefined : '1fr 1fr',
        gap: mobile ? 32 : 64,
        alignItems: 'start',
      }}>

        {/* LEFT — featured + 2 secondary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="daruma-reveal">
            <EventCardFeatured ev={featured} />
          </div>
          {rest.slice(0, 2).map((ev, i) => (
            <div key={ev.id} className={`daruma-reveal daruma-s${i + 2}`}>
              <EventCardSecondary ev={ev} />
            </div>
          ))}
        </div>

        {/* RIGHT — section anchor (desktop sticky / mobile above) */}
        <div className="daruma-reveal" style={{
          position: mobile ? 'static' : 'sticky',
          top: 96,
          order: mobile ? -1 : 0,
          paddingBottom: mobile ? 0 : 0,
        }}>
          {mobile && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: FM, fontSize: 10, color: GOLD, textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 12 }}>
                {'★'} Pr{'ó'}ximos eventos
              </div>
              <h2 style={{
                margin: 0, fontFamily: FD,
                fontSize: 34, fontWeight: 700,
                letterSpacing: -1.2, lineHeight: 0.96,
                color: CREAM, textWrap: 'pretty' as never,
              }}>
                P{'á'}sate tambi{'é'}n a jugar y hacer comunidad.
              </h2>
            </div>
          )}
          {!mobile && (
            <>
              <div style={{ fontFamily: FM, fontSize: 10, color: GOLD, textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 20 }}>
                {'★'} Pr{'ó'}ximos eventos
              </div>
              <h2 style={{
                margin: '0 0 22px', fontFamily: FD,
                fontSize: 52,
                fontWeight: 700, letterSpacing: -2,
                lineHeight: 0.96, color: CREAM,
                textWrap: 'pretty' as never,
              }}>
                P{'á'}sate tambi{'é'}n a jugar<br />y hacer comunidad.
              </h2>
              <p style={{
                margin: '0 0 36px', fontFamily: FB,
                fontSize: 15, lineHeight: 1.65,
                color: 'rgba(244,239,230,0.65)',
                maxWidth: 380,
              }}>
                Torneos Pok{'é'}mon cada s{'á'}bado, ligas para peques, prereleases y club de manga. Inscripci{'ó'}n en tienda o por WhatsApp.
              </p>
              <a href="/eventos" style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '13px 24px',
                background: GOLD, color: INK,
                fontFamily: FB, fontSize: 13, fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '3px 3px 0 rgba(244,239,230,0.12)',
                transition: 'box-shadow .15s, transform .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '5px 5px 0 rgba(244,239,230,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 rgba(244,239,230,0.12)'; }}
              >
                Ver todos los eventos
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M2 6h8M6.5 2l4 4-4 4" />
                </svg>
              </a>
            </>
          )}
        </div>
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
      width: '100%', aspectRatio: '16/9',
      position: 'relative', overflow: 'hidden',
      borderRadius: RADIUS, border: `1.5px solid ${INK}`,
    }}>
      <iframe
        src="https://maps.google.com/maps?q=Estación+de+Leganés+Central+28911+Leganés+Madrid&output=embed&hl=es&z=16"
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación de Pokétienda en Leganés"
      />
      <a
        href="https://maps.google.com/?q=Estación+de+Leganés+Central,+28911+Leganés,+Madrid"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'absolute', bottom: 12, left: 12, zIndex: 10,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 16px',
          background: GOLD, color: INK,
          fontFamily: FM, fontSize: 11, fontWeight: 700,
          letterSpacing: 1.5, textTransform: 'uppercase',
          textDecoration: 'none', borderRadius: RADIUS,
          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
        }}
      >
        Abrir en Google Maps
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M2 6h8M6.5 2l4 4-4 4" />
        </svg>
      </a>
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
  const waNumber = storeInfo.phone.replace(/\D/g, '');
  return (
    <section id="visit" style={{ padding: mobile ? '40px 20px' : '40px 56px' }}>
      <SectionHead
        className="daruma-reveal"
        kicker={'★ cómo visitarnos'}
        title="Aquí estamos. Pásate cuando quieras."
        sub="Si nos avisas qué vienes a ver, te lo tenemos sacado."
      />
      <div className="daruma-reveal daruma-s1" style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1.3fr 1fr',
        gap: mobile ? 28 : 40, alignItems: 'start',
      }}>
        <MapPlaceholder />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <VisitBlock title="Dirección" rows={storeInfo.address.map((a) => [a])} />
          <VisitBlock title="Horario" rows={storeInfo.hours.map(([d, h]) => [d, h])} />
          <VisitBlock title="Contacto" rows={[[storeInfo.phone], [storeInfo.email], storeInfo.socials]} />
          <VisitBlock title="Cómo llegar" rows={[['Cercanías C4', 'Leganés Central'], ['A pie', '5 min desde la estación']]} />
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '13px 22px',
              background: '#25D366', color: '#fff',
              fontFamily: FM, fontSize: 12, fontWeight: 700,
              letterSpacing: 1, textTransform: 'uppercase',
              textDecoration: 'none', borderRadius: 999,
              boxShadow: '0 4px 16px rgba(37,211,102,0.28)',
              alignSelf: 'flex-start',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escríbenos antes de venir
          </a>
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
  const waNumber = storeInfo.phone.replace(/\D/g, '');

  return (
    <footer style={{
      borderTop: `1px solid ${LINE}`, background: CREAM,
    }}>
      {/* CTA strip */}
      <div className="daruma-reveal" style={{
        padding: mobile ? '28px 20px' : '32px 56px',
        background: INK,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontFamily: FD, fontSize: mobile ? 20 : 26, fontWeight: 600, letterSpacing: -0.5, color: CREAM }}>
            {'¿Buscas algo en concreto?'}
          </div>
          <div style={{ fontFamily: FB, fontSize: 14, color: 'rgba(244,239,230,0.55)', marginTop: 4 }}>
            {'Avísanos antes de venir y te lo tenemos preparado.'}
          </div>
        </div>
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '12px 22px',
            background: '#25D366', color: '#fff',
            fontFamily: FM, fontSize: 11, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase',
            textDecoration: 'none', borderRadius: 999,
            boxShadow: '0 4px 16px rgba(37,211,102,0.30)',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
      </div>

      {/* Main columns */}
      <div style={{ padding: mobile ? '40px 20px 28px' : '48px 56px 36px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
          gap: mobile ? 32 : 60,
        }}>
          <div style={{ gridColumn: mobile ? '1 / -1' : undefined }}>
            <Wordmark size={mobile ? 18 : 22} />
            <p style={{ marginTop: 20, fontFamily: FB, fontSize: 14, lineHeight: 1.6, color: MUTED, maxWidth: 340 }}>
              Cartas Pok{'é'}mon, manga y c{'ó'}mics en Legan{'é'}s. Sin tienda online - si lo ves aqu{'í'}, est{'á'} esper{'á'}ndote all{'í'}.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              {storeInfo.socials.map((s) => (
                <span key={s} style={{
                  padding: '6px 12px', borderRadius: 999,
                  border: `1px solid ${LINE}`,
                  fontFamily: FM, fontSize: 11, color: MUTED,
                  letterSpacing: 0.5,
                }}>{s}</span>
              ))}
            </div>
          </div>
          <FooterCol title="Tienda" items={['Stock destacado', 'Pokémon TCG', 'Manga', 'Cómics']} />
          <FooterCol title="Comunidad" items={['Próximos eventos', 'Liga semanal', 'Discord', 'Newsletter']} />
          <div>
            <div style={{ fontFamily: FM, fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18 }}>Contacto</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={`mailto:${storeInfo.email}`} style={{ fontFamily: FB, fontSize: 14, color: INK, textDecoration: 'none' }}>{storeInfo.email}</a>
              <a href={`tel:${storeInfo.phone.replace(/\s/g, '')}`} style={{ fontFamily: FB, fontSize: 14, color: INK, textDecoration: 'none' }}>{storeInfo.phone}</a>
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: FB, fontSize: 14, color: '#25D366', textDecoration: 'none', fontWeight: 500,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', flexDirection: mobile ? 'column' : 'row',
          justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center',
          gap: 10, paddingTop: 24, borderTop: `1px solid ${LINE}`,
          fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: 'uppercase',
        }}>
          <span>{'©'} 2026 Pok{'é'}tienda {'·'} legan{'é'}s</span>
          <span>sin tienda online {'·'} solo presencial</span>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WhatsAppFloat — fixed bottom-right contact button
// ═══════════════════════════════════════════════════════════════════════════

function WhatsAppFloat({ phone }: { phone: string }) {
  const waNumber = phone.replace(/\D/g, '');
  const mobile = useMobile();
  return (
    <a
      href={`https://wa.me/${waNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="daruma-wa-float"
      style={{
        position: 'fixed',
        bottom: 'max(24px, calc(24px + env(safe-area-inset-bottom, 0px)))',
        right: 24, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: mobile ? 0 : 10,
        padding: mobile ? '13px' : '13px 18px',
        background: '#25D366', color: '#fff',
        borderRadius: 999,
        boxShadow: '0 4px 20px rgba(37,211,102,0.38)',
        textDecoration: 'none',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, display: 'block' }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {!mobile && (
        <span style={{ fontFamily: FM, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          Escr{'í'}benos
        </span>
      )}
    </a>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Landing — main composition
// ═══════════════════════════════════════════════════════════════════════════

export function Landing({ products = [], events = [], storeInfo, heroSlides, stripeItems, logoCarousel }: {
  products?: Product[];
  events?: Event[];
  storeInfo?: StoreInfo;
  heroSlides?: HeroSlideDef[];
  stripeItems?: string[];
  logoCarousel?: { src: string; alt: string; w?: number; h?: number }[];
}) {
  const info = storeInfo ?? {
    address: [], hours: [], phone: '', email: '', socials: [''],
  };

  useEffect(() => {
    document.body.classList.add('daruma-animate-ready');
    const els = document.querySelectorAll<Element>('.daruma-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      document.body.classList.remove('daruma-animate-ready');
    };
  }, []);

  return (
    <div style={{ background: CREAM, color: INK, fontFamily: FB, minHeight: '100%' }}>
      <OpenStripe items={stripeItems} />
      <PublicNav />
      <LogoMarquee items={logoCarousel} />
      <HeroSlideshow slides={heroSlides} />
      <CategoryGrid />
      <PokemonStockSection products={products} />
      <EventsSection events={events} />
      <VisitSection storeInfo={info} />
      <Footer storeInfo={info} />
      <WhatsAppFloat phone={info.phone} />
    </div>
  );
}
