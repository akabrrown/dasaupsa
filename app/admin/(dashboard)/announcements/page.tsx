'use client'

import { useState, useEffect } from 'react'
import AnnouncementForm from '@/components/admin/AnnouncementForm'
import { supabase } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  Megaphone, 
  Edit3, 
  Trash2, 
  Pin, 
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('general_posts')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (!error) setAnnouncements(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      const { error } = await supabase.from('general_posts').delete().eq('id', id)
      if (!error) fetchAnnouncements()
    }
  }

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.body.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black">Announcements</h1>
          <p className="text-gray-500 font-medium">Manage latest updates and pinned news</p>
        </div>
        <Button 
          onClick={() => setEditing({})} 
          className="bg-DASA-black hover:bg-DASA-orange text-white px-6 py-6 rounded-2xl font-bold transition-all shadow-lg shadow-DASA-black/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Create Announcement
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-DASA-orange transition-all outline-none text-sm font-medium"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
          <Loader2 className="animate-spin text-DASA-black" size={40} />
          <p className="font-bold">Syncing with database...</p>
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAnnouncements.map((ann, index) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden bg-white h-full flex flex-col">
                  {ann.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={ann.image_url} alt={ann.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {ann.is_pinned && (
                        <div className="absolute top-4 right-4 bg-DASA-orange text-white p-2 rounded-xl shadow-lg">
                          <Pin size={16} fill="currentColor" />
                        </div>
                      )}
                    </div>
                  )}
                  <CardContent className="p-6 grow flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      <Calendar size={12} className="text-DASA-orange" />
                      {new Date(ann.created_at).toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-bold text-DASA-black mb-2 line-clamp-2 uppercase">
                      {ann.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {ann.body}
                    </p>
                    
                    <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditing(ann)}
                        className="flex-1 rounded-xl font-bold text-xs border-gray-100 text-gray-500 hover:text-DASA-black hover:border-DASA-black"
                      >
                        <Edit3 size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(ann.id)}
                        className="rounded-xl font-bold text-xs border-gray-100 text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Megaphone size={32} />
          </div>
          <h3 className="text-gray-600 font-bold">No Announcements Found</h3>
          <p className="text-gray-400 text-sm mt-1">Try a different search term or create a new post.</p>
        </div>
      )}

      {editing && (
        <AnnouncementForm 
          announcement={editing} 
          onSave={() => {
            setEditing(null)
            fetchAnnouncements()
          }} 
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}




