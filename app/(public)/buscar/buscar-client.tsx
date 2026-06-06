'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/app/blog/data';
import { ProductCard } from '@/app/components/landing';
import type { Product } from '@/app/components/landing';

const BLUE  = 'oklch(38% 0.16 263)';
const GOLD  = 'oklch(78% 0.13 88)';
const RED   = 'oklch(56% 0.20 27)';
const CREAM = '#f4efe6';
const INK   = '#0e1538';
const LINE  = 'rgba(14,21,56,0.10)';
const MUTED = 'rgba(14,21,56,0.48)';
const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';
const FJ = 'var(--font-jp),"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';

function tagColor(tag: string) {
  if (tag === 'Chase' || tag === 'Alt Art') return { bg: GOLD, fg: INK };
  if (tag === 'Nuevo' || tag === 'Promo')   return { bg: RED,  fg: CREAM };
  return { bg: BLUE, fg: CREAM };
}

export interface ProductItem {
  id: string; name: string; set: string; meta: string;
  tags: string[]; cat: string; image_url?: string; price?: string;
}


const CATS = [
  { key: 'all',     label: 'Todo' },
  { key: 'pokemon', label: 'Pokémon TCG' },
  { key: 'manga',   label: 'Manga' },
  { key: 'comics',  label: 'Cómics' },
];

const SORT_OPTIONS = [
  { key: 'relevance', label: 'Relevancia' },
  { key: 'name',      label: 'Nombre A–Z' },
  { key: 'price_asc', label: 'Precio: menor primero' },
  { key: 'price_desc',label: 'Precio: mayor primero' },
];

const SUGGESTIONS = ['Charizard', 'Berserk', 'One Piece', 'Alt Art', 'Obsidian Flames'];

const CAT_COLOR: Record<string, string> = {
  'Análisis de set': BLUE,
  'Guía':           RED,
  'Ranking':        INK,
};

function useMobile(bp = 860) {
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

export function BuscarClient({
  query,
  initialCat = 'all',
  initialTags = [],
  products,
  blogPosts,
}: {
  query: string;
  initialCat?: string;
  initialTags?: string[];
  products: ProductItem[];
  blogPosts: BlogPost[];
}) {
  const mobile = useMobile();
  const [tab, setTab]         = useState<'productos' | 'blog'>('productos');
  const [cat, setCat]         = useState(initialCat);
  const [sort, setSort]       = useState('relevance');
  const [onlyPrice, setOnlyPrice] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>(initialTags);

  const filteredProducts = useMemo(() => {
    let list = cat === 'all' ? products : products.filter((p) => p.cat === cat);
    if (onlyPrice) list = list.filter((p) => !!p.price);
    if (activeTags.length > 0) list = list.filter((p) => activeTags.some(t => (p.tags ?? []).includes(t)));
    if (sort === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'price_asc')  list = [...list].sort((a, b) => parseFloat(a.price ?? '0') - parseFloat(b.price ?? '0'));
    if (sort === 'price_desc') list = [...list].sort((a, b) => parseFloat(b.price ?? '0') - parseFloat(a.price ?? '0'));
    return list;
  }, [products, cat, sort, onlyPrice, activeTags]);

  const filteredBlog = blogPosts;

  const CAT_LABEL: Record<string, string> = {
    pokemon: 'Pokémon TCG',
    manga: 'Manga',
    comics: 'Cómics',
  };

  // ─── No-query and no category: landing state ──────────────────────────────
  if (!query && initialCat === 'all' && initialTags.length === 0) {
    return (
      <div style={{ background: CREAM, minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: mobile ? '64px 24px' : '80px 56px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: mobile ? -20 : -40, top: mobile ? -20 : -40, fontFamily: FJ, fontSize: mobile ? 280 : 480, fontWeight: 900, color: 'rgba(14,21,56,0.04)', lineHeight: 0.85, pointerEvents: 'none', userSelect: 'none' }}>
          検索
        </div>
        <div style={{ position: 'relative', maxWidth: 600 }}>
          <h1 style={{ margin: '0 0 16px', fontFamily: FD, fontSize: mobile ? 36 : 56, fontWeight: 700, letterSpacing: -2.5, lineHeight: 0.95, color: INK }}>
            ¿Qué andas<br />buscando?
          </h1>
          <p style={{ margin: '0 0 40px', fontFamily: FB, fontSize: 16, lineHeight: 1.55, color: MUTED }}>
            Cartas, manga, cómics. Usa el buscador de arriba para encontrar exactamente lo que quieres.
          </p>
          <div>
            <p style={{ margin: '0 0 12px', fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: MUTED }}>
              Búsquedas frecuentes
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SUGGESTIONS.map((term) => (
                <Link key={term} href={`/buscar?q=${encodeURIComponent(term)}`}
                  style={{ padding: '9px 18px', background: 'white', border: `1px solid ${LINE}`, fontFamily: FB, fontSize: 13, color: INK, textDecoration: 'none', transition: 'border-color .15s, box-shadow .15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = INK; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE; }}>
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── With query ───────────────────────────────────────────────────────────
  return (
    <div style={{ background: CREAM }}>

      {/* ── Editorial header ── */}
      <section style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${LINE}`, padding: mobile ? '48px 24px 36px' : '56px 56px 0' }}>
        <div aria-hidden style={{ position: 'absolute', right: mobile ? -10 : -30, top: -20, fontFamily: FJ, fontSize: mobile ? 200 : 380, fontWeight: 900, color: 'rgba(14,21,56,0.04)', lineHeight: 0.85, pointerEvents: 'none', userSelect: 'none' }}>
          検索
        </div>
        <div style={{ position: 'relative' }}>
          <p style={{ margin: '0 0 10px', fontFamily: FM, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: MUTED }}>
            {query ? 'Resultados para' : 'Explorando'}
          </p>
          <h1 style={{ margin: '0 0 18px', fontFamily: FD, fontSize: mobile ? 'clamp(32px,8vw,48px)' : 'clamp(48px,6vw,80px)', fontWeight: 700, letterSpacing: -3, lineHeight: 0.92, color: INK }}>
            <em style={{ fontStyle: 'italic', color: GOLD }}>{query || CAT_LABEL[initialCat] || 'Todo'}</em>
          </h1>
          <p style={{ margin: '0 0 36px', fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.5 }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            {filteredBlog.length > 0 && (
              <span> · {filteredBlog.length} {filteredBlog.length === 1 ? 'artículo' : 'artículos'} de blog</span>
            )}
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {[
              { key: 'productos', label: 'Productos', count: filteredProducts.length },
              { key: 'blog',      label: 'Blog',      count: filteredBlog.length },
            ].map((t) => (
              <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{
                padding: '11px 22px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: FM, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                color: tab === t.key ? INK : MUTED,
                borderBottom: tab === t.key ? `2.5px solid ${INK}` : '2.5px solid transparent',
                marginBottom: -1, transition: 'color .15s',
              }}>
                {t.label}
                <span style={{ marginLeft: 7, fontFamily: FM, fontSize: 10, fontWeight: 400, opacity: tab === t.key ? 0.55 : 0.35 }}>
                  ({t.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: !mobile && tab === 'productos' ? '200px 1fr' : '1fr',
        maxWidth: 1280, margin: '0 auto',
        padding: mobile ? '0 20px 80px' : '0 56px 96px',
        gap: mobile ? 32 : 40,
        alignItems: 'start',
      }}>

        {/* Sidebar */}
        {!mobile && tab === 'productos' && (
          <aside style={{ position: 'sticky', top: 72, paddingTop: 44, overflow: 'hidden' }}>
            <div aria-hidden style={{ position: 'absolute', right: -14, bottom: 0, fontFamily: FJ, fontSize: 200, fontWeight: 900, color: 'rgba(14,21,56,0.04)', lineHeight: 0.85, pointerEvents: 'none', userSelect: 'none' }}>
              物
            </div>

            {/* Categoría */}
            <div style={{ marginBottom: 40, position: 'relative' }}>
              <p style={{ margin: '0 0 12px', fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: INK, fontWeight: 700, paddingBottom: 10, borderBottom: `1.5px solid ${INK}` }}>
                Categoría
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {CATS.map((c) => {
                  const count = c.key === 'all' ? products.length : products.filter((p) => p.cat === c.key).length;
                  const active = cat === c.key;
                  return (
                    <button key={c.key} onClick={() => setCat(c.key)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '10px 12px',
                      background: active ? INK : 'transparent',
                      color: active ? CREAM : INK,
                      border: `1.5px solid ${active ? INK : 'transparent'}`,
                      cursor: 'pointer', fontFamily: FB, fontSize: 13,
                      fontWeight: active ? 600 : 400, transition: 'all .15s',
                    }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = LINE; e.currentTarget.style.background = 'rgba(14,21,56,0.04)'; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; } }}>
                      <span>{c.label}</span>
                      <span style={{ fontFamily: FM, fontSize: 11, opacity: active ? 0.55 : 0.38 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Precio */}
            <div style={{ marginBottom: 40, position: 'relative' }}>
              <p style={{ margin: '0 0 16px', fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: INK, fontWeight: 700, paddingBottom: 10, borderBottom: `1.5px solid ${INK}` }}>
                Precio
              </p>
              <button onClick={() => setOnlyPrice((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left' }}>
                <div style={{ width: 40, height: 22, background: onlyPrice ? INK : 'rgba(14,21,56,0.12)', position: 'relative', flexShrink: 0, transition: 'background .2s' }}>
                  <div style={{ position: 'absolute', top: 4, left: onlyPrice ? 22 : 4, width: 14, height: 14, background: onlyPrice ? GOLD : 'white', transition: 'left .2s, background .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                </div>
                <span style={{ fontFamily: FB, fontSize: 13, color: INK, lineHeight: 1.4 }}>Solo con precio visible</span>
              </button>
            </div>

            {/* Tipos / filtro por etiqueta */}
            {(() => {
              const allTags = [...new Set(products.flatMap((p) => p.tags ?? []))].filter(Boolean);
              if (!allTags.length) return null;
              return (
                <div style={{ position: 'relative' }}>
                  <p style={{ margin: '0 0 12px', fontFamily: FM, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: INK, fontWeight: 700, paddingBottom: 10, borderBottom: `1.5px solid ${INK}` }}>
                    Tipo
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {allTags.map((tag) => {
                      const { bg } = tagColor(tag);
                      const count = products.filter((p) => (p.tags ?? []).includes(tag)).length;
                      const active = activeTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            width: '100%', padding: '8px 10px',
                            background: active ? INK : 'transparent',
                            color: active ? CREAM : INK,
                            border: `1.5px solid ${active ? INK : 'transparent'}`,
                            cursor: 'pointer', fontFamily: FB, fontSize: 13,
                            fontWeight: active ? 600 : 400, transition: 'all .15s', textAlign: 'left',
                          }}
                          onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = LINE; e.currentTarget.style.background = 'rgba(14,21,56,0.04)'; } }}
                          onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; } }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, background: active ? CREAM : bg, borderRadius: 2, flexShrink: 0 }} />
                            {tag}
                          </span>
                          <span style={{ fontFamily: FM, fontSize: 11, opacity: active ? 0.55 : 0.38 }}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                  {activeTags.length > 0 && (
                    <button
                      onClick={() => setActiveTags([])}
                      style={{ marginTop: 10, fontFamily: FM, fontSize: 10, color: MUTED, background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: 1, textTransform: 'uppercase' }}
                    >
                      Limpiar tipo
                    </button>
                  )}
                </div>
              );
            })()}
          </aside>
        )}

        {/* Results area */}
        <div style={{ paddingTop: 40 }}>

          {/* PRODUCTOS tab */}
          {tab === 'productos' && (
            <>
              {/* Count + Sort */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.5 }}>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 1, textTransform: 'uppercase' }}>Ordenar</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ fontFamily: FB, fontSize: 13, color: INK, background: 'white', border: `1px solid ${LINE}`, padding: '6px 10px', outline: 'none', cursor: 'pointer' }}>
                    {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div style={{ paddingTop: 40, maxWidth: 460 }}>
                  <div aria-hidden style={{ fontFamily: FJ, fontSize: 100, fontWeight: 900, color: 'rgba(14,21,56,0.06)', lineHeight: 1, marginBottom: 12 }}>探</div>
                  <h2 style={{ margin: '0 0 12px', fontFamily: FD, fontSize: 26, fontWeight: 600, letterSpacing: -0.8, color: INK }}>
                    Nada con esos filtros.
                  </h2>
                  <p style={{ margin: '0 0 24px', fontFamily: FB, fontSize: 14, lineHeight: 1.6, color: MUTED }}>
                    Prueba quitando algún filtro o búscalo directamente en tienda.
                  </p>
                  <button onClick={() => { setCat('all'); setOnlyPrice(false); setActiveTags([]); }} style={{ padding: '11px 22px', background: INK, color: CREAM, border: 'none', cursor: 'pointer', fontFamily: FB, fontSize: 14, fontWeight: 600 }}>
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: 16 }}>
                  {filteredProducts.map((item) => (
                    <ProductCard key={item.id} item={item as Product} />
                  ))}
                </div>
              )}

              {/* No results for this query (no filter applied) */}
              {filteredProducts.length === 0 && cat === 'all' && !onlyPrice && (
                <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${LINE}` }}>
                  <p style={{ fontFamily: FB, fontSize: 15, color: MUTED, margin: '0 0 16px' }}>
                    ¿No encuentras lo que buscas? Puede que lo tengamos en tienda sin publicar.
                  </p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Link href="/#visit" style={{ padding: '11px 20px', background: BLUE, color: CREAM, fontFamily: FB, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                      Visítanos →
                    </Link>
                    <Link href="/" style={{ padding: '11px 20px', background: 'transparent', border: `1px solid ${LINE}`, color: INK, fontFamily: FB, fontSize: 14, textDecoration: 'none' }}>
                      Ver todo el stock
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {/* BLOG tab */}
          {tab === 'blog' && (
            <>
              {filteredBlog.length === 0 ? (
                <div style={{ paddingTop: 40 }}>
                  <p style={{ fontFamily: FB, fontSize: 15, color: MUTED }}>
                    No hay artículos de blog que coincidan con <strong style={{ color: INK }}>«{query}»</strong>.
                  </p>
                  <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontFamily: FB, fontSize: 14, fontWeight: 600, color: BLUE, textDecoration: 'none' }}>
                    Ver todos los artículos →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
                  {filteredBlog.map((post) => {
                    const strip = CAT_COLOR[post.category] ?? INK;
                    return (
                      <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex' }}>
                        <article className="daruma-blog-card" style={{ background: 'white', border: `1px solid ${LINE}`, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
                          <div style={{ background: strip, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: FM, fontSize: 10, color: CREAM, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>{post.category}</span>
                            <span style={{ fontFamily: FM, fontSize: 10, color: 'rgba(244,239,230,0.5)' }}>{post.readTime}</span>
                          </div>
                          <div style={{ padding: '20px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <p style={{ margin: 0, fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 0.5 }}>{post.date}</p>
                            <h3 style={{ margin: 0, fontFamily: FD, fontSize: 18, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.2, color: INK }}>{post.title}</h3>
                            <p style={{ margin: 0, fontFamily: FB, fontSize: 13, lineHeight: 1.55, color: MUTED, flex: 1 }}>{post.excerpt}</p>
                          </div>
                          <div style={{ padding: '12px 18px', borderTop: `1px dashed ${LINE}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: BLUE }}>Leer</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round">
                              <path d="M2 6h8M6.5 2l4 4-4 4"/>
                            </svg>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
