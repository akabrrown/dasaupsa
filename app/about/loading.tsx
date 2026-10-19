import { ProfileCardSkeleton } from '@/components/ui/Skeletons'
import { Target, Eye } from 'lucide-react'

export default function LoadingAbout() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
              About DASA
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
             Learn about the Department of Accounting at UPSA and meet the DASA executives and department authorities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-200 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Target size={24} className="text-gray-900" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                Empowering accounting students with practical skills, professional development opportunities, ethical leadership, and bridging academic excellence with real-world accounting practices.
              </p>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-200 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-6">
                <Eye size={24} className="text-gray-900" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                To position DASA as the premier accounting student association producing globally competitive professionals who lead ethical business practices and contribute to Ghana's economic development through accounting excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-16 md:py-24 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Patrons & Authorities</h2>
            <p className="text-gray-500 font-medium">The leadership guiding the Department of Accounting.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Executive Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Association Executives</h2>
            <p className="text-gray-500 font-medium">The dedicated student team leading DASA through the current academic year.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
