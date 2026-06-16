import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedPosts, getCategories } from '@/lib/blog'
import PostCard from '@/components/blog/PostCard'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Blog — Care Home Occupancy & Marketing Insights | CareBeds',
  description:
    'Expert guides on care home occupancy, marketing, and operations. Read the latest from the CareBeds team.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'CareBeds Blog — Occupancy & Marketing Insights',
    description: 'Expert guides on care home occupancy, marketing, and operations.',
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

  const [{ posts, total }, categories] = await Promise.all([
    getPublishedPosts(page),
    getCategories(),
  ])

  const totalPages = Math.ceil(total / 10)

  const filteredPosts = search
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    : posts

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
            name: 'CareBeds Blog',
            description: 'Expert guides on care home occupancy, marketing, and operations.',
            url: `${SITE_URL}/blog`,
            publisher: { '@type': 'Organization', name: 'CareBeds', url: SITE_URL },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="px-6 pt-14 pb-10 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Blog</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-brand-ink">
            Occupancy & marketing insights
          </h1>
          <p className="mt-3 text-brand-ink-soft">
            Guides, analysis, and practical advice for UK care home operators.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        {/* Search + Category filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <form method="get" action="/blog" className="relative flex-1 max-w-sm">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search articles…"
              className="w-full rounded-xl border border-brand-line bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </form>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="rounded-full border border-brand-line px-3 py-1 text-xs font-medium text-brand-ink-soft hover:border-brand-accent hover:text-brand-accent transition-colors"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog/category/${encodeURIComponent(cat)}`}
                  className="rounded-full border border-brand-line px-3 py-1 text-xs font-medium text-brand-ink-soft hover:border-brand-accent hover:text-brand-accent transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-brand-line bg-white p-12 text-center text-brand-ink-muted">
            {search ? `No articles found for "${search}".` : 'No articles published yet.'}
          </div>
        ) : (
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !search && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="rounded-xl border border-brand-line px-4 py-2 text-sm font-medium text-brand-ink-soft hover:border-brand-ink hover:text-brand-ink"
              >
                ← Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}`}
                className={`h-9 w-9 rounded-xl text-center text-sm font-medium leading-9 transition-colors ${
                  p === page
                    ? 'bg-brand-accent text-brand-ink'
                    : 'border border-brand-line text-brand-ink-soft hover:border-brand-ink hover:text-brand-ink'
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="rounded-xl border border-brand-line px-4 py-2 text-sm font-medium text-brand-ink-soft hover:border-brand-ink hover:text-brand-ink"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}
