import AboutPageClient from '@/components/sections/AboutPageClient'
import { getProfiles } from '@/lib/actions/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the Department of Accounting at UPSA and meet the DASA executives and department authorities.",
}

export default async function AboutPage() {
  const { data: profiles, error } = await getProfiles()

  if (error) {
    console.error('Error fetching profiles:', error)
  }

  return <AboutPageClient profiles={profiles || []} />
}




