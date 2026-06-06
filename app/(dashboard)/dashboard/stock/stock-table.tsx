'use client'

import Image from 'next/image'
import { DataTable, type Column, type FilterOption } from '../../components/data-table'
import { deleteProduct } from './actions'
import type { ProductRow } from '@/app/lib/supabase/types'

const CAT_LABELS: Record<string, string> = {
  pokemon: 'Pokemon',
  manga: 'Manga',
  comics: 'Comics',
}

const columns: Column<ProductRow>[] = [
  {
    key: 'name',
    label: 'Nombre',
    render: (item) => (
      <div className="flex items-center gap-3">
        {item.image_url ? (
          <div className="relative w-8 h-11 rounded overflow-hidden bg-[var(--color-daruma-cream)] flex-shrink-0">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="32px"
              className="object-contain"
              unoptimized
            />
          </div>
        ) : null}
        <span className="font-medium">{item.name}</span>
      </div>
    ),
  },
  {
    key: 'cat',
    label: 'Categoria',
    render: (item) => (
      <span
        className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded bg-[var(--color-daruma-blue)]/10 text-[var(--color-daruma-blue)]"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        {CAT_LABELS[item.cat] || item.cat}
      </span>
    ),
  },
  { key: 'set', label: 'Set / Editorial' },
  {
    key: 'tags',
    label: 'Etiquetas',
    render: (item) =>
      item.tags?.length ? (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded bg-[var(--color-daruma-ink)]/5 text-[var(--color-daruma-ink)]/70">
              {t}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[var(--color-daruma-ink)]/25">&mdash;</span>
      ),
  },
  {
    key: 'price',
    label: 'Precio',
    render: (item) =>
      item.price ? (
        <span className="font-semibold text-[var(--color-daruma-ink)]">{item.price}</span>
      ) : (
        <span className="text-[var(--color-daruma-ink)]/25">&mdash;</span>
      ),
  },
  {
    key: 'section',
    label: 'Posición',
    render: (item) => {
      const s = item.section ?? 'stock'
      const styles = {
        hero:     'bg-amber-50 text-amber-700',
        carousel: 'bg-[var(--color-daruma-red)]/10 text-[var(--color-daruma-red)]',
        stock:    'bg-[var(--color-daruma-ink)]/5 text-[var(--color-daruma-ink)]/50',
      }
      const labels = { hero: '★ Hero', carousel: 'Carousel', stock: 'Stock' }
      return (
        <span
          className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded ${styles[s as keyof typeof styles] ?? styles.stock}`}
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          {labels[s as keyof typeof labels] ?? s}
        </span>
      )
    },
  },
]

const filters: FilterOption[] = [
  { key: 'pokemon', label: 'Pokemon' },
  { key: 'manga', label: 'Manga' },
  { key: 'comics', label: 'Comics' },
]

export function StockTable({ data }: { data: ProductRow[] }) {
  return (
    <DataTable
      data={data}
      columns={columns}
      filters={filters}
      filterKey="cat"
      searchKeys={['name', 'set', 'meta', 'tags']}
      editPath={(id) => `/dashboard/stock/${id}/edit`}
      deleteAction={deleteProduct}
      newPath="/dashboard/stock/new"
      newLabel="Producto"
    />
  )
}
