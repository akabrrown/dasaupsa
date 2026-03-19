import TutorialsPageClient from '@/components/sections/TutorialsPageClient'
import { getTutorials } from '@/lib/actions/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Tutorials",
  description: "Access our collection of video tutorials and study materials for Information Technology courses. Learn from peers and experts.",
}

export default async function TutorialsPage() {
  const { data: tutorials, error } = await getTutorials()

  if (error) {
    console.error('Error fetching tutorials:', error)
  }

  return (
    <TutorialsPageClient initialTutorials={tutorials || []} />
  )
}




