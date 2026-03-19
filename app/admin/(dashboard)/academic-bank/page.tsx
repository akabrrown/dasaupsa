'use client'

import { useState, useEffect } from 'react'
import ResourceForm from '@/components/admin/ResourceForm'
import { supabase } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  FileText, 
  Edit3, 
  Trash2, 
  BookOpen,
  Loader2,
  FileDown,
  Layers,
  Archive
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminAcademicBankPage() {
  const [resources, setResources] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('academic_resources')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setResources(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      const { error } = await supabase.from('academic_resources').delete().eq('id', id)
      if (!error) fetchResources()
    }
  }

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.course_code && r.course_code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black">Academic Bank</h1>
          <p className="text-gray-500 font-medium">Manage lecture slides and past examination questions</p>
        </div>
        <Button 
          onClick={() => setEditing({})} 
          className="bg-DASA-black hover:bg-DASA-orange text-white px-6 py-6 rounded-2xl font-bold transition-all shadow-lg shadow-DASA-black/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Resource
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by title or course code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-DASA-orange transition-all outline-none text-sm font-medium"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
          <Loader2 className="animate-spin text-DASA-black" size={40} />
          <p className="font-bold">Loading document repository...</p>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((res, index) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden bg-white h-full flex flex-col">
                  <CardContent className="p-6 grow flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${res.type === 'slide' ? 'bg-blue-50 text-DASA-black' : 'bg-amber-50 text-DASA-orange'}`}>
                        {res.type === 'slide' ? <Layers size={24} /> : <Archive size={24} />}
                      </div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                        {res.type.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-DASA-black mb-2 line-clamp-1 uppercase group-hover:text-DASA-orange transition-colors">
                      {res.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 mb-6">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <BookOpen size={14} className="text-DASA-orange" />
                        {res.course_code}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-DASA-black/30"></span>
                        Level {res.year}00
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-DASA-black/30"></span>
                        Sem {res.semester}
                      </div>
                    </div>

                    {res.file_url && (
                      <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText size={16} className="text-gray-400 shrink-0" />
                          <span className="text-[10px] text-gray-500 truncate font-medium">{res.file_url.split('/').pop()}</span>
                        </div>
                        <FileDown size={14} className="text-DASA-black" />
                      </div>
                    )}
                    
                    <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditing(res)}
                        className="flex-1 rounded-xl font-bold text-xs border-gray-100 text-gray-500 hover:text-DASA-black hover:border-DASA-black"
                      >
                        <Edit3 size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(res.id)}
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
            <Archive size={32} />
          </div>
          <h3 className="text-gray-600 font-bold">No Resources Found</h3>
          <p className="text-gray-400 text-sm mt-1">Populate the academic bank with your first upload.</p>
        </div>
      )}

      {editing && (
        <ResourceForm 
          resource={editing} 
          onSave={() => {
            setEditing(null)
            fetchResources()
          }} 
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}




