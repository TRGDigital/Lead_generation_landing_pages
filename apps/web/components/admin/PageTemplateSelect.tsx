'use client'

import { useState, useTransition } from 'react'
import { setPageQuestionSet } from '@/app/admin/pages/actions'

export function PageTemplateSelect({ slug, current }: { slug: string; current: string }) {
  const [value, setValue] = useState(current === 'nursing' ? 'nursing' : 'residential')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState(false)

  function onChange(next: string) {
    const prev = value
    setValue(next)
    setError(false)
    startTransition(async () => {
      try {
        await setPageQuestionSet(slug, next)
      } catch {
        setValue(prev) // revert on failure
        setError(true)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={pending}
        className="rounded-md border bg-background px-2 py-1 text-sm disabled:opacity-50"
        aria-label={`Care finder template for ${slug}`}
      >
        <option value="residential">Residential care</option>
        <option value="nursing">Nursing care</option>
      </select>
      {pending && <span className="text-xs text-muted-foreground">saving…</span>}
      {error && <span className="text-xs text-red-600">failed</span>}
    </div>
  )
}
