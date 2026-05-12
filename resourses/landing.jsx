// landing.jsx — composes Nav + Hero + Chase + Stock + Events + Visit + Footer
// into a single long-scroll landing. Three themes (V1/V2/V3) produce three
// visual directions of the same layout.

const { useState: ls_useState, useMemo: ls_useMemo, useEffect: ls_useEffect, useRef: ls_useRef } = React;

// ─────────────────────────────────────────────────────────────────────────
// Theme tokens — three full palettes. Each variant gets its own. The "claro/
// crema/oscuro" tweak switches V1 between three sub-palettes.
// ─────────────────────────────────────────────────────────────────────────

const FONT_DISPLAY = '"Bricolage Grotesque", "Helvetica Neue", system-ui, sans-serif';
const FONT_BODY    = '"DM Sans", "Helvetica Neue", system-ui, sans-serif';
const FONT_MONO    = '"JetBrains Mono", ui-monospace, "SF Mono", monospace';

const DARUMA_BLUE  = 'oklch(38% 0.16 263)';
const DARUMA_BLUE_DARK = 'oklch(28% 0.14 263)';
const DARUMA_GOLD  = 'oklch(78% 0.13 88)';
const DARUMA_GOLD_SOFT = 'oklch(85% 0.09 88)';

const THEMES = {
  // V1 — Editorial claro (responds to the tweak)
  v1_claro: {
    mode: 'light',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#f8f6f1', fg: '#1a1614', muted: 'rgba(26,22,20,0.58)',
    line: 'rgba(26,22,20,0.10)',
    accent: DARUMA_BLUE, accentFg: '#f8f6f1',
    cardBg: '#ffffff', cardBorder: 'rgba(26,22,20,0.08)', cardRadius: 6,
    chipTrack: 'rgba(26,22,20,0.05)', chipOnBg: '#1a1614', chipOnFg: '#f8f6f1',
    tagBg: 'rgba(26,22,20,0.06)', tagFg: '#1a1614',
    dateBg: '#f4efe6', dateFg: '#1a1614',
    badgeBg: 'transparent', badgeFg: '#1a1614', badgeBorder: 'rgba(26,22,20,0.15)',
    ctaBg: '#1a1614', ctaFg: '#f8f6f1',
  },
  v1_crema: {
    mode: 'light',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#f0e8d8', fg: '#2a1e16', muted: 'rgba(42,30,22,0.60)',
    line: 'rgba(42,30,22,0.12)',
    accent: DARUMA_BLUE, accentFg: '#f0e8d8',
    cardBg: '#f6efe2', cardBorder: 'rgba(42,30,22,0.10)', cardRadius: 6,
    chipTrack: 'rgba(42,30,22,0.06)', chipOnBg: '#2a1e16', chipOnFg: '#f0e8d8',
    tagBg: 'rgba(42,30,22,0.08)', tagFg: '#2a1e16',
    dateBg: '#e8dec8', dateFg: '#2a1e16',
    badgeBg: 'transparent', badgeFg: '#2a1e16', badgeBorder: 'rgba(42,30,22,0.20)',
    ctaBg: '#2a1e16', ctaFg: '#f0e8d8',
  },
  v1_oscuro: {
    mode: 'dark',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#13100f', fg: '#f4efe6', muted: 'rgba(244,239,230,0.55)',
    line: 'rgba(244,239,230,0.12)',
    accent: DARUMA_GOLD, accentFg: '#13100f',
    cardBg: '#1c1816', cardBorder: 'rgba(244,239,230,0.08)', cardRadius: 6,
    chipTrack: 'rgba(244,239,230,0.06)', chipOnBg: '#f4efe6', chipOnFg: '#13100f',
    tagBg: 'rgba(244,239,230,0.08)', tagFg: '#f4efe6',
    dateBg: '#1c1816', dateFg: '#f4efe6',
    badgeBg: 'transparent', badgeFg: '#f4efe6', badgeBorder: 'rgba(244,239,230,0.20)',
    ctaBg: '#f4efe6', ctaFg: '#13100f',
  },

  // V2 — Azul Daruma protagonista (cobalto inmersivo + crema cálida)
  v2: {
    mode: 'light',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#f4efe6', fg: '#0e1538', muted: 'rgba(14,21,56,0.58)',
    line: 'rgba(14,21,56,0.10)',
    accent: DARUMA_BLUE, accentFg: '#f4efe6',
    secondary: DARUMA_GOLD,
    cardBg: '#ffffff', cardBorder: 'rgba(14,21,56,0.08)', cardRadius: 4,
    chipTrack: 'rgba(14,21,56,0.05)', chipOnBg: DARUMA_BLUE, chipOnFg: '#f4efe6',
    tagBg: DARUMA_BLUE, tagFg: '#f4efe6',
    dateBg: DARUMA_BLUE, dateFg: '#f4efe6',
    badgeBg: DARUMA_GOLD, badgeFg: '#0e1538', badgeBorder: 'transparent',
    ctaBg: DARUMA_BLUE, ctaFg: '#f4efe6',
  },

  // V3 — Vitrina oscura, galería de coleccionista
  v3: {
    mode: 'dark',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO,
    bg: '#0d0a0c', fg: '#f4efe6', muted: 'rgba(244,239,230,0.48)',
    line: 'rgba(244,239,230,0.10)',
    accent: DARUMA_GOLD, accentFg: '#0d0a0c',
    cardBg: '#15121280', cardBorder: 'rgba(244,239,230,0.10)', cardRadius: 2,
    chipTrack: 'rgba(244,239,230,0.04)', chipOnBg: DARUMA_GOLD, chipOnFg: '#0d0a0c',
    tagBg: 'rgba(212,167,58,0.15)', tagFg: DARUMA_GOLD,
    dateBg: '#1c1818', dateFg: DARUMA_GOLD,
    badgeBg: 'transparent', badgeFg: DARUMA_GOLD, badgeBorder: 'rgba(212,167,58,0.40)',
    ctaBg: DARUMA_GOLD, ctaFg: '#0d0a0c',
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Hero — three variants
// ─────────────────────────────────────────────────────────────────────────

function HeroEditorial({ t }) {
  return (
    <section style={{ padding: '72px 56px 56px', borderBottom: `1px solid ${t.line}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'end' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', border: `1px solid ${t.line}`, borderRadius: 999,
            fontFamily: t.mono, fontSize: 11, color: t.muted, letterSpacing: 1.5,
            textTransform: 'uppercase', marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: t.accent }}></span>
            tienda en Bilbao desde 2019
          </div>
          <h1 style={{
            margin: 0, fontFamily: t.display, fontSize: 92, fontWeight: 600,
            letterSpacing: -3.5, lineHeight: 0.92, color: t.fg, textWrap: 'balance',
          }}>
            Cartas que coleccionas, <em style={{ fontStyle: 'italic', fontWeight: 400, color: t.accent }}>historias</em> que se quedan.
          </h1>
          <p style={{
            marginTop: 28, fontFamily: t.body, fontSize: 18, lineHeight: 1.55,
            color: t.muted, maxWidth: 480, textWrap: 'pretty',
          }}>
            Pokémon TCG en bruto y graduado, manga al día, cómic clásico y moderno.
            No vendemos online — pásate, abre cajas con nosotros y juega los sábados.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            <a href="#stock" style={{
              padding: '15px 24px', borderRadius: 999, background: t.ctaBg, color: t.ctaFg,
              fontFamily: t.body, fontSize: 14, fontWeight: 500, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Ver stock
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" /></svg>
            </a>
            <a href="#events" style={{
              padding: '15px 24px', borderRadius: 999, background: 'transparent', color: t.fg,
              border: `1px solid ${t.line}`,
              fontFamily: t.body, fontSize: 14, fontWeight: 500, textDecoration: 'none',
            }}>Próximos eventos</a>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <ProductPlaceholder t={t} aspect="4/5" label="hero · escaparate de la tienda" big />
          <div style={{
            position: 'absolute', bottom: 24, left: 24, right: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            fontFamily: t.mono, fontSize: 11, color: t.fg, letterSpacing: 1.2, textTransform: 'uppercase',
          }}>
            <div style={{
              padding: '8px 14px', background: t.bg, borderRadius: 999,
              border: `1px solid ${t.line}`,
            }}>★ 1.200+ cartas en stock</div>
            <div style={{
              padding: '8px 14px', background: t.bg, borderRadius: 999,
              border: `1px solid ${t.line}`,
            }}>L–D · 17–21h</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroAzulDaruma({ t }) {
  return (
    <section style={{
      background: DARUMA_BLUE, color: '#f4efe6',
      padding: '88px 56px 96px', position: 'relative', overflow: 'hidden',
    }}>
      {/* faint daruma silhouette in the background */}
      <img src="assets/daruma-logo.png" alt=""
        style={{
          position: 'absolute', right: -180, bottom: -180, width: 720, height: 720,
          opacity: 0.10, filter: 'saturate(0)', pointerEvents: 'none',
        }} />
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', background: DARUMA_GOLD, color: '#0e1538',
            borderRadius: 999, fontFamily: t.mono, fontSize: 11, fontWeight: 600,
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 28,
          }}>
            ★ punto fuerte · Pokémon TCG
          </div>
          <h1 style={{
            margin: 0, fontFamily: t.display, fontSize: 100, fontWeight: 600,
            letterSpacing: -4, lineHeight: 0.9, color: '#f4efe6', textWrap: 'balance',
          }}>
            La tienda donde <em style={{
              fontStyle: 'italic', fontWeight: 400, color: DARUMA_GOLD,
            }}>pides el deseo</em> y vienes a buscarlo.
          </h1>
          <p style={{
            marginTop: 30, fontFamily: t.body, fontSize: 19, lineHeight: 1.5,
            color: 'rgba(244,239,230,0.75)', maxWidth: 540, textWrap: 'pretty',
          }}>
            Daruma · cartas Pokémon, manga y cómics en Bilbao. Pinta el primer
            ojo cuando entras buscando esa carta. El segundo cuando la encuentras.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <a href="#stock" style={{
              padding: '16px 26px', borderRadius: 999, background: DARUMA_GOLD, color: '#0e1538',
              fontFamily: t.body, fontSize: 15, fontWeight: 600, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              Ver el stock
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" /></svg>
            </a>
            <a href="#visit" style={{
              padding: '16px 26px', borderRadius: 999, background: 'transparent', color: '#f4efe6',
              border: '1px solid rgba(244,239,230,0.3)',
              fontFamily: t.body, fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>Visítanos</a>
          </div>
        </div>
        <div style={{
          position: 'relative', padding: 28,
          background: 'rgba(244,239,230,0.05)', borderRadius: 8,
          border: '1px solid rgba(244,239,230,0.15)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 18,
          }}>
            <span style={{
              fontFamily: t.mono, fontSize: 10, color: DARUMA_GOLD,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>★ carta del mes</span>
            <span style={{
              fontFamily: t.mono, fontSize: 10, color: 'rgba(244,239,230,0.5)',
              letterSpacing: 1, textTransform: 'uppercase',
            }}>1 unidad</span>
          </div>
          <div style={{ borderRadius: 4, overflow: 'hidden', marginBottom: 18 }}>
            <ProductPlaceholder
              t={{ ...t, cardRadius: 4 }}
              tone="dark"
              aspect="5/7"
              label="charizard ex · SIR" big />
          </div>
          <div style={{
            fontFamily: t.display, fontSize: 24, fontWeight: 600,
            color: '#f4efe6', letterSpacing: -0.4, lineHeight: 1.15,
          }}>Charizard ex · Special Illustration Rare</div>
          <div style={{
            fontFamily: t.mono, fontSize: 11, color: 'rgba(244,239,230,0.5)',
            letterSpacing: 1, textTransform: 'uppercase', marginTop: 8,
          }}>obsidian flames · 199/197</div>
        </div>
      </div>
    </section>
  );
}

function HeroVitrina({ t }) {
  return (
    <section style={{
      padding: '120px 56px 80px',
      borderBottom: `1px solid ${t.line}`, position: 'relative',
    }}>
      {/* gold rule top */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, marginBottom: 56,
        fontFamily: t.mono, fontSize: 11, color: t.accent,
        letterSpacing: 2, textTransform: 'uppercase',
      }}>
        <span style={{ width: 36, height: 1, background: t.accent }}></span>
        catálogo · primavera 26
        <span style={{ flex: 1, height: 1, background: t.line }}></span>
        <span style={{ color: t.muted }}>Bilbao</span>
      </div>
      <div style={{ textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{
          margin: 0, fontFamily: t.display, fontSize: 132, fontWeight: 500,
          letterSpacing: -5, lineHeight: 0.9, color: t.fg, textWrap: 'balance',
        }}>
          Una carta, <em style={{
            fontStyle: 'italic', fontWeight: 400, color: t.accent,
          }}>una historia</em>,
          <br />una vitrina.
        </h1>
        <p style={{
          marginTop: 40, fontFamily: t.body, fontSize: 19, lineHeight: 1.55,
          color: t.muted, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto',
          textWrap: 'pretty',
        }}>
          Daruma es una tienda física en Bilbao especializada en cartas Pokémon
          de coleccionista, manga y cómic. Lo que ves aquí está esperándote allí.
        </p>
      </div>
      <div style={{
        marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32,
        alignItems: 'end',
      }}>
        {[
          { label: 'pokémon · charizard ex SIR', tag: '★ carta del mes', size: 'big' },
          { label: 'manga · berserk deluxe vol. 7', tag: 'deluxe', size: 'mid' },
          { label: 'cómic · sandman tomo I', tag: 'edición especial', size: 'mid' },
        ].map((p, i) => (
          <div key={i} style={{
            transform: i === 0 ? 'translateY(0)' : 'translateY(40px)',
            position: 'relative',
          }}>
            <ProductPlaceholder t={t} aspect={i === 0 ? '5/7' : '2/3'} label={p.label} big={i === 0} />
            <div style={{
              position: 'absolute', top: 14, left: 14,
              padding: '5px 10px', background: t.accent, color: t.accentFg,
              fontFamily: t.mono, fontSize: 10, letterSpacing: 1.5,
              textTransform: 'uppercase', fontWeight: 600, borderRadius: 999,
            }}>{p.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Stock section — filters + grid
// ─────────────────────────────────────────────────────────────────────────

function StockSection({ t }) {
  const [cat, setCat]     = ls_useState('all');
  const [query, setQuery] = ls_useState('');
  const [set, setSet]     = ls_useState('Todas');

  const items = ls_useMemo(() => {
    return window.ALL_STOCK.filter((it) => {
      if (cat !== 'all' && it.cat !== cat) return false;
      if (set !== 'Todas' && it.cat === 'pokemon' && !it.set.includes(set.split(' ')[0])) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!(it.name + ' ' + it.set + ' ' + it.meta).toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [cat, query, set]);

  return (
    <section id="stock" style={{ padding: '96px 56px' }}>
      <SectionHead t={t}
        kicker="★ Stock destacado · actualizado hoy"
        title="Lo que tenemos ahora mismo en tienda."
        sub="Selección rotatoria. Lo bueno vuela — si ves algo aquí, pásate cuanto antes. Esto es solo una muestra; pregúntanos por lo que busques."
        right={
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: t.mono, fontSize: 11, color: t.muted,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>
            <span>mostrando {items.length}/{window.ALL_STOCK.length}</span>
          </div>
        } />
      <FiltersBar t={t} cat={cat} setCat={setCat} query={query} setQuery={setQuery} set={set} setSet={setSet} />
      <div style={{
        marginTop: 40,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
      }}>
        {items.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1', padding: '64px 0', textAlign: 'center',
            fontFamily: t.body, fontSize: 16, color: t.muted,
          }}>
            Ahora mismo no tenemos eso en stock — escríbenos y te avisamos cuando llegue.
          </div>
        ) : items.slice(0, 8).map((it) => <ProductCard key={it.id} item={it} t={t} />)}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Events section
// ─────────────────────────────────────────────────────────────────────────

function EventsSection({ t, accentDate = false }) {
  return (
    <section id="events" style={{
      padding: '96px 56px',
      background: t.eventsBg || 'transparent',
      borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`,
    }}>
      <SectionHead t={t}
        kicker="★ próximos eventos"
        title="Pásate también a jugar y hacer comunidad."
        sub="Torneos Pokémon cada sábado, ligas para peques, prereleases y club de manga. La inscripción se hace en tienda o por WhatsApp."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {window.EVENTS.map((ev, i) => (
          <EventCard key={ev.id} ev={ev} t={t} variant={accentDate && i === 0 ? 'gold' : 'default'} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Visit section
// ─────────────────────────────────────────────────────────────────────────

function VisitSection({ t }) {
  return (
    <section id="visit" style={{ padding: '96px 56px' }}>
      <SectionHead t={t}
        kicker="★ cómo visitarnos"
        title="Aquí estamos. Pásate cuando quieras."
        sub="A dos minutos del metro Indautxu. Si nos avisas qué vienes a ver, te lo tenemos sacado."
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56, alignItems: 'start' }}>
        <MapPlaceholder t={t} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <VisitBlock t={t} title="Dirección" rows={window.VISIT.address.map((a) => [a])} />
          <VisitBlock t={t} title="Horario"
            rows={window.VISIT.hours.map(([d, h]) => [d, h])} />
          <VisitBlock t={t} title="Contacto"
            rows={[[window.VISIT.phone], [window.VISIT.email], window.VISIT.socials]} />
        </div>
      </div>
    </section>
  );
}

function VisitBlock({ t, title, rows }) {
  return (
    <div>
      <div style={{
        fontFamily: t.mono, fontSize: 11, color: t.muted,
        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14,
        paddingBottom: 14, borderBottom: `1px solid ${t.line}`,
      }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((cols, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', gap: 24,
            fontFamily: t.body, fontSize: 15, color: t.fg,
          }}>
            {cols.map((c, j) => (
              <span key={j} style={{ color: j === 0 ? t.fg : t.muted }}>{c}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Landing composition — pass `variant` to choose hero treatment
// ─────────────────────────────────────────────────────────────────────────

function Landing({ theme, variant }) {
  const t = theme;
  const Hero =
    variant === 'azul' ? HeroAzulDaruma :
    variant === 'vitrina' ? HeroVitrina :
    HeroEditorial;

  return (
    <div style={{
      background: t.bg, color: t.fg, fontFamily: t.body, minHeight: '100%',
      // Adapt: smooth scroll-snap-ish reveal handled with CSS only.
    }}>
      <Nav t={t} />
      <Hero t={t} />
      {variant !== 'azul' && variant !== 'vitrina' && (
        <section style={{
          padding: '96px 56px', borderBottom: `1px solid ${t.line}`,
        }}>
          <ChaseCard t={t} layout="split" />
        </section>
      )}
      {variant === 'azul' && (
        <section style={{ padding: '96px 56px', borderBottom: `1px solid ${t.line}` }}>
          <SectionHead t={t}
            kicker="★ filosofía Daruma"
            title="Una tienda física para una afición física."
            sub="Cartas que se tocan, sobres que se abren, partidas que se juegan en la misma mesa. Todo lo que sale aquí está físicamente en la tienda."
          />
        </section>
      )}
      <StockSection t={t} />
      <EventsSection t={t} accentDate={variant === 'azul'} />
      <VisitSection t={t} />
      <Footer t={t} />
    </div>
  );
}

Object.assign(window, { THEMES, Landing });
