'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AdminNavLink from './AdminNavLink'
import { navItems } from './AdminSidebar'
import TrgLogo from './TrgLogo'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-14 items-center border-b px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle asChild>
              <Link href="/admin" onClick={() => setOpen(false)}>
                <TrgLogo />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => (
              <AdminNavLink key={item.href} {...item} onClick={() => setOpen(false)} />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <TrgLogo className="ml-3" />
    </div>
  )
}
