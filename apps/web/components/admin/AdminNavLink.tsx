'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminNavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
  // 'dark' = the coloured desktop sidebar; 'light' (default) = the mobile drawer.
  variant?: 'light' | 'dark'
  // External TRG apps open in a new tab and show a small external-link marker.
  external?: boolean
}

export default function AdminNavLink({ href, icon, label, onClick, variant = 'light', external }: AdminNavLinkProps) {
  const pathname = usePathname()
  const isActive = !external && (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))

  const className = cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    variant === 'dark'
      ? isActive
        ? 'bg-white/10 text-white'
        : 'text-slate-300 hover:bg-white/5 hover:text-white'
      : isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {icon}
        <span className="flex-1">{label}</span>
        <ExternalLink className="h-3 w-3 opacity-50" />
      </a>
    )
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {icon}
      {label}
    </Link>
  )
}
