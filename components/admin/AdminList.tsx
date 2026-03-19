'use client'

import { useState, useEffect } from 'react'
import { getAdmins, deleteAdmin } from '@/lib/actions/admin'
import { 
  Users, 
  Trash2, 
  Shield, 
  Mail, 
  Calendar, 
  Loader2, 
  AlertTriangle,
  Search,
  RefreshCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card'

export default function AdminList() {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchAdmins = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdmins()
      setAdmins(data)
    } catch (err: any) {
      setError('Failed to load administrators.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this administrator? This action cannot be undone.')) {
      return
    }

    setDeleting(userId)
    try {
      const result = await deleteAdmin(userId)
      if (result.success) {
        setAdmins(prev => prev.filter(a => a.id !== userId))
      } else {
        alert(result.error || 'Failed to delete admin.')
      }
    } catch (err: any) {
      alert('An error occurred while deleting.')
    } finally {
      setDeleting(null)
    }
  }

  const filteredAdmins = admins.filter(admin => 
    admin.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="shadow-xl border-none rounded-[32px] overflow-hidden bg-white">
      <CardHeader className="bg-DASA-black text-white p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Shield size={24} className="text-DASA-orange" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">System Administrators</CardTitle>
              <CardDescription className="text-blue-100 font-medium">
                Manage accounts with administrative access
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search admins..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border-none text-white placeholder:text-gray-400 rounded-xl w-full md:w-64 focus:ring-2 focus:ring-DASA-orange transition-all"
              />
            </div>
            <button 
              onClick={fetchAdmins}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              title="Refresh List"
            >
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {loading && admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 size={48} className="animate-spin mb-4 text-DASA-orange" />
            <p className="font-bold">Loading administrators...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Users size={48} className="mb-4 opacity-20" />
            <p className="font-bold">{searchQuery ? 'No administrators match your search.' : 'No administrators found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 pt-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Administrator</th>
                  <th className="pb-4 pt-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Contact</th>
                  <th className="pb-4 pt-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Joined</th>
                  <th className="pb-4 pt-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAdmins.map((admin) => (
                    <motion.tr 
                      key={admin.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-none"
                    >
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-DASA-black font-bold text-sm">
                            {admin.full_name ? admin.full_name[0] : 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-DASA-black leading-none mb-1">{admin.full_name || 'Anonymous User'}</div>
                            <div className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full inline-block font-bold">ACTIVE ADMIN</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail size={14} className="text-gray-400" />
                          {admin.email}
                        </div>
                      </td>
                      <td className="py-5 px-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} className="text-gray-400" />
                          {admin.created_at ? new Date(admin.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <button 
                          onClick={() => handleDelete(admin.id)}
                          disabled={deleting === admin.id}
                          className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                          title="Delete Admin"
                        >
                          {deleting === admin.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      
      {error && (
        <div className="mx-8 mb-8 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}
    </Card>
  )
}
