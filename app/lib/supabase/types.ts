export type ProductCat = 'pokemon' | 'manga' | 'comics'
export type ProductSection = 'stock' | 'carousel' | 'hero'

export type ProductRow = {
  id: string
  name: string
  set: string
  description: string
  meta: string
  tags: string[]
  cat: ProductCat
  image_url: string
  pokemon_card_id: string
  price: string
  section: ProductSection
  created_at: string
  updated_at: string
}

export type ProductInsert = Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>
export type ProductUpdate = Partial<ProductInsert>

export type EventRow = {
  id: string
  date_day: string
  date_month: string
  date_dow: string
  time: string
  title: string
  description: string
  price: string
  badge: string
  created_at: string
  updated_at: string
}

export type EventInsert = Omit<EventRow, 'id' | 'created_at' | 'updated_at'>
export type EventUpdate = Partial<EventInsert>

export type HeroSlide = {
  set: string
  kicker: string
  kickerJp: string
  cta: string
  href: string
  imageUrl: string
}

export type LogoCarouselItem = {
  src: string
  alt: string
  w?: number
  h?: number
}

export type SiteConfig = {
  stripeItems: string[]
  heroSlides: HeroSlide[]
  logoCarousel: LogoCarouselItem[]
}

export type SiteConfigRow = {
  key: string
  value: unknown
  updated_at: string
}

export type ProfileRow = {
  id: string
  email: string
  role: 'admin' | 'user'
  display_name: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow
        Insert: ProductInsert
        Update: ProductUpdate
        Relationships: []
      }
      events: {
        Row: EventRow
        Insert: EventInsert
        Update: EventUpdate
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: Omit<ProfileRow, 'created_at'>
        Update: Partial<Omit<ProfileRow, 'id' | 'created_at'>>
        Relationships: []
      }
      site_config: {
        Row: SiteConfigRow
        Insert: Omit<SiteConfigRow, 'updated_at'>
        Update: Partial<Omit<SiteConfigRow, 'key' | 'updated_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
