'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  Image as ImageIcon, 
  Edit3, 
  Trash2, 
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import GalleryForm from '@/components/admin/GalleryForm'

export default function AdminGalleryClient() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setItems(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo from the gallery?')) {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (!error) fetchGallery()
    }
  }

  const filteredItems = items.filter(item => 
    (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  )

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black">Photo Gallery</h1>
          <p className="text-gray-500 font-medium">Capture and manage departmental moments</p>
        </div>
        <Button 
          onClick={() => setEditing({})} 
          className="bg-DASA-black hover:bg-DASA-orange text-white px-6 py-6 rounded-2xl font-bold transition-all shadow-lg shadow-DASA-black/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Photo
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search gallery..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-DASA-orange transition-all outline-none text-sm font-medium"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
          <Loader2 className="animate-spin text-DASA-black" size={40} />
          <p className="font-bold">Loading gallery...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden bg-white h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={item.image_url} alt={item.title || 'Gallery item'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        size="icon"
                        variant="secondary"
                        onClick={() => setEditing(item)}
                        className="rounded-full bg-white text-DASA-black hover:bg-DASA-orange hover:text-white"
                      >
                        <Edit3 size={18} />
                      </Button>
                      <Button 
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                  {(item.title || item.description) && (
                    <CardContent className="p-4">
                      {item.title && <h3 className="text-sm font-bold text-DASA-black mb-1 line-clamp-1 truncate">{item.title}</h3>}
                      <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        <Calendar size={10} className="text-DASA-orange" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-gray-600 font-bold">The Gallery is Empty</h3>
          <p className="text-gray-400 text-sm mt-1">Start adding photos to show off departmental life.</p>
        </div>
      )}

      {editing && (
        <GalleryForm 
          item={editing} 
          onSave={() => {
            setEditing(null)
            fetchGallery()
          }} 
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
