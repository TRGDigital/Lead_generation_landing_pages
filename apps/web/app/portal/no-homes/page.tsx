export const metadata = { title: 'No Care Homes' }

export default function NoHomesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center space-y-2 max-w-sm">
        <p className="font-semibold text-lg">No care homes assigned</p>
        <p className="text-sm text-muted-foreground">
          Contact your account manager to get set up. Once assigned, refresh this page.
        </p>
      </div>
    </div>
  )
}
