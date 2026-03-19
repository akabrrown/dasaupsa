import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseKey)

// Handle session recovery automatically
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
      // Clear any potential stale state if refresh fails
    }
  })
}




