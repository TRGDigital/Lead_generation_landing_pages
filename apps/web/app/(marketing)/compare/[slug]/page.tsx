import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { getAllPublishedSlugs } from '@/lib/blog'
import { COMPARISONS, getComparison } from '@/lib/comparisons'
import { CountyHero, EndCta, FaqJsonLd, Faqs, Prose } from '@/components/marketing/county/CountySections'
import { ComparisonTable, ScorecardCard } from '@/components/marketing/Scorecard'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'

// "A care specialist vs X": one template, content in lib/comparisons.ts. Same shape and
// scorecard as /why-a-care-specialist, which covers all the options at once; these pages
// go deeper on one at a time.

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = getComparison(slug)
  if (!c) return {}
  const path = `/compare/${c.slug}`
  return applyPageSeo(path, {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { title: `${c.metaTitle} | TRG Digital`, description: c.metaDescription, url: `${SITE_URL}${path}` },
  })
}

/** Blog slugs that are live, so links to drafts are never rendered. Empty if the DB is unreachable. */
async function publishedSlugs(): Promise<Set<string>> {
  try {
    return new Set(await getAllPublishedSlugs())
  } catch {
    return new Set()
  }
}

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g
const LINK_CLASS = 'font-semibold text-brand-pop underline underline-offset-2'

/**
 * Turns [text](/path) in registry copy into links. A /blog/ link whose post is not
 * published renders as its plain text instead, so the sentence still reads.
 */
function renderCopy(text: string, published: Set<string>): React.ReactNode {
  const out: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(LINK)) {
    const whole = m[0]
    const label = m[1] ?? whole
    const href = m[2] ?? '/'
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    const blogSlug = href.startsWith('/blog/') ? href.slice('/blog/'.length) : null
    if (blogSlug !== null && !published.has(blogSlug)) {
      out.push(label)
    } else {
      out.push(
        <Link key={at} href={href} className={LINK_CLASS}>
          {label}
        </Link>,
      )
    }
    last = at + whole.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out.length === 1 ? out[0] : <>{out}</>
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getComparison(slug)
  if (!c) notFound()

  const published = await publishedSlugs()
  const copy = (t: string) => renderCopy(t, published)
  const path = `/compare/${c.slug}`
  const related = c.related.filter((r) => published.has(r.slug))
  const others = COMPARISONS.filter((o) => o.slug !== c.slug)

  const tableRows = c.rows.map((r) => ({ label: r.criterion, marks: [r.trg, r.them], note: r.note }))
  const cardRows = c.rows.flatMap((r) => (r.short ? [{ short: r.short, marks: [r.trg, r.them] }] : []))

  return (
    <main>
      <Breadcrumbs trail={[['Compare', '/compare'], [c.title, path]]} />
      <FaqJsonLd faqs={c.faqs} />

      <CountyHero
        eyebrow={c.hero.eyebrow}
        before={c.hero.before}
        highlight={c.hero.highlight}
        intro={
          <>
            {c.hero.intro.map((p, i) => (
              <p key={i}>{copy(p)}</p>
            ))}
          </>
        }
        points={c.hero.points}
        primary={{ label: 'See the comparison', href: '#compare' }}
        secondary={{ label: 'Free audit', href: '/site-audit' }}
        mock={
          <ScorecardCard
            title={c.scorecardTitle}
            options={[c.columns.us, c.columns.them]}
            rows={cardRows}
            footer={c.scorecardFooter}
          />
        }
      />

      <section id="compare" className="scroll-mt-24 bg-brand-bg-warm px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            {c.tableHeading}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-brand-ink-soft">
            A tick means it is a strength of that option, a dash means it depends on who does the work, a cross means it
            is usually missing.
          </p>
          <ComparisonTable
            options={[c.columns.us.table, c.columns.them.table]}
            rows={tableRows}
            minWidth="min-w-0"
          />
        </div>
      </section>

      <Prose
        sections={c.sections.map((s) => ({
          heading: s.heading,
          paragraphs: s.paragraphs.map(copy),
          sub: s.sub?.map((h) => ({ heading: h.heading, body: copy(h.body) })),
        }))}
      />

      <Prose tone="warm" sections={[{ heading: c.rightChoice.heading, paragraphs: c.rightChoice.paragraphs.map(copy) }]} />

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl rounded-3xl border-2 border-brand-ink bg-white p-8 shadow-[4px_4px_0_0_#2a2620]">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">{c.checklist.heading}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {c.checklist.items.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-brand-ink-soft">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                {q}
              </li>
            ))}
          </ul>
          {c.checklist.footer && <p className="mt-5 text-sm text-brand-ink-soft">{copy(c.checklist.footer)}</p>}
        </div>
      </section>

      <Faqs heading="Common questions" faqs={c.faqs} />

      <section className="bg-brand-bg-warm px-6 py-14">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
          {related.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">Further reading</h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="group flex items-start gap-2 text-base text-brand-ink-soft">
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-brand-pop" />
                      <span className="font-semibold text-brand-ink underline-offset-2 group-hover:underline">{r.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={related.length > 0 ? '' : 'md:col-span-2'}>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">Other comparisons</h2>
            <ul className="mt-4 space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/compare/${o.slug}`} className="group flex items-start gap-2 text-base text-brand-ink-soft">
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-brand-pop" />
                    <span className="font-semibold text-brand-ink underline-offset-2 group-hover:underline">{o.title}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/why-a-care-specialist" className="group flex items-start gap-2 text-base text-brand-ink-soft">
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-brand-pop" />
                  <span className="font-semibold text-brand-ink underline-offset-2 group-hover:underline">
                    All four options side by side
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 rounded-3xl border-2 border-brand-ink bg-white p-6 shadow-[4px_4px_0_0_#2a2620] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-pop">Free buyer&apos;s guide</p>
            <p className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-brand-ink">
              Still weighing it up?
            </p>
            <p className="mt-1 text-sm text-brand-ink-soft">
              Take the questions with you: a printable checklist for choosing any website agency, with a scorecard to
              compare them side by side.
            </p>
          </div>
          <Link href="/guides/choosing-a-care-website-agency" className="btn-cta flex-shrink-0">
            Get the guide
          </Link>
        </div>
      </section>

      <EndCta
        title={c.cta.title}
        body={c.cta.body}
        primary={{ label: 'Get a free audit', href: '/site-audit' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </main>
  )
}
