'use client'

import { useState, useTransition } from 'react'
import { Plug, CheckCircle2, XCircle } from 'lucide-react'
import type { Website } from '@/lib/websites'
import { saveWordPress, testWordPress } from '@/app/admin/websites/actions'

// Connect a client's own WordPress site (core Application Passwords — nothing to install)
// so the platform can publish area pages / content / SEO straight onto their domain.

export default function WordPressPanel({ site }: { site: Website }) {
  const [apiUrl, setApiUrl] = useState(site.wp_api_url)
  const [username, setUsername] = useState(site.wp_username)
  const [password, setPassword] = useState(site.wp_app_password)
  const [facts, setFacts] = useState(site.site_facts)
  const [saved, setSaved] = useState(false)
  const [test, setTest] = useState<{ ok: boolean; detail: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function save(thenTest = false) {
    const fd = new FormData()
    fd.set('wp_api_url', apiUrl)
    fd.set('wp_username', username)
    fd.set('wp_app_password', password)
    fd.set('site_facts', facts)
    startTransition(async () => {
      await saveWordPress(site.id, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (thenTest) setTest(await testWordPress(site.id))
    })
  }

  const input = 'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30'
  const lbl = 'mb-1 block text-sm font-medium text-brand-ink'

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-ink-muted">
        For customers whose site we didn&rsquo;t build: connect their WordPress and the platform can publish
        area pages, content and SEO meta straight onto <em>their</em> domain. They create an application
        password in wp-admin (Users → Profile → Application Passwords) — nothing needs installing, and their
        own theme styles every page we publish so it matches the rest of their site.
      </p>

      <label><span className={lbl}>WordPress site URL</span>
        <input className={input} value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="https://theircarehome.co.uk" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className={lbl}>WordPress username</span>
          <input className={input} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
        </label>
        <label><span className={lbl}>Application password</span>
          <input type="password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="xxxx xxxx xxxx xxxx xxxx xxxx" />
        </label>
      </div>

      <label><span className={lbl}>Facts about this client (grounds all AI content)</span>
        <textarea
          rows={4}
          className={input}
          value={facts}
          onChange={(e) => setFacts(e.target.value)}
          placeholder="e.g. Sunnybank House is a family-run residential care home in Horsham, West Sussex, with 32 beds for over-65s, rated Good by the CQC, offering residential, dementia and respite care. Phone 01403 000000."
        />
        <span className="mt-1 block text-xs text-brand-ink-muted">
          The AI only writes from what is here — the fuller and more accurate this is, the better (and safer) the
          content. Include location, care types, beds, CQC rating and phone number as a minimum.
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => save(false)} disabled={isPending} className="rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
          {saved ? 'Saved ✓' : isPending ? 'Working…' : 'Save'}
        </button>
        <button onClick={() => save(true)} disabled={isPending} className="inline-flex items-center gap-1.5 rounded-xl border border-brand-line px-5 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-accent disabled:opacity-60">
          <Plug className="h-4 w-4" /> Save &amp; test connection
        </button>
      </div>

      {test && (
        <p className={`flex items-start gap-1.5 text-sm ${test.ok ? 'text-green-700' : 'text-red-600'}`}>
          {test.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          {test.detail}
        </p>
      )}
    </div>
  )
}
