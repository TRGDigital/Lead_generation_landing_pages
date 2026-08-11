'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, ShieldCheck, FileWarning } from 'lucide-react'
import { ToolLeadGate } from '@/components/marketing/ToolLeadGate'

// A quick mandatory-training compliance check: set your care-staff headcount, then
// say how many staff are up to date on each mandatory topic. See your overall
// compliance percentage and how many training records are outstanding, then unlock a
// per-topic breakdown that flags any topic below 90%.

const TOPICS = [
  { key: 'safeguarding', label: 'Safeguarding adults' },
  { key: 'moving', label: 'Moving & handling' },
  { key: 'ipc', label: 'Infection prevention & control' },
  { key: 'fire', label: 'Fire safety' },
  { key: 'bls', label: 'Basic life support / first aid' },
  { key: 'mca', label: 'Mental Capacity Act & DoLS' },
  { key: 'medication', label: 'Medication' },
  { key: 'food', label: 'Food hygiene' },
  { key: 'hs', label: 'Health & safety' },
  { key: 'equality', label: 'Equality & diversity' },
] as const
type TopicKey = (typeof TOPICS)[number]['key']

const DEFAULT_STAFF = 40
// Default each topic to a few short of full so gaps show.
const initialUpToDate = (staff: number) =>
  TOPICS.reduce(
    (a, t, i) => ({ ...a, [t.key]: Math.max(0, staff - (3 + (i % 4))) }),
    {} as Record<TopicKey, number>,
  )

function Stepper({ label, value, onChange, min = 0, max = 200 }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      <div className="mt-1.5 flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </button>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value.replace(/[^0-9]/g, '')) || 0))}
          className="h-10 w-full rounded-lg border border-brand-line text-center text-sm font-semibold focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
        />
        <button type="button" onClick={() => onChange(clamp(value + 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Increase">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function TrainingComplianceTool() {
  const [staff, setStaff] = useState(DEFAULT_STAFF)
  const [upToDate, setUpToDate] = useState<Record<TopicKey, number>>(initialUpToDate(DEFAULT_STAFF))

  const setStaffCount = (n: number) => {
    setStaff(n)
    // Clamp each topic's up-to-date count down if it now exceeds the staff count.
    setUpToDate((prev) =>
      TOPICS.reduce((a, t) => ({ ...a, [t.key]: Math.min(prev[t.key], n) }), {} as Record<TopicKey, number>),
    )
  }

  const rows = TOPICS.map((t) => {
    const done = Math.min(upToDate[t.key], staff)
    const pct = staff > 0 ? (done / staff) * 100 : 0
    const outstanding = staff - done
    return { ...t, done, pct, outstanding }
  })

  const totalUpToDate = rows.reduce((s, r) => s + r.done, 0)
  const overallPct = staff > 0 ? (totalUpToDate / (TOPICS.length * staff)) * 100 : 0
  const totalOutstanding = rows.reduce((s, r) => s + r.outstanding, 0)

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* ── Your team ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your team</p>
      <p className="mt-1 text-sm text-brand-ink-soft">Set your headcount, then say how many staff are up to date on each mandatory topic.</p>

      <div className="mt-4">
        <Stepper label="Number of care staff" value={staff} onChange={setStaffCount} min={1} max={500} />
      </div>

      {/* ── Mandatory topics ── */}
      <div className="mt-6 space-y-3">
        {TOPICS.map((t) => (
          <Stepper
            key={t.key}
            label={`${t.label} — up to date`}
            value={upToDate[t.key]}
            onChange={(n) => setUpToDate((s) => ({ ...s, [t.key]: n }))}
            min={0}
            max={staff}
          />
        ))}
      </div>

      {/* ── Free headline result ── */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-pop"><ShieldCheck className="h-3.5 w-3.5" /> Overall compliance</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none text-brand-ink">{Math.round(overallPct)}%</p>
        </div>
        <div className="rounded-2xl bg-brand-ink p-6 text-center text-white">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-accent"><FileWarning className="h-3.5 w-3.5" /> Training records outstanding</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none">{totalOutstanding.toLocaleString('en-GB')}</p>
        </div>
      </div>

      {/* ── Gated detailed report ── */}
      <div className="mt-8">
        <ToolLeadGate
          toolName="Mandatory Training Compliance Checker"
          summary={`${Math.round(overallPct)}% overall compliance across ${staff} staff, ${totalOutstanding} training records outstanding.`}
        >
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h3 className="font-display text-xl font-bold text-brand-ink">Your training compliance report</h3>
            <p className="mt-1 text-sm text-brand-ink-soft">Based on {staff} care staff across {TOPICS.length} mandatory topics. Any topic below 90% is flagged.</p>

            <table className="mt-5 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-ink-muted">
                  <th className="py-2">Topic</th><th className="py-2 text-right">Up to date</th><th className="py-2 text-right">Of staff</th><th className="py-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const low = r.pct < 90
                  return (
                    <tr key={r.key} className="border-b border-brand-line/60">
                      <td className="py-2.5 font-semibold text-brand-ink">{r.label}</td>
                      <td className="py-2.5 text-right">{r.done}</td>
                      <td className="py-2.5 text-right">{staff}</td>
                      <td className="py-2.5 text-right">
                        {low ? (
                          <span className="rounded-pill bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">{Math.round(r.pct)}%</span>
                        ) : (
                          <span className="font-semibold">{Math.round(r.pct)}%</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                <tr className="font-bold text-brand-ink">
                  <td className="py-2.5">Overall</td><td className="py-2.5 text-right">{totalUpToDate}</td><td className="py-2.5 text-right">{TOPICS.length * staff}</td><td className="py-2.5 text-right">{Math.round(overallPct)}%</td>
                </tr>
              </tbody>
            </table>

            <p className="mt-5 text-xs leading-relaxed text-brand-ink-muted">
              Topics flagged in red are below 90% compliance and are your priority for booking or refreshing training.
              This is an indicative guide; check your own training matrix and CQC requirements, and record completions
              against each member of staff.
            </p>
            <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/book-a-demo" className="btn-pop">See how CareStream tracks &amp; delivers training<span className="btn-arrow" aria-hidden>→</span></Link>
              <Link href="/contact" className="btn-cta-outline">Talk to TRG about your home</Link>
            </div>
          </div>
        </ToolLeadGate>
      </div>
    </div>
  )
}
