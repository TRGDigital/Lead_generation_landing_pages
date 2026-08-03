'use client'

import { useState, useTransition } from 'react'
import { Sparkles, UploadCloud, Trash2, ExternalLink, ChevronDown, Plus } from 'lucide-react'
import type { ClientAreaPage } from '@/lib/client-content'
import {
  createAreaDraft,
  generateAreaDraft,
  saveAreaDraft,
  publishAreaDraft,
  deleteAreaDraft,
} from '@/app/admin/websites/actions'

// AI-drafted local area pages, published onto the client's own WordPress site.
// Flow per page: create (town + service + keyword) → Generate with AI → review/edit →
// Publish. Publishing again after edits updates the same WordPress page.

const input = 'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30'
const lbl = 'mb-1 block text-xs font-medium text-brand-ink'

function DraftEditor({ page, wpReady }: { page: ClientAreaPage; wpReady: boolean }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function run(fn: () => Promise<{ ok: boolean; detail: string; link?: string } | void>, doneText?: string) {
    startTransition(async () => {
      try {
        const r = await fn()
        if (r && typeof r === 'object') setMsg({ ok: r.ok, text: r.detail })
        else if (doneText) setMsg({ ok: true, text: doneText })
      } catch (e) {
        setMsg({ ok: false, text: e instanceof Error ? e.message : 'Something went wrong' })
      }
    })
  }

  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    run(() => saveAreaDraft(page.id, fd).then(() => undefined), 'Saved.')
  }

  const empty = !page.intro_html && !page.body_html

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label><span className={lbl}>Town</span><input name="town" defaultValue={page.town} className={input} /></label>
        <label><span className={lbl}>Service</span><input name="service" defaultValue={page.service} className={input} /></label>
        <label><span className={lbl}>Target keyword</span><input name="keyword" defaultValue={page.target_keyword} className={input} /></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label><span className={lbl}>Page slug (on their site)</span><input name="slug" defaultValue={page.slug} className={`${input} font-mono`} /></label>
        <label><span className={lbl}>Meta title</span><input name="meta_title" defaultValue={page.meta_title} className={input} /></label>
      </div>
      <label><span className={lbl}>Meta description</span><input name="meta_description" defaultValue={page.meta_description} className={input} /></label>
      <label><span className={lbl}>Heading (H1, also the WordPress page title)</span><input name="heading" defaultValue={page.heading} className={input} /></label>
      <label><span className={lbl}>Intro (HTML, &lt;p&gt; paragraphs)</span><textarea name="intro_html" rows={3} defaultValue={page.intro_html} className={input} /></label>
      <label><span className={lbl}>Body (HTML, &lt;p&gt; paragraphs)</span><textarea name="body_html" rows={8} defaultValue={page.body_html} className={input} /></label>
      <label><span className={lbl}>&ldquo;What we offer&rdquo; bullets (one per line)</span>
        <textarea name="offer_points" rows={4} defaultValue={(page.offer_points ?? []).join('\n')} className={input} />
      </label>
      <label><span className={lbl}>FAQs (JSON: [{'{'}&quot;question&quot;, &quot;answer&quot;{'}'}])</span>
        <textarea name="faqs" rows={4} defaultValue={page.faqs ? JSON.stringify(page.faqs, null, 1) : ''} className={`${input} font-mono text-xs`} />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => run(() => generateAreaDraft(page.id))}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-line px-4 py-2 text-sm font-semibold text-brand-ink hover:border-brand-accent disabled:opacity-60"
        >
          <Sparkles className="h-4 w-4" /> {empty ? 'Generate with AI' : 'Regenerate with AI'}
        </button>
        <button type="submit" disabled={isPending} className="rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
          Save draft
        </button>
        <button
          type="button"
          onClick={() => run(() => publishAreaDraft(page.id))}
          disabled={isPending || !wpReady}
          title={wpReady ? undefined : 'Connect WordPress first'}
          className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          <UploadCloud className="h-4 w-4" /> {page.wp_page_id ? 'Publish update' : 'Publish to their site'}
        </button>
        <button
          type="button"
          onClick={() => { if (confirm('Delete this draft? (The page on their site, if published, is not removed.)')) run(() => deleteAreaDraft(page.id).then(() => undefined), 'Deleted.') }}
          disabled={isPending}
          className="ml-auto inline-flex items-center gap-1 rounded-xl border border-brand-line px-3 py-2 text-sm font-semibold text-red-600 hover:border-red-300 disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {isPending && <p className="text-sm text-brand-ink-muted">Working — AI generation can take 20 to 30 seconds…</p>}
      {msg && !isPending && (
        <p className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>
      )}
    </form>
  )
}

export default function ClientAreaPagesPanel({ websiteId, pages, wpReady }: { websiteId: string; pages: ClientAreaPage[]; wpReady: boolean }) {
  const [isPending, startTransition] = useTransition()

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const form = e.currentTarget
    startTransition(async () => {
      await createAreaDraft(websiteId, fd)
      form.reset()
    })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-ink-muted">
        Local landing pages (&ldquo;service in town&rdquo;) drafted here with AI, then published as native pages on
        the client&rsquo;s own website, where their theme styles them like the rest of their site. Content is
        grounded in the client facts saved in the WordPress connection panel.
        {!wpReady && ' Connect WordPress below the drafts to enable publishing.'}
      </p>

      {/* Create */}
      <form onSubmit={onCreate} className="rounded-xl border border-brand-line bg-brand-bg-warm/40 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.2fr_auto]">
          <label><span className={lbl}>Town</span><input name="town" required placeholder="Horsham" className={input} /></label>
          <label><span className={lbl}>Service</span><input name="service" required placeholder="Respite Care" className={input} /></label>
          <label><span className={lbl}>Target keyword (optional)</span><input name="keyword" placeholder="respite care horsham" className={input} /></label>
          <button disabled={isPending} className="inline-flex items-center gap-1.5 self-end rounded-xl bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
            <Plus className="h-4 w-4" /> Create draft
          </button>
        </div>
      </form>

      {/* Drafts */}
      {pages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-line p-6 text-center text-sm text-brand-ink-muted">
          No area pages yet. Create the first draft above, then generate its content with AI.
        </p>
      ) : (
        <div className="space-y-3">
          {pages.map((p) => (
            <details key={p.id} className="group rounded-xl border border-brand-line bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-brand-ink">{p.service} in {p.town}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
                    {p.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  {p.wp_link && (
                    <a href={p.wp_link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent hover:underline">
                      View live <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-brand-line px-4 py-4">
                <DraftEditor page={p} wpReady={wpReady} />
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
