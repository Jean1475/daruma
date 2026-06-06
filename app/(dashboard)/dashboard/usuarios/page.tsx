import { createClient } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Metadata } from 'next'
import { DeleteUserButton } from './delete-button'

export const metadata: Metadata = { title: 'Usuarios · Pokétienda Admin' }

async function setRole(formData: FormData) {
  'use server'
  const id   = formData.get('id') as string
  const role = formData.get('role') as string
  const supabase = await createClient()
  await supabase.from('profiles').update({ role: role as 'admin' | 'user' }).eq('id', id)
  revalidatePath('/dashboard/usuarios')
}

async function deleteUser(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await createClient()
  await supabase.from('profiles').delete().eq('id', id)
  revalidatePath('/dashboard/usuarios')
}

export default async function UsuariosPage() {
  let users: { id: string; email: string; role: string; display_name: string | null; created_at: string }[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, email, role, display_name, created_at')
      .order('created_at', { ascending: false })
    users = data ?? []
  } catch {
    // Supabase not configured
  }

  const admins = users.filter((u) => u.role === 'admin')
  const members = users.filter((u) => u.role !== 'admin')

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono tracking-widest uppercase text-[var(--color-daruma-blue)] mb-2">
          Gestión de usuarios
        </p>
        <h1
          className="text-3xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
          style={{ fontFamily: 'var(--font-display), system-ui' }}
        >
          Usuarios registrados
        </h1>
        <p className="mt-2 text-sm text-[var(--color-daruma-ink)]/55">
          {users.length} {users.length === 1 ? 'usuario' : 'usuarios'} en total · {admins.length} administradores
        </p>
      </div>

      {users.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-daruma-ink)]/15 p-16 text-center">
          <p className="text-sm text-[var(--color-daruma-ink)]/40 font-mono">
            Sin usuarios registrados o Supabase no configurado.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[var(--color-daruma-ink)]/8 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_160px_140px_100px] gap-4 px-6 py-3 border-b border-[var(--color-daruma-ink)]/8 bg-[var(--color-daruma-off)]">
            {['Usuario', 'Rol', 'Desde', 'Acciones'].map((h) => (
              <span key={h} className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-daruma-ink)]/40">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {users.map((u) => {
            const initials = (u.display_name ?? u.email ?? '?')[0].toUpperCase()
            const since = new Date(u.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })
            const isAdmin = u.role === 'admin'

            return (
              <div
                key={u.id}
                className="grid grid-cols-[1fr_160px_140px_100px] gap-4 px-6 py-4 border-b border-[var(--color-daruma-ink)]/6 items-center last:border-0 hover:bg-[var(--color-daruma-off)]/60 transition-colors"
              >
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{
                      background: isAdmin ? 'var(--color-daruma-gold)' : 'var(--color-daruma-blue)',
                      color: isAdmin ? 'var(--color-daruma-ink)' : 'var(--color-daruma-cream)',
                      fontFamily: 'var(--font-display), system-ui',
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-sm font-semibold text-[var(--color-daruma-ink)] truncate"
                      style={{ fontFamily: 'var(--font-display), system-ui' }}
                    >
                      {u.display_name ?? '—'}
                    </div>
                    <div className="text-xs text-[var(--color-daruma-ink)]/45 font-mono truncate">{u.email}</div>
                  </div>
                </div>

                {/* Role selector */}
                <form action={setRole}>
                  <input type="hidden" name="id" value={u.id} />
                  <div className="flex gap-2 items-center">
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="text-xs font-mono border border-[var(--color-daruma-ink)]/12 rounded px-2 py-1.5 bg-white text-[var(--color-daruma-ink)] focus:outline-none focus:border-[var(--color-daruma-blue)] cursor-pointer"
                    >
                      <option value="user">usuario</option>
                      <option value="admin">admin</option>
                    </select>
                    <button
                      type="submit"
                      className="text-[10px] font-mono tracking-wide uppercase px-2 py-1.5 border border-[var(--color-daruma-ink)]/15 text-[var(--color-daruma-ink)]/50 hover:text-[var(--color-daruma-ink)] hover:border-[var(--color-daruma-ink)]/30 transition-colors rounded"
                    >
                      OK
                    </button>
                  </div>
                </form>

                {/* Since */}
                <span className="text-xs font-mono text-[var(--color-daruma-ink)]/40">{since}</span>

                {/* Delete */}
                <DeleteUserButton
                  action={deleteUser}
                  id={u.id}
                  name={u.display_name ?? u.email ?? u.id}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Stats */}
      {users.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: users.length, sub: 'registrados' },
            { label: 'Admins', value: admins.length, sub: 'con acceso total' },
            { label: 'Miembros', value: members.length, sub: 'usuarios normales' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-[var(--color-daruma-ink)]/8 px-5 py-4">
              <div className="text-[10px] font-mono tracking-widest uppercase text-[var(--color-daruma-ink)]/35 mb-1">{s.label}</div>
              <div
                className="text-3xl font-bold tracking-tight text-[var(--color-daruma-ink)]"
                style={{ fontFamily: 'var(--font-display), system-ui' }}
              >
                {s.value}
              </div>
              <div className="text-xs text-[var(--color-daruma-ink)]/40 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
