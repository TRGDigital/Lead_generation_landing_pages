import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Megaphone,
  Settings,
  BookOpen,
  TrendingUp,
  Send,
  FileBarChart,
} from 'lucide-react'
import AdminNavLink from './AdminNavLink'

const navItems = [
  { href: '/admin', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Overview' },
  { href: '/admin/leads', icon: <Users className="h-4 w-4" />, label: 'Leads' },
  { href: '/admin/buyers', icon: <Send className="h-4 w-4" />, label: 'Buyers' },
  { href: '/admin/reports', icon: <FileBarChart className="h-4 w-4" />, label: 'Reports' },
  { href: '/admin/care-homes', icon: <Building2 className="h-4 w-4" />, label: 'Care Homes' },
  { href: '/admin/funnel', icon: <BarChart3 className="h-4 w-4" />, label: 'Funnel' },
  { href: '/admin/campaigns', icon: <Megaphone className="h-4 w-4" />, label: 'Campaigns' },
  { href: '/admin/economics', icon: <TrendingUp className="h-4 w-4" />, label: 'Economics' },
  { href: '/admin/blog', icon: <BookOpen className="h-4 w-4" />, label: 'Blog' },
  { href: '/admin/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' },
]

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 border-r bg-background">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/admin" className="font-semibold text-foreground">
          Lead Gen Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <AdminNavLink key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  )
}

export { navItems }
