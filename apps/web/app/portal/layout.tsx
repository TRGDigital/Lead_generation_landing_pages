import { getPortalContext } from '@/lib/portal'
import PortalNav from '@/components/portal/PortalNav'
import CareHomeSelector from '@/components/portal/CareHomeSelector'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { homes, selectedHome } = await getPortalContext()

  if (!selectedHome) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center space-y-2">
          <p className="font-medium">No care homes assigned</p>
          <p className="text-sm text-muted-foreground">
            Contact your account manager to get set up.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <PortalNav />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-14 items-center border-b px-4 gap-3">
          <CareHomeSelector homes={homes} selectedHome={selectedHome} />
          <div className="ml-auto flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                selectedHome.is_active ? 'bg-green-500' : 'bg-muted-foreground'
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {selectedHome.is_active ? 'Live' : 'Paused'}
            </span>
          </div>
        </header>
        {/* Page content — add bottom padding for mobile nav */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
      </div>
    </div>
  )
}
