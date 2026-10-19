'use client'

import { useState, useEffect } from 'react'
import ResourceCard from '@/components/sections/ResourceCard'
import { ResourceCardSkeleton } from '@/components/ui/Skeletons'
import { Search, Filter, Book, FileText, DownloadCloud, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBookmarkedResources } from '@/lib/actions/bookmarks'
import { getPrograms } from '@/lib/actions/programs'

type ResourceType = 'slide' | 'past_question'

interface AcademicBankPageClientProps {
  initialResources: any[]
}

export default function AcademicBankPageClient({ initialResources }: AcademicBankPageClientProps) {
  const [search, setSearch] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [programs, setPrograms] = useState<any[]>([])
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Navigation State: null = viewing courses, string = viewing specific course
  const [currentCourse, setCurrentCourse] = useState<string | null>(null)
  // null = view types in course, 'slide' | 'past_question' = specific folder
  const [currentFolderType, setCurrentFolderType] = useState<ResourceType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [bookmarksRes, programsRes] = await Promise.all([
        getBookmarkedResources(),
        getPrograms()
      ])
      if (bookmarksRes.data) setBookmarkedIds(bookmarksRes.data)
      if (programsRes.data) setPrograms(programsRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredResources = initialResources.filter((r: any) => {
    const p = r.programs;
    const programString = r.program || (Array.isArray(p) ? p[0]?.name : p?.name) || '';
    const programNames = programString.split(',').map((s: string) => s.trim().toLowerCase());
    const normalizedSelected = selectedProgram.trim().toLowerCase();
    
    // Search matches title parts, course code, or program name
    const titleParts = r.title.split('|').map((s: string) => s.trim().toLowerCase())
    const matchesSearch = search === '' || 
                          titleParts.some((part: string) => part.includes(search.toLowerCase())) || 
                          (r.course_code && r.course_code.toLowerCase().includes(search.toLowerCase())) ||
                          programNames.some((name: string) => name.includes(search.toLowerCase()));
    
    const matchesProgram = normalizedSelected === 'all' || programNames.includes(normalizedSelected);
    const matchesLevel = selectedLevel === 'All' || r.year?.toString() === selectedLevel;
    const matchesSemester = selectedSemester === 'All' || r.semester?.toString() === selectedSemester;
    
    return matchesSearch && matchesProgram && matchesLevel && matchesSemester;
  })

  // Grouping Logic
  const groupedByCourse = filteredResources.reduce((groups: Record<string, any[]>, res) => {
    const getCourseStr = (r: any) => {
      const courseName = r.title.split('|')[0].trim()
      return r.course_code ? `${courseName} (${r.course_code})` : (courseName || 'Uncategorized')
    }
    const course = getCourseStr(res)
    if (!groups[course]) groups[course] = []
    groups[course].push(res)
    return groups
  }, {})

  // Render navigation breadcrumbs
  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-8 bg-white/50 border-2 border-white p-4 rounded-[20px] w-fit shadow-xs backdrop-blur-sm">
        <button 
          onClick={() => { setCurrentCourse(null); setCurrentFolderType(null); }}
          className="hover:text-DASA-orange transition-colors flex items-center gap-2"
        >
          <div className="p-1.5 bg-white rounded-lg shadow-xs text-DASA-black">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
          </div>
          All Courses
        </button>
        
        {currentCourse && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="m9 18 6-6-6-6"/></svg>
            <button 
              onClick={() => setCurrentFolderType(null)}
              className={`transition-all ${!currentFolderType ? 'text-DASA-black font-extrabold bg-white px-3 py-1 rounded-xl shadow-xs' : 'hover:text-DASA-orange px-3 py-1'}`}
            >
              {currentCourse}
            </button>
          </>
        )}

        {currentFolderType && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="m9 18 6-6-6-6"/></svg>
            <span className="text-DASA-black font-extrabold bg-white px-3 py-1 rounded-xl shadow-xs capitalize">
              {currentFolderType === 'slide' ? 'Slides' : 'Past Questions'}
            </span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 tracking-tight">Academic Bank</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-xl font-medium">
              Your centralized repository for all academic materials. Download slides, 
              past questions, and more to boost your academic performance.
            </p>
          </div>
          <div className="hidden md:flex p-3 bg-gray-50 rounded-xl border border-gray-100">
            <DownloadCloud size={28} className="text-gray-400" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Filters</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Program</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <select 
                    value={selectedProgram} 
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-DASA-orange/50 transition-all appearance-none cursor-pointer text-sm font-semibold text-gray-700"
                  >
                    <option value="All">All Programs</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Level</label>
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-DASA-orange/50 transition-all appearance-none cursor-pointer text-sm font-semibold text-gray-700"
                >
                  <option value="All">All Levels</option>
                  {[1, 2, 3, 4].map(y => (
                    <option key={y} value={y}>Level {y}00</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Semester</label>
                <select 
                  value={selectedSemester} 
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-DASA-orange/50 transition-all appearance-none cursor-pointer text-sm font-semibold text-gray-700"
                >
                  <option value="All">All Semesters</option>
                  {[1, 2].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grow">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, course code, or program..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                if (e.target.value) {
                  setCurrentCourse(null)
                  setCurrentFolderType(null)
                }
              }}
              className="w-full pl-11 pr-4 py-3 bg-white shadow-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-DASA-orange/50 transition-all font-medium text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
               {Array.from({ length: 8 }).map((_, i) => (
                 <ResourceCardSkeleton key={i} />
               ))}
             </div>
          ) : (
            <>
              {filteredResources.length > 0 && renderBreadcrumbs()}

              <AnimatePresence mode="wait">
                {filteredResources.length > 0 ? (
                  <>
                    {/* VIEW 1: All Courses Folders (Shown if no course is selected) */}
                    {!currentCourse && (
                      <motion.div 
                        key="courses-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      >
                        {Object.entries(groupedByCourse).map(([course, items]) => (
                          <div
                            key={course}
                            onClick={() => setCurrentCourse(course)}
                            className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-DASA-orange/40 relative overflow-hidden flex flex-col justify-between min-h-[140px]"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="text-gray-400 group-hover:text-DASA-orange transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
                              </div>
                              <div className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-gray-100">
                                {items.length} Files
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-2 group-hover:text-DASA-orange transition-colors" title={course}>{course}</h3>
                              <p className="text-gray-400 text-xs">Course Folder</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* VIEW 2: Inside a Course (Shows Slides/Past Qs folders) */}
                    {currentCourse && !currentFolderType && (
                      <motion.div 
                        key="types-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl"
                      >
                        <div 
                          onClick={() => setCurrentFolderType('slide')}
                          className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-DASA-orange/40 flex items-center gap-5"
                        >
                          <div className="p-3 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-DASA-black group-hover:text-white transition-colors">
                            <Book size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-DASA-orange transition-colors">Lecture Slides</h3>
                            <div className="text-gray-500 text-xs font-medium">
                              {groupedByCourse[currentCourse]?.filter(r => r.type === 'slide').length || 0} Files
                            </div>
                          </div>
                        </div>

                        <div 
                          onClick={() => setCurrentFolderType('past_question')}
                          className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-DASA-orange/40 flex items-center gap-5"
                        >
                          <div className="p-3 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-orange-50 group-hover:text-DASA-orange transition-colors">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-DASA-orange transition-colors">Past Questions</h3>
                            <div className="text-gray-500 text-xs font-medium">
                              {groupedByCourse[currentCourse]?.filter(r => r.type === 'past_question').length || 0} Files
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* VIEW 3: Files inside a specific Type Folder */}
                    {(currentCourse && currentFolderType) && (
                      <motion.div 
                        key="files-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                      >
                        {filteredResources
                          .filter(r => {
                            const getCourseStr = (res: any) => {
                              const courseName = res.title.split('|')[0].trim()
                              return res.course_code ? `${courseName} (${res.course_code})` : (courseName || 'Uncategorized')
                            }
                            return getCourseStr(r) === currentCourse && r.type === currentFolderType
                          })
                          .map((resource, index) => {
                            const p = resource.programs;
                            const programName = (Array.isArray(p) ? p[0]?.name : p?.name) || resource.program;
                            return (
                              <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                              >
                                <ResourceCard 
                                  {...resource} 
                                  program={programName}
                                  course_code={resource.course_code} 
                                  isBookmarked={bookmarkedIds.includes(resource.id)}
                                />
                              </motion.div>
                            )
                          })
                        }
                        
                        {filteredResources.filter(r => {
                          const getCourseStr = (res: any) => {
                            const courseName = res.title.split('|')[0].trim()
                            return res.course_code ? `${courseName} (${res.course_code})` : (courseName || 'Uncategorized')
                          }
                          return getCourseStr(r) === currentCourse && r.type === currentFolderType
                        }).length === 0 && !search && (
                          <div className="col-span-full py-16 text-center text-gray-500 text-sm font-medium bg-white rounded-xl border border-dashed border-gray-300">
                            No files found in this folder.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300"
                  >
                    <div className="mb-4 inline-block p-4 bg-gray-50 rounded-full">
                      <Book size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No resources found</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                      We couldn't find any resources matching your criteria.
                    </p>
                    <button 
                      onClick={() => { setSearch(''); setSelectedProgram('All'); setSelectedLevel('All'); setSelectedSemester('All'); setCurrentCourse(null); setCurrentFolderType(null); }}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  )
}




