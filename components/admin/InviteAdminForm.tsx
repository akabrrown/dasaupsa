'use client'

import { useState } from 'react'
import { createAdminAccount } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, Mail, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InviteAdminForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const result = await createAdminAccount({ fullName, email })
      
      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: `Successfully invited ${fullName}! Temporary password: ${result.tempPassword}. Please share this with them securely.` 
        })
        setFullName('')
        setEmail('')
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send invitation.' })
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-DASA-orange/10 rounded-2xl flex items-center justify-center text-DASA-orange">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-DASA-black">Invite New Admin</h2>
            <p className="text-gray-500 text-sm">Send an invitation email to a new administrator</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {status && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-2xl flex items-start gap-3 ${
                  status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
                <p className="text-sm font-medium">{status.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Full Name</label>
            <Input
              type="text"
              placeholder="Ex: John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="admin@dasa.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
            <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
              <strong>Note:</strong> New admins must log in with the temporary password and will be <strong>required to change it</strong> before they can access any dashboard features.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-7 bg-DASA-black hover:bg-DASA-orange text-white font-extrabold text-lg rounded-2xl transition-all shadow-lg hover:shadow-DASA-orange/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={24} /> Creating Account...</>
            ) : (
              'Create Admin Account'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
