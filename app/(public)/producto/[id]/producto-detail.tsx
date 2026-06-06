'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductRow } from '@/app/lib/supabase/types';

// ─── Paleta ────────────────────────────────────────────────────────────────
const BLUE  = 'oklch(38% 0.16 263)';
const GOLD  = 'oklch(78% 0.13 88)';
const RED   = 'oklch(56% 0.20 27)';
const CREAM = '#f4efe6';
const INK   = '#0e1538';
const MUTED = 'rgba(14,21,56,0.52)';
const LINE  = 'rgba(14,21,56,0.10)';
const CARD_BD = 'rgba(14,21,56,0.08)';

const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';
const FJ = 'var(--font-jp),"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';

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

function tagColors(tag: string) {
  if (tag === 'Chase' || tag === 'Alt Art') return { bg: GOLD, fg: INK };
  if (tag === 'Nuevo' || tag === 'Promo') return { bg: RED, fg: CREAM };
  return { bg: BLUE, fg: CREAM };
}

function primaryTagColors(tags: string[] | undefined) {
  const t = tags ?? [];
  return tagColors(t.find(x => x === 'Chase' || x === 'Alt Art') ?? t.find(x => x === 'Nuevo' || x === 'Promo') ?? t[0] ?? '');
}

function catLabel(cat: string) {
  if (cat === 'pokemon') return 'Pokémon TCG';
  if (cat === 'manga') return 'Manga';
  if (cat === 'comics') return 'Cómics';
  return cat;
}

// ─── Mini product card for related section ─────────────────────────────────
function RelatedCard({ item }: { item: ProductRow }) {
  const [hovered, setHovered] = useState(false);
  const { bg, fg } = primaryTagColors(item.tags);

  return (
    <Link
      href={`/producto/${item.id}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', flexDirection: 'column',
          background: 'white', border: `1px solid ${hovered ? INK : CARD_BD}`,
          borderRadius: 4, overflow: 'hidden',
          transition: 'border-color .15s, transform .15s, box-shadow .15s',
          transform: hovered ? 'translateY(-2px)' : 'none',
          boxShadow: hovered ? '0 8px 24px rgba(14,21,56,0.10)' : 'none',
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', padding: '10px 10px 0' }}>
          <div style={{
            aspectRatio: '1/1', width: '100%', position: 'relative',
            borderRadius: 3, overflow: 'hidden',
            background: '#ece7dc',
          }}>
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                sizes="200px"
                style={{ objectFit: 'contain', padding: 6 }}
                unoptimized
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(135deg,rgba(40,30,20,0.04) 0 8px,rgba(40,30,20,0.015) 8px 16px),#ece7dc',
              }} />
            )}
          </div>
          <span style={{
            position: 'absolute', top: 16, left: 16,
            padding: '3px 7px', fontFamily: FM, fontSize: 9, letterSpacing: 0.8,
            textTransform: 'uppercase', fontWeight: 600,
            background: bg, color: fg, borderRadius: 999,
          }}>{(item.tags ?? [])[0]}</span>
        </div>

        {/* Info */}
        <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontFamily: FD, fontSize: 13, fontWeight: 600, color: INK, letterSpacing: -0.2, lineHeight: 1.25 }}>
            {item.name}
          </div>
          <div style={{ fontFamily: FB, fontSize: 11, color: MUTED }}>{item.set}</div>
          {item.price && (
            <div style={{ fontFamily: FD, fontSize: 17, fontWeight: 700, color: INK, marginTop: 4 }}>
              {item.price}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export function ProductoDetail({
  product,
  related,
}: {
  product: ProductRow;
  related: ProductRow[];
}) {
  const mobile = useMobile();
  const [contacted, setContacted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { bg: tagBg, fg: tagFg } = primaryTagColors(product.tags);
  const inStock = !!product.price;
  const isSingleCard = product.cat === 'pokemon' &&
    (product.tags ?? []).some(t => ['Chase', 'Alt Art', 'Promo', 'Holo'].includes(t));
  const cardAspect = (product.cat === 'manga' || product.cat === 'comics') ? '4/5'
    : isSingleCard ? '3/4'
    : '1/1';

  const whatsappMsg = encodeURIComponent(
    `Hola! Me interesa: ${product.name} (${product.set}) — ${product.meta}. ¿Está disponible?`
  );
  const whatsappUrl = `https://wa.me/34658483182?text=${whatsappMsg}`;

  return (
    <div style={{ background: CREAM, minHeight: '60vh' }}>

      {/* ── Breadcrumb ── */}
      <div style={{
        padding: mobile ? '14px 20px' : '14px 56px',
        borderBottom: `1px solid ${LINE}`,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.3,
      }}>
        <Link href="/" style={{ color: MUTED, textDecoration: 'none' }}>Inicio</Link>
        <span aria-hidden>›</span>
        <Link href="/#stock" style={{ color: MUTED, textDecoration: 'none' }}>Tienda</Link>
        <span aria-hidden>›</span>
        <Link href={`/buscar?cat=${product.cat}`} style={{ color: MUTED, textDecoration: 'none' }}>
          {catLabel(product.cat)}
        </Link>
        <span aria-hidden>›</span>
        <span style={{ color: INK, fontWeight: 500 }}
          className="truncate">{product.name}</span>
      </div>

      {/* ── Main product layout ── */}
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: mobile ? '32px 20px 56px' : '56px 56px 72px',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : 'auto 1fr',
        gap: mobile ? 36 : 56,
        alignItems: 'start',
      }}>

        {/* ── Left: image ── */}
        <div style={{ position: mobile ? 'static' : 'sticky', top: 88 }}>
          {/* Main image */}
          <div style={{
            position: 'relative', borderRadius: 6,
            border: `1px solid ${LINE}`,
            overflow: 'hidden',
            background: '#ece7dc',
            aspectRatio: cardAspect,
            ...(mobile ? {} : { height: '480px' }),
          }}>
            {/* Halftone texture */}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(rgba(14,21,56,0.05) 1.1px, transparent 1.4px)',
              backgroundSize: '9px 9px',
            }} />

            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 860px) 100vw, 50vw"
                style={{ objectFit: 'contain', padding: mobile ? 16 : isSingleCard ? 32 : 16, zIndex: 2 }}
                unoptimized
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(135deg,rgba(40,30,20,0.04) 0 8px,rgba(40,30,20,0.015) 8px 16px),#ece7dc',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}>
                <div aria-hidden style={{
                  fontFamily: FJ, fontSize: 120, fontWeight: 900,
                  color: 'rgba(14,21,56,0.06)', lineHeight: 1,
                }}>物</div>
              </div>
            )}

            {/* Tag badges on image */}
            <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(product.tags ?? []).map((t, i) => (
                <span key={t} style={{
                  padding: '4px 10px', fontFamily: FM, fontSize: 10, letterSpacing: 0.8,
                  textTransform: 'uppercase', fontWeight: 700,
                  background: i === 0 ? tagBg : BLUE, color: i === 0 ? tagFg : CREAM, borderRadius: 999,
                  alignSelf: 'flex-start',
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Badges below image */}
          <div style={{
            marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap',
          }}>
            {[
              { icon: '⚡', label: 'Recogida en tienda' },
              { icon: '🛡', label: 'Producto bien cuidado' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 12px', background: 'white',
                border: `1px solid ${LINE}`, borderRadius: 4,
                fontFamily: FB, fontSize: 12, color: INK,
              }}>
                <span aria-hidden style={{ fontSize: 13 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Status */}
          <div style={{ marginBottom: 18 }}>
            {inStock ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', background: 'rgba(14,21,56,0.06)',
                border: `1px solid ${LINE}`, borderRadius: 999,
                fontFamily: FM, fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', fontWeight: 600, color: INK,
              }}>
                <span className="daruma-live-dot" style={{
                  width: 6, height: 6, borderRadius: '50%', background: RED,
                  display: 'inline-block',
                }} />
                En tienda
              </span>
            ) : (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', background: 'rgba(14,21,56,0.06)',
                border: `1px solid ${LINE}`, borderRadius: 999,
                fontFamily: FM, fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', fontWeight: 600, color: MUTED,
              }}>
                Consultar disponibilidad
              </span>
            )}
          </div>

          {/* Name */}
          <h1 style={{
            margin: '0 0 12px',
            fontFamily: FD, fontSize: mobile ? 26 : 36,
            fontWeight: 700, letterSpacing: mobile ? -0.6 : -1.2,
            lineHeight: 1.05, color: INK,
          }}>
            {product.name}
          </h1>

          {/* Price */}
          {product.price && (
            <div style={{
              margin: '0 0 24px',
              fontFamily: FD, fontSize: mobile ? 32 : 44,
              fontWeight: 700, color: INK,
            }}>
              {product.price}
            </div>
          )}

          {/* Set + meta info */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: '16px 0', borderTop: `1px solid ${LINE}`,
            borderBottom: `1px solid ${LINE}`, marginBottom: 28,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.3, textTransform: 'uppercase' }}>Set</span>
              <span style={{ fontFamily: FB, fontSize: 14, color: INK, fontWeight: 500 }}>{product.set}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.3, textTransform: 'uppercase' }}>Rareza</span>
              <span style={{ fontFamily: FB, fontSize: 14, color: INK, fontWeight: 500 }}>{product.meta}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: FM, fontSize: 11, color: MUTED, letterSpacing: 0.3, textTransform: 'uppercase' }}>Categoría</span>
              <span style={{
                padding: '3px 10px', fontFamily: FM, fontSize: 11,
                background: tagBg, color: tagFg, borderRadius: 999,
                fontWeight: 600, letterSpacing: 0.5,
              }}>{catLabel(product.cat)}</span>
            </div>
          </div>

          {/* Description text */}
          <p style={{
            margin: '0 0 28px',
            fontFamily: FB, fontSize: 14, lineHeight: 1.65,
            color: MUTED, maxWidth: 460,
          }}>
            {product.cat === 'pokemon'
              ? `Carta individual de colección en perfecto estado. Guardada en sleeve y toploader. Ideal para coleccionistas y jugadores.`
              : product.cat === 'manga'
              ? `Ejemplar en perfecto estado. Edición española. Disponible para recogida directa en nuestra tienda de Leganés.`
              : `Cómic en perfecto estado. Disponible para recogida en tienda. Consulta si tienes dudas sobre el estado o edición.`
            }
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setContacted(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '15px 24px', background: INK, color: CREAM,
                fontFamily: FM, fontSize: 12, letterSpacing: 2,
                textTransform: 'uppercase', fontWeight: 700,
                textDecoration: 'none', borderRadius: 3,
                border: `2px solid ${INK}`,
                transition: 'background .15s, color .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = BLUE; e.currentTarget.style.borderColor = BLUE; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = INK; e.currentTarget.style.borderColor = INK; }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 1.41.37 2.73 1.01 3.88L0 16l4.24-1.11A7.94 7.94 0 008 16c4.42 0 8-3.58 8-8S12.42 0 8 0zm3.94 11.16c-.16.45-.94.87-1.3.92-.34.05-.77.07-1.24-.08a11.4 11.4 0 01-1.12-.42C6.56 10.9 5.3 9.45 5.2 9.32c-.1-.13-.82-1.09-.82-2.08s.52-1.48.7-1.68c.18-.2.4-.25.53-.25.13 0 .27 0 .38.01.12.01.29-.05.45.34.17.4.57 1.39.62 1.49.05.1.08.22.02.35-.07.13-.1.21-.2.32-.1.11-.2.25-.29.34-.1.1-.2.2-.09.4.11.2.5.82 1.07 1.32.73.66 1.35.86 1.54.95.2.1.31.08.43-.05.11-.13.47-.55.6-.74.12-.19.25-.16.42-.1.17.07 1.1.52 1.29.62.18.1.31.14.36.22.04.08.04.47-.12.92z"/>
              </svg>
              {contacted ? 'Mensaje enviado' : 'Consultar por WhatsApp'}
            </a>

            <Link
              href="/#stock"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '14px 24px', background: 'transparent', color: INK,
                fontFamily: FM, fontSize: 12, letterSpacing: 2,
                textTransform: 'uppercase', fontWeight: 700,
                textDecoration: 'none', borderRadius: 3,
                border: `2px solid ${LINE}`,
                transition: 'border-color .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = INK; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE; }}
            >
              Ver todo el stock
            </Link>
          </div>

          {/* Store info strip */}
          <div style={{
            marginTop: 28, padding: '14px 16px',
            background: `${BLUE}0d`, border: `1px solid ${BLUE}22`,
            borderRadius: 3,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div aria-hidden style={{ fontFamily: FJ, fontSize: 28, lineHeight: 1, flexShrink: 0, color: `${INK}40` }}>
              ダ
            </div>
            <div>
              <div style={{ fontFamily: FM, fontSize: 11, color: BLUE, fontWeight: 600, letterSpacing: 0.5, marginBottom: 2 }}>
                Solo disponible en tienda
              </div>
              <div style={{ fontFamily: FB, fontSize: 12, color: MUTED, lineHeight: 1.4 }}>
                Leganés, Madrid · Mar–Dom 10:00–14:00 / 17:00–21:00
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section style={{
          borderTop: `1px solid ${LINE}`,
          padding: mobile ? '48px 20px 64px' : '56px 56px 80px',
          background: 'white',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {/* Section header */}
            <div style={{ marginBottom: mobile ? 28 : 36 }}>
              <h2 style={{
                margin: 0, fontFamily: FD,
                fontSize: mobile ? 22 : 30,
                fontWeight: 700, letterSpacing: -0.8,
                color: INK,
              }}>
                Te podría gustar
              </h2>
              <p style={{
                margin: '8px 0 0', fontFamily: FB, fontSize: 14, color: MUTED,
              }}>
                Más {catLabel(product.cat)} en tienda
              </p>
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: mobile
                ? 'repeat(2, 1fr)'
                : `repeat(${Math.min(related.length, 5)}, 1fr)`,
              gap: mobile ? 12 : 16,
            }}>
              {related.map((item) => (
                <RelatedCard key={item.id} item={item} />
              ))}
            </div>

            {/* Browse all */}
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <Link
                href={`/buscar?cat=${product.cat}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '11px 24px', background: 'transparent',
                  border: `1.5px solid ${INK}`, color: INK,
                  fontFamily: FM, fontSize: 11, letterSpacing: 1.5,
                  textTransform: 'uppercase', fontWeight: 600,
                  textDecoration: 'none', borderRadius: 3,
                  transition: 'background .15s, color .15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = INK; e.currentTarget.style.color = CREAM; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = INK; }}
              >
                Ver todo {catLabel(product.cat)}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 6h8M6.5 2l4 4-4 4"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
