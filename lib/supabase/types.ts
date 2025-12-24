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
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          location: string | null
          location_url: string | null
          image_url: string | null
          gallery_images: Json | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          location?: string | null
          location_url?: string | null
          image_url?: string | null
          gallery_images?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          location?: string | null
          location_url?: string | null
          image_url?: string | null
          gallery_images?: Json | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          event_id: string
          name: string
          phone: string
          entry_code: string
          qr_token: string
          has_entered: boolean
          entered_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          phone: string
          entry_code: string
          qr_token: string
          has_entered?: boolean
          entered_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          phone?: string
          entry_code?: string
          qr_token?: string
          has_entered?: boolean
          entered_at?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

