'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'

type FormState = { error?: string; success?: boolean } | null

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT')
  )
}

export async function createEvent(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get('title') as string
  const date_day = formData.get('date_day') as string
  const date_month = formData.get('date_month') as string
  const date_dow = formData.get('date_dow') as string
  const time = formData.get('time') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const badge = formData.get('badge') as string

  if (!title || !date_day || !date_month || !time) {
    return { error: 'Titulo, dia, mes y hora son obligatorios.' }
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no esta configurado. Configura las variables de entorno en .env.local.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('events').insert({
    title,
    date_day,
    date_month,
    date_dow: date_dow || '',
    time,
    description: description || '',
    price: price || '',
    badge: badge || '',
  })

  if (error) {
    return { error: `Error al crear evento: ${error.message}` }
  }

  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function updateEvent(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get('title') as string
  const date_day = formData.get('date_day') as string
  const date_month = formData.get('date_month') as string
  const date_dow = formData.get('date_dow') as string
  const time = formData.get('time') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const badge = formData.get('badge') as string

  if (!title || !date_day || !date_month || !time) {
    return { error: 'Titulo, dia, mes y hora son obligatorios.' }
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no esta configurado. Configura las variables de entorno en .env.local.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('events')
    .update({
      title,
      date_day,
      date_month,
      date_dow: date_dow || '',
      time,
      description: description || '',
      price: price || '',
      badge: badge || '',
    })
    .eq('id', id)

  if (error) {
    return { error: `Error al actualizar evento: ${error.message}` }
  }

  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function deleteEvent(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  const supabase = await createClient()
  await supabase.from('events').delete().eq('id', id)
  revalidatePath('/dashboard/events')
}
