import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getPost } from '@/app/blog/data';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} · Pokétienda Blog`, description: post.excerpt };
}

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: INK, color: CREAM, padding: '72px 56px 64px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: -10, top: -30, fontFamily: FJ, fontWeight: 900, fontSize: 360, lineHeight: 0.85, color: 'rgba(244,239,230,0.04)', pointerEvents: 'none' }}>
          {post.subtitle}
        </div>
        <div style={{ position: 'relative', maxWidth: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            <Link href="/blog" style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.45)', letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ← Blog
            </Link>
            <span style={{ color: 'rgba(244,239,230,0.2)' }}>·</span>
            <span style={{ fontFamily: FM, fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: 'uppercase' }}>{post.category}</span>
          </div>
          <h1 style={{ margin: '0 0 20px', fontFamily: FD, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, letterSpacing: -2, lineHeight: 1, color: CREAM }}>
            {post.title}
          </h1>
          <p style={{ margin: '0 0 28px', fontFamily: FB, fontSize: 18, lineHeight: 1.5, color: 'rgba(244,239,230,0.65)' }}>
            {post.excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.4)', letterSpacing: 1 }}>{post.date}</span>
            <span style={{ width: 3, height: 3, background: 'rgba(244,239,230,0.2)', borderRadius: '50%' }} />
            <span style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.4)', letterSpacing: 1 }}>{post.readTime} de lectura</span>
          </div>
        </div>
      </section>

      {/* ── Article body ── */}
      <section style={{ padding: '64px 56px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 680 }}>
          <style>{`
            .daruma-post-body h2 {
              font-family: ${FD};
              font-size: clamp(22px,3vw,28px);
              font-weight: 700;
              letter-spacing: -0.6px;
              line-height: 1.1;
              color: ${INK};
              margin: 40px 0 16px;
            }
            .daruma-post-body p {
              font-family: ${FB};
              font-size: 17px;
              line-height: 1.7;
              color: ${MUTED};
              margin: 0 0 20px;
              max-width: 65ch;
            }
            .daruma-post-body h2 + p { margin-top: 0; }
          `}</style>
          <div
            className="daruma-post-body"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
          {/* Tags */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${LINE}`, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {post.tags.map((t) => (
              <span key={t} style={{ padding: '5px 12px', background: 'rgba(14,21,56,0.05)', fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.5, textTransform: 'lowercase' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section style={{ padding: '64px 56px 88px' }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 }}>
            También en el blog
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                <article className="daruma-blog-related" style={{ background: 'white', border: `1px solid ${LINE}`, padding: '24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontFamily: FM, fontSize: 10, color: BLUE, textTransform: 'uppercase', letterSpacing: 1.5 }}>{p.category}</div>
                  <h3 style={{ margin: 0, fontFamily: FD, fontSize: 18, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.2, color: INK }}>{p.title}</h3>
                  <p style={{ margin: 0, fontFamily: FB, fontSize: 13, lineHeight: 1.55, color: MUTED }}>{p.excerpt}</p>
                  <div style={{ fontFamily: FM, fontSize: 10, color: MUTED, marginTop: 4 }}>{p.date} · {p.readTime}</div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
