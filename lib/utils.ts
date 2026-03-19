import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

export function truncateText(text: string, length: number) {
  return text.length > length ? text.slice(0, length) + '...' : text
}

export function getEmbedUrl(url: string) {
  if (!url) return null;
  
  // YouTube
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  
  // Google Drive
  const gdMatch = url.match(/(?:https?:\/\/)?drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
  
  return url;
}




