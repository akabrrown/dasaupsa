'use client'

import { useState, useEffect } from 'react'
import ProfileForm from '@/components/admin/ProfileForm'
import { supabase } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  UserCircle, 
  Edit3, 
  Trash2, 
  Crown,
  Loader2,
  Mail,
  Linkedin,
  ArrowUpDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminAboutPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('display_order', { ascending: true })
      
      if (error) throw error
      setProfiles(data || [])
    } catch (err: any) {
      console.error('Admin: Error fetching profiles:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (!error) fetchProfiles()
    }
  }

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black">Executive & Authority Profiles</h1>
          <p className="text-gray-500 font-medium">Manage the team leading DASA's mission</p>
        </div>
        <Button 
          onClick={() => setEditing({})} 
          className="bg-DASA-black hover:bg-DASA-orange text-white px-6 py-6 rounded-2xl font-bold transition-all shadow-lg shadow-DASA-black/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Profile
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-DASA-orange transition-all outline-none text-sm font-medium"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
          <Loader2 className="animate-spin text-DASA-black" size={40} />
          <p className="font-bold">Retrieving team directory...</p>
        </div>
      ) : filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProfiles.map((prof, index) => (
              <motion.div
                key={prof.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden bg-white h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden bg-gray-50">
                    {prof.photo_url ? (
                      <img src={prof.photo_url} alt={prof.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <UserCircle size={80} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-DASA-black shadow-sm flex items-center gap-1.5 border border-white">
                      <ArrowUpDown size={10} className="text-DASA-orange" />
                      Order: {prof.display_order}
                    </div>
                  </div>
                  
                  <CardContent className="p-6 grow flex flex-col">
                    <div className="mb-4">
                      <span className="text-[10px] font-extrabold text-DASA-orange uppercase tracking-[0.2em] mb-1 block">
                        {prof.title || 'No Position Set'}
                      </span>
                      <h3 className="text-xl font-bold text-DASA-black uppercase line-clamp-1">
                        {prof.name}
                      </h3>
                      <p className="text-gray-400 text-xs font-bold italic mt-1">
                        {prof.role === 'Authority' ? 'Patron and Authorities' : 'Association Executives'}
                      </p>
                    </div>

                    <div className="space-y-2 mb-6">
                      {prof.email && (
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                          <Mail size={14} className="text-DASA-orange" />
                          {prof.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditing(prof)}
                        className="flex-1 rounded-xl font-bold text-xs border-gray-100 text-gray-500 hover:text-DASA-black hover:border-DASA-black"
                      >
                        <Edit3 size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(prof.id)}
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
            <UserCircle size={32} />
          </div>
          <h3 className="text-gray-600 font-bold">No Profiles Found</h3>
          <p className="text-gray-400 text-sm mt-1">Add lead members to showcase the DASA team.</p>
        </div>
      )}

      {editing && (
        <ProfileForm 
          profile={editing} 
          onSave={() => {
            setEditing(null)
            fetchProfiles()
          }} 
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}




