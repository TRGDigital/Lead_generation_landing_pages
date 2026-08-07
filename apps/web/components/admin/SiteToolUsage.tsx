import type { SiteToolStat } from '@/lib/websites'

// Per-site family-tools usage: how many times each embedded tool was opened,
// how engaged people were, and how many clicked its call-to-action.
export default function SiteToolUsage({ tools }: { tools: SiteToolStat[] }) {
  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 p-8 text-center text-sm text-brand-ink-muted">
        No tool usage in the last 30 days. Once the family tools are embedded and visitors use them, activity shows here.
      </div>
    )
  }
  const max = Math.max(...tools.map((t) => t.views), 1)
  return (
    <div className="space-y-3">
      {tools.map((t) => (
        <div key={t.tool} className="rounded-xl border border-brand-line p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-brand-ink">{t.toolName}</p>
            <span className="flex items-center gap-3 text-xs text-brand-ink-muted">
              <span><strong className="text-brand-ink">{t.views}</strong> opens</span>
              <span className={t.engagementRate >= 40 ? 'text-green-600 font-semibold' : ''}>{t.engagementRate}% engaged</span>
              {t.ctas > 0 && <span><strong className="text-brand-ink">{t.ctas}</strong> CTA clicks</span>}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-bg-warm">
            <div className="h-full rounded-full bg-brand-accent" style={{ width: `${Math.round((t.views / max) * 100)}%` }} />
          </div>
        </div>
      ))}
      <p className="text-[11px] text-brand-ink-muted">
        &ldquo;Opens&rdquo; = the tool loaded on the site · &ldquo;engaged&rdquo; = the visitor interacted with it · &ldquo;CTA clicks&rdquo; = they clicked through to enquire.
      </p>
    </div>
  )
}
