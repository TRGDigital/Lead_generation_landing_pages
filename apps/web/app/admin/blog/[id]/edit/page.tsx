import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { getPostByIdForAdmin, getAllAuthors } from '@/lib/blog'
import BlogEditor from '@/components/admin/BlogEditor'
import { publishBlogPost, unpublishBlogPost } from '../../actions'

export const metadata: Metadata = { title: 'Edit post — Admin' }

type Props = { params: { id: string } }

export default async function EditBlogPostPage({ params }: Props) {
  await requireAdmin()
  const [post, authors] = await Promise.all([
    getPostByIdForAdmin(params.id),
    getAllAuthors(),
  ])

  if (!post) notFound()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-brand-ink-muted hover:text-brand-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>

        <div className="flex items-center gap-3">
          {post.is_published ? (
            <>
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="text-xs text-brand-accent underline"
              >
                View live
              </Link>
              <form action={unpublishBlogPost.bind(null, post.id)}>
                <button className="rounded-xl border border-brand-line px-3 py-1.5 text-xs font-semibold text-brand-ink-soft hover:border-brand-ink">
                  Unpublish
                </button>
              </form>
            </>
          ) : (
            <form action={publishBlogPost.bind(null, post.id)}>
              <button className="rounded-xl bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                Publish
              </button>
            </form>
          )}
        </div>
      </div>

      <h1 className="mb-6 font-display text-2xl font-semibold text-brand-ink">Edit post</h1>
      <BlogEditor post={post} authors={authors} />
    </div>
  )
}
