import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { PageTemplateSelect } from '@/components/admin/PageTemplateSelect'

export const dynamic = 'force-dynamic'

type PageRow = {
  slug: string
  area_name: string
  status: string
  question_set: string | null
}

export default async function LandingPagesAdmin() {
  await requireAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db
    .from('location_pages')
    .select('slug, area_name, status, question_set')
    .order('area_name', { ascending: true })

  const pages = (data ?? []) as unknown as PageRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Landing Pages</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each location landing page runs the gamified care-finder quiz. Pick the template per page — residential or
          nursing — to control which questions visitors answer. Edit the wording of those questions under{' '}
          <Link href="/admin/quiz" className="font-medium text-violet-700 underline">
            Care Finder
          </Link>
          .
        </p>
      </div>

      {pages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No landing pages yet.</p>
      ) : (
        <div className="divide-y rounded-md border">
          {pages.map((p) => (
            <div key={p.slug} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.area_name}</span>
                  {p.status !== 'published' && <Badge variant="secondary">{p.status}</Badge>}
                </div>
                <a
                  href={`https://${p.slug}.careassura.com/`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  {p.slug}.careassura.com
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-muted-foreground">Quiz template</span>
                <PageTemplateSelect slug={p.slug} current={p.question_set ?? 'residential'} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
