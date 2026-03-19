import { getTutorialById, getTutorials } from '@/lib/actions/data'
import { notFound } from 'next/navigation'
import TutorialDetailClient from '@/components/sections/TutorialDetailClient'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data: tutorial } = await getTutorialById(id)

  if (!tutorial) return { title: 'Tutorial Not Found' }

  return {
    title: tutorial.title,
    description: `Expert-led tutorial on ${tutorial.title} by ${tutorial.lecturer}. ${tutorial.description?.substring(0, 100)}`,
  }
}

export default async function TutorialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch current tutorial
  const { data: tutorial, error: tutorialError } = await getTutorialById(id)

  if (tutorialError || !tutorial) {
    notFound()
  }

  // Fetch related tutorials (same course, excluding current)
  // We can just use getTutorials and filter for simplicity or add a specific action
  const { data: allTutorials } = await getTutorials()
  const relatedTutorials = allTutorials?.filter(t => t.course === tutorial.course && t.id !== id).slice(0, 3) || []

  return <TutorialDetailClient tutorial={tutorial} relatedTutorials={relatedTutorials} />
}
