import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import { Sidebar } from './components/sidebar'
import { Header } from './components/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  let profile: { role: string; display_name: string | null } | null = null

  const supabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT')
  )

  try {
    if (!supabaseConfigured) throw new Error('Supabase not configured')
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', user.id)
        .single()
      profile = profileData
    }
  } catch {
    // Supabase not configured — allow access with mock data
  }

  if (user && profile && profile.role !== 'admin') {
    redirect('/login')
  }

  const email = user?.email ?? 'admin@pokétienda.es'
  const displayName = profile?.display_name ?? null
  const role = profile?.role ?? 'admin'

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--color-daruma-off)]">
      <Sidebar email={email} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header displayName={displayName} role={role} />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
