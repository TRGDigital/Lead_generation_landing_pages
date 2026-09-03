import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageTemplateSelect } from '@/components/admin/PageTemplateSelect'
import { PageStatusToggle } from '@/components/admin/PageStatusToggle'
import PageNotifyEmails from '@/components/admin/PageNotifyEmails'

export const dynamic = 'force-dynamic'

type PageRow = {
  id: string
  slug: string
  area_name: string
  status: string
  question_set: string | null
  notify_emails: string[] | null
  postcode_districts: string[] | null
}

type SeatRow = {
  page_id: string
  home_name: string | null
  town: string | null
  active: boolean
  leads_total: number
  last_lead_at: string | null
}

export default async function LandingPagesAdmin({ searchParams }: { searchParams: { created?: string } }) {
  await requireAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db
    .from('location_pages')
    .select('id, slug, area_name, status, question_set, notify_emails, postcode_districts')
    .order('area_name', { ascending: true })

  const pages = (data ?? []) as unknown as PageRow[]

  // Which claimed homes each page serves. This is the answer to "who is this page working
  // for", which is otherwise buried in the database.
  const { data: seatData } = await db
    .from('location_page_homes')
    .select('page_id, home_name, town, active, leads_total, last_lead_at')
    .order('last_lead_at', { ascending: true, nullsFirst: true })
  const seats = (seatData ?? []) as unknown as SeatRow[]
  const seatsByPage = new Map<string, SeatRow[]>()
  for (const s of seats) seatsByPage.set(s.page_id, [...(seatsByPage.get(s.page_id) ?? []), s])
  const created = searchParams?.created

  return (
    <div className="space-y-6">
      {/* How the model works, written down where the pages live: this is the bit that is easy
          to forget six months from now. */}
      <details className="rounded-xl border border-brand-line bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-brand-ink">
          How promoted landing pages work
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-ink-muted">
          <p>
            <strong className="text-brand-ink">Why they exist.</strong> CareAssura&rsquo;s organic traffic is still
            young, so a newly claimed profile cannot yet be expected to produce leads on its own. These pages buy
            traffic in the meantime, so a paying client sees enquiries from the start rather than waiting for search
            rankings that take months.
          </p>
          <p>
            <strong className="text-brand-ink">One page per area, not per client.</strong> A page covers a postcode
            district and one care type, and every claimed home that fits shares it. That is what makes the spend work:
            a single client cannot fund enough paid traffic alone, but four homes in one area can, and each new client
            makes the same page stronger instead of starting another weak one.
          </p>
          <p>
            <strong className="text-brand-ink">How a claim finds its page.</strong> When a profile is claimed,
            CareAssura sends us its postcode and care type. We match on the postcode district, not the town: Crossways
            sits in Lindfield but belongs on the Haywards Heath page, and only RH16 finds that. If a page already
            covers the area, the home joins the rota on it. If nothing does, a <strong>draft</strong> page is created
            for the area. Drafts are never served, so spend is never pointed at an empty page — somebody writes the
            content and publishes it deliberately.
          </p>
          <p>
            <strong className="text-brand-ink">Who gets each lead.</strong> Two rules, in order. Only homes with
            availability, because sending a family to a full home wastes the spend and their time. Then whoever has
            waited longest since their last lead, so a shared page shares fairly. Availability is asked of CareAssura
            at the moment the lead arrives rather than copied here, where it would go stale. If nobody in the area has
            a bed, the lead is still captured and waits in Leads to be placed by hand.
          </p>
          <p>
            <strong className="text-brand-ink">Where the lead goes.</strong> Straight into CareAssura&rsquo;s enquiry
            route, so it reaches the client&rsquo;s dashboard and inbox exactly like any other enquiry, tagged as
            source <code>landing</code>. That tag matters: a paid lead should never quietly pass itself off as
            organic, or we lose the ability to tell whether the main site is actually growing.
          </p>
          <p>
            <strong className="text-brand-ink">These pages are not indexed.</strong> They exist to convert paid
            traffic. Letting them rank would put them in competition with careassura.com&rsquo;s own area pages, on
            the same root domain, for the same searches — bidding against ourselves at exactly the moment the main
            site&rsquo;s organic growth is the long game.
          </p>
          <p>
            <strong className="text-brand-ink">When a client leaves.</strong> Deactivate their seat on the page rather
            than deleting the page: the area may still hold other clients, and the page keeps whatever authority it
            has earned.
          </p>
        </div>
      </details>

      <div className="flex flex-wrap items-start justify-between gap-4">
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
        <Button asChild>
          <Link href="/admin/pages/new">New landing page</Link>
        </Button>
      </div>

      {created && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Created <strong>{created}.careassura.com</strong> as a draft. Review the copy, hit <strong>Publish</strong>{' '}
          when ready — and let me know so I can point the subdomain at the project.
        </div>
      )}

      {pages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No landing pages yet.</p>
      ) : (
        <div className="divide-y rounded-md border">
          {pages.map((p) => (
            <div key={p.slug} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
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
                  <Link href={`/admin/pages/${p.slug}`} className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                    Edit content
                  </Link>
                  <span className="text-xs text-muted-foreground">Quiz template</span>
                  <PageTemplateSelect slug={p.slug} current={p.question_set ?? 'residential'} />
                  <PageStatusToggle slug={p.slug} status={p.status} />
                </div>
              </div>
              {/* The claimed homes this page serves, in rota order: next to receive a lead
                  is first. Blank means the page is running for nobody yet. */}
              <div className="mt-3 border-t pt-3 text-xs">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-slate-700">Claimed profiles on this page</span>
                  {p.postcode_districts?.length ? (
                    <span className="text-muted-foreground">covers {p.postcode_districts.join(', ')}</span>
                  ) : (
                    <span className="text-amber-700">no postcode area set, so no new claim can match it</span>
                  )}
                </div>
                {(seatsByPage.get(p.id) ?? []).length === 0 ? (
                  <p className="mt-1 text-muted-foreground">
                    None yet. Leads from this page have nobody to go to and will wait in Leads to be placed by hand.
                  </p>
                ) : (
                  <ul className="mt-1.5 space-y-1">
                    {(seatsByPage.get(p.id) ?? []).map((s, i) => (
                      <li key={`${p.id}-${s.home_name}-${i}`} className="flex flex-wrap items-center gap-2">
                        <span className={s.active ? 'font-medium text-slate-800' : 'text-muted-foreground line-through'}>
                          {s.home_name || 'Unnamed home'}
                        </span>
                        {s.town && <span className="text-muted-foreground">{s.town}</span>}
                        {s.active && i === 0 && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">next in the rota</span>}
                        {!s.active && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">paused</span>}
                        <span className="text-muted-foreground">
                          {s.leads_total} lead{s.leads_total === 1 ? '' : 's'}
                          {s.last_lead_at ? ` · last ${new Date(s.last_lead_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : ' · none yet'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <PageNotifyEmails slug={p.slug} initial={p.notify_emails ?? []} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
