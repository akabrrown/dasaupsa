import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Megaphone, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface AnnouncementProps {
  id: string
  title: string
  body: string
  image?: string
  isPinned: boolean
  createdAt: string
}

export default function AnnouncementCard({ id, title, body, image, isPinned, createdAt }: AnnouncementProps) {
  return (
    <Link href={`/announcements/${id}`} className="block group h-full">
      <Card className="overflow-hidden bg-white shadow-sm border border-gray-200 hover:border-DASA-orange/40 hover:shadow-md transition-all duration-200 flex flex-col h-full rounded-xl">
      {image && (
        <div className="relative h-48 overflow-hidden bg-gray-50">
          <Image 
            src={image} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          {isPinned && (
            <Badge className="absolute top-3 left-3 bg-DASA-black text-white border-none font-bold z-10 uppercase text-[10px] tracking-wider px-2 py-0.5 shadow-sm">
              Pinned
            </Badge>
          )}
        </div>
      )}
      <CardHeader className="pb-3 pt-5 px-5">
        {!image && isPinned && (
          <Badge className="w-fit mb-3 bg-DASA-black text-white border-none font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 shadow-sm">
            Pinned
          </Badge>
        )}
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-bold leading-snug text-gray-900 group-hover:text-DASA-orange transition-colors">
            {title}
          </CardTitle>
          <ArrowRight size={18} className="text-DASA-orange shrink-0 mt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </CardHeader>
      <CardContent className="grow px-5">
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
          {body}
        </p>
      </CardContent>
      <CardFooter className="pt-4 pb-5 px-5 flex items-center text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-auto">
        <Calendar size={12} className="mr-2" />
        {createdAt ? new Intl.DateTimeFormat('en-US', { 
          month: 'short', 
          day: '2-digit', 
          year: 'numeric' 
        }).format(new Date(createdAt)) : 'No date'}
      </CardFooter>
      </Card>
    </Link>
  )
}




