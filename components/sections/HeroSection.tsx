'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative min-h-[45vh] md:min-h-[55vh] flex items-center justify-center overflow-hidden py-12 px-4 mt-16 lg:mt-0">
      {/* Background Image - Now Clear and Bright */}
      <div className="absolute inset-0 z-0 text-white">
        <Image 
          src="/WhatsApp Image 2026-03-17 at 3.16.49 PM.JPG"
          alt="DASA Hero Background"
          fill
          priority
          className="object-cover"
        />
        {/* Very subtle gradient overlay just to ensure text contrast if image is extremely light */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="container mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-DASA-orange text-DASA-black text-sm font-black tracking-widest uppercase mb-6 shadow-2xl"
          >
            <Sparkles size={16} className="text-white animate-pulse" />
            Empowering Accounting Excellence
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-none tracking-tighter uppercase 
            bg-clip-text text-transparent bg-linear-to-b from-white to-white/60
            drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mix-blend-overlay"
          >
            Welcome to <span className="text-DASA-orange brightness-150">DASA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mix-blend-overlay">
            The central hub for academic excellence, professional growth, and departmental innovation at the University of Professional Studies, Accra.
          </p>
        </motion.div>
      </div>
    </section>
  )
}




