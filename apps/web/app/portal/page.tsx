import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { requirePortalHome, getWeeklyStats } from '@/lib/portal'
import CampaignToggle from '@/components/portal/CampaignToggle'

export const metadata = { title: 'Dashboard' }

export default async function PortalDashboardPage() {
  const { home } = await requirePortalHome()
  const stats = await getWeeklyStats(home.id)

  const kpis = [
    { label: 'New enquiries', value: stats.newEnquiries },
    { label: 'Qualified', value: stats.qualified },
    { label: 'Tours booked', value: stats.toursBooked },
    { label: 'Move-ins', value: stats.moveIns },
  ]

  return (
    <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
      <CampaignToggle
        homeId={home.id}
        isActive={home.is_active ?? false}
        bedTarget={home.bed_target ?? 0}
      />

      {stats.unreviewedCount > 0 && (
        <Link
          href="/portal/enquiries"
          className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">{stats.unreviewedCount} new</span>{' '}
            {stats.unreviewedCount === 1 ? 'enquiry needs' : 'enquiries need'} your attention
          </span>
          <span className="ml-auto text-xs font-medium">View →</span>
        </Link>
      )}

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          This week
        </p>
        <div className="grid grid-cols-2 gap-3">
          {kpis.map(({ label, value }) => (
            <div key={label} className="rounded-xl border bg-card p-4">
              <p className="text-3xl font-bold tabular-nums">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
