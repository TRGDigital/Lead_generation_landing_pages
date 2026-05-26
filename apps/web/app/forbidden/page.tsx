import Link from 'next/link'

export const metadata = { title: '403 Forbidden' }

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <p className="font-display text-6xl font-semibold text-brand-accent">403</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
        Access denied
      </h1>
      <p className="mt-2 text-muted-foreground">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
