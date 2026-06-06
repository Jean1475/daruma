'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(auth)/login/actions'

const NAV = [
  {
    label: 'Panel',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="5.5" height="5.5" rx="1" />
        <rect x="10.5" y="2" width="5.5" height="5.5" rx="1" />
        <rect x="2" y="10.5" width="5.5" height="5.5" rx="1" />
        <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Stock',
    href: '/dashboard/stock',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6l7-4 7 4v7l-7 4-7-4V6z" />
        <path d="M2 6l7 4" />
        <path d="M9 10v8" />
        <path d="M16 6l-7 4" />
      </svg>
    ),
  },
  {
    label: 'Pokemon TCG',
    href: '/dashboard/stock/pokemon-search',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="5.5" />
        <path d="M12 12l4 4" />
      </svg>
    ),
  },
  {
    label: 'Eventos',
    href: '/dashboard/events',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="14" height="13" rx="1.5" />
        <path d="M2 7.5h14" />
        <path d="M6 1.5v3" />
        <path d="M12 1.5v3" />
      </svg>
    ),
  },
  {
    label: 'Página',
    href: '/dashboard/pagina',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="14" height="14" rx="1.5" />
        <path d="M2 6.5h14" />
        <path d="M6 6.5V16" />
      </svg>
    ),
  },
  {
    label: 'Usuarios',
    href: '/dashboard/usuarios',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="6" r="3" />
        <path d="M1 16c0-3.3 2.7-6 6-6" />
        <circle cx="14" cy="11" r="2.5" />
        <path d="M11.5 16c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" />
      </svg>
    ),
  },
]

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const navContent = (
    <>
      <div className="px-5 pt-6 pb-8 flex items-center gap-3">
        <div className="flex flex-col leading-none">
          <span
            className="text-base font-bold text-[var(--color-daruma-cream)] tracking-tight"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            Pokétienda
          </span>
          <span
            className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-daruma-cream)]/40 mt-1"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            admin
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)]'
                  : 'text-[var(--color-daruma-cream)]/60 hover:text-[var(--color-daruma-cream)] hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 mt-auto border-t border-white/10 pt-4">
        <div className="px-3 mb-3">
          <div
            className="text-xs text-[var(--color-daruma-cream)]/50 truncate"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            {email}
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[var(--color-daruma-cream)]/60 hover:text-[var(--color-daruma-cream)] hover:bg-white/5 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 16H4a1.5 1.5 0 01-1.5-1.5v-11A1.5 1.5 0 014 2h2.5" />
              <path d="M12 13l3.5-4L12 5" />
              <path d="M15.5 9H7" />
            </svg>
            Cerrar sesion
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-[var(--color-daruma-ink)] text-[var(--color-daruma-cream)] flex items-center justify-center"
        aria-label="Menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {mobileOpen ? (
            <>
              <path d="M5 5l10 10" />
              <path d="M15 5L5 15" />
            </>
          ) : (
            <>
              <path d="M3 5h14" />
              <path d="M3 10h14" />
              <path d="M3 15h14" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[var(--color-daruma-ink)] flex flex-col transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  )
}
