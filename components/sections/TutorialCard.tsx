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
    <Card className="overflow-hidden glass-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none group flex flex-col h-full rounded-[24px]">
      <Link href={`/tutorials/${id}`} className="relative block aspect-video overflow-hidden">
        {thumbnail_url ? (
          <Image 
            src={thumbnail_url} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-DASA-black flex items-center justify-center">
            <BookOpen size={48} className="text-DASA-orange opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <PlayCircle size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 duration-300" />
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded uppercase tracking-wider backdrop-blur-sm">
          Sem {semester} â€¢ {year}
        </div>
      </Link>
      
      <div className="absolute top-2 right-2 z-10">
        <ShareButton 
          title={title} 
          url={`/tutorials/${id}`} 
        />
      </div>
      
      <CardHeader className="pb-2">
        <Badge className="w-fit mb-2 bg-blue-50 text-DASA-black border-none font-semibold text-[10px] uppercase">
          {course_code}
        </Badge>
        <Link href={`/tutorials/${id}`}>
          <CardTitle className="text-lg font-bold leading-tight text-DASA-black group-hover:text-DASA-orange transition-colors line-clamp-2">
            {title}
          </CardTitle>
        </Link>
      </CardHeader>
      
      <CardContent className="grow pb-4">
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-gray-50 flex flex-col items-start gap-2">
        <div className="flex items-center text-xs text-gray-400 w-full">
          <GraduationCap size={14} className="mr-2 text-DASA-orange" />
          <span className="truncate">Lecturer: <span className="text-gray-600 font-medium">{lecturer}</span></span>
        </div>
        <Link 
          href={`/tutorials/${id}`}
          className="w-full text-center py-2 text-DASA-black font-bold text-sm bg-blue-50 hover:bg-DASA-orange hover:text-white transition-all rounded-lg mt-2"
        >
          Watch Tutorial
        </Link>
      </CardFooter>
    </Card>
  )
}




