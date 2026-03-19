import ActivitiesPageClient from '@/components/sections/ActivitiesPageClient'
import { getActivities } from '@/lib/actions/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Activities",
  description: "Stay updated with DASA events, hackathons, seminars, and social gatherings. View both upcoming and past association activities.",
}

export default async function ActivitiesPage() {
  const { data: activities, error } = await getActivities()

  if (error) {
    console.error('Error fetching activities:', error)
  }

  return (
    <ActivitiesPageClient initialActivities={activities || []} />
  )
}




