'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Inbox, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COPY } from '@/lib/copy/portal'

const NAV_ITEMS = [
  { href: '/portal', label: COPY.dashboardTitle, icon: LayoutDashboard, exact: true },
  { href: '/portal/enquiries', label: COPY.Enquiries, icon: Inbox, exact: false },
  { href: '/portal/account', label: COPY.accountTitle, icon: User, exact: false },
]

export default function PortalNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0 border-r bg-background">
        <div className="flex h-14 items-center border-b px-5">
          <span className="font-semibold text-foreground text-sm">Portal</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 flex border-t bg-background lg:hidden safe-bottom">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
