import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { getAllGoPages } from '@/lib/go-pages'
import { GO_TEMPLATES } from '@/lib/go-templates'
import { Badge } from '@/components/ui/badge'
import { GoPageStatusToggle, NewGoPageForm } from '@/components/admin/GoPagesClient'

export const dynamic = 'force-dynamic'

// TRG's own Google Ads landing pages (/go/<slug>), each with a per-service
// gamified quiz. Separate from the CareAssura location Landing Pages.
export default async function GoPagesAdmin() {
  await requireAdmin()
  const pages = await getAllGoPages()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">TRG Ad Pages</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Landing pages for TRG&apos;s own Google Ads at <code>trgdigital.co.uk/go/…</code> — each runs a
          per-service qualification quiz and emails its leads to the addresses you set. Pages are noindex,
          so they never interfere with the SEO site.
        </p>
      </div>

      <NewGoPageForm templates={GO_TEMPLATES.map((t) => ({ key: t.key, service: t.service, defaultSlug: t.defaultSlug }))} />

      {pages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No ad pages yet — create your first above.</p>
      ) : (
        <div className="divide-y rounded-md border">
          {pages.map((p) => (
            <div key={p.slug} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/go-pages/${p.slug}`} className="font-medium hover:underline">
                    {p.service}
                  </Link>
                  {p.status !== 'published' && <Badge variant="secondary">{p.status}</Badge>}
                </div>
                <a
                  href={`/go/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  trgdigital.co.uk/go/{p.slug}
                </a>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Leads to: {p.notify_emails?.length ? p.notify_emails.join(', ') : 'default inbox'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/admin/go-pages/${p.slug}`}
                  className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                >
                  Edit
                </Link>
                <GoPageStatusToggle slug={p.slug} status={p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
