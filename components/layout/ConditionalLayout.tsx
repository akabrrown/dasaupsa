'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useEffect } from 'react'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith('/admin')

  useEffect(() => {
    if ('serviceWorker' in navigator && !isAdminPath) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('SW registered: ', registration);
          },
          (err) => {
            console.log('SW registration failed: ', err);
          }
        );
      });
    }
  }, [isAdminPath])

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
