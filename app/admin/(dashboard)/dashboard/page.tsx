'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Video, 
  FileText, 
  Megaphone, 
  LayoutDashboard, 
  PlusCircle, 
  ExternalLink,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState({
    announcements: 0,
    tutorials: 0,
    resources: 0,
    activities: 0,
    profiles: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStatsAndRecent() {
      try {
        setLoading(true)
        const [
          { count: annCount },
          { count: tutCount },
          { count: resCount },
          { count: actCount },
          { count: profCount },
          { data: recentArr }
        ] = await Promise.all([
          supabase.from('general_posts').select('*', { count: 'exact', head: true }),
          supabase.from('tutorials').select('*', { count: 'exact', head: true }),
          supabase.from('academic_resources').select('*', { count: 'exact', head: true }),
          supabase.from('activities').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('general_posts').select('*').order('created_at', { ascending: false }).limit(3)
        ])

        setStats({
          announcements: annCount || 0,
          tutorials: tutCount || 0,
          resources: resCount || 0,
          activities: actCount || 0,
          profiles: profCount || 0
        })
        setRecentActivities(recentArr || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchStatsAndRecent()
    }
  }, [user, authLoading])

  const statCards = [
    { title: 'Announcements', value: stats.announcements, icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/announcements' },
    { title: 'Video Tutorials', value: stats.tutorials, icon: Video, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/tutorials' },
    { title: 'Academic Bank', value: stats.resources, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/academic-bank' },
    { title: 'DASA Activities', value: stats.activities, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/activities' },
    { title: 'Executive Team', value: stats.profiles, icon: Users, color: 'text-rose-600', bg: 'bg-rose-50', link: '/admin/about' }
  ]

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-DASA-black" size={48} />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black mb-1">Overview Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back, <span className="text-DASA-orange">{user?.email?.split('@')[0]}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:border-DASA-black hover:text-DASA-black transition-all shadow-sm">
            <ExternalLink size={16} />
            View Site
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-DASA-black text-white rounded-xl font-bold text-sm shadow-lg shadow-DASA-black/20 hover:bg-DASA-orange transition-all">
            <PlusCircle size={16} />
            New Entry
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="flex items-center text-green-500 text-xs font-bold gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} />
                    Live
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-DASA-black">{stat.value}</span>
                    <span className="text-gray-300 text-xs font-medium">total entries</span>
                  </div>
                </div>
                <Link 
                  href={stat.link} 
                  className="mt-6 flex items-center justify-between text-xs font-bold text-DASA-black hover:text-DASA-orange transition-colors pt-4 border-t border-gray-50"
                >
                  Manage Section
                  <LayoutDashboard size={14} />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 shadow-sm min-h-64">
          <CardHeader className="pb-2 border-b border-gray-50">
            <CardTitle className="text-sm font-bold text-DASA-black flex items-center gap-2">
              <Activity size={16} className="text-DASA-orange" />
              Recent Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivities.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentActivities.map((item: any) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-DASA-black">
                        <Megaphone size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700">{item.title}</p>
                        <p className="text-xs text-gray-400">New announcement posted</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-200">
                  <Activity size={24} />
                </div>
                <h3 className="text-gray-400 font-bold text-sm">No recent activity</h3>
                <p className="text-gray-300 text-xs italic">When you post content, it will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health / Status */}
        <Card className="border-none shadow-sm bg-linear-to-br from-DASA-black to-blue-900 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="text-DASA-orange" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-200">Supabase DB</span>
              <span className="flex items-center gap-1.5 font-bold">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-200">Cloudinary API</span>
              <span className="flex items-center gap-1.5 font-bold">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-200">Auth Service</span>
              <span className="flex items-center gap-1.5 font-bold">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Active
              </span>
            </div>
            <div className="mt-6 p-4 bg-white/10 rounded-2xl">
              <p className="text-[11px] font-bold uppercase tracking-widest text-DASA-orange mb-1">Admin Session</p>
              <p className="text-xs text-blue-100 truncate">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




