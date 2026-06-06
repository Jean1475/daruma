'use client'

import { usePathname } from 'next/navigation'

const BREADCRUMBS: Record<string, string> = {
  '/dashboard': 'Panel',
  '/dashboard/stock': 'Stock',
  '/dashboard/stock/new': 'Nuevo producto',
  '/dashboard/events': 'Eventos',
  '/dashboard/events/new': 'Nuevo evento',
}

function getBreadcrumb(pathname: string): string[] {
  if (BREADCRUMBS[pathname]) return [BREADCRUMBS[pathname]]

  if (pathname.includes('/stock/') && pathname.endsWith('/edit'))
    return ['Stock', 'Editar producto']
  if (pathname.includes('/events/') && pathname.endsWith('/edit'))
    return ['Eventos', 'Editar evento']

  return ['Panel']
}

export function Header({
  displayName,
  role,
}: {
  displayName: string | null
  role: string
}) {
  const pathname = usePathname()
  const crumbs = getBreadcrumb(pathname)

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 lg:px-10 border-b border-[var(--color-daruma-ink)]/8 bg-white">
      <div className="flex items-center gap-2 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-[var(--color-daruma-ink)]/25">/</span>
            )}
            <span
              className={
                i === crumbs.length - 1
                  ? 'font-semibold text-[var(--color-daruma-ink)]'
                  : 'text-[var(--color-daruma-ink)]/50'
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span
          className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[var(--color-daruma-gold)] text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          {role}
        </span>
        {displayName && (
          <span className="text-sm text-[var(--color-daruma-ink)]/70 hidden sm:inline">
            {displayName}
          </span>
        )}
      </div>
    </header>
  )
}
