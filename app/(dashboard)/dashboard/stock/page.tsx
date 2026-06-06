import Link from 'next/link'
import { getProducts } from '@/app/lib/data-service'
import { StockTable } from './stock-table'

export default async function StockPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
            style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
          >
            Stock
          </h1>
          <p className="mt-1 text-sm text-[var(--color-daruma-ink)]/50">
            {products.length} productos en el catalogo.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/dashboard/stock/pokemon-search"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5l3.5 3.5" />
            </svg>
            Pokémon TCG
          </Link>
          <Link
            href="/dashboard/stock/manga-search"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)] hover:bg-[var(--color-daruma-ink)]/5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="3" y="1" width="7" height="14" rx="1" />
              <rect x="6" y="1" width="7" height="14" rx="1" />
            </svg>
            Manga
          </Link>
          <Link
            href="/dashboard/stock/comics-search"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)] hover:bg-[var(--color-daruma-ink)]/5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="2" y="1" width="12" height="14" rx="1" />
              <line x1="5" y1="5" x2="11" y2="5" />
              <line x1="5" y1="8" x2="11" y2="8" />
              <line x1="5" y1="11" x2="8" y2="11" />
            </svg>
            Cómics
          </Link>
        </div>
      </div>

      <StockTable data={products} />
    </div>
  )
}
