import { getActivityById } from '@/lib/actions/data'
import { notFound } from 'next/navigation'
import ActivityDetailClient from '@/components/sections/ActivityDetailClient'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data: activity } = await getActivityById(id)

  if (!activity) return { title: 'Activity Not Found' }

  return {
    title: activity.title,
    description: activity.description?.substring(0, 160),
  }
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: activity, error } = await getActivityById(id)

  if (error || !activity) {
    notFound()
  }

  return <ActivityDetailClient activity={activity} />
}
