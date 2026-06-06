import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compramos colecciones · Pokétienda',
  description: 'Vendemos y tasamos cartas Pokémon, manga y cómics en Leganés. Trae tu colección a Pokétienda.',
};

const BLUE  = 'oklch(38% 0.16 263)';
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

const STEPS = [
  {
    n: '01',
    jp: '持参',
    title: 'Trae tu colección',
    body: 'Pásate por la tienda con lo que quieras vender: cartas sueltas, mazos, sobres, lotes de manga, tomos, cómics. No hace falta cita.',
  },
  {
    n: '02',
    jp: '査定',
    title: 'La tasamos en el momento',
    body: 'Revisamos el estado, edición y demanda actual. Te damos precio en el acto — sin esperas ni formularios. La tasación no te obliga a nada.',
  },
  {
    n: '03',
    jp: '選択',
    title: 'Tú decides',
    body: 'Si el precio te convence, cerramos. Si no, te vas con tu colección sin compromiso. Sin presión.',
  },
  {
    n: '04',
    jp: '支払',
    title: 'Cobras al momento',
    body: 'Pago en efectivo en el mismo momento. También podemos darte crédito para gastar en tienda si prefieres.',
  },
];

const ACCEPTS = [
  { cat: 'Pokémon TCG', jp: 'ポケモン', items: ['Cartas sueltas graded y no graded', 'Sobres y boosters', 'Mazos y decks', 'Colecciones completas de sets', 'Promos y rareza alta'] },
  { cat: 'Manga', jp: '漫画', items: ['Tomos sueltos o colecciones', 'Ediciones especiales y limitadas', 'Artbooks y guías', 'Mangas en japonés', 'Primera edición y tiraje corto'] },
  { cat: 'Cómics', jp: 'コミック', items: ['Marvel, DC y editoriales independientes', 'Grapa y tomo', 'Ediciones numeradas', 'Hardcovers y omnibus', 'Colecciones europeas y manga europeo'] },
];

const FAQS = [
  { q: '¿Necesito cita previa?', a: 'No. Pásate directamente por la tienda en horario de apertura. Si traes una colección muy grande (más de 500 cartas), avísanos por WhatsApp antes para que podamos atenderte bien.' },
  { q: '¿Qué estado tienen que tener las cartas?', a: 'Aceptamos cartas en todo tipo de estado, aunque lógicamente el precio varía. Las que están en muy mal estado puede que no las podamos tasar.' },
  { q: '¿Compráis en japonés?', a: 'Sí, aceptamos cartas y manga en japonés. El mercado de originales japoneses tiene buena demanda.' },
  { q: '¿Cuánto tardan en tasar?', a: 'Depende del volumen. Cartas sueltas o lotes pequeños, en el momento. Colecciones grandes pueden llevar 20–30 minutos.' },
  { q: '¿Pagáis en efectivo?', a: 'Sí, siempre en efectivo. También podemos darte crédito en tienda si lo prefieres — a veces sale más a cuenta.' },
];

export default function CompramosPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: BLUE, color: CREAM, padding: '80px 56px 72px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: -20, top: -40, fontFamily: FJ, fontWeight: 900, fontSize: 500, lineHeight: 0.85, color: 'rgba(244,239,230,0.04)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>買取</div>
        <div style={{ position: 'relative', maxWidth: 720 }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: GOLD, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 20 }}>
            ★ Compramos · 買取
          </div>
          <h1 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(40px,6vw,80px)', fontWeight: 700, letterSpacing: -3, lineHeight: 0.92, color: CREAM }}>
            Tu colección<br />
            <em style={{ fontStyle: 'italic', color: GOLD }}>tiene valor.</em>
          </h1>
          <p style={{ margin: '28px 0 0', fontFamily: FB, fontSize: 17, lineHeight: 1.55, color: 'rgba(244,239,230,0.72)', maxWidth: 520 }}>
            Compramos cartas Pokémon, manga y cómics. Trae lo que ya no usas, tasamos en el momento y te pagamos en efectivo. Sin intermediarios, sin esperas.
          </p>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section style={{ padding: '88px 56px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Cómo funciona</div>
          <h2 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, letterSpacing: -1.2, lineHeight: 1, color: INK }}>
            Cuatro pasos, sin complicaciones.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 2 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ background: 'white', border: `1px solid ${LINE}`, padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
              <div aria-hidden style={{ position: 'absolute', right: 16, top: 12, fontFamily: FJ, fontWeight: 900, fontSize: 80, color: 'rgba(14,21,56,0.04)', lineHeight: 1 }}>{s.jp}</div>
              <div style={{ fontFamily: FM, fontSize: 32, fontWeight: 700, color: 'rgba(14,21,56,0.10)', letterSpacing: -1, marginBottom: 20, lineHeight: 1 }}>{s.n}</div>
              <h3 style={{ margin: '0 0 12px', fontFamily: FD, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: INK, lineHeight: 1.15 }}>{s.title}</h3>
              <p style={{ margin: 0, fontFamily: FB, fontSize: 14, lineHeight: 1.6, color: MUTED }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Qué compramos ── */}
      <section style={{ padding: '88px 56px', background: INK, color: CREAM, borderBottom: `1px solid rgba(244,239,230,0.08)` }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: GOLD, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Qué compramos</div>
          <h2 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, letterSpacing: -1.2, lineHeight: 1, color: CREAM }}>
            Pokémon, manga y cómics.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
          {ACCEPTS.map((a) => (
            <div key={a.cat} style={{ border: '1px solid rgba(244,239,230,0.12)', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
                <span style={{ fontFamily: FD, fontSize: 20, fontWeight: 700, color: CREAM }}>{a.cat}</span>
                <span style={{ fontFamily: FJ, fontSize: 16, fontWeight: 700, color: GOLD }}>{a.jp}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {a.items.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: FB, fontSize: 14, color: 'rgba(244,239,230,0.72)', lineHeight: 1.4 }}>
                    <span style={{ color: GOLD, flexShrink: 0, marginTop: 2 }}>★</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '88px 56px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Preguntas frecuentes</div>
          <h2 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, letterSpacing: -1.2, lineHeight: 1, color: INK }}>
            Lo que nos suelen preguntar.
          </h2>
        </div>
        <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderTop: `1px solid ${LINE}`, padding: '28px 0', ...(i === FAQS.length - 1 ? { borderBottom: `1px solid ${LINE}` } : {}) }}>
              <div style={{ fontFamily: FD, fontSize: 18, fontWeight: 600, color: INK, marginBottom: 10 }}>{f.q}</div>
              <div style={{ fontFamily: FB, fontSize: 15, lineHeight: 1.6, color: MUTED }}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '88px 56px', background: CREAM }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontFamily: FJ, fontSize: 80, fontWeight: 900, color: 'rgba(14,21,56,0.06)', lineHeight: 1, marginBottom: 4 }}>いらっしゃい</div>
            <h2 style={{ margin: '0 0 16px', fontFamily: FD, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: -1.2, lineHeight: 1, color: INK }}>
              Trae lo que tienes.
            </h2>
            <p style={{ margin: '0 0 32px', fontFamily: FB, fontSize: 17, lineHeight: 1.55, color: MUTED, maxWidth: 460 }}>
              Horario de apertura Lu–Do 17:00–21:00. No necesitas cita. Si traes un lote grande avísanos por WhatsApp.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/#visit" style={{ padding: '14px 24px', background: BLUE, color: CREAM, fontFamily: FB, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '4px 4px 0 rgba(14,21,56,0.15)' }}>
                Cómo visitarnos →
              </a>
              <a href="/eventos" style={{ padding: '14px 24px', background: 'transparent', color: INK, border: `1.5px solid ${LINE}`, fontFamily: FB, fontSize: 15, textDecoration: 'none' }}>
                Ver eventos
              </a>
            </div>
          </div>
          <div style={{ flex: '0 0 auto', padding: '28px 32px', background: 'white', border: `1px solid ${LINE}`, minWidth: 240 }}>
            <div style={{ fontFamily: FM, fontSize: 10, color: BLUE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Horario tienda</div>
            {[
              ['Lunes – Viernes', '17:00 – 21:00'],
              ['Sábado', '17:00 – 21:00'],
              ['Domingo', '17:00 – 21:00'],
            ].map(([d, h]) => (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 10 }}>
                <span style={{ fontFamily: FB, fontSize: 14, color: MUTED }}>{d}</span>
                <span style={{ fontFamily: FM, fontSize: 13, color: INK, fontWeight: 600 }}>{h}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px dashed ${LINE}` }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, background: RED, borderRadius: '50%', display: 'inline-block' }} />
                <span style={{ fontFamily: FM, fontSize: 10, color: RED, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>En tienda ahora</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
