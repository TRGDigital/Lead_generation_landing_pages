import { Check, Minus, X } from 'lucide-react'

// The scorecard pieces shared by /why-a-care-specialist and the /compare pages: the tick,
// dash and cross marks, the small hero card, and the full comparison table. Kept dumb on
// purpose: each page supplies its own options, rows and notes.

export type Mark = 'yes' | 'some' | 'no'

export function MarkIcon({ m, small }: { m: Mark; small?: boolean }) {
  const box = small ? 'h-6 w-6' : 'h-7 w-7'
  const icon = small ? 'h-3.5 w-3.5' : 'h-4 w-4'
  if (m === 'yes')
    return (
      <span className={`inline-flex ${box} items-center justify-center rounded-full bg-brand-pop text-white`} aria-label="Yes">
        <Check className={icon} />
      </span>
    )
  if (m === 'some')
    return (
      <span className={`inline-flex ${box} items-center justify-center rounded-full bg-brand-accent/40 text-brand-ink`} aria-label="Partly">
        <Minus className={icon} />
      </span>
    )
  return (
    <span className={`inline-flex ${box} items-center justify-center rounded-full bg-brand-line text-brand-ink-muted`} aria-label="No">
      <X className={icon} />
    </span>
  )
}

// Tailwind needs whole class names in the source, so the grid for each column count is
// spelled out rather than built from a number.
const CARD_GRID_4: [base: string, sm: string] = ['grid-cols-[1fr_repeat(4,2.6rem)]', 'sm:grid-cols-[1fr_repeat(4,4rem)]']
const CARD_GRID: Record<number, [base: string, sm: string]> = {
  2: ['grid-cols-[1fr_repeat(2,4.5rem)]', 'sm:grid-cols-[1fr_repeat(2,6rem)]'],
  3: ['grid-cols-[1fr_repeat(3,3.2rem)]', 'sm:grid-cols-[1fr_repeat(3,4.5rem)]'],
  4: CARD_GRID_4,
}

export type ScorecardOption = {
  /** Shown below the sm breakpoint, where space beside the row labels is tight. */
  phone: string
  /** Shown from sm up. */
  full: string
}

/**
 * The hero card: a few rows of the comparison, in short. The first option is ours and is
 * highlighted. Pages should include at least one row where the first option loses, because
 * a scorecard that only has ticks for us is not believable.
 */
export function ScorecardCard({
  title,
  options,
  rows,
  footer,
}: {
  title: string
  options: ScorecardOption[]
  rows: { short: string; marks: Mark[] }[]
  footer: string
}) {
  const [gridBase, gridSm] = CARD_GRID[options.length] ?? CARD_GRID_4
  return (
    <div className="rounded-3xl border-2 border-brand-ink bg-white p-4 shadow-[6px_6px_0_0_#2a2620] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">Scorecard</p>
      <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">{title}</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-brand-line">
        <div className={`grid ${gridBase} items-end gap-x-1 bg-brand-bg-warm px-2.5 py-2 sm:gap-x-0 sm:px-3 ${gridSm}`}>
          <span />
          {options.map((o, i) => (
            <span
              key={o.full}
              className={`text-center text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${i === 0 ? 'text-brand-pop' : 'text-brand-ink-muted'}`}
            >
              <span className="sm:hidden">{o.phone}</span>
              <span className="hidden sm:inline">{o.full}</span>
            </span>
          ))}
        </div>
        {rows.map((r) => (
          <div
            key={r.short}
            className={`grid ${gridBase} items-center gap-x-1 border-t border-brand-line px-2.5 py-2.5 sm:gap-x-0 sm:px-3 ${gridSm}`}
          >
            <span className="text-xs font-semibold leading-tight text-brand-ink sm:text-sm">{r.short}</span>
            {r.marks.map((m, i) => (
              <span key={i} className={`flex justify-center ${i === 0 ? 'rounded-md bg-brand-pop/5 py-0.5' : ''}`}>
                <MarkIcon m={m} small />
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">{footer}</p>
    </div>
  )
}

/** The full table: one row per criterion with its note, one column per option. */
export function ComparisonTable({
  options,
  rows,
  minWidth = 'min-w-[720px]',
}: {
  options: readonly string[]
  rows: { label: string; marks: Mark[]; note: string }[]
  /** Below this the table scrolls sideways inside its frame, not the page. */
  minWidth?: string
}) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-brand-line bg-white shadow-soft">
      <table className={`w-full ${minWidth} text-left text-sm`}>
        <thead className="bg-white text-xs uppercase tracking-wider text-brand-ink-muted">
          <tr>
            <th className="px-4 py-4 font-semibold">&nbsp;</th>
            {options.map((o, i) => (
              <th key={o} className={`px-4 py-4 text-center font-semibold ${i === 0 ? 'text-brand-pop' : ''}`}>
                {o}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-line">
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="px-4 py-4 align-top">
                <p className="font-semibold text-brand-ink">{r.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-brand-ink-muted">{r.note}</p>
              </td>
              {r.marks.map((m, i) => (
                <td key={i} className={`px-4 py-4 text-center align-middle ${i === 0 ? 'bg-brand-pop/5' : ''}`}>
                  <MarkIcon m={m} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
