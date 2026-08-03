'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AdminNavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
  // 'dark' = the coloured desktop sidebar; 'light' (default) = the mobile drawer.
  variant?: 'light' | 'dark'
}

export default function AdminNavLink({ href, icon, label, onClick, variant = 'light' }: AdminNavLinkProps) {
  const pathname = usePathname()
  const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        variant === 'dark'
          ? isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
          : isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {icon}
      {label}
    </Link>
  )
}
