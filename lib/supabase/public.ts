import { createClient } from '@supabase/supabase-js'

/**
 * A direct, public Supabase client for safe usage in static generation and caching.
 * This client does not use cookies and is safe to use in any server context.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient(supabaseUrl, supabaseKey)
}
