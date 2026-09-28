'use client'

import { useState, useTransition } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import { savePageSeo } from '@/app/admin/seo/actions'
import { saveCountyEditorial, setCountyStatus } from '@/app/admin/blog/county-actions'
import type { PageSeoRow } from '@/lib/page-seo'

// The county rollout, in one list.
//
// Three pages exist per area and they are generated, so they never appear in the hand
// written page list in /admin/seo. Meta written here goes to the same page_seo table
// through the same action; the opening line and the council link belong to the rollout
// queue, which is also what the nightly publishing cron reads.

export type CountyPageMeta = {
  path: string
  kind: 'Hub' | 'New website' | 'SEO'
  defaultTitle: string
  defaultDescription: string
  canonical: string
}

export type CountyRow = {
  slug: string
  name: string
  phase: number
  services: number
  status: 'live' | 'queued' | 'held'
  standing: string
  councilName: string
  councilUrl: string
  councilOk: boolean
  publishedAt: string | null
  pages: CountyPageMeta[]
}

const STATUS_STYLE: Record<string, string> = {
  live: 'bg-green-100 text-green-800',
  queued: 'bg-amber-100 text-amber-800',
  held: 'bg-neutral-200 text-neutral-700',
}

export default function CountyPagesEditor({
  counties,
  overrides,
}: {
  counties: CountyRow[]
  overrides: Record<string, PageSeoRow>
}) {
  const live = counties.filter((c) => c.status === 'live')
  const queued = counties.filter((c) => c.status !== 'live')

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-brand-line bg-white p-4 text-sm leading-relaxed text-brand-ink-soft">
        <p>
          <strong className="text-brand-ink">
            {live.length} areas live, {live.length * 3} pages. {queued.length} queued, {queued.length * 3} to come.
          </strong>{' '}
          One area publishes each night at 3.15am, worst case ten weeks for the lot, and each morning&apos;s email
          lists what went out. Hold an area to keep it back; publish one to put it live inside a minute.
        </p>
        <p className="mt-2">
          Titles and descriptions below are what each page writes for itself from live CareAssura figures. Anything
          you type replaces it. The canonical is always set.
        </p>
      </div>

      {[
        { label: `Live · ${live.length}`, rows: live },
        { label: `Queued · ${queued.length}`, rows: queued },
      ].map(({ label, rows }) =>
        rows.length === 0 ? null : (
          <div key={label}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">{label}</h2>
            <div className="space-y-2">
              {rows.map((c) => (
                <CountyBlock key={c.slug} county={c} overrides={overrides} />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  )
}

const field =
  'w-full rounded-lg border border-brand-line px-3 py-2 text-sm text-brand-ink placeholder:text-brand-ink-muted/70 focus:border-brand-pop focus:outline-none'
const label = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-ink-soft'

function CountyBlock({ county, overrides }: { county: CountyRow; overrides: Record<string, PageSeoRow> }) {
  const [open, setOpen] = useState(false)
  const [standing, setStanding] = useState(county.standing)
  const [councilName, setCouncilName] = useState(county.councilName)
  const [councilUrl, setCouncilUrl] = useState(county.councilUrl)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function saveEditorial() {
    const fd = new FormData()
    fd.set('standing', standing)
    fd.set('council_name', councilName)
    fd.set('council_url', councilUrl)
    startTransition(async () => {
      await saveCountyEditorial(county.slug, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  function flip(status: 'live' | 'queued' | 'held') {
    startTransition(async () => {
      await setCountyStatus(county.slug, status)
    })
  }

  return (
    <div className="rounded-xl border border-brand-line bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="font-semibold text-brand-ink">{county.name}</span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLE[county.status]}`}>
            {county.status}
          </span>
          <span className="text-xs text-brand-ink-muted">
            phase {county.phase} · {county.services} services
          </span>
          {!county.councilOk && (
            <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-700">
              no council link
            </span>
          )}
        </span>
        <span className="shrink-0 text-xs text-brand-ink-muted">{open ? 'Close' : 'Edit'}</span>
      </button>

      {open && (
        <div className="space-y-5 border-t border-brand-line px-4 py-4">
          <div>
            <label className={label} htmlFor={`st-${county.slug}`}>
              Opening line <span className="font-normal normal-case">{standing.length} characters</span>
            </label>
            <textarea
              id={`st-${county.slug}`}
              rows={3}
              className={field}
              value={standing}
              onChange={(e) => setStanding(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-brand-ink-muted">
              The first paragraph on all three pages. Written from this area&apos;s own figures, so make it about the
              market rather than about us.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor={`cn-${county.slug}`}>
                Council name
              </label>
              <input
                id={`cn-${county.slug}`}
                className={field}
                value={councilName}
                onChange={(e) => setCouncilName(e.target.value)}
              />
            </div>
            <div>
              <label className={label} htmlFor={`cu-${county.slug}`}>
                Council adult social care URL
              </label>
              <input
                id={`cu-${county.slug}`}
                className={field}
                value={councilUrl}
                onChange={(e) => setCouncilUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveEditorial}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-ink px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save
            </button>
            {saved && <span className="text-xs font-semibold text-green-700">Saved</span>}

            {county.status === 'live' ? (
              <button
                type="button"
                onClick={() => flip('held')}
                className="text-xs font-semibold text-brand-ink-muted underline hover:text-brand-ink"
              >
                Take down
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => flip('live')}
                  className="rounded-lg border border-brand-pop px-3 py-2 text-sm font-semibold text-brand-pop"
                >
                  Publish now
                </button>
                {county.status === 'queued' ? (
                  <button
                    type="button"
                    onClick={() => flip('held')}
                    className="text-xs font-semibold text-brand-ink-muted underline hover:text-brand-ink"
                  >
                    Hold back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => flip('queued')}
                    className="text-xs font-semibold text-brand-ink-muted underline hover:text-brand-ink"
                  >
                    Back in the queue
                  </button>
                )}
              </>
            )}
          </div>

          {county.status === 'live' && (
            <div className="space-y-2 border-t border-brand-line pt-4">
              {county.pages.map((p) => (
                <PageMetaRow key={p.path} page={p} initial={overrides[p.path]} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PageMetaRow({ page, initial }: { page: CountyPageMeta; initial?: PageSeoRow }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [canonical, setCanonical] = useState(initial?.canonical ?? '')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const customised = !!(initial?.title || initial?.description || initial?.canonical)

  function save() {
    const fd = new FormData()
    fd.set('title', title)
    fd.set('description', description)
    fd.set('canonical', canonical)
    fd.set('og_image', initial?.og_image ?? '')
    fd.set('og_image_alt', initial?.og_image_alt ?? '')
    startTransition(async () => {
      await savePageSeo(page.path, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  return (
    <div className="rounded-lg border border-brand-line">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
      >
        <span className="min-w-0">
          <span className="rounded bg-brand-bg-warm px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-ink-muted">
            {page.kind}
          </span>
          <span className="ml-2 font-mono text-[11px] text-brand-ink">{page.path}</span>
          {customised && (
            <span className="ml-2 rounded bg-brand-pop/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-pop">
              edited
            </span>
          )}
        </span>
        <span className="shrink-0 text-[11px] text-brand-ink-muted">{open ? 'Close' : 'Meta'}</span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-brand-line px-3 py-3">
          <div>
            <label className={label}>
              Meta title <span className="font-normal normal-case">{title.length}/60</span>
            </label>
            <input
              className={field}
              value={title}
              placeholder={page.defaultTitle}
              onFocus={() => !title && setTitle(page.defaultTitle)}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-brand-ink-muted">
              The brand is appended automatically, so leave &quot;TRG Digital&quot; out of it.
            </p>
          </div>
          <div>
            <label className={label}>
              Meta description <span className="font-normal normal-case">{description.length}/160</span>
            </label>
            <textarea
              className={field}
              rows={3}
              value={description}
              placeholder={page.defaultDescription}
              onFocus={() => !description && setDescription(page.defaultDescription)}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Canonical</label>
            <input
              className={field}
              value={canonical}
              placeholder={page.canonical}
              onChange={(e) => setCanonical(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-ink px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Save
            </button>
            {saved && <span className="text-[11px] font-semibold text-green-700">Saved</span>}
            <a
              href={page.canonical}
              target="_blank"
              rel="noopener"
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-brand-pop"
            >
              View
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
