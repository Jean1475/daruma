'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/server'
import type { ProductCat, ProductSection } from '@/app/lib/supabase/types'

type FormState = { error?: string; success?: boolean } | null

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT')
  )
}

async function uploadProductImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `products/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return null

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export async function createProduct(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  const cat = formData.get('cat') as ProductCat
  const tagsJson = formData.get('tags') as string
  const tags: string[] = tagsJson ? JSON.parse(tagsJson) : []
  const set = formData.get('set') as string
  const description = formData.get('description') as string
  const meta = formData.get('meta') as string
  const image_url = formData.get('image_url') as string
  const pokemon_card_id = formData.get('pokemon_card_id') as string
  const price = formData.get('price') as string
  const section = (formData.get('section') as ProductSection) || 'stock'
  const imageFile = formData.get('image_file') as File | null

  if (!name || !cat) {
    return { error: 'Nombre y categoria son obligatorios.' }
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no esta configurado. Configura las variables de entorno en .env.local.' }
  }

  const supabase = await createClient()

  let finalImageUrl = image_url
  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadProductImage(supabase, imageFile)
    if (uploadedUrl) {
      finalImageUrl = uploadedUrl
    } else {
      return { error: 'Error al subir la imagen. Inténtalo de nuevo.' }
    }
  }

  const { error } = await supabase.from('products').insert({
    name,
    cat,
    tags,
    set: set || '',
    description: description || '',
    meta: meta || '',
    image_url: finalImageUrl || '',
    pokemon_card_id: pokemon_card_id || '',
    price: price || '',
    section,
  })

  if (error) {
    return { error: `Error al crear producto: ${error.message}` }
  }

  revalidatePath('/dashboard/stock')
  revalidatePath('/')
  redirect('/dashboard/stock')
}

export async function updateProduct(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  const cat = formData.get('cat') as ProductCat
  const tagsJson = formData.get('tags') as string
  const tags: string[] = tagsJson ? JSON.parse(tagsJson) : []
  const set = formData.get('set') as string
  const description = formData.get('description') as string
  const meta = formData.get('meta') as string
  const image_url = formData.get('image_url') as string
  const pokemon_card_id = formData.get('pokemon_card_id') as string
  const price = formData.get('price') as string
  const section = (formData.get('section') as ProductSection) || 'stock'
  const imageFile = formData.get('image_file') as File | null

  if (!name || !cat) {
    return { error: 'Nombre y categoria son obligatorios.' }
  }

  if (!isSupabaseConfigured()) {
    return { error: 'Supabase no esta configurado. Configura las variables de entorno en .env.local.' }
  }

  const supabase = await createClient()

  let finalImageUrl = image_url
  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadProductImage(supabase, imageFile)
    if (uploadedUrl) {
      finalImageUrl = uploadedUrl
    } else {
      return { error: 'Error al subir la imagen. Inténtalo de nuevo.' }
    }
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      cat,
      tags,
      set: set || '',
      description: description || '',
      meta: meta || '',
      image_url: finalImageUrl || '',
      pokemon_card_id: pokemon_card_id || '',
      price: price || '',
      section,
    })
    .eq('id', id)

  if (error) {
    return { error: `Error al actualizar producto: ${error.message}` }
  }

  revalidatePath('/dashboard/stock')
  revalidatePath('/')
  redirect('/dashboard/stock')
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return

  const supabase = await createClient()
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/dashboard/stock')
  revalidatePath('/')
}
