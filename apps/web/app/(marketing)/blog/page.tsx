import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { getPublishedPosts, getCategories, formatDate } from '@/lib/blog'
import PostCard from '@/components/blog/PostCard'
import { Star, Squiggle, Dots } from '@/components/marketing/Decor'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Knowledge Hub — Care Sector Marketing & Software Insights | TRG Digital',
  description:
    'Guides, analysis and practical advice for UK care providers — marketing, websites, SEO, enquiries and care software, from the TRG Digital team.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'TRG Digital Knowledge Hub',
    description: 'Insight for the UK care sector: marketing, websites, SEO and care software.',
    type: 'website',
    url: `${SITE_URL}/blog`,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

type Props = { searchParams: { page?: string; search?: string } }

export default async function BlogIndexPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const search = searchParams.search?.trim() ?? ''

  const [{ posts, total }, categories] = await Promise.all([getPublishedPosts(page), getCategories()])

  const totalPages = Math.ceil(total / 10)

  const filteredPosts = search
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(search.toLowerCase()),
      )
    : posts

  // Feature the latest post on page 1 (when not searching).
  const showFeatured = page === 1 && !search && filteredPosts.length > 0
  const featured = showFeatured ? filteredPosts[0] : null
  const gridPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts

  return (
    <>
      {/* JSON-LD — Blog */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'TRG Digital Knowledge Hub',
            description: 'Insight for the UK care sector: marketing, websites, SEO and care software.',
            url: `${SITE_URL}/blog`,
            publisher: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-12 pt-16">
        <Star className="absolute left-6 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 top-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <Dots className="absolute bottom-4 right-1/4 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Knowledge Hub</p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
            Insight for the care sector
          </h1>
          <div className="mt-5 flex justify-center">
            <Squiggle className="h-6 w-56 text-brand-pop" />
          </div>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
            Guides, analysis and practical advice on marketing, websites, SEO, enquiries and care software — for
            UK care providers.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        {/* Search + category filter */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <form method="get" action="/blog" className="relative max-w-sm flex-1">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search articles…"
              className="w-full rounded-xl border border-brand-line bg-white px-4 py-2.5 pr-10 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
            />
          </form>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="rounded-full border border-brand-pop bg-brand-pop px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/category/${encodeURIComponent(cat)}`}
                  className="rounded-full border border-brand-line px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-ink-soft transition-colors hover:border-brand-pop hover:text-brand-pop"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Featured post */}
        {featured && (
          <article className="group mb-12 grid overflow-hidden rounded-3xl border border-brand-line bg-white shadow-soft transition-shadow hover:shadow-card lg:grid-cols-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-bg-warm lg:aspect-auto">
              {featured.hero_image_url ? (
                <Image src={featured.hero_image_url} alt={featured.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-4xl font-semibold text-brand-line">TRG</span>
                </div>
              )}
              <span className="absolute left-5 top-5 rounded-full bg-brand-pop px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Latest</span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div className="flex items-center gap-3 text-xs text-brand-ink-muted">
                {featured.category && <span className="rounded-full bg-brand-pop/10 px-2.5 py-0.5 font-medium text-brand-pop">{featured.category}</span>}
                {featured.reading_minutes && (
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.reading_minutes} min read</span>
                )}
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink transition-colors group-hover:text-brand-pop sm:text-3xl">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-ink-soft">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-brand-ink-muted">
                {featured.author && <span className="font-medium text-brand-ink-soft">{featured.author.name}</span>}
                {featured.published_at && <span>· {formatDate(featured.published_at)}</span>}
              </div>
              <Link href={`/blog/${featured.slug}`} className="btn-pop mt-6 w-fit">
                Read now
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </article>
        )}

        {/* Grid */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-brand-line bg-white p-12 text-center text-brand-ink-muted">
            {search ? `No articles found for "${search}".` : 'No articles published yet.'}
          </div>
        ) : gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}

        {/* Pagination */}
        {totalPages > 1 && !search && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link href={`/blog?page=${page - 1}`} className="rounded-xl border border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink-soft hover:border-brand-pop hover:text-brand-pop">
                ← Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}`}
                className={`h-9 w-9 rounded-xl text-center text-sm font-semibold leading-9 transition-colors ${
                  p === page ? 'bg-brand-pop text-white' : 'border border-brand-line text-brand-ink-soft hover:border-brand-pop hover:text-brand-pop'
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link href={`/blog?page=${page + 1}`} className="rounded-xl border border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink-soft hover:border-brand-pop hover:text-brand-pop">
                Next →
              </Link>
            )}
          </div>
        )}

        {/* CTA strip */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-3xl bg-brand-ink px-8 py-8 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight">Want this for your home?</h2>
            <p className="mt-1 text-sm text-white/70">Let&apos;s turn insight into enquiries.</p>
          </div>
          <Link href="/contact" className="btn-cta btn-on-dark shrink-0">
            Start your project
            <span className="btn-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </>
  )
}
