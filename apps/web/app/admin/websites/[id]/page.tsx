import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Trash2, ChevronDown } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { getWebsite, getOrganicLeads, getQuizPresets, getOverlayStats } from '@/lib/websites'
import OverlayAnalytics from '@/components/admin/OverlayAnalytics'
import WebsiteOverlayForm from '@/components/admin/WebsiteOverlayForm'
import QuizQuestionsEditor from '@/components/admin/QuizQuestionsEditor'
import ToolsAllocationPanel from '@/components/admin/ToolsAllocationPanel'
import LandingPageForm from '@/components/admin/LandingPageForm'
import AvailabilityPanel from '@/components/admin/AvailabilityPanel'
import AccessibilityPanel from '@/components/admin/AccessibilityPanel'
import CallbarPanel from '@/components/admin/CallbarPanel'
import CallTrackingPanel from '@/components/admin/CallTrackingPanel'
import { getTrackingNumber, getTrackedCalls, getCallStats } from '@/lib/dni'
import ChatPanel from '@/components/admin/ChatPanel'
import FundingGuidePanel from '@/components/admin/FundingGuidePanel'
import { AVAILABILITY_LABELS } from '@/lib/websites'
import { LOCAL_AUTHORITIES } from '@/lib/local-authorities'
import EmbedSnippet from '@/components/admin/EmbedSnippet'
import { deleteWebsite } from '../actions'

export const metadata: Metadata = { title: 'Website — Admin' }
export const dynamic = 'force-dynamic'

const WIDGET_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lead-generation-landing-pages.vercel.app'

function when(s: string) {
  try {
    return new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

type Props = { params: { id: string } }

export default async function WebsiteDetailPage({ params }: Props) {
  await requireAdmin()
  const site = await getWebsite(params.id)
  if (!site) notFound()
  const [leads, presets, overlayStats, tracking, trackedCalls, callStats] = await Promise.all([
    getOrganicLeads(site.id),
    getQuizPresets(),
    getOverlayStats(site.id, 30),
    getTrackingNumber(site.id),
    getTrackedCalls(site.id, 50),
    getCallStats(site.id),
  ])

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const leads7d = leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length
  const callClicks = leads.filter((l) => l.trigger === 'call').length
  const snippet = `<script src="${WIDGET_ORIGIN}/embed.js" data-site="${site.slug}" defer></script>`

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/admin/websites" className="inline-flex items-center gap-1.5 text-sm text-brand-ink-muted hover:text-brand-ink">
          <ArrowLeft className="h-4 w-4" /> All websites
        </Link>
        <div className="flex items-center gap-3">
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent hover:underline">
            Visit site <ExternalLink className="h-3 w-3" />
          </a>
          <form action={deleteWebsite.bind(null, site.id)}>
            <button className="inline-flex items-center gap-1 rounded-lg border border-brand-line px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:border-red-300">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </form>
        </div>
      </div>

      <h1 className="font-display text-2xl font-semibold text-brand-ink">{site.name}</h1>
      <p className="mt-1 text-sm text-brand-ink-muted">{site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <p className="font-display text-2xl font-bold text-brand-ink">{leads.length}</p>
          <p className="text-xs text-brand-ink-muted">Enquiries (all time)</p>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <p className="font-display text-2xl font-bold text-brand-ink">{callClicks}</p>
          <p className="text-xs text-brand-ink-muted">Phone calls (call bar)</p>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <p className="font-display text-2xl font-bold text-brand-ink">{leads7d}</p>
          <p className="text-xs text-brand-ink-muted">Last 7 days</p>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <p className={`font-display text-2xl font-bold ${site.overlay_enabled ? 'text-green-600' : 'text-brand-ink-muted'}`}>{site.overlay_enabled ? 'On' : 'Off'}</p>
          <p className="text-xs text-brand-ink-muted">Pop overlay</p>
        </div>
      </div>

      {/* Overlay performance (collapsible, open by default) */}
      <details open className="group mt-6 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Overlay performance</span>
            <span className="rounded-full bg-brand-bg-warm px-2 py-0.5 text-[11px] font-semibold text-brand-ink-muted">
              {overlayStats.impressions > 0 ? `${overlayStats.impressions.toLocaleString()} views · 30d` : 'no views yet'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <OverlayAnalytics stats={overlayStats} />
        </div>
      </details>

      {/* Quiz questions (collapsible) */}
      <details className="group mt-6 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Quiz questions</span>
            <span className="rounded-full bg-brand-bg-warm px-2 py-0.5 text-[11px] font-semibold text-brand-ink-muted">
              {site.overlay_gamified ? `${(site.overlay_questions?.length ?? 0) || 'default'} ${site.overlay_questions?.length ? 'questions' : ''}`.trim() : 'quiz off'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <QuizQuestionsEditor websiteId={site.id} initial={site.overlay_questions ?? []} presets={presets} />
        </div>
      </details>

      {/* Room availability (collapsible) */}
      <details className="group mt-6 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Room availability</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${site.availability_status === 'available' ? 'bg-green-100 text-green-700' : site.availability_status === 'limited' ? 'bg-amber-100 text-amber-700' : site.availability_status === 'full' ? 'bg-red-100 text-red-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {site.availability_status !== 'unknown' && site.rooms_available > 0 ? `${site.rooms_available} available` : AVAILABILITY_LABELS[site.availability_status].label}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <AvailabilityPanel site={site} widgetOrigin={WIDGET_ORIGIN} />
        </div>
      </details>

      {/* Landing page (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Landing page</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${site.lp_enabled ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {site.lp_enabled ? 'Live' : 'Off'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <LandingPageForm site={site} widgetOrigin={WIDGET_ORIGIN} />
        </div>
      </details>

      {/* Family tools (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Family tools</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${(site.tools_enabled?.length ?? 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {(site.tools_enabled?.length ?? 0) > 0 ? `${site.tools_enabled.length} allocated` : 'none yet'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <ToolsAllocationPanel
            websiteId={site.id}
            slug={site.slug}
            widgetOrigin={WIDGET_ORIGIN}
            initialEnabled={site.tools_enabled ?? []}
            initialCapture={site.tools_capture_leads ?? true}
            initialLaSlug={site.tools_la_slug ?? ''}
            brandColor={site.overlay_color}
            laOptions={LOCAL_AUTHORITIES.map((la) => ({ slug: la.slug, name: la.name, shortName: la.shortName, region: la.region, areas: la.areas }))}
          />
        </div>
      </details>

      {/* Overlay settings (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Pop overlay</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${site.overlay_enabled ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {site.overlay_enabled ? 'On' : 'Off'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <WebsiteOverlayForm site={site} />
        </div>
      </details>

      {/* AI chat assistant (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">AI chat assistant</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${site.chat_enabled ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {site.chat_enabled ? 'On' : 'Off'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <ChatPanel site={site} widgetOrigin={WIDGET_ORIGIN} aiReady={!!process.env.ANTHROPIC_API_KEY} />
        </div>
      </details>

      {/* Click-to-call bar (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Click-to-call bar</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${site.callbar_enabled ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {site.callbar_enabled ? 'On' : 'Off'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <CallbarPanel site={site} widgetOrigin={WIDGET_ORIGIN} />
        </div>
      </details>

      {/* Call tracking / DNI (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Call tracking</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tracking?.enabled ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {tracking?.enabled ? `On · ${callStats.last30} calls · 30d` : 'Off'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <CallTrackingPanel
            site={site}
            widgetOrigin={WIDGET_ORIGIN}
            tracking={tracking}
            calls={trackedCalls}
            stats={callStats}
            twilioReady={!!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN}
          />
        </div>
      </details>

      {/* Accessibility toolbar (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Accessibility toolbar</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${site.accessibility_enabled ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {site.accessibility_enabled ? 'On' : 'Off'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <AccessibilityPanel site={site} widgetOrigin={WIDGET_ORIGIN} />
        </div>
      </details>

      {/* Funding & care options guide, premium (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="flex items-center gap-2.5">
            <span className="font-display text-base font-semibold text-brand-ink">Funding &amp; care guide</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Premium</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${site.funding_guide_enabled ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {site.funding_guide_enabled ? 'On' : 'Off'}
            </span>
          </span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <FundingGuidePanel site={site} widgetOrigin={WIDGET_ORIGIN} />
        </div>
      </details>

      {/* Embed snippet (collapsible) */}
      <details className="group mt-4 rounded-2xl border border-brand-line bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
          <span className="font-display text-base font-semibold text-brand-ink">Install on the site</span>
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-brand-line px-5 py-5">
          <p className="mb-3 text-sm text-brand-ink-muted">Add this one line just before the closing &lt;/body&gt; tag on {site.name}. The overlay then runs automatically and is controlled from the settings above.</p>
          <EmbedSnippet snippet={snippet} />
        </div>
      </details>

      {/* Organic leads */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-brand-ink">Organic leads</h2>
        {leads.length === 0 ? (
          <div className="rounded-2xl border border-brand-line bg-white p-10 text-center text-sm text-brand-ink-muted">
            No organic leads yet. Once the overlay is live on the site, captured enquiries appear here.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-line bg-brand-bg-warm text-left">
                  <th className="px-4 py-3 font-semibold text-brand-ink">Name</th>
                  <th className="px-4 py-3 font-semibold text-brand-ink">Contact</th>
                  <th className="px-4 py-3 font-semibold text-brand-ink hidden sm:table-cell">Via</th>
                  <th className="px-4 py-3 font-semibold text-brand-ink hidden sm:table-cell">Consent</th>
                  <th className="px-4 py-3 font-semibold text-brand-ink">When</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-brand-line/50 last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-ink">{l.name || '—'}</td>
                    <td className="px-4 py-3 text-brand-ink-soft">
                      {l.email && <a href={`mailto:${l.email}`} className="text-brand-accent hover:underline">{l.email}</a>}
                      {l.email && l.phone && <span className="text-brand-ink-muted"> · </span>}
                      {l.phone && <span>{l.phone}</span>}
                      {!l.email && !l.phone && '—'}
                    </td>
                    <td className="px-4 py-3 hidden text-brand-ink-muted sm:table-cell">{l.trigger || '—'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{l.consent ? <span className="text-green-600">✓ Yes</span> : <span className="text-brand-ink-muted">—</span>}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-brand-ink-muted">{when(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
