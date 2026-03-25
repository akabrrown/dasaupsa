'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/ui/FileUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, X, Video, Loader2, Link as LinkIcon, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPrograms } from '@/lib/actions/programs'
import { useEffect } from 'react'
import { revalidateData } from '@/lib/actions/data'

interface TutorialFormProps {
  tutorial: any
  onSave: () => void
  onCancel: () => void
}

export default function TutorialForm({ tutorial, onSave, onCancel }: TutorialFormProps) {
  const [title, setTitle] = useState(tutorial.title || '')
  const [description, setDescription] = useState(tutorial.description || '')
  const [videoUrl, setVideoUrl] = useState(tutorial.video_url || '')
  const [course, setCourse] = useState(tutorial.course_code || '')
  const [semester, setSemester] = useState(tutorial.semester || '1')
  const [year, setYear] = useState(tutorial.year || '1')
  const [lecturer, setLecturer] = useState(tutorial.lecturer || '')
  const [selectedProgramNames, setSelectedProgramNames] = useState<string[]>(() => {
    if (tutorial.program) return tutorial.program.split(',').map((s: string) => s.trim())
    return []
  })
  const [programs, setPrograms] = useState<any[]>([])
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPrograms() {
      try {
        const { data, error } = await getPrograms()
        if (error) {
          console.error('[TutorialForm] Failed to load programs:', error)
        }
        if (data && data.length > 0) {
          setPrograms(data)
          // If editing and we don't have program names but we have program_id, recover name
          if (tutorial.id && selectedProgramNames.length === 0 && tutorial.program_id) {
            const matched = data.find(p => p.id === tutorial.program_id)
            if (matched) setSelectedProgramNames([matched.name])
          }
        }
      } catch (err) {
        console.error('[TutorialForm] Error loading programs:', err)
      }
      setLoadingPrograms(false)
    }
    loadPrograms()
  }, [])

  const handleSave = async () => {
    if (!title || !videoUrl || !course || !lecturer || selectedProgramNames.length === 0) {
      setError('Please fill in all required fields (Title, Video URL, Course, Lecturer, Program).')
      return
    }

    setLoading(true)
    setError(null)

    // Resolve primary program ID for backward compatibility
    const primaryProgram = programs.find(p => selectedProgramNames.includes(p.name))
    const primaryProgramId = primaryProgram ? primaryProgram.id : null

    const payload = {
      title,
      description,
      video_url: videoUrl,
      course_code: course,
      program_id: primaryProgramId,
      program: selectedProgramNames.join(', '), // Sync legacy field for multi-program support
      semester: parseInt(semester.toString()),
      year: parseInt(year.toString()),
      lecturer,
    }

    try {
      if (tutorial.id) {
        const { error } = await supabase
          .from('tutorials')
          .update(payload)
          .eq('id', tutorial.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('tutorials')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
        if (error) throw error
      }
      await revalidateData('tutorials')
      onSave()
    } catch (err: any) {
      console.error('[TutorialForm] Save error:', err)
      setError(err.message || 'Failed to save tutorial.')
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
      <Card className="w-full max-w-3xl shadow-2xl border-none rounded-[32px] overflow-hidden">
        <CardHeader className="bg-DASA-black text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Video size={24} className="text-DASA-orange" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {tutorial.id ? 'Edit Tutorial Details' : 'Upload New Tutorial'}
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
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Tutorial Title *</label>
                <Input
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Financial Reporting"
                  className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Video Upload (Direct)</label>
                <FileUpload 
                  onUpload={setVideoUrl} 
                  value={videoUrl} 
                  folder="tutorials/videos"
                  accept="video/*"
                  allowedTypesLabel="Video files (MP4, MOV, etc. Max 100MB)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Video URL (YouTube/Drive) *</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    value={videoUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVideoUrl(e.target.value)}
                    placeholder="Paste link here..."
                    className="pl-12 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Course Name *</label>
                <Input
                  value={course}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourse(e.target.value)}
                  placeholder="e.g. ACCT101"
                  className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-sm font-medium h-[52px]"
                  >
                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-sm font-medium h-[52px]"
                  >
                    {[1, 2].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Programs *</label>
                {loadingPrograms ? (
                  <div className="h-[52px] w-full bg-gray-50 animate-pulse rounded-2xl"></div>
                ) : programs.length === 0 ? (
                  <p className="text-xs text-red-500 font-bold p-3 bg-red-50 rounded-xl">
                    No programs found. Please add programs first.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {programs.map(p => {
                      const isSelected = selectedProgramNames.includes(p.name);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedProgramNames(prev => prev.filter(n => n !== p.name))
                            } else {
                              setSelectedProgramNames(prev => [...prev, p.name])
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            isSelected 
                              ? 'bg-DASA-orange border-DASA-orange text-white shadow-md shadow-DASA-orange/20' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-DASA-orange hover:text-DASA-orange'
                          }`}
                        >
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Lecturer *</label>
                <Input
                  value={lecturer}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLecturer(e.target.value)}
                  placeholder="e.g. Dr. Kwakye"
                  className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Tutorial Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all min-h-[100px] text-sm"
              placeholder="What is covered in this tutorial?"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              className="flex-1 py-6 border-2 border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Discard
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex-1 py-6 bg-DASA-black hover:bg-DASA-orange text-white font-bold rounded-2xl transition-all shadow-lg shadow-DASA-black/10 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {tutorial.id ? 'Save Changes' : 'Publish Tutorial'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}




