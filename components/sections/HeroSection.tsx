'use client'


import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90dvh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/WhatsApp Image 2026-03-17 at 3.16.49 PM.JPG"
          alt="DASA Students at UPSA"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-black/50 backdrop-blur-[1px]"></div>
      </div>

      <div className="container relative z-20 mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            Department of Accounting Students Association
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed font-medium mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            Access academic resources, discover departmental news, and accelerate your professional growth at the University of Professional Studies, Accra.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
            <Link 
              href="/academic-bank" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-DASA-orange text-white rounded-xl font-bold hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-DASA-orange/25"
            >
              Explore Academic Bank <ArrowRight size={18} />
            </Link>
            <Link 
              href="/activities" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 active:scale-[0.98] backdrop-blur-sm transition-all duration-150 shadow-lg"
            >
              View Latest Activities
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  )
}




