import ProgramManager from '@/components/admin/ProgramManager'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Programs | DASA Admin',
}

export default function ProgramsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-DASA-black">Academic Programs</h1>
        <p className="text-gray-500 mt-2">Add or remove programs for the Academic Bank repository.</p>
      </div>
      
      <ProgramManager />
    </div>
  )
}
