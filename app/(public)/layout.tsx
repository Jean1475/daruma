import React from 'react';
import { PublicNav } from '@/app/components/public-nav';
import { getSiteConfig } from '@/app/lib/data-service';

const BLUE  = 'oklch(38% 0.16 263)';
const GOLD  = 'oklch(78% 0.13 88)';
const CREAM = '#f4efe6';
const INK   = '#0e1538';
const LINE  = 'rgba(14,21,56,0.10)';
const MUTED = 'rgba(14,21,56,0.55)';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FJ = 'var(--font-jp),"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';

function OpenStripe({ items }: { items: string[] }) {
  const ribbon = items.map((s, i) => (
    <span key={i} style={{ padding: '0 22px' }}>{s}</span>
  ));
  return (
    <div style={{
      background: GOLD, color: INK,
      borderBottom: `1.5px solid ${INK}`,
      position: 'relative', overflow: 'hidden',
      fontFamily: FM, fontSize: 11, fontWeight: 600,
      letterSpacing: 1.5, textTransform: 'uppercase',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
        <div className="daruma-open-stripe" style={{ display: 'flex', alignItems: 'center', width: 'max-content', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>{ribbon}{ribbon}</div>
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

function SiteFooter() {
  return (
    <footer style={{
      borderTop: `1px solid ${LINE}`, background: INK, color: CREAM,
      padding: '56px 56px 40px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 48, marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>La tienda</div>
          {['Todo el stock', 'Eventos', 'Blog'].map((l) => (
            <a key={l} href={l === 'Todo el stock' ? '/#stock' : `/${l.toLowerCase()}`}
              style={{ display: 'block', fontFamily: FB, fontSize: 14, color: 'rgba(244,239,230,0.65)', textDecoration: 'none', marginBottom: 10 }}>
              {l}
            </a>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Servicios</div>
          {['Compramos colecciones', 'Torneos', 'Prerelease', 'Book Club'].map((l) => (
            <a key={l} href={l === 'Compramos colecciones' ? '/compramos' : '/eventos'}
              style={{ display: 'block', fontFamily: FB, fontSize: 14, color: 'rgba(244,239,230,0.65)', textDecoration: 'none', marginBottom: 10 }}>
              {l}
            </a>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Dónde estamos</div>
          <p style={{ fontFamily: FB, fontSize: 14, color: 'rgba(244,239,230,0.65)', lineHeight: 1.6, margin: '0 0 10px' }}>
            Leganés, Madrid<br />Mar–Dom 10:00–14:00 / 17:00–21:00
          </p>
          <p style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>solo en tienda · no online</p>
        </div>
        <div>
          <div style={{ fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Contacto</div>
          <div style={{ fontFamily: FJ, fontSize: 48, fontWeight: 900, color: 'rgba(244,239,230,0.06)', lineHeight: 1, marginBottom: 12 }}>
            ダルマ
          </div>
          <p style={{ fontFamily: FB, fontSize: 13, color: 'rgba(244,239,230,0.55)', margin: 0, lineHeight: 1.6 }}>
            Cartas Pokémon<br />Manga · Cómics<br />Leganés, Madrid
          </p>
        </div>
      </div>
      <div style={{ borderTop: `1px solid rgba(244,239,230,0.08)`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.35)', letterSpacing: 1 }}>
          © {new Date().getFullYear()} Daruma · Leganés, Madrid
        </span>
        <span style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.35)', letterSpacing: 1 }}>
          ダルマ専門店
        </span>
      </div>
    </footer>
  );
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const siteConfig = await getSiteConfig();
  return (
    <div style={{ background: CREAM, color: INK, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <OpenStripe items={siteConfig.stripeItems} />
      <PublicNav />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter />
    </div>
  );
}
