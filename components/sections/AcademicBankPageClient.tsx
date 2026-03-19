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
  const [activeTab, setActiveTab] = useState<ResourceType>('slide')
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [programs, setPrograms] = useState<any[]>([])
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

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
    // Determine the full list of assigned programs for this resource
    const p = r.programs;
    
    // r.program is the comma-separated string from the new multi-select logic
    // p?.name might be the single primary program from the left join
    const programString = r.program || (Array.isArray(p) ? p[0]?.name : p?.name) || '';
    
    // Split into an array of normalized names
    const programNames = programString.split(',').map((s: string) => s.trim().toLowerCase());
    
    const normalizedSelected = selectedProgram.trim().toLowerCase();
    
    const matchesTab = (activeTab === 'slide' ? r.type === 'slide' : r.type === 'past_question');
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          (r.course_code && r.course_code.toLowerCase().includes(search.toLowerCase())) ||
                          programNames.some((name: string) => name.includes(search.toLowerCase()));
    
    const matchesProgram = normalizedSelected === 'all' || programNames.includes(normalizedSelected);
    const matchesLevel = selectedLevel === 'All' || r.year?.toString() === selectedLevel;
    const matchesSemester = selectedSemester === 'All' || r.semester?.toString() === selectedSemester;
    
    return matchesTab && matchesSearch && matchesProgram && matchesLevel && matchesSemester;
  })

  const tabs = [
    { id: 'slide', label: 'Lecture Slides', icon: Book },
    { id: 'past_question', label: 'Past Questions', icon: FileText }
  ]

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

      <div className="container mx-auto px-4 -mt-12">
        {/* Controls Bar */}
        <div className="bg-white p-4 md:p-6 rounded-[32px] shadow-xl space-y-6 relative z-20">
          {/* Tabs */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ResourceType)}
                className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 rounded-xl font-bold text-xs md:text-sm transition-all grow md:grow-0 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-DASA-black shadow-md' 
                    : 'text-gray-500 hover:text-DASA-black'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'slide' ? 'slides' : 'past questions'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all font-medium"
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

        {/* Results Grid */}
        <div className="mt-12">
          {loading ? (
             <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-DASA-orange" size={48} />
             </div>
          ) : (
          <AnimatePresence mode="wait">
            {filteredResources.length > 0 ? (
              <motion.div 
                key={activeTab + selectedProgram + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredResources.map((resource, index) => {
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
                })}
              </motion.div>
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
                  We couldn't find any {activeTab === 'slide' ? 'slides' : 'past questions'} matching your criteria.
                </p>
                <button 
                  onClick={() => { setSearch(''); setSelectedProgram('All'); setSelectedLevel('All'); setSelectedSemester('All'); }}
                  className="mt-8 px-10 py-4 bg-DASA-black text-white rounded-2xl font-bold hover:bg-DASA-orange transition-all shadow-lg hover:-translate-y-1"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}




