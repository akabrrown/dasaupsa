'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/ui/FileUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, X, UserCircle, Loader2, Mail, Linkedin, Briefcase, Hash } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { revalidateData } from '@/lib/actions/data'

interface ProfileFormProps {
  profile: any
  onSave: () => void
  onCancel: () => void
}

export default function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [name, setName] = useState(profile.name || '')
  const [title, setTitle] = useState(profile.title || '')
  const [role, setRole] = useState(profile.role || '')
  const [photoUrl, setPhotoUrl] = useState(profile.photo_url || '')
  const [email, setEmail] = useState(profile.email || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [displayOrder, setDisplayOrder] = useState(profile.display_order || 0)
  const [linkedin_url, setLinkedinUrl] = useState(profile.linkedin_url || '')
  const [twitter_url, setTwitterUrl] = useState(profile.twitter_url || '')
  const [instagram_url, setInstagramUrl] = useState(profile.instagram_url || '')
  const [tiktok_url, setTiktokUrl] = useState(profile.tiktok_url || '')
  const [whatsapp_url, setWhatsappUrl] = useState(profile.whatsapp_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!name || !role) {
      setError('Name and Role are required.')
      return
    }

    setLoading(true)
    setError(null)

    const payload = {
      name,
      title,
      role,
      photo_url: photoUrl,
      email,
      bio,
      display_order: Number(displayOrder),
      linkedin_url,
      twitter_url,
      instagram_url,
      tiktok_url,
      whatsapp_url,
    }

    try {
      if (profile.id) {
        const { error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', profile.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
        if (error) throw error
      }
      await revalidateData('profiles')
      onSave()
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.')
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
                <UserCircle size={24} className="text-DASA-orange" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {profile.id ? 'Edit Profile' : 'Add New Member'}
              </CardTitle>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Full Name *</label>
                <Input
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Category *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all font-bold text-sm h-[60px]"
                >
                  <option value="">Select Category</option>
                  <option value="Authority">Patron and Authorities</option>
                  <option value="Executive">Association Executives</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Official Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder="e.g. President or Patron"
                    className="pl-11 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Display Order</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="number"
                    value={displayOrder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayOrder(Number(e.target.value))}
                    className="pl-11 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Profile Photo</label>
                <FileUpload 
                  onUpload={setPhotoUrl} 
                  value={photoUrl} 
                  folder="profiles" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="pl-11 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Social Handles</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  value={linkedin_url}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="LinkedIn URL"
                  className="pl-11 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs"
                />
              </div>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                <Input
                  value={twitter_url}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="Twitter URL"
                  className="pl-11 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs"
                />
              </div>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <Input
                  value={instagram_url}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="Instagram URL"
                  className="pl-11 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs"
                />
              </div>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z"/><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z"/><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z"/><path d="M9 16C9 16 10.5 17 12 17C13.5 17 15 16 15 16"/></svg>
                <Input
                  value={tiktok_url}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="TikTok URL"
                  className="pl-11 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs"
                />
              </div>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <Input
                  value={whatsapp_url}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                  placeholder="WhatsApp Nums (comma separated)"
                  className="pl-11 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Short Biography</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all min-h-[100px] text-sm"
              placeholder="Tell us about this member..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
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
              {profile.id ? 'Update Profile' : 'Save Member'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}




