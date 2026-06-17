import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { NewPageForm } from '@/components/admin/NewPageForm'

export const dynamic = 'force-dynamic'

export default async function NewLandingPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:underline">← Landing Pages</Link>
        <h1 className="mt-1 text-2xl font-semibold">New landing page</h1>
        <p className="text-sm text-muted-foreground">
          Generate a complete, editable landing page for a new area in seconds.
        </p>
      </div>
      <NewPageForm />
    </div>
  )
}
