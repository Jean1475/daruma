'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { forgotPassword } from './actions'

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, null)

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
          recuperar contraseña
        </p>
      </div>

      {state?.success ? (
        <div className="w-full flex flex-col gap-5 items-center">
          <div className="w-full px-4 py-3 rounded-[var(--radius-card)] bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm text-center leading-relaxed">
            Revisa tu email. Te hemos enviado un enlace para restablecer tu contraseña.
          </div>
          <Link
            href="/login"
            className="text-sm text-[var(--color-daruma-blue)] hover:opacity-75 transition-opacity"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      ) : (
        <form action={formAction} className="w-full flex flex-col gap-4">
          {state?.error && (
            <div className="px-4 py-3 rounded-[var(--radius-card)] bg-[var(--color-daruma-red)]/10 border border-[var(--color-daruma-red)]/20 text-[var(--color-daruma-red)] text-sm">
              {state.error}
            </div>
          )}

          <p className="text-sm text-[var(--color-daruma-ink)]/60 text-center leading-relaxed">
            Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium tracking-wider uppercase text-[var(--color-daruma-ink)]/60"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@pokétienda.es"
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-daruma-ink)]/15 px-4 py-3 text-sm text-[var(--color-daruma-ink)] bg-white placeholder:text-[var(--color-daruma-ink)]/30 focus:outline-2 focus:outline-[var(--color-daruma-blue)] focus:outline-offset-1"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-[var(--radius-card)] bg-[var(--color-daruma-blue)] text-[var(--color-daruma-cream)] px-5 py-3 text-sm font-semibold tracking-wide transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? 'Enviando...' : 'Enviar enlace'}
          </button>

          <Link
            href="/login"
            className="text-center text-sm text-[var(--color-daruma-ink)]/50 hover:text-[var(--color-daruma-ink)]/70 transition-colors"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            ← Volver al inicio de sesión
          </Link>
        </form>
      )}
    </div>
  )
}
