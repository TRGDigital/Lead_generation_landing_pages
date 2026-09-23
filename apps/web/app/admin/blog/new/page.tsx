import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { getAllAuthors, getPostChoices, DEFAULT_POST_SERVICE_LINKS } from '@/lib/blog'
import { SITE_PAGES } from '@/lib/site-pages'
import BlogEditor from '@/components/admin/BlogEditor'

export const metadata: Metadata = { title: 'New post — Admin' }

export default async function NewBlogPostPage() {
  await requireAdmin()
  const [authors, postChoices] = await Promise.all([getAllAuthors(), getPostChoices()])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        href="/admin/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand-ink-muted hover:text-brand-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        All posts
      </Link>
      <h1 className="mb-6 font-display text-2xl font-semibold text-brand-ink">New post</h1>
      <BlogEditor
        post={null}
        authors={authors}
        postChoices={postChoices}
        serviceChoices={SITE_PAGES.filter((p) => p.group === 'Services').map((p) => ({ value: p.path, label: p.label }))}
        defaultServiceLinks={DEFAULT_POST_SERVICE_LINKS}
      />
    </div>
  )
}
