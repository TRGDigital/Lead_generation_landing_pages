'use client'

import { useRef, useState, useEffect, useTransition } from 'react'
import { saveBlogPost } from '@/app/admin/blog/actions'
import type { PostWithAuthor, Author } from '@/lib/blog'
import RichEditor from '@/components/admin/RichEditor'
import BlogImageAltEditor from '@/components/admin/BlogImageAltEditor'
import BlogFaqEditor, { type BlogFaq } from '@/components/admin/BlogFaqEditor'
import BlogLinksEditor, { type LinkChoice } from '@/components/admin/BlogLinksEditor'
import { isHtmlBody, mdToHtml } from '@/lib/mdx-or-html'
import { resizeImage } from '@/lib/image-resize'

type Props = {
  post: PostWithAuthor | null
  authors: Author[]
  postChoices: LinkChoice[]
  serviceChoices: LinkChoice[]
  defaultServiceLinks: string[]
}

export default function BlogEditor({ post, authors, postChoices, serviceChoices, defaultServiceLinks }: Props) {
  // Body is stored as HTML. Legacy markdown posts are converted on load so the
  // visual editor shows them formatted rather than as raw markdown.
  const initialBody = post?.body_mdx ?? ''
  const [body, setBody] = useState(isHtmlBody(initialBody) ? initialBody : mdToHtml(initialBody))
  const [heroUrl, setHeroUrl] = useState(post?.hero_image_url ?? '')
  const [heroAlt, setHeroAlt] = useState((post as { hero_image_alt?: string | null } | null)?.hero_image_alt ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Auto-save every 30 s when editing an existing post
  useEffect(() => {
    if (!post?.id) return
    autoSaveTimer.current = setInterval(() => {
      handleSave()
    }, 30_000)
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id, body])

  function handleSave() {
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    fd.set('body_mdx', body)
    startTransition(async () => {
      await saveBlogPost(post?.id ?? null, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  async function uploadHero(file: File) {
    setUploadError('')
    setUploading(true)
    try {
      const optimised = await resizeImage(file)
      const fd = new FormData()
      fd.append('file', optimised)
      const res = await fetch('/api/admin/blog/upload-image', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      setHeroUrl(data.url)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-1">Title</label>
        <input
          name="title"
          required
          defaultValue={post?.title ?? ''}
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-1">Slug</label>
        <input
          name="slug"
          defaultValue={post?.slug ?? ''}
          placeholder="auto-generated from title if blank"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-1">Excerpt</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ''}
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
        />
      </div>

      {/* Two-column meta */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Category</label>
          <input
            name="category"
            defaultValue={post?.category ?? ''}
            className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Tags (comma-separated)</label>
          <input
            name="tags"
            defaultValue={post?.tags?.join(', ') ?? ''}
            className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Author</label>
          <select
            name="author_id"
            defaultValue={post?.author_id ?? ''}
            className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          >
            <option value="">— none —</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Hero image</label>
          {heroUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroUrl} alt={heroAlt} className="mb-2 h-32 w-full rounded-lg border border-brand-line object-cover" />
          )}
          <div className="mb-2 flex items-center gap-3">
            <label className="cursor-pointer rounded-lg border border-brand-line px-3 py-2 text-sm hover:bg-brand-line/20">
              {uploading ? 'Uploading…' : heroUrl ? 'Replace image' : 'Upload image'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void uploadHero(f)
                  e.target.value = ''
                }}
              />
            </label>
            {heroUrl && (
              <button type="button" onClick={() => setHeroUrl('')} className="text-sm text-red-600 hover:underline">
                Remove
              </button>
            )}
          </div>
          {uploadError && <p className="mb-1 text-xs text-red-600">{uploadError}</p>}
          <input
            name="hero_image_url"
            type="url"
            value={heroUrl}
            onChange={(e) => setHeroUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          />
          {heroUrl && (
            <input
              name="hero_image_alt"
              value={heroAlt}
              onChange={(e) => setHeroAlt(e.target.value)}
              placeholder="Hero image alt text (describe the image)"
              className="mt-2 w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          )}
        </div>
      </div>

      {/* Body — visual editor (stores HTML) */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-1">Body</label>
        <RichEditor
          value={body}
          onChange={setBody}
          rows={20}
          placeholder="Write your post here. Use the Style dropdown for headings, and the toolbar for bold, lists, links and quotes."
        />
      </div>

      {/* Image alt text */}
      <details className="rounded-xl border border-brand-line">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-brand-ink">Image alt text</summary>
        <div className="px-4 pb-4 pt-2">
          <BlogImageAltEditor body={body} onChange={setBody} />
        </div>
      </details>

      {/* FAQs (shown in an accordion below the CTA on the live post) */}
      <details className="rounded-xl border border-brand-line">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-brand-ink">FAQs</summary>
        <div className="px-4 pb-4 pt-2">
          <BlogFaqEditor initial={(post as { faqs?: BlogFaq[] } | null)?.faqs ?? []} />
        </div>
      </details>

      {/* Internal links shown at the foot of the live post */}
      <details className="rounded-xl border border-brand-line">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-brand-ink">Related posts &amp; service links</summary>
        <div className="px-4 pb-4 pt-2">
          <BlogLinksEditor
            posts={postChoices}
            services={serviceChoices}
            initialPosts={(post as { related_slugs?: string[] | null } | null)?.related_slugs ?? []}
            initialServices={(post as { service_links?: string[] | null } | null)?.service_links ?? []}
            defaultServices={defaultServiceLinks}
          />
        </div>
      </details>

      {/* SEO */}
      <details className="rounded-xl border border-brand-line">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-brand-ink">SEO / Advanced</summary>
        <div className="space-y-4 px-4 pb-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-brand-ink mb-1">Meta title</label>
            <input
              name="meta_title"
              defaultValue={post?.meta_title ?? ''}
              className="w-full rounded-xl border border-brand-line px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-ink mb-1">Meta description</label>
            <textarea
              name="meta_description"
              rows={2}
              defaultValue={post?.meta_description ?? ''}
              className="w-full rounded-xl border border-brand-line px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-ink mb-1">Canonical URL</label>
            <input
              name="canonical_url"
              type="url"
              defaultValue={post?.canonical_url ?? ''}
              className="w-full rounded-xl border border-brand-line px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save draft'}
        </button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
        <span className="ml-auto text-xs text-brand-ink-muted">Auto-saves every 30 s</span>
      </div>
    </form>
  )
}
