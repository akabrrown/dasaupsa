import { TutorialCardSkeleton } from '@/components/ui/Skeletons'
import { Search, Filter } from 'lucide-react'

export default function LoadingTutorials() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">Video Tutorials</h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
              Access course-specific tutorials recorded by UPSA faculty and student leaders
              covering core curriculum topics.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 mt-12">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              disabled
              placeholder="Search by topic, lecturer, or keyword..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <div className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg min-w-[200px] h-10"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <TutorialCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
