import { AnnouncementCardSkeleton } from '@/components/ui/Skeletons'

export default function LoadingHome() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Skeleton (simplified) */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-gray-200 animate-pulse flex items-center justify-center">
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
            <div className="hidden md:inline-flex items-center text-sm font-semibold text-gray-500">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <AnnouncementCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
