import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Mail, Linkedin, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'

interface ProfileProps {
  id: string
  name: string
  title: string
  role: string
  photo_url?: string
  email?: string
  bio?: string
  display_order: number
  linkedin_url?: string
  twitter_url?: string
  instagram_url?: string
  tiktok_url?: string
  whatsapp_url?: string
}

export default function ProfileCard({ name, title, role, photo_url, email, bio, linkedin_url, twitter_url, instagram_url, tiktok_url, whatsapp_url }: ProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLongBio = bio && bio.length > 120

  return (
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-200 hover:shadow-md hover:border-DASA-orange/40 transition-all duration-300 group h-full flex flex-col pt-8 pb-6 px-6 rounded-xl">
      <div className="relative mx-auto w-28 h-28 mb-5">
        <div className="absolute inset-0 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
          {photo_url ? (
            <Image 
              src={photo_url} 
              alt={name} 
              fill
              sizes="112px"
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold bg-gray-50">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
      </div>

      <CardHeader className="text-center p-0 mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-DASA-orange transition-colors tracking-tight">
          {name}
        </h3>
        <p className="text-DASA-orange text-[11px] font-bold uppercase tracking-widest mt-1.5">
          {title}
        </p>
      </CardHeader>

      <CardContent className="text-center p-0 grow flex flex-col">
        {bio && (
          <div className="mb-6">
            <motion.p 
              initial={false}
              animate={{ height: isExpanded ? 'auto' : '4rem' }}
              className={`text-gray-500 text-sm leading-relaxed overflow-hidden ${!isExpanded ? 'line-clamp-3' : ''}`}
            >
              {bio}
            </motion.p>
            {isLongBio && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-900 text-xs font-semibold mt-3 hover:text-DASA-orange flex items-center gap-1 mx-auto transition-colors"
              >
                {isExpanded ? (
                  <>Show Less <ChevronUp size={14} /></>
                ) : (
                  <>Read More <ChevronDown size={14} /></>
                )}
              </button>
            )}
          </div>
        )}
        
        <div className="mt-auto flex justify-center gap-3 border-t border-gray-100 pt-5">
          {email && (
            <a href={`mailto:${email}`} className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-colors border border-gray-100" title="Email">
              <Mail size={16} />
            </a>
          )}
          {linkedin_url && (
            <a href={linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-colors border border-gray-100" title="LinkedIn">
              <Linkedin size={16} />
            </a>
          )}
          {twitter_url && (
            <a href={twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-colors border border-gray-100" title="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          )}
          {instagram_url && (
            <a href={instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-colors border border-gray-100" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          )}
          {tiktok_url && (
            <a href={tiktok_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-colors border border-gray-100" title="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z"/><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z"/><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z"/><path d="M9 16C9 16 10.5 17 12 17C13.5 17 15 16 15 16"/></svg>
            </a>
          )}
          {whatsapp_url && whatsapp_url.split(',').map((url, idx) => {
            const cleanUrl = url.trim()
            if (!cleanUrl) return null
            return (
              <a key={idx} href={cleanUrl.startsWith('http') ? cleanUrl : `https://wa.me/${cleanUrl.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-colors border border-gray-100" title={`WhatsApp ${idx > 0 ? idx + 1 : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}




