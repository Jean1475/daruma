// sections.jsx — shared theme-aware components for the Daruma landing.
// Each section reads its colors/borders from the `t` (theme) prop so that the
// same JSX renders three different visual directions. No external assets.

const { useState, useMemo, useRef, useEffect } = React;

// ─────────────────────────────────────────────────────────────────────────
// Placeholder · monospace "product shot" panel — your design system asks for
// this exact treatment whenever real imagery isn't available.
// ─────────────────────────────────────────────────────────────────────────
function ProductPlaceholder({ label = 'product shot', t, aspect = '3/4', big = false, tone = 'auto' }) {
  // tone: 'auto' picks the right stripe contrast for the current variant;
  // can be forced 'light' or 'dark' for placeholders that sit against an
  // accent block (where 'auto' would read wrong).
  const isDark = tone === 'dark' || (tone === 'auto' && t.mode === 'dark');
  const stripeA = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(40,30,20,0.04)';
  const stripeB = isDark ? 'rgba(255,255,255,0.015)' : 'rgba(40,30,20,0.015)';
  const txt = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(40,30,20,0.42)';
  const bg = isDark ? '#1a1517' : '#ece7dc';
  return (
    <div style={{
      aspectRatio: aspect, width: '100%',
      background: `repeating-linear-gradient(135deg, ${stripeA} 0 8px, ${stripeB} 8px 16px), ${bg}`,
      borderRadius: t.cardRadius,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: t.mono, fontSize: big ? 13 : 11, letterSpacing: 0.5,
      color: txt, textTransform: 'lowercase',
      position: 'relative', overflow: 'hidden',
    }}>
      <span style={{ padding: '4px 10px', border: `1px dashed ${txt}`, borderRadius: 999 }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Logo · uses the actual Daruma image asset
// ─────────────────────────────────────────────────────────────────────────
function DarumaMark({ size = 36 }) {
  return (
    <img src="assets/daruma-logo.png" width={size} height={size}
      alt="Daruma"
      style={{ display: 'block', borderRadius: size * 0.16, objectFit: 'cover' }} />
  );
}

function Wordmark({ t, size = 18 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <DarumaMark size={size * 1.9} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: t.display, fontWeight: 700, fontSize: size,
          letterSpacing: -0.5, color: t.fg,
        }}>daruma</span>
        <span style={{
          fontFamily: t.mono, fontSize: size * 0.45, letterSpacing: 1.5,
          color: t.muted, textTransform: 'uppercase', marginTop: 4,
        }}>cartas · manga · cómics</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Top nav — pill buttons, "no vendemos online" badge
// ─────────────────────────────────────────────────────────────────────────
function Nav({ t }) {
  const items = ['Stock', 'Eventos', 'Visítanos', 'Sobre'];
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '24px 56px', borderBottom: `1px solid ${t.line}`,
      background: t.bg, position: 'sticky', top: 0, zIndex: 10,
      backdropFilter: 'blur(8px)',
    }}>
      <Wordmark t={t} size={17} />
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {items.map((it) => (
          <a key={it} href="#" style={{
            padding: '10px 18px', textDecoration: 'none', color: t.fg,
            fontFamily: t.body, fontSize: 14, fontWeight: 500,
            borderRadius: 999, transition: 'background .15s',
          }}>{it}</a>
        ))}
        <span style={{
          marginLeft: 12, padding: '8px 14px',
          background: t.badgeBg, color: t.badgeFg,
          fontFamily: t.mono, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
          borderRadius: 999, border: `1px solid ${t.badgeBorder || 'transparent'}`,
          whiteSpace: 'nowrap',
        }}>solo en tienda · no online</span>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Filters bar — category pills + expansion select + search
// ─────────────────────────────────────────────────────────────────────────
function FiltersBar({ t, cat, setCat, query, setQuery, set, setSet }) {
  const cats = [
    { key: 'all',     label: 'Todo' },
    { key: 'pokemon', label: 'Pokémon' },
    { key: 'manga',   label: 'Manga' },
    { key: 'comics',  label: 'Cómics' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      padding: '20px 0', borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`,
    }}>
      <div style={{ display: 'flex', gap: 6, padding: 4, background: t.chipTrack, borderRadius: 999 }}>
        {cats.map((c) => {
          const on = cat === c.key;
          return (
            <button key={c.key} onClick={() => setCat(c.key)} style={{
              padding: '9px 16px', fontFamily: t.body, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer',
              borderRadius: 999,
              background: on ? t.chipOnBg : 'transparent',
              color: on ? t.chipOnFg : t.muted,
              transition: 'background .15s, color .15s',
            }}>{c.label}</button>
          );
        })}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderRadius: 999, border: `1px solid ${t.line}`,
      }}>
        <span style={{ fontFamily: t.mono, fontSize: 11, color: t.muted, textTransform: 'uppercase', letterSpacing: 1 }}>expansión</span>
        <select value={set} onChange={(e) => setSet(e.target.value)} style={{
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: t.body, fontSize: 13, color: t.fg, cursor: 'pointer',
        }}>
          {(window.POKE_SETS).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{
        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 18px', borderRadius: 999, border: `1px solid ${t.line}`,
        minWidth: 260, flex: '0 1 320px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.muted} strokeWidth="1.5">
          <circle cx="6" cy="6" r="4.5" />
          <path d="M9.5 9.5L12.5 12.5" strokeLinecap="round" />
        </svg>
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="busca carta, set, autor..."
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: t.body, fontSize: 13, color: t.fg,
          }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Product card — placeholder + name + meta + "Disponible en tienda" footer
// ─────────────────────────────────────────────────────────────────────────
function ProductCard({ item, t }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 14,
      padding: 16, background: t.cardBg, borderRadius: t.cardRadius,
      border: `1px solid ${t.cardBorder}`,
      transition: 'transform .25s, box-shadow .25s',
    }}>
      <div style={{ position: 'relative' }}>
        <ProductPlaceholder t={t} aspect={item.cat === 'pokemon' ? '5/7' : '2/3'} label={item.cat} />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          padding: '5px 10px', fontFamily: t.mono, fontSize: 10, letterSpacing: 1,
          textTransform: 'uppercase',
          background: t.tagBg, color: t.tagFg, borderRadius: 999,
        }}>{item.tag}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minHeight: 64 }}>
        <div style={{
          fontFamily: t.display, fontSize: 17, fontWeight: 600,
          color: t.fg, letterSpacing: -0.2, lineHeight: 1.2,
        }}>{item.name}</div>
        <div style={{ fontFamily: t.body, fontSize: 13, color: t.muted }}>
          {item.set}
        </div>
        <div style={{
          fontFamily: t.mono, fontSize: 11, color: t.muted,
          textTransform: 'lowercase', letterSpacing: 0.4, marginTop: 2,
        }}>{item.meta}</div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 12, borderTop: `1px dashed ${t.line}`,
      }}>
        <span style={{
          fontFamily: t.mono, fontSize: 11, color: t.pop || t.accent,
          textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 6, height: 6, background: t.pop || t.accent }}></span>
          en tienda
        </span>
        <button style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          color: t.fg, fontFamily: t.mono, fontSize: 11, letterSpacing: 1,
          textTransform: 'uppercase',
        }}>ver →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Chase / carta del mes — big hero highlight
// ─────────────────────────────────────────────────────────────────────────
function ChaseCard({ t, layout = 'split' }) {
  // layout: 'split' (img right, info left), 'stack' (img top, info below),
  // 'inverse' (info right, img left, dark)
  const info = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 460 }}>
      <span style={{
        fontFamily: t.mono, fontSize: 11, letterSpacing: 2,
        textTransform: 'uppercase', color: t.accent,
      }}>★ carta del mes · mayo 26</span>
      <h2 style={{
        fontFamily: t.display, fontSize: 56, fontWeight: 600,
        letterSpacing: -1.8, lineHeight: 0.95, margin: 0, color: t.fg,
        textWrap: 'pretty',
      }}>Charizard ex <em style={{ fontStyle: 'italic', fontWeight: 400 }}>Special Illustration Rare</em></h2>
      <p style={{
        fontFamily: t.body, fontSize: 16, lineHeight: 1.55, color: t.muted,
        margin: 0, textWrap: 'pretty',
      }}>
        De <em style={{ fontStyle: 'italic' }}>Obsidian Flames</em>. Una de esas que ves
        una vez y te quedas mirándola un rato. Solo una unidad — pásate a verla
        antes de que vuele.
      </p>
      <div style={{
        display: 'flex', gap: 16, paddingTop: 8, fontFamily: t.mono, fontSize: 12,
        color: t.muted, letterSpacing: 1, textTransform: 'uppercase',
      }}>
        <div>199/197</div>
        <div style={{ opacity: .4 }}>·</div>
        <div>PSA-pendiente</div>
        <div style={{ opacity: .4 }}>·</div>
        <div>NM/M</div>
      </div>
      <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
        <a href="#visit" style={{
          padding: '14px 22px', borderRadius: 999,
          background: t.ctaBg, color: t.ctaFg,
          fontFamily: t.body, fontSize: 14, fontWeight: 500,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>Cómo visitarnos
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2 6h8M6 2l4 4-4 4" /></svg>
        </a>
        <a href="#stock" style={{
          padding: '14px 22px', borderRadius: 999,
          background: 'transparent', color: t.fg,
          border: `1px solid ${t.line}`,
          fontFamily: t.body, fontSize: 14, fontWeight: 500, textDecoration: 'none',
        }}>Ver más cartas</a>
      </div>
    </div>
  );

  const image = (
    <div style={{ position: 'relative', flex: 1, maxWidth: 460 }}>
      <ProductPlaceholder t={t} aspect="5/7" label="charizard · obsidian flames" big />
      <div style={{
        position: 'absolute', bottom: -18, left: -18,
        padding: '12px 18px', background: t.accent, color: t.accentFg,
        borderRadius: t.cardRadius, fontFamily: t.mono, fontSize: 11,
        letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
      }}>chase ★</div>
    </div>
  );

  if (layout === 'stack') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start' }}>
        {info}{image}
      </div>
    );
  }
  if (layout === 'inverse') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        {image}{info}
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
      {info}{image}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Event card
// ─────────────────────────────────────────────────────────────────────────
function EventCard({ ev, t, variant = 'default' }) {
  return (
    <article style={{
      display: 'grid', gridTemplateColumns: '108px 1fr auto', gap: 28, alignItems: 'center',
      padding: 24, background: t.cardBg, borderRadius: t.cardRadius,
      border: `1px solid ${t.cardBorder}`,
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '14px 0', borderRadius: t.cardRadius,
        background: variant === 'gold' ? t.accent : t.dateBg,
        color: variant === 'gold' ? t.accentFg : t.dateFg,
      }}>
        <span style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', opacity: .7 }}>{ev.date.dow}</span>
        <span style={{ fontFamily: t.display, fontSize: 36, fontWeight: 600, lineHeight: 1, marginTop: 4 }}>{ev.date.d}</span>
        <span style={{ fontFamily: t.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>{ev.date.m}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{
            padding: '3px 9px', fontFamily: t.mono, fontSize: 10, letterSpacing: 1,
            textTransform: 'uppercase', background: t.tagBg, color: t.tagFg, borderRadius: 999,
          }}>{ev.badge}</span>
          <span style={{ fontFamily: t.mono, fontSize: 11, color: t.muted, letterSpacing: 0.5 }}>
            {ev.when}
          </span>
        </div>
        <h3 style={{
          margin: 0, fontFamily: t.display, fontSize: 22, fontWeight: 600,
          letterSpacing: -0.4, color: t.fg, lineHeight: 1.15,
        }}>{ev.title}</h3>
        <p style={{
          margin: 0, fontFamily: t.body, fontSize: 14, lineHeight: 1.5, color: t.muted,
          textWrap: 'pretty', maxWidth: 540,
        }}>{ev.desc}</p>
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
      }}>
        <span style={{
          fontFamily: t.display, fontSize: 20, fontWeight: 600, color: t.fg,
        }}>{ev.price}</span>
        <button style={{
          padding: '9px 16px', borderRadius: 999,
          background: 'transparent', border: `1px solid ${t.line}`, color: t.fg,
          fontFamily: t.body, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>Apúntate →</button>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Map placeholder — abstract street grid SVG, not a real map
// ─────────────────────────────────────────────────────────────────────────
function MapPlaceholder({ t }) {
  const stroke = t.mode === 'dark' ? 'rgba(255,255,255,.08)' : 'rgba(40,30,20,.10)';
  const strokeAlt = t.mode === 'dark' ? 'rgba(255,255,255,.04)' : 'rgba(40,30,20,.05)';
  const bg = t.mode === 'dark' ? '#1a1517' : '#ece7dc';
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '4/3',
      background: bg, borderRadius: t.cardRadius, overflow: 'hidden',
      border: `1px solid ${t.line}`,
    }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        {[40, 90, 140, 190, 240, 290].map((y) => (
          <line key={'h'+y} x1="0" y1={y} x2="400" y2={y} stroke={strokeAlt} strokeWidth="1" />
        ))}
        {[60, 130, 200, 270, 340].map((x) => (
          <line key={'v'+x} x1={x} y1="0" x2={x} y2="300" stroke={strokeAlt} strokeWidth="1" />
        ))}
        <path d="M0 160 L130 165 L200 110 L340 115 L400 145" fill="none" stroke={stroke} strokeWidth="3" />
        <path d="M150 0 L160 90 L155 200 L170 300" fill="none" stroke={stroke} strokeWidth="3" />
        <path d="M270 0 L280 100 L290 220 L295 300" fill="none" stroke={stroke} strokeWidth="2" />
        <rect x="60" y="50" width="50" height="35" fill={strokeAlt} />
        <rect x="220" y="170" width="40" height="45" fill={strokeAlt} />
        <rect x="320" y="200" width="35" height="40" fill={strokeAlt} />
        <circle cx="200" cy="170" r="14" fill={t.accent} />
        <circle cx="200" cy="170" r="6" fill={t.mode === 'dark' ? '#0d0a0c' : '#f8f6f1'} />
      </svg>
      <span style={{
        position: 'absolute', bottom: 16, left: 16,
        padding: '6px 12px', background: t.bg, color: t.fg,
        fontFamily: t.mono, fontSize: 11, letterSpacing: 1,
        borderRadius: 999, border: `1px solid ${t.line}`, textTransform: 'uppercase',
      }}>mapa · Bilbao centro</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer style={{
      padding: '56px 56px 40px',
      borderTop: `1px solid ${t.line}`, background: t.bg,
      display: 'flex', flexDirection: 'column', gap: 48,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60 }}>
        <div>
          <Wordmark t={t} size={22} />
          <p style={{
            marginTop: 24, fontFamily: t.body, fontSize: 14, lineHeight: 1.6,
            color: t.muted, maxWidth: 360,
          }}>
            Tienda de cartas Pokémon, manga y cómics en Bilbao. Sin tienda online —
            si lo ves aquí, está esperándote allí.
          </p>
        </div>
        <FooterCol t={t} title="Tienda" items={['Stock destacado', 'Pokémon TCG', 'Manga', 'Cómics']} />
        <FooterCol t={t} title="Comunidad" items={['Próximos eventos', 'Liga semanal', 'Discord', 'Newsletter']} />
        <FooterCol t={t} title="Contacto" items={[window.VISIT.email, window.VISIT.phone, window.VISIT.socials[0]]} />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 24, borderTop: `1px solid ${t.line}`,
        fontFamily: t.mono, fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: 'uppercase',
      }}>
        <span>© 2026 daruma · bilbao</span>
        <span>sin tienda online · solo presencial</span>
      </div>
    </footer>
  );
}

function FooterCol({ t, title, items }) {
  return (
    <div>
      <div style={{
        fontFamily: t.mono, fontSize: 11, color: t.muted,
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18,
      }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it) => (
          <li key={it} style={{ fontFamily: t.body, fontSize: 14, color: t.fg }}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Section header — title + kicker + optional right slot
// ─────────────────────────────────────────────────────────────────────────
function SectionHead({ t, kicker, title, sub, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 40, marginBottom: 40,
    }}>
      <div style={{ maxWidth: 720 }}>
        {kicker && <div style={{
          fontFamily: t.mono, fontSize: 11, color: t.accent,
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14,
        }}>{kicker}</div>}
        <h2 style={{
          margin: 0, fontFamily: t.display, fontSize: 44, fontWeight: 600,
          letterSpacing: -1.2, lineHeight: 1, color: t.fg, textWrap: 'pretty',
        }}>{title}</h2>
        {sub && <p style={{
          margin: '18px 0 0', fontFamily: t.body, fontSize: 16, lineHeight: 1.55,
          color: t.muted, maxWidth: 560, textWrap: 'pretty',
        }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LogoMarquee · carrusel automático infinito de marcas/sagas.
// Wordmarks tipográficos originales (placeholders) en gris opaco. Una sola
// fila + duplicado para loop sin saltos. Pausa al hover.
// ─────────────────────────────────────────────────────────────────────────

// Wordmark placeholders — variedad tipográfica para que el muro respire.
// Cada uno es una mini-composición SVG con texto + pequeña marca gráfica.
// El cliente puede sustituirlos por logos reales (PNG/SVG) más adelante.
function LM({ children, t }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      flexShrink: 0, padding: '0 44px',
      height: 56,
    }}>
      {children}
    </div>
  );
}

const LOGO_MARKS = [
  // 1 · sans serif compacta + diamante
  (col, t) => (
    <LM t={t}>
      <span style={{ width: 10, height: 10, background: col, transform: 'rotate(45deg)' }}></span>
      <span style={{
        fontFamily: t.display, fontSize: 26, fontWeight: 700,
        letterSpacing: -0.8, color: col,
      }}>SHŌNEN<span style={{ fontWeight: 400, fontStyle: 'italic' }}>press</span></span>
    </LM>
  ),
  // 2 · mono con barras
  (col, t) => (
    <LM t={t}>
      <span style={{
        fontFamily: t.mono, fontSize: 13, fontWeight: 600,
        letterSpacing: 4, color: col, textTransform: 'uppercase',
        padding: '6px 10px', border: `1.5px solid ${col}`,
      }}>// TCG.MUNDO</span>
    </LM>
  ),
  // 3 · serif italic grande
  (col, t) => (
    <LM t={t}>
      <span style={{
        fontFamily: t.display, fontSize: 32, fontWeight: 500,
        fontStyle: 'italic', letterSpacing: -1.2, color: col,
      }}>Akihabara &amp; Co.</span>
    </LM>
  ),
  // 4 · all caps con asterisco
  (col, t) => (
    <LM t={t}>
      <span style={{ fontFamily: t.display, fontSize: 22, color: col }}>★</span>
      <span style={{
        fontFamily: t.display, fontSize: 22, fontWeight: 700,
        letterSpacing: 4, color: col, textTransform: 'uppercase',
      }}>K A I J Ū</span>
      <span style={{ fontFamily: t.display, fontSize: 22, color: col }}>★</span>
    </LM>
  ),
  // 5 · doble línea condensada
  (col, t) => (
    <LM t={t}>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, alignItems: 'center' }}>
        <span style={{
          fontFamily: t.display, fontSize: 24, fontWeight: 700,
          letterSpacing: -0.8, color: col,
        }}>OTAKU—LAB</span>
        <span style={{
          fontFamily: t.mono, fontSize: 9, letterSpacing: 3,
          color: col, textTransform: 'uppercase', marginTop: 4, opacity: 0.7,
        }}>est · two thousand seven</span>
      </div>
    </LM>
  ),
  // 6 · circle + texto
  (col, t) => (
    <LM t={t}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: '50%', border: `2px solid ${col}`,
        fontFamily: t.display, fontSize: 14, fontWeight: 700, color: col,
      }}>R</span>
      <span style={{
        fontFamily: t.display, fontSize: 24, fontWeight: 600,
        letterSpacing: -0.4, color: col,
      }}>Ronin Comics</span>
    </LM>
  ),
  // 7 · mono punto
  (col, t) => (
    <LM t={t}>
      <span style={{
        fontFamily: t.mono, fontSize: 22, fontWeight: 500,
        letterSpacing: -0.4, color: col,
      }}>nipponika<span style={{ color: col }}>.</span></span>
    </LM>
  ),
  // 8 · display con barra superior
  (col, t) => (
    <LM t={t}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 2, background: col, width: '40%' }}></div>
        <span style={{
          fontFamily: t.display, fontSize: 22, fontWeight: 700,
          letterSpacing: 2, color: col, textTransform: 'uppercase',
        }}>HACHI · BOOKS</span>
      </div>
    </LM>
  ),
  // 9 · italic + número
  (col, t) => (
    <LM t={t}>
      <span style={{
        fontFamily: t.display, fontSize: 28, fontWeight: 500,
        fontStyle: 'italic', color: col, letterSpacing: -1,
      }}>kuroi</span>
      <span style={{
        fontFamily: t.mono, fontSize: 10, color: col,
        letterSpacing: 2, textTransform: 'uppercase', alignSelf: 'flex-end',
        paddingBottom: 4,
      }}>No.07</span>
    </LM>
  ),
  // 10 · star sandwich
  (col, t) => (
    <LM t={t}>
      <span style={{
        fontFamily: t.display, fontSize: 24, fontWeight: 800,
        letterSpacing: -0.6, color: col,
      }}>MEKA<span style={{ fontWeight: 300 }}>verse</span></span>
    </LM>
  ),
  // 11 · brackets mono
  (col, t) => (
    <LM t={t}>
      <span style={{
        fontFamily: t.mono, fontSize: 14, fontWeight: 600,
        letterSpacing: 2, color: col, textTransform: 'uppercase',
      }}>[ chibi · co ]</span>
    </LM>
  ),
  // 12 · display tall
  (col, t) => (
    <LM t={t}>
      <span style={{
        fontFamily: t.display, fontSize: 30, fontWeight: 600,
        letterSpacing: -1.4, color: col, lineHeight: 1,
      }}>九 Kyū<span style={{ fontStyle: 'italic', fontWeight: 400 }}>cards</span></span>
    </LM>
  ),
  // 13 · enclosed
  (col, t) => (
    <LM t={t}>
      <span style={{
        padding: '6px 14px', borderRadius: 999, border: `1.5px solid ${col}`,
        fontFamily: t.display, fontSize: 18, fontWeight: 700, color: col,
        letterSpacing: 2, textTransform: 'uppercase',
      }}>YŪREI</span>
    </LM>
  ),
  // 14 · serif + plus
  (col, t) => (
    <LM t={t}>
      <span style={{
        fontFamily: t.display, fontSize: 24, fontWeight: 600,
        fontStyle: 'italic', color: col,
      }}>tokyo</span>
      <span style={{
        fontFamily: t.display, fontSize: 24, fontWeight: 700, color: col,
      }}>+plus</span>
    </LM>
  ),
];

function LogoMarquee({ t, speed = 60 }) {
  // speed: seconds for one full loop. Higher = slower.
  // Color: gris opaco/muted — sobre crema queda como un susurro de marcas.
  const ink = 'rgba(14,21,56,0.32)';

  const row = (key) => (
    <div key={key} style={{
      display: 'flex', alignItems: 'center', flexShrink: 0,
    }}>
      {LOGO_MARKS.map((Mark, i) => (
        <React.Fragment key={i}>{Mark(ink, t)}</React.Fragment>
      ))}
    </div>
  );

  return (
    <section aria-label="Marcas y editoriales que tenemos en tienda"
      style={{
        padding: '40px 0',
        background: t.bg,
        borderBottom: `1px solid ${t.line}`,
        position: 'relative', overflow: 'hidden',
      }}>
      <style>{`
        @keyframes daruma-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .daruma-marquee-track {
          display: flex; width: max-content;
          animation: daruma-marquee ${speed}s linear infinite;
        }
        .daruma-marquee:hover .daruma-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .daruma-marquee-track { animation: none; }
        }
      `}</style>
      <div style={{
        position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
        zIndex: 2, padding: '6px 12px', borderRadius: 999,
        background: t.bg, border: `1px solid ${t.line}`,
        fontFamily: t.mono, fontSize: 10, letterSpacing: 2,
        textTransform: 'uppercase', color: t.muted, whiteSpace: 'nowrap',
      }}>★ traemos</div>
      <div className="daruma-marquee" style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
        maskImage:       'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
      }}>
        <div className="daruma-marquee-track">
          {row('a')}
          {row('b')}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Manga / anime · texturas, watermarks, sellos, líneas cinéticas
// Cuatro primitivas pequeñas que dan a la landing su acento gráfico sin
// pasarse: halftone screentone, kanji watermarks, sellos rotados estilo
// pegatina de tienda japonesa, y líneas de velocidad detrás de la carta.
// ─────────────────────────────────────────────────────────────────────────

function Halftone({ size = 10, color = 'rgba(14,21,56,0.06)', style = {} }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `radial-gradient(${color} 1.1px, transparent 1.4px)`,
      backgroundSize: `${size}px ${size}px`,
      ...style,
    }}></div>
  );
}

function KanjiWatermark({ char, size = 480, color = 'rgba(244,239,230,0.06)', style = {} }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', fontFamily: '"Noto Sans JP", sans-serif',
      fontWeight: 900, fontSize: size, lineHeight: 0.85,
      color, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
      ...style,
    }}>{char}</div>
  );
}

function SpeedLines({ side = 'right', color = 'rgba(244,239,230,0.10)' }) {
  // Líneas que radian desde un lado, estilo manga panel.
  const x = side === 'right' ? 1200 : 0;
  const dir = side === 'right' ? -1 : 1;
  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
      }}>
      {[...Array(14)].map((_, i) => {
        const angle = -50 + i * 7.5;
        const rad = (angle * Math.PI) / 180;
        const r = 2200;
        return (
          <line key={i}
            x1={x} y1={350}
            x2={x + Math.cos(rad) * r * dir}
            y2={350 + Math.sin(rad) * r}
            stroke={color}
            strokeWidth={i % 3 === 0 ? 2 : 1} />
        );
      })}
    </svg>
  );
}

// Sello rotado estilo pegatina de tienda japonesa.
function Stamp({ children, t, rotate = -6, tone = 'red', size = 'md', style = {} }) {
  const px = size === 'sm' ? { padding: '5px 10px', fontSize: 10 } :
             size === 'lg' ? { padding: '10px 18px', fontSize: 13 } :
                             { padding: '7px 13px', fontSize: 11 };
  const bg = tone === 'gold' ? 'oklch(78% 0.13 88)' :
             tone === 'navy' ? '#0e1538' :
                               'oklch(56% 0.20 27)';      // rojo daruma
  const fg = tone === 'gold' ? '#0e1538' : '#f4efe6';
  return (
    <span style={{
      display: 'inline-block', transform: `rotate(${rotate}deg)`,
      background: bg, color: fg,
      fontFamily: t.mono, fontWeight: 700,
      letterSpacing: 2, textTransform: 'uppercase',
      outline: `2px solid ${fg}`,
      outlineOffset: '-5px',
      whiteSpace: 'nowrap',
      ...px, ...style,
    }}>{children}</span>
  );
}

// Banda "abierto ahora" — marquee fino con anuncios de la tienda.
function OpenStripe({ t }) {
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
      background: 'oklch(78% 0.13 88)', color: '#0e1538',
      borderBottom: '1.5px solid #0e1538',
      position: 'relative', overflow: 'hidden',
      fontFamily: t.mono, fontSize: 11, fontWeight: 600,
      letterSpacing: 1.5, textTransform: 'uppercase',
    }}>
      <style>{`
        @keyframes daruma-open-stripe {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .daruma-open-stripe { animation: daruma-open-stripe 38s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .daruma-open-stripe { animation: none; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
        <div className="daruma-open-stripe" style={{
          display: 'flex', alignItems: 'center', width: 'max-content',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {ribbon}{ribbon}
          </div>
        </div>
      </div>
      {/* Hatched endcaps - construction tape vibe */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 56,
        background: `repeating-linear-gradient(135deg, #0e1538 0 6px, transparent 6px 14px)`,
        opacity: 0.6, pointerEvents: 'none',
      }}></div>
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, width: 56,
        background: `repeating-linear-gradient(135deg, #0e1538 0 6px, transparent 6px 14px)`,
        opacity: 0.6, pointerEvents: 'none',
      }}></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PhilosophySection · tres columnas + kanji grandes
// ─────────────────────────────────────────────────────────────────────────

function PhilosophySection({ t }) {
  const blocks = [
    {
      char: '触',  sub: 'TOCAR',
      title: 'Cartas que se tocan.',
      body: 'Aquí abres el sobre tú. Las graduadas se miran en mano. El plástico solo cuando ya es tuya.',
    },
    {
      char: '集',  sub: 'COLECCIONAR',
      title: 'Catálogo seleccionado.',
      body: 'No traemos todo — traemos lo bueno. Pokémon TCG, manga al día, cómic clásico y moderno.',
    },
    {
      char: '集会', sub: 'COMUNIDAD',
      title: 'Liga, club, tertulia.',
      body: 'Torneos cada sábado, club de manga, prereleases. Si juegas o lees, esto también es tu casa.',
    },
  ];
  return (
    <section style={{
      position: 'relative', padding: '112px 56px',
      borderBottom: `1px solid ${t.line}`, overflow: 'hidden',
    }}>
      <Halftone size={14} color="rgba(14,21,56,0.04)" />
      <SectionHead t={t}
        kicker="★ filosofía · 心得"
        title="Una tienda física para una afición física."
        sub="Cartas que se tocan, sobres que se abren, partidas que se juegan en la misma mesa. Todo lo que sale aquí está físicamente en la tienda — no vendemos online."
      />
      <div style={{
        position: 'relative', display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 8,
      }}>
        {blocks.map((b, i) => (
          <div key={i} style={{
            position: 'relative', padding: '36px 28px 32px',
            background: t.cardBg, border: `1px solid ${t.cardBorder}`,
            overflow: 'hidden',
          }}>
            <span aria-hidden style={{
              position: 'absolute', right: -14, bottom: -40,
              fontFamily: t.jp, fontWeight: 900, fontSize: 200, lineHeight: 0.8,
              color: 'rgba(14,21,56,0.05)', pointerEvents: 'none',
            }}>{b.char}</span>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 22,
              fontFamily: t.mono, fontSize: 11, color: t.accent,
              letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
            }}>
              <span style={{
                fontFamily: t.jp, fontSize: 28, fontWeight: 900,
                color: t.accent, lineHeight: 1,
              }}>{b.char}</span>
              <span>· {b.sub} · 0{i+1}</span>
            </div>
            <h3 style={{
              margin: 0, fontFamily: t.display, fontSize: 28, fontWeight: 700,
              letterSpacing: -0.8, lineHeight: 1.1, color: t.fg,
              position: 'relative', zIndex: 1,
            }}>{b.title}</h3>
            <p style={{
              margin: '14px 0 0', fontFamily: t.body, fontSize: 15, lineHeight: 1.55,
              color: t.muted, textWrap: 'pretty', position: 'relative', zIndex: 1,
            }}>{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MangaPanelGrid · rejilla irregular tipo página de manga.
// 8 items: la primera fila tiene un panel "ancho" (carta destacada 2x ancho)
// y dos normales. Las dos filas siguientes son 4 columnas regulares.
// ─────────────────────────────────────────────────────────────────────────

function MangaPanelGrid({ items, t }) {
  if (items.length === 0) return null;
  const [hero, ...rest] = items;
  return (
    <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Fila 1: panel ancho + 3 normales */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 18 }}>
        <FeaturedPanel item={hero} t={t} />
        {rest.slice(0, 2).map((it) => <ProductCard key={it.id} item={it} t={t} />)}
      </div>
      {/* Fila 2: 5 paneles regulares */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
        {rest.slice(2, 7).map((it) => <ProductCard key={it.id} item={it} t={t} />)}
      </div>
    </div>
  );
}

function FeaturedPanel({ item, t }) {
  return (
    <article style={{
      position: 'relative', overflow: 'hidden',
      background: t.cardBg, border: `1.5px solid ${t.fg}`,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
    }}>
      <div style={{ position: 'relative', borderRight: `1.5px solid ${t.fg}` }}>
        <ProductPlaceholder t={{ ...t, cardRadius: 0 }} aspect="1/1" label={item.cat} big />
        <Stamp t={t} rotate={-8} tone="red" size="lg"
          style={{ position: 'absolute', top: 20, left: 20 }}>
          ★ Destacado
        </Stamp>
      </div>
      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: t.mono, fontSize: 10, color: t.accent,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
        }}>
          <span style={{ width: 8, height: 8, background: t.pop }}></span>
          {item.cat === 'pokemon' ? 'pokémon tcg' : item.cat === 'manga' ? 'manga' : 'cómics'}
          <span style={{ flex: 1, height: 1, background: t.line }}></span>
          <span style={{ fontFamily: t.jp, fontSize: 14, fontWeight: 700, color: t.fg }}>
            {item.cat === 'pokemon' ? '一番' : item.cat === 'manga' ? '漫画' : '本'}
          </span>
        </div>
        <h3 style={{
          margin: 0, fontFamily: t.display, fontSize: 32, fontWeight: 700,
          letterSpacing: -0.8, lineHeight: 1.05, color: t.fg, textWrap: 'pretty',
        }}>{item.name}</h3>
        <div style={{ fontFamily: t.body, fontSize: 14, color: t.muted, lineHeight: 1.5 }}>
          {item.set} · {item.meta}
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap',
          paddingTop: 14, borderTop: `1.5px dashed ${t.line}`,
        }}>
          <span style={{
            fontFamily: t.mono, fontSize: 11, color: t.pop,
            textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 7, height: 7, background: t.pop }}></span>
            última unidad
          </span>
          <a href="#visit" style={{
            padding: '10px 18px', background: t.fg, color: t.bg,
            fontFamily: t.body, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap',
          }}>Visítanos →</a>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FeaturedCarousel · scroll horizontal de cartas Pokémon destacadas.
// Snap nativo + flechas para desktop. Más editorial que el grid de stock.
// Bleed lateral derecho: la última carta se sale del padding para invitar
// a desplazar.
// ─────────────────────────────────────────────────────────────────────────
function FeaturedCarousel({ t }) {
  const trackRef = React.useRef(null);
  const items = React.useMemo(() => (window.POKEMON_STOCK || []).slice(0, 7), []);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
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

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector('[data-carousel-card]');
    const step = first ? first.getBoundingClientRect().width + 20 : 320;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section style={{
      paddingTop: 96, paddingBottom: 96, paddingLeft: 56,
      borderBottom: `1px solid ${t.line}`, position: 'relative',
      background: t.bg,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        paddingRight: 56, marginBottom: 40, gap: 40,
      }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{
            fontFamily: t.mono, fontSize: 11, color: t.accent,
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14,
          }}>★ destacadas esta semana</div>
          <h2 style={{
            margin: 0, fontFamily: t.display, fontSize: 44, fontWeight: 600,
            letterSpacing: -1.2, lineHeight: 1, color: t.fg, textWrap: 'pretty',
          }}>Lo que acaba de entrar al cajón.</h2>
          <p style={{
            margin: '18px 0 0', fontFamily: t.body, fontSize: 16, lineHeight: 1.55,
            color: t.muted, maxWidth: 540, textWrap: 'pretty',
          }}>
            Cartas recién catalogadas esta semana. Una unidad de cada — si te
            gusta alguna, pásate cuanto antes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => scrollBy(-1)} aria-label="Anterior" style={{
            width: 44, height: 44, borderRadius: 999,
            border: `1px solid ${t.line}`, background: 'transparent',
            color: t.fg, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Siguiente" style={{
            width: 44, height: 44, borderRadius: 999,
            border: 'none', background: t.accent, color: t.accentFg, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg>
          </button>
        </div>
      </div>
      <style>{`.daruma-carousel-track::-webkit-scrollbar { display: none; }`}</style>
      <div ref={trackRef} className="daruma-carousel-track" style={{
        display: 'flex', gap: 20, overflowX: 'auto', overflowY: 'visible',
        scrollSnapType: 'x mandatory', paddingBottom: 28,
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {items.map((it, i) => (
          <article key={it.id} data-carousel-card style={{
            flex: '0 0 320px', scrollSnapAlign: 'start',
            display: 'flex', flexDirection: 'column', gap: 16,
            transition: 'transform .25s',
          }}>
            <div style={{ position: 'relative', borderRadius: t.cardRadius, overflow: 'hidden' }}>
              <ProductPlaceholder t={t} aspect="5/7" label={it.name.toLowerCase()} big />
              <span style={{
                position: 'absolute', top: 14, left: 14,
                padding: '5px 10px', fontFamily: t.mono, fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', fontWeight: 600,
                background: i === 0 ? t.accent : t.tagBg,
                color:      i === 0 ? t.accentFg : t.tagFg,
                borderRadius: 999,
              }}>{i === 0 ? '★ chase' : it.tag}</span>
              <span style={{
                position: 'absolute', bottom: 14, left: 14,
                padding: '4px 8px', background: t.bg, color: t.fg,
                fontFamily: t.mono, fontSize: 9, letterSpacing: 1.5,
                textTransform: 'uppercase', borderRadius: 2,
              }}>#{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div>
              <div style={{
                fontFamily: t.display, fontSize: 19, fontWeight: 600,
                letterSpacing: -0.3, color: t.fg, lineHeight: 1.2,
              }}>{it.name}</div>
              <div style={{
                fontFamily: t.body, fontSize: 13, color: t.muted, marginTop: 4,
              }}>{it.set}</div>
              <div style={{
                fontFamily: t.mono, fontSize: 10, color: t.muted,
                letterSpacing: 0.8, textTransform: 'lowercase', marginTop: 6,
              }}>{it.meta}</div>
            </div>
          </article>
        ))}
        <div style={{ flex: '0 0 56px' }} aria-hidden></div>
      </div>

      <div style={{
        marginRight: 56, height: 2, background: t.line, borderRadius: 1,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: `${Math.max(15, progress * 100)}%`,
          background: t.accent, transition: 'width .12s linear',
        }}></div>
      </div>
    </section>
  );
}

Object.assign(window, {
  Halftone, KanjiWatermark, SpeedLines, Stamp, OpenStripe,
  PhilosophySection, MangaPanelGrid, FeaturedPanel, FeaturedCarousel,
});
