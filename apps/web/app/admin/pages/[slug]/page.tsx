import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { saveLocationContent } from '../actions'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string }; searchParams: { saved?: string; error?: string } }

// Edit a CareAssura location landing page's copy — same friendly text formats
// as the TRG /go/ editor: bullets one per line, "Title:/Body:" blocks, "Q:/A:" FAQs.
export default async function EditLocationPage({ params, searchParams }: Props) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { data: page } = await db.from('location_pages').select('*').eq('slug', params.slug).maybeSingle()
  if (!page) notFound()

  const c = (page.content ?? {}) as any
  const hero = c.hero ?? {}
  const save = saveLocationContent.bind(null, page.slug)

  const input = 'w-full rounded-md border bg-background px-3 py-2 text-sm'
  const label = 'text-sm font-medium'
  const hint = 'text-xs text-muted-foreground'
  const tb = (arr: Array<{ title: string; body: string }> | undefined) =>
    (arr ?? []).map(x => `Title: ${x.title}\nBody: ${x.body}`).join('\n\n')
  const qa = (arr: Array<{ question: string; answer: string }> | undefined) =>
    (arr ?? []).map(x => `Q: ${x.question}\nA: ${x.answer}`).join('\n\n')

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:underline">← Landing Pages</Link>
        <h1 className="mt-1 text-2xl font-semibold">{page.area_name}</h1>
        <a href={`https://${page.slug}.careassura.com/`} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:underline">
          {page.slug}.careassura.com {page.status !== 'published' && '(draft)'}
        </a>
      </div>

      {searchParams.saved && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Saved. The live page updates within a minute (it&apos;s cached for 60 seconds).
        </p>
      )}
      {searchParams.error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">Could not save: {searchParams.error}</p>
      )}

      <form action={save} className="space-y-5 rounded-md border bg-white p-5">
        <div className="rounded-md border bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold">Hero</p>
          <label className="block space-y-1"><span className={label}>Eyebrow</span>
            <input name="hero_eyebrow" defaultValue={hero.eyebrow ?? ''} className={input} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>Headline</span>
            <span className={hint}>Blank uses the default: &ldquo;Find a brilliant care home in {page.area_name}.&rdquo;</span>
            <input name="hero_headline" defaultValue={hero.headline ?? ''} className={input} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>Subheadline</span>
            <textarea name="hero_subheadline" defaultValue={hero.subheadline ?? ''} rows={3} className={input} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>Bullets (one per line)</span>
            <textarea name="hero_bullets" defaultValue={(hero.bullets ?? []).join('\n')} rows={3} className={input} />
          </label>
        </div>

        <label className="block space-y-1"><span className={label}>Stats</span>
          <span className={hint}>One per line as &ldquo;value | label&rdquo;, e.g. Free | for families, always.</span>
          <textarea name="stats" defaultValue={((c.stats ?? []) as Array<{ value: string; label: string }>).map(x => `${x.value} | ${x.label}`).join('\n')} rows={3} className={input} />
        </label>

        <div className="rounded-md border bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold">How it works</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1"><span className={label}>Eyebrow</span>
              <input name="hiw_eyebrow" defaultValue={c.howItWorks?.eyebrow ?? ''} className={input} />
            </label>
            <label className="space-y-1"><span className={label}>Heading</span>
              <input name="hiw_heading" defaultValue={c.howItWorks?.heading ?? ''} className={input} />
            </label>
          </div>
          <label className="mt-3 block space-y-1"><span className={label}>Steps</span>
            <span className={hint}>Blocks of &ldquo;Title: …&rdquo; and &ldquo;Body: …&rdquo;; blank line between steps.</span>
            <textarea name="hiw_steps" defaultValue={tb(c.howItWorks?.steps)} rows={8} className={input} />
          </label>
        </div>

        <div className="rounded-md border bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold">Why families choose us</p>
          <label className="block space-y-1"><span className={label}>Heading</span>
            <input name="why_heading" defaultValue={c.whyUs?.heading ?? ''} className={input} />
          </label>
          <label className="mt-3 block space-y-1"><span className={label}>Points</span>
            <span className={hint}>Blocks of &ldquo;Title: …&rdquo; and &ldquo;Body: …&rdquo;; blank line between points.</span>
            <textarea name="why_points" defaultValue={tb(c.whyUs?.points)} rows={10} className={input} />
          </label>
        </div>

        <label className="block space-y-1"><span className={label}>FAQs</span>
          <span className={hint}>Pairs of &ldquo;Q: …&rdquo; and &ldquo;A: …&rdquo; lines; blank line between FAQs.</span>
          <textarea name="faq" defaultValue={qa(c.faq)} rows={10} className={input} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1"><span className={label}>Meta title</span>
            <input name="meta_title" defaultValue={page.meta_title ?? ''} className={input} />
          </label>
          <label className="space-y-1"><span className={label}>Meta description</span>
            <input name="meta_description" defaultValue={page.meta_description ?? ''} className={input} />
          </label>
        </div>

        <button className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">Save changes</button>
      </form>
    </div>
  )
}
