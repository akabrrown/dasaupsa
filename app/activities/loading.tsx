import { ActivityCardSkeleton } from '@/components/ui/Skeletons'
import { Sparkles, History } from 'lucide-react'

export default function LoadingActivities() {
  const stats = [
    { label: 'Upcoming', color: 'text-green-500' },
    { label: 'Past Events', color: 'text-gray-500' }
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
                  {i === 0 ? <Sparkles size={18} /> : <History size={18} />}
                </div>
                <div>
                  <div className="h-5 w-8 bg-gray-200 rounded animate-pulse mb-1"></div>
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
                  disabled
                  className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all capitalize whitespace-nowrap text-left ${
                    tag === 'all' 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-500'
                  }`}
                >
                  {tag} Activities
                </button>
              ))}
            </div>
          </div>

          {/* Timeline / Listing */}
          <div className="flex-1 max-w-4xl space-y-8 relative">
            <div className="hidden md:block absolute left-[120px] top-4 bottom-4 w-px bg-gray-200 z-0"></div>

            <div className="space-y-8 relative z-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <ActivityCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
