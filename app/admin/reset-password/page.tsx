'use client'

import { useState, useEffect } from 'react'
import { changeAdminPassword } from '@/lib/actions/admin'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Loader2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const { user, loading: authLoading } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      setError("No active session found. Your invitation link may have expired or is invalid.")
      // Optional: redirect after some time
      // setTimeout(() => router.push('/admin/login'), 5000)
    }
  }, [user, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await changeAdminPassword(password)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 2000)
      } else {
        setError(result.error || 'Failed to update password.')
      }
    } catch (err: any) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-orange p-4 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-DASA-black/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-DASA-orange/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl border border-gray-100"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-32 h-32 mb-6 relative">
              <div className="absolute inset-0 bg-DASA-orange/10 rounded-3xl rotate-6"></div>
              <div className="relative z-10 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-center w-full h-full">
                <Lock size={48} className="text-DASA-orange" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-DASA-black mb-2">Setup Account</h1>
            <p className="text-gray-400 font-medium">Create your administrative password</p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Set!</h2>
              <p className="text-gray-500">Redirecting you to the dashboard...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl text-center"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full py-7 bg-DASA-black hover:bg-DASA-orange text-white font-extrabold text-lg rounded-2xl transition-all shadow-lg hover:shadow-DASA-orange/20 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Activate Account'
                )}
              </Button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs font-medium">
              &copy; {new Date().getFullYear()} DASA • Secure Management System
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
