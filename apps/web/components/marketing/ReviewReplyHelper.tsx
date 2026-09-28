'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Check, Copy, Loader2, Lock, MessageSquareText, RotateCcw, ShieldAlert, Star } from 'lucide-react'
import { getAttribution } from '@/lib/attribution'
import {
  PLATFORMS,
  REVIEW_MAX_CHARS,
  REVIEW_TOOL_NAME,
  SERVICE_TYPES,
  TONES,
  precheckReview,
  safeguardingFlags,
  type Platform,
  type PrecheckFinding,
  type ServiceTypeId,
  type Tone,
} from '@/lib/review-reply'

type Lead = { name: string; email: string; company: string }
type Result = {
  safeguarding: boolean
  safeguardingSource?: 'rules' | 'ai'
  reply: string
  shorter: string
  words?: number
  precheck: PrecheckFinding[]
  mentions: string[]
}

const LEAD_KEY = 'trg_review_reply_lead'
const COUNT_KEY = 'trg_review_reply_count'
const SESSION_DRAFTS = 8

const KIND_LABEL: Record<PrecheckFinding['kind'], string> = {
  name: 'Name',
  health: 'Health or care detail',
  date: 'Date or length of care',
  room: 'Room or flat number',
  contact: 'Contact detail',
}

const input =
  'w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20'

function readSession<T>(key: string): T | null {
  try {
    const v = sessionStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : null
  } catch {
    return null
  }
}
function writeSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode */
  }
}

function CopyBox({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="rounded-2xl border border-brand-line p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">{label}</p>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              ?.writeText(text)
              .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              })
              .catch(() => {})
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-brand-pop hover:bg-brand-pop/10"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-brand-ink">{text}</p>
    </div>
  )
}

function PrecheckList({ findings }: { findings: PrecheckFinding[] }) {
  if (findings.length === 0) return null
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" /> This review contains personal details. Do not repeat them in your reply.
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {findings.map((f) => (
          <li key={`${f.kind}:${f.text}`} className="rounded-full bg-white px-2.5 py-0.5 text-xs">
            <span className="font-semibold">{KIND_LABEL[f.kind]}:</span> {f.text}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs">
        Replies are public. Confirming that someone lives with you or receives your care, or mentioning their health, can breach
        confidentiality and UK GDPR, even when the reviewer shared it first.
      </p>
    </div>
  )
}

export function ReviewReplyHelper() {
  const [review, setReview] = useState('')
  const [platform, setPlatform] = useState<Platform>('Google')
  const [stars, setStars] = useState(5)
  const [managerName, setManagerName] = useState('')
  const [role, setRole] = useState('Registered Manager')
  const [serviceName, setServiceName] = useState('')
  const [serviceType, setServiceType] = useState<ServiceTypeId>('care-home')
  const [tone, setTone] = useState<Tone>('warm')
  const [contact, setContact] = useState('')

  const [lead, setLead] = useState<Lead | null>(null)
  const [showGate, setShowGate] = useState(false)
  const [drafts, setDrafts] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    setLead(readSession<Lead>(LEAD_KEY))
    setDrafts(readSession<number>(COUNT_KEY) ?? 0)
  }, [])

  const findings = useMemo(() => (review.trim().length >= 10 ? precheckReview(review, serviceName) : []), [review, serviceName])
  const concern = useMemo(() => safeguardingFlags(review).length > 0, [review])

  function validate(): string | null {
    if (review.trim().length < 10) return 'Please paste the review you want to reply to.'
    if (review.length > REVIEW_MAX_CHARS) return `Reviews are limited to ${REVIEW_MAX_CHARS} characters.`
    if (managerName.trim().length < 2 || role.trim().length < 2) return 'Please add your name and role for the sign-off.'
    if (serviceName.trim().length < 2) return 'Please add your service name.'
    return null
  }

  async function draft(forLead: Lead) {
    if (drafts >= SESSION_DRAFTS) {
      setError('You have used all the drafts for this session. Please come back later, or speak to us about review management.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/review-reply-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review,
          platform,
          stars,
          managerName,
          role,
          serviceName,
          serviceType,
          tone,
          contact: contact.trim() || undefined,
          leadEmail: forLead.email,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 403 && data.needsLead) {
        try {
          sessionStorage.removeItem(LEAD_KEY)
        } catch {
          /* ignore */
        }
        setLead(null)
        setShowGate(true)
        return
      }
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      setResult(data as Result)
      const n = drafts + 1
      setDrafts(n)
      writeSession(COUNT_KEY, n)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setError(null)
    if (!lead) {
      setShowGate(true)
      return
    }
    void draft(lead)
  }

  function onUnlocked(l: Lead) {
    writeSession(LEAD_KEY, l)
    setLead(l)
    setShowGate(false)
    void draft(l)
  }

  const left = Math.max(0, SESSION_DRAFTS - drafts)

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="rr-review" className="text-sm font-semibold text-brand-ink">Paste the review</label>
          <textarea
            id="rr-review"
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, REVIEW_MAX_CHARS))}
            rows={6}
            placeholder="Paste the review exactly as it appears"
            className={`${input} mt-1.5 resize-y`}
          />
          <p className="mt-1 text-right text-xs text-brand-ink-muted">{review.length} / {REVIEW_MAX_CHARS}</p>
        </div>

        <PrecheckList findings={findings} />
        {concern && (
          <div className="flex gap-2 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              This review may raise a safeguarding concern. We will not draft a public response to the allegation, only a short,
              neutral holding reply. Follow your safeguarding and complaints procedures first.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rr-platform" className="text-sm font-semibold text-brand-ink">Where was it posted?</label>
            <select id="rr-platform" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)} className={`${input} mt-1.5 bg-white`}>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <span className="text-sm font-semibold text-brand-ink">Star rating</span>
            <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={stars === n}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  onClick={() => setStars(n)}
                  className="rounded p-1 hover:bg-brand-pop/10"
                >
                  <Star className={`h-6 w-6 ${n <= stars ? 'fill-amber-400 text-amber-400' : 'text-brand-line'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rr-service" className="text-sm font-semibold text-brand-ink">Service name</label>
            <input id="rr-service" value={serviceName} onChange={(e) => setServiceName(e.target.value)} maxLength={120} placeholder="e.g. Oak Lodge" className={`${input} mt-1.5`} />
          </div>
          <div>
            <label htmlFor="rr-type" className="text-sm font-semibold text-brand-ink">Type of service</label>
            <select id="rr-type" value={serviceType} onChange={(e) => setServiceType(e.target.value as ServiceTypeId)} className={`${input} mt-1.5 bg-white`}>
              {SERVICE_TYPES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rr-name" className="text-sm font-semibold text-brand-ink">Your name</label>
            <input id="rr-name" value={managerName} onChange={(e) => setManagerName(e.target.value)} maxLength={80} placeholder="e.g. Sarah Jones" className={`${input} mt-1.5`} />
          </div>
          <div>
            <label htmlFor="rr-role" className="text-sm font-semibold text-brand-ink">Your role</label>
            <input id="rr-role" value={role} onChange={(e) => setRole(e.target.value)} maxLength={80} className={`${input} mt-1.5`} />
          </div>
        </div>

        <div>
          <label htmlFor="rr-contact" className="text-sm font-semibold text-brand-ink">
            Contact for follow up <span className="font-normal text-brand-ink-muted">(optional, used for negative reviews)</span>
          </label>
          <input id="rr-contact" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} placeholder="e.g. 01234 567890 or manager@yourservice.co.uk" className={`${input} mt-1.5`} />
        </div>

        <div>
          <span className="text-sm font-semibold text-brand-ink">Tone</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                aria-pressed={tone === t}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${tone === t ? 'border-brand-pop bg-brand-pop/10 text-brand-pop' : 'border-brand-line text-brand-ink-soft hover:border-brand-pop/40'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        {!showGate && (
          <button type="submit" disabled={loading} className="btn-pop w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><MessageSquareText className="h-4 w-4" /> Draft my reply</>}
            {!loading && <span className="btn-arrow" aria-hidden>→</span>}
          </button>
        )}
        {lead && !showGate && (
          <p className="text-center text-xs text-brand-ink-muted">{left} draft{left === 1 ? '' : 's'} left this session</p>
        )}
      </form>

      {showGate && <ReplyLeadGate summary={`Service: ${serviceName || 'not given'} (${serviceType}). Platform: ${platform}. ${stars} star review.`} onUnlocked={onUnlocked} />}

      {result && (
        <div className="mt-6 space-y-4 border-t border-brand-line pt-6">
          {result.safeguarding && (
            <div className="rounded-2xl bg-red-600 p-5 text-white">
              <p className="flex items-center gap-2 font-display text-lg font-bold">
                <ShieldAlert className="h-5 w-5" /> Safeguarding concern: follow your procedures first
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/90">
                <li>Treat the review as a possible safeguarding concern and follow your safeguarding policy, including a referral to the local authority safeguarding team where needed.</li>
                <li>Log it through your complaints procedure and consider whether a CQC notification is required.</li>
                <li>Do not defend, explain or share any detail in public. Use the short holding reply below, then continue the conversation privately.</li>
              </ul>
            </div>
          )}
          {result.mentions.length > 0 && (
            <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              Check before posting: the draft mentions {result.mentions.join(', ')}. Remove anything personal.
            </p>
          )}
          <CopyBox label={result.safeguarding ? 'Neutral holding reply' : 'Suggested reply'} text={result.reply} />
          <CopyBox label="Shorter version" text={result.shorter} />
          <p className="text-xs text-brand-ink-muted">
            AI drafts can get things wrong. Read every reply before you post it, and replace any [placeholder] with your details.
          </p>
          <button type="button" onClick={() => setResult(null)} className="btn-cta-outline w-full">
            <RotateCcw className="h-4 w-4" /> Draft another reply
          </button>
          <p className="text-center text-sm text-brand-ink-soft">
            Want more reviews and better local rankings?{' '}
            <Link href="/google-business-profile" className="font-semibold text-brand-pop hover:underline">See our Google Business Profile service</Link>.
          </p>
        </div>
      )}
    </div>
  )
}

// Lead capture for the reply helper. Same fields, honeypot and /api/marketing-leads post as
// ToolLeadGate (so nurture and lead alerts behave the same), but it hands the lead back so the
// draft request can carry it, and its copy fits a drafting tool rather than a report.
function ReplyLeadGate({ summary, onUnlocked }: { summary: string; onUnlocked: (lead: Lead) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2 || !/.+@.+\..+/.test(email)) {
      setError('Please add your name and a valid email.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/marketing-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...getAttribution(),
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          message: `Used the ${REVIEW_TOOL_NAME}. ${summary}`.slice(0, 2000),
          website: website || undefined,
        }),
      })
      if (res.status === 429) throw new Error('Too many sign ups from this connection. Please try again in an hour.')
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      onUnlocked({ name: name.trim(), email: email.trim(), company: company.trim() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-pop/30 bg-brand-bg-warm/60 p-6 text-center sm:p-8">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-pop/10">
        <Lock className="h-5 w-5 text-brand-pop" />
      </span>
      <p className="mt-4 font-display text-lg font-bold text-brand-ink">Get your reply drafted</p>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-brand-ink-soft">
        Enter your details once and draft replies to several reviews in this session. Free, no obligation.
      </p>
      <form onSubmit={submit} className="mx-auto mt-5 max-w-md space-y-3 text-left">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" className={input} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@yourservice.co.uk" aria-label="Email" className={input} />
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Organisation (optional)" aria-label="Organisation" className={input} />
        <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-pop w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Draft my reply'}
          {!busy && <span className="btn-arrow" aria-hidden>→</span>}
        </button>
      </form>
    </div>
  )
}
