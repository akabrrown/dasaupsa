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
  items: GalleryItem[]
}

export default function GalleryPageClient({ items }: GalleryPageClientProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  return (
    <div className="min-h-screen bg-light-orange pb-20">
      {/* Hero Header - Matched with About Us */}
      <section className="bg-DASA-orange py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 skew-x-12 translate-x-20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-DASA-black">
              Departmental <span className="text-white">Gallery</span>
            </h1>
            <p className="text-xl text-DASA-black/80 font-medium leading-relaxed">
              Capturing the moments, events, and milestones that define the Department of Accounting Student Association at UPSA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative aspect-square bg-gray-100 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelectedImage(item)}
            >
              <Image
                src={item.image_url}
                alt={item.title || 'Gallery image'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-DASA-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <div className="flex justify-between items-end">
                  <div>
                    {item.title && <h3 className="text-white font-bold text-lg leading-tight mb-1">{item.title}</h3>}
                    <div className="flex items-center text-DASA-orange text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={12} className="mr-1.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white">
                    <Maximize2 size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <Info className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-500">No images in the gallery yet.</h3>
            <p className="text-gray-400">Our memories are currently being processed. Check back soon!</p>
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
            className="fixed inset-0 z-100 bg-DASA-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-3 rounded-full transition-colors z-110"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.title || 'Lightbox view'}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="mt-6 text-center">
                {selectedImage.title && (
                  <h2 className="text-2xl font-black text-white mb-2">{selectedImage.title}</h2>
                )}
                {selectedImage.description && (
                  <p className="text-gray-400 max-w-xl mx-auto">{selectedImage.description}</p>
                )}
                <p className="text-DASA-orange font-bold uppercase tracking-widest text-xs mt-4">
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
