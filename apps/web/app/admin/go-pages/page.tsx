import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { getAllGoPages } from '@/lib/go-pages'
import { GO_TEMPLATES } from '@/lib/go-templates'
import { Badge } from '@/components/ui/badge'
import { GoPageDuplicate, GoPageStatusToggle, NewGoPageForm } from '@/components/admin/GoPagesClient'

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

      {/* How-to reference: A/B duplication + dynamic headlines */}
      <details className="group rounded-md border bg-white">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold">
          📖 How to run A/B tests with Duplicate
        </summary>
        <div className="space-y-2 border-t px-4 py-4 text-sm text-muted-foreground">
          <p>Instead of a separate split-testing tool, you create two versions of a page and let <strong className="text-foreground">Google Ads split the traffic and score the winner</strong> — it already tracks conversions per URL.</p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Find the page below and click <strong className="text-foreground">Duplicate (A/B)</strong> — it copies everything to <code>/go/&lt;slug&gt;-b</code> as a draft and opens its editor.</li>
            <li>Change <strong className="text-foreground">one thing</strong> on the B version (headline, quiz intro, bullets…). One variable per test, or you won&apos;t know what caused the difference.</li>
            <li><strong className="text-foreground">Publish</strong> the B page.</li>
            <li>In the Google Ads ad group, add a second ad with the <strong className="text-foreground">B page as its final URL</strong> — Ads rotates the two automatically.</li>
            <li>After enough traffic, compare conversions per URL in Ads, and each page&apos;s <strong className="text-foreground">Performance tab</strong> here for the full funnel (starts, drop-offs, leads).</li>
            <li>Keep the winner, delete or re-test the loser. Variants <code>-b</code> to <code>-e</code> are available per page.</li>
          </ol>
        </div>
      </details>

      <details className="group rounded-md border bg-white">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold">
          📖 How dynamic headlines (?h=) work
        </summary>
        <div className="space-y-2 border-t px-4 py-4 text-sm text-muted-foreground">
          <p>Perfect <strong className="text-foreground">message match</strong>: the visitor sees the exact promise they clicked on, without creating a new page per ad. Add <code>?h=</code> and your headline to any published page URL:</p>
          <p className="rounded bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">https://www.trgdigital.co.uk/go/care-home-websites?h=Care home websites that fill beds in Crawley</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Spaces are fine — browsers and Google Ads encode them automatically.</li>
            <li>That visitor sees your custom headline in the hero; everything else stays the same.</li>
            <li><strong className="text-foreground">Where to use it:</strong> each Google Ads ad gets its own <code>?h=</code> final URL — so the &ldquo;care home web design&rdquo; ad group promises exactly that, while &ldquo;nursing home websites&rdquo; gets its own wording. One page, matched to every search theme.</li>
            <li>Text only, max 90 characters. Google and SEO always see the admin-set headline — the override only applies to the ad click.</li>
            <li><strong className="text-foreground">Combine them:</strong> A/B test structure with Duplicate; match message per ad group with <code>?h=</code> on top of whichever variant. Rule of thumb — <code>?h=</code> when only the headline changes, Duplicate for anything deeper.</li>
          </ul>
        </div>
      </details>

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
                <GoPageDuplicate slug={p.slug} />
                <GoPageStatusToggle slug={p.slug} status={p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
