'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Admin account creation requires service role permissions
export async function createAdminAccount(formData: { fullName: string, email: string, password?: string }) {
  const cookieStore = await cookies()
  
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  )

  try {
    // We use createUser with a password instead of just inviteUserByEmail
    // so that we can set a temporal password as requested.
    const tempPassword = formData.password || Math.random().toString(36).slice(-10) + '!'
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm so they can login with the temp password immediately
      user_metadata: { 
        full_name: formData.fullName,
        role: 'admin' 
      }
    })

    if (error) throw error

    // Note: We might want to send a custom email here or just tell the inviter the temp password.
    // For this implementation, we'll return the temp password to the UI.

    return { success: true, user: data.user, tempPassword }
  } catch (error: any) {
    console.error('Error creating admin account details:', error)
    // Supabase admin errors can be literal strings or objects
    const errorMessage = error.message || (typeof error === 'string' ? error : 'Database error creating new user');
    return { success: false, error: errorMessage }
  }
}

export async function getAdminUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data: profile, error: dbError } = await supabase
    .from('users')
    .select('must_change_password')
    .eq('id', user.id)
    .single()

  if (dbError) return null

  return { ...user, must_change_password: profile.must_change_password }
}

export async function getAdmins() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'admin')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admins:', error)
    return []
  }

  return data
}

export async function deleteAdmin(userId: string) {
  const cookieStore = await cookies()
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  try {
    const { count } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'admin')
    
    if (count && count <= 1) {
      throw new Error('Cannot delete the last administrator account.')
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting admin:', error)
    return { success: false, error: error.message }
  }
}

export async function changeAdminPassword(password: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  )

  try {
    // 1. Update the password in Auth
    const { error: authError } = await supabase.auth.updateUser({ password })
    if (authError) throw authError

    // 2. Clear the must_change_password flag in the database
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error: dbError } = await supabase
        .from('users')
        .update({ must_change_password: false })
        .eq('id', user.id)
      
      if (dbError) throw dbError
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error updating password:', error)
    return { success: false, error: error.message }
  }
}
