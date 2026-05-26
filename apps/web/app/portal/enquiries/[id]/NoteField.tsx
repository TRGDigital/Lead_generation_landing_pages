'use client'

import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { COPY } from '@/lib/copy/portal'
import { saveNote } from '@/app/portal/enquiries/actions'

type Props = { leadId: string; initialNote: string | null }

export default function NoteField({ leadId, initialNote }: Props) {
  const [value, setValue] = useState(initialNote ?? '')
  const [saved, setSaved] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(text: string) {
    setValue(text)
    setSaved(false)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      await saveNote(leadId, text)
      setSaved(true)
    }, 1500)
  }

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{COPY.notesLabel}</label>
        {saved && <span className="text-xs text-muted-foreground">Saved</span>}
      </div>
      <Textarea
        placeholder={COPY.notesPlaceholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        rows={4}
      />
    </div>
  )
}
