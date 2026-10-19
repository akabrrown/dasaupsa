import { ResourceCardSkeleton } from '@/components/ui/Skeletons'
import { DownloadCloud } from 'lucide-react'

export default function LoadingAcademicBank() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Skeleton */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="h-9 w-64 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-96 max-w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="hidden md:flex p-3 bg-gray-50 rounded-xl border border-gray-100">
            <DownloadCloud size={28} className="text-gray-300" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 mt-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full md:w-64 shrink-0 space-y-4">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grow space-y-6">
          <div className="h-12 bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
