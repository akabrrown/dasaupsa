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
    <div className="bg-light-orange min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-linear-to-br from-DASA-orange to-[#FF8C61] py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 skew-x-12 translate-x-20"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-DASA-black">Video Tutorials</h1>
            <p className="text-DASA-black/80 text-lg">
              Unlock your potential with our curated collection of expert-led tutorials 
              covering every aspect of your curriculum.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 md:p-4 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 mb-12 relative z-20"
        >
          <div className="relative grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by topic, lecturer, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-DASA-orange transition-all font-medium"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={selectedProgram} 
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={loading}
                className="pl-10 pr-10 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-DASA-orange transition-all appearance-none cursor-pointer font-bold text-gray-700 min-w-[200px]"
              >
                <option value="All">All Programs</option>
                {programs.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
              {loading && <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 animate-spin text-DASA-orange" size={16} />}
            </div>
          </div>
        </motion.div>

        {filteredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TutorialCard {...tutorial} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-600">No tutorials found</h3>
            <p className="text-gray-400">Try adjusting your search or filter settings.</p>
            <button 
              onClick={() => { setSearch(''); setSelectedProgram('All'); }}
              className="mt-6 px-6 py-2 bg-DASA-black text-white rounded-lg hover:bg-DASA-orange transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}




