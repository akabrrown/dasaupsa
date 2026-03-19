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
      <Card className="overflow-hidden glass-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none flex flex-col h-full rounded-[24px]">
      {image && (
        <div className="relative h-48 overflow-hidden">
          <Image 
            src={image} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          {isPinned && (
            <Badge className="absolute top-4 left-4 bg-DASA-orange text-DASA-black border-none font-bold z-10">
              Pinned
            </Badge>
          )}
        </div>
      )}
      <CardHeader className="pb-2">
        {!image && isPinned && (
          <Badge className="w-fit mb-2 bg-DASA-orange text-DASA-black border-none font-bold">
            Pinned
          </Badge>
        )}
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold leading-snug text-DASA-black group-hover:text-DASA-orange transition-colors">
            {title}
          </CardTitle>
          <Megaphone size={20} className="text-DASA-orange shrink-0 mt-1 opacity-60" />
        </div>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {body}
        </p>
      </CardContent>
      <CardFooter className="pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400">
        <Calendar size={14} className="mr-2" />
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




