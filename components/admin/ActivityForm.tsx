'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/ui/FileUpload'
import { supabase } from '@/lib/supabase/client'
import { 
  Save, 
  X, 
  Activity, 
  Loader2, 
  MapPin, 
  Calendar as CalendarIcon, 
  Image as ImageIcon,
  CheckCircle2,
  Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { revalidateData } from '@/lib/actions/data'

interface ActivityFormProps {
  activity: any
  onSave: () => void
  onCancel: () => void
}

export default function ActivityForm({ activity, onSave, onCancel }: ActivityFormProps) {
  const [title, setTitle] = useState(activity.title || '')
  const [description, setDescription] = useState(activity.description || '')
  const [location, setLocation] = useState(activity.location || '')
  const [eventDate, setEventDate] = useState(activity.event_date ? new Date(activity.event_date).toISOString().slice(0, 16) : '')
  const [completedAt, setCompletedAt] = useState(activity.completed_at ? new Date(activity.completed_at).toISOString().slice(0, 16) : '')
  const [status, setStatus] = useState(activity.status || 'upcoming')
  const [images, setImages] = useState<string[]>(activity.images || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title || !description || !location || !eventDate) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError(null)

    const finalStatus = completedAt ? 'completed' : status

    const payload = {
      title,
      description,
      location,
      event_date: new Date(eventDate).toISOString(),
      completed_at: completedAt ? new Date(completedAt).toISOString() : null,
      status: finalStatus,
      images,
    }

    try {
      if (activity.id) {
        const { error } = await supabase
          .from('activities')
          .update(payload)
          .eq('id', activity.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('activities')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
        if (error) throw error
      }
      await revalidateData('activities')
      onSave()
    } catch (err: any) {
      setError(err.message || 'Failed to save activity.')
    } finally {
      setLoading(false)
    }
  }

  const addImage = (url: string) => {
    if (url) setImages(prev => [...prev, url])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-DASA-black/20 backdrop-blur-sm"
    >
      <Card className="w-full max-w-4xl shadow-2xl border-none rounded-[32px] overflow-hidden">
        <CardHeader className="bg-DASA-black text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Activity size={24} className="text-DASA-orange" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {activity.id ? 'Edit Activity Details' : 'Plan New Activity'}
              </CardTitle>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Activity Title *</label>
                <Input
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="e.g. DASA Week Celebration"
                  className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all min-h-[120px] text-sm"
                  placeholder="What is this activity about?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      value={location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                      placeholder="Main Auditorium"
                      className="pl-11 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs font-bold h-[48px]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Date & Time *</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDate(e.target.value)}
                      className="pl-11 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Completion Date (Optional)</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      type="datetime-local"
                      value={completedAt}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompletedAt(e.target.value)}
                      className="pl-11 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 ml-1 font-medium">Picking a completion date automatically marks the event as completed.</p>
                </div>
              </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Activity Gallery</label>
                <div className="bg-blue-50/50 p-6 rounded-[32px] border-2 border-dashed border-blue-100">
                  <FileUpload 
                    onUpload={addImage} 
                    folder="activities" 
                  />
                  
                  <AnimatePresence>
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-6">
                        {images.map((img, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm bg-white"
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity ring-2 ring-white"
                            >
                              <X size={12} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>

                  {images.length === 0 && (
                    <div className="text-center py-6">
                      <ImageIcon className="mx-auto text-blue-200 mb-2" size={32} />
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">No images yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              className="px-8 py-6 border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all text-sm"
            >
              Discard Changes
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex-1 py-6 bg-DASA-black hover:bg-DASA-orange text-white font-bold rounded-2xl transition-all shadow-lg shadow-DASA-black/20 flex items-center justify-center gap-3 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              {activity.id ? 'Update Activity' : 'Confirm & Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}




