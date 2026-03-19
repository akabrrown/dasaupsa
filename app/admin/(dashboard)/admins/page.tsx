'use client'

import InviteAdminForm from '@/components/admin/InviteAdminForm'
import AdminList from '@/components/admin/AdminList'
import { motion } from 'framer-motion'
import { ShieldCheck, Users } from 'lucide-react'

export default function AdminsManagementPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-DASA-black mb-1">Admin Management</h1>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            <ShieldCheck size={16} className="text-DASA-orange" />
            Security & Access Control
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section>
          <InviteAdminForm />
        </section>

        <section>
          <AdminList />
        </section>

        {/* Informational Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto w-full bg-linear-to-br from-DASA-black to-blue-900 rounded-[32px] p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-DASA-orange" />
            <h3 className="font-bold">Important Note</h3>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            Adding a new admin will immediately create their credentials in the system. 
            The invited person will receive an automated email from Supabase to verify their 
            identity. They will have full access to all administrative features once verified.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
