import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPublishedPosts, getCategories } from '@/lib/blog'
import PostCard from '@/components/blog/PostCard'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

type Props = { params: { category: string }; searchParams: { page?: string } }

export async function generateStaticParams() {
  const categories = await getCategories()
  // Skip empty/blank categories — an empty slug would emit '/blog/category',
  // which collides with the '/blog/category/[category]' route and fails the build.
  return categories
    .filter((category) => typeof category === 'string' && category.trim().length > 0)
    .map((category) => ({ category: encodeURIComponent(category) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category)
  return {
    title: `${category} — CareBeds Blog`,
    description: `Read CareBeds articles about ${category.toLowerCase()}.`,
    alternates: { canonical: `${SITE_URL}/blog/category/${params.category}` },
    robots: { index: true, follow: true },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = decodeURIComponent(params.category)
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))

  const { posts, total } = await getPublishedPosts(page, category)
  const totalPages = Math.ceil(total / 10)

  return (
    <>
      <section className="px-6 pt-14 pb-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand-ink-muted hover:text-brand-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>
          <h1 className="font-display text-4xl font-semibold text-brand-ink">{category}</h1>
          <p className="mt-2 text-brand-ink-soft">{total} article{total !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-brand-line bg-white p-12 text-center text-brand-ink-muted">
            No articles in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link href={`/blog/category/${params.category}?page=${page - 1}`} className="rounded-xl border border-brand-line px-4 py-2 text-sm font-medium text-brand-ink-soft hover:border-brand-ink">
                ← Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/blog/category/${params.category}?page=${page + 1}`} className="rounded-xl border border-brand-line px-4 py-2 text-sm font-medium text-brand-ink-soft hover:border-brand-ink">
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}
