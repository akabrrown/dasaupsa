'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/lib/constants'
import InstallPWA from '@/components/ui/InstallPWA'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header id="header" className="sticky top-0 z-50">
      <nav className="bg-DASA-black text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center text-2xl font-bold tracking-tight hover:text-DASA-orange transition-colors">
            <Image 
              src="/dasa-logo.jpg" 
              alt="DASA Logo" 
              width={64} 
              height={64} 
              className="rounded-lg object-cover shadow-sm" 
              style={{ height: 'auto', width: 'auto' }}
              priority 
            />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="font-medium hover:text-DASA-orange transition-colors relative group"
                >
                  {navLinks[navLinks.indexOf(link)].name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-DASA-orange transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
            <li>
              <InstallPWA />
            </li>
          </ul>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-DASA-black border-t border-blue-900 overflow-hidden"
            >
              <ul className="flex flex-col space-y-4 px-6 py-8">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="text-lg font-medium hover:text-DASA-orange transition-colors inline-block w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-white/10">
                  <InstallPWA />
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}




