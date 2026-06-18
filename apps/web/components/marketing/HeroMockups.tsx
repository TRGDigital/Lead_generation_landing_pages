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

const Shell = ({ url, w = 'w-[400px]', children }: { url: string; w?: string; children: React.ReactNode }) => (
  <div className={`h-[400px] ${w} flex-shrink-0 overflow-hidden rounded-xl border border-brand-line bg-white shadow-card`}>
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

// Leads table, modelled on the live admin, with contact details blurred (PII-safe).
const STATUS: Record<string, string> = {
  new: 'bg-amber-100 text-amber-700',
  contacted: 'bg-slate-100 text-slate-600',
  'tour booked': 'bg-green-100 text-green-700',
}
export function LeadsTableCard() {
  const rows = [
    ['Margaret Singh', 'margaret.s@example.com', 'new', '07700 900777', '2h'],
    ['Derek Mason', 'derek.m@example.com', 'new', '07700 901000', '6h'],
    ['Joan Fletcher', 'joan.f@example.com', 'contacted', '07700 900999', '21h'],
    ['Alan Pickering', 'alan.p@example.com', 'new', '07700 900888', '1d'],
    ['Sheila Roberts', 'sheila.r@example.com', 'tour booked', '07700 900555', '3d'],
    ['Brian Walsh', 'brian.w@example.com', 'new', '07700 900666', '3d'],
  ]
  return (
    <Shell url="trgdigital.com/leads" w="w-[540px]">
      <p className="font-display text-lg font-bold text-brand-ink">Leads</p>
      <div className="mt-3">
        {rows.map(([name, email, status, phone, recv]) => (
          <div key={email} className="flex items-center gap-3 border-b border-brand-line py-2.5 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-brand-pop">{name}</p>
              <p className="truncate select-none text-[10px] text-brand-ink-muted blur-[3px]">{email}</p>
            </div>
            <span className="hidden text-[10px] text-brand-ink-soft sm:block">Haywards Heath</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS[status as string]}`}>{status}</span>
            <span className="w-20 select-none text-[10px] text-brand-ink-soft blur-[3px]">{phone}</span>
            <span className="w-8 text-right text-[10px] text-brand-ink-muted">{recv}</span>
          </div>
        ))}
      </div>
    </Shell>
  )
}

export function GithubCard() {
  const commits = [
    ['a1b2c3d', 'feat: lead distribution to buyers'],
    ['d4e5f6a', 'fix: enquiry email delivery'],
    ['7890abc', 'feat: care-finder quiz funnel'],
  ]
  return (
    <Shell url="github.com/trgdigital">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold text-brand-ink">careassura / web</p>
        <span className="rounded-full bg-[#8250df] px-2.5 py-0.5 text-[10px] font-semibold text-white">Merged</span>
      </div>
      <p className="mt-1 text-[11px] text-brand-ink-muted">main · 1,284 commits</p>
      <div className="mt-5 space-y-3">
        {commits.map(([hash, msg]) => (
          <div key={hash} className="flex items-center gap-2.5">
            <code className="rounded bg-brand-bg-warm px-1.5 py-0.5 text-[10px] text-brand-ink-soft">{hash}</code>
            <span className="truncate text-xs text-brand-ink">{msg}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-xs font-medium text-green-700">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        All checks passed
      </div>
    </Shell>
  )
}

export function GoogleSearchCard() {
  return (
    <Shell url="google.com">
      <div className="flex items-center gap-2 rounded-full border border-brand-line px-3 py-2.5 text-xs text-brand-ink-muted">
        <span className="text-base font-semibold">
          <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
        </span>
        <span className="truncate">care homes in haywards heath</span>
      </div>
      <div className="mt-6">
        <p className="text-[11px] text-[#202124]">careassura.com › haywards-heath</p>
        <p className="mt-1 text-base font-medium leading-snug text-[#1a0dab]">Care Homes in Haywards Heath | Free, Impartial Help</p>
        <p className="mt-1.5 text-xs leading-relaxed text-[#4d5156]">Find and compare brilliant care homes in Haywards Heath. Free, impartial help, covering residential, nursing and dementia care…</p>
      </div>
      <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">Ranking #1 on Google</p>
    </Shell>
  )
}

export function BingSearchCard() {
  return (
    <Shell url="bing.com">
      <div className="flex items-center gap-2 rounded-full border border-brand-line px-3 py-2.5 text-xs text-brand-ink-muted">
        <span className="text-base font-semibold text-[#008373]">Bing</span>
        <span className="truncate">care home haywards heath</span>
      </div>
      <div className="mt-6">
        <p className="text-[11px] text-[#4d5156]">careassura.com</p>
        <p className="mt-1 text-base font-medium leading-snug text-[#1a0dab]">Haywards Heath Care Homes, Genuine Availability</p>
        <p className="mt-1.5 text-xs leading-relaxed text-[#4d5156]">Tell us what you need and local care homes with availability come to you. Free for families, no obligation…</p>
      </div>
      <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">Top of Bing results</p>
    </Shell>
  )
}

export function RankingsCard() {
  const rows = [
    ['care homes haywards heath', 1, '+4'],
    ['nursing home near me', 2, '+7'],
    ['respite care sussex', 3, '+5'],
    ['dementia care haywards heath', 2, '+3'],
  ]
  return (
    <Shell url="trgdigital.com/rankings">
      <p className="font-display text-lg font-bold text-brand-ink">Keyword rankings</p>
      <div className="mt-4 space-y-3.5">
        {rows.map(([kw, pos, chg]) => (
          <div key={kw as string} className="flex items-center gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-brand-pop text-xs font-bold text-white">#{pos}</span>
            <span className="min-w-0 flex-1 truncate text-xs text-brand-ink">{kw}</span>
            <span className="text-[11px] font-semibold text-green-600">↑ {chg}</span>
          </div>
        ))}
      </div>
    </Shell>
  )
}

export function AdsCard() {
  const stats = [['Spend', '£1,240'], ['Enquiries', '86'], ['Cost / enquiry', '£14']]
  return (
    <Shell url="ads.google.com">
      <p className="text-xs font-medium text-brand-ink-muted">Care enquiries · campaign</p>
      <p className="mt-1 font-display text-lg font-bold text-brand-ink">Live &amp; converting</p>
      <div className="mt-5 space-y-3">
        {stats.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-brand-line pb-3 last:border-0">
            <span className="text-xs text-brand-ink-soft">{k}</span>
            <span className="font-display text-base font-bold text-brand-ink">{v}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">↓ 38% cost per enquiry</p>
    </Shell>
  )
}

export function CmsCard() {
  return (
    <Shell url="trgdigital.com/admin">
      <p className="text-xs font-medium text-brand-ink-muted">New article</p>
      <div className="mt-3 rounded-lg border border-brand-line px-3 py-2 text-sm font-semibold text-brand-ink">
        Choosing a care home: a family guide
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2.5 w-full rounded bg-brand-bg-warm" />
        <div className="h-2.5 w-11/12 rounded bg-brand-bg-warm" />
        <div className="h-2.5 w-full rounded bg-brand-bg-warm" />
        <div className="h-2.5 w-4/5 rounded bg-brand-bg-warm" />
      </div>
      <div className="mt-5 flex items-center gap-2">
        <span className="rounded-md bg-brand-pop px-3 py-1.5 text-xs font-semibold text-white">Publish</span>
        <span className="rounded-md border border-brand-line px-3 py-1.5 text-xs font-medium text-brand-ink-soft">Save draft</span>
        <span className="ml-auto rounded-full bg-brand-bg-warm px-2 py-0.5 text-[10px] text-brand-ink-muted">SEO 98</span>
      </div>
    </Shell>
  )
}

export function VercelCard() {
  const deps = [
    ['careassura.com', 'Production · main', '2m'],
    ['crosswayscarehome.co.uk', 'Production · main', '14m'],
    ['ferndalenursinghome.co.uk', 'Production · main', '38m'],
    ['carestreamai.com', 'Production · main', '1h'],
    ['trgdigital.com', 'Production · main', '3h'],
    ['ascotgrange.co.uk', 'Production · main', '5h'],
  ]
  return (
    <Shell url="vercel.com/trgdigital">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-brand-ink" aria-hidden><path d="M12 3 22 21 2 21Z" /></svg>
        <p className="font-display text-sm font-bold text-brand-ink">Deployments</p>
      </div>
      <div className="mt-5 space-y-3">
        {deps.map(([name, branch, time]) => (
          <div key={name} className="flex items-center justify-between rounded-lg border border-brand-line px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-brand-ink">{name}</p>
              <p className="truncate text-[10px] text-brand-ink-muted">{branch} · {time} ago</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" /> Ready
            </span>
          </div>
        ))}
      </div>
    </Shell>
  )
}
