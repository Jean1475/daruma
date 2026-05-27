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
const DARUMA_RED   = 'oklch(56% 0.20 27)';   // rojo daruma — para sellos y energía
const DARUMA_RED_DEEP = 'oklch(46% 0.18 25)';
const FONT_JP      = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';

const THEMES = {
  // V2 — Azul Daruma · más expresivo, energía manga
  v2: {
    mode: 'light',
    display: FONT_DISPLAY, body: FONT_BODY, mono: FONT_MONO, jp: FONT_JP,
    bg: '#f4efe6', fg: '#0e1538', muted: 'rgba(14,21,56,0.58)',
    line: 'rgba(14,21,56,0.10)',
    accent: DARUMA_BLUE, accentFg: '#f4efe6',
    secondary: DARUMA_GOLD,
    pop: DARUMA_RED, popDeep: DARUMA_RED_DEEP, popFg: '#f4efe6',
    cardBg: '#ffffff', cardBorder: 'rgba(14,21,56,0.08)', cardRadius: 4,
    chipTrack: 'rgba(14,21,56,0.05)', chipOnBg: DARUMA_BLUE, chipOnFg: '#f4efe6',
    tagBg: DARUMA_BLUE, tagFg: '#f4efe6',
    dateBg: DARUMA_BLUE, dateFg: '#f4efe6',
    badgeBg: DARUMA_GOLD, badgeFg: '#0e1538', badgeBorder: 'transparent',
    ctaBg: DARUMA_BLUE, ctaFg: '#f4efe6',
  },

};

// ─────────────────────────────────────────────────────────────────────────
// Hero · Daruma anime
// Manga-print energy con halftone, kanji watermark, líneas cinéticas y
// un sello rojo rotado. Tipografía y composición editorial — la energía
// vive en texturas y accents, no en colores chillones.
// ─────────────────────────────────────────────────────────────────────────

function HeroAzulDaruma({ t }) {
  return (
    <section style={{
      background: DARUMA_BLUE, color: '#f4efe6',
      padding: '96px 56px 112px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Halftone screentone — manga texture, muy sutil */}
      <Halftone size={10} color="rgba(244,239,230,0.07)" />
      {/* Speed lines radiando desde la carta */}
      <SpeedLines side="right" color="rgba(244,239,230,0.10)" />
      {/* Gran kanji ダルマ de fondo */}
      <KanjiWatermark char="ダルマ" size={520} color="rgba(244,239,230,0.06)"
        style={{ right: -40, top: -60 }} />

      <div style={{
        position: 'relative', display: 'grid', gridTemplateColumns: '1.35fr 1fr',
        gap: 72, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 14px', background: DARUMA_GOLD, color: '#0e1538',
              fontFamily: t.mono, fontSize: 11, fontWeight: 600,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}>★ Punto fuerte · Pokémon TCG</span>
            <span style={{
              fontFamily: t.jp, fontWeight: 700, fontSize: 18,
              color: DARUMA_GOLD, letterSpacing: 2,
            }}>ポケモン専門</span>
          </div>

          <h1 style={{
            margin: 0, fontFamily: t.display, fontSize: 108, fontWeight: 700,
            letterSpacing: -4.5, lineHeight: 0.88, color: '#f4efe6', textWrap: 'balance',
          }}>
            La tienda donde
            <br />
            <em style={{
              fontStyle: 'italic', fontWeight: 500, color: DARUMA_GOLD,
              textDecoration: 'underline', textDecorationThickness: 6,
              textDecorationColor: 'rgba(212,167,58,0.4)', textUnderlineOffset: 12,
            }}>pides el deseo</em>
            <br />
            y vienes a buscarlo.
          </h1>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 24, marginTop: 36,
          }}>
            <div style={{
              width: 3, alignSelf: 'stretch', background: DARUMA_GOLD,
              marginTop: 8, marginBottom: 8,
            }}></div>
            <p style={{
              margin: 0, fontFamily: t.body, fontSize: 19, lineHeight: 1.5,
              color: 'rgba(244,239,230,0.78)', maxWidth: 480, textWrap: 'pretty',
            }}>
              Daruma · cartas Pokémon, manga y cómics en Bilbao. Pinta el primer
              ojo cuando entras buscando esa carta. El segundo cuando la encuentras.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 44, alignItems: 'center' }}>
            <a href="#stock" style={{
              padding: '16px 26px', background: DARUMA_GOLD, color: '#0e1538',
              fontFamily: t.body, fontSize: 15, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '6px 6px 0 0 rgba(14,21,56,0.5)',
            }}>
              Ver el stock
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" /></svg>
            </a>
            <a href="#visit" style={{
              padding: '16px 26px', background: 'transparent', color: '#f4efe6',
              border: '1.5px solid rgba(244,239,230,0.35)',
              fontFamily: t.body, fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>Cómo visitarnos</a>
            <span style={{
              marginLeft: 8, fontFamily: t.mono, fontSize: 11,
              color: 'rgba(244,239,230,0.5)', letterSpacing: 1.5, textTransform: 'uppercase',
            }}>
              ⊛ abierto<br />hasta 21:00
            </span>
          </div>
        </div>

        {/* Carta del mes — con shadow stack + sello rojo */}
        <div style={{ position: 'relative' }}>
          {/* shadow card detrás */}
          <div style={{
            position: 'absolute', inset: 0, transform: 'translate(14px, 14px)',
            background: DARUMA_BLUE_DARK, border: '1.5px solid rgba(244,239,230,0.18)',
          }}></div>
          <div style={{
            position: 'relative', padding: 28,
            background: 'rgba(244,239,230,0.06)', backdropFilter: 'blur(2px)',
            border: '1.5px solid rgba(244,239,230,0.22)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 18,
            }}>
              <span style={{
                fontFamily: t.mono, fontSize: 10, color: DARUMA_GOLD,
                letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 600,
              }}>★ carta del mes · 05 / 26</span>
              <span style={{
                fontFamily: t.jp, fontSize: 13, color: 'rgba(244,239,230,0.6)',
                fontWeight: 700, letterSpacing: 2,
              }}>限定一枚</span>
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 18 }}>
              <ProductPlaceholder
                t={{ ...t, cardRadius: 0 }}
                tone="dark" aspect="5/7"
                label="charizard ex · SIR" big />
              {/* Sello rojo rotado */}
              <Stamp t={t} rotate={-8}
                style={{ position: 'absolute', top: 18, right: 18 }}>
                ★ Chase
              </Stamp>
            </div>
            <div style={{
              fontFamily: t.display, fontSize: 24, fontWeight: 700,
              color: '#f4efe6', letterSpacing: -0.4, lineHeight: 1.15,
            }}>Charizard ex · Special Illustration Rare</div>
            <div style={{
              fontFamily: t.mono, fontSize: 11, color: 'rgba(244,239,230,0.55)',
              letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 10,
              display: 'flex', gap: 14,
            }}>
              <span>obsidian flames</span>
              <span style={{ opacity: .4 }}>·</span>
              <span>199/197</span>
              <span style={{ opacity: .4 }}>·</span>
              <span style={{ color: DARUMA_GOLD }}>NM/M</span>
            </div>
          </div>
        </div>
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
    <section id="stock" style={{ padding: '112px 56px 96px', position: 'relative' }}>
      {/* gran kanji 物 (cosa/objeto) en watermark detrás del head */}
      <KanjiWatermark char="物" size={420}
        color="rgba(14,21,56,0.04)"
        style={{ right: 24, top: -40 }} />
      <SectionHead t={t}
        kicker="★ Stock destacado · 商品 · actualizado hoy"
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
      {items.length === 0 ? (
        <div style={{
          marginTop: 40, padding: '64px 0', textAlign: 'center',
          fontFamily: t.body, fontSize: 16, color: t.muted,
        }}>
          Ahora mismo no tenemos eso en stock — escríbenos y te avisamos cuando llegue.
        </div>
      ) : (
        <MangaPanelGrid items={items.slice(0, 8)} t={t} />
      )}
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
// Landing composition · Daruma azul
// ─────────────────────────────────────────────────────────────────────────

function Landing({ theme, marqueeSpeed = 60, marqueeVisible = true }) {
  const t = theme;
  return (
    <div style={{
      background: t.bg, color: t.fg, fontFamily: t.body, minHeight: '100%',
    }}>
      <OpenStripe t={t} />
      <Nav t={t} />
      <HeroAzulDaruma t={t} />
      {marqueeVisible && <LogoMarquee t={t} speed={marqueeSpeed} />}
      <FeaturedCarousel t={t} />
      <PhilosophySection t={t} />
      <StockSection t={t} />
      <EventsSection t={t} accentDate />
      <VisitSection t={t} />
      <Footer t={t} />
    </div>
  );
}

Object.assign(window, { THEMES, Landing });
