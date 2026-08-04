import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getGoPage } from '@/lib/go-pages'
import { saveGoPage, deleteGoPage } from '../actions'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string }; searchParams: { saved?: string } }

// Edit one TRG ad page. Friendly text formats: bullets one per line; proof as
// "stat | label"; quiz as "Q: …" + "- option" blocks; FAQs as "Q: …" / "A: …".
export default async function EditGoPage({ params, searchParams }: Props) {
  await requireAdmin()
  const page = await getGoPage(params.slug)
  if (!page) notFound()

  const save = saveGoPage.bind(null, page.slug)
  const remove = deleteGoPage.bind(null, page.slug)

  const input = 'w-full rounded-md border bg-background px-3 py-2 text-sm'
  const label = 'text-sm font-medium'
  const hint = 'text-xs text-muted-foreground'
  const questionsText = page.questions.map((q) => [`Q: ${q.q}`, ...q.options.map((o) => `- ${o}`)].join('\n')).join('\n\n')
  const faqsText = page.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')
  const proofText = page.proof.map((p) => `${p.stat} | ${p.label}`).join('\n')

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

      {searchParams.saved && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">Saved.</p>
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
          <textarea name="proof" defaultValue={proofText} rows={3} className={input} />
        </label>
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
    </div>
  )
}
