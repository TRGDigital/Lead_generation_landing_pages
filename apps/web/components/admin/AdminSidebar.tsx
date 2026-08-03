import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  Building2,
  LayoutTemplate,
  BarChart3,
  Megaphone,
  Settings,
  BookOpen,
  TrendingUp,
  Send,
  FileBarChart,
  ListChecks,
  Scale,
  Globe,
  Search,
  Inbox,
  Wrench,
} from 'lucide-react'
import AdminNavLink from './AdminNavLink'
import TrgLogo from './TrgLogo'

type NavItem = { href: string; icon: React.ReactNode; label: string }
type NavGroup = { title: string | null; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    title: null,
    items: [{ href: '/admin', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Overview' }],
  },
  {
    // The CareBeds lead-gen business: paid campaigns → landing pages → leads sold to buyers.
    title: 'Paid · CareBeds leads',
    items: [
      { href: '/admin/leads', icon: <Users className="h-4 w-4" />, label: 'Leads' },
      { href: '/admin/buyers', icon: <Send className="h-4 w-4" />, label: 'Buyers' },
      { href: '/admin/reports', icon: <FileBarChart className="h-4 w-4" />, label: 'Reports' },
      { href: '/admin/care-homes', icon: <Building2 className="h-4 w-4" />, label: 'Care Homes' },
      { href: '/admin/pages', icon: <LayoutTemplate className="h-4 w-4" />, label: 'Landing Pages' },
      { href: '/admin/funnel', icon: <BarChart3 className="h-4 w-4" />, label: 'Funnel' },
      { href: '/admin/quiz', icon: <ListChecks className="h-4 w-4" />, label: 'Care Finder' },
      { href: '/admin/campaigns', icon: <Megaphone className="h-4 w-4" />, label: 'Campaigns' },
      { href: '/admin/economics', icon: <TrendingUp className="h-4 w-4" />, label: 'Economics' },
    ],
  },
  {
    // Client websites we run: everything per-site lives under Websites; the rest is
    // cross-site (enquiries inbox, tool usage, TRG's own blog/SEO/legal pages).
    title: 'Organic · client websites',
    items: [
      { href: '/admin/websites', icon: <Globe className="h-4 w-4" />, label: 'Websites' },
      { href: '/admin/marketing-leads', icon: <Inbox className="h-4 w-4" />, label: 'Site enquiries' },
      { href: '/admin/client-leads', icon: <Users className="h-4 w-4" />, label: 'Client leads' },
      { href: '/admin/tools', icon: <Wrench className="h-4 w-4" />, label: 'Tool usage' },
      { href: '/admin/blog', icon: <BookOpen className="h-4 w-4" />, label: 'Blog' },
      { href: '/admin/seo', icon: <Search className="h-4 w-4" />, label: 'Page SEO' },
      { href: '/admin/legal', icon: <Scale className="h-4 w-4" />, label: 'Legal Pages' },
    ],
  },
  {
    title: null,
    items: [{ href: '/admin/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' }],
  },
]

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 border-r bg-background">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/admin">
          <TrgLogo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navGroups.map((group, i) => (
          <div key={i} className={group.title ? 'pt-3' : ''}>
            {group.title && (
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{group.title}</p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <AdminNavLink key={item.href} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export { navGroups }
