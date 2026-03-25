'use client'

import { useState, useEffect } from 'react'
import TutorialForm from '@/components/admin/TutorialForm'
import { supabase } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  Video, 
  Edit3, 
  Trash2, 
  Calendar,
  Loader2,
  BookOpen,
  User,
  ExternalLink
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTutorials()
  }, [])

  const fetchTutorials = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tutorials')
      .select('*, programs(name)')
      .order('created_at', { ascending: false })
    
    if (!error) setTutorials(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      const { error } = await supabase.from('tutorials').delete().eq('id', id)
      if (!error) fetchTutorials()
    }
  }

  const filteredTutorials = tutorials.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.course_code && t.course_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    t.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black">Video Tutorials</h1>
          <p className="text-gray-500 font-medium">Manage academic video resources and guides</p>
        </div>
        <Button 
          onClick={() => setEditing({})} 
          className="bg-DASA-black hover:bg-DASA-orange text-white px-6 py-6 rounded-2xl font-bold transition-all shadow-lg shadow-DASA-black/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Upload Tutorial
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by title, course or lecturer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-DASA-orange transition-all outline-none text-sm font-medium"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
          <Loader2 className="animate-spin text-DASA-black" size={40} />
          <p className="font-bold">Accessing video library...</p>
        </div>
      ) : filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTutorials.map((tut, index) => (
              <motion.div
                key={tut.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden bg-white h-full flex flex-col">
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    {tut.thumbnail_url ? (
                      <img src={tut.thumbnail_url} alt={tut.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Video size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-4 ring-white/10">
                        <Video size={24} />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 grow flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-50 text-DASA-black text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
                        {tut.course_code}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                        <Calendar size={12} />
                        {new Date(tut.created_at).getFullYear()}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-DASA-black mb-2 line-clamp-1 uppercase group-hover:text-DASA-orange transition-colors">
                      {tut.title}
                    </h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <User size={14} className="text-DASA-orange" />
                        <span className="font-medium">{tut.lecturer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <BookOpen size={14} className="text-DASA-orange" />
                        <span className="font-bold text-DASA-black/70">
                          {tut.program || (Array.isArray(tut.programs) ? tut.programs.map((p: any) => p.name).join(', ') : tut.programs?.name) || 'Common'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 pl-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-DASA-black/30"></span>
                         <span className="font-medium px-1">Sem {tut.semester}, Year {tut.year}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditing(tut)}
                        className="flex-1 rounded-xl font-bold text-xs border-gray-100 text-gray-500 hover:text-DASA-black hover:border-DASA-black"
                      >
                        <Edit3 size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(tut.id)}
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
            <Video size={32} />
          </div>
          <h3 className="text-gray-600 font-bold">No Tutorials Found</h3>
          <p className="text-gray-400 text-sm mt-1">Start by uploading your first video lesson.</p>
        </div>
      )}

      {editing && (
        <TutorialForm 
          tutorial={editing} 
          onSave={() => {
            setEditing(null)
            fetchTutorials()
          }} 
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}




