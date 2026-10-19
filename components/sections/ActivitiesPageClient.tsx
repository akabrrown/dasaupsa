'use client'

import { useState } from 'react'
import ActivityCard from '@/components/sections/ActivityCard'
import { CalendarDays, History, Loader2 } from 'lucide-react'
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
    { label: 'Upcoming', count: initialActivities.filter(a => a.status === 'upcoming').length, icon: CalendarDays, color: 'text-DASA-orange' },
    { label: 'Past Events', count: initialActivities.filter(a => a.status === 'completed').length, icon: History, color: 'text-gray-500' }
  ]

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">Our Activities</h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
              Stay updated with all the exciting events and activities happening 
              within the DASA community.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 min-w-[160px]">
                <div className={`p-2 rounded-lg bg-white shadow-sm border border-gray-100 ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-gray-900 leading-none mb-1">{stat.count}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex lg:flex-col overflow-x-auto no-scrollbar">
              {(['all', 'upcoming', 'completed'] as const).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all capitalize whitespace-nowrap text-left ${
                    filter === tag 
                      ? 'bg-DASA-black text-white shadow-md' 
                      : 'text-gray-600 hover:text-DASA-orange hover:bg-orange-50/50'
                  }`}
                >
                  {tag} Activities
                </button>
              ))}
            </div>
          </div>

          {/* Timeline / Listing */}
          <div className="flex-1 max-w-4xl space-y-8 relative">
            {/* Timeline track for desktop */}
            <div className="hidden md:block absolute left-[120px] top-4 bottom-4 w-px bg-gray-200 z-0"></div>

            {filteredActivities.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredActivities.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    <ActivityCard 
                      {...activity} 
                      event_date={activity.completed_at || activity.event_date} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <History className="mx-auto text-gray-300 mb-3" size={32} />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No activities listed.</h3>
                <p className="text-sm text-gray-500">Stay tuned for future events and updates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}




