'use client'

import ProfileCard from '@/components/sections/ProfileCard'
import { motion } from 'framer-motion'
import { Target, Eye } from 'lucide-react'

interface AboutPageClientProps {
  profiles: any[]
}

export default function AboutPageClient({ profiles }: AboutPageClientProps) {
  const authorities = profiles.filter(p => p.role === 'Authority')
  const executives = profiles.filter(p => p.role === 'Executive')

  return (
    <div className="bg-light-orange min-h-screen">
      {/* Hero Section */}
      <section className="bg-DASA-orange py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 skew-x-12 translate-x-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 text-DASA-black"
          >
            About DASA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-DASA-black/80 max-w-2xl leading-relaxed"
          >
           Learn about the Department of Accounting at UPSA and meet the DASA executives and department authorities.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-[32px] shadow-xl border-t-4 border-DASA-orange"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} className="text-DASA-black" />
              </div>
              <h2 className="text-2xl font-bold text-DASA-black mb-4">Our Mission</h2>
              <p className="text-gray-500 leading-relaxed">
                Now emphasizes empowering accounting students with practical skills, professional development opportunities, ethical leadership, and bridging academic excellence with real-world accounting practices.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-[32px] shadow-xl border-t-4 border-DASA-orange"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Eye size={28} className="text-DASA-black" />
              </div>
              <h2 className="text-2xl font-bold text-DASA-black mb-4">Our Vision</h2>
              <p className="text-gray-500 leading-relaxed">
                Now positions DASA as the premier accounting student association producing globally competitive professionals who lead ethical business practices and contribute to Ghana's economic development through accounting excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-DASA-black mb-4">Patrons & Authorities</h2>
            <div className="w-20 h-1 bg-DASA-orange mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {authorities.length > 0 ? (
              authorities.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProfileCard {...profile} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400 italic">
                Authorities information will be updated soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Executive Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-DASA-black mb-4">Association Executives</h2>
            <div className="w-20 h-1 bg-DASA-orange mx-auto rounded-full"></div>
            <p className="text-gray-500 mt-6 max-w-xl mx-auto uppercase tracking-widest text-xs font-bold">
              The dedicated team leading DASA through the current academic year.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {executives.length > 0 ? (
              executives.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProfileCard {...profile} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400 italic">
                Executive team list is being finalized.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}




