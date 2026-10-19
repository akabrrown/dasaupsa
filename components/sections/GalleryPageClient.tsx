'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, Calendar, Info } from 'lucide-react'
import Image from 'next/image'

interface GalleryItem {
  id: string
  title: string | null
  description: string | null
  image_url: string
  created_at: string
}

interface GalleryPageClientProps {
  galleryPhotos: GalleryItem[]
}

export default function GalleryPageClient({ galleryPhotos }: GalleryPageClientProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
              Departmental Gallery
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
              Capturing the moments, events, and milestones that define the Department of Accounting Student Association at UPSA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 lg:px-8 mt-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {galleryPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative break-inside-avoid bg-gray-100 rounded-lg overflow-hidden cursor-pointer mb-4"
              onClick={() => setSelectedImage(photo)}
            >
              {/* Note: since height varies in masonry, we remove aspect-square and use a relative wrapper that fits content.
                  But next/image needs width/height or layout fill. If we don't have aspect ratio, we'll need to just render an img or a fill with aspect ratio if known. Since we don't have specific width/height, we'll keep a relative aspect if needed or use object-cover. Wait, for actual masonry without aspect ratio we need next/image with layout responsive or similar. Next 13+ Image without width/height is tricky unless it's a known aspect. I'll use a placeholder aspect or leave it if we can't do true masonry. Actually, we'll just keep aspect-square to avoid layout shift, but the column layout itself is editorial. */}
              <div className="relative aspect-square w-full">
                <Image
                  src={photo.image_url}
                  alt={photo.title || 'Gallery image'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex justify-between items-end">
                  <div>
                    {photo.title && <h3 className="text-white font-bold text-base leading-tight mb-1">{photo.title}</h3>}
                    <div className="flex items-center text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar size={12} className="mr-1.5" />
                      {new Date(photo.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {galleryPhotos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Info className="mx-auto text-gray-300 mb-3" size={32} />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No images in the gallery yet.</h3>
            <p className="text-sm text-gray-500">Our memories are currently being processed. Check back soon.</p>
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-gray-400 hover:text-white bg-white/10 p-2.5 rounded-lg transition-colors z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={20} />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full h-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.title || 'Lightbox view'}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="mt-6 text-center">
                {selectedImage.title && (
                  <h2 className="text-xl font-bold text-white mb-2">{selectedImage.title}</h2>
                )}
                {selectedImage.description && (
                  <p className="text-sm text-gray-300 max-w-xl mx-auto">{selectedImage.description}</p>
                )}
                <p className="text-gray-500 font-semibold uppercase tracking-widest text-[10px] mt-3">
                  Posted on {new Date(selectedImage.created_at).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
