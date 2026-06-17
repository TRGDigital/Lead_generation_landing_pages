'use client'

import dynamic from 'next/dynamic'
import { useRef, useState, useEffect, useTransition } from 'react'
import { saveBlogPost } from '@/app/admin/blog/actions'
import type { PostWithAuthor, Author } from '@/lib/blog'
import '@uiw/react-md-editor/dist/markdown-editor.css'

// react-md-editor v3 (CJS) — v4 pulls ESM-only rehype deps that break Next 14's
// webpack with "Cannot read properties of undefined (reading 'call')".
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

type Props = {
  post: PostWithAuthor | null
  authors: Author[]
}

export default function BlogEditor({ post, authors }: Props) {
  const [body, setBody] = useState(post?.body_mdx ?? '')
  const [heroUrl, setHeroUrl] = useState(post?.hero_image_url ?? '')
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
      const fd = new FormData()
      fd.append('file', file)
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
            <img src={heroUrl} alt="" className="mb-2 h-32 w-full rounded-lg border border-brand-line object-cover" />
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
        </div>
      </div>

      {/* MDX body — full width */}
      <div>
        <label className="block text-sm font-medium text-brand-ink mb-1">Body (MDX)</label>
        <div data-color-mode="light">
          <MDEditor
            value={body}
            onChange={(v) => setBody(v ?? '')}
            height={520}
            preview="live"
          />
        </div>
      </div>

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
