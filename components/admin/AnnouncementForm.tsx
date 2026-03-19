'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/ui/FileUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, X, Megaphone, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { revalidateData } from '@/lib/actions/data'

interface AnnouncementFormProps {
  announcement: any
  onSave: () => void
  onCancel: () => void
}

export default function AnnouncementForm({ announcement, onSave, onCancel }: AnnouncementFormProps) {
  const [title, setTitle] = useState(announcement.title || '')
  const [body, setBody] = useState(announcement.body || '')
  const [imageUrl, setImageUrl] = useState(announcement.image_url || '')
  const [isPinned, setIsPinned] = useState(announcement.is_pinned || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title || !body) {
      setError('Title and Body are required.')
      return
    }

    setLoading(true)
    setError(null)

    const payload = {
      title,
      body,
      image_url: imageUrl,
      is_pinned: isPinned,
      updated_at: new Date().toISOString(),
    }

    try {
      if (announcement.id) {
        const { error } = await supabase
          .from('general_posts')
          .update(payload)
          .eq('id', announcement.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('general_posts')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
        if (error) throw error
      }
      await revalidateData('announcements')
      onSave()
    } catch (err: any) {
      setError(err.message || 'Failed to save announcement.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-DASA-black/20 backdrop-blur-sm"
    >
      <Card className="w-full max-w-2xl shadow-2xl border-none rounded-[32px] overflow-hidden">
        <CardHeader className="bg-DASA-black text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Megaphone size={24} className="text-DASA-orange" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {announcement.id ? 'Edit Announcement' : 'Create New Announcement'}
              </CardTitle>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Announcement Title</label>
            <Input
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Content / Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all min-h-[120px] text-sm"
              placeholder="What's the update?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Cover Image</label>
            <FileUpload 
              onUpload={setImageUrl} 
              value={imageUrl} 
              folder="announcements" 
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isPinned ? 'bg-DASA-orange text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                <Save size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-DASA-black">Pin to Top</p>
                <p className="text-[11px] text-gray-400 font-medium">Keep this announcement at the top of the list</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isPinned} 
                onChange={(e) => setIsPinned(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-DASA-orange"></div>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              className="flex-1 py-6 border-2 border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Discard Changes
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex-1 py-6 bg-DASA-black hover:bg-DASA-orange text-white font-bold rounded-2xl transition-all shadow-lg shadow-DASA-black/10 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {announcement.id ? 'Update Announcement' : 'Publish Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}




