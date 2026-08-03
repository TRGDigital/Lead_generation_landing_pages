'use client'

import { useEffect, useRef } from 'react'

// Wrap a tool's interactive component to log anonymous usage: a 'view' when it loads and an
// 'engaged' on the first interaction inside it. Best-effort, no PII. Layout-neutral (a plain
// wrapper that fills its grid/flex slot).

function getSessionId(): string {
  try {
    const key = 'trg_tool_sid'
    let v = localStorage.getItem(key)
    if (!v) {
      v = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem(key, v)
    }
    return v
  } catch {
    return ''
  }
}

function send(tool: string, event: 'view' | 'engaged' | 'cta', site?: string) {
  try {
    const body = JSON.stringify({ tool, event, sessionId: getSessionId(), path: location.pathname, site })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/tool-events', new Blob([body], { type: 'application/json' }))
    } else {
      fetch('/api/tool-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    /* best-effort */
  }
}

export default function ToolTracker({ tool, site, children }: { tool: string; site?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    send(tool, 'view', site)
    const el = ref.current
    if (!el) return
    let engaged = false
    const onEngage = () => {
      if (engaged) return
      engaged = true
      send(tool, 'engaged', site)
      el.removeEventListener('input', onEngage)
      el.removeEventListener('pointerdown', onEngage)
    }
    el.addEventListener('input', onEngage, { passive: true })
    el.addEventListener('pointerdown', onEngage, { passive: true })
    return () => {
      el.removeEventListener('input', onEngage)
      el.removeEventListener('pointerdown', onEngage)
    }
  }, [tool, site])

  return (
    <div ref={ref} className="min-w-0">
      {children}
    </div>
  )
}
