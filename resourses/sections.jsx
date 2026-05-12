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
          fontFamily: t.mono, fontSize: 11, color: t.accent,
          textTransform: 'uppercase', letterSpacing: 1.2,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: t.accent }}></span>
          disponible en tienda
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

Object.assign(window, {
  ProductPlaceholder, DarumaMark, Wordmark, Nav, FiltersBar, ProductCard,
  ChaseCard, EventCard, MapPlaceholder, Footer, SectionHead,
});
