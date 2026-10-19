import HeroSection from '@/components/sections/HeroSection'
import AnnouncementCard from '@/components/sections/AnnouncementCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getAnnouncements } from '@/lib/actions/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Home",
  description: "The central hub for academic excellence, professional growth, and departmental innovation at the University of Professional Studies, Accra.",
}

export default async function HomePage() {
  const { data: latestAnnouncements, error } = await getAnnouncements(3)

  if (error) {
    console.error('Error fetching announcements:', error)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Department Pillars & Stats Strip */}
      <section className="bg-DASA-black text-white py-12 border-y border-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-3xl md:text-4xl font-extrabold text-DASA-orange mb-1">4 Levels</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Undergraduate Cohorts</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-3xl md:text-4xl font-extrabold text-white mb-1">100+</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Past Questions & Slides</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-3xl md:text-4xl font-extrabold text-DASA-orange mb-1">Seminars</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Industry & Career Talks</span>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-3xl md:text-4xl font-extrabold text-white mb-1">UPSA</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Official Student Body</span>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-DASA-orange font-bold tracking-widest uppercase text-xs mb-3">Staying Updated</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-DASA-black tracking-tight leading-none">
                Latest Announcements
              </h3>
            </div>
            <Link href="/activities" className="hidden md:inline-flex items-center text-sm font-semibold text-gray-700 hover:text-DASA-orange transition-colors group">
              View Upcoming Events <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestAnnouncements && latestAnnouncements.length > 0 ? (
              latestAnnouncements.map((announcement) => (
                <AnnouncementCard 
                  key={announcement.id} 
                  id={announcement.id}
                  title={announcement.title}
                  body={announcement.body}
                  image={announcement.image_url}
                  isPinned={announcement.is_pinned}
                  createdAt={announcement.created_at}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400 font-medium border border-dashed border-gray-200 rounded-xl">
                No announcements yet. Check back soon.
              </div>
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/activities" className="inline-flex items-center justify-center text-sm font-semibold text-DASA-black hover:text-DASA-orange transition-colors group px-6 py-3 border border-gray-200 rounded-lg w-full">
              View Upcoming Events <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}




