// AUTO-GENERATED — do not edit by hand.
// Regenerate with: pnpm db:types

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'converted'
  | 'lost'
  | 'tour_booked'
  | 'tour_completed'
  | 'assessed'
  | 'moved_in'

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
          status: LeadStatus
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
          contacted_at: string | null
          tour_booked_at: string | null
          tour_completed_at: string | null
          assessed_at: string | null
          moved_in_at: string | null
          lost_at: string | null
          qualified: boolean
          disqualification_reason: string | null
          weekly_fee_pennies: number | null
          assigned_to: string | null
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
          status?: LeadStatus
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
          contacted_at?: string | null
          tour_booked_at?: string | null
          tour_completed_at?: string | null
          assessed_at?: string | null
          moved_in_at?: string | null
          lost_at?: string | null
          qualified?: boolean
          disqualification_reason?: string | null
          weekly_fee_pennies?: number | null
          assigned_to?: string | null
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
          status?: LeadStatus
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
          contacted_at?: string | null
          tour_booked_at?: string | null
          tour_completed_at?: string | null
          assessed_at?: string | null
          moved_in_at?: string | null
          lost_at?: string | null
          qualified?: boolean
          disqualification_reason?: string | null
          weekly_fee_pennies?: number | null
          assigned_to?: string | null
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
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          type: string
          old_value: string | null
          new_value: string | null
          note: string | null
          performed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          type: string
          old_value?: string | null
          new_value?: string | null
          note?: string | null
          performed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          type?: string
          old_value?: string | null
          new_value?: string | null
          note?: string | null
          performed_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'lead_activities_lead_id_fkey'
            columns: ['lead_id']
            referencedRelation: 'leads'
            referencedColumns: ['id']
          }
        ]
      }
      care_home_users: {
        Row: {
          care_home_id: string
          user_id: string
          role: 'owner' | 'manager' | 'viewer'
          invited_by: string | null
          created_at: string
        }
        Insert: {
          care_home_id: string
          user_id: string
          role: 'owner' | 'manager' | 'viewer'
          invited_by?: string | null
          created_at?: string
        }
        Update: {
          care_home_id?: string
          user_id?: string
          role?: 'owner' | 'manager' | 'viewer'
          invited_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      campaign_spend: {
        Row: {
          id: string
          care_home_id: string
          date: string
          spend_pennies: number
          impressions: number | null
          clicks: number | null
          conversions: number | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          care_home_id: string
          date: string
          spend_pennies?: number
          impressions?: number | null
          clicks?: number | null
          conversions?: number | null
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          care_home_id?: string
          date?: string
          spend_pennies?: number
          impressions?: number | null
          clicks?: number | null
          conversions?: number | null
          source?: string
          created_at?: string
        }
        Relationships: []
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
      lead_status: LeadStatus
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update']
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T]
