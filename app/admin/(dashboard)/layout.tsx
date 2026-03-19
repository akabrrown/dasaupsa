export const dynamic = 'force-dynamic'

import AdminSidebar from '@/components/layout/AdminSidebar'
import { getAdminUser } from '@/lib/actions/admin'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminUser()
  const mustChange = admin?.must_change_password === true

  // Force redirect if they must change password and aren't on the change-password page
  // We check the URL in the server component via a slightly different approach if needed, 
  // but let's assume this layout wraps the change-password page too.
  // Actually, we need to know the current path.
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <AdminSidebar mustChangePassword={mustChange} />
      <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}




