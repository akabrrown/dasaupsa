'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getPrograms, addProgram, deleteProgram, updateProgram } from '@/lib/actions/programs'
import { Plus, Trash2, Edit2, Check, X, Loader2, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProgramManager() {
  const [programs, setPrograms] = useState<any[]>([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPrograms()
  }, [])

  async function fetchPrograms() {
    setLoading(true)
    const { data } = await getPrograms()
    if (data) setPrograms(data)
    setLoading(false)
  }

  async function handleAdd() {
    if (!newName.trim()) return
    setActionLoading(true)
    const { error } = await addProgram(newName.trim())
    if (!error) {
      setNewName('')
      fetchPrograms()
    }
    setActionLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure? This might affect resources linked to this program.')) return
    setActionLoading(true)
    const { error } = await deleteProgram(id)
    if (!error) fetchPrograms()
    setActionLoading(false)
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) return
    setActionLoading(true)
    const { error } = await updateProgram(id, editName.trim())
    if (!error) {
      setEditingId(null)
      fetchPrograms()
    }
    setActionLoading(false)
  }

  return (
    <Card className="border-none shadow-xl rounded-[32px] overflow-hidden bg-white">
      <CardHeader className="bg-DASA-black text-white p-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl">
            <GraduationCap size={24} className="text-DASA-orange" />
          </div>
          <CardTitle className="text-2xl font-bold">Manage Programs</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="flex gap-4">
          <Input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add new program (e.g. BSc Accounting)"
            className="py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-DASA-orange transition-all"
          />
          <Button 
            onClick={handleAdd}
            disabled={actionLoading || !newName.trim()}
            className="bg-DASA-black hover:bg-DASA-orange text-white px-8 rounded-2xl transition-all h-auto"
          >
            {actionLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          </Button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-DASA-orange" size={32} />
            </div>
          ) : programs.length > 0 ? (
            <AnimatePresence>
              {programs.map((p) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all rounded-2xl group border border-transparent hover:border-gray-100"
                >
                  {editingId === p.id ? (
                    <div className="flex gap-2 grow">
                      <Input 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white border-DASA-orange/30 rounded-xl"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleUpdate(p.id)} className="bg-green-500 hover:bg-green-600 rounded-xl">
                        <Check size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="rounded-xl">
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-DASA-black">{p.name}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => {
                            setEditingId(p.id)
                            setEditName(p.name)
                          }}
                          className="hover:text-DASA-orange hover:bg-orange-50 rounded-xl"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDelete(p.id)}
                          className="hover:text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No programs added yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
