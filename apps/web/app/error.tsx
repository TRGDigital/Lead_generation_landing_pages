'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <p className="font-display text-6xl font-semibold text-destructive">Error</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 text-muted-foreground">
        {error.message ?? 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
