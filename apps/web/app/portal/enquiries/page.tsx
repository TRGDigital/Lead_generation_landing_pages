import Link from 'next/link'
import { requirePortalHome } from '@/lib/portal'
import { createClient } from '@/lib/supabase/server'
import EnquiryCard from '@/components/portal/EnquiryCard'
import { COPY } from '@/lib/copy/portal'
import type { Tables } from '@db/types'

export const metadata = { title: 'Enquiries' }

type Lead = Pick<Tables<'leads'>, 'id' | 'full_name' | 'phone' | 'care_type' | 'status' | 'created_at'>

type Props = { searchParams: { filter?: string } }

export default async function EnquiriesPage({ searchParams }: Props) {
  const { home } = await requirePortalHome()
  const supabase = createClient()
  const filter = searchParams.filter ?? 'needs_action'

  const baseQuery = supabase
    .from('leads')
    .select('id, full_name, phone, care_type, status, created_at')
    .eq('care_home_id', home.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const { data } = filter === 'needs_action'
    ? await baseQuery.eq('status', 'new')
    : await baseQuery

  const leads = (data ?? []) as unknown as Lead[]

  const tabs = [
    { value: 'needs_action', label: COPY.needsAction },
    { value: 'all', label: COPY.allEnquiries },
  ]

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
      <div className="flex gap-1 rounded-xl bg-muted p-1">
        {tabs.map(({ value, label }) => (
          <Link
            key={value}
            href={`/portal/enquiries?filter=${value}`}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors ${
              filter === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center space-y-2">
          <p className="font-medium">{COPY.noEnquiries}</p>
          <p className="text-sm text-muted-foreground">{COPY.noEnquiriesHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <EnquiryCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  )
}
