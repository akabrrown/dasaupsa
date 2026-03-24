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
        console.error('SERVER DATA ERROR (Announcements):', {
          message: error.message,
          details: error.details,
          code: error.code,
          hint: (error as any).hint
        })
      }
      return { data, error }
    } catch (err: any) {
      console.error('PANIC in getAnnouncements:', err.message || err)
      return { 
        data: null, 
        error: { 
          message: err.message || 'Panic', 
          details: 'Catch-all failure' 
        } 
      }
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
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('event_date', { ascending: false })
      
      if (error) {
        console.error('SERVER DATA ERROR (Activities):', {
          message: error.message,
          details: error.details,
          code: error.code,
          hint: (error as any).hint
        })
      }
      return { data, error }
    } catch (err: any) {
      console.error('PANIC in getActivities:', err.message || err)
      return { data: null, error: { message: err.message || 'Panic', details: err } }
    }
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
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('display_order', { ascending: true })
      
      if (error) {
        console.error('Error in getProfiles:', error.message, error.details)
      }
      return { data, error }
    } catch (err: any) {
      console.error('Panic in getProfiles:', err.message || err)
      return { data: null, error: { message: err.message || 'Panic', details: err } }
    }
  },
  ['profiles'],
  { tags: ['profiles'], revalidate: 3600 }
)

export const getAcademicResources = unstable_cache(
  async () => {
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('academic_resources')
        .select(`
          *,
          programs(name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error in getAcademicResources:', error.message, error.details)
      }
      return { data, error }
    } catch (err: any) {
      console.error('Panic in getAcademicResources:', err.message || err)
      return { data: null, error: { message: err.message || 'Panic', details: err } }
    }
  },
  ['academic_resources'],
  { tags: ['academic_resources'], revalidate: 3600 }
)

export const getTutorials = unstable_cache(
  async () => {
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('tutorials')
        .select(`
          *,
          programs(name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error in getTutorials:', error.message, error.details)
      }
      return { data, error }
    } catch (err: any) {
      console.error('Panic in getTutorials:', err.message || err)
      return { data: null, error: { message: err.message || 'Panic', details: err } }
    }
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
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error in getGalleryItems:', error.message, error.details)
      }
      return { data, error }
    } catch (err: any) {
      console.error('Panic in getGalleryItems:', err.message || err)
      return { data: null, error: { message: err.message || 'Panic', details: err } }
    }
  },
  ['gallery'],
  { tags: ['gallery'], revalidate: 3600 }
)

export const revalidateData = async (tag: string) => {
  revalidateTag(tag)
}
