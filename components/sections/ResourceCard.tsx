'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, ExternalLink, BookOpen, Clock, Loader2, Bookmark } from 'lucide-react'
import { toggleBookmark } from '@/lib/actions/bookmarks'
import ShareButton from '@/components/ui/ShareButton'
import { useRouter } from 'next/navigation'

interface ResourceProps {
  id: string
  title: string
  course_code: string
  year: number
  semester: number
  type: 'slide' | 'past_question'
  file_url: string
  download_count: number
  program?: string
  isBookmarked?: boolean
}

/**
 * Build a proxy URL for secure downloading or viewing.
 * The proxy handles authentication with Cloudinary's strict security.
 */
const getProxyUrl = (url: string, mode: 'open' | 'download', title: string): string => {
  if (!url || !url.includes('cloudinary.com')) return url
  // Extract original filename from Cloudinary URL if possible
  const originalFile = url.split('/').pop()?.split('.')?.[0] || 'file'
  const sanitizedTitle = originalFile.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  return `/api/resources/proxy?url=${encodeURIComponent(url)}&mode=${mode}&filename=${encodeURIComponent(sanitizedTitle)}`
}

/**
 * Extracts and cleans the original filename from a Cloudinary URL,
 * stripping out the random 6-character suffix and the file extension.
 */
const getOriginalFilename = (url: string, fallback: string) => {
  if (!url) return fallback;
  try {
    const decodedUrl = decodeURIComponent(url);
    const filenameWithExt = decodedUrl.split('/').pop() || fallback;
    
    // Strip extension
    let clean = filenameWithExt.replace(/\.[^/.]+$/, "");
    
    // Strip Cloudinary 6-char random suffix (_a1b2c3)
    clean = clean.replace(/_[a-zA-Z0-9]{6}$/, "");
    
    const finalName = clean.replace(/[-_]/g, ' ').trim();
    
    // If the name looks like a random hash (long, no spaces), fallback to course title
    if (finalName.length > 15 && !finalName.includes(' ')) {
      return fallback;
    }
    
    return finalName || fallback;
  } catch {
    const simple = url.split('/').pop()?.split('.')[0]?.replace(/[-_]/g, ' ') || fallback;
    return (simple.length > 15 && !simple.includes(' ')) ? fallback : simple;
  }
}

export default function ResourceCard({ id, title, course_code, year, semester, type, file_url, download_count, program, isBookmarked = false }: ResourceProps) {
  const isSlide = type === 'slide'
  const [loading, setLoading] = useState(false)
  const [actionType, setActionType] = useState<'open' | 'download' | 'bookmark' | null>(null)
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const router = useRouter()

  const handleAction = (mode: 'open' | 'download') => {
    // The proxy handles Cloudinary's strict security on the server side
    // and serves the file directly to the browser with correct headers.
    const proxyUrl = getProxyUrl(file_url, mode, title)
    window.open(proxyUrl, '_blank', 'noopener,noreferrer')
  }

  const handleBookmark = async () => {
    setLoading(true)
    setActionType('bookmark')
    try {
      await toggleBookmark(id)
      setBookmarked(!bookmarked)
    } catch (error: any) {
      console.error('Bookmark error:', error)
      if (error.message?.includes('logged in')) {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
      setActionType(null)
    }
  }

  return (
    <Card className="overflow-hidden glass-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none group flex flex-col h-full border-l-4 border-l-transparent hover:border-l-DASA-orange rounded-[24px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none ${isSlide ? 'bg-blue-50 text-DASA-black' : 'bg-orange-50 text-orange-700'}`}>
            {isSlide ? 'Lecture Slide' : 'Past Question'}
          </Badge>
          <div className="flex gap-1">
            <ShareButton 
              title={title} 
              url={`/academic-bank?search=${encodeURIComponent(course_code)}`} 
            />
            <button
              onClick={handleBookmark}
              disabled={loading}
              className={`p-2 rounded-lg transition-all ${bookmarked ? 'bg-DASA-orange text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              title={bookmarked ? "Remove Bookmark" : "Bookmark"}
            >
              {loading && actionType === 'bookmark' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
              )}
            </button>
          </div>
        </div>
        <CardTitle 
          className="text-lg font-bold text-DASA-black group-hover:text-DASA-orange transition-colors line-clamp-2 leading-snug" 
          title={title.includes('|') ? title.split('|')[1].trim() : getOriginalFilename(file_url, title)}
        >
          {title.includes('|') ? title.split('|')[1].trim() : getOriginalFilename(file_url, title)}
        </CardTitle>
      </CardHeader>

      <CardContent className="grow pb-4">
        <div className="space-y-3">
          <div className="flex items-center text-xs text-gray-500">
            <BookOpen size={14} className="mr-2 text-DASA-orange shrink-0" />
            <span className="truncate" title={`${title} - ${course_code}`}>
              <span className="font-bold text-gray-700">{title}</span> • {course_code} {program && `• ${program.replaceAll('BSc ', '')}`}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-2 text-DASA-orange shrink-0" />
            <span>Sem {semester} • {year}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-50 flex items-center justify-end gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('open')}
            disabled={loading}
            title="Open in new tab"
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-DASA-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {loading && actionType === 'open' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <ExternalLink size={13} />
            )}
            Open
          </button>
          <button
            onClick={() => handleAction('download')}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-DASA-black text-white text-xs font-bold rounded-lg hover:bg-DASA-orange transition-all shadow-sm disabled:opacity-50"
          >
            {loading && actionType === 'download' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <FileText size={13} />
            )}
            Download
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}
