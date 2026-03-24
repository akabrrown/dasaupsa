'use client'

import { useState } from 'react'
import ActivityCard from '@/components/sections/ActivityCard'
import { Sparkles, History, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ActivitiesPageClientProps {
  initialActivities: any[]
}

export default function ActivitiesPageClient({ initialActivities }: ActivitiesPageClientProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')

  const filteredActivities = initialActivities.filter((a: any) => 
    filter === 'all' || a.status === filter
  )

  const stats = [
    { label: 'Upcoming', count: initialActivities.filter(a => a.status === 'upcoming').length, icon: Sparkles, color: 'text-green-500' },
    { label: 'Past Events', count: initialActivities.filter(a => a.status === 'completed').length, icon: History, color: 'text-gray-500' }
  ]

  return (
    <div className="bg-light-orange min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-linear-to-br from-DASA-orange to-[#FF8C61] py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 skew-x-12 translate-x-20"></div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-DASA-black">Our Activities</h1>
          <p className="text-DASA-black/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Stay updated with all the exciting events and activities happening 
            within the DASA community.
          </p>
          
          <div className="grid grid-cols-2 lg:flex justify-center gap-4 md:gap-8 mt-10">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                <stat.icon size={20} className={`${stat.color} mb-2`} />
                <span className="text-xl md:text-2xl font-black text-white">{stat.count}</span>
                <span className="text-[10px] text-white/60 uppercase tracking-widest font-black text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8">
        {/* Filter Bar */}
        <div className="bg-white p-1.5 rounded-2xl shadow-xl flex justify-center mb-16 max-w-sm mx-auto relative z-20 overflow-x-auto no-scrollbar">
          {(['all', 'upcoming', 'completed'] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all capitalize grow whitespace-nowrap ${
                filter === tag 
                  ? 'bg-DASA-black text-white shadow-md' 
                  : 'text-gray-500 hover:text-DASA-black'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Timeline / Listing */}
        <div className="max-w-4xl mx-auto space-y-12">
          {filteredActivities.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredActivities.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Line */}
                  {index !== filteredActivities.length - 1 && (
                    <div className="absolute left-[24px] md:left-1/3 top-full h-12 w-0.5 bg-gray-200 z-0"></div>
                  )}
                  
                  {/* Timeline Dot */}
                  <div className={`absolute left-[16px] md:left-[calc(33.333%-1px)] top-12 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-150 ${
                    activity.status === 'upcoming' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>

                  <ActivityCard 
                    {...activity} 
                    event_date={activity.completed_at || activity.event_date} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 italic text-gray-400">
              No activities listed yet. Stay tuned!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




