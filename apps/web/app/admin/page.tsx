import { requireAdmin } from '@/lib/auth'

export const metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const user = await requireAdmin()

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Phase 3 will build out the full admin dashboard — clients, leads, campaign control,
            and unit economics.
          </p>
        </div>
      </div>
    </main>
  )
}
