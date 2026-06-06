'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ConfirmDialog } from './confirm-dialog'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

export interface FilterOption {
  key: string
  label: string
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  filters,
  filterKey,
  searchKeys,
  editPath,
  deleteAction,
  newPath,
  newLabel,
}: {
  data: T[]
  columns: Column<T>[]
  filters?: FilterOption[]
  filterKey?: keyof T
  searchKeys: (keyof T)[]
  editPath: (id: string) => string
  deleteAction: (id: string) => Promise<void>
  newPath: string
  newLabel: string
}) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (activeFilter !== 'all' && filterKey && item[filterKey] !== activeFilter)
        return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        return searchKeys.some((k) =>
          String(item[k]).toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [data, activeFilter, filterKey, query, searchKeys])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await deleteAction(deleteId)
    setDeleting(false)
    setDeleteId(null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 py-5 border-t border-b border-[var(--color-daruma-ink)]/10">
        {filters && (
          <div className="flex gap-1.5 p-1 bg-[var(--color-daruma-ink)]/5 rounded-full flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-[13px] font-medium rounded-full transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)]'
                  : 'text-[var(--color-daruma-ink)]/60 hover:text-[var(--color-daruma-ink)]'
              }`}
            >
              Todo
            </button>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 text-[13px] font-medium rounded-full transition-colors ${
                  activeFilter === f.key
                    ? 'bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)]'
                    : 'text-[var(--color-daruma-ink)]/60 hover:text-[var(--color-daruma-ink)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2.5 px-[18px] py-2.5 rounded-full border border-[var(--color-daruma-ink)]/10 bg-white flex-1 max-w-xs">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-daruma-ink)]/40 shrink-0">
            <circle cx="6" cy="6" r="4.5" />
            <path d="M9.5 9.5L12.5 12.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="busca carta, set, autor..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-[var(--color-daruma-ink)] placeholder:text-[var(--color-daruma-ink)]/30"
          />
        </div>

        <div className="sm:ml-auto flex items-center gap-3">
          <span
            className="text-[11px] text-[var(--color-daruma-ink)]/40 uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            mostrando {filtered.length}/{data.length}
          </span>
          <Link
            href={newPath}
            className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity"
          >
            + {newLabel}
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-daruma-ink)]/8">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left px-4 py-3 text-[10px] font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/40"
                    style={{ fontFamily: 'var(--font-mono), monospace' }}
                  >
                    {col.label}
                  </th>
                ))}
                <th
                  className="text-right px-4 py-3 text-[10px] font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/40"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-12 text-center text-sm text-[var(--color-daruma-ink)]/40"
                  >
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--color-daruma-ink)]/5 last:border-b-0 hover:bg-[var(--color-daruma-ink)]/[0.02] transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-[var(--color-daruma-ink)]"
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={editPath(item.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded border border-[var(--color-daruma-ink)]/10 text-[var(--color-daruma-ink)]/70 hover:border-[var(--color-daruma-blue)]/30 hover:text-[var(--color-daruma-blue)] transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded border border-[var(--color-daruma-red)]/15 text-[var(--color-daruma-red)]/70 hover:bg-[var(--color-daruma-red)]/5 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Eliminar registro"
        message="Esta accion no se puede deshacer. El registro se eliminara permanentemente."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        pending={deleting}
      />
    </div>
  )
}
