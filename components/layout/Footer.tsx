import Link from 'next/link'
import { Phone, Mail, X, MessageCircle, Youtube, Instagram } from 'lucide-react'
import Image from 'next/image'
import { navLinks } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-DASA-black text-white py-6 mt-12 border-t border-blue-900">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 text-white group shrink-0">
          <Image 
            src="/dasa-logo.jpg" 
            alt="DASA Logo" 
            width={40} 
            height={40} 
            className="rounded-full object-cover shadow-md group-hover:scale-105 transition-transform h-10 w-10" 
          />
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-extrabold text-DASA-orange leading-tight uppercase tracking-wide">Department of Accounting Student Association</span>
            <span className="text-[10px] md:text-xs font-medium text-blue-200 uppercase tracking-widest mt-0.5">University of Professional Studies, Accra</span>
          </div>
        </Link>

        {/* Contact Info - Compact */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-blue-100 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-DASA-orange" />
            <span>+233 20 119 0746 </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-DASA-orange" />
            <span>dasaupsa0@gmail.com</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-blue-200 text-sm font-medium">
          &copy; {new Date().getFullYear()} DASA. All rights reserved.
        </div>

        {/* Social Links */}
        <div className="flex space-x-3">
          {/* Twitter (X) Button */}
          <a
            href="https://x.com/dasaupsa94240?s=11"
            className="group relative flex items-center justify-center w-11 h-11 bg-black rounded-full transition-all duration-400 ease-in-out hover:w-28 hover:rounded-3xl overflow-hidden"
            aria-label="X (Twitter)"
          >
            <svg className="w-4 h-4 fill-white transition-opacity duration-300 group-hover:opacity-0" viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg">
              <path d="M714.163 519.284L1160.89 0H1055.03L662.482 456.377L352.783 0H0L468.492 681.821L0 1226.37H105.866L519.98 744.527L847.217 1226.37H1200L714.137 519.284H714.163ZM573.746 681.717L526.254 613.737L143.868 67.0423H306.495L615.823 509.844L663.315 577.824L1055.08 1138.74H892.451L573.746 681.717Z" />
            </svg>
            <span className="absolute text-white font-semibold opacity-0 transition-opacity duration-400 group-hover:opacity-100 uppercase text-xs tracking-wider">
              Twitter
            </span>
          </a>

          {/* WhatsApp Button */}
          <a
            href="https://whatsapp.com/channel/0029VbAPTazBFLgZ4ubDDN3v"
            className="group relative flex items-center justify-center w-11 h-11 bg-[#25D366] rounded-full transition-all duration-400 ease-in-out hover:w-32 hover:rounded-3xl overflow-hidden"
            aria-label="WhatsApp"
          >
            <svg className="w-5 h-5 fill-white transition-opacity duration-300 group-hover:opacity-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="absolute text-white font-semibold opacity-0 transition-opacity duration-400 group-hover:opacity-100 uppercase text-xs tracking-wider">
              WhatsApp
            </span>
          </a>

          {/* YouTube Button */}
          <a
            href="https://www.youtube.com/@DASACHRONICLES"
            className="group relative flex items-center justify-center w-11 h-11 bg-[#ff0000] rounded-full transition-all duration-400 ease-in-out hover:w-28 hover:rounded-3xl overflow-hidden"
            aria-label="YouTube"
          >
            <svg className="w-5 h-5 fill-white transition-opacity duration-300 group-hover:opacity-0" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M549.655 148.28c-6.281-23.64-24.041-42.396-47.655-48.685C462.923 85 288 85 288 85S113.077 85 74 99.595c-23.614 6.289-41.374 25.045-47.655 48.685-12.614 47.328-12.614 147.717-12.614 147.717s0 100.39 12.614 147.718c6.281 23.64 24.041 42.396 47.655 48.684C113.077 427 288 427 288 427s174.923 0 214-14.595c23.614-6.289 41.374-25.045 47.655-48.685 12.614-47.328 12.614-147.718 12.614-147.718s0-100.389-12.614-147.717zM240 336V176l144 80-144 80z" />
            </svg>
            <span className="absolute text-white font-semibold opacity-0 transition-opacity duration-400 group-hover:opacity-100 uppercase text-xs tracking-wider">
              YouTube
            </span>
          </a>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/dasa_upsa?igsh=MXAyZXQ0czhtYXI4Zw%3D%3D&utm_source=qr"
            className="group relative flex items-center justify-center w-11 h-11 bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] rounded-full transition-all duration-400 ease-in-out hover:w-32 hover:rounded-3xl overflow-hidden"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5 fill-white transition-opacity duration-300 group-hover:opacity-0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
            </svg>
            <span className="absolute text-white font-semibold opacity-0 transition-opacity duration-400 group-hover:opacity-100 uppercase text-xs tracking-wider">
              Instagram
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}




