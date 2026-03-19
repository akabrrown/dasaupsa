'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ChevronLeft, Share2, Bookmark, Image as ImageIcon, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ActivityDetailClientProps {
  activity: any
}

export default function ActivityDetailClient({ activity }: ActivityDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)

  const displayDate = (activity.status === 'completed' && activity.completed_at) 
    ? activity.completed_at 
    : activity.event_date
  const dateObj = new Date(displayDate)
  const images = activity.images || []

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header & Back Link */}
      <div className="border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <Link href="/activities" className="flex items-center text-gray-500 hover:text-DASA-black transition-colors mb-6 group w-fit">
            <ChevronLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" />
            Back to All Activities
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  activity.status === 'upcoming' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {activity.status}
                </span>
                <div className="flex items-center text-gray-400 text-xs font-medium">
                  <Calendar size={14} className="mr-1.5" />
                  {dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-DASA-black leading-tight mb-2">
                {activity.title}
              </h1>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin size={16} className="mr-2 text-DASA-orange" />
                <span>{activity.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
                <Bookmark size={20} />
              </button>
              <button className="flex items-center justify-center p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery Section */}
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-video bg-gray-100 rounded-[32px] overflow-hidden shadow-xl"
              >
                {images.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={images[activeImage]}
                        alt={`${activity.title} - Image ${activeImage + 1}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon size={64} className="mb-4 opacity-20" />
                    <p className="font-medium">No images available for this activity</p>
                  </div>
                )}
              </motion.div>

              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 transition-all relative ${
                        activeImage === idx ? 'ring-4 ring-DASA-orange scale-105 shadow-lg' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                      }`}
                    >
                      <Image src={img} alt="thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-DASA-black mb-6 flex items-center gap-3">
                <Sparkles className="text-DASA-orange" />
                Event Description
              </h2>
              <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line text-lg leading-relaxed">
                {activity.description}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-8">
            {/* Event Info Card */}
            <div className="bg-DASA-orange rounded-[32px] p-8 text-DASA-black shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all"></div>
              
              <h3 className="text-xl font-bold mb-8 border-b border-DASA-black/10 pb-4">Event Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl text-DASA-black">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-DASA-black/60 font-bold mb-1">Date</p>
                    <p className="font-bold">{dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl text-DASA-black">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-DASA-black/60 font-bold mb-1">Time</p>
                    <p className="font-bold">{dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl text-DASA-black">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-DASA-black/60 font-bold mb-1">Location</p>
                    <p className="font-bold">{activity.location}</p>
                  </div>
                </div>
              </div>

              {activity.status === 'upcoming' && (
                <button className="w-full mt-10 py-4 bg-DASA-black text-white rounded-2xl font-extrabold shadow-lg shadow-DASA-black/20 hover:scale-[1.02] transition-all">
                  RSVP For Event
                </button>
              )}
            </div>

            {/* Quick Contact / Support */}
            <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-DASA-black mb-4">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-6">If you have questions about this event, feel free to contact the DASA organizing committee.</p>
              <Link 
                href="mailto:contact@DASA.edu.gh"
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 font-bold rounded-xl hover:border-DASA-black hover:text-DASA-black transition-all bg-white"
              >
                Contact Organizers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




