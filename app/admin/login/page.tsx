'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '../../../components/ui/input'
import { Lock, Mail, Loader2, ShieldCheck, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      
      // Force refreshing the router to ensure cookies are updated on the server
      router.refresh()
      
      // Delay slightly to allow cookies to settle before the redirect
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 500)

    } catch (err: any) {
      console.error('Login error detail:', err)
      setError(err.message || 'Failed to sign in. Please check your credentials.')
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
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-DASA-black mb-8 transition-colors group">
          <ChevronLeft size={20} className="mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Website
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl border border-gray-100"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-64 h-64 mb-6 relative">
              <Image 
                src="/dasa-logo.jpg" 
                alt="DASA Logo" 
                fill
                className="rounded-lg object-contain shadow-xl" 
                priority
              />
            </div>
            <h1 className="text-3xl font-extrabold text-DASA-black mb-2">Portal Access</h1>
            <p className="text-gray-400 font-medium">Administration Secure Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="email"
                  placeholder="[EMAIL_ADDRESS]"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="pl-12 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs font-bold text-DASA-black hover:text-DASA-orange transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="password"
                  placeholder="[PASSWORD]"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs font-medium">
              &copy; {new Date().getFullYear()} DASA Secure Management System
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}




