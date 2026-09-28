import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { getMarketingLeads, type MarketingLead } from '@/lib/marketing-leads'
import MarketingLeadsTable from '@/components/admin/MarketingLeadsTable'

export const metadata: Metadata = { title: 'Site enquiries — Admin' }
export const dynamic = 'force-dynamic'

// Paid leads are kept apart from the site's own forms, so the ad campaigns can be judged
// on their own leads. /go/ quiz leads store source "/go/<slug>"; Google Ads lead form
// assets store source "google-lead-form" (see /api/webhooks/google-lead-form).
type Tab = 'site' | 'go' | 'lead-form'

function tabOf(l: MarketingLead): Tab {
  const s = l.source ?? ''
  if (s.startsWith('/go/')) return 'go'
  if (s === 'google-lead-form') return 'lead-form'
  return 'site'
}

const TABS: { key: Tab; label: string; blurb: string; empty: string }[] = [
  {
    key: 'site',
    label: 'Site enquiries',
    blurb: 'Enquiries from the TRG site’s own forms: contact, tools, guides and the audit/grader.',
    empty: 'No site enquiries yet.',
  },
  {
    key: 'go',
    label: '/go/ pages',
    blurb: 'Quiz leads from the Google Ads landing pages at /go/. Each shows the page, the funnel and every answer.',
    empty: 'No /go/ page leads yet.',
  },
  {
    key: 'lead-form',
    label: 'Google lead forms',
    blurb: 'Leads from lead form assets inside Google Ads, delivered by webhook. They never visit the site.',
    empty: 'No Google lead form leads yet.',
  },
]

export default async function MarketingLeadsAdmin({ searchParams }: { searchParams: { tab?: string } }) {
  await requireAdmin()
  const all = await getMarketingLeads()

  const tab = (TABS.find((t) => t.key === searchParams.tab)?.key ?? 'site') as Tab
  const current = TABS.find((t) => t.key === tab)!
  const counts = Object.fromEntries(TABS.map((t) => [t.key, all.filter((l) => tabOf(l) === t.key).length]))
  const leads = all.filter((l) => tabOf(l) === tab)

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const last7 = leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length

  const tabClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      active ? 'bg-brand-ink text-white' : 'text-brand-ink-soft hover:bg-brand-line/40'
    }`

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="font-display text-2xl font-semibold text-brand-ink">Site enquiries</h1>
      <p className="mt-1 mb-5 text-sm text-brand-ink-muted">
        Every enquiry is also emailed to you. This is the searchable record.
      </p>

      <div className="mb-5 inline-flex flex-wrap gap-1 rounded-full border border-brand-line bg-white p-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === 'site' ? '/admin/marketing-leads' : `/admin/marketing-leads?tab=${t.key}`}
            className={tabClass(tab === t.key)}
          >
            {t.label} <span className="ml-1 opacity-70">{counts[t.key]}</span>
          </Link>
        ))}
      </div>

      <p className="mb-4 text-sm text-brand-ink-muted">{current.blurb}</p>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <p className="font-display text-2xl font-bold text-brand-ink">{leads.length}</p>
          <p className="text-xs text-brand-ink-muted">Total</p>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <p className="font-display text-2xl font-bold text-brand-ink">{last7}</p>
          <p className="text-xs text-brand-ink-muted">Last 7 days</p>
        </div>
      </div>

      <MarketingLeadsTable key={tab} leads={leads} emptyText={current.empty} />
    </div>
  )
}
