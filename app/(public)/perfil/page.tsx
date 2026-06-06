import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi perfil · Pokétienda',
};

const BLUE  = 'oklch(38% 0.16 263)';
const GOLD  = 'oklch(78% 0.13 88)';
const RED   = 'oklch(56% 0.20 27)';
const CREAM = '#f4efe6';
const INK   = '#0e1538';
const LINE  = 'rgba(14,21,56,0.10)';
const MUTED = 'rgba(14,21,56,0.55)';
const FD = 'var(--font-display),"Helvetica Neue",system-ui,sans-serif';
const FB = 'var(--font-sans),"Helvetica Neue",system-ui,sans-serif';
const FM = 'var(--font-mono),ui-monospace,"SF Mono",monospace';
const FJ = 'var(--font-jp),"Hiragino Kaku Gothic ProN","Yu Gothic",sans-serif';

export default async function PerfilPage() {
  let user = null;
  let profile = null;

  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect('/login');
    user = authUser;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    profile = data;
  } catch {
    redirect('/login');
  }

  const displayName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'Usuario';
  const isAdmin = profile?.role === 'admin';
  const memberSince = new Date(user?.created_at ?? '').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <>
      {/* ── Header ── */}
      <section style={{ background: BLUE, color: CREAM, padding: '72px 56px 64px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: -10, top: -40, fontFamily: FJ, fontWeight: 900, fontSize: 360, lineHeight: 0.85, color: 'rgba(244,239,230,0.04)', pointerEvents: 'none' }}>
          会員
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: FM, fontSize: 11, color: GOLD, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 20 }}>
            ★ Mi perfil · 会員
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: 72, height: 72, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: FD, fontSize: 28, fontWeight: 700, color: INK }}>
                {displayName[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 style={{ margin: 0, fontFamily: FD, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, letterSpacing: -1.5, lineHeight: 1, color: CREAM }}>
                {displayName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.55)', letterSpacing: 1 }}>
                  {user?.email}
                </span>
                {isAdmin && (
                  <span style={{ padding: '3px 10px', background: GOLD, color: INK, fontFamily: FM, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                    Admin
                  </span>
                )}
                <span style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.35)', letterSpacing: 1 }}>
                  Desde {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section style={{ padding: '64px 56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, borderBottom: `1px solid ${LINE}` }}>

        {/* Info card */}
        <div style={{ background: 'white', border: `1px solid ${LINE}`, padding: '28px' }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: BLUE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Datos de cuenta</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Email', value: user?.email ?? '—' },
              { label: 'Nombre', value: displayName },
              { label: 'Rol', value: profile?.role ?? 'usuario' },
            ].map(({ label, value }) => (
              <div key={label} style={{ borderBottom: `1px solid ${LINE}`, paddingBottom: 14 }}>
                <div style={{ fontFamily: FM, fontSize: 10, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: FB, fontSize: 15, color: INK, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: 'white', border: `1px solid ${LINE}`, padding: '28px' }}>
          <div style={{ fontFamily: FM, fontSize: 10, color: BLUE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Acciones rápidas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/#stock" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: `1px solid ${LINE}`, textDecoration: 'none', color: INK }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="3" width="12" height="10" rx="1"/><path d="M5 7h6M5 10h4"/>
              </svg>
              <span style={{ fontFamily: FB, fontSize: 14, fontWeight: 500 }}>Ver stock completo</span>
            </Link>
            <Link href="/eventos" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: `1px solid ${LINE}`, textDecoration: 'none', color: INK }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="3" width="12" height="11" rx="1"/><path d="M5 1v4M11 1v4M2 7h12"/>
              </svg>
              <span style={{ fontFamily: FB, fontSize: 14, fontWeight: 500 }}>Próximos eventos</span>
            </Link>
            <Link href="/compramos" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: `1px solid ${LINE}`, textDecoration: 'none', color: INK }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 3h10l-1.5 7H4.5L3 3z"/><circle cx="6" cy="13" r="1"/><circle cx="11" cy="13" r="1"/>
              </svg>
              <span style={{ fontFamily: FB, fontSize: 14, fontWeight: 500 }}>Vender mi colección</span>
            </Link>
            {isAdmin && (
              <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', textDecoration: 'none', color: INK }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
                  <rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/>
                </svg>
                <span style={{ fontFamily: FB, fontSize: 14, fontWeight: 500, color: GOLD }}>Panel de administración</span>
              </Link>
            )}
          </div>
        </div>

        {/* Membership card */}
        <div style={{ background: INK, padding: '28px', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', right: -8, bottom: -16, fontFamily: FJ, fontWeight: 900, fontSize: 120, color: 'rgba(244,239,230,0.05)', lineHeight: 1 }}>
            会員
          </div>
          <div style={{ fontFamily: FM, fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
            Miembro Daruma
          </div>
          <div style={{ fontFamily: FD, fontSize: 32, fontWeight: 700, letterSpacing: -1, color: CREAM, marginBottom: 8 }}>{displayName}</div>
          <div style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.4)', letterSpacing: 1, marginBottom: 24 }}>
            {isAdmin ? 'Administrador' : 'Miembro'} · desde {memberSince}
          </div>
          <div style={{ fontFamily: FM, fontSize: 11, color: 'rgba(244,239,230,0.3)', letterSpacing: 1.5 }}>
            ダルマ専門店 · Leganés, Madrid
          </div>
        </div>
      </section>

      {/* ── Logout ── */}
      <section style={{ padding: '48px 56px' }}>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" style={{
            padding: '12px 24px', background: 'transparent', border: `1.5px solid ${LINE}`,
            cursor: 'pointer', fontFamily: FM, fontSize: 11, letterSpacing: 1,
            textTransform: 'uppercase', color: MUTED, display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M10 8H3M6 5l-3 3 3 3"/><path d="M13 12V4"/>
            </svg>
            Cerrar sesión
          </button>
        </form>
      </section>
    </>
  );
}
