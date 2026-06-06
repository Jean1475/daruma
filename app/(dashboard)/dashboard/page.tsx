import Link from 'next/link'
import { getProductCounts, getEventCount } from '@/app/lib/data-service'

export default async function DashboardPage() {
  const counts = await getProductCounts()
  const eventCount = await getEventCount()

  const stats = [
    { label: 'Productos totales', value: counts.total, color: 'var(--color-daruma-blue)' },
    { label: 'Pokemon', value: counts.pokemon, color: 'var(--color-daruma-red)' },
    { label: 'Manga', value: counts.manga, color: 'var(--color-daruma-ink)' },
    { label: 'Comics', value: counts.comics, color: 'var(--color-daruma-gold)' },
    { label: 'Eventos', value: eventCount, color: 'var(--color-daruma-blue)' },
  ]

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
        >
          Panel
        </h1>
        <p className="mt-2 text-sm text-[var(--color-daruma-ink)]/50">
          Vista general del stock y eventos de Daruma.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 p-5"
          >
            <div
              className="text-[10px] font-semibold tracking-wider uppercase mb-3"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                color: stat.color,
              }}
            >
              {stat.label}
            </div>
            <div
              className="text-3xl font-bold text-[var(--color-daruma-ink)]"
              style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/stock"
          className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 p-6 hover:border-[var(--color-daruma-blue)]/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--color-daruma-ink)]">
              Gestionar stock
            </h2>
            <span className="text-[var(--color-daruma-ink)]/30 group-hover:text-[var(--color-daruma-blue)] transition-colors">
              &rarr;
            </span>
          </div>
          <p className="text-sm text-[var(--color-daruma-ink)]/50">
            Añadir, editar o eliminar productos del catalogo.
          </p>
        </Link>

        <Link
          href="/dashboard/events"
          className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 p-6 hover:border-[var(--color-daruma-blue)]/30 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--color-daruma-ink)]">
              Gestionar eventos
            </h2>
            <span className="text-[var(--color-daruma-ink)]/30 group-hover:text-[var(--color-daruma-blue)] transition-colors">
              &rarr;
            </span>
          </div>
          <p className="text-sm text-[var(--color-daruma-ink)]/50">
            Crear y editar torneos, prereleases y clubs.
          </p>
        </Link>

        <Link
          href="/dashboard/stock/new"
          className="bg-[var(--color-daruma-blue)] rounded-[var(--radius-card)] p-6 text-[var(--color-daruma-cream)] hover:opacity-90 transition-opacity"
        >
          <h2 className="font-semibold mb-1">+ Nuevo producto</h2>
          <p className="text-sm text-[var(--color-daruma-cream)]/70">
            Añadir una carta, manga o comic al stock.
          </p>
        </Link>

        <Link
          href="/dashboard/events/new"
          className="bg-[var(--color-daruma-ink)] rounded-[var(--radius-card)] p-6 text-[var(--color-daruma-cream)] hover:opacity-90 transition-opacity"
        >
          <h2 className="font-semibold mb-1">+ Nuevo evento</h2>
          <p className="text-sm text-[var(--color-daruma-cream)]/70">
            Crear un torneo, prerelease o club.
          </p>
        </Link>
      </div>
    </div>
  )
}
