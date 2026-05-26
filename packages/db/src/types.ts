// AUTO-GENERATED — do not edit by hand.
// Regenerate with: pnpm db:types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          body_mdx: string
          canonical_url: string | null
          category: string | null
          created_at: string
          excerpt: string
          hero_image_url: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_minutes: number | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body_mdx?: string
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_minutes?: number | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body_mdx?: string
          canonical_url?: string | null
          category?: string | null
          created_at?: string
          excerpt?: string
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_minutes?: number | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_spend: {
        Row: {
          care_home_id: string
          clicks: number | null
          conversions: number | null
          created_at: string
          date: string
          id: string
          impressions: number | null
          source: string
          spend_pennies: number
        }
        Insert: {
          care_home_id: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          date: string
          id?: string
          impressions?: number | null
          source?: string
          spend_pennies?: number
        }
        Update: {
          care_home_id?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          date?: string
          id?: string
          impressions?: number | null
          source?: string
          spend_pennies?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_spend_care_home_id_fkey"
            columns: ["care_home_id"]
            isOneToOne: false
            referencedRelation: "care_homes"
            referencedColumns: ["id"]
          },
        ]
      }
      care_home_users: {
        Row: {
          care_home_id: string
          created_at: string
          invited_by: string | null
          role: string
          user_id: string
        }
        Insert: {
          care_home_id: string
          created_at?: string
          invited_by?: string | null
          role: string
          user_id: string
        }
        Update: {
          care_home_id?: string
          created_at?: string
          invited_by?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_home_users_care_home_id_fkey"
            columns: ["care_home_id"]
            isOneToOne: false
            referencedRelation: "care_homes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_home_users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_home_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      care_homes: {
        Row: {
          bed_target: number
          brand: Json | null
          care_types: string[]
          content: Json
          cqc_rating: string | null
          created_at: string
          google_ads_campaign_id: string | null
          google_ads_customer_id: string | null
          google_ads_last_synced_at: string | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          location: string
          name: string
          phone_display: string
          phone_tracking: Json | null
          postcode: string
          slug: string
          updated_at: string
          weekly_bed_value_pennies: number | null
        }
        Insert: {
          bed_target?: number
          brand?: Json | null
          care_types: string[]
          content: Json
          cqc_rating?: string | null
          created_at?: string
          google_ads_campaign_id?: string | null
          google_ads_customer_id?: string | null
          google_ads_last_synced_at?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          location: string
          name: string
          phone_display: string
          phone_tracking?: Json | null
          postcode: string
          slug: string
          updated_at?: string
          weekly_bed_value_pennies?: number | null
        }
        Update: {
          bed_target?: number
          brand?: Json | null
          care_types?: string[]
          content?: Json
          cqc_rating?: string | null
          created_at?: string
          google_ads_campaign_id?: string | null
          google_ads_customer_id?: string | null
          google_ads_last_synced_at?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          location?: string
          name?: string
          phone_display?: string
          phone_tracking?: Json | null
          postcode?: string
          slug?: string
          updated_at?: string
          weekly_bed_value_pennies?: number | null
        }
        Relationships: []
      }
      cron_logs: {
        Row: {
          cron_name: string
          id: string
          ok: boolean
          ran_at: string
          summary: Json | null
        }
        Insert: {
          cron_name: string
          id?: string
          ok: boolean
          ran_at?: string
          summary?: Json | null
        }
        Update: {
          cron_name?: string
          id?: string
          ok?: boolean
          ran_at?: string
          summary?: Json | null
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          new_value: string | null
          note: string | null
          old_value: string | null
          performed_by: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          new_value?: string | null
          note?: string | null
          old_value?: string | null
          performed_by?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          new_value?: string | null
          note?: string | null
          old_value?: string | null
          performed_by?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assessed_at: string | null
          assigned_to: string | null
          care_home_id: string
          care_type: string | null
          closed_at: string | null
          contacted_at: string | null
          created_at: string
          disqualification_notes: string | null
          disqualification_reason: string | null
          email: string
          full_name: string
          gclid: string | null
          id: string
          idempotency_key: string | null
          ip_address: string | null
          lead_source: string
          lost_at: string | null
          message: string | null
          move_in_timeframe: string | null
          moved_in_at: string | null
          notes: string | null
          phone: string
          qualified: boolean
          resident_name: string | null
          sla_alerted_at: string | null
          status: Database["public"]["Enums"]["lead_status"]
          tour_booked_at: string | null
          tour_completed_at: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          weekly_fee_pennies: number | null
        }
        Insert: {
          assessed_at?: string | null
          assigned_to?: string | null
          care_home_id: string
          care_type?: string | null
          closed_at?: string | null
          contacted_at?: string | null
          created_at?: string
          disqualification_notes?: string | null
          disqualification_reason?: string | null
          email: string
          full_name: string
          gclid?: string | null
          id?: string
          idempotency_key?: string | null
          ip_address?: string | null
          lead_source?: string
          lost_at?: string | null
          message?: string | null
          move_in_timeframe?: string | null
          moved_in_at?: string | null
          notes?: string | null
          phone: string
          qualified?: boolean
          resident_name?: string | null
          sla_alerted_at?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tour_booked_at?: string | null
          tour_completed_at?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          weekly_fee_pennies?: number | null
        }
        Update: {
          assessed_at?: string | null
          assigned_to?: string | null
          care_home_id?: string
          care_type?: string | null
          closed_at?: string | null
          contacted_at?: string | null
          created_at?: string
          disqualification_notes?: string | null
          disqualification_reason?: string | null
          email?: string
          full_name?: string
          gclid?: string | null
          id?: string
          idempotency_key?: string | null
          ip_address?: string | null
          lead_source?: string
          lost_at?: string | null
          message?: string | null
          move_in_timeframe?: string | null
          moved_in_at?: string | null
          notes?: string | null
          phone?: string
          qualified?: boolean
          resident_name?: string | null
          sla_alerted_at?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tour_booked_at?: string | null
          tour_completed_at?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          weekly_fee_pennies?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_care_home_id_fkey"
            columns: ["care_home_id"]
            isOneToOne: false
            referencedRelation: "care_homes"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          ip_address: unknown
          message: string | null
          name: string
          phone: string | null
          source: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          ip_address?: unknown
          message?: string | null
          name: string
          phone?: string | null
          source?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: unknown
          message?: string | null
          name?: string
          phone?: string | null
          source?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          notification_preferences: Json
          phone: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          notification_preferences?: Json
          phone?: string | null
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          notification_preferences?: Json
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      client_qualify_lead: {
        Args: {
          p_disqualification_notes?: string
          p_disqualification_reason?: string
          p_lead_id: string
          p_qualified: boolean
        }
        Returns: undefined
      }
      client_save_note: {
        Args: { p_lead_id: string; p_note: string }
        Returns: undefined
      }
      client_update_campaign: {
        Args: {
          p_bed_target: number
          p_care_home_id: string
          p_is_active: boolean
        }
        Returns: undefined
      }
      client_update_lead_status: {
        Args: { p_lead_id: string; p_note?: string; p_status: string }
        Returns: undefined
      }
    }
    Enums: {
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "converted"
        | "lost"
        | "tour_booked"
        | "tour_completed"
        | "assessed"
        | "moved_in"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "converted",
        "lost",
        "tour_booked",
        "tour_completed",
        "assessed",
        "moved_in",
      ],
    },
  },
} as const

// Convenience aliases
export type LeadStatus = Database["public"]["Enums"]["lead_status"]
export type CareHome = Tables<"care_homes">
export type Lead = Tables<"leads">
export type LeadActivity = Tables<"lead_activities">
export type CareHomeUser = Tables<"care_home_users">
export type User = Tables<"users">
export type MarketingLead = Tables<"marketing_leads">
export type Author = Tables<"authors">
export type BlogPost = Tables<"blog_posts">
export type CronLog = Tables<"cron_logs">
