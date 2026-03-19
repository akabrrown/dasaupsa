import AcademicBankPageClient from '@/components/sections/AcademicBankPageClient'
import { getAcademicResources } from '@/lib/actions/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Academic Bank",
  description: "Download past questions, lecture notes, and study materials for Accounting courses. A comprehensive repository for University of Ghana students.",
}

export default async function AcademicBankPage() {
  const { data: resources, error } = await getAcademicResources()

  if (error) {
    console.error('Error fetching resources:', error)
  }

  return <AcademicBankPageClient initialResources={resources || []} />
}




