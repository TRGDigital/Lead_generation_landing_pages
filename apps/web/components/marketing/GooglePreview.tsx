'use client'

import { useState } from 'react'
import { Search, RotateCcw, Globe, Copy, CheckCheck, CircleCheck, TriangleAlert, CircleX } from 'lucide-react'
import { EnquiryButton } from '@/components/marketing/EnquiryOverlay'

type Tip = { level: 'good' | 'warn' | 'bad'; text: string }
type Result = {
  url: string
  displayUrl: string
  current: { title: string; description: string }
  og: { title: string; description: string; image: string }
  suggestion: { title: string; description: string }
  tips: Tip[]
}

function SearchResult({ displayUrl, title, description }: { displayUrl: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-bg-warm"><Globe className="h-3.5 w-3.5 text-brand-ink-muted" /></span>
        <span className="truncate text-xs text-[#4d5156]">{displayUrl.replace(/\//g, ' › ')}</span>
      </div>
      <p className="mt-1.5 truncate text-lg leading-tight text-[#1a0dab]">{title || 'No title set (Google will guess)'}</p>
      <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#4d5156]">{description || 'No description set, so Google writes its own from your page text.'}</p>
    </div>
  )
}

function Counter({ len, lo, hi }: { len: number; lo: number; hi: number }) {
  const ok = len >= lo && len <= hi
  return <span className={`text-xs font-semibold ${ok ? 'text-green-600' : 'text-amber-600'}`}>{len} chars{len > hi ? ' (too long)' : len < lo ? ' (too short)' : ' (ideal)'}</span>
}

const tipIcon = { good: CircleCheck, warn: TriangleAlert, bad: CircleX }
const tipColor = { good: 'text-green-600', warn: 'text-amber-500', bad: 'text-brand-pop' }

export function GooglePreview() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [eTitle, setETitle] = useState('')
  const [eDesc, setEDesc] = useState('')
  const [copied, setCopied] = useState<'title' | 'desc' | null>(null)

  async function run(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/google-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Something went wrong. Please try again.')
      else {
        setResult(data)
        setETitle(data.current.title || data.suggestion.title)
        setEDesc(data.current.description || data.suggestion.description)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copy(which: 'title' | 'desc') {
    navigator.clipboard?.writeText(which === 'title' ? eTitle : eDesc)
    setCopied(which)
    setTimeout(() => setCopied(null), 1500)
  }

  if (result) {
    return (
      <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">How you look on Google now</p>
        <div className="mt-2"><SearchResult displayUrl={result.displayUrl} title={result.current.title} description={result.current.description} /></div>

        {(result.og.image || result.og.title) && (
          <>
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">When your link is shared</p>
            <div className="mt-2 overflow-hidden rounded-xl border border-brand-line">
              {result.og.image
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={result.og.image} alt="" className="h-40 w-full bg-brand-bg-warm object-cover" />
                : <div className="flex h-40 w-full items-center justify-center bg-brand-bg-warm text-xs text-brand-ink-muted">No share image set</div>}
              <div className="bg-white p-3">
                <p className="truncate text-[11px] uppercase text-brand-ink-muted">{result.displayUrl.split('/')[0]}</p>
                <p className="truncate text-sm font-semibold text-brand-ink">{result.og.title || result.current.title}</p>
                <p className="line-clamp-1 text-xs text-brand-ink-soft">{result.og.description || result.current.description}</p>
              </div>
            </div>
          </>
        )}

        {result.tips.length > 0 && (
          <div className="mt-6 space-y-2">
            {result.tips.map((t, i) => {
              const Icon = tipIcon[t.level]
              return (
                <div key={i} className="flex items-start gap-2.5 text-sm">
                  <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tipColor[t.level]}`} />
                  <span className="leading-snug text-brand-ink-soft">{t.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Editable improved version with live preview */}
        <div className="mt-7 rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-5">
          <p className="font-display text-sm font-bold uppercase tracking-tight text-brand-pop">Write a better version</p>
          <p className="mt-1 text-xs text-brand-ink-soft">Edit the title and description below. Your Google preview updates live. Swap [your town] for your area.</p>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-brand-ink">Page title</label>
              <Counter len={eTitle.length} lo={30} hi={60} />
            </div>
            <input value={eTitle} onChange={(e) => setETitle(e.target.value)} className="mt-1 w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20" />
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-brand-ink">Meta description</label>
              <Counter len={eDesc.length} lo={70} hi={160} />
            </div>
            <textarea value={eDesc} onChange={(e) => setEDesc(e.target.value)} rows={3} className="mt-1 w-full resize-none rounded-lg border border-brand-line px-3 py-2 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20" />
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Live preview</p>
          <div className="mt-2"><SearchResult displayUrl={result.displayUrl} title={eTitle} description={eDesc} /></div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => copy('title')} className="btn-cta-outline flex-1 justify-center text-xs">
              {copied === 'title' ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy title
            </button>
            <button type="button" onClick={() => copy('desc')} className="btn-cta-outline flex-1 justify-center text-xs">
              {copied === 'desc' ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy description
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-brand-ink p-5 text-center text-white">
          <p className="font-display text-base font-bold uppercase tracking-tight">Want us to make it all work?</p>
          <p className="mt-1 text-sm text-white/70">We write and build care websites that win the click and turn it into an enquiry.</p>
          <EnquiryButton className="btn-cta btn-on-dark mt-4">
            Get a free action plan
            <span className="btn-arrow" aria-hidden>→</span>
          </EnquiryButton>
        </div>

        <button type="button" onClick={() => { setResult(null); setUrl('') }} className="btn-cta-outline mt-4 w-full">
          <RotateCcw className="h-4 w-4" /> Check another site
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={run} className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <label className="block text-sm font-semibold text-brand-ink">Your website address</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourhome.co.uk"
            className="w-full rounded-lg border border-brand-line py-3 pl-9 pr-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
          />
        </div>
        <button type="submit" disabled={loading || !url.trim()} className="btn-pop disabled:opacity-50">
          {loading ? 'Checking…' : 'Show me'}
          {!loading && <span className="btn-arrow" aria-hidden>→</span>}
        </button>
      </div>
      {error && <p className="mt-3 rounded-lg bg-brand-pop/10 px-3 py-2 text-sm text-brand-pop">{error}</p>}
      {loading && <p className="mt-4 text-center text-sm text-brand-ink-soft">Fetching your homepage and building your previews…</p>}
      {!loading && !error && <p className="mt-4 text-xs text-brand-ink-muted">See your live Google search result and social share preview, then write a better one. Free, no sign-up.</p>}
    </form>
  )
}
