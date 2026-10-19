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
    <header id="header" className="sticky top-0 z-50 bg-DASA-black/95 backdrop-blur-xl border-b border-gray-900">
      <nav className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image 
            src="/dasa-logo.jpg" 
            alt="DASA Logo" 
            width={48} 
            height={48} 
            className="rounded-lg object-contain"
            priority 
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-white tracking-tight leading-none">DASA</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-1">UPSA Chapter</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-10 items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                prefetch={false}
                className="text-sm font-semibold text-gray-300 hover:text-DASA-orange transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-DASA-orange transition-all group-hover:w-full rounded-full"></span>
              </Link>
            </li>
          ))}
          <li>
            <InstallPWA />
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white focus:outline-none p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-DASA-black border-b border-gray-900 overflow-hidden"
          >
            <ul className="flex flex-col space-y-2 px-6 py-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-lg font-bold text-gray-200 hover:text-DASA-orange transition-colors block py-3 border-b border-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="pt-6">
                <InstallPWA />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}




