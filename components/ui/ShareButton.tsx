'use client'

import { useState } from 'react'
import { Share2, Link2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  title: string
  url: string
  className?: string
}

export default function ShareButton({ title, url, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  
  // Use absolute URL if possible
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: fullUrl,
        })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      // Fallback: Copy to clipboard
      handleCopyLink()
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleShare}
      className={`rounded-lg h-9 flex items-center gap-2 px-3 bg-white border-gray-100 hover:border-DASA-orange hover:text-DASA-orange transition-all ${className}`}
      title={copied ? "Copied!" : "Share"}
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
      <span className="text-xs font-bold">{copied ? 'Copied' : 'Share'}</span>
    </Button>
  )
}
