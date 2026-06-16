'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { Edit, Globe, EyeOff, Trash2 } from 'lucide-react'
import { publishBlogPost, unpublishBlogPost, deleteBlogPost } from './actions'
import type { PostWithAuthor } from '@/lib/blog'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogPostRow({ post }: { post: PostWithAuthor }) {
  const [isPending, startTransition] = useTransition()

  return (
    <tr className="border-b border-brand-line/50 last:border-0 hover:bg-brand-bg-warm/30">
      <td className="px-4 py-3">
        <Link href={`/admin/blog/${post.id}/edit`} className="font-medium text-brand-ink hover:text-brand-accent">
          {post.title}
        </Link>
        <p className="text-xs text-brand-ink-muted font-mono">{post.slug}</p>
      </td>
      <td className="px-4 py-3 text-brand-ink-soft hidden sm:table-cell">
        {post.category ?? <span className="text-brand-ink-muted">—</span>}
      </td>
      <td className="px-4 py-3 text-brand-ink-muted hidden md:table-cell">
        {formatDate(post.updated_at)}
      </td>
      <td className="px-4 py-3">
        {post.is_published ? (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Published</span>
        ) : (
          <span className="rounded-full bg-brand-bg-warm px-2.5 py-0.5 text-xs font-medium text-brand-ink-muted">Draft</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/blog/${post.id}/edit`}
            className="rounded-lg p-1.5 text-brand-ink-muted hover:bg-brand-bg-warm hover:text-brand-ink"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Link>

          {post.is_published ? (
            <button
              onClick={() => startTransition(() => unpublishBlogPost(post.id))}
              disabled={isPending}
              className="rounded-lg p-1.5 text-brand-ink-muted hover:bg-brand-bg-warm hover:text-brand-ink disabled:opacity-40"
              title="Unpublish"
            >
              <EyeOff className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => startTransition(() => publishBlogPost(post.id))}
              disabled={isPending}
              className="rounded-lg p-1.5 text-brand-ink-muted hover:bg-brand-bg-warm hover:text-brand-ink disabled:opacity-40"
              title="Publish"
            >
              <Globe className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => {
              if (confirm(`Delete "${post.title}"? This cannot be undone.`)) {
                startTransition(() => deleteBlogPost(post.id))
              }
            }}
            disabled={isPending}
            className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
