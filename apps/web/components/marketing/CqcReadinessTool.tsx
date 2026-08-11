'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { ToolLeadGate } from '@/components/marketing/ToolLeadGate'

// A self-check across the five CQC key questions. Each is rated with a 3-button
// segmented control (Confident 2 / Some gaps 1 / Not ready 0). The total out of 10
// bands the home's readiness. It is an indicative self-check, not an official
// CQC assessment.

const KEY_QUESTIONS = [
  { key: 'safe',       label: 'Safe',       desc: 'Safeguarding, staffing, medicines and risk are well managed.' },
  { key: 'effective',  label: 'Effective',  desc: 'Care follows best practice and staff have the right training and support.' },
  { key: 'caring',     label: 'Caring',     desc: 'People are treated with dignity, kindness and respect.' },
  { key: 'responsive', label: 'Responsive', desc: 'Care is person-centred and responds to changing needs and complaints.' },
  { key: 'well-led',   label: 'Well-led',   desc: 'Leadership, culture, governance and continuous improvement are strong.' },
] as const
type QuestionKey = (typeof KEY_QUESTIONS)[number]['key']

const RATINGS = [
  { label: 'Confident', value: 2 },
  { label: 'Some gaps', value: 1 },
  { label: 'Not ready', value: 0 },
] as const

function ratingLabel(value: number): string {
  return RATINGS.find((r) => r.value === value)?.label ?? 'Not ready'
}

type BandKey = 'prepared' | 'gaps' | 'risk'
const BANDS: Record<BandKey, { label: string; chip: string; note: string }> = {
  prepared: {
    label: 'Well-prepared',
    chip: 'bg-green-100 text-green-800',
    note: 'You are in a strong position. Keep evidence current, rehearse your responses and close any remaining amber areas so nothing slips before the inspector arrives.',
  },
  gaps: {
    label: 'Some gaps to close',
    chip: 'bg-amber-100 text-amber-800',
    note: 'You have solid foundations but there is work to do. Prioritise the areas rated below Confident, put a dated action plan against each and gather the evidence that proves the improvement.',
  },
  risk: {
    label: 'At risk',
    chip: 'bg-red-100 text-red-800',
    note: 'Several key questions need urgent attention. Focus first on Safe and Well-led, build a clear improvement plan with owners and dates, and consider bringing in extra support before your next inspection.',
  },
}

function bandFor(score: number): BandKey {
  if (score >= 8) return 'prepared'
  if (score >= 4) return 'gaps'
  return 'risk'
}

const emptyScores = () =>
  KEY_QUESTIONS.reduce((a, q) => ({ ...a, [q.key]: 2 }), {} as Record<QuestionKey, number>)

export function CqcReadinessTool() {
  const [scores, setScores] = useState<Record<QuestionKey, number>>(emptyScores())

  const total = KEY_QUESTIONS.reduce((s, q) => s + scores[q.key], 0)
  const band = bandFor(total)
  const areasToAddress = KEY_QUESTIONS.filter((q) => scores[q.key] < 2)

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* ── Rate the five CQC key questions ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Rate the five CQC key questions</p>
      <p className="mt-1 text-sm text-brand-ink-soft">Be honest about how ready each area is for your next inspection.</p>

      <div className="mt-4 space-y-4">
        {KEY_QUESTIONS.map((q) => (
          <div key={q.key} className="rounded-2xl border border-brand-line bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-bold text-brand-ink">{q.label}</span>
              <div className="flex gap-1.5">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setScores((s) => ({ ...s, [q.key]: r.value }))}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      scores[q.key] === r.value
                        ? 'border-brand-pop bg-brand-pop text-white'
                        : 'border-brand-line bg-white text-brand-ink-soft hover:border-brand-pop'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-brand-ink-muted">{q.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Free headline result ── */}
      <div className="mt-7 rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-6 text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-pop">
          <ShieldCheck className="h-3.5 w-3.5" /> Your inspection readiness
        </p>
        <p className={`mx-auto mt-3 inline-block rounded-pill px-4 py-1.5 text-sm font-bold ${BANDS[band].chip}`}>
          {BANDS[band].label}
        </p>
        <p className="mt-3 font-display text-5xl font-bold leading-none text-brand-ink">
          {total}<span className="text-2xl text-brand-ink-muted">/10</span>
        </p>
      </div>

      {/* ── Gated detailed report ── */}
      <div className="mt-8">
        <ToolLeadGate
          toolName="CQC Inspection Readiness Self-Assessment"
          summary={`Readiness: ${BANDS[band].label} (${total}/10).`}
        >
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h3 className="font-display text-xl font-bold text-brand-ink">Your CQC readiness report</h3>
            <p className="mt-1 text-sm text-brand-ink-soft">
              Overall: <span className="font-semibold text-brand-ink">{BANDS[band].label}</span> ({total}/10), across the five CQC key questions.
            </p>

            <table className="mt-5 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-ink-muted">
                  <th className="py-2">Key question</th><th className="py-2 text-right">Your rating</th>
                </tr>
              </thead>
              <tbody>
                {KEY_QUESTIONS.map((q) => (
                  <tr key={q.key} className="border-b border-brand-line/60">
                    <td className="py-2.5 font-semibold text-brand-ink">{q.label}</td>
                    <td className="py-2.5 text-right">
                      <span className={`rounded-pill px-2.5 py-0.5 text-xs font-bold ${
                        scores[q.key] === 2 ? 'bg-green-100 text-green-800'
                          : scores[q.key] === 1 ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ratingLabel(scores[q.key])}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {areasToAddress.length > 0 ? (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <AlertTriangle className="h-4 w-4" /> Areas to address before inspection
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-brand-ink-soft">
                  {areasToAddress.map((q) => (
                    <li key={q.key}>
                      <span className="font-semibold text-brand-ink">{q.label}</span> ({ratingLabel(scores[q.key])}), {q.desc}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
                You rated every key question Confident. Keep your evidence current and rehearse your inspection story.
              </div>
            )}

            <p className="mt-5 text-sm font-semibold text-brand-ink">Next steps</p>
            <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">{BANDS[band].note}</p>

            <p className="mt-5 text-xs leading-relaxed text-brand-ink-muted">
              This is an indicative self-check, not an official CQC assessment. Use it to focus your preparation
              alongside your own evidence, audits and professional judgement.
            </p>
            <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/book-a-demo" className="btn-pop">See how CareStream keeps you inspection-ready<span className="btn-arrow" aria-hidden>→</span></Link>
              <Link href="/contact" className="btn-cta-outline">Talk to TRG about your home</Link>
            </div>
          </div>
        </ToolLeadGate>
      </div>
    </div>
  )
}
