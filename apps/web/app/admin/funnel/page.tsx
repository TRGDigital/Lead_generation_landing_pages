import { createServiceClient } from '@/lib/supabase/server'
import FunnelChart from '@/components/admin/FunnelChart'
import type { Tables } from '@db/types'
import type { LeadStatus } from '@db/types'

type LeadRow = Pick<Tables<'leads'>, 'status'>

const FUNNEL_ORDER: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'tour_booked',
  'tour_completed',
  'assessed',
  'moved_in',
  'lost',
]

async function getFunnelData() {
  const supabase = createServiceClient()
  const { data } = await supabase.from('leads').select('status')
  const leads = (data ?? []) as unknown as LeadRow[]

  const counts: Record<string, number> = {}
  for (const lead of leads) {
    counts[lead.status] = (counts[lead.status] ?? 0) + 1
  }

  return FUNNEL_ORDER.filter((s) => (counts[s] ?? 0) > 0).map((s) => ({
    stage: s,
    count: counts[s] ?? 0,
  }))
}

export default async function FunnelPage() {
  const data = await getFunnelData()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Funnel</h1>
      {data.length === 0 ? (
        <p className="text-muted-foreground">No leads yet.</p>
      ) : (
        <div className="rounded-lg border bg-card p-6">
          <FunnelChart data={data} />
        </div>
      )}
      {/* Summary table */}
      {data.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Stage</th>
                <th className="px-4 py-2 text-right font-medium">Leads</th>
                <th className="px-4 py-2 text-right font-medium">% of total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const total = data.reduce((s, r) => s + r.count, 0)
                return (
                  <tr key={row.stage} className="border-b last:border-0">
                    <td className="px-4 py-2 capitalize">{row.stage.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-2 text-right">{row.count}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">
                      {total > 0 ? ((row.count / total) * 100).toFixed(1) : '0'}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
