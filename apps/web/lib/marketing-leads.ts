import { createServiceClient } from '@/lib/supabase/server'

// Leads captured by the TRG marketing site's own forms (contact form + audit/grader),
// stored in marketing_leads. Separate from organic_leads (the client-site pop-up/tools).
export type MarketingLead = {
  id: string
  name: string | null
  email: string | null
  company: string | null
  phone: string | null
  message: string | null
  source: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  heard_about: string | null
  landing_page: string | null
  first_referrer: string | null
  created_at: string
}

export async function getMarketingLeads(limit = 1000): Promise<MarketingLead[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('marketing_leads')
    .select('id, name, email, company, phone, message, source, utm_source, utm_medium, utm_campaign, heard_about, landing_page, first_referrer, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as MarketingLead[]) ?? []
}
