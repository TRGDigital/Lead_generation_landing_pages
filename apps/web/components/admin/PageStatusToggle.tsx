'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { setPageStatus } from '@/app/admin/pages/actions'

export function PageStatusToggle({ slug, status }: { slug: string; status: string }) {
  const [pending, startTransition] = useTransition()
  const published = status === 'published'

  function toggle() {
    startTransition(async () => {
      try {
        await setPageStatus(slug, published ? 'draft' : 'published')
      } catch {
        /* surfaced via revalidate; no-op */
      }
    })
  }

  return (
    <Button size="sm" variant={published ? 'secondary' : 'default'} onClick={toggle} disabled={pending}>
      {pending ? '…' : published ? 'Unpublish' : 'Publish'}
    </Button>
  )
}
