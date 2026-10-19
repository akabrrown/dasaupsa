'use client'

import { useState, useEffect } from 'react'
import TutorialCard from '@/components/sections/TutorialCard'
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getPrograms } from '@/lib/actions/programs'

interface TutorialsPageClientProps {
  initialTutorials: any[]
}

export default function TutorialsPageClient({ initialTutorials }: TutorialsPageClientProps) {
  const [search, setSearch] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('All')
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const result = await getPrograms()
        if (result?.data) setPrograms(result.data)
      } catch (err) {
        console.error('Failed to fetch programs:', err)
      }
      setLoading(false)
    }
    fetchPrograms()
  }, [])


  const filteredTutorials = initialTutorials.filter((t: any) => {
    const programName = t.program || t.programs?.name || '';
    const matchesSearch = (t.title.toLowerCase().includes(search.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
      (t.lecturer && t.lecturer.toLowerCase().includes(search.toLowerCase())));
    
    const matchesProgram = selectedProgram === 'All' || 
      (programName && programName.split(',').map((s: string) => s.trim()).includes(selectedProgram));
    
    return matchesSearch && matchesProgram;
  })

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">Video Tutorials</h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
              Access course-specific tutorials recorded by UPSA faculty and student leaders
              covering core curriculum topics.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 mt-12">
        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-10"
        >
          <div className="relative grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by topic, lecturer, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-DASA-orange/50 transition-all font-medium text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select 
                value={selectedProgram} 
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={loading}
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-DASA-orange/50 transition-all appearance-none cursor-pointer text-sm font-semibold text-gray-700 min-w-[200px]"
              >
                <option value="All">All Programs</option>
                {programs.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
              {loading && <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-DASA-orange" size={14} />}
            </div>
          </div>
        </motion.div>

        {filteredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TutorialCard {...tutorial} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No tutorials found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">Try adjusting your search or filter settings to find what you're looking for.</p>
            <button 
              onClick={() => { setSearch(''); setSelectedProgram('All'); }}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}




