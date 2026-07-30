'use client'

import { useRef, useState, useTransition } from 'react'
import { User, Upload, Loader2 } from 'lucide-react'
import { saveAuthor } from '@/app/admin/seo/actions'
import { resizeImage } from '@/lib/image-resize'

interface AuthorLite {
  id: string
  name: string
  title: string | null
  bio: string | null
  linkedin_url: string | null
  avatar_url: string | null
}

// Edits the blog author entity used for the byline, the author card and the
// Person schema on every post. Upload a headshot or paste an image URL.
export default function AuthorEditor({ author }: { author: AuthorLite }) {
  const [name, setName] = useState(author.name ?? '')
  const [title, setTitle] = useState(author.title ?? '')
  const [bio, setBio] = useState(author.bio ?? '')
  const [linkedin, setLinkedin] = useState(author.linkedin_url ?? '')
  const [avatar, setAvatar] = useState(author.avatar_url ?? '')
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
      // Downscale to a square-ish ~512px JPEG in the browser: keeps the upload
      // small and the headshot crisp in the round avatar.
      const optimised = await resizeImage(file, 512, 0.85, 'image/jpeg')
      const fd = new FormData()
      fd.set('file', optimised)
      const res = await fetch('/api/admin/blog/upload-image', { method: 'POST', body: fd })
      const body = await res.json().catch(() => ({} as any))
      if (!res.ok || !body.url) throw new Error(body?.error || (res.status === 413 ? 'That image is too large. Please try a smaller one.' : 'Upload failed. Please try a JPG or PNG.'))
      setAvatar(body.url)
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function save() {
    setError('')
    const fd = new FormData()
    fd.set('name', name)
    fd.set('title', title)
    fd.set('bio', bio)
    fd.set('linkedin_url', linkedin)
    fd.set('avatar_url', avatar)
    startTransition(async () => {
      try { await saveAuthor(author.id, fd); setSaved(true); setTimeout(() => setSaved(false), 2500) }
      catch (err: any) { setError(err?.message ?? 'Could not save') }
    })
  }

  const input = 'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30'

  return (
    <div className="rounded-xl border border-brand-line bg-white p-4">
      <div className="mb-1 flex items-center gap-2">
        <User className="h-4 w-4 text-brand-accent" />
        <h2 className="text-sm font-semibold text-brand-ink">Blog author</h2>
      </div>
      <p className="mb-3 text-xs text-brand-ink-muted">
        The named author on every blog post: the byline, the author card and the Person schema search engines and AI use
        to recognise who writes your content. Add a headshot, role, short bio and LinkedIn.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-brand-line bg-brand-surface">
            {avatar
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={avatar} alt="Author headshot preview" className="h-full w-full object-cover" />
              : <User className="h-8 w-8 text-brand-ink-muted" />}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-2 inline-flex w-24 items-center justify-center gap-1.5 rounded-lg border border-brand-line px-2 py-1.5 text-xs font-medium text-brand-ink hover:bg-brand-surface disabled:opacity-60">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="mb-1 block text-xs font-medium text-brand-ink">Name</span>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Len Burgess" />
            </div>
            <div>
              <span className="mb-1 block text-xs font-medium text-brand-ink">Role / title</span>
              <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Founder" />
            </div>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-brand-ink">LinkedIn URL</span>
            <input className={input} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/…" />
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-brand-ink">Short bio</span>
            <textarea className={input} rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Two or three sentences on background and expertise." />
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-brand-ink">Image URL</span>
            <input className={input} value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://…  (or upload above)" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={save} disabled={isPending || uploading} className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
              {isPending ? 'Saving…' : 'Save author'}
            </button>
            {saved && <span className="text-sm text-green-600">Saved — changes go live within a few minutes.</span>}
          </div>
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}
