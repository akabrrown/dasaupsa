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
  const [course, setCourse] = useState(resource.course_code || '')
  const [selectedProgramNames, setSelectedProgramNames] = useState<string[]>(() => {
    if (resource.program) return resource.program.split(',').map((s: string) => s.trim())
    return []
  })
  const [programs, setPrograms] = useState<any[]>([])
  const [year, setYear] = useState(resource.year || '1')
  const [semester, setSemester] = useState(resource.semester || '1')
  const [type, setType] = useState(resource.type || 'slide')
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string, name: string }[]>(
    resource.file_url ? [{ url: resource.file_url, name: 'Current File' }] : []
  )
  const [loading, setLoading] = useState(false)
  const [fetchingPrograms, setFetchingPrograms] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Split legacy or unified title
  const parts = (resource.title || '').split('|').map((s: string) => s.trim())
  const initialCourseName = parts[0] || ''
  const initialDocTitle = parts[1] || ''

  const [title, setTitle] = useState(initialCourseName)
  const [documentTitle, setDocumentTitle] = useState(initialDocTitle)

  const isBulk = !resource.id && uploadedFiles.length > 1

  useEffect(() => {
    async function loadPrograms() {
      try {
        const { data, error } = await getPrograms()
        if (error) {
          console.error('[ResourceForm] Failed to load programs:', error)
        }
        if (data && data.length > 0) {
          setPrograms(data)
          // If editing and we don't have program names but we have program_id, recover name
          if (resource.id && selectedProgramNames.length === 0 && resource.program_id) {
            const matched = data.find(p => p.id === resource.program_id)
            if (matched) setSelectedProgramNames([matched.name])
          }
        } else {
          console.warn('[ResourceForm] No programs found in database')
        }
      } catch (err) {
        console.error('[ResourceForm] Error loading programs:', err)
      }
      setFetchingPrograms(false)
    }
    loadPrograms()
  }, [])

  const handleSave = async () => {
    const isBulk = !resource.id && uploadedFiles.length > 1

    // For bulk uploads, title is optional (filenames are used)
    if (!isBulk && !title) {
      setError('Please fill in the Course Name.')
      return
    }
    if (!course) {
      setError('Please fill in the Course Code.')
      return
    }
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one file.')
      return
    }
    if (selectedProgramNames.length === 0) {
      setError('Please select at least one Program.')
      return
    }

    setLoading(true)
    setError(null)

    // Resolve primary program ID
    const primaryProgram = programs.find(p => selectedProgramNames.includes(p.name))
    const primaryProgramId = primaryProgram ? primaryProgram.id : null

    try {
      if (resource.id) {
        // Single update mode
        // Unified title storage: "Course Name | Document Title"
        // Aggressively ensure we have a document title if not provided
        const fallbackDocTitle = uploadedFiles[0]?.name?.replace(/\.[^/.]+$/, "") || 'Document'
        const finalDocTitle = documentTitle.trim() || fallbackDocTitle
        const finalTitle = `${title.trim()} | ${finalDocTitle}`

        const payload = {
          title: finalTitle,
          course_code: course,
          program_id: primaryProgramId,
          program: selectedProgramNames.join(', '),
          year: parseInt(year.toString()),
          semester: parseInt(semester.toString()),
          type,
          file_url: uploadedFiles[0]?.url,
        }
        console.log('[ResourceForm] Updating resource:', payload)
        const { error } = await supabase
          .from('academic_resources')
          .update(payload)
          .eq('id', resource.id)
        if (error) throw error
      } else {
        // Bulk insert mode
        // Bulk insert mode - each file gets "Course Name | Filename"
        const payloads = uploadedFiles.map(file => {
          const fileNameNoExt = file.name.replace(/\.[^/.]+$/, "")
          const finalTitle = `${title.trim()} | ${fileNameNoExt}`
          
          return {
            title: finalTitle,
            course_code: course,
            program_id: primaryProgramId,
            program: selectedProgramNames.join(', '),
            year: parseInt(year.toString()),
            semester: parseInt(semester.toString()),
            type,
            file_url: file.url,
            created_at: new Date().toISOString()
          }
        })

        console.log('[ResourceForm] Inserting resources:', payloads)
        const { error } = await supabase
          .from('academic_resources')
          .insert(payloads)
        if (error) throw error
      }
      await revalidateData('academic_resources')
      onSave()
    } catch (err: any) {
      console.error('[ResourceForm] Save error:', err)
      setError(err.message || 'Failed to save resource(s).')
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

              {!isBulk && uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Document Title</label>
                  <Input
                    value={documentTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocumentTitle(e.target.value)}
                    placeholder="e.g. Chapter 1 Notes (Optional)"
                    className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                  />
                  <p className="text-[10px] text-gray-400 ml-1 font-medium italic">If empty, defaults to filename or course name.</p>
                </div>
              )}

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
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                  {resource.id ? 'File Upload *' : 'Bulk File Upload *'}
                </label>
                <FileUpload 
                  onUpload={(url, fileName) => {
                    const cleanName = fileName?.replace(/\.[^/.]+$/, "") || 'Uploaded File'
                    setUploadedFiles([{ url, name: fileName || 'Uploaded File' }])
                    if (!documentTitle) setDocumentTitle(cleanName)
                  }} 
                  onMultiUpload={(files) => setUploadedFiles(prev => [...prev, ...files])}
                  value={resource.id ? uploadedFiles[0]?.url : undefined} 
                  multiple={!resource.id}
                  folder={`resources/${course || 'general'}/${type === 'slide' ? 'slides' : 'past_questions'}`}
                  accept=".pdf,.pptx,.ppt,.doc,.docx,.xls,.xlsx"
                  allowedTypesLabel="PDF, PPTX, DOC or Excel (Max. 10MB)"
                />
                
                {uploadedFiles.length > 0 && !resource.id && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">Pending Files ({uploadedFiles.length})</p>
                    <div className="max-h-[120px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group animate-in fade-in slide-in-from-bottom-2">
                          <span className="text-xs font-bold text-gray-600 truncate max-w-[180px]">{file.name}</span>
                          <button 
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Programs *</label>
                {fetchingPrograms ? (
                  <div className="h-[52px] w-full bg-gray-50 animate-pulse rounded-2xl"></div>
                ) : programs.length === 0 ? (
                  <p className="text-xs text-red-500 font-bold p-3 bg-red-50 rounded-xl">
                    No programs found. Please add programs in the Programs Manager first.
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




