'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Archive,
  CheckSquare,
  Square,
  X,
  FolderOpen,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Extracts and cleans the original filename from a Cloudinary URL,
 * stripping out the random 6-character suffix and the file extension.
 */
const getOriginalFilename = (url: string, fallback: string = 'Unknown File') => {
  if (!url) return fallback;
  try {
    const decodedUrl = decodeURIComponent(url);
    const filenameWithExt = decodedUrl.split('/').pop() || fallback;
    
    // Strip extension
    let clean = filenameWithExt.replace(/\.[^/.]+$/, "");
    
    // Strip Cloudinary 6-char random suffix (_a1b2c3)
    clean = clean.replace(/_[a-zA-Z0-9]{6}$/, "");
    
    const finalName = clean.replace(/[-_]/g, ' ').trim();
    
    // If the name looks like a random hash (long, no spaces), fallback to course title
    if (finalName.length > 15 && !finalName.includes(' ')) {
      return fallback;
    }
    
    return finalName || fallback;
  } catch {
    const simple = url.split('/').pop()?.split('.')[0]?.replace(/[-_]/g, ' ') || fallback;
    return (simple.length > 15 && !simple.includes(' ')) ? fallback : simple;
  }
}

export default function AdminAcademicBankPage() {
  const [resources, setResources] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  
  // Navigation State: null = viewing courses, string = viewing specific course
  const [currentCourse, setCurrentCourse] = useState<string | null>(null)
  // undefined = view all types in course, 'slide' | 'past_question' = specific folder
  const [currentFolderType, setCurrentFolderType] = useState<'slide' | 'past_question' | null>(null)

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
      if (!error) {
        setResources(prev => prev.filter(r => r.id !== id))
        setSelectedIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} resource(s)? This action cannot be undone.`)) return

    setBulkDeleting(true)
    try {
      const ids = Array.from(selectedIds)
      const { error } = await supabase
        .from('academic_resources')
        .delete()
        .in('id', ids)
      
      if (error) {
        console.error('[BulkDelete] Error:', error)
        alert('Failed to delete some resources. Please try again.')
      } else {
        setResources(prev => prev.filter(r => !selectedIds.has(r.id)))
        setSelectedIds(new Set())
      }
    } catch (err) {
      console.error('[BulkDelete] Unexpected error:', err)
    } finally {
      setBulkDeleting(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Filter resources based on search term
  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const titleParts = r.title.split('|').map((s: string) => s.trim().toLowerCase())
      return titleParts.some((part: string) => part.includes(searchTerm.toLowerCase())) ||
             (r.course_code && r.course_code.toLowerCase().includes(searchTerm.toLowerCase()))
    })
  }, [resources, searchTerm])

  const toggleSelectAll = () => {
    // Only select resources currently visible in the view
    let visibleResources = []
    
    const getCourseStr = (res: any) => {
      const courseName = res.title.split('|')[0].trim()
      return res.course_code ? `${courseName} (${res.course_code})` : (courseName || 'Uncategorized')
    }

    if (searchTerm) {
       visibleResources = filteredResources
    } else if (currentCourse && currentFolderType) {
       visibleResources = filteredResources.filter(r => getCourseStr(r) === currentCourse && r.type === currentFolderType)
    } else if (currentCourse) {
       visibleResources = filteredResources.filter(r => getCourseStr(r) === currentCourse)
    } else {
       visibleResources = filteredResources
    }

    const allVisibleSelected = visibleResources.every(r => selectedIds.has(r.id))
    
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (allVisibleSelected) {
        // Deselect all visible
        visibleResources.forEach(r => next.delete(r.id))
      } else {
        // Select all visible
        visibleResources.forEach(r => next.add(r.id))
      }
      return next
    })
  }

  // Grouping Logic
  const groupedByCourse = useMemo(() => {
    const groups: Record<string, any[]> = {}
    const getCourseStr = (res: any) => {
      const courseName = res.title.split('|')[0].trim()
      return res.course_code ? `${courseName} (${res.course_code})` : (courseName || 'Uncategorized')
    }
    filteredResources.forEach(res => {
      const course = getCourseStr(res)
      if (!groups[course]) groups[course] = []
      groups[course].push(res)
    })
    return groups
  }, [filteredResources])

  const isSelecting = selectedIds.size > 0

  // Render navigation breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-6 bg-gray-50 p-4 rounded-2xl w-fit">
        <button 
          onClick={() => { setCurrentCourse(null); setCurrentFolderType(null); }}
          className="hover:text-DASA-orange transition-colors flex items-center gap-1"
        >
          <FolderOpen size={16} />
          All Courses
        </button>
        
        {currentCourse && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <button 
              onClick={() => setCurrentFolderType(null)}
              className={`transition-colors ${!currentFolderType ? 'text-DASA-black' : 'hover:text-DASA-orange'}`}
            >
              {currentCourse}
            </button>
          </>
        )}

        {currentFolderType && (
          <>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-DASA-black capitalize pb-0.5">
              {currentFolderType === 'slide' ? 'Slides' : 'Past Questions'}
            </span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black">Academic Bank</h1>
          <p className="text-gray-500 font-medium">Manage lecture slides and past examination questions</p>
        </div>
        <Button 
          onClick={() => setEditing({})} 
          className="bg-DASA-black hover:bg-DASA-orange text-white px-6 py-6 rounded-2xl font-bold transition-all shadow-lg shadow-DASA-black/20 flex items-center gap-2 shrink-0"
        >
          <Plus size={20} />
          Add Resource
        </Button>
      </div>

      {/* Search + Select All bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or course code..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              if (e.target.value) {
                // If searching, flatten view to show results immediately
                setCurrentCourse(null)
                setCurrentFolderType(null)
              }
            }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-DASA-orange transition-all outline-none text-sm font-medium"
          />
        </div>
        {(currentCourse || searchTerm) && filteredResources.length > 0 && (
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 hover:border-DASA-orange hover:text-DASA-orange transition-all shadow-sm shrink-0"
          >
            <CheckSquare size={16} /> 
            Toggle Select All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
          <Loader2 className="animate-spin text-DASA-black" size={40} />
          <p className="font-bold">Loading document repository...</p>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="space-y-6">
          
          {(!searchTerm || currentCourse) && renderBreadcrumbs()}

          {/* VIEW 1: All Courses Folders */}
          {!currentCourse && !searchTerm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(groupedByCourse).map(([course, items]) => (
                <Card 
                  key={course}
                  onClick={() => setCurrentCourse(course)}
                  className="group hover:border-DASA-orange hover:shadow-lg transition-all duration-300 rounded-[20px] cursor-pointer bg-white border-2 border-transparent hover:bg-orange-50/10"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-DASA-black rounded-xl group-hover:scale-110 transition-transform">
                        <FolderOpen size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-DASA-black leading-tight pr-4" title={course}>{course}</h3>
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{items.length} FILES</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-DASA-orange transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* VIEW 2: Inside a Course (Shows Slides/Past Qs folders) */}
          {currentCourse && !currentFolderType && !searchTerm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <Card 
                onClick={() => setCurrentFolderType('slide')}
                className="group hover:border-blue-300 hover:shadow-lg transition-all duration-300 rounded-[20px] cursor-pointer bg-white border-2 border-transparent"
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-4 bg-blue-50 text-DASA-black rounded-2xl group-hover:scale-110 transition-transform">
                    <Layers size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-DASA-black">Slides</h3>
                    <p className="text-xs text-gray-500 font-bold mt-1">
                      {groupedByCourse[currentCourse]?.filter(r => r.type === 'slide').length || 0} files
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                onClick={() => setCurrentFolderType('past_question')}
                className="group hover:border-orange-300 hover:shadow-lg transition-all duration-300 rounded-[20px] cursor-pointer bg-white border-2 border-transparent"
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-4 bg-orange-50 text-DASA-orange rounded-2xl group-hover:scale-110 transition-transform">
                    <Archive size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-DASA-black">Past Questions</h3>
                    <p className="text-xs text-gray-500 font-bold mt-1">
                      {groupedByCourse[currentCourse]?.filter(r => r.type === 'past_question').length || 0} files
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* VIEW 3: Files inside a specific Type Folder OR Search Results */}
          {((currentCourse && currentFolderType) || searchTerm) && (
            <div className="space-y-4">
              {currentCourse && currentFolderType && !searchTerm && (
                <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-2xl mb-2">
                  <div className="text-sm font-bold text-gray-600 flex items-center gap-2">
                    <FolderOpen size={16} className="text-gray-400" />
                    Adding to: <span className="text-DASA-black">{currentCourse} / {currentFolderType === 'slide' ? 'Slides' : 'Past Questions'}</span>
                  </div>
                  <Button 
                    onClick={() => {
                      const sampleResource = filteredResources.find(r => {
                        const getCourseStr = (res: any) => {
                          const courseName = res.title.split('|')[0].trim()
                          return res.course_code ? `${courseName} (${res.course_code})` : (courseName || 'Uncategorized')
                        }
                        return getCourseStr(r) === currentCourse
                      })
                      setEditing({
                        course_code: sampleResource?.course_code || '',
                        title: sampleResource?.title.split('|')[0].trim() || '',
                        type: currentFolderType,
                        program: sampleResource?.program || '',
                        program_id: sampleResource?.program_id || null,
                        year: sampleResource?.year || 1,
                        semester: sampleResource?.semester || 1
                      })
                    }}
                    size="sm"
                    className="bg-DASA-black hover:bg-DASA-orange text-white rounded-xl text-xs flex items-center gap-2 h-9 px-4"
                  >
                    <Plus size={14} /> Add {currentFolderType === 'slide' ? 'Slide' : 'Past Question'}
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredResources
                  .filter(r => {
                    if (searchTerm) return true; // Show all matching search
                    const getCourseStr = (res: any) => {
                      const courseName = res.title.split('|')[0].trim()
                      return res.course_code ? `${courseName} (${res.course_code})` : (courseName || 'Uncategorized')
                    }
                    return getCourseStr(r) === currentCourse && r.type === currentFolderType
                  })
                  .map((res, index) => {
                    const isSelected = selectedIds.has(res.id)
                    return (
                      <motion.div
                        key={res.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={`group border-2 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden bg-white h-full flex flex-col cursor-pointer ${
                            isSelected 
                              ? 'border-red-300 bg-red-50/30' 
                              : 'border-transparent'
                          }`}
                          onClick={() => toggleSelect(res.id)}
                        >
                          <CardContent className="p-6 grow flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-1 rounded-lg transition-all ${isSelected ? 'text-red-500 scale-110' : 'text-gray-300 group-hover:text-gray-400'}`}>
                                  {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                </div>
                                <div className={`p-3 rounded-2xl ${res.type === 'slide' ? 'bg-blue-50 text-DASA-black' : 'bg-amber-50 text-DASA-orange'}`}>
                                  {res.type === 'slide' ? <Layers size={24} /> : <Archive size={24} />}
                                </div>
                              </div>
                              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                                {res.type === 'slide' ? 'Slide' : 'Past Q.'}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-DASA-black mb-2 line-clamp-1 uppercase group-hover:text-DASA-orange transition-colors" title={res.title.includes('|') ? res.title.split('|')[1].trim() : getOriginalFilename(res.file_url, res.title)}>
                              {res.title.includes('|') ? res.title.split('|')[1].trim() : getOriginalFilename(res.file_url, res.title)}
                            </h3>
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 mb-6">
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                <BookOpen size={12} className="text-DASA-orange" />
                                {res.course_code}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                <span className="w-1 h-1 rounded-full bg-DASA-black/30"></span>
                                Level {res.year}00
                              </div>
                            </div>

                            {res.file_url && (
                              <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText size={16} className="text-gray-400 shrink-0" />
                                  <span className="text-[10px] text-gray-500 truncate font-medium">{getOriginalFilename(res.file_url)}</span>
                                </div>
                                <FileDown size={14} className="text-gray-300 group-hover:text-DASA-black transition-colors" />
                              </div>
                            )}
                            
                            <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); setEditing(res) }}
                                className="flex-1 rounded-xl font-bold text-xs border-gray-100 text-gray-500 hover:text-DASA-black hover:border-DASA-black"
                              >
                                <Edit3 size={14} className="mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleDelete(res.id) }}
                                className="rounded-xl font-bold text-xs border-gray-100 text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                
                {filteredResources.filter(r => {
                  const getCourseStr = (res: any) => {
                    const courseName = res.title.split('|')[0].trim()
                    return res.course_code ? `${courseName} (${res.course_code})` : (courseName || 'Uncategorized')
                  }
                  return getCourseStr(r) === currentCourse && r.type === currentFolderType
                }).length === 0 && !searchTerm && (
                  <div className="col-span-full py-12 text-center text-gray-400 font-bold bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    No files found in this folder.
                  </div>
                )}
              </AnimatePresence>
              </div>
            </div>
          )}

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

      {/* Floating Bulk Delete Toolbar */}
      <AnimatePresence>
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-4 px-6 py-4 bg-DASA-black text-white rounded-2xl shadow-2xl shadow-black/30 w-max">
              <span className="text-sm font-bold">
                {selectedIds.size} selected
              </span>
              <div className="w-px h-6 bg-white/20" />
              <button
                onClick={() => setSelectedIds(new Set())}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors"
              >
                <X size={14} />
                Clear
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-red-500/30"
              >
                {bulkDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
