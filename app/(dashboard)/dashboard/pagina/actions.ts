'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/app/lib/supabase/server'
import type { HeroSlide, LogoCarouselItem } from '@/app/lib/supabase/types'

type FormState = { error?: string; success?: boolean } | null

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT')
  )
}

async function uploadBannerImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `banners/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return null

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export async function updateStripeItems(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no configurado. Revisa las variables de entorno.' }
  }

  const raw = formData.get('stripe_items') as string
  let items: string[]
  try {
    items = JSON.parse(raw)
    if (!Array.isArray(items)) throw new Error()
  } catch {
    return { error: 'Datos inválidos.' }
  }

  const filtered = items.map((s) => String(s).trim()).filter(Boolean)

  const supabase = await createClient()
  const { error } = await supabase
    .from('site_config')
    .upsert({ key: 'stripe_items', value: filtered })

  if (error) return { error: `Error al guardar: ${error.message}` }

  revalidatePath('/')
  return { success: true }
}

export async function updateHeroSlides(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no configurado. Revisa las variables de entorno.' }
  }

  const raw = formData.get('slides_data') as string
  let slides: HeroSlide[]
  try {
    slides = JSON.parse(raw)
    if (!Array.isArray(slides)) throw new Error()
  } catch {
    return { error: 'Datos inválidos.' }
  }

  const supabase = await createClient()

  for (let i = 0; i < slides.length; i++) {
    const file = formData.get(`slide_${i}_file`) as File | null
    if (file && file.size > 0) {
      const url = await uploadBannerImage(supabase, file)
      if (url) {
        slides[i].imageUrl = url
      } else {
        return { error: `Error al subir la imagen del slide ${i + 1}.` }
      }
    }
  }

  const { error } = await supabase
    .from('site_config')
    .upsert({ key: 'hero_slides', value: slides })

  if (error) return { error: `Error al guardar: ${error.message}` }

  revalidatePath('/')
  return { success: true }
}

export async function updateLogoCarousel(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no configurado. Revisa las variables de entorno.' }
  }

  const raw = formData.get('logo_carousel') as string
  let items: LogoCarouselItem[]
  try {
    items = JSON.parse(raw)
    if (!Array.isArray(items)) throw new Error()
  } catch {
    return { error: 'Datos inválidos.' }
  }

  const filtered = items.filter((it) => it.src?.trim() && it.alt?.trim())

  const supabase = await createClient()
  const { error } = await supabase
    .from('site_config')
    .upsert({ key: 'logo_carousel', value: filtered })

  if (error) return { error: `Error al guardar: ${error.message}` }

  revalidatePath('/')
  return { success: true }
}
