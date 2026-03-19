'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBookmark(resourceId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User must be logged in to bookmark resources')

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .single()

  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id)
    
    if (error) throw error
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: user.id, resource_id: resourceId }])
    
    if (error) throw error
  }

  revalidatePath('/academic-bank')
  return { success: true }
}

export async function getBookmarkedResources() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: null }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('resource_id')
    .eq('user_id', user.id)

  return { data: data?.map(b => b.resource_id) || [], error }
}
