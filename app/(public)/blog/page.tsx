import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/app/blog/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog · Pokétienda',
  description: 'Análisis de sets, guías de torneo, rankings de manga y novedades de Pokétienda en Leganés.',
};

const BLUE  = 'oklch(38% 0.16 263)';
const GOLD  = 'oklch(78% 0.13 88)';
const CREAM = '#f4efe6';
const INK   = '#0e1538';
const LINE  = 'rgba(14,21,56,0.10)';
const MUTED = 'rgba(14,21,56,0.55)';
const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';
const FJ = 'var(--font-jp),"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';

const CAT_COLORS: Record<string, string> = {
  'Análisis de set': BLUE,
  'Guía': 'oklch(56% 0.20 27)',
  'Ranking': INK,
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <>
      {/* ── Header ── */}
      <section style={{ borderBottom: `1px solid ${LINE}`, padding: '72px 56px 64px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: -20, top: -40, fontFamily: FJ, fontWeight: 900, fontSize: 400, lineHeight: 0.85, color: 'rgba(14,21,56,0.04)', pointerEvents: 'none' }}>
          記事
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>
            ★ Blog · 記事
          </div>
          <h1 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, letterSpacing: -2.5, lineHeight: 0.95, color: INK, maxWidth: 640 }}>
            Análisis, guías<br />y rankings.
          </h1>
          <p style={{ margin: '20px 0 0', fontFamily: FB, fontSize: 16, lineHeight: 1.55, color: MUTED, maxWidth: 480 }}>
            Sets nuevos, torneos locales, mangas imprescindibles. Sin algoritmo, sin patrocinios.
          </p>
        </div>
      </section>

      {/* ── Featured post ── */}
      <section style={{ padding: '64px 56px 0', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>Último artículo</div>
        <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
          <article className="daruma-blog-featured" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            background: INK, overflow: 'hidden', marginBottom: 64,
          }}>
            {/* Left: decorative */}
            <div style={{ background: BLUE, padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 320, position: 'relative', overflow: 'hidden' }}>
              <div aria-hidden style={{ position: 'absolute', right: -10, bottom: -20, fontFamily: FJ, fontWeight: 900, fontSize: 200, lineHeight: 0.85, color: 'rgba(244,239,230,0.07)' }}>
                {featured.subtitle}
              </div>
              <div>
                <div style={{ fontFamily: FM, fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                  {featured.category}
                </div>
                <div style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.45)', letterSpacing: 1 }}>{featured.readTime} de lectura</div>
              </div>
              <div style={{ fontFamily: FJ, fontSize: 80, fontWeight: 900, color: 'rgba(244,239,230,0.15)', lineHeight: 1 }}>{featured.subtitle}</div>
            </div>
            {/* Right: content */}
            <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.45)', letterSpacing: 1, marginBottom: 16 }}>{featured.date}</div>
                <h2 style={{ margin: '0 0 16px', fontFamily: FD, fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.1, color: CREAM }}>
                  {featured.title}
                </h2>
                <p style={{ margin: 0, fontFamily: FB, fontSize: 15, lineHeight: 1.6, color: 'rgba(244,239,230,0.65)' }}>{featured.excerpt}</p>
              </div>
              <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: FB, fontSize: 14, fontWeight: 600, color: GOLD }}>Leer artículo</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round">
                  <path d="M2 6h8M6.5 2l4 4-4 4"/>
                </svg>
              </div>
            </div>
          </article>
        </Link>
      </section>

      {/* ── Rest of posts ── */}
      <section style={{ padding: '64px 56px 88px' }}>
        <div style={{ fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 }}>Todos los artículos</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <article className="daruma-blog-card" style={{
                background: 'white', border: `1px solid ${LINE}`,
                display: 'flex', flexDirection: 'column', height: '100%',
              }}>
                {/* Category strip */}
                <div style={{ padding: '16px 20px', background: CAT_COLORS[post.category] ?? INK, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: FM, fontSize: 10, color: CREAM, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>{post.category}</span>
                  <span style={{ fontFamily: FJ, fontSize: 14, fontWeight: 700, color: 'rgba(244,239,230,0.4)' }}>{post.categoryJp}</span>
                </div>
                {/* Content */}
                <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 1 }}>{post.date} · {post.readTime}</div>
                  <h3 style={{ margin: 0, fontFamily: FD, fontSize: 20, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.2, color: INK }}>{post.title}</h3>
                  <p style={{ margin: 0, fontFamily: FB, fontSize: 14, lineHeight: 1.55, color: MUTED, flex: 1 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {post.tags.map((t) => (
                      <span key={t} style={{ padding: '3px 8px', background: 'rgba(14,21,56,0.05)', fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 0.5, textTransform: 'lowercase' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '14px 20px', borderTop: `1px dashed ${LINE}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: BLUE }}>Leer</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round">
                    <path d="M2 6h8M6.5 2l4 4-4 4"/>
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
