'use client'

import { useRef, useState, useTransition } from 'react'
import { ImageIcon, Upload, Loader2 } from 'lucide-react'
import { saveSiteOgImage } from '@/app/admin/seo/actions'

// Sets the site-wide social share image (og:image) shown when the site URL is
// shared on LinkedIn, Facebook, X, WhatsApp, etc. Upload an image or paste a URL.
export default function SiteOgImageEditor({ initialUrl }: { initialUrl: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError('')
    try {
      const fd = new FormData()
      fd.set('file', file)
      const res = await fetch('/api/admin/blog/upload-image', { method: 'POST', body: fd })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error ?? 'Upload failed')
      setUrl(body.url)
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function save() {
    const fd = new FormData()
    fd.set('og_image', url)
    startTransition(async () => {
      try { await saveSiteOgImage(fd); setSaved(true); setTimeout(() => setSaved(false), 2500) }
      catch (err: any) { setError(err?.message ?? 'Could not save') }
    })
  }

  const input = 'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30'

  return (
    <div className="rounded-xl border border-brand-line bg-white p-4">
      <div className="mb-1 flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-brand-accent" />
        <h2 className="text-sm font-semibold text-brand-ink">Social share image</h2>
      </div>
      <p className="mb-3 text-xs text-brand-ink-muted">
        The image shown when the site is shared on LinkedIn, Facebook, X and WhatsApp. Used across the site unless a page
        sets its own. Best size <strong>1200 × 630px</strong> (JPG or PNG, under 4&nbsp;MB).
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Preview */}
        <div className="shrink-0">
          <div className="flex h-[126px] w-[240px] items-center justify-center overflow-hidden rounded-lg border border-brand-line bg-brand-surface">
            {url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={url} alt="Social share preview" className="h-full w-full object-cover" />
              : <span className="px-4 text-center text-[11px] text-brand-ink-muted">No image set yet</span>}
          </div>
          <p className="mt-1 text-center text-[10px] text-brand-ink-muted">1200 × 630 preview</p>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-3">
          <div>
            <span className="mb-1 block text-xs font-medium text-brand-ink">Image URL</span>
            <input className={input} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…  (or upload below)" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line px-3 py-2 text-sm font-medium text-brand-ink hover:bg-brand-surface disabled:opacity-60">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload image
            </button>
            <button type="button" onClick={save} disabled={isPending || uploading} className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
              {isPending ? 'Saving…' : 'Save'}
            </button>
            {saved && <span className="text-sm text-green-600">Saved — changes go live within a few minutes.</span>}
          </div>
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          <p className="text-[11px] text-brand-ink-muted">
            Tip: after saving, re-share the link or use LinkedIn&apos;s <a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer" className="underline">Post Inspector</a> to refresh their cached preview.
          </p>
        </div>
      </div>
    </div>
  )
}
