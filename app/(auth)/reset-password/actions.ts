'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

export async function resetPassword(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!password || !confirm) {
    return { error: 'Introduce y confirma tu nueva contraseña.' }
  }

  if (password !== confirm) {
    return { error: 'Las contraseñas no coinciden.' }
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'No se pudo actualizar la contraseña. El enlace puede haber expirado.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
