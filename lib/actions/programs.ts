'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function getPrograms() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('name', { ascending: true })
  
  return { data, error }
}

export async function addProgram(name: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .insert([{ name }])
    .select()
    .single()
  
  if (!error) revalidatePath('/admin/academic-bank')
  return { data, error }
}

export async function updateProgram(id: string, name: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('programs')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (!error) revalidatePath('/admin/academic-bank')
  return { data, error }
}

export async function deleteProgram(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id)
  
  if (!error) {
    revalidatePath('/admin/academic-bank')
    revalidateTag('programs')
  }
  return { error }
}
