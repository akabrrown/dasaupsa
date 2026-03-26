'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
       setShowInstall(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
    setShowInstall(false)
  }

  return (
    <AnimatePresence>
      {showInstall && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 20 }}
           className="fixed bottom-6 right-6 z-50 md:bottom-auto md:right-auto md:relative md:flex md:items-center"
        >
          {/* Mobile Overlay / Floating Button */}
          <div className="md:hidden flex items-center gap-2 bg-DASA-orange text-white px-6 py-4 rounded-[32px] shadow-2xl border-4 border-white">
            <button onClick={handleInstall} className="flex items-center gap-3 font-black text-sm uppercase tracking-wider">
              <Download size={20} className="animate-bounce" />
              Download App
            </button>
            <button onClick={() => setShowInstall(false)} className="ml-2 p-1 bg-black/10 rounded-full">
              <X size={16} />
            </button>
          </div>

          {/* Desktop Navbar Integration Style - Hidden on mobile, shown in navbar elsewhere or here */}
          <button 
            onClick={handleInstall}
            className="hidden md:flex items-center gap-2 bg-DASA-orange hover:bg-white hover:text-DASA-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5"
          >
            <Download size={18} />
            Install App
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
