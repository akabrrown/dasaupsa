'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/ui/FileUpload'
import { supabase } from '@/lib/supabase/client'
import { Save, X, Layers, Archive, Loader2, BookOpen, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPrograms } from '@/lib/actions/programs'
import { revalidateData } from '@/lib/actions/data'

interface ResourceFormProps {
  resource: any
  onSave: () => void
  onCancel: () => void
}

export default function ResourceForm({ resource, onSave, onCancel }: ResourceFormProps) {
  const [title, setTitle] = useState(resource.title || '')
  const [course, setCourse] = useState(resource.course_code || '')
  const [selectedProgramNames, setSelectedProgramNames] = useState<string[]>(() => {
    if (resource.program) return resource.program.split(',').map((s: string) => s.trim())
    return []
  })
  const [programs, setPrograms] = useState<any[]>([])
  const [year, setYear] = useState(resource.year || '1')
  const [semester, setSemester] = useState(resource.semester || '1')
  const [type, setType] = useState(resource.type || 'slide')
  const [fileUrl, setFileUrl] = useState(resource.file_url || '')
  const [loading, setLoading] = useState(false)
  const [fetchingPrograms, setFetchingPrograms] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPrograms() {
      const { data } = await getPrograms()
      if (data) {
        setPrograms(data)
        // If editing and we don't have program names but we have program_id, recover name
        if (resource.id && selectedProgramNames.length === 0 && resource.program_id) {
          const matched = data.find(p => p.id === resource.program_id)
          if (matched) setSelectedProgramNames([matched.name])
        }
      }
      setFetchingPrograms(false)
    }
    loadPrograms()
  }, [])

  const handleSave = async () => {
    if (!title || !course || !fileUrl || selectedProgramNames.length === 0) {
      setError('Please fill in all required fields (Course Name, Code, at least one Program, and File).')
      return
    }

    setLoading(true)
    setError(null)

    // Make sure we resolve the primary program's ID for the FK
    const primaryProgram = programs.find(p => selectedProgramNames.includes(p.name))
    const primaryProgramId = primaryProgram ? primaryProgram.id : null

    const payload = {
      title,
      course_code: course,
      program_id: primaryProgramId,
      program: selectedProgramNames.join(', '), // Comma-separated names
      year: parseInt(year.toString()),
      semester: parseInt(semester.toString()),
      type,
      file_url: fileUrl,
    }

    try {
      if (resource.id) {
        const { error } = await supabase
          .from('academic_resources')
          .update(payload)
          .eq('id', resource.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('academic_resources')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
        if (error) throw error
      }
      await revalidateData('academic_resources')
      onSave()
    } catch (err: any) {
      setError(err.message || 'Failed to save resource.')
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
                {type === 'slide' ? <Layers size={24} className="text-DASA-orange" /> : <Archive size={24} className="text-DASA-orange" />}
              </div>
              <CardTitle className="text-2xl font-bold">
                {resource.id ? 'Edit Resource' : 'Add New Resource'}
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
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Course Name *</label>
                <Input
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="e.g. Financial Accounting"
                  className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Resource Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('slide')}
                    className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all ${
                      type === 'slide' ? 'bg-DASA-black text-white shadow-md shadow-DASA-black/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Layers size={18} />
                    Slides
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('past_question')}
                    className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all ${
                      type === 'past_question' ? 'bg-DASA-orange text-white shadow-md shadow-DASA-orange/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Archive size={18} />
                    Past Questions
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">File Upload *</label>
                <FileUpload 
                  onUpload={setFileUrl} 
                  value={fileUrl} 
                  folder="resources" 
                  accept=".pdf,.pptx,.ppt,.doc,.docx,.xls,.xlsx"
                  allowedTypesLabel="PDF, PPTX, DOC or Excel (Max. 5MB)"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Programs *</label>
                {fetchingPrograms ? (
                  <div className="h-[52px] w-full bg-gray-50 animate-pulse rounded-2xl"></div>
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
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Course Code *</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    value={course}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourse(e.target.value)}
                    placeholder="e.g. ACCT202"
                    className="pl-12 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Target Level</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-sm font-medium h-[52px] cursor-pointer"
                  >
                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Level {y}00</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all text-sm font-medium h-[52px] cursor-pointer"
                  >
                    {[1, 2].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              className="flex-1 py-6 border-2 border-gray-100 text-gray-500 rounded-2xl hover:bg-gray-50 transition-all font-bold"
            >
              Discard Changes
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading || fetchingPrograms}
              className="flex-1 py-6 bg-DASA-black hover:bg-DASA-orange text-white rounded-2xl transition-all shadow-lg shadow-DASA-black/10 flex items-center justify-center gap-2 font-bold"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {resource.id ? 'Save Changes' : 'Publish Resource'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}




