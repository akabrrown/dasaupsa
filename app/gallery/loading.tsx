import { GalleryItemSkeleton } from '@/components/ui/Skeletons'

export default function LoadingGallery() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
              Departmental Gallery
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
              Capturing the moments, events, and milestones that define the Department of Accounting Student Association at UPSA.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="break-inside-avoid mb-4">
              <GalleryItemSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
