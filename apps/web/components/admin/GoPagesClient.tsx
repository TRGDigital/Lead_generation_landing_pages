'use client'

import { useState, useTransition } from 'react'
import { createGoPage, duplicateGoPage, setGoPageStatus } from '@/app/admin/go-pages/actions'

// Client bits for /admin/go-pages: the create form and the publish toggle.

export function NewGoPageForm({
  templates,
}: {
  templates: { key: string; service: string; defaultSlug: string }[]
}) {
  const [template, setTemplate] = useState(templates[0]?.key ?? '')
  const [slug, setSlug] = useState(templates[0]?.defaultSlug ?? '')
  const [slugEdited, setSlugEdited] = useState(false)
  const [emails, setEmails] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function pickTemplate(key: string) {
    setTemplate(key)
    if (!slugEdited) setSlug(templates.find((t) => t.key === key)?.defaultSlug ?? '')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const fd = new FormData()
    fd.set('template', template)
    fd.set('slug', slug)
    fd.set('notify_emails', emails)
    startTransition(async () => {
      try {
        await createGoPage(fd) // redirects to the editor on success
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create the page')
      }
    })
  }

  const input = 'rounded-md border bg-background px-3 py-2 text-sm'

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 rounded-md border bg-white p-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Service template</span>
        <select value={template} onChange={(e) => pickTemplate(e.target.value)} className={input}>
          {templates.map((t) => (
            <option key={t.key} value={t.key}>
              {t.service}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">URL</span>
        <span className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">/go/</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugEdited(true)
            }}
            className={`${input} font-mono`}
          />
        </span>
      </label>
      <label className="flex min-w-[240px] flex-1 flex-col gap-1 text-sm">
        <span className="font-medium">Send leads to</span>
        <input
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Comma-separate multiple; blank = default inbox"
          className={input}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? 'Creating…' : 'Create draft'}
      </button>
      {error && <p className="w-full text-sm font-medium text-red-600">{error}</p>}
    </form>
  )
}

export function GoPageStatusToggle({ slug, status }: { slug: string; status: string }) {
  const [current, setCurrent] = useState(status)
  const [pending, startTransition] = useTransition()
  const published = current === 'published'

  function toggle() {
    const next = published ? 'draft' : 'published'
    startTransition(async () => {
      try {
        await setGoPageStatus(slug, next)
        setCurrent(next)
      } catch {
        /* leave as-is on failure */
      }
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
        published ? 'border text-slate-600 hover:bg-slate-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'
      }`}
    >
      {pending ? '…' : published ? 'Unpublish' : 'Publish'}
    </button>
  )
}

// One-click A/B variant (copies to <slug>-b as a draft and opens its editor).
export function GoPageDuplicate({ slug }: { slug: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  return (
    <span className="flex flex-col items-end">
      <button
        type="button"
        disabled={pending}
        onClick={() => { setError(''); startTransition(async () => { try { await duplicateGoPage(slug) } catch (e) { setError(e instanceof Error ? e.message : 'Failed') } }) }}
        className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
        title="Copy this page to a -b variant for A/B testing via Google Ads URL rotation"
      >
        {pending ? 'Duplicating…' : 'Duplicate (A/B)'}
      </button>
      {error && <span className="mt-1 text-[11px] font-medium text-red-600">{error}</span>}
    </span>
  )
}
