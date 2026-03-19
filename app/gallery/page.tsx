import { getGalleryItems } from '@/lib/actions/data'
import GalleryPageClient from '@/components/sections/GalleryPageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Gallery | DASA",
  description: "Explore the journey and events of the Department of Accounting Student Association.",
}

export default async function GalleryPage() {
  const { data: items, error } = await getGalleryItems()

  if (error) {
    console.error('Error loading gallery:', error)
  }

  return <GalleryPageClient items={items || []} />
}
