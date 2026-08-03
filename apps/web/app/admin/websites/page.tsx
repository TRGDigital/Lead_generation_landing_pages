import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Plus, ChevronRight } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { getWebsites, getOverlayStats } from '@/lib/websites'
import { addWebsite } from './actions'

export const metadata: Metadata = { title: 'Websites — Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminWebsitesPage() {
  await requireAdmin()
  const sites = await getWebsites()
  const stats = await Promise.all(sites.map((s) => getOverlayStats(s.id, 30, 1)))

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-ink">Websites</h1>
        <p className="mt-1 text-sm text-brand-ink-muted">
          Sites we have built. Each site page covers its performance, lead capture and features.
        </p>
      </div>

      <div className="space-y-3">
        {sites.map((s, i) => {
          const st = stats[i]!
          return (
            <Link
              key={s.id}
              href={`/admin/websites/${s.id}`}
              className="group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-brand-line bg-white p-5 transition-all hover:border-brand-accent/50 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                <Globe className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-ink">{s.name}</p>
                <p className="truncate text-xs text-brand-ink-muted">{s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p>
              </div>

              {/* At-a-glance numbers: leads all-time, overlay views + enquiries in the last 30 days */}
              <div className="hidden items-center gap-5 text-right sm:flex">
                <div>
                  <p className="font-display text-lg font-bold text-brand-ink">{s.leadCount}</p>
                  <p className="text-[11px] text-brand-ink-muted">organic leads</p>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-brand-ink">{st.impressions.toLocaleString()}</p>
                  <p className="text-[11px] text-brand-ink-muted">pop views · 30d</p>
                </div>
                <div>
                  <p className={`font-display text-lg font-bold ${st.submits > 0 ? 'text-green-600' : 'text-brand-ink'}`}>{st.submits.toLocaleString()}</p>
                  <p className="text-[11px] text-brand-ink-muted">pop enquiries · 30d</p>
                </div>
              </div>

              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.overlay_enabled ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
                {s.overlay_enabled ? 'Overlay on' : 'Overlay off'}
              </span>
              <ChevronRight className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          )
        })}
      </div>

      {/* Add website */}
      <details className="mt-6 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-sm font-semibold text-brand-ink">
          <Plus className="h-4 w-4" /> Add a website
        </summary>
        <form action={addWebsite} className="space-y-3 border-t border-brand-line px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input name="name" required placeholder="Website name" className="rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
            <input name="url" required placeholder="https://example.com" className="rounded-xl border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
            <input name="slug" placeholder="slug (optional)" className="rounded-xl border border-brand-line px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
          </div>
          <button className="rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent/90">Add website</button>
        </form>
      </details>
    </div>
  )
}
