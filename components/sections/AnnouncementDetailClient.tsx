'use client'

import Link from 'next/link'
import { Calendar, ChevronLeft, Share2, Megaphone } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface AnnouncementDetailClientProps {
  announcement: any
}

export default function AnnouncementDetailClient({ announcement }: AnnouncementDetailClientProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* Detail Header & Action Bar */}
      <div className="border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center text-gray-500 hover:text-DASA-black transition-colors mb-6 group w-fit">
            <ChevronLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="grow">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-50 text-DASA-black text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-2">
                  <Megaphone size={12} className="text-DASA-orange" />
                  Announcement
                </span>
                {announcement.is_pinned && (
                  <span className="px-3 py-1 bg-DASA-orange text-DASA-black text-xs font-bold rounded-full uppercase tracking-wider">
                    Pinned
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-DASA-black leading-tight mb-4">
                {announcement.title}
              </h1>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar size={16} className="mr-2 text-DASA-orange" />
                <span>Published on {new Intl.DateTimeFormat('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                }).format(new Date(announcement.created_at))}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600" title="Share">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Main Image */}
          {announcement.image_url && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl bg-DASA-black/5"
            >
              {/* Blurred Background */}
              <div className="absolute inset-0">
                <Image 
                  src={announcement.image_url} 
                  alt=""
                  fill
                  className="object-cover blur-2xl scale-110 opacity-30"
                />
              </div>
              
              {/* Contain-fitted Foreground */}
              <Image 
                src={announcement.image_url} 
                alt={announcement.title}
                fill
                className="object-contain relative z-10"
                priority
              />
            </motion.div>
          )}

          {/* Content Area */}
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-50 shadow-sm">
            <div className="prose prose-lg prose-blue max-w-none text-gray-700 whitespace-pre-line leading-relaxed font-medium">
              {announcement.body}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-8 border-t border-gray-100 flex justify-center">
            <Link 
              href="/"
              className="px-8 py-4 bg-DASA-black text-white font-bold rounded-2xl hover:bg-DASA-orange transition-all shadow-lg"
            >
              Back to Latest News
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
