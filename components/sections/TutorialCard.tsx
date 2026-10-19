import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Clock, BookOpen, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ShareButton from '@/components/ui/ShareButton'

interface TutorialProps {
  id: string
  title: string
  description: string
  video_url: string
  thumbnail_url?: string
  course_code: string
  semester: number
  year: number
  lecturer: string
}

export default function TutorialCard({ id, title, description, thumbnail_url, course_code, semester, year, lecturer }: TutorialProps) {
  return (
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-200 hover:border-DASA-orange/40 hover:shadow-md transition-all duration-200 group flex flex-col h-full rounded-xl">
      <div className="relative">
        <Link href={`/tutorials/${id}`} className="block aspect-video overflow-hidden bg-gray-100">
          {thumbnail_url ? (
            <Image 
              src={thumbnail_url} 
              alt={title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={48} className="text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/30 transition-colors flex items-center justify-center">
            <PlayCircle size={48} className="text-white opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 duration-300 drop-shadow-md" />
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-900/80 text-white text-[10px] font-bold rounded uppercase tracking-wider backdrop-blur-sm">
            Sem {semester} • Year {year}
          </div>
        </Link>
        <div className="absolute top-2 right-2 z-10">
          <ShareButton 
            title={title} 
            url={`/tutorials/${id}`} 
          />
        </div>
      </div>
      
      <CardHeader className="pb-3 pt-5 px-5">
        <Badge className="w-fit mb-3 bg-orange-50 text-DASA-orange border border-DASA-orange/25 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5">
          {course_code}
        </Badge>
        <Link href={`/tutorials/${id}`}>
          <CardTitle className="text-lg font-bold leading-tight text-gray-900 group-hover:text-DASA-orange transition-colors line-clamp-2">
            {title}
          </CardTitle>
        </Link>
      </CardHeader>
      
      <CardContent className="grow pb-5 px-5">
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 pb-5 px-5 border-t border-gray-100 flex flex-col items-start gap-4 mt-auto">
        <div className="flex items-center text-xs text-gray-400 font-medium w-full">
          <GraduationCap size={14} className="mr-2 text-gray-300" />
          <span className="truncate">Lecturer: <span className="text-gray-700 font-semibold">{lecturer}</span></span>
        </div>
        <Link 
          href={`/tutorials/${id}`}
          className="w-full text-center py-2.5 text-white font-bold text-sm bg-DASA-black hover:bg-DASA-orange active:scale-[0.98] transition-all duration-150 rounded-lg shadow-sm"
        >
          Watch Tutorial
        </Link>
      </CardFooter>
    </Card>
  )
}




