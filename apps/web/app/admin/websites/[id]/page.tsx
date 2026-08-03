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

function OnOff({ on, onLabel = 'On', offLabel = 'Off' }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${on ? 'bg-green-100 text-green-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
      {on ? onLabel : offLabel}
    </span>
  )
}

// One collapsible feature panel. Keeps every accordion identical so the page reads as a tidy list.
function Panel({
  title,
  badge,
  open,
  children,
}: {
  title: string
  badge?: React.ReactNode
  open?: boolean
  children: React.ReactNode
}) {
  return (
    <details open={open} className="group rounded-2xl border border-brand-line bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
        <span className="flex flex-wrap items-center gap-2.5">
          <span className="font-display text-base font-semibold text-brand-ink">{title}</span>
          {badge}
        </span>
        <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-ink-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-brand-line px-5 py-5">{children}</div>
    </details>
  )
}

// Section = a heading + short description over a stack of panels, so the page has a clear
// visual hierarchy: what's performing → what captures leads → what runs on the site → install.
function SectionHeading({ id, title, desc }: { id: string; title: string; desc: string }) {
  return (
    <div id={id} className="mt-10 mb-4 scroll-mt-24 first:mt-0">
      <h2 className="font-display text-lg font-semibold text-brand-ink">{title}</h2>
      <p className="mt-0.5 text-sm text-brand-ink-muted">{desc}</p>
    </div>
  )
}

const JUMP_LINKS = [
  { href: '#performance', label: 'Performance' },
  { href: '#lead-capture', label: 'Lead capture' },
  { href: '#features', label: 'Site features' },
  { href: '#install', label: 'Install' },
]

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

      {/* Jump links */}
      <nav className="sticky top-0 z-10 -mx-2 mt-6 flex gap-2 overflow-x-auto bg-background/95 px-2 py-2 backdrop-blur" aria-label="Sections">
        {JUMP_LINKS.map((j) => (
          <a
            key={j.href}
            href={j.href}
            className="whitespace-nowrap rounded-full border border-brand-line bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-ink-soft hover:border-brand-accent/50 hover:text-brand-ink"
          >
            {j.label}
          </a>
        ))}
      </nav>

      {/* ── 1 · Performance ────────────────────────────────────────────── */}
      <SectionHeading id="performance" title="Performance" desc="How this site is doing: overlay engagement and the enquiries it has captured." />
      <div className="space-y-4">
        <Panel
          title="Overlay performance"
          open
          badge={
            <span className="rounded-full bg-brand-bg-warm px-2 py-0.5 text-[11px] font-semibold text-brand-ink-muted">
              {overlayStats.impressions > 0 ? `${overlayStats.impressions.toLocaleString()} views · 30d` : 'no views yet'}
            </span>
          }
        >
          <OverlayAnalytics stats={overlayStats} />
        </Panel>

        <Panel
          title="Organic leads"
          open
          badge={
            <span className="rounded-full bg-brand-bg-warm px-2 py-0.5 text-[11px] font-semibold text-brand-ink-muted">
              {leads.length > 0 ? `${leads.length} total · ${leads7d} this week` : 'none yet'}
            </span>
          }
        >
          {leads.length === 0 ? (
            <div className="rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 p-8 text-center text-sm text-brand-ink-muted">
              No organic leads yet. Once the overlay is live on the site, captured enquiries appear here.
            </div>
          ) : (
            <div className="-mx-5 -mb-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-brand-line bg-brand-bg-warm text-left">
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
        </Panel>
      </div>

      {/* ── 2 · Lead capture ───────────────────────────────────────────── */}
      <SectionHeading id="lead-capture" title="Lead capture" desc="The pop overlay and landing page that turn visitors into enquiries." />
      <div className="space-y-4">
        <Panel title="Pop overlay" badge={<OnOff on={site.overlay_enabled} />}>
          <WebsiteOverlayForm site={site} />
        </Panel>

        <Panel
          title="Quiz questions"
          badge={
            <span className="rounded-full bg-brand-bg-warm px-2 py-0.5 text-[11px] font-semibold text-brand-ink-muted">
              {site.overlay_gamified ? `${(site.overlay_questions?.length ?? 0) || 'default'} ${site.overlay_questions?.length ? 'questions' : ''}`.trim() : 'quiz off'}
            </span>
          }
        >
          <QuizQuestionsEditor websiteId={site.id} initial={site.overlay_questions ?? []} presets={presets} />
        </Panel>

        <Panel title="Landing page" badge={<OnOff on={site.lp_enabled} onLabel="Live" />}>
          <LandingPageForm site={site} widgetOrigin={WIDGET_ORIGIN} />
        </Panel>
      </div>

      {/* ── 3 · Site features ──────────────────────────────────────────── */}
      <SectionHeading id="features" title="Site features" desc="Everything else running on the site: availability, tools, chat, call bar and more." />
      <div className="space-y-4">
        <Panel
          title="Room availability"
          badge={
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${site.availability_status === 'available' ? 'bg-green-100 text-green-700' : site.availability_status === 'limited' ? 'bg-amber-100 text-amber-700' : site.availability_status === 'full' ? 'bg-red-100 text-red-700' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
              {site.availability_status !== 'unknown' && site.rooms_available > 0 ? `${site.rooms_available} available` : AVAILABILITY_LABELS[site.availability_status].label}
            </span>
          }
        >
          <AvailabilityPanel site={site} widgetOrigin={WIDGET_ORIGIN} />
        </Panel>

        <Panel
          title="Family tools"
          badge={<OnOff on={(site.tools_enabled?.length ?? 0) > 0} onLabel={`${site.tools_enabled?.length ?? 0} allocated`} offLabel="none yet" />}
        >
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
        </Panel>

        <Panel title="AI chat assistant" badge={<OnOff on={site.chat_enabled} />}>
          <ChatPanel site={site} widgetOrigin={WIDGET_ORIGIN} aiReady={!!process.env.ANTHROPIC_API_KEY} />
        </Panel>

        <Panel title="Click-to-call bar" badge={<OnOff on={site.callbar_enabled} />}>
          <CallbarPanel site={site} widgetOrigin={WIDGET_ORIGIN} />
        </Panel>

        <Panel
          title="Call tracking"
          badge={<OnOff on={!!tracking?.enabled} onLabel={`On · ${callStats.last30} calls · 30d`} />}
        >
          <CallTrackingPanel
            site={site}
            widgetOrigin={WIDGET_ORIGIN}
            tracking={tracking}
            calls={trackedCalls}
            stats={callStats}
            twilioReady={!!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN}
          />
        </Panel>

        <Panel title="Accessibility toolbar" badge={<OnOff on={site.accessibility_enabled} />}>
          <AccessibilityPanel site={site} widgetOrigin={WIDGET_ORIGIN} />
        </Panel>

        <Panel
          title="Funding & care guide"
          badge={
            <>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Premium</span>
              <OnOff on={site.funding_guide_enabled} />
            </>
          }
        >
          <FundingGuidePanel site={site} widgetOrigin={WIDGET_ORIGIN} />
        </Panel>
      </div>

      {/* ── 4 · Install ────────────────────────────────────────────────── */}
      <SectionHeading id="install" title="Install" desc="The one-line snippet that powers everything above on the client site." />
      <div className="space-y-4">
        <Panel title="Install on the site">
          <p className="mb-3 text-sm text-brand-ink-muted">Add this one line just before the closing &lt;/body&gt; tag on {site.name}. The overlay then runs automatically and is controlled from the settings above.</p>
          <EmbedSnippet snippet={snippet} />
        </Panel>
      </div>
    </div>
  )
}
