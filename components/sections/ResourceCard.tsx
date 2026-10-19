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
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-200 hover:border-DASA-orange/40 hover:shadow-md transition-all duration-200 group flex flex-col h-full rounded-xl">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex justify-between items-start mb-3">
          <Badge className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${isSlide ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-orange-50 text-DASA-orange border-DASA-orange/25'}`}>
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
              className={`p-1.5 rounded-md transition-colors ${bookmarked ? 'bg-DASA-orange text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-DASA-black'}`}
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
          className="text-base font-bold text-gray-900 group-hover:text-DASA-orange transition-colors line-clamp-2 leading-snug" 
          title={title.includes('|') ? title.split('|')[1].trim() : getOriginalFilename(file_url, title)}
        >
          {title.includes('|') ? title.split('|')[1].trim() : getOriginalFilename(file_url, title)}
        </CardTitle>
      </CardHeader>

      <CardContent className="grow pb-5 px-5">
        <div className="space-y-2">
          <div className="flex items-center text-[13px] text-gray-500 font-medium">
            <BookOpen size={14} className="mr-2 text-gray-300 shrink-0" />
            <span className="truncate" title={`${title} - ${course_code}`}>
              <span className="text-gray-700">{course_code}</span> {program && `• ${program.replaceAll('BSc ', '')}`}
            </span>
          </div>
          <div className="flex items-center text-[13px] text-gray-500 font-medium">
            <Clock size={14} className="mr-2 text-gray-300 shrink-0" />
            <span>Sem {semester} • Year {year}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-5 px-5 border-t border-gray-100 flex items-center justify-end gap-2 mt-auto">
        <div className="flex gap-2 w-full">
          <button
            onClick={() => handleAction('open')}
            disabled={loading}
            title="Open in new tab"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 text-[13px] font-semibold rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 border border-gray-200"
          >
            {loading && actionType === 'open' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ExternalLink size={14} />
            )}
            Open
          </button>
          <button
            onClick={() => handleAction('download')}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-DASA-black text-white text-[13px] font-semibold rounded-lg hover:bg-DASA-orange active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
          >
            {loading && actionType === 'download' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            Download
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}
