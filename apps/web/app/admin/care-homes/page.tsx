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
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Tables } from '@db/types'

type HomeRow = Pick<
  Tables<'care_homes'>,
  'id' | 'name' | 'location' | 'cqc_rating' | 'is_active' | 'bed_target'
>

async function getCareHomes() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('care_homes')
    .select('id, name, location, cqc_rating, is_active, bed_target')
    .order('name')
  return (data ?? []) as unknown as HomeRow[]
}

export default async function CareHomesPage() {
  const homes = await getCareHomes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Care Homes</h1>
        <Button asChild size="sm">
          <Link href="/admin/care-homes/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add home
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>CQC Rating</TableHead>
              <TableHead>Bed Target</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {homes.map((home) => (
              <TableRow key={home.id}>
                <TableCell className="font-medium">{home.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{home.location}</TableCell>
                <TableCell className="text-sm">{home.cqc_rating ?? '—'}</TableCell>
                <TableCell className="text-sm">{home.bed_target}</TableCell>
                <TableCell>
                  <Badge variant={home.is_active ? 'default' : 'secondary'}>
                    {home.is_active ? 'Active' : 'Paused'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/care-homes/${home.id}/edit`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {homes.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-10"
                >
                  No care homes yet. Add your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
