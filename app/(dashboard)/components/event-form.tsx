'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { EventRow } from '@/app/lib/supabase/types'

type FormState = { error?: string; success?: boolean } | null

export function EventForm({
  event,
  action,
}: {
  event?: EventRow
  action: (state: FormState, formData: FormData) => Promise<FormState>
}) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="max-w-2xl">
      {state?.error && (
        <div className="mb-6 px-4 py-3 rounded-[var(--radius-card)] bg-[var(--color-daruma-red)]/10 border border-[var(--color-daruma-red)]/20 text-[var(--color-daruma-red)] text-sm">
          {state.error}
        </div>
      )}

      <div className="bg-white rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/8 p-6 space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Titulo
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={event?.title ?? ''}
            placeholder="Torneo Pokemon · Standard"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="date_day"
              className="block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Dia
            </label>
            <input
              id="date_day"
              name="date_day"
              type="text"
              required
              defaultValue={event?.date_day ?? ''}
              placeholder="16"
              maxLength={2}
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
            />
          </div>

          <div>
            <label
              htmlFor="date_month"
              className="block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Mes
            </label>
            <select
              id="date_month"
              name="date_month"
              required
              defaultValue={event?.date_month ?? 'ENE'}
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
            >
              {['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date_dow"
              className="block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Dia semana
            </label>
            <select
              id="date_dow"
              name="date_dow"
              required
              defaultValue={event?.date_dow ?? 'Sab'}
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
            >
              {['Lun','Mar','Mie','Jue','Vie','Sab','Dom'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="time"
              className="block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Hora
            </label>
            <input
              id="time"
              name="time"
              type="text"
              required
              defaultValue={event?.time ?? ''}
              placeholder="16:00"
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
            />
          </div>

          <div>
            <label
              htmlFor="badge"
              className="block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Badge
            </label>
            <select
              id="badge"
              name="badge"
              defaultValue={event?.badge ?? 'Pokemon'}
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
            >
              <option value="Pokemon">Pokemon</option>
              <option value="Manga">Manga</option>
              <option value="Comics">Comics</option>
              <option value="Lanzamiento">Lanzamiento</option>
              <option value="Comunidad">Comunidad</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Precio
          </label>
          <input
            id="price"
            name="price"
            type="text"
            defaultValue={event?.price ?? ''}
            placeholder="12€, Gratis..."
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold tracking-wider uppercase text-[var(--color-daruma-ink)]/50 mb-1.5"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Descripcion
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={event?.description ?? ''}
            placeholder="Descripcion del evento..."
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-2.5 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1 resize-y"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 text-sm font-semibold rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {pending
            ? 'Guardando...'
            : event
              ? 'Guardar cambios'
              : 'Crear evento'}
        </button>
        <Link
          href="/dashboard/events"
          className="px-6 py-2.5 text-sm rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/70 hover:text-[var(--color-daruma-ink)] transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
