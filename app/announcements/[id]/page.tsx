import { getAnnouncementById } from '@/lib/actions/data'
import { notFound } from 'next/navigation'
import AnnouncementDetailClient from '@/components/sections/AnnouncementDetailClient'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data: announcement } = await getAnnouncementById(id)

  if (!announcement) return { title: 'Announcement Not Found' }

  return {
    title: announcement.title,
    description: announcement.body?.substring(0, 160),
  }
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: announcement, error } = await getAnnouncementById(id)

  if (error || !announcement) {
    notFound()
  }

  return <AnnouncementDetailClient announcement={announcement} />
}
