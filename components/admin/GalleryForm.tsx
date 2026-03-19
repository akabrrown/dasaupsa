'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/ui/FileUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { revalidateData } from '@/lib/actions/data'

interface GalleryFormProps {
  item: any
  onSave: () => void
  onCancel: () => void
}

export default function GalleryForm({ item, onSave, onCancel }: GalleryFormProps) {
  const [title, setTitle] = useState(item.title || '')
  const [description, setDescription] = useState(item.description || '')
  const [imageUrl, setImageUrl] = useState(item.image_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!imageUrl) {
      setError('An image is required.')
      return
    }

    setLoading(true)
    setError(null)

    const payload = {
      title: title || null,
      description: description || null,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    }

    try {
      if (item.id) {
        const { error } = await supabase
          .from('gallery')
          .update(payload)
          .eq('id', item.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
        if (error) throw error
      }
      await revalidateData('gallery')
      onSave()
    } catch (err: any) {
      setError(err.message || 'Failed to save gallery item.')
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
                <ImageIcon size={24} className="text-DASA-orange" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {item.id ? 'Edit Gallery Item' : 'Add to Gallery'}
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
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Image Title (Optional)</label>
            <Input
              type="text"
              placeholder="e.g. Freshers Orientation 2024"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all min-h-[100px] text-sm"
              placeholder="Tell us more about this moment..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Photo Upload</label>
            <FileUpload 
              onUpload={setImageUrl} 
              value={imageUrl} 
              folder="gallery" 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              className="flex-1 py-6 border-2 border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex-1 py-6 bg-DASA-black hover:bg-DASA-orange text-white font-bold rounded-2xl transition-all shadow-lg shadow-DASA-black/10 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {item.id ? 'Save Changes' : 'Upload to Gallery'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
