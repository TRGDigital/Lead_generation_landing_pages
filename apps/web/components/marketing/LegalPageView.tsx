import { notFound } from 'next/navigation'
import { getLegalPage } from '@/lib/legal'

export async function LegalPageView({ slug }: { slug: string }) {
  const page = await getLegalPage(slug)
  if (!page) notFound()

  const updated = (() => {
    try {
      return new Date(page.updated_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    } catch {
      return ''
    }
  })()

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold text-brand-ink">{page.title}</h1>
        {updated && <p className="mt-2 text-sm text-brand-ink-muted">Last updated: {updated}</p>}
        <div className="blog-html mt-10" dangerouslySetInnerHTML={{ __html: page.body_html }} />
      </div>
    </section>
  )
}
