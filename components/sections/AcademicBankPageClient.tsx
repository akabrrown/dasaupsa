'use client'

import { useState, useEffect } from 'react'
import ResourceCard from '@/components/sections/ResourceCard'
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
                          titleParts.some(part => part.includes(search.toLowerCase())) || 
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
    <div className="bg-light-orange min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-linear-to-br from-DASA-orange to-[#FF8C61] py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 skew-x-12 translate-x-20"></div>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-block p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
          >
            <DownloadCloud size={40} className="text-DASA-black" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-DASA-black">Academic Bank</h1>
          <p className="text-DASA-black/80 text-lg max-w-2xl mx-auto font-medium">
            Your centralized repository for all academic materials. Download slides, 
            past questions, and more to boost your academic performance.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* Controls Bar */}
        <div className="bg-white p-4 md:p-6 rounded-[32px] shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all font-medium text-DASA-black placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative grow md:grow-0">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={selectedProgram} 
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-10 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all appearance-none cursor-pointer font-bold text-gray-700 min-w-[180px]"
                >
                  <option value="All">All Programs</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative grow md:grow-0 w-1/2 md:w-auto">
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  disabled={loading}
                  className="w-full pl-5 pr-10 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all appearance-none cursor-pointer font-bold text-gray-700 min-w-[130px]"
                >
                  <option value="All">All Levels</option>
                  {[1, 2, 3, 4].map(y => (
                    <option key={y} value={y}>Level {y}00</option>
                  ))}
                </select>
              </div>

              <div className="relative grow md:grow-0 w-1/2 md:w-auto">
                <select 
                  value={selectedSemester} 
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  disabled={loading}
                  className="w-full pl-5 pr-10 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all appearance-none cursor-pointer font-bold text-gray-700 min-w-[140px]"
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

        {/* Results Section */}
        <div className="mt-12">
          {loading ? (
             <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-DASA-orange" size={48} />
             </div>
          ) : (
            <>
              {(!search || currentCourse) && filteredResources.length > 0 && renderBreadcrumbs()}

              <AnimatePresence mode="wait">
                {filteredResources.length > 0 ? (
                  <>
                    {/* VIEW 1: All Courses Folders */}
                    {!currentCourse && !search && (
                      <motion.div 
                        key="courses-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                      >
                        {Object.entries(groupedByCourse).map(([course, items]) => (
                          <div
                            key={course}
                            onClick={() => setCurrentCourse(course)}
                            className="group bg-white rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:shadow-DASA-orange/10 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-DASA-orange/20 relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-blue-50 to-transparent rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                            <div className="flex items-start justify-between mb-8">
                              <div className="p-4 bg-blue-50 text-DASA-black rounded-2xl group-hover:-rotate-6 transition-transform">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
                              </div>
                              <div className="bg-gray-50 text-gray-500 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                {items.length} Files
                              </div>
                            </div>
                            <h3 className="font-extrabold text-2xl text-DASA-black mb-1 pr-4" title={course}>{course}</h3>
                            <p className="text-gray-400 font-medium text-sm">Course Folder</p>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* VIEW 2: Inside a Course (Shows Slides/Past Qs folders) */}
                    {currentCourse && !currentFolderType && !search && (
                      <motion.div 
                        key="types-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl"
                      >
                        <div 
                          onClick={() => setCurrentFolderType('slide')}
                          className="group bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-100 relative overflow-hidden flex items-center gap-6"
                        >
                          <div className="absolute right-0 top-0 w-40 h-40 bg-linear-to-br from-transparent to-blue-50 rounded-bl-full -z-10"></div>
                          <div className="p-5 bg-blue-50 text-DASA-black rounded-[24px] group-hover:scale-110 transition-transform">
                            <Book size={40} />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-3xl text-DASA-black mb-2">Slides</h3>
                            <div className="inline-flex py-1 px-3 bg-gray-50 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider">
                              {groupedByCourse[currentCourse]?.filter(r => r.type === 'slide').length || 0} Files
                            </div>
                          </div>
                        </div>

                        <div 
                          onClick={() => setCurrentFolderType('past_question')}
                          className="group bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-orange-100 relative overflow-hidden flex items-center gap-6"
                        >
                          <div className="absolute right-0 top-0 w-40 h-40 bg-linear-to-br from-transparent to-orange-50 rounded-bl-full -z-10"></div>
                          <div className="p-5 bg-orange-50 text-DASA-orange rounded-[24px] group-hover:scale-110 transition-transform">
                            <FileText size={40} />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-3xl text-DASA-black mb-2">Past Qs</h3>
                            <div className="inline-flex py-1 px-3 bg-gray-50 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider">
                              {groupedByCourse[currentCourse]?.filter(r => r.type === 'past_question').length || 0} Files
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* VIEW 3: Files inside a specific Type Folder OR Search Results */}
                    {((currentCourse && currentFolderType) || search) && (
                      <motion.div 
                        key="files-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                        {filteredResources
                          .filter(r => {
                            if (search) return true; // Show all matching search
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
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
                          <div className="col-span-full py-16 text-center text-gray-400 font-bold bg-white rounded-[40px] border-2 border-dashed border-gray-100">
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
                    className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100"
                  >
                    <div className="mb-6 inline-block p-8 bg-gray-50 rounded-full">
                      <Book size={64} className="text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No resources found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto font-medium">
                      We couldn't find any resources matching your criteria.
                    </p>
                    <button 
                      onClick={() => { setSearch(''); setSelectedProgram('All'); setSelectedLevel('All'); setSelectedSemester('All'); setCurrentCourse(null); setCurrentFolderType(null); }}
                      className="mt-8 px-10 py-4 bg-DASA-black text-white rounded-2xl font-bold hover:bg-DASA-orange transition-all shadow-lg hover:-translate-y-1"
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




