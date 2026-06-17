'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createLandingPage } from '@/app/admin/pages/actions'
import { slugify } from '@/lib/location-content-template'

export function NewPageForm() {
  const [areaName, setAreaName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [questionSet, setQuestionSet] = useState('residential')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const effectiveSlug = slugify(slugEdited ? slug : areaName)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await createLandingPage({ areaName, slug: slugEdited ? slug : areaName, questionSet })
        // on success the action redirects to /admin/pages
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create page')
      }
    })
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Area name</label>
        <Input
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          placeholder="e.g. Haywards Heath"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          The town or area this page targets. Used throughout the page copy and to match leads to buyers.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Subdomain</label>
        <div className="flex items-center gap-1.5">
          <Input
            value={slugEdited ? slug : effectiveSlug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
            placeholder="haywards-heath-care-home"
            className="font-mono"
          />
          <span className="shrink-0 text-sm text-muted-foreground">.careassura.com</span>
        </div>
        <p className="text-xs text-muted-foreground">
          This must match the subdomain. Defaults from the area name — edit if you want a different one
          (e.g. add <code>-care-home</code> for SEO).
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Quiz template</label>
        <select
          value={questionSet}
          onChange={(e) => setQuestionSet(e.target.value)}
          className="block rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="residential">Residential care</option>
          <option value="nursing">Nursing care</option>
        </select>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
        The page is created as a <strong>draft</strong> with full starter copy you can edit. It goes live once you
        <strong> Publish</strong> it — and the <code>{effectiveSlug || 'your-slug'}.careassura.com</code> subdomain
        is pointed at the project (DNS), which I&apos;ll set up for you.
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending || !areaName.trim()}>
          {pending ? 'Creating…' : 'Create landing page'}
        </Button>
        <a href="/admin/pages" className="text-sm text-muted-foreground hover:underline">Cancel</a>
      </div>
    </form>
  )
}
