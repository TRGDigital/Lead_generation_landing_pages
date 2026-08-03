'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Opens a family tool live in a lightbox (the real /embed/tools/<key> widget) so a prospect on
// /care-tools can actually try it. One provider renders a single modal; any ToolPreviewButton opens it.

type Preview = { key: string; label: string; site?: string }
const Ctx = createContext<(p: Preview) => void>(() => {})
export const useToolPreview = () => useContext(Ctx)

export function ToolPreviewProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<Preview | null>(null)
  const close = useCallback(() => setOpen(null), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  const src = open ? `/embed/tools/${open.key}${open.site ? `?site=${open.site}` : ''}` : ''

  return (
    <Ctx.Provider value={setOpen}>
      {children}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/60 p-3 sm:p-6"
          onClick={close}
        >
          <div
            className="relative flex h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-line px-4 py-3">
              <p className="font-display text-sm font-bold text-brand-ink">
                {open.label} <span className="font-normal text-brand-ink-muted">— live demo</span>
              </p>
              <button
                onClick={close}
                aria-label="Close preview"
                className="-mr-1 rounded-full px-2 text-2xl leading-none text-brand-ink-muted hover:text-brand-ink"
              >
                &times;
              </button>
            </div>
            <iframe src={src} title={`${open.label} live demo`} className="h-full w-full flex-1 border-0" />
          </div>
        </div>
      ) : null}
    </Ctx.Provider>
  )
}

export function ToolPreviewButton({
  preview,
  className = '',
  children,
}: {
  preview: Preview
  className?: string
  children: React.ReactNode
}) {
  const open = useToolPreview()
  return (
    <button type="button" onClick={() => open(preview)} className={className}>
      {children}
    </button>
  )
}
