'use server'

import { headers } from 'next/headers'
import { createClient } from '@/app/lib/supabase/server'

export async function forgotPassword(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Introduce tu email.' }
  }

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: 'No se pudo enviar el correo. Inténtalo de nuevo.' }
  }

  return { success: true }
}
