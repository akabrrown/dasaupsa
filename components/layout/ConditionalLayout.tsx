'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith('/admin')

  if (isAdminPath) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  )
}
