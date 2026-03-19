'use server'

import { cache } from 'react'
import { unstable_cache, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'

export const getAnnouncements = unstable_cache(
  async (limit = 10) => {
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('general_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error('Error in getAnnouncements:', error.message, error.code, error.details)
      }
      return { data, error }
    } catch (err: any) {
      console.error('Panic in getAnnouncements:', err.message)
      return { data: null, error: { message: err.message, details: 'Catch-all failure' } }
    }
  },
  ['announcements'],
  { tags: ['announcements'], revalidate: 3600 }
)

export const getAnnouncementById = cache(async (id: string) => {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('general_posts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error in getAnnouncementById:', JSON.stringify(error, null, 2))
  }
  return { data, error }
})

export const getActivities = unstable_cache(
  async () => {
    const supabase = await createPublicClient()
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('event_date', { ascending: false })
    
    if (error) {
      console.error('Error in getActivities:', JSON.stringify(error, null, 2))
    }
    return { data, error }
  },
  ['activities'],
  { tags: ['activities'], revalidate: 3600 }
)

export const getActivityById = cache(async (id: string) => {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error in getActivityById:', JSON.stringify(error, null, 2))
  }
  return { data, error }
})

export const getProfiles = unstable_cache(
  async () => {
    const supabase = await createPublicClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('Error in getProfiles:', JSON.stringify(error, null, 2))
    }
    return { data, error }
  },
  ['profiles'],
  { tags: ['profiles'], revalidate: 3600 }
)

export const getAcademicResources = unstable_cache(
  async () => {
    const supabase = await createPublicClient()
    const { data, error } = await supabase
      .from('academic_resources')
      .select(`
        *,
        programs(name)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error in getAcademicResources:', JSON.stringify(error, null, 2))
    }
    return { data, error }
  },
  ['academic_resources'],
  { tags: ['academic_resources'], revalidate: 3600 }
)

export const getTutorials = unstable_cache(
  async () => {
    const supabase = await createPublicClient()
    const { data, error } = await supabase
      .from('tutorials')
      .select(`
        *,
        programs(name)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error in getTutorials:', JSON.stringify(error, null, 2))
    }
    return { data, error }
  },
  ['tutorials'],
  { tags: ['tutorials'], revalidate: 3600 }
)

export const getTutorialById = cache(async (id: string) => {
  const supabase = await createPublicClient()
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error in getTutorialById:', JSON.stringify(error, null, 2))
  }
  return { data, error }
})

export const getGalleryItems = unstable_cache(
  async () => {
    const supabase = await createPublicClient()
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error in getGalleryItems:', JSON.stringify(error, null, 2))
    }
    return { data, error }
  },
  ['gallery'],
  { tags: ['gallery'], revalidate: 3600 }
)

export const revalidateData = async (tag: string) => {
  revalidateTag(tag)
}
