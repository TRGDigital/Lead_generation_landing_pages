import { requireAdmin } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import MobileNav from '@/components/admin/MobileNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
