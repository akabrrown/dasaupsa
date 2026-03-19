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
    <div className="space-y-20 pb-20">
      <HeroSection />

      {/* Announcements Section */}
      <section className="bg-light-orange py-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-DASA-orange font-bold tracking-wider uppercase text-sm mb-2">Staying Updated</h2>
              <h3 className="text-4xl font-extrabold text-DASA-black">Latest Announcements</h3>
            </div>
            <Link href="/activities" className="hidden md:flex items-center text-DASA-black font-bold hover:text-DASA-orange transition-colors group">
              View All Activities <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
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
              <div className="col-span-full text-center py-10 text-gray-400 italic">
                No announcements yet. Check back soon!
              </div>
            )}
          </div>

          <Link href="/activities" className="md:hidden mt-8 flex items-center justify-center text-DASA-black font-bold hover:text-DASA-orange transition-colors group">
            View All Activities <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>

    </div>
  )
}




