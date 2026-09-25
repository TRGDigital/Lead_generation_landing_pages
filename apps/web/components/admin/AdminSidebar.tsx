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
  Mail,
  Volume2,
  CalendarCheck,
} from 'lucide-react'
import { ChevronDown, FileSignature, Target, Linkedin, Tags, Wallet, Trophy, ListTodo, ClipboardCheck, Gift, Gavel, GraduationCap, Smartphone, Apple, Stethoscope, ScanSearch } from 'lucide-react'
import AdminNavLink from './AdminNavLink'
import TrgLogo from './TrgLogo'

type NavItem = { href: string; icon: React.ReactNode; label: string; external?: boolean }
// `accent` colours the little dot next to a group title so the two sides of the
// business are recognisable at a glance in the sidebar.
type NavGroup = { title: string | null; accent?: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    title: null,
    items: [
      { href: '/admin/today', icon: <CalendarCheck className="h-4 w-4" />, label: 'Today' },
      { href: '/admin', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Overview' },
      { href: '/admin/proposals', icon: <FileSignature className="h-4 w-4" />, label: 'Proposals' },
    ],
  },
  {
    // The CareBeds lead-gen business: paid campaigns → landing pages → leads sold to buyers.
    title: 'Paid · CareBeds leads',
    accent: 'bg-amber-400',
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
    accent: 'bg-emerald-400',
    items: [
      { href: '/admin/websites', icon: <Globe className="h-4 w-4" />, label: 'Websites' },
      { href: '/admin/go-pages', icon: <Megaphone className="h-4 w-4" />, label: 'TRG Ad Pages' },
      { href: '/admin/marketing-leads', icon: <Inbox className="h-4 w-4" />, label: 'Site enquiries' },
      { href: '/admin/client-leads', icon: <Users className="h-4 w-4" />, label: 'Client leads' },
      { href: '/admin/tools', icon: <Wrench className="h-4 w-4" />, label: 'Tool usage' },
      { href: '/admin/site-audit', icon: <ScanSearch className="h-4 w-4" />, label: 'Simple Site Audit' },
      { href: '/admin/site-audit/detailed', icon: <Stethoscope className="h-4 w-4" />, label: 'Detailed Site Audit' },
      { href: '/admin/email-nurture', icon: <Mail className="h-4 w-4" />, label: 'Email nurture' },
      { href: '/admin/blog', icon: <BookOpen className="h-4 w-4" />, label: 'Blog' },
      { href: '/admin/seo', icon: <Search className="h-4 w-4" />, label: 'Page SEO' },
      { href: '/admin/accessibility', icon: <Volume2 className="h-4 w-4" />, label: 'Listen to page' },
      { href: '/admin/legal', icon: <Scale className="h-4 w-4" />, label: 'Legal Pages' },
    ],
  },
  {
    // Standalone TRG apps — this admin is the hub for everything TRG, so the other
    // internal tools are one click away (they open in a new tab, own logins).
    title: 'TRG apps',
    accent: 'bg-cyan-400',
    items: [
      { href: 'https://trg-lead-engine.vercel.app/', icon: <Target className="h-4 w-4" />, label: 'Lead Engine', external: true },
      { href: 'https://trg-linkedin-content.vercel.app/', icon: <Linkedin className="h-4 w-4" />, label: 'LinkedIn Content', external: true },
      { href: 'https://meta-generator-trgdigitals-projects.vercel.app/', icon: <Tags className="h-4 w-4" />, label: 'Meta Generator', external: true },
      { href: 'https://taskboard-five-roan.vercel.app/', icon: <ListTodo className="h-4 w-4" />, label: 'Taskboard', external: true },
      { href: 'https://cpd-keyword-tool.vercel.app/leaderboard', icon: <Trophy className="h-4 w-4" />, label: 'CPD Leaderboard', external: true },
      { href: 'https://claude.ai/artifact/PuiyXdoUVyKkHafaS94Z5x', icon: <ClipboardCheck className="h-4 w-4" />, label: 'CPD Submission Playbook', external: true },
      { href: 'https://claude.ai/artifact/SA1ahyZ3RzFjyavPM3q2Jg', icon: <Gift className="h-4 w-4" />, label: 'CareStream Free Plan', external: true },
      { href: 'https://claude.ai/artifact/CT1HdZxLUxibxF9wVSaySD', icon: <Gavel className="h-4 w-4" />, label: 'CareStream Gap Judges', external: true },
      { href: 'https://claude.ai/artifact/592aZVpmSugH1JvYDSHNEz', icon: <GraduationCap className="h-4 w-4" />, label: 'CareStream Adhoc Training', external: true },
      { href: 'https://claude.ai/artifact/6KsHz3ocYQ1UnjiLvHtxwd', icon: <Smartphone className="h-4 w-4" />, label: 'App: Google Play', external: true },
      { href: 'https://claude.ai/artifact/BYvWBqnV6SoCCuGn3y3WDW', icon: <Smartphone className="h-4 w-4" />, label: 'App: Samsung Store', external: true },
      { href: 'https://claude.ai/artifact/QJf9TrJ4oBCewGd6tNmqkF', icon: <Apple className="h-4 w-4" />, label: 'App: Apple App Store', external: true },
      { href: 'https://budget-planner-lilac-two.vercel.app/', icon: <Wallet className="h-4 w-4" />, label: 'Budget Planner', external: true },
    ],
  },
  {
    title: null,
    items: [{ href: '/admin/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings' }],
  },
]

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 border-r border-slate-800 bg-slate-900">
      <div className="flex h-14 items-center border-b border-slate-800 px-6">
        <Link href="/admin">
          <TrgLogo dark />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navGroups.map((group, i) =>
          group.title ? (
            // Collapsible group (native <details>, works without JS). Closed by default so the
            // sidebar opens compact; click a group title to expand it.
            <details key={i} className="group/side pt-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-1.5 hover:bg-white/5">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {group.accent && <span className={`h-2 w-2 rounded-full ${group.accent}`} />}
                  {group.title}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition-transform group-open/side:rotate-180" />
              </summary>
              <div className="mt-1 space-y-1">
                {group.items.map((item) => (
                  <AdminNavLink key={item.href} {...item} variant="dark" />
                ))}
              </div>
            </details>
          ) : (
            <div key={i} className="space-y-1">
              {group.items.map((item) => (
                <AdminNavLink key={item.href} {...item} variant="dark" />
              ))}
            </div>
          ),
        )}
      </nav>
    </aside>
  )
}

export { navGroups }
