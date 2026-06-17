// On-brand dashboard mockups for the hero scroller: analytics growth, a green
// PageSpeed report, and a monthly leads dashboard. All ~320px tall to sit in the band.

function Chrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
      <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[8px] text-brand-ink-muted">{url}</span>
    </div>
  )
}

const Shell = ({ url, children }: { url: string; children: React.ReactNode }) => (
  <div className="h-[400px] w-[400px] flex-shrink-0 overflow-hidden rounded-xl border border-brand-line bg-white shadow-card">
    <Chrome url={url} />
    <div className="p-6">{children}</div>
  </div>
)

export function AnalyticsCard() {
  return (
    <Shell url="analytics.google.com">
      <p className="text-xs font-medium text-brand-ink-muted">Page impressions · last 28 days</p>
      <p className="mt-1 font-display text-3xl font-bold text-brand-ink">184,250</p>
      <p className="mt-1 text-sm font-semibold text-green-600">↑ 62% growth</p>
      <svg viewBox="0 0 120 56" className="mt-5 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ga-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34A853" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#34A853" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,50 L20,46 L40,40 L60,30 L80,24 L100,12 L120,5 L120,56 L0,56 Z" fill="url(#ga-fill)" />
        <path d="M0,50 L20,46 L40,40 L60,30 L80,24 L100,12 L120,5" fill="none" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Shell>
  )
}

function Gauge({ label, score }: { label: string; score: number }) {
  const r = 16
  const c = 2 * Math.PI * r
  const off = c * (1 - score / 100)
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90">
          <circle cx="20" cy="20" r={r} fill="none" stroke="#e6f4ea" strokeWidth="3.5" />
          <circle cx="20" cy="20" r={r} fill="none" stroke="#0cce6b" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-600">{score}</span>
      </div>
      <span className="text-[10px] font-medium text-brand-ink-muted">{label}</span>
    </div>
  )
}

export function LighthouseCard() {
  return (
    <Shell url="pagespeed.web.dev">
      <p className="text-xs font-medium text-brand-ink-muted">Website performance</p>
      <div className="mt-7 grid grid-cols-2 gap-y-8">
        <Gauge label="Performance" score={98} />
        <Gauge label="Accessibility" score={100} />
        <Gauge label="Best practices" score={96} />
        <Gauge label="SEO" score={100} />
      </div>
    </Shell>
  )
}

export function LeadsCard() {
  const bars = [40, 55, 48, 70, 62, 85, 95]
  return (
    <Shell url="trgdigital.com/leads">
      <p className="text-xs font-medium text-brand-ink-muted">Leads this month</p>
      <p className="mt-1 font-display text-3xl font-bold text-brand-ink">127</p>
      <p className="mt-1 text-sm font-semibold text-green-600">↑ 34% vs last month</p>
      <div className="mt-5 flex h-20 items-end gap-2">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t bg-brand-pop/80" style={{ height: `${b}%` }} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-brand-ink-muted">
        <span>Week 1</span><span>Week 4</span>
      </div>
    </Shell>
  )
}
