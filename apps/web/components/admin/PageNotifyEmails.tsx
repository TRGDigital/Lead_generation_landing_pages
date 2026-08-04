'use client'

import { useState, useTransition } from 'react'
import { Mail } from 'lucide-react'
import { setPageNotifyEmails } from '@/app/admin/pages/actions'

// Who gets this landing page's leads. Comma-separate for multiple addresses;
// blank falls back to the site-wide default inbox.
export default function PageNotifyEmails({ slug, initial }: { slug: string; initial: string[] }) {
  const [value, setValue] = useState(initial.join(', '))
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  const dirty = value.trim() !== initial.join(', ').trim()

  function save() {
    setError('')
    startTransition(async () => {
      try {
        const res = await setPageNotifyEmails(slug, value)
        setValue(res.emails.join(', '))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch (e: any) {
        setError(e?.message ?? 'Could not save')
      }
    })
  }

  return (
    <div className="mt-3 w-full">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Mail className="h-3.5 w-3.5" /> Send leads to
      </label>
      <div className="mt-1 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. lenny@trgdigital.co.uk, manager@carehome.co.uk — blank uses the default inbox"
          className="w-full flex-1 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        />
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        {saved && <span className="text-xs font-medium text-emerald-600">Saved</span>}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}
