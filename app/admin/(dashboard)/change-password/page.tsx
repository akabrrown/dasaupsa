'use client'

import { useState } from 'react'
import { changeAdminPassword } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Loader2, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PasswordStrengthMeter from '@/components/admin/PasswordStrengthMeter'

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters long.' })
      return
    }

    // Basic strength check
    const strength = [
      /[a-z]/.test(password) && /[A-Z]/.test(password),
      /\d/.test(password),
      /[^a-zA-Z\d]/.test(password)
    ].filter(Boolean).length

    if (strength < 2 && password.length < 12) {
      setStatus({ type: 'error', message: 'Please choose a stronger password with a mix of characters.' })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const result = await changeAdminPassword(password)
      if (result.success) {
        setStatus({ type: 'success', message: 'Password updated successfully! Redirecting...' })
        setTimeout(() => {
          router.push('/admin/dashboard')
          router.refresh()
        }, 2000)
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to update password.' })
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-gray-100"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-DASA-orange/10 rounded-3xl flex items-center justify-center text-DASA-orange mb-6">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-DASA-black mb-2 uppercase tracking-tighter">Security Update</h1>
          <p className="text-gray-500 font-medium">To protect your account, please set a new permanent password before continuing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl flex items-start gap-3 ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
              <p className="text-sm font-bold">{status.message}</p>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 ml-1 uppercase tracking-widest">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 py-7 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all font-medium"
                required
              />
            </div>
            <PasswordStrengthMeter password={password} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 ml-1 uppercase tracking-widest">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-12 py-7 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all font-medium"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-8 bg-DASA-black hover:bg-DASA-orange text-white font-black text-xl rounded-[24px] transition-all shadow-xl hover:shadow-DASA-orange/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={24} /> Updating...</>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Security Best Practices</h3>
          <ul className="space-y-2">
            {[
              'Use a unique password not used on other sites',
              'Mix uppercase, lowercase, numbers, and symbols',
              'Avoid common words or personal info (names, birthdays)',
              'Consider using a phrase (e.g., Green!Mountain@42)'
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500 font-medium">
                <div className="w-1 h-1 rounded-full bg-DASA-orange mt-1.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
