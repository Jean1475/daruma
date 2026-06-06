'use client'

import { useRef, useEffect } from 'react'

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  pending,
}: {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  pending?: boolean
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl mx-4"
      >
        <h3 className="text-lg font-semibold text-[var(--color-daruma-ink)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-daruma-ink)]/60 mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)] hover:bg-[var(--color-daruma-ink)]/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="px-4 py-2 text-sm rounded-[var(--radius-card)] bg-[var(--color-daruma-red)] text-white font-medium hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {pending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
