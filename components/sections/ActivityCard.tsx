import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Clock, Image as ImageIcon, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ShareButton from '@/components/ui/ShareButton'

interface ActivityProps {
  id: string
  title: string
  description: string
  location: string
  event_date: string
  status: 'upcoming' | 'ongoing' | 'completed'
  images: string[]
}

export default function ActivityCard({ id, title, description, location, event_date, status, images }: ActivityProps) {
  const dateObj = new Date(event_date)
  const isUpcoming = status === 'upcoming'

  return (
    <Card className="overflow-hidden bg-white shadow-sm border border-gray-200 hover:border-DASA-orange/40 hover:shadow-md transition-all duration-200 group flex flex-col md:flex-row h-full md:h-56 rounded-xl">
      {/* Image Section */}
      <div className="md:w-1/3 relative overflow-hidden shrink-0 h-48 md:h-full bg-gray-50 border-r border-gray-100">
        {images.length > 0 ? (
          <Image 
            src={images[0]} 
            alt={`Activity spotlight: ${title}`} 
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
            <ImageIcon size={32} className="text-gray-300" />
          </div>
        )}
        <Badge className={`absolute top-3 left-3 border-none font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 shadow-sm ${
          status === 'upcoming' ? 'bg-DASA-black text-white' : 
          status === 'ongoing' ? 'bg-DASA-orange text-white' : 
          'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          {status}
        </Badge>
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-bold uppercase tracking-wider">
            <ImageIcon size={10} />
            {images.length} Photos
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="md:w-2/3 p-5 md:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-3 gap-4">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1.5" />
              {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center">
              <Clock size={12} className="mr-1.5" />
              {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <CardHeader className="p-0 mb-3">
            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-DASA-orange transition-colors line-clamp-1">
              {title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">
              {description}
            </p>
            <div className="flex items-center text-gray-400 text-xs font-medium">
              <MapPin size={14} className="mr-2 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </CardContent>
        </div>

        <CardFooter className="p-0 pt-5 mt-auto flex items-center justify-between border-t border-gray-100">
          <Link 
            href={`/activities/${id}`}
            className="flex items-center text-gray-900 text-sm font-semibold hover:text-DASA-orange transition-colors group/link"
          >
            Full Event Details 
            <ArrowRight size={16} className="ml-1 text-DASA-orange opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
          </Link>
          <ShareButton 
            title={title} 
            url={`/activities/${id}`} 
          />
        </CardFooter>
      </div>
    </Card>
  )
}




