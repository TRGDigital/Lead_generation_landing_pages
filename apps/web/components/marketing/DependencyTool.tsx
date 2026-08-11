'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Minus, Trash2, Users, Clock } from 'lucide-react'
import { ToolLeadGate } from '@/components/marketing/ToolLeadGate'

// A per-resident-profile dependency assessment (IoRN-style): each profile is scored
// across six care domains, which maps to a dependency band and indicative care hours.
// Build up the home's profile, see the dependency mix + total care hours it implies.

const DOMAINS = [
  { key: 'mobility',   label: 'Mobility & transfers' },
  { key: 'personal',   label: 'Washing & dressing' },
  { key: 'continence', label: 'Continence' },
  { key: 'nutrition',  label: 'Eating & nutrition' },
  { key: 'cognition',  label: 'Cognition & behaviour' },
  { key: 'night',      label: 'Night-time needs' },
] as const
type DomainKey = (typeof DOMAINS)[number]['key']

const LEVELS = [
  { label: 'Independent', value: 0 },
  { label: 'Some help',   value: 1 },
  { label: 'Full help',   value: 2 },
] as const

type BandKey = 'self' | 'low' | 'medium' | 'high'
const BANDS: Record<BandKey, { label: string; hours: number; chip: string }> = {
  self:   { label: 'Self-caring', hours: 1, chip: 'bg-green-100 text-green-800' },
  low:    { label: 'Low',         hours: 2, chip: 'bg-lime-100 text-lime-800' },
  medium: { label: 'Medium',      hours: 3, chip: 'bg-amber-100 text-amber-800' },
  high:   { label: 'High',        hours: 4, chip: 'bg-red-100 text-red-800' },
}
const BAND_ORDER: BandKey[] = ['self', 'low', 'medium', 'high']

function bandFor(score: number): BandKey {
  if (score <= 2) return 'self'
  if (score <= 5) return 'low'
  if (score <= 8) return 'medium'
  return 'high'
}

type Group = { scores: Record<DomainKey, number>; band: BandKey; qty: number }

const emptyScores = () =>
  DOMAINS.reduce((a, d) => ({ ...a, [d.key]: 0 }), {} as Record<DomainKey, number>)

export function DependencyTool() {
  const [scores, setScores] = useState<Record<DomainKey, number>>(emptyScores())
  const [qty, setQty] = useState(1)
  const [groups, setGroups] = useState<Group[]>([])

  const currentScore = DOMAINS.reduce((s, d) => s + scores[d.key], 0)
  const currentBand = bandFor(currentScore)

  const add = () => {
    setGroups((g) => [...g, { scores: { ...scores }, band: currentBand, qty: Math.max(1, qty) }])
    setScores(emptyScores())
    setQty(1)
  }
  const remove = (i: number) => setGroups((g) => g.filter((_, k) => k !== i))

  // Totals
  const perBand = BAND_ORDER.map((b) => ({
    band: b,
    residents: groups.filter((g) => g.band === b).reduce((s, g) => s + g.qty, 0),
  }))
  const totalResidents = groups.reduce((s, g) => s + g.qty, 0)
  const hoursDay = groups.reduce((s, g) => s + BANDS[g.band].hours * g.qty, 0)
  const hoursWeek = hoursDay * 7

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* ── Assess a resident profile ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Assess a resident profile</p>
      <p className="mt-1 text-sm text-brand-ink-soft">Rate how much help this type of resident needs, then say how many match.</p>

      <div className="mt-4 space-y-3">
        {DOMAINS.map((d) => (
          <div key={d.key} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-brand-ink">{d.label}</span>
            <div className="flex gap-1.5">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setScores((s) => ({ ...s, [d.key]: l.value }))}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    scores[d.key] === l.value
                      ? 'border-brand-pop bg-brand-pop text-white'
                      : 'border-brand-line bg-white text-brand-ink-soft hover:border-brand-pop'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-brand-bg-warm/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-brand-ink">This profile:</span>
          <span className={`rounded-pill px-3 py-1 text-xs font-bold ${BANDS[currentBand].chip}`}>
            {BANDS[currentBand].label} dependency
          </span>
          <span className="text-xs text-brand-ink-muted">{BANDS[currentBand].hours} care hrs/day</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-ink">How many?</span>
          <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-line hover:border-brand-pop" aria-label="Fewer"><Minus className="h-4 w-4" /></button>
          <input inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/[^0-9]/g, '')) || 1))} className="h-9 w-14 rounded-lg border border-brand-line text-center text-sm font-semibold focus:border-brand-pop focus:outline-none" />
          <button type="button" onClick={() => setQty((n) => n + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-line hover:border-brand-pop" aria-label="More"><Plus className="h-4 w-4" /></button>
          <button type="button" onClick={add} className="btn-pop ml-1 !py-2 !text-sm">Add<span className="btn-arrow" aria-hidden>→</span></button>
        </div>
      </div>

      {/* ── Your home's profile ── */}
      {groups.length > 0 && (
        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your home&apos;s profile</p>
          <div className="mt-3 space-y-2">
            {groups.map((g, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-brand-line bg-white px-4 py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className={`rounded-pill px-2.5 py-0.5 text-xs font-bold ${BANDS[g.band].chip}`}>{BANDS[g.band].label}</span>
                  <span className="font-semibold text-brand-ink">{g.qty} resident{g.qty > 1 ? 's' : ''}</span>
                  <span className="text-xs text-brand-ink-muted">{BANDS[g.band].hours * g.qty} hrs/day</span>
                </div>
                <button type="button" onClick={() => remove(i)} className="text-brand-ink-muted hover:text-red-600" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Free headline result ── */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-ink p-6 text-center text-white">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-accent"><Users className="h-3.5 w-3.5" /> Residents assessed</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none">{totalResidents}</p>
        </div>
        <div className="rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-pop"><Clock className="h-3.5 w-3.5" /> Care hours needed / week</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none text-brand-ink">{hoursWeek.toLocaleString('en-GB')}</p>
          <p className="mt-1 text-xs text-brand-ink-muted">{hoursDay.toLocaleString('en-GB')} hrs/day</p>
        </div>
      </div>

      {/* dependency mix */}
      {totalResidents > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {perBand.map(({ band, residents }) => (
            <div key={band} className="rounded-xl border border-brand-line bg-white p-3 text-center">
              <p className={`mx-auto inline-block rounded-pill px-2 py-0.5 text-[11px] font-bold ${BANDS[band].chip}`}>{BANDS[band].label}</p>
              <p className="mt-1.5 font-display text-2xl font-bold text-brand-ink">{residents}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Gated detailed report ── */}
      <div className="mt-8">
        {totalResidents === 0 ? (
          <p className="rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 p-6 text-center text-sm text-brand-ink-muted">
            Add at least one resident profile above to see your dependency report.
          </p>
        ) : (
          <ToolLeadGate
            toolName="Care Home Dependency Tool"
            summary={`${totalResidents} residents, ${hoursWeek.toLocaleString('en-GB')} care hours/week.`}
          >
            <div className="rounded-2xl border border-brand-line bg-white p-6">
              <h3 className="font-display text-xl font-bold text-brand-ink">Your dependency report</h3>
              <p className="mt-1 text-sm text-brand-ink-soft">Based on {totalResidents} residents assessed across six care domains.</p>

              <table className="mt-5 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-ink-muted">
                    <th className="py-2">Dependency</th><th className="py-2 text-right">Residents</th><th className="py-2 text-right">Hrs/day each</th><th className="py-2 text-right">Hrs/week</th>
                  </tr>
                </thead>
                <tbody>
                  {perBand.filter((p) => p.residents > 0).map(({ band, residents }) => (
                    <tr key={band} className="border-b border-brand-line/60">
                      <td className="py-2.5 font-semibold text-brand-ink">{BANDS[band].label}</td>
                      <td className="py-2.5 text-right">{residents}</td>
                      <td className="py-2.5 text-right">{BANDS[band].hours}</td>
                      <td className="py-2.5 text-right font-semibold">{(BANDS[band].hours * residents * 7).toLocaleString('en-GB')}</td>
                    </tr>
                  ))}
                  <tr className="font-bold text-brand-ink">
                    <td className="py-2.5">Total</td><td className="py-2.5 text-right">{totalResidents}</td><td className="py-2.5 text-right">—</td><td className="py-2.5 text-right">{hoursWeek.toLocaleString('en-GB')}</td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-5 text-xs leading-relaxed text-brand-ink-muted">
                Indicative care hours (Self-caring 1, Low 2, Medium 3, High 4 hrs/resident/day). This is a guide to
                support planning and professional judgement, not a compliant staffing assessment. Turn these hours
                into staff numbers with our Staffing Calculator.
              </p>
              <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/tools/staffing-calculator" className="btn-pop">Work out staffing<span className="btn-arrow" aria-hidden>→</span></Link>
                <Link href="/contact" className="btn-cta-outline">Talk to TRG about your home</Link>
              </div>
            </div>
          </ToolLeadGate>
        )}
      </div>
    </div>
  )
}
