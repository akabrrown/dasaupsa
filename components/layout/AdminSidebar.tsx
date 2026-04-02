'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Megaphone, 
  Video, 
  BookOpen, 
  Calendar, 
  Users, 
  UserPlus, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react'

export default function AdminSidebar({ mustChangePassword = false }: { mustChangePassword?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/admin/login')
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Tutorials', href: '/admin/tutorials', icon: Video },
    { name: 'Academic Bank', href: '/admin/academic-bank', icon: BookOpen },
    { name: 'Activities', href: '/admin/activities', icon: Calendar },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Academic Programs', href: '/admin/programs', icon: BookOpen },
    { name: 'About', href: '/admin/about', icon: Users },
    { name: 'Manage Admins', href: '/admin/admins', icon: UserPlus },
  ]

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Security Guard: Force redirect to change-password if required
  useEffect(() => {
    if (mustChangePassword && pathname !== '/admin/change-password') {
      router.push('/admin/change-password')
    }
  }, [mustChangePassword, pathname, router])

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-DASA-black flex items-center justify-between px-4 z-50 border-b border-blue-900/50">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/dasa-logo.jpg" 
            alt="Logo" 
            width={32} 
            height={32} 
            className="rounded-full object-cover h-8 w-8" 
          />
          <span className="font-bold text-white text-sm">DASA Admin</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-DASA-black text-white p-6 z-50 
        transform transition-transform duration-300 ease-in-out h-full flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="hidden lg:flex items-center gap-3 mb-10 pb-6 border-b border-blue-900/50">
          <Image 
            src="/dasa-logo.jpg" 
            alt="DASA Logo" 
            width={48} 
            height={48} 
            className="rounded-full object-cover shadow-xl ring-2 ring-DASA-orange/20 h-12 w-12" 
          />
          <div>
            <h2 className="text-lg font-black text-white leading-tight">Admin Panel</h2>
            <p className="text-[10px] text-DASA-orange font-bold uppercase tracking-widest mt-0.5">DASA Management</p>
          </div>
        </div>

        <nav className="space-y-1.5 grow overflow-y-auto custom-scrollbar pr-2">
          {!mustChangePassword ? navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`
                  flex items-center justify-between group p-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-DASA-orange text-DASA-black font-bold shadow-lg scale-[1.02]' 
                    : 'text-blue-100 hover:bg-white/5 hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <link.icon size={20} className={isActive ? 'text-DASA-black' : 'text-DASA-orange'} />
                  <span className="text-sm tracking-tight">{link.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-DASA-black/50" />}
              </Link>
            )
          }) : (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
              <p className="text-xs text-orange-200 font-medium leading-relaxed">
                Navigation is disabled until you update your temporary password for security reasons.
              </p>
            </div>
          )}
        </nav>

        <div className="mt-8 pt-6 border-t border-blue-900/50 space-y-4">
          {!mustChangePassword && (
            <Link href="/" className="flex items-center gap-3 p-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/5 transition-all text-sm">
              <BookOpen size={18} />
              View Live Site
            </Link>
          )}
          <Button 
            onClick={handleLogout} 
            className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 py-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  )
}




