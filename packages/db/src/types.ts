// AUTO-GENERATED — do not edit by hand.
// Regenerate with: pnpm db:types

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      care_homes: {
        Row: {
          id: string
          slug: string
          name: string
          location: string
          postcode: string
          phone_display: string
          phone_tracking: Json | null
          cqc_rating: string | null
          care_types: string[]
          hero_image_url: string | null
          brand: Json | null
          content: Json
          is_active: boolean
          bed_target: number
          weekly_bed_value_pennies: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          location: string
          postcode: string
          phone_display: string
          phone_tracking?: Json | null
          cqc_rating?: string | null
          care_types: string[]
          hero_image_url?: string | null
          brand?: Json | null
          content: Json
          is_active?: boolean
          bed_target?: number
          weekly_bed_value_pennies?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          location?: string
          postcode?: string
          phone_display?: string
          phone_tracking?: Json | null
          cqc_rating?: string | null
          care_types?: string[]
          hero_image_url?: string | null
          brand?: Json | null
          content?: Json
          is_active?: boolean
          bed_target?: number
          weekly_bed_value_pennies?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          care_home_id: string
          full_name: string
          email: string
          phone: string
          resident_name: string | null
          care_type: string | null
          move_in_timeframe: string | null
          message: string | null
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          notes: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          gclid: string | null
          ip_address: string | null
          user_agent: string | null
          idempotency_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          care_home_id: string
          full_name: string
          email: string
          phone: string
          resident_name?: string | null
          care_type?: string | null
          move_in_timeframe?: string | null
          message?: string | null
          status?: Database['public']['Enums']['lead_status']
          notes?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          gclid?: string | null
          ip_address?: string | null
          user_agent?: string | null
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          care_home_id?: string
          full_name?: string
          email?: string
          phone?: string
          resident_name?: string | null
          care_type?: string | null
          move_in_timeframe?: string | null
          message?: string | null
          status?: Database['public']['Enums']['lead_status']
          notes?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          gclid?: string | null
          ip_address?: string | null
          user_agent?: string | null
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leads_care_home_id_fkey'
            columns: ['care_home_id']
            referencedRelation: 'care_homes'
            referencedColumns: ['id']
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      lead_status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update']
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T]
