import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import ResponseTimeBadge from '@/components/admin/ResponseTimeBadge'
import type { Tables } from '@db/types'

type LeadRow = Pick<
  Tables<'leads'>,
  'id' | 'full_name' | 'email' | 'phone' | 'status' | 'care_home_id' | 'created_at'
> & { area?: string | null }
type HomeRow = Pick<Tables<'care_homes'>, 'id' | 'name'>

const PAGE_SIZE = 25

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'default',
  contacted: 'secondary',
  qualified: 'secondary',
  tour_booked: 'secondary',
  tour_completed: 'secondary',
  assessed: 'secondary',
  converted: 'secondary',
  moved_in: 'secondary',
  lost: 'destructive',
}

async function getLeads(search: string, status: string, page: number) {
  const supabase = createServiceClient()

  let query = supabase
    .from('leads')
    .select('id, full_name, email, phone, status, care_home_id, area, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (status) query = query.eq('status', status)
  if (search) query = query.ilike('full_name', `%${search}%`)

  const { data, count } = await query

  const leads = (data ?? []) as unknown as LeadRow[]
  const homeIds = [...new Set(leads.map((l) => l.care_home_id).filter(Boolean))] as string[]

  let homes: HomeRow[] = []
  if (homeIds.length > 0) {
    const homesResult = await supabase
      .from('care_homes')
      .select('id, name')
      .in('id', homeIds)
    homes = (homesResult.data ?? []) as unknown as HomeRow[]
  }

  const homesMap = Object.fromEntries(homes.map((h) => [h.id, h.name]))
  return { leads, homesMap, total: count ?? 0 }
}

const ALL_STATUSES = [
  'new', 'contacted', 'qualified', 'tour_booked', 'tour_completed',
  'assessed', 'converted', 'moved_in', 'lost',
]

export default async function LeadsInboxPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; page?: string }
}) {
  const search = searchParams.search ?? ''
  const status = searchParams.status ?? ''
  const page = Math.max(1, Number(searchParams.page ?? 1))

  const { leads, homesMap, total } = await getLeads(search, status, page)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <span className="text-sm text-muted-foreground">{total} total</span>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name…"
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-56"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Filter
        </button>
        {(search || status) && (
          <Link
            href="/admin/leads"
            className="h-9 inline-flex items-center rounded-md border px-4 text-sm hover:bg-muted"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Care Home</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {lead.full_name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </TableCell>
                <TableCell className="text-sm">
                  {homesMap[lead.care_home_id] ?? (lead.area ? `${lead.area} (area)` : '—')}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[lead.status] ?? 'outline'}>
                    {lead.status.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{lead.phone}</TableCell>
                <TableCell>
                  <ResponseTimeBadge createdAt={lead.created_at} />
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm">
          {page > 1 && (
            <Link
              href={`/admin/leads?search=${search}&status=${status}&page=${page - 1}`}
              className="rounded-md border px-3 py-1.5 hover:bg-muted"
            >
              Previous
            </Link>
          )}
          <span className="text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/leads?search=${search}&status=${status}&page=${page + 1}`}
              className="rounded-md border px-3 py-1.5 hover:bg-muted"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
