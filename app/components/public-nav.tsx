'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';

const BLUE  = 'oklch(38% 0.16 263)';
const GOLD  = 'oklch(78% 0.13 88)';
const CREAM = '#f4efe6';
const INK   = '#0e1538';
const LINE  = 'rgba(14,21,56,0.10)';
const MUTED = 'rgba(14,21,56,0.55)';
const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp - 1}px)`);
    setM(mq.matches);
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [bp]);
  return m;
}

const NAV_MENUS = [
  {
    label: 'Tienda',
    items: [
      { label: 'Todo el stock',   href: '/#stock',    desc: 'Cartas, manga y cómics disponibles' },
{ label: 'Buscar carta',    href: '/buscar',    desc: 'Encuentra exactamente lo que buscas' },
    ],
  },
  {
    label: 'Eventos',
    items: [
      { label: 'Todos los eventos',  href: '/eventos',              desc: 'Torneos, prerelease y más' },
      { label: 'Torneos Pokémon',    href: '/eventos#torneos',      desc: 'Ligas semanales y campeonatos' },
      { label: 'Book Club Manga',    href: '/eventos#bookclub',     desc: 'Lecturas colectivas cada mes' },
    ],
  },
];

const NAV_LINKS = [
  { label: 'Compramos', href: '/compramos' },
  { label: 'Blog',      href: '/blog' },
];

function Wordmark({ size = 17 }: { size?: number }) {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: FD, fontWeight: 700, fontSize: size, letterSpacing: -0.5, color: INK }}>Pokétienda</span>
        <span style={{ fontFamily: FM, fontSize: size * 0.45, letterSpacing: 1.5, color: MUTED, textTransform: 'uppercase', marginTop: 4 }}>
          cartas · manga · cómics
        </span>
      </div>
    </Link>
  );
}

export function PublicNav() {
  const mobile    = useMobile();
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen]           = useState(false);
  const [activeMenu, setMenu]     = useState<string | null>(null);
  const [searchOpen, setSearch]   = useState(false);
  const [q, setQ]                 = useState('');
  const [userHref, setUserHref]   = useState('/login');
  const menuBtnRef  = useRef<HTMLButtonElement>(null);
  const dialogRef   = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);
  const leaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(async ({ data }) => {
        if (!data.user) { setUserHref('/login'); return; }
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', data.user.id).single();
        setUserHref(profile?.role === 'admin' ? '/dashboard' : '/perfil');
      });
    } catch { setUserHref('/login'); }
  }, []);

  // Focus trap — mobile menu
  useEffect(() => {
    if (!mobile || !open) return;
    const el = dialogRef.current;
    if (!el) return;
    const nodes = el.querySelectorAll<HTMLElement>('a,button,input,[tabindex]:not([tabindex="-1"])');
    nodes[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); menuBtnRef.current?.focus(); return; }
      if (e.key !== 'Tab' || !nodes.length) return;
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [mobile, open]);

  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 40); }, [searchOpen]);
  useEffect(() => { setOpen(false); setMenu(null); setSearch(false); }, [pathname]);

  const enter = (label: string) => { if (leaveTimer.current) clearTimeout(leaveTimer.current); setMenu(label); };
  const leave = () => { leaveTimer.current = setTimeout(() => setMenu(null), 130); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { router.push(`/buscar?q=${encodeURIComponent(q.trim())}`); setSearch(false); setQ(''); }
  };

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* ── Nav bar ── */}
      <nav style={mobile ? {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: `1px solid ${LINE}`,
        background: CREAM, position: 'sticky', top: 0, zIndex: 20,
        backdropFilter: 'blur(10px)',
      } : {
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        gap: 20,
        padding: '14px 56px',
        borderBottom: `1px solid ${LINE}`,
        background: CREAM, position: 'sticky', top: 0, zIndex: 20,
        backdropFilter: 'blur(10px)',
      }}>
        {/* Left: logo */}
        <Wordmark size={mobile ? 15 : 17} />

        {mobile ? (
          /* Mobile: search icon + hamburger */
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setSearch((s) => !s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: INK, display: 'flex' }}
              aria-label="Buscar">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="8" cy="8" r="5"/><path d="M12.5 12.5L16 16"/>
              </svg>
            </button>
            <button ref={menuBtnRef} onClick={() => setOpen((o) => !o)} aria-expanded={open}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
              aria-label="Menú">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  display: 'block', width: 22, height: 1.5, background: INK,
                  transition: 'transform .2s, opacity .2s',
                  transform: i === 0 && open ? 'translateY(6.5px) rotate(45deg)' : i === 2 && open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                  opacity: i === 1 && open ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        ) : (
          /* Desktop center: search bar */
          <form onSubmit={handleSearch} style={{
            display: 'flex', alignItems: 'center',
            width: 460,
            border: `1.5px solid rgba(14,21,56,0.16)`,
            borderRadius: 999,
            background: 'white',
            overflow: 'hidden',
            transition: 'border-color .15s, box-shadow .15s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(38,82,178,0.07)`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(14,21,56,0.16)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', color: MUTED, flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7" cy="7" r="4.5"/><path d="M11 11l3 3"/>
              </svg>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Busca una carta, set, autor, personaje..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: FB, fontSize: 14, color: INK, padding: '11px 0',
              }}
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Limpiar búsqueda"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: '0 14px', display: 'flex', alignItems: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 2l10 10M12 2L2 12"/>
                </svg>
              </button>
            )}
          </form>
        )}

        {/* Desktop right: nav links + user */}
        {!mobile && (
          <div style={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
            {NAV_MENUS.map((menu) => (
              <div key={menu.label} style={{ position: 'relative' }}
                onMouseEnter={() => enter(menu.label)} onMouseLeave={leave}>
                <button style={{
                  padding: '9px 15px', background: 'none', border: 'none', cursor: 'pointer',
                  color: activeMenu === menu.label ? BLUE : INK,
                  fontFamily: FB, fontSize: 14, fontWeight: 500, borderRadius: 999,
                  display: 'flex', alignItems: 'center', gap: 5, transition: 'color .15s',
                }}>
                  {menu.label}
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    style={{ transform: activeMenu === menu.label ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                    <path d="M2 3.5l3 3 3-3"/>
                  </svg>
                </button>
                {activeMenu === menu.label && (
                  <div onMouseEnter={() => enter(menu.label)} onMouseLeave={leave}
                    style={{
                      position: 'absolute', top: 'calc(100% + 6px)', left: '50%',
                      transform: 'translateX(-50%)', background: CREAM,
                      border: `1px solid ${LINE}`,
                      boxShadow: '0 16px 40px rgba(14,21,56,0.10)',
                      minWidth: 270, padding: '6px 0', zIndex: 30,
                    }}>
                    {menu.items.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMenu(null)}
                        style={{ display: 'block', padding: '11px 20px', textDecoration: 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,21,56,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                        <div style={{ fontFamily: FB, fontSize: 14, fontWeight: 500, color: INK }}>{item.label}</div>
                        <div style={{ fontFamily: FB, fontSize: 12, color: MUTED, marginTop: 2 }}>{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {NAV_LINKS.map((l) => (
              <Link key={l.label} href={l.href} style={{
                padding: '9px 15px', textDecoration: 'none',
                color: isActive(l.href) ? BLUE : INK,
                fontFamily: FB, fontSize: 14, fontWeight: 500, borderRadius: 999,
              }}>{l.label}</Link>
            ))}

            <div style={{ width: 1, height: 16, background: LINE, margin: '0 6px' }} />

            <Link href="/perfil" aria-label="Mi perfil"
              style={{ textDecoration: 'none', display: 'flex', padding: '9px 11px', color: isActive('/perfil') ? BLUE : MUTED, borderRadius: 999 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="8" cy="5.5" r="3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/>
              </svg>
            </Link>

            <span style={{
              marginLeft: 6, padding: '6px 12px', background: GOLD, color: INK,
              fontFamily: FM, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
              borderRadius: 999, whiteSpace: 'nowrap',
            }}>solo en tienda</span>
            <Link href="/login" style={{
              marginLeft: 2, padding: '6px 12px', background: BLUE, color: CREAM,
              fontFamily: FM, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
              borderRadius: 999, whiteSpace: 'nowrap', textDecoration: 'none',
            }}>admin</Link>
          </div>
        )}
      </nav>

      {/* ── Search bar (mobile) ── */}
      {searchOpen && mobile && (
        <div style={{ background: CREAM, borderBottom: `1px solid ${LINE}`, padding: '10px 20px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              style={{ flex: 1, background: 'white', border: `1px solid ${LINE}`, padding: '9px 14px', outline: 'none', fontFamily: FB, fontSize: 14, color: INK }} />
            <button type="submit" style={{ padding: '9px 16px', background: BLUE, color: CREAM, border: 'none', cursor: 'pointer', fontFamily: FM, fontSize: 11 }}>→</button>
          </form>
        </div>
      )}

      {/* ── Mobile full-screen menu ── */}
      {mobile && open && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Menú de navegación"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 30,
            background: 'rgba(244,239,230,0.97)',
            display: 'flex', flexDirection: 'column',
            paddingTop: 80, paddingInline: 24, overflowY: 'auto',
          }}>
          {NAV_MENUS.map((menu) => (
            <div key={menu.label} style={{ marginBottom: 8 }}>
              <div style={{ padding: '16px 0 6px', fontFamily: FM, fontSize: 10, color: BLUE, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                {menu.label}
              </div>
              {menu.items.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
                  display: 'block', padding: '12px 0', textDecoration: 'none', color: INK,
                  fontFamily: FD, fontSize: 22, fontWeight: 600, letterSpacing: -0.4,
                  borderBottom: `1px solid ${LINE}`,
                }}>{item.label}</Link>
              ))}
            </div>
          ))}
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '18px 0', textDecoration: 'none', color: INK,
              fontFamily: FD, fontSize: 28, fontWeight: 600, letterSpacing: -0.5,
              borderBottom: `1px solid ${LINE}`,
            }}>{l.label}</Link>
          ))}
          <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap', paddingBottom: 40 }}>
            <Link href="/perfil" onClick={() => setOpen(false)} style={{
              padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(14,21,56,0.06)', color: INK, borderRadius: 999,
              fontFamily: FM, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none',
            }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="8" cy="5.5" r="3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/>
              </svg>
              Mi perfil
            </Link>
            <span style={{ padding: '10px 16px', background: GOLD, color: INK, borderRadius: 999, fontFamily: FM, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
              solo en tienda
            </span>
            <Link href="/login" onClick={() => setOpen(false)} style={{
              padding: '10px 16px', background: BLUE, color: CREAM, borderRadius: 999,
              fontFamily: FM, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none',
            }}>admin</Link>
          </div>
        </div>
      )}
    </>
  );
}
