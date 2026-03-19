'use client'

import { useState, useEffect } from 'react'
import ActivityForm from '@/components/admin/ActivityForm'
import { supabase } from '@/lib/supabase/client'
import { 
  Plus, 
  Search, 
  Activity, 
  Edit3, 
  Trash2, 
  Calendar,
  Loader2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('event_date', { ascending: false })
    
    if (!error) setActivities(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      const { error } = await supabase.from('activities').delete().eq('id', id)
      if (!error) fetchActivities()
    }
  }

  const filteredActivities = activities.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100'
      case 'upcoming': return 'bg-blue-50 text-DASA-black border-blue-100'
      case 'ongoing': return 'bg-amber-50 text-DASA-orange border-amber-100'
      default: return 'bg-gray-50 text-gray-500 border-gray-100'
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black">DASA Activities</h1>
          <p className="text-gray-500 font-medium">Schedule events, track progress, and showcase highlights</p>
        </div>
        <Button 
          onClick={() => setEditing({})} 
          className="bg-DASA-black hover:bg-DASA-orange text-white px-6 py-6 rounded-2xl font-bold transition-all shadow-lg shadow-DASA-black/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Plan New Activity
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-DASA-orange transition-all outline-none text-sm font-medium"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
          <Loader2 className="animate-spin text-DASA-black" size={40} />
          <p className="font-bold">Syncing event calendar...</p>
        </div>
      ) : filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((act, index) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden bg-white h-full flex flex-col">
                  {act.images && act.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={act.images[0]} alt={act.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border shadow-sm ${getStatusColor(act.status)}`}>
                        {act.status}
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-6 grow flex flex-col">
                    <h3 className="text-lg font-bold text-DASA-black mb-2 line-clamp-1 uppercase group-hover:text-DASA-orange transition-colors">
                      {act.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                        <Calendar size={14} className="text-DASA-orange" />
                        {act.event_date ? new Date(act.event_date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'No date'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                        <MapPin size={14} className="text-DASA-orange" />
                        {act.location}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-xs line-clamp-2 mb-6 leading-relaxed font-medium">
                      {act.description}
                    </p>
                    
                    <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditing(act)}
                        className="flex-1 rounded-xl font-bold text-xs border-gray-100 text-gray-500 hover:text-DASA-black hover:border-DASA-black"
                      >
                        <Edit3 size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(act.id)}
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
            <Activity size={32} />
          </div>
          <h3 className="text-gray-600 font-bold">No Activities Found</h3>
          <p className="text-gray-400 text-sm mt-1">Plan your first community event.</p>
        </div>
      )}

      {editing && (
        <ActivityForm 
          activity={editing} 
          onSave={() => {
            setEditing(null)
            fetchActivities()
          }} 
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}




