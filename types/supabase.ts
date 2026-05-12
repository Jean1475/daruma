export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          category: 'pokemon' | 'manga' | 'comics'
          set_name: string | null
          meta: string | null
          tag: string | null
          image_url: string | null
          available: boolean
          featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'pokemon' | 'manga' | 'comics'
          set_name?: string | null
          meta?: string | null
          tag?: string | null
          image_url?: string | null
          available?: boolean
          featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'pokemon' | 'manga' | 'comics'
          set_name?: string | null
          meta?: string | null
          tag?: string | null
          image_url?: string | null
          available?: boolean
          featured?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          starts_at: string
          title: string
          description: string
          badge: string | null
          price_text: string | null
          capacity: number | null
          created_at: string
        }
        Insert: {
          id?: string
          starts_at: string
          title: string
          description: string
          badge?: string | null
          price_text?: string | null
          capacity?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          starts_at?: string
          title?: string
          description?: string
          badge?: string | null
          price_text?: string | null
          capacity?: number | null
          created_at?: string
        }
      }
      store_info: {
        Row: {
          id: number
          address: string[] | null
          hours: Json | null
          phone: string | null
          email: string | null
          socials: string[] | null
          map_embed_url: string | null
        }
        Insert: {
          id?: number
          address?: string[] | null
          hours?: Json | null
          phone?: string | null
          email?: string | null
          socials?: string[] | null
          map_embed_url?: string | null
        }
        Update: {
          id?: number
          address?: string[] | null
          hours?: Json | null
          phone?: string | null
          email?: string | null
          socials?: string[] | null
          map_embed_url?: string | null
        }
      }
    }
  }
}
