import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { getAllPostsForAdmin } from '@/lib/blog'
import BlogPostRow from './BlogPostRow'

export const metadata: Metadata = { title: 'Blog — Admin' }

export default async function AdminBlogPage() {
  await requireAdmin()
  const posts = await getAllPostsForAdmin()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-ink">Blog posts</h1>
          <p className="mt-1 text-sm text-brand-ink-muted">{posts.length} total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-brand-line bg-white p-12 text-center text-brand-ink-muted">
          No posts yet. Create your first post.
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line bg-brand-bg-warm">
                <th className="px-4 py-3 text-left font-semibold text-brand-ink">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-ink hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-ink hidden md:table-cell">Updated</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-ink">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <BlogPostRow key={post.id} post={post} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
