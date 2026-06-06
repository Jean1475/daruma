'use client'

import { DataTable, type Column } from '../../components/data-table'
import { deleteEvent } from './actions'
import type { EventRow } from '@/app/lib/supabase/types'

const columns: Column<EventRow>[] = [
  {
    key: 'title',
    label: 'Titulo',
    render: (item) => (
      <span className="font-medium">{item.title}</span>
    ),
  },
  {
    key: 'date',
    label: 'Fecha',
    render: (item) => (
      <span
        className="text-xs"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        {item.date_dow} {item.date_day} {item.date_month}
      </span>
    ),
  },
  {
    key: 'time',
    label: 'Hora',
    render: (item) => (
      <span style={{ fontFamily: 'var(--font-mono), monospace' }}>
        {item.time}
      </span>
    ),
  },
  {
    key: 'price',
    label: 'Precio',
    render: (item) => (
      <span
        className={`text-xs font-semibold ${
          item.price === 'Gratis'
            ? 'text-green-600'
            : 'text-[var(--color-daruma-ink)]'
        }`}
      >
        {item.price || '—'}
      </span>
    ),
  },
  {
    key: 'badge',
    label: 'Badge',
    render: (item) =>
      item.badge ? (
        <span
          className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded bg-[var(--color-daruma-gold)]/15 text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          {item.badge}
        </span>
      ) : (
        <span className="text-[var(--color-daruma-ink)]/25">—</span>
      ),
  },
]

export function EventsTable({ data }: { data: EventRow[] }) {
  return (
    <DataTable
      data={data}
      columns={columns}
      searchKeys={['title', 'description', 'badge']}
      editPath={(id) => `/dashboard/events/${id}/edit`}
      deleteAction={deleteEvent}
      newPath="/dashboard/events/new"
      newLabel="Evento"
    />
  )
}
