import { createServiceClient } from '@/lib/supabase/server'
import { Users, Building2, TrendingUp, DollarSign } from 'lucide-react'
import Link from 'next/link'
import type { Tables } from '@db/types'
import ResponseTimeBadge from '@/components/admin/ResponseTimeBadge'

type LeadRow = Tables<'leads'>
type CareHomeRow = Pick<Tables<'care_homes'>, 'id' | 'name' | 'is_active'>

async function getOverviewData() {
  const supabase = createServiceClient()

  const [leadsResult, homesResult, recentResult] = await Promise.all([
    supabase.from('leads').select('id, status, created_at', { count: 'exact' }),
    supabase.from('care_homes').select('id, name, is_active'),
    supabase
      .from('leads')
      .select('id, full_name, care_home_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const leads = (leadsResult.data ?? []) as unknown as Pick<
    LeadRow,
    'id' | 'status' | 'created_at'
  >[]
  const homes = (homesResult.data ?? []) as unknown as CareHomeRow[]
  const recent = (recentResult.data ?? []) as unknown as Pick<
    LeadRow,
    'id' | 'full_name' | 'care_home_id' | 'status' | 'created_at'
  >[]

  const totalLeads = leads.length
  const newLeads = leads.filter((l) => l.status === 'new').length
  const movedIn = leads.filter((l) => l.status === 'moved_in').length
  const activeHomes = homes.filter((h) => h.is_active).length

  const homesMap = Object.fromEntries(homes.map((h) => [h.id, h.name]))

  return { totalLeads, newLeads, movedIn, activeHomes, recent, homesMap }
}

const kpiCards = [
  {
    label: 'Total Leads',
    key: 'totalLeads',
    icon: <Users className="h-5 w-5 text-muted-foreground" />,
  },
  {
    label: 'New (uncontacted)',
    key: 'newLeads',
    icon: <TrendingUp className="h-5 w-5 text-muted-foreground" />,
  },
  {
    label: 'Moved In',
    key: 'movedIn',
    icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
  },
  {
    label: 'Active Homes',
    key: 'activeHomes',
    icon: <Building2 className="h-5 w-5 text-muted-foreground" />,
  },
] as const

export default async function AdminOverviewPage() {
  const { totalLeads, newLeads, movedIn, activeHomes, recent, homesMap } =
    await getOverviewData()

  const values: Record<string, number> = { totalLeads, newLeads, movedIn, activeHomes }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Overview</h1>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map(({ label, key, icon }) => (
          <div key={key} className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              {icon}
            </div>
            <p className="mt-2 text-3xl font-bold">{values[key]}</p>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-medium">Recent Enquiries</h2>
          <Link href="/admin/leads" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <ul className="divide-y">
          {recent.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{lead.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {homesMap[lead.care_home_id] ?? 'Unknown home'}
                  </p>
                </div>
                <ResponseTimeBadge createdAt={lead.created_at} />
              </Link>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="px-5 py-6 text-sm text-muted-foreground text-center">
              No enquiries yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
