'use client'

import { useActionState } from 'react'
import { resetPassword } from './actions'

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, null)

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <h1
          className="text-2xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif' }}
        >
          Pokétienda
        </h1>
        <p
          className="text-sm tracking-widest uppercase text-[var(--color-daruma-ink)]/50"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          nueva contraseña
        </p>
      </div>

      <form action={formAction} className="w-full flex flex-col gap-4">
        {state?.error && (
          <div className="px-4 py-3 rounded-[var(--radius-card)] bg-[var(--color-daruma-red)]/10 border border-[var(--color-daruma-red)]/20 text-[var(--color-daruma-red)] text-sm">
            {state.error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium tracking-wider uppercase text-[var(--color-daruma-ink)]/60"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Nueva contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-3 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm"
            className="text-xs font-medium tracking-wider uppercase text-[var(--color-daruma-ink)]/60"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            Confirmar contraseña
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-3 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] px-5 py-3 text-sm font-semibold tracking-wide transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Guardar contraseña'}
        </button>
      </form>
    </div>
  )
}
