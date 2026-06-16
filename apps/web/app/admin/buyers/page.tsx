import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

type BuyerRow = {
  id: string
  name: string
  areas: string[]
  care_types: string[]
  monthly_cap: number | null
  notify_email: boolean
  notify_sms: boolean
  active: boolean
}

export default async function BuyersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db.from('buyers').select('*').order('created_at', { ascending: false })
  const buyers = (data ?? []) as unknown as BuyerRow[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Buyers</h1>
          <p className="text-sm text-muted-foreground">Care providers that unassigned location leads are distributed to.</p>
        </div>
        <Button asChild>
          <Link href="/admin/buyers/new">Add buyer</Link>
        </Button>
      </div>

      {buyers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No buyers yet. Add one to start distributing location leads.</p>
      ) : (
        <div className="divide-y rounded-md border">
          {buyers.map((b) => (
            <Link key={b.id} href={`/admin/buyers/${b.id}/edit`} className="flex items-center justify-between gap-4 p-4 hover:bg-muted/40">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{b.name}</span>
                  {!b.active && <Badge variant="secondary">inactive</Badge>}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {b.areas?.length ? b.areas.join(', ') : 'No areas set'} · {b.care_types?.length ? b.care_types.join(', ') : 'All care types'}
                </p>
              </div>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                <div>{[b.notify_email && 'email', b.notify_sms && 'SMS'].filter(Boolean).join(' + ') || 'no channel'}</div>
                <div>{b.monthly_cap ? `cap ${b.monthly_cap}/mo` : 'no cap'}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
