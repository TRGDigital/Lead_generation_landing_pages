'use client'

import { useRef, useState, useTransition } from 'react'
import { ExternalLink, Loader2, Upload, X } from 'lucide-react'
import { SITE_PAGES, SITE_PAGE_GROUPS } from '@/lib/site-pages'
import type { PageSeoRow } from '@/lib/page-seo'
import { savePageSeo } from '@/app/admin/seo/actions'
import { resizeImage } from '@/lib/image-resize'

export default function PageSeoEditor({ overrides, siteUrl }: { overrides: Record<string, PageSeoRow>; siteUrl: string }) {
  return (
    <div className="space-y-8">
      {SITE_PAGE_GROUPS.map((group) => {
        const pages = SITE_PAGES.filter((p) => p.group === group)
        if (pages.length === 0) return null
        return (
          <div key={group}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">{group}</h2>
            <div className="space-y-3">
              {pages.map((p) => (
                <Row key={p.path} path={p.path} label={p.label} siteUrl={siteUrl} initial={overrides[p.path]} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Row({ path, label, siteUrl, initial }: { path: string; label: string; siteUrl: string; initial?: PageSeoRow }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [canonical, setCanonical] = useState(initial?.canonical ?? '')
  const [ogImage, setOgImage] = useState(initial?.og_image ?? '')
  const [ogImageAlt, setOgImageAlt] = useState(initial?.og_image_alt ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const customised = !!(initial?.title || initial?.description || initial?.canonical || initial?.og_image)
  const defaultCanonical = `${siteUrl}${path === '/' ? '' : path}`

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      // Downscale to a clean 1200px social JPEG in the browser (stays under
      // Vercel's ~4.5MB request cap regardless of the original photo size).
      const optimised = await resizeImage(file, 1200, 0.85, 'image/jpeg')
      const fd = new FormData()
      fd.set('file', optimised)
      const res = await fetch('/api/admin/blog/upload-image', { method: 'POST', body: fd })
      const body = await res.json().catch(() => ({}) as any)
      if (!res.ok || !body.url) throw new Error(body?.error || 'Upload failed. Please try a JPG or PNG.')
      setOgImage(body.url)
    } catch (err: any) {
      setUploadError(err?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function save() {
    const fd = new FormData()
    fd.set('title', title)
    fd.set('description', description)
    fd.set('canonical', canonical)
    fd.set('og_image', ogImage)
    fd.set('og_image_alt', ogImageAlt)
    startTransition(async () => {
      await savePageSeo(path, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const input = 'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30'

  return (
    <details className="group rounded-xl border border-brand-line bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-brand-ink">{label}</span>
          <span className="font-mono text-xs text-brand-ink-muted">{path}</span>
          {customised && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">custom</span>}
        </span>
        <a href={`${siteUrl}${path === '/' ? '' : path}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-brand-ink-muted hover:text-brand-ink" title="View page">
          <ExternalLink className="h-4 w-4" />
        </a>
      </summary>
      <div className="space-y-3 border-t border-brand-line px-4 py-4">
        <label className="block">
          <span className="mb-1 flex items-center justify-between text-xs font-medium text-brand-ink">
            <span>Meta title</span>
            <span className={title.length > 60 ? 'text-amber-600' : 'text-brand-ink-muted'}>{title.length}/60</span>
          </span>
          <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Leave blank to use the page’s built-in title" />
        </label>
        <label className="block">
          <span className="mb-1 flex items-center justify-between text-xs font-medium text-brand-ink">
            <span>Meta description</span>
            <span className={description.length > 160 ? 'text-amber-600' : 'text-brand-ink-muted'}>{description.length}/160</span>
          </span>
          <textarea className={input} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Leave blank to use the page’s built-in description" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-brand-ink">Canonical URL</span>
          <input className={input} value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder={defaultCanonical} />
          <span className="mt-1 block text-[11px] text-brand-ink-muted">Blank uses the default: {defaultCanonical}</span>
        </label>

        {/* Social share image (og:image) for this page */}
        <div className="rounded-lg border border-brand-line bg-brand-surface/40 p-3">
          <span className="mb-1 block text-xs font-medium text-brand-ink">Social share image</span>
          <span className="mb-3 block text-[11px] text-brand-ink-muted">
            Shown when this page is shared on LinkedIn, Facebook, X and WhatsApp. Best size 1200 × 630px.
            Blank uses the site-wide default.
          </span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative shrink-0">
              <div className="flex h-[105px] w-[200px] items-center justify-center overflow-hidden rounded-lg border border-brand-line bg-white">
                {ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ogImage} alt={ogImageAlt || 'Social share preview'} className="h-full w-full object-cover" />
                ) : (
                  <span className="px-3 text-center text-[11px] text-brand-ink-muted">Site default</span>
                )}
              </div>
              {ogImage && (
                <button
                  type="button"
                  onClick={() => { setOgImage(''); setOgImageAlt('') }}
                  title="Remove image (use the site default)"
                  className="absolute -right-2 -top-2 rounded-full border border-brand-line bg-white p-1 text-brand-ink-muted shadow-sm hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line bg-white px-3 py-2 text-xs font-medium text-brand-ink hover:bg-brand-surface disabled:opacity-60"
                >
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload image
                </button>
                <input
                  className={`${input} flex-1 min-w-[140px]`}
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="…or paste an image URL"
                />
              </div>
              <label className="block">
                <span className="mb-1 block text-[11px] font-medium text-brand-ink">Image alt text</span>
                <input
                  className={input}
                  value={ogImageAlt}
                  onChange={(e) => setOgImageAlt(e.target.value)}
                  placeholder="Describe the image, e.g. Care home manager welcoming a family"
                />
              </label>
              {uploadError && <p className="text-[11px] font-medium text-red-600">{uploadError}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={save} disabled={isPending} className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
            {isPending ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
        </div>
      </div>
    </details>
  )
}
