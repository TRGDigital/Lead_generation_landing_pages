import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getGoPage, getGoQuizStats, getGoLeads } from '@/lib/go-pages'
import { saveGoPage, deleteGoPage } from '../actions'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string }; searchParams: { saved?: string; warn?: string; error?: string; tab?: string } }

// Edit one TRG ad page. Friendly text formats: bullets one per line; proof as
// "stat | label"; quiz as "Q: …" + "- option" blocks; FAQs as "Q: …" / "A: …".
export default async function EditGoPage({ params, searchParams }: Props) {
  await requireAdmin()
  const page = await getGoPage(params.slug)
  if (!page) notFound()

  const tab = searchParams.tab === 'content' ? 'content' : searchParams.tab === 'leads' ? 'leads' : 'performance'
  const stats = tab === 'performance' ? await getGoQuizStats(page.slug, page.questions) : null
  const leads = tab === 'leads' ? await getGoLeads(page.slug) : []

  const save = saveGoPage.bind(null, page.slug)
  const remove = deleteGoPage.bind(null, page.slug)

  const input = 'w-full rounded-md border bg-background px-3 py-2 text-sm'
  const label = 'text-sm font-medium'
  const hint = 'text-xs text-muted-foreground'
  const questionsText = page.questions.map((q) => [`Q: ${q.q}`, ...q.options.map((o) => `- ${o}`)].join('\n')).join('\n\n')
  const faqsText = page.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')
  const proofText = page.proof.map((p) => `${p.stat} | ${p.label}`).join('\n')
  const reviewsText = page.reviews.map((r) => `Quote: ${r.quote}\nName: ${r.name}\nRole: ${r.role}`).join('\n\n')

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/go-pages" className="text-sm text-muted-foreground hover:underline">← TRG Ad Pages</Link>
          <h1 className="mt-1 text-2xl font-semibold">{page.service}</h1>
          <a href={`/go/${page.slug}`} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
            trgdigital.co.uk/go/{page.slug} {page.status !== 'published' && '(draft — publish from the list page)'}
          </a>
        </div>
        <form action={remove}>
          <button className="rounded-md border px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-300">Delete page</button>
        </form>
      </div>

      {/* Tabs: read performance first, edit content, see this page's leads */}
      <div className="flex gap-1 rounded-lg border bg-slate-50 p-1 w-fit">
        {([
          { key: 'performance', label: 'Performance' },
          { key: 'content', label: 'Content' },
          { key: 'leads', label: 'Leads' },
        ] as const).map(t => (
          <Link key={t.key} href={`/admin/go-pages/${page.slug}?tab=${t.key}`}
            className={`rounded-md px-4 py-1.5 text-sm font-medium ${tab === t.key ? 'bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {tab === 'performance' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Page views', value: stats.views, sub: 'unique visitors' },
              { label: 'Quiz starts', value: stats.starts, sub: stats.views ? `${Math.round((stats.starts / stats.views) * 100)}% of views` : '—' },
              { label: 'Reached contact step', value: stats.contacts, sub: stats.starts ? `${Math.round((stats.contacts / stats.starts) * 100)}% of starts` : '—' },
              { label: 'Leads', value: stats.submits, sub: stats.starts ? `${Math.round((stats.submits / stats.starts) * 100)}% of starts` : '—' },
            ].map(c => (
              <div key={c.label} className="rounded-md border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
                <p className="mt-1 text-3xl font-semibold">{c.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.sub}</p>
              </div>
            ))}
          </div>

          {stats.views === 0 ? (
            <p className="rounded-md border bg-white p-6 text-sm text-muted-foreground">
              No visits recorded yet — data appears here as soon as the page gets traffic.
            </p>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Question performance</h2>
              {stats.questions.map((q, i) => (
                <div key={q.question} className="rounded-md border bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium">{i + 1}. {q.question}</p>
                    <span className="flex shrink-0 items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold">{q.answered} answered</span>
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${q.dropOffPct > 30 ? 'bg-red-50 text-red-700' : q.dropOffPct > 15 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {q.dropOffPct}% drop-off
                      </span>
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {q.options.map(o => (
                      <div key={o.option} className="flex items-center gap-3 text-sm">
                        <span className="w-64 shrink-0 truncate text-muted-foreground" title={o.option}>{o.option}</span>
                        <span className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <span className="block h-full rounded-full bg-violet-500" style={{ width: `${o.pct}%` }} />
                        </span>
                        <span className="w-14 shrink-0 text-right text-xs font-semibold">{o.count} · {o.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Answer percentages are of all answers to that question. Drop-off is quiz starters who never answered it.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'leads' && (
        leads.length === 0 ? (
          <p className="rounded-md border bg-white p-6 text-sm text-muted-foreground">No leads from this page yet.</p>
        ) : (
          <div className="divide-y rounded-md border bg-white">
            {leads.map(l => (
              <div key={l.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{l.name} <span className="font-normal text-muted-foreground">· {l.email}{l.phone ? ` · ${l.phone}` : ''}{l.company ? ` · ${l.company}` : ''}</span></p>
                  <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <pre className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs text-slate-700">{l.message}</pre>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'content' && (<>
      {searchParams.saved && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Saved.{searchParams.warn === 'quiz-format' && ' (The quiz questions could not be read, so the previous questions were kept — check the Q:/- format.)'}
        </p>
      )}
      {searchParams.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          Could not save: {searchParams.error}
        </p>
      )}

      <form action={save} className="space-y-5 rounded-md border bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1"><span className={label}>Service name</span>
            <input name="service" defaultValue={page.service} className={input} required />
          </label>
          <label className="space-y-1"><span className={label}>Send leads to</span>
            <input name="notify_emails" defaultValue={page.notify_emails.join(', ')} placeholder="Blank = default inbox" className={input} />
          </label>
        </div>

        <label className="block space-y-1"><span className={label}>Headline</span>
          <input name="headline" defaultValue={page.headline} className={input} required />
        </label>
        <label className="block space-y-1"><span className={label}>Subheadline</span>
          <textarea name="subheadline" defaultValue={page.subheadline} rows={2} className={input} />
        </label>
        <label className="block space-y-1"><span className={label}>Bullets</span>
          <span className={hint}>One per line.</span>
          <textarea name="bullets" defaultValue={page.bullets.join('\n')} rows={3} className={input} />
        </label>

        <div className="rounded-md border bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold">Quiz</p>
          <label className="block space-y-1"><span className={label}>Quiz intro (the hook on the card)</span>
            <input name="quiz_intro" defaultValue={page.quiz_intro} className={input} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>Questions</span>
            <span className={hint}>Blocks of “Q: question” followed by “- option” lines; blank line between questions.</span>
            <textarea name="questions" defaultValue={questionsText} rows={14} className={`${input} font-mono text-xs`} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>Submit button label</span>
            <input name="cta_label" defaultValue={page.cta_label} className={input} />
          </label>
        </div>

        <label className="block space-y-1"><span className={label}>Proof stats</span>
          <span className={hint}>One per line as “stat | label”, e.g. 100% | care sector only.</span>
          <textarea name="proof" defaultValue={proofText} rows={4} className={input} />
        </label>
        <label className="block space-y-1"><span className={label}>Reviews (max 3 shown)</span>
          <span className={hint}>Blocks of &ldquo;Quote: &hellip;&rdquo;, &ldquo;Name: &hellip;&rdquo;, &ldquo;Role: &hellip;&rdquo;; blank line between reviews. Replace the dummy ones with real quotes before running ads.</span>
          <textarea name="reviews" defaultValue={reviewsText} rows={9} className={input} />
        </label>

        <div className="rounded-md border bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold">Trust &amp; capture</p>
          <label className="block space-y-1"><span className={label}>Founder note (the personal-review card with Len&apos;s photo)</span>
            <textarea name="founder_note" defaultValue={page.founder_note} rows={2} className={input} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>Risk-reversal line (under the quiz)</span>
            <input name="risk_reversal" defaultValue={page.risk_reversal} className={input} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>&ldquo;Your action plan includes&rdquo; items (one per line, max 4; blank = hide the card)</span>
            <textarea name="plan_items" defaultValue={page.plan_items.join('\n')} rows={3} className={input} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>Sticky mobile button label</span>
            <input name="sticky_cta" defaultValue={page.sticky_cta} className={input} />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1"><span className={label}>Exit pop-up heading</span>
              <span className={hint}>Blank turns the exit pop-up off.</span>
              <input name="exit_heading" defaultValue={page.exit_heading} className={input} />
            </label>
            <label className="space-y-1"><span className={label}>Exit pop-up text</span>
              <textarea name="exit_body" defaultValue={page.exit_body} rows={2} className={input} />
            </label>
          </div>
        </div>

        <label className="block space-y-1"><span className={label}>FAQs</span>
          <span className={hint}>Pairs of “Q: …” and “A: …” lines; blank line between FAQs.</span>
          <textarea name="faqs" defaultValue={faqsText} rows={8} className={input} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1"><span className={label}>Meta title</span>
            <input name="meta_title" defaultValue={page.meta_title} className={input} />
          </label>
          <label className="space-y-1"><span className={label}>Meta description</span>
            <input name="meta_description" defaultValue={page.meta_description} className={input} />
          </label>
        </div>

        <button className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">Save changes</button>
      </form>
      </>)}
    </div>
  )
}
