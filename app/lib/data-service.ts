import { ALL_STOCK, EVENTS } from '@/app/data'
import type { ProductRow, EventRow, HeroSlide, LogoCarouselItem, SiteConfig } from './supabase/types'

const DEFAULT_LOGO_CAROUSEL: LogoCarouselItem[] = [
  { src: 'https://assets.tcgdex.net/en/sv/sv03.5/logo.png', alt: 'Scarlet & Violet 151', w: 80, h: 60 },
  { src: 'https://assets.tcgdex.net/en/sv/sv03/logo.png', alt: 'Obsidian Flames' },
  { src: 'https://assets.tcgdex.net/en/sv/sv08/logo.png', alt: 'Surging Sparks' },
  { src: 'https://assets.tcgdex.net/en/swsh/swsh7/logo.png', alt: 'Evolving Skies' },
  { src: 'https://assets.tcgdex.net/en/sv/sv04.5/logo.png', alt: 'Paldean Fates' },
  { src: 'https://assets.tcgdex.net/en/swsh/swsh11/logo.png', alt: 'Lost Origin' },
  { src: 'https://assets.tcgdex.net/en/sv/sv06/logo.png', alt: 'Twilight Masquerade' },
  { src: 'https://assets.tcgdex.net/en/sv/sv08.5/logo.png', alt: 'Prismatic Evolutions' },
  { src: 'https://assets.tcgdex.net/en/sv/sv09/logo.png', alt: 'Journey Together' },
  { src: 'https://assets.tcgdex.net/en/sv/sv10/logo.png', alt: 'Destined Rivals' },
]

const DEFAULT_STRIPE_ITEMS: string[] = [
  'ABIERTO AHORA · MAR–DOM 10:00–14:00',
  '★ Torneo Pokémon · Sábado 16 May',
  'Nueva reposición · Obsidian Flames',
  '⊛ COMPRAMOS COLECCIONES ⊛',
  'Prerelease Phantasmal Flames · 30 May',
  'Manga book club · Berserk · 06 Jun',
  '営業中 · Leganés · Madrid',
]

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    set: 'Abyss Eye',
    kicker: 'Lo último en llegar',
    kickerJp: '最新入荷',
    cta: 'Ver stock',
    href: '#stock',
    imageUrl: '/fotos/BANNERS1_5bac1109-e710-489f-bbdf-3fec13f9d50f.webp',
  },
  {
    set: 'Chaos Rising',
    kicker: 'Nuevo set disponible',
    kickerJp: '新セット発売',
    cta: 'Ver stock',
    href: '#stock',
    imageUrl: '/fotos/BANNERS1_ee05748a-9e6e-47ff-9f32-a71771a175e2.webp',
  },
  {
    set: 'Equilibrio Perfecto',
    kicker: 'En tienda ahora',
    kickerJp: '店内在庫あり',
    cta: 'Preguntanos',
    href: '#visit',
    imageUrl: '/fotos/BANNERS1_efa8d084-c4cd-4540-9fb0-3a5c97fbb43c.webp',
  },
]

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT')
  )
}

function stockToProducts(): ProductRow[] {
  return ALL_STOCK.map((item, i) => ({
    id: item.id,
    name: item.name,
    set: item.set,
    meta: item.meta,
    tags: item.tags,
    description: '',
    cat: item.cat as ProductRow['cat'],
    image_url: item.image_url,
    pokemon_card_id: item.pokemon_card_id,
    price: item.price,
    section: (item.section ?? 'stock') as ProductRow['section'],
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date(Date.now() - i * 86400000).toISOString(),
  }))
}

function eventsToRows(): EventRow[] {
  return EVENTS.map((ev, i) => ({
    id: ev.id,
    date_day: ev.date.d,
    date_month: ev.date.m,
    date_dow: ev.date.dow,
    time: ev.when,
    title: ev.title,
    description: ev.desc,
    price: ev.price,
    badge: ev.badge,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date(Date.now() - i * 86400000).toISOString(),
  }))
}

export async function getProducts(): Promise<ProductRow[]> {
  if (!isSupabaseConfigured()) return stockToProducts()

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return stockToProducts()
  return data as ProductRow[]
}

export async function getProduct(id: string): Promise<ProductRow | null> {
  if (!isSupabaseConfigured()) {
    return stockToProducts().find((p) => p.id === id) ?? null
  }

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as ProductRow
}

export async function getEvents(): Promise<EventRow[]> {
  if (!isSupabaseConfigured()) return eventsToRows()

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return eventsToRows()
  return data as EventRow[]
}

export async function getEvent(id: string): Promise<EventRow | null> {
  if (!isSupabaseConfigured()) {
    return eventsToRows().find((e) => e.id === id) ?? null
  }

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as EventRow
}

export async function getProductCounts(): Promise<Record<string, number>> {
  const products = await getProducts()
  return {
    total: products.length,
    pokemon: products.filter((p) => p.cat === 'pokemon').length,
    manga: products.filter((p) => p.cat === 'manga').length,
    comics: products.filter((p) => p.cat === 'comics').length,
  }
}

export async function getEventCount(): Promise<number> {
  const events = await getEvents()
  return events.length
}

export async function getSiteConfig(): Promise<SiteConfig> {
  if (!isSupabaseConfigured()) {
    return { stripeItems: DEFAULT_STRIPE_ITEMS, heroSlides: DEFAULT_HERO_SLIDES, logoCarousel: DEFAULT_LOGO_CAROUSEL }
  }

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data } = await supabase.from('site_config').select('key, value')

  const config: SiteConfig = {
    stripeItems: DEFAULT_STRIPE_ITEMS,
    heroSlides: DEFAULT_HERO_SLIDES,
    logoCarousel: DEFAULT_LOGO_CAROUSEL,
  }

  if (!data) return config

  for (const row of data) {
    if (row.key === 'stripe_items' && Array.isArray(row.value)) {
      config.stripeItems = row.value as string[]
    }
    if (row.key === 'hero_slides' && Array.isArray(row.value)) {
      config.heroSlides = row.value as HeroSlide[]
    }
    if (row.key === 'logo_carousel' && Array.isArray(row.value)) {
      config.logoCarousel = row.value as LogoCarouselItem[]
    }
  }

  return config
}
