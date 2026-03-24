'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react'

interface PasswordStrengthMeterProps {
  password: string
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const getStrength = (pass: string) => {
    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 1
    if (/\d/.test(pass)) strength += 1
    if (/[^a-zA-Z\d]/.test(pass)) strength += 1
    return strength
  }

  const strength = getStrength(password)
  
  const getColor = (s: number) => {
    if (s === 0) return 'bg-gray-200'
    if (s === 1) return 'bg-red-500'
    if (s === 2) return 'bg-orange-500'
    if (s === 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getLabel = (s: number) => {
    if (s === 0) return 'Enter a password'
    if (s === 1) return 'Weak'
    if (s === 2) return 'Fair'
    if (s === 3) return 'Good'
    return 'Strong'
  }

  const getIcon = (s: number) => {
    if (s < 2) return <ShieldAlert size={14} className="text-red-500" />
    if (s < 4) return <Shield size={14} className="text-orange-500" />
    return <ShieldCheck size={14} className="text-green-500" />
  }

  return (
    <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon(strength)}
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            Strength: <span className={strength === 4 ? 'text-green-600' : 'text-gray-700'}>{getLabel(strength)}</span>
          </span>
        </div>
        <span className="text-[10px] font-bold text-gray-400">{strength * 25}%</span>
      </div>
      
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4].map((step) => (
          <motion.div
            key={step}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: strength >= step ? 1 : 0 }}
            className={`h-full flex-1 rounded-full transition-colors duration-500 ${getColor(strength)}`}
          />
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        <li className={`flex items-center gap-1.5 text-[10px] font-bold ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-gray-300'}`} />
          8+ Characters
        </li>
        <li className={`flex items-center gap-1.5 text-[10px] font-bold ${(/[a-z]/.test(password) && /[A-Z]/.test(password)) ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-1 h-1 rounded-full ${(/[a-z]/.test(password) && /[A-Z]/.test(password)) ? 'bg-green-600' : 'bg-gray-300'}`} />
          Mixed Case
        </li>
        <li className={`flex items-center gap-1.5 text-[10px] font-bold ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-1 h-1 rounded-full ${/\d/.test(password) ? 'bg-green-600' : 'bg-gray-300'}`} />
          Includes Numbers
        </li>
        <li className={`flex items-center gap-1.5 text-[10px] font-bold ${/[^a-zA-Z\d]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-1 h-1 rounded-full ${/[^a-zA-Z\d]/.test(password) ? 'bg-green-600' : 'bg-gray-300'}`} />
          Special Symbols
        </li>
      </ul>
    </div>
  )
}
