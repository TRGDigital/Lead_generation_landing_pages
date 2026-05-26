import { requireClient } from '@/lib/auth'

export const metadata = { title: 'Client Portal' }

export default async function PortalPage() {
  const user = await requireClient()

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-semibold text-foreground">Client Portal</h1>
        <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Phase 4 will build out the client portal — leads, qualification feedback, and the
            on/off switch.
          </p>
        </div>
      </div>
    </main>
  )
}
