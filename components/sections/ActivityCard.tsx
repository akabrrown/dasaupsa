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
    <Card className="overflow-hidden glass-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-none group flex flex-col md:flex-row h-full md:h-64 rounded-[24px]">
      {/* Image Section */}
      <div className="md:w-1/3 relative overflow-hidden shrink-0 h-48 md:h-full">
        {images.length > 0 ? (
          <Image 
            src={images[0]} 
            alt={`Activity spotlight: ${title}`} 
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-light-orange flex items-center justify-center">
            <ImageIcon size={40} className="text-DASA-black opacity-20" />
          </div>
        )}
        <Badge className={`absolute top-4 left-4 border-none font-bold uppercase tracking-tight ${
          status === 'upcoming' ? 'bg-green-500 text-white' : 
          status === 'ongoing' ? 'bg-DASA-orange text-white' : 
          'bg-gray-500 text-white'
        }`}>
          {status}
        </Badge>
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-bold uppercase tracking-wider">
            <ImageIcon size={12} />
            {images.length} Photos
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="md:w-2/3 p-6 flex flex-col">
        <div className="flex items-center text-DASA-orange text-xs font-bold uppercase tracking-widest mb-2 gap-4">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-xl font-bold text-DASA-black group-hover:text-DASA-orange transition-colors line-clamp-1">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 grow">
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex items-center text-gray-400 text-xs">
            <MapPin size={14} className="mr-2 text-DASA-orange shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </CardContent>

        <CardFooter className="p-0 pt-4 mt-auto flex items-center justify-between">
          <Link 
            href={`/activities/${id}`}
            className="flex items-center text-DASA-black text-sm font-bold hover:text-DASA-orange transition-colors group/link"
          >
            Full Event Details 
            <ArrowRight size={16} className="ml-1 transition-transform group-hover/link:translate-x-1" />
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




