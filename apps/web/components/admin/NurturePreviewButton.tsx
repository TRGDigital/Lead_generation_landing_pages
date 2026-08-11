'use client'

import { useState } from 'react'

// Sends the whole nurture sequence as previews to the given address and reports back.
export default function NurturePreviewButton({ defaultTo = 'lenny@trgdigital.co.uk' }: { defaultTo?: string }) {
  const [to, setTo] = useState(defaultTo)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function send() {
    setStatus('sending')
    setMsg('')
    try {
      const res = await fetch('/api/admin/nurture/send-previews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      setStatus('done')
      setMsg(`Sent ${data.sent}/${data.total} preview emails to ${data.to}.`)
    } catch (e) {
      setStatus('error')
      setMsg(e instanceof Error ? e.message : 'Failed to send')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="email"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="h-9 w-64 rounded-md border border-slate-300 px-3 text-sm text-slate-900"
        placeholder="you@example.com"
      />
      <button
        onClick={send}
        disabled={status === 'sending'}
        className="inline-flex h-9 items-center rounded-md bg-[#F0532B] px-4 text-sm font-semibold text-white hover:bg-[#d8471f] disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending…' : 'Send all previews'}
      </button>
      {msg && (
        <span className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>{msg}</span>
      )}
    </div>
  )
}
