'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { POKE_SETS } from '@/app/data';

// ─── Paleta ────────────────────────────────────────────────────────────────
const BLUE    = 'oklch(38% 0.16 263)';
const GOLD    = 'oklch(78% 0.13 88)';
const CREAM   = '#f4efe6';
const INK     = '#0e1538';
const MUTED   = 'rgba(14,21,56,0.58)';
const LINE    = 'rgba(14,21,56,0.10)';
const CARD_BG = '#ffffff';
const CARD_BD = 'rgba(14,21,56,0.08)';
const CHIP_TR = 'rgba(14,21,56,0.05)';
const RADIUS  = 4;

// ─── Fuentes ───────────────────────────────────────────────────────────────
const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';

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

// ─── useMobile ────────────────────────────────────────────────────────────
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

// ─── ProductPlaceholder ───────────────────────────────────────────────────
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

// ─── DarumaMark ───────────────────────────────────────────────────────────
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

// ─── Wordmark ─────────────────────────────────────────────────────────────
function Wordmark({ size = 18, lightMode = false }: { size?: number; lightMode?: boolean }) {
  const fg    = lightMode ? '#f4efe6' : INK;
  const muted = lightMode ? 'rgba(244,239,230,0.6)' : MUTED;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <DarumaMark size={size * 1.9} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: FD, fontWeight: 700, fontSize: size, letterSpacing: -0.5, color: fg }}>
          daruma
        </span>
        <span style={{ fontFamily: FM, fontSize: size * 0.45, letterSpacing: 1.5, color: muted, textTransform: 'uppercase', marginTop: 4 }}>
          cartas · manga · cómics
        </span>
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────
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
        background: 'rgba(244,239,230,0.92)', position: 'sticky', top: 0, zIndex: 20,
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

      {/* Mobile drawer */}
      {mobile && open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 19,
          background: 'rgba(244,239,230,0.97)', display: 'flex', flexDirection: 'column',
          paddingTop: 80, paddingInline: 24, gap: 0,
        }}>
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

// ─── SectionHead ──────────────────────────────────────────────────────────
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
        <h2 style={{ margin: 0, fontFamily: FD, fontSize: mobile ? 30 : 44, fontWeight: 600, letterSpacing: mobile ? -0.6 : -1.2, lineHeight: 1.1, color: INK, textWrap: 'pretty' as any }}>
          {title}
        </h2>
        {sub && (
          <p style={{ margin: '14px 0 0', fontFamily: FB, fontSize: mobile ? 14 : 16, lineHeight: 1.55, color: MUTED, maxWidth: 560, textWrap: 'pretty' as any }}>
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

// ─── FiltersBar ───────────────────────────────────────────────────────────
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
    <div style={{ display: 'flex', alignItems: mobile ? 'stretch' : 'center', flexDirection: mobile ? 'column' : 'row', gap: mobile ? 10 : 14, flexWrap: 'wrap', padding: '16px 0', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      {/* Category pills */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: CHIP_TR, borderRadius: 999, flexWrap: 'wrap' }}>
        {cats.map((c) => {
          const on = cat === c.key;
          return (
            <button key={c.key} onClick={() => setCat(c.key)} style={{
              padding: '8px 14px', fontFamily: FB, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer', borderRadius: 999,
              background: on ? BLUE : 'transparent',
              color: on ? CREAM : MUTED,
              transition: 'background .15s, color .15s',
            }}>{c.label}</button>
          );
        })}
      </div>

      {/* Expansion filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, border: `1px solid ${LINE}` }}>
        <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: 1 }}>expansión</span>
        <select value={set} onChange={(e) => setSet(e.target.value)} style={{
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: FB, fontSize: 13, color: INK, cursor: 'pointer',
          appearance: 'none',
        }}>
          {POKE_SETS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, border: `1px solid ${LINE}`, flex: mobile ? '1 1 auto' : '0 1 320px', marginLeft: mobile ? 0 : 'auto' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={MUTED} strokeWidth="1.5">
          <circle cx="6" cy="6" r="4.5" /><path d="M9.5 9.5L12.5 12.5" strokeLinecap="round" />
        </svg>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="busca carta, set, autor..."
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FB, fontSize: 13, color: INK }} />
      </div>

      <div style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: 'uppercase' }}>
        {count}/{total}
      </div>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────
function ProductCard({ item }: { item: Product }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12, background: CARD_BG, borderRadius: RADIUS, border: `1px solid ${CARD_BD}`, transition: 'transform .25s, box-shadow .25s' }}>
      <div style={{ position: 'relative' }}>
        <ProductPlaceholder aspect="3/4" label={item.cat} />
        <span style={{
          position: 'absolute', top: 8, left: 8, padding: '3px 8px',
          fontFamily: FM, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
          background: BLUE, color: CREAM, borderRadius: 999,
        }}>{item.tag}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontFamily: FD, fontSize: 14, fontWeight: 600, color: INK, letterSpacing: -0.2, lineHeight: 1.2 }}>{item.name}</div>
        <div style={{ fontFamily: FB, fontSize: 12, color: MUTED }}>{item.set}</div>
        <div style={{ fontFamily: FM, fontSize: 10, color: MUTED, textTransform: 'lowercase', letterSpacing: 0.3 }}>{item.meta}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: `1px dashed ${LINE}` }}>
        <span style={{ fontFamily: FM, fontSize: 10, color: BLUE, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: 3, background: BLUE }}></span>
          en tienda
        </span>
        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: INK, fontFamily: FM, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
          ver →
        </button>
      </div>
    </div>
  );
}

// ─── EventCard ────────────────────────────────────────────────────────────
function EventCard({ ev, accentDate = false }: { ev: Event; accentDate?: boolean }) {
  const mobile = useMobile();
  const dateBg  = accentDate ? GOLD : BLUE;
  const dateFg  = accentDate ? INK  : CREAM;
  return (
    <article style={{
      display: mobile ? 'flex' : 'grid',
      gridTemplateColumns: mobile ? undefined : '108px 1fr auto',
      flexDirection: mobile ? 'column' : undefined,
      gap: mobile ? 16 : 28,
      padding: mobile ? 18 : 24,
      background: CARD_BG, borderRadius: RADIUS, border: `1px solid ${CARD_BD}`,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: mobile ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: mobile ? '10px 18px' : '14px 0',
        borderRadius: RADIUS,
        background: dateBg, color: dateFg,
        gap: mobile ? 8 : 0,
        alignSelf: mobile ? 'flex-start' : undefined,
      }}>
        <span style={{ fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', opacity: .7 }}>{ev.date.dow}</span>
        <span style={{ fontFamily: FD, fontSize: mobile ? 28 : 36, fontWeight: 600, lineHeight: 1 }}>{ev.date.d}</span>
        <span style={{ fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' }}>{ev.date.m}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '3px 9px', fontFamily: FM, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', background: BLUE, color: CREAM, borderRadius: 999 }}>
            {ev.badge}
          </span>
          <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.5 }}>{ev.when}</span>
        </div>
        <h3 style={{ margin: 0, fontFamily: FD, fontSize: mobile ? 18 : 22, fontWeight: 600, letterSpacing: -0.4, color: INK, lineHeight: 1.15 }}>{ev.title}</h3>
        <p style={{ margin: 0, fontFamily: FB, fontSize: 14, lineHeight: 1.5, color: MUTED }}>{ev.desc}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: mobile ? 'row' : 'column', alignItems: mobile ? 'center' : 'flex-end', justifyContent: mobile ? 'space-between' : undefined, gap: 8 }}>
        <span style={{ fontFamily: FD, fontSize: mobile ? 18 : 20, fontWeight: 600, color: INK }}>{ev.price}</span>
        <button style={{ padding: '9px 16px', borderRadius: 999, background: 'transparent', border: `1px solid ${LINE}`, color: INK, fontFamily: FB, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Apúntate →
        </button>
      </div>
    </article>
  );
}

// ─── MapSVG ───────────────────────────────────────────────────────────────
function MapSVG() {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#ece7dc', borderRadius: RADIUS, overflow: 'hidden', border: `1px solid ${LINE}` }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        {[40,90,140,190,240,290].map((y) => <line key={'h'+y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(14,21,56,0.05)" strokeWidth="1" />)}
        {[60,130,200,270,340].map((x)  => <line key={'v'+x}  x1={x} y1="0"  x2={x} y2="300" stroke="rgba(14,21,56,0.05)" strokeWidth="1" />)}
        <path d="M0 160 L130 165 L200 110 L340 115 L400 145" fill="none" stroke="rgba(14,21,56,0.1)" strokeWidth="3" />
        <path d="M150 0 L160 90 L155 200 L170 300"           fill="none" stroke="rgba(14,21,56,0.1)" strokeWidth="3" />
        <path d="M270 0 L280 100 L290 220 L295 300"          fill="none" stroke="rgba(14,21,56,0.08)" strokeWidth="2" />
        <rect x="60"  y="50"  width="50" height="35" fill="rgba(14,21,56,0.05)" />
        <rect x="220" y="170" width="40" height="45" fill="rgba(14,21,56,0.05)" />
        <rect x="320" y="200" width="35" height="40" fill="rgba(14,21,56,0.05)" />
        <circle cx="200" cy="170" r="14" fill={BLUE} />
        <circle cx="200" cy="170" r="6"  fill={CREAM} />
      </svg>
      <span style={{ position: 'absolute', bottom: 16, left: 16, padding: '6px 12px', background: CREAM, color: INK, fontFamily: FM, fontSize: 11, letterSpacing: 1, borderRadius: 999, border: `1px solid ${LINE}`, textTransform: 'uppercase' }}>
        mapa · Leganés Centro
      </span>
    </div>
  );
}

// ─── VisitBlock ───────────────────────────────────────────────────────────
function VisitBlock({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div>
      <div style={{ fontFamily: FM, fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${LINE}` }}>
        {title}
      </div>
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

// ─── Footer ───────────────────────────────────────────────────────────────
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
    <footer style={{ padding: mobile ? '48px 20px 32px' : '56px 56px 40px', borderTop: `1px solid ${LINE}`, background: CREAM, display: 'flex', flexDirection: 'column', gap: 48 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
        gap: mobile ? 32 : 60,
      }}>
        <div style={{ gridColumn: mobile ? '1 / -1' : undefined }}>
          <Wordmark size={mobile ? 18 : 22} />
          <p style={{ marginTop: 20, fontFamily: FB, fontSize: 14, lineHeight: 1.6, color: MUTED, maxWidth: 360 }}>
            Tienda de cartas Pokémon, manga y cómics en Bilbao. Sin tienda online — si lo ves aquí, está esperándote allí.
          </p>
        </div>
        <FooterCol title="Tienda"     items={['Stock destacado','Pokémon TCG','Manga','Cómics']} />
        <FooterCol title="Comunidad"  items={['Próximos eventos','Liga semanal','Discord','Newsletter']} />
        <FooterCol title="Contacto"   items={[storeInfo.email, storeInfo.phone, storeInfo.socials[0]]} />
      </div>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', gap: 10, paddingTop: 24, borderTop: `1px solid ${LINE}`, fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: 'uppercase' }}>
        <span>© 2026 daruma · Leganés</span>
        <span>sin tienda online · solo presencial</span>
      </div>
    </footer>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function HeroAzul() {
  const mobile = useMobile();
  return (
    <section style={{
      background: BLUE, color: CREAM,
      minHeight: mobile ? 'auto' : 'calc(100vh - 73px)',
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      position: 'relative', overflow: 'hidden',
      padding: mobile ? '0 20px' : '0 80px',
    }}>
      <img src="/assets/daruma-logo.png" alt=""
        style={{ position: 'absolute', right: -180, bottom: -180, width: 720, height: 720, opacity: 0.08, filter: 'saturate(0)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Texto */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: mobile ? '56px 0 40px' : '80px 40px 80px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: GOLD, color: INK, borderRadius: 999, fontFamily: FM, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24, alignSelf: 'flex-start' }}>
          ★ punto fuerte · Pokémon TCG
        </div>
        <h1 style={{ margin: 0, fontFamily: FD, fontSize: mobile ? 44 : 72, fontWeight: 600, letterSpacing: mobile ? -1.5 : -3, lineHeight: 1.05, color: CREAM }}>
          La tienda<br />
          donde <em style={{ fontStyle: 'italic', fontWeight: 400, color: GOLD }}>pides</em><br />
          <em style={{ fontStyle: 'italic', fontWeight: 400, color: GOLD }}>el deseo</em><br />
          y vienes<br />
          a buscarlo.
        </h1>
        <p style={{ marginTop: 24, fontFamily: FB, fontSize: mobile ? 15 : 17, lineHeight: 1.55, color: 'rgba(244,239,230,0.75)', maxWidth: 460 }}>
          Daruma · cartas Pokémon, manga y cómics en Leganés. Pinta el primer ojo cuando entras buscando esa carta. El segundo cuando la encuentras.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
          <a href="#stock" style={{ padding: '14px 22px', borderRadius: 999, background: GOLD, color: INK, fontFamily: FB, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Ver el stock
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" />
            </svg>
          </a>
          <a href="#visit" style={{ padding: '14px 22px', borderRadius: 999, background: 'transparent', color: CREAM, border: '1px solid rgba(244,239,230,0.3)', fontFamily: FB, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            Visítanos
          </a>
        </div>
      </div>

      {/* Imagen */}
      {!mobile && (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src="/Mega-dream-card-waver.webp"
            alt="Colección destacada Daruma"
            fill
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            priority
          />
        </div>
      )}
    </section>
  );
}

// ─── Filosofía ────────────────────────────────────────────────────────────
function FilosofiaBanda() {
  const mobile = useMobile();
  return (
    <section style={{ padding: mobile ? '56px 20px' : '96px 56px', borderBottom: `1px solid ${LINE}`, background: '#ffffff' }}>
      <SectionHead
        kicker="★ filosofía Daruma"
        title="Una tienda física para una afición física."
        sub="Cartas que se tocan, sobres que se abren, partidas que se juegan en la misma mesa. Todo lo que sale aquí está físicamente en la tienda."
      />
    </section>
  );
}

// ─── Stock ────────────────────────────────────────────────────────────────
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
    <section id="stock" style={{ padding: mobile ? '56px 20px' : '96px 56px' }}>
      <SectionHead
        kicker="★ Stock destacado · actualizado hoy"
        title="Lo que tenemos ahora mismo en tienda."
        sub="Selección rotatoria. Lo bueno vuela — si ves algo aquí, pásate cuanto antes. Esto es solo una muestra; pregúntanos por lo que busques."
      />
      <FiltersBar cat={cat} setCat={setCat} query={query} setQuery={setQuery} set={set} setSet={setSet} total={products.length} count={items.length} />
      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 14 : 24 }}>
        {items.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '48px 0', textAlign: 'center', fontFamily: FB, fontSize: 16, color: MUTED }}>
            Ahora mismo no tenemos eso en stock — escríbenos y te avisamos cuando llegue.
          </div>
        ) : items.slice(0, 8).map((it) => <ProductCard key={it.id} item={it} />)}
      </div>
    </section>
  );
}

// ─── Eventos ──────────────────────────────────────────────────────────────
function EventsSection({ events }: { events: Event[] }) {
  const mobile = useMobile();
  return (
    <section id="events" style={{ padding: mobile ? '56px 20px' : '96px 56px', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      <SectionHead
        kicker="★ próximos eventos"
        title="Pásate también a jugar y hacer comunidad."
        sub="Torneos Pokémon cada sábado, ligas para peques, prereleases y club de manga. La inscripción se hace en tienda o por WhatsApp."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {events.map((ev, i) => <EventCard key={ev.id} ev={ev} accentDate={i === 0} />)}
      </div>
    </section>
  );
}

// ─── Visítanos ────────────────────────────────────────────────────────────
function VisitSection({ storeInfo }: { storeInfo: StoreInfo }) {
  const mobile = useMobile();
  return (
    <section id="visit" style={{ padding: mobile ? '56px 20px' : '96px 56px' }}>
      <SectionHead
        kicker="★ cómo visitarnos"
        title="Aquí estamos. Pásate cuando quieras."
        sub="A dos minutos del metro Leganés Central. Si nos avisas qué vienes a ver, te lo tenemos sacado."
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1.3fr 1fr',
        gap: mobile ? 32 : 56,
        alignItems: 'start',
      }}>
        <MapSVG />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <VisitBlock title="Dirección" rows={storeInfo.address.map((a) => [a])} />
          <VisitBlock title="Horario"   rows={storeInfo.hours.map(([d, h]) => [d, h])} />
          <VisitBlock title="Contacto"  rows={[[storeInfo.phone], [storeInfo.email], storeInfo.socials]} />
        </div>
      </div>
    </section>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────
export function Landing({ products = [], events = [], storeInfo }: {
  products?: Product[];
  events?: Event[];
  storeInfo?: StoreInfo;
}) {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const info = storeInfo ?? {
    address: [], hours: [], phone: '', email: '', socials: [''],
  };

  return (
    <div style={{ background: CREAM, color: INK, fontFamily: FB, minHeight: '100%' }}>
      <Nav />
      <HeroAzul />
      <FilosofiaBanda />
      <StockSection products={products} />
      <EventsSection events={events} />
      <VisitSection storeInfo={info} />
      <Footer storeInfo={info} />
    </div>
  );
}
